var Food = require('./mongolab').Food;
var User = require('./mongolab').User;
var fs = require("fs");
// authenticate
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

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

passport.authenticate('local', { failureFlash: 'Invalid username or password.' });
passport.authenticate('local', { successFlash: 'Welcome!' });
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
module.exports = function(app) {


  app.use(passport.initialize());
  app.use(passport.session());


	// user routes
	app.get('/users', function(req, res){
        var query = User.find({});
        query.exec(function(err, users){
            if(err) {res.send(err); return;}
            res.json(users);
			res.end();
        });
    });

	app.post('/users', function(req, res){
        var newUser = new User(req.body);

        newUser.save(function(err, resp){
            if(err) {
				console.log(JSON.stringify(req.body) + '  - req.body');
				res.send(err);
				return;}

            res.json(req.body);
			console.log('ok user ' + JSON.stringify(req.body.username) + ' saved');
        });
    });
	// food routes
	app.get('/foods', function(req, res){
        var query = Food.find({});
        query.exec(function(err, foods){
            if(err) {res.send(err); return;}
            console.log(res.headersSent);
			res.json(foods);
			res.end();
        });
    });
	app.post('/foods', function(req, res){
		console.log(req.body);
        var newfood = new Food(req.body);
        newfood.save(function(err){
            if(err) {res.send(err); return;}
            console.log(res.headersSent);
			res.json(req.body);
        });
    });



	// map.geojson routes
	app.get('/data', function(req, res) {
	var obj;
  	fs.readFile('./app/map.geojson', 'utf8', function (err, data) {
  		if (err) throw err;
  		obj = JSON.parse(data);
  		res.send(obj);
  		var now = new Date();
  		console.log('send map.geojson to HTTP get request ' + now);

	});
	});

	app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    console.log('passport auth OK');
	console.log('username ' + res.username);

	return res.redirect('/');
  });
};
