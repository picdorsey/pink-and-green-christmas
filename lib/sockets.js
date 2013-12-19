var sio  = require('socket.io'),
    Wish = require('../models/wish'),
    sanitize = require('../util/sanitize'),
    gravatar = require('gravatar');

module.exports.listen = function(app){
    var io = sio.listen(app);

    io.configure(function (){
        io.set('log level', 0);
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 10);
        io.set('authorization', function (handshakeData, callback) {
            callback(null, true);
        });
    });

    io.sockets.on('connection', function (socket) {
        var address = socket.handshake.address;

/*        var wish = new Wish({
                        name: 'Tyler',
                        message: 'Does it work',
                        email: 'tylodonnell@gmail.com',
                        gravatar: gravatar.url(sanitize('tylodonnell@gmail.com'), {s: '200', r: 'pg', d: 'identicon'}),
                        ip: address.address
                      });

        wish.save(function(err){
                  if(err) throw err;
        });*/


        socket.on('add', function(data){

            if(data.name.length < 160 && data.message.length < 160 && data.email.length < 160) {
                var wish = new Wish({
                  name: sanitize(data.name),
                  message: sanitize(data.message),
                  email: sanitize(data.email),
                  gravatar: gravatar.url(sanitize(data.email), {s: '200', r: 'pg', d: '404'}),
                  ip: address.address,
                  rand: Math.floor(Math.random() * 100)
                });


                console.log(wish);

                wish.save(function(err){
                  if(err) throw err;
                  socket.emit('added', wish);
                  socket.broadcast.emit('added', wish);
                });
            }

        });

        socket.on('disconnect', function(){
        });

    });

    return io;
}