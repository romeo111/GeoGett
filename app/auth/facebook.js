'use strict'

const User = require('../model/user');
const Food = require('../model/food');


const Q = require('q');

module.exports = Q.async(function *(sessionUser, token, profile) {
  let user = yield User.findOne({'facebook.id' : profile.id});

  if (!user) {
      let options = {
          id    : profile.id,
          token : token,
          name  : profile.displayName || profile.username,
          image : profile.photos ? profile.photos[0].value : ''
      }

      if (!sessionUser) {
          user = yield User.create({
            email: null,
            facebook : options
          });
      } else {
        let currentUser = yield User.findById(sessionUser._id);
        currentUser.facebook = options;

        user = yield currentUser.save();

      }
  }

  return user;
});
