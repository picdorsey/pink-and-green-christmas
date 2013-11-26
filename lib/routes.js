var passport = require('passport'),
    Wish = require('../models/wish');

module.exports = function (app) {
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

    app.get('/login', function(req, res) {
        res.render('login', { user : req.user });
    });

    app.post('/login', passport.authenticate('local'), function(req, res) {
        res.redirect('/');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};