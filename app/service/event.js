'use strict';
const Service = require('egg').Service;
const _ = require('lodash');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();
class eventService extends Service {
  Emitter() {
    return myEmitter;
  }
}

module.exports = eventService;
