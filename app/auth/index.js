'use strict'

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
// my local
const LocalStrategy = require('passport-local').Strategy;

  passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) { return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  }
));
// my local
const Twitter  = require('./twitter');
const Facebook = require('./facebook');
const Vkontakte = require('./vkontakte');

const callBackPath = process.env.DOMAIN + 'api/auth/';

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
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


module.exports = passport;
