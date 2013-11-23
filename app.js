var express = require('express')
  , http = require('http')
  , path = require('path')
  , Wish = require('./models/wish.js').Wish
  , io = require('socket.io');

var app = express();

app.configure(function(){
  app.engine('.html', require('ejs').__express);
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use('/assets', express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


var sio = io.listen(server);
var wish = new Wish('localhost', 27017);

exports.wish = Wish;

// Sockets
sio.configure(function (){
  sio.set('log level', 0);
  sio.set('authorization', function (handshakeData, callback) {
   callback(null, true);
  });
});

sio.sockets.on('connection', function (socket) {
  
  socket.on('add', function(data){
    var wishy = ({
      name: data.name,
      message: data.message,
      email: data.email
    });

    wish.save(wishy, function(err){
      if(err) throw err;
      socket.emit('added', wishy);
      socket.broadcast.emit('added', wishy);
    });
  });

  socket.on('disconnect', function(){
  });

});

// routes
app.get('/', function(req, res){
    wish.findAll( function(error,docs){
      res.render(
        'home', 
        { 
          title: 'Blog',
          wishes: docs
        }
      );
    })
});

