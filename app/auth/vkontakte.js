'use strict'

const User = require('../model/user');
const Q = require('q');

module.exports = Q.async(function *(sessionUser, token, profile) {
  let user = yield User.findOne({'vkontakte.id' : profile.id});

  if (!user) {
      let options = {
        id    : profile.id,
        token : token,
        name  : profile._json.first_name + ' ' + profile._json.last_name,
        image : profile._json.photo || ''
      }

      if (!sessionUser) {
          user = yield User.create({
            email: null,
            vkontakte : options
          });
      } else {
        let currentUser = yield User.findById(sessionUser._id);
        currentUser.vkontakte = options;

        user = yield currentUser.save();
      }
  }

  return user;
});
