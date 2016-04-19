'use strict'

const db = require('../service/database');
const Schema = db.Schema;
//const LocationSchema = require('./location');
const DateIntervalSchema = require('./DateInterval');
const FoodSchema = require('./food');


const UserSchema = new Schema({
  email     : String,
  phone     : String,
  connected : { type: Date, default : Date.now },
  created   : { type: Date, default: Date.now },
  foods: [FoodSchema],
  position: {type: [Number], index: '2d'},

  twitter : {
    id    : String,
    token : String,
    name  : String,
    image : String
  },
  facebook : {
    id     : String,
    token  : String,
    name   : String,
    image  : String
  },
  vkontakte : {
    id    : String,
    token : String,
    name  : String,
    image : String
  }
});
UserSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});
const User = db.model('User', UserSchema);
module.exports = User;
