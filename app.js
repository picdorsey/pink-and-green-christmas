var express = require('express')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectID = Schema.ObjectId
  , Wish = require('./models/wish.js').init(Schema, mongoose)
  , app = express();

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

// connect to DB
mongoose.connect('mongodb://localhost/christmas', function(err) {
    if (err) throw err;
});

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

// routes
app.get('/', function(req, res){
  Wish.find({}, function(err, wishes){
      res.render(
        'home', 
        { 
          title: '(ALPHA)Picdorsey Christmas',
          wishes: wishes
        }
      );
    })
});