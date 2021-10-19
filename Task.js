'use strict';

class Task {
	#id;
	#stepsLeft;
	#status = "idle";

	constructor(id, name, steps, dependenciesIds) {
		// sanity checks
		if (isNaN(id) || id <= 0)
			throw "Task error: id must be an integer > 0";
		if (isNaN(steps) || steps <= 0)
			throw "Task error: steps must be an integer > 0";
		if (!dependenciesIds instanceof Array)
			throw "Task error: dependenciesIds must be an array";

		this.#id = id;
		this.name = name;
		this.#stepsLeft = steps;
		this.dependenciesIds = dependenciesIds;
	}

	getStatus() {
		return this.#status;
	}

	start(id) {
		this.#status = "running";
	}

	getId() {
		return this.#id;
	}

	finish() {
		this.#status = "finished";
	}

	nextStep() {
		if (this.#stepsLeft >= 1) return --this.#stepsLeft;
		else return 0;
	}

	getRemainingSteps() {
		return this.#stepsLeft;
	}
}

module.exports = Task;