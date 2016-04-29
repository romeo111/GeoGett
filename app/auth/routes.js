'use strict'

const User = require('../model/user');
const Q    = require('q');

const emailRe =/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const setupEmail = Q.async(function *(id, email) {
  let user = yield User.findById(id);

  user.email = email;
  user = yield user.save();

  return user;
});

module.exports = function(app, passport) {

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

    app.get('/sign-out', function (req, res) {
       req.logout();
       res.redirect('/');
   });


} // end exports
