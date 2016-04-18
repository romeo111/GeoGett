'use strict'

const mongoose = require('mongoose');

mongoose.Promise = require('q').Promise;
mongoose.connect(process.env.MONGO_URL);

module.exports = mongoose;
