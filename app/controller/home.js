'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');
class HomeController extends Controller {
  async index() {
    const res = fs.readFileSync(path.join(__dirname, '../public', '/index.html'));
    this.ctx.response.append('content-type', 'text/html');
    this.ctx.response.body = res;
  }
}

module.exports = HomeController;
