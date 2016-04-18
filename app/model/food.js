'use strict'

const db = require('../service/database');
const Schema = db.Schema;
const LocationSchema = require('./location');
const DateIntervalSchema = require('./DateInterval');

const FoodSchema = new Schema({

  name: {type: String, required: true},
  photo: String,
  location: [LocationSchema],
  livetime: [DateIntervalSchema],
  living:  Boolean,
  weight: Number,
  quantity: Number,
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}

  });
  FoodSchema.pre('save', function(next){
      now = new Date();
      this.updated_at = now;
      if(!this.created_at) {
          this.created_at = now
      }
      next();
  });

const Food = db.model('Food', FoodSchema);
module.exports = Food;
