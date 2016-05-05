'use strict'

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
const Twitter  = require('./twitter');
const Facebook = require('./facebook');
const Vkontakte = require('./vkontakte');

const User = require('../model/user');
const Food = require('../model/food');
const callBackPath = process.env.DOMAIN + 'api/auth/';

var tokens = {}

function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}

function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  return fn();
}

function issueToken(user, done) {
  var token = utils.randomString(64);
  console.log(user.id + " user id");
  saveRememberMeToken(token, user.id, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}


passport.use(new LocalStrategy({
   usernameField: 'phone'},


  function(username, password, done) {
      process.nextTick(function () {
    User.findOne({ phone: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  });
}
));

passport.use(new RememberMeStrategy(
  function(token, done) {
    consumeRememberMeToken(token, function(err, uid) {
      if (err) { return done(err); }
      if (!uid) {
        return done(null, false); }

      findById(uid, function(err, user) {
        if (err) { return done(err); }
        if (!user) {  return done(null, false); }
        return done(null, user);
      });
    });
  },
  issueToken
));

passport.use(
  new FacebookStrategy({
      clientID: process.env.FACEBOOK_APPID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: callBackPath + 'facebook/callback',
      passReqToCallback : true
    },
    function(req, accessToken, refreshToken, profile, done) {
      Facebook(req.user, accessToken, profile).then(function(user) {
        done(null, user)
      }).catch(function(e) {
        done('Err')
      });
    }
));

passport.use(
  new TwitterStrategy({
      consumerKey: process.env.TWITTER_KEY,
      consumerSecret: process.env.TWITTER_SECRET,
      callbackURL: callBackPath + 'twitter/callback',
      passReqToCallback : true
    },
    function (req, accessToken, refreshToken, profile, done) {
      Twitter(req.user, accessToken, profile).then(function(user) {
        done(null, user)
      }).catch(function(e) {
        done('Err')
      });
    }
));

passport.use(
  new VKontakteStrategy({
      clientID: process.env.VK_APPID,
      clientSecret: process.env.VK_SECRET,
      callbackURL: callBackPath + 'vk/callback',
      passReqToCallback : true
    },
    function(req, accessToken, refreshToken, profile, done) {
      Vkontakte(req.user, accessToken, profile).then(function(user) {
        done(null, user)
      }).catch(function(e) {
        done('Err')
      });
    }
));



passport.serializeUser(function(user, done) {
  console.log('start serializeUser user id' + user.id);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('start deserializeUser '+ id);
  User.findById(id, function (err, user) {
    if(err) { console.log('eer in userfind by id'); throw err}
    console.log(user.username);
    done(err, user);

  });
});


module.exports = passport;
