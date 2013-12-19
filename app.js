var express = require('express'),
    http = require('http'),
    path = require('path'),
    io = require('socket.io'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    LocalStrategy = require('passport-local').Strategy,
    passportLocalMongoose = require('passport-local-mongoose'),
    Wish = require('./models/wish.js'),
    Account = require('./models/account');

var app = express();
var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/mydb'; 

// configuration
app.configure(function(){
    app.engine('.html', require('ejs').__express);
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    //app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.cookieParser('my secret here'));
    app.use(flash());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use('/assets', express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// connect to DB
mongoose.connect(mongoUri, function(err) {
    if (err) throw err;
});

// configure passport
passport.use(new LocalStrategy(Account.authenticate()));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// start the server
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port') + " in " + app.settings.env + " mode");
});

// sockets
require('./lib/sockets').listen(server);

// routes
require('./lib/routes')(app);