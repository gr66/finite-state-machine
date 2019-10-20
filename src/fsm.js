class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) throw new Error();
        this.config = config;
        this.state = config.initial;
        this.statesHistory = [];
        this.statesHistoryOver = [];
        this.stepBack = false;
        this.stepForward = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
       return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.config.states[state]) throw new Error("Wrong state!");
        if (this.stepBack) {
            this.stepBack = false;
        } else if (this.stepForward) {
            this.stepForward = false;
        } else {
            this.statesHistory.push(this.state);
            this.statesHistoryOver = [];
        }
        this.state = state;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let newState = this.config.states[this.state].transitions[event];
        this.changeState(newState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.state = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event = '') {
        if (event == '') {
            return Object.keys(this.config.states);
        }

        let res = Object.keys(this.config.states).filter((key) => {
            return Object.keys(this.config.states[key].transitions).includes(event);
        });

        return res;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        let prevState = this.statesHistory.pop();
        if (prevState) {
            this.stepBack = true;
            this.statesHistoryOver.unshift(this.state);
            this.changeState(prevState);
        }
        return !!prevState;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        let nextState = this.statesHistoryOver.shift();
        if (nextState) {
            this.stepForward = true;
            this.changeState(nextState);
        }
        return !!nextState;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.statesHistory = [];
        this.statesHistoryOver = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
