var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http').Server(app);
var path = require('path');
var cookieParser = require('cookie-parser');

require('dotenv').load({silent: false});
var passport = require('./app/auth/index');


app.use(session({ secret: 'p2pgeo',
  saveUninitialized: true,
  resave : true,
  cookie: {
     secure: false,
     maxAge: 22909943600
   }
 }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.set('view engine', 'jade');
app.use(function(req, res, next) {
  res.setHeader('Content-type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,HEAD,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-HTTP-Method-Override');
	next();
});

require('./app/router/routes.js')(app);
require('./app/auth/routes')(app, passport);


app.get('/', function(req, res) {
  res.send(JSON.stringify(req.session.passport)).end();
});

app.all("/*", function(req, res, next) {

  if(typeof req.cookies['connect.sid'] !== 'undefined') {
      console.log(req.cookies['connect.sid']);
  }
  console.log('no reqcookiesconnect.sid');
  next(); // Call the next middleware
});

app.use(passport.authenticate('remember-me'));

app.listen(process.env.PORT, function() {
  console.log('GeoGett started on : ' + process.env.DOMAIN);
});
