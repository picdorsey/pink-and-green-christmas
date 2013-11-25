var express = require('express'),
  http = require('http'),
  path = require('path'),
  io = require('socket.io'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  passportLocalMongoose = require('passport-local-mongoose'),
  Wish = require('./models/wish.js'),
  Account = require('./models/account');

var app = express();

// configuration
app.configure(function(){
  app.engine('.html', require('ejs').__express);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'thisismysupersecret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use('/assets', express.static(path.join(__dirname, 'public')));
});

// connect to DB
mongoose.connect('mongodb://localhost/christmas', function(err) {
    if (err) throw err;
});

// configure passport
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// start the server
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// sockets
var sio = require('./lib/sockets').listen(server);

// routes
require('./lib/routes')(app);