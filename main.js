'use strict';

const Task = require("./Task");
const Scheduler = require("./Scheduler");

const job = require('./jobs/job1.json');
// const job = require('./jobs/job2.json');

var sch = new Scheduler();

for (const t of job['tasks']) {
	let task = new Task(t['id'], t['name'], t['steps'], t['dependsOn']);
	sch.addTask(task);
}

console.log();
sch.runScheduler();
