const Request = require('./request');
const chalk = require('chalk');
const log = console.log;
const moment = require('moment');
const minimist = require('minimist');
const Task = require('./Task');
const Inquirer = require('inquirer');

log();

class Todoist {
  constructor() {
    this.API_TOKEN = process.env.API_TOKEN ? process.env.API_TOKEN : null;

    this.tasks = [];

    try {
      this.request = new Request(this.API_TOKEN);
    } catch (e) {
      log(chalk.red(e));
      process.exit(9);
    }
  }

  async tasksList() {
    this.tasks = await this.request.getTasks();
    this.tasks = [...this.tasks].sort((a,b) => a.project_id > b.project_id);


    this.tasks.forEach((task, key) => {
      let taskContent = task.content;
      let taskId = task.id;
      // log(task);

      log(taskContent + chalk.yellow(` (${taskId}) `) + chalk.red(`[${task.project_id}]`) );
    })

  }

  async tasksListCurrent() {
    this.tasks = await this.request.getTasks();

    const today = moment();

    this.tasks = this.tasks.filter((item, key) => {
      return item.due !== undefined;
    });

    this.tasks = this.tasks.filter((item, key) => {
      let taskDue = moment(item.due.date);
      return taskDue.isSameOrBefore(today);
    });

    this.tasks = [...this.tasks].sort((a,b) => {
      let dateA = moment(a.due.date);
      let dateB = moment(b.due.date);
      return dateA.isAfter(dateB);
    } );

    // console.log(this.tasks);
    this.tasks.forEach((task, key) => {
      let isOverdue = moment(task.due.date).isBefore(moment().subtract('1', 'day'));
      let overdueMessage = isOverdue ? chalk.red('(!) ') : '';
      let dueDateMessage = isOverdue ? chalk.yellow(` Due: ${task.due.string}`) : '';
      log(overdueMessage + `${task.content}` + dueDateMessage );
    })

  }
  
  tasksAdd() {
    const args = minimist(process.argv.slice(2));

    if (args.content === undefined || args.content === true) {
      throw 'You need to provide the message with --content parameter';
    }

    let content = args.content.toString();
    console.log(args);
    console.log('adding task');

    let task = new Task(content, args);

    let addTaskQuestion = {
      type: 'confirm',
      name: 'taskAddConfirmed',
      message: () => {
        console.log();
        console.log(`Content: "${task.content}" Priority: ${task.priority}`);
        console.log();

        return 'Do you want to add this task?'
      },
      default: true,
    };

    Inquirer.prompt([
      addTaskQuestion
    ]).then(answers => {
      if (answers.taskAddConfirmed === true) {
        this.request.createTask(task);
      }
    })

  }

}

module.exports = Todoist;