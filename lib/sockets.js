var sio  = require('socket.io'),
    passport = require('passport'),
    Wish = require('../models/wish'),
    Account = require('../models/account');

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

    return io;
}