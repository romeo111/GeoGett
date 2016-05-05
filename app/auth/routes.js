'use strict'

const User = require('../model/user');
const Q    = require('q');
const utils = require('./utils');
const emailRe =/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const setupEmail = Q.async(function *(id, email) {
  let user = yield User.findById(id);

  user.email = email;
  user = yield user.save();

  return user;
});

var tokens = {}

function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
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


module.exports = function(app, passport) {

  app.get('/login', function(req, res, next){
    if (!req.user) {
      console.log('no user for gett');
      return next();
      res.send('no req user');
    }
    console.log(" AutoLogin for GET req: " + req.user.username + " successful.");
    res.send(JSON.stringify(req.user));
});

  app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
     function(req, res, next) {
        if (!req.body.remember_me) { return next(); }
        issueToken(req.user, function(err, token) {
          if (err) { return next(err); }
          res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
          return next();
    });
      },
       function(req, res) {
        console.log("Login for: " + req.user.username + " successful.");
        res.send(JSON.stringify(req.user));
        }

  );



  app.post('/api/user/me', function(req, res) {
    if (!req.body.email || !emailRe.test(req.body.email)) {
      return res.status(403).send('Invalid email').end();
    }

    if (req.user) {
        setupEmail(req.user._id, req.body.email).then(function(user) {
          req.logIn(user, function(error) {});
          return res.send(JSON.stringify(user)).end();
        }).catch(function(e) {
          console.err(e);
          res.status(500).end();
        });
    } else {
      res.send({error : 'Unauthorized'}),end();
    }
  });

  app.get('/api/user/me', function (req, res) {
    if (!req.user) {
      return res.send('no user').end();
    }

    if (!req.user.email) {
      return res.send({error : 'provide-email'}).end();
    }

    res.send(JSON.stringify(req.user));
  });

  app.get('/api/auth/facebook',
    passport.authenticate('facebook'),
    function(req, res){});

  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/api/auth/twitter',
    passport.authenticate('twitter'),
    function(req, res){});

  app.get('/api/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/api/auth/vk',
    passport.authenticate('vkontakte'),
    function(req, res){});

  app.get('/api/auth/vk/callback',
    passport.authenticate('vkontakte', { failureRedirect: '/' }),
    function(req, res) {
      res.redirect('/');
    });

    app.get('/logout', function (req, res) {
       res.clearCookie('remember_me');
       req.logout();
      console.log("logout");

   });

   function ensureAuthenticated(req, res, next) {
     if (req.isAuthenticated()) { return next(); }
     res.redirect('/login')
   }
} // end exports
