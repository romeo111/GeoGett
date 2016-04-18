'use strict'

const db = require('../service/database');
const Schema = db.Schema;

const DateIntervalSchema = new Schema({

  start: {type: Date, required: true},
  end: {type: Date, required: true}

});

module.exports = db.model('DateInterval', DateIntervalSchema);
