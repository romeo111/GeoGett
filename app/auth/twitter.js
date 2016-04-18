'use strict'

const User = require('../model/user');
const Q = require('q');

module.exports = Q.async(function *(sessionUser, token, profile) {
  let user = yield User.findOne({'twitter.id' : profile.id});

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
            twitter : options
          });
      } else {
        let currentUser = yield User.findById(sessionUser._id);
        currentUser.twitter = options;

        user = yield currentUser.save();
      }
  }

  return user;
});
