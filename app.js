var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var http = require('http');
var mongodb = require('mongodb');
var monk = require('monk');
var mongoose = require('mongoose');
var auth = require('./auth');
var UserModel = require('./user-model');

var connectionString = 'localhost:27017',
    connection = mongoose.createConnection(connectionString),
    userModel = new userModel(connection);

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'secret' }));

app.use(function(req, res, next) {
  req.userModel = userModel;

  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;

  res.locals.message = '';
  if (err) res.locals.message = err;
  if (msg) res.locals.message = msg;

  next();
});

app.get('/', auth.showHome);
app.get('/signup', auth.showSignUp);
app.post('/signup', auth.userExists, auth.signUp);
app.get('/login', auth.showLogin);
app.post('/login', auth.login);
app.get('/logout', auth.logout);
app.get('/profile', auth.requiredAuthentication, auth.showProfile);

var listener = app.listen(3000, function() {
  console.log('Listening on port ' + listener.address().port);
});
