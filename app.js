var express = require('express')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io')
  , passport = require('passport')
  , flash = require('connect-flash')
  , LocalStrategy = require('passport-local').Strategy
  , hash = require('./util/hash.js')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectID = Schema.ObjectId
  , Wish = require('./models/wish.js').init(Schema, mongoose)
  , User = require('./models/user.js').init(Schema, mongoose)
  , app = express();

app.configure(function(){
  app.engine('.html', require('ejs').__express);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.cookieParser());
  app.use(flash());
  app.use(express.session({ secret: 'thisismysupersecret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use('/assets', express.static(path.join(__dirname, 'public')));
});

// connect to DB
mongoose.connect('mongodb://localhost/christmas', function(err) {
    if (err) throw err;
});

// Passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      hash( password, user.salt, function (err, hash) {
        if (err) { return done(err); }
        if (hash == user.password) return done(null, user);
        //done(null, false, { message: 'Incorrect password.' });
      });
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

// start server
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var sio = io.listen(server);

// sockets
sio.configure(function (){
  sio.set('log level', 0);
  sio.set('authorization', function (handshakeData, callback) {
   callback(null, true);
  });
});

sio.sockets.on('connection', function (socket) {
  
  socket.on('add', function(data){
    var wish = new Wish({
      name: data.name,
      message: data.message,
      email: data.email
    });

    console.log(wish);

    wish.save(function(err){
      if(err) throw err;
      socket.emit('added', wish);
      socket.broadcast.emit('added', wish);
    });
  });

  socket.on('disconnect', function(){
  });

});

  hash('password', function(err, salt, hash){
          if(err) throw err;
          // if (err) return done(err);
          User.create({
                  username : 'admin',
                  salt : salt,
                  password : hash
          }, function(err, user){
                  if(err) throw err;
          });
  });

// routes
app.get('/', function(req, res){
  Wish.find({}, function(err, wishes){
      res.render(
      'home', 
      { 
        title: '(ALPHA)Picdorsey Christmas',
        wishes: wishes
      });
    })
});

app.get('/login', function(req, res){
  res.render(
  'login', 
  { 
    title: 'Login | (ALPHA)Picdorsey Christmas',
  });
});

app.post('/login',
  passport.authenticate('local', 
  { 
   successRedirect: '/',
   failureRedirect: '/login',
   failureFlash: true 
  })
);

app.get("/forbidden", function(req, res){ 
  if(req.isAuthenticated()){
    res.render('forbidden', { title: 'pass'}); 
  }else{
    res.render('forbidden', { title: 'fail'}); 
  }
});