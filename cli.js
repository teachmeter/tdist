#!/usr/bin/env node
require('dotenv').config();
const chalk = require('chalk');
const minimist = require('minimist');
const cliArgs = minimist(process.argv.slice(2));

const TodoistClass = require('./src/todoist');
const Todoist = new TodoistClass();

try {
  if (cliArgs._[0] === 'tasks') {
    const subAction =  cliArgs._[1];

    switch (subAction) {
      case 'list':
        Todoist.tasksList();
        break;
      case 'current':
        Todoist.tasksListCurrent();
        break;
      case 'add':
        Todoist.tasksAdd();
        break;
      default:
        Todoist.tasksList();
        break;
    }
  }
} catch (e) {
  console.log(chalk.red(`${e}`));
  process.exit(9);
}




//

//

//
// Todoist.getTasksList();