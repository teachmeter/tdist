const axios = require('axios');
const CLI = require('clui');
const uuid = require('uuid');
const chalk = require('chalk');

class Request {

  constructor(token) {
    if (token === '' || token === null) {
      throw 'Token not provided. Add API_TOKEN to the .env file';
    }
    this.restBase = 'https://api.todoist.com/rest/v1/';
    this.AuthToken = token;
  }

  async getTasks() {
    let tasks = [];
    await this._call(this.restBase + 'tasks', 'GET').then(
      (response) => {
        tasks = response.data;
      }
    );
    return tasks;
  }

  async createTask(Task) {
    console.clear();
    console.log(Task);
    let Spinner = CLI.Spinner;
    let waitingSpinner = new Spinner('Adding task...');
    
    waitingSpinner.start();
    let jsonBody = JSON.stringify(Task, (key, value) => {
      if (value !== null) return value;
    });
    await this._call(this.restBase + 'tasks', 'POST', jsonBody, {
      "X-Request-Id": uuid.v4()
    } ).then((response) => {
      console.log();
      console.log(chalk.green('Task created with id: ' + response.data.id));
      console.log(chalk.yellow(response.data.url));
      console.log();
      waitingSpinner.stop();
    }, (error) => {
      console.log(error);
    });

    
  }

  _call(url, method, params, headers) {
    let headersDeftault = {
      Authorization: 'Bearer ' + this.AuthToken,
      'Content-Type': 'application/json'
    };

    console.log({...headersDeftault, ...headers});
    return axios({
      url: url,
      method: method,
      headers: {...headersDeftault, ...headers},
      data: params
    })
  }


}

module.exports = Request;