var passport = require('passport'),
    Wish = require('../models/wish');

module.exports = function (app) {
    app.get('/', function(req, res){
      Wish.find({}, function(err, wishes){
            res.render(
            'home', { title: '(ALPHA)Picdorsey Christmas', wishes: wishes });
        })
    });

    app.get('/login', function(req, res) {
        res.render('login', { title: 'Login | (ALPHA)Picdorsey Christmas', message: req.flash('error') });
    });

    app.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: 'Invalid username or password.' }), function(req, res) {
        res.redirect('/admin');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/admin');
    });

    app.get('/admin', ensureAuthenticated, function(req, res) {
        Wish.find({}, function(err, wishes){
          res.render('admin', { title: 'Admin | (ALPHA)Picdorsey Christma' , wishes: wishes });
        })
    });
};

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else
        res.redirect('/login')
}