var sio  = require('socket.io'),
    Wish = require('../models/wish'),
    sanitize = require('../util/sanitize');

module.exports.listen = function(app){
    var io = sio.listen(app);

    io.configure(function (){
      io.set('log level', 0);
      io.set('authorization', function (handshakeData, callback) {
       callback(null, true);
      });
    });

    io.sockets.on('connection', function (socket) {
      
      socket.on('add', function(data){

        var wish = new Wish({
          name: sanitize(data.name),
          message: sanitize(data.message),
          email: sanitize(data.email)
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

    return io;
}