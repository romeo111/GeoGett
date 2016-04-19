'use strict'

const db = require('../service/database');
const Schema = db.Schema;

const LocationSchema = new Schema({
  location: { type: [], index: '2dsphere', sparse: true },
	city: String,
  name: String,
  address: String

  });

  LocationSchema.pre('save', function (next) {
    var value = that.get('location');

    if (value === null) return next();
    if (value === undefined) return next();
    if (!Array.isArray(value)) return next(new Error('Coordinates must be an array'));
    if (value.length === 0) return that.set(path, undefined);
    if (value.length !== 4) return next(new Error('Coordinates should be of length 4'))

    next();
  });


const Location = db.model('Location', LocationSchema);
module.exports = Location;
