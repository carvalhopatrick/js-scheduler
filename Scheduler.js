'use strict';
const readline = require('readline');

class Scheduler {
	tasks = Object.create(null);	// map of all tasks added to scheduler (hashed by id)
	runningIds = []; 				// ids of the currently running tasks
	queueIds = [];					// ids of the tasks awaiting to be started

	// add a task to queue
	addTask(_task) {
		try {
			const id = _task.getId();
			this.tasks[id] = _task;
			this.queueIds.push(id);
			console.log("A | " + id + " added to queue!\tNumber of steps: " + _task.getRemainingSteps());
		} catch (error) {
			throw "addTask error: " + error;
		}

	}

	// starts a task from queue
	startTask(id) {
		try {
			const _task = this.tasks[id];

			// remove task from queue
			const index = this.queueIds.findIndex(el => (el === id));
			this.queueIds.splice(index, 1);

			// start the task
			_task.start(id);
			this.runningIds.push(id);
			console.log("S | STARTED:\t\t" + _task.name + "\t\tid: " + id + "\t\tSteps: " + _task.getRemainingSteps());

			return 1;

		} catch (error) {
			throw "startTask error: id " + id + " couldn't START: " + error;
		}
	}

	// finish one of the running tasks
	finishTask(id) {
		try {
			const _task = this.tasks[id];

			const index = this.runningIds.findIndex(el => (el === id));
			this.runningIds.splice(index, 1);

			_task.finish();
			console.log("F | FINISHED:\t\t" + _task.name + "\t\tid: " + id + "");

			return 1;

		} catch (error) {
			throw "finishTask error: id " + id + " couldn't FINISH: " + error;
		}

	}

	// check all the queue to see if any new task can be started
	checkQueue() {
		// array of tasks to be started 
		// (to avoid mutating queueIds while iterating on it, by calling startTask())
		let toStart = [];

		try {
			// checks each of queue task
			for (const id of this.queueIds) {
				const _task = this.tasks[id];

				// checks task dependencies
				let canStart = _task.dependenciesIds.every(dependencyId => {	//.every returns true to empty arrays
					const _dependency = this.tasks[dependencyId];

					if ("finished" !== _dependency.getStatus())
						return false;	 // dependency haven't finished - task cannot be started
					else
						return true;
				});

				// add to toStart if task can be started
				if (canStart) toStart.push(id);
			}

		} catch (error) {
			throw "checkQueue error: " + error;
		}

		// start tasks added to toStart
		toStart.forEach(id => {
			const _task = this.tasks[id];
			if (!this.startTask(id))
				console.log("Q | ERROR: couldn't start task id " + id);
		});
	}

	// run tasks that are in runningIds[]
	runTasks() {
		// array of tasks to be finished 
		// (to avoid mutating runningIds while iterating on it, by calling finishTask())
		let toFinish = [];

		try {
			for (const id of this.runningIds) {
				const _task = this.tasks[id];

				const remainingSteps = _task.nextStep();
				console.log("T | RUNNING: \t\t" + _task.name + "\t\tid: " + id + "\t\tRemaining: " + remainingSteps);

				if (remainingSteps == 0) toFinish.push(id);			// task should be finished
			}
		} catch (error) {
			throw "runTasks error: " + error;
		}

		// finish tasks added to toFinish
		toFinish.forEach(id => {
			if (!this.finishTask(id))
				console.log("T | ERROR: Couldn't finish " + id);
		});
	}

	// wait for user input to continue
	waitForInput(str) {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		return new Promise(resolve => rl.question(str, ans => {
			rl.close();
			resolve(ans);
		}))
	}

	// run scheduler
	async runScheduler() {
		while (this.queueIds.length > 0 || this.runningIds.length > 0) {

			console.log("R | runningIds:\t\t" + this.runningIds);
			console.log("R | queueIds:\t\t" + this.queueIds);
			await this.waitForInput('\npress any key to advance tasks...\n');

			this.runTasks();
			console.log('');

			this.checkQueue();
			console.log('');
		}
	}

}

module.exports = Scheduler;
