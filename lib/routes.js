var passport = require('passport'),
    Wish = require('../models/wish');
    Account = require('../models/account');

module.exports = function (app) {
    app.get('/', function(req, res){
      Wish.find({}, function(err, wishes){
            res.render(
            'home', { title: 'Home', wishes: wishes });
        })
    });

    app.get('/login', function(req, res) {
        res.render('login', { title: 'Login', message: req.flash('error') });
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
          res.render('admin/index', { title: 'Admin' , wishes: wishes });
        })
    });

    app.get('/admin/add', ensureAuthenticated, function(req, res) {
        res.render('admin/add', { title: 'Add Admin', message: req.flash('message') });
    });

    app.post('/admin/add', ensureAuthenticated, function(req, res) {
        Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
            if(err) throw err;
            req.flash('message', 'Success!')
            res.redirect('/admin/add');
        });
    });

    app.post('/admin/delete', ensureAuthenticated, function(req, res) {
        Wish.findById(req.body.id, function(err, wish){
            if(wish != null) {
                wish.remove(function(err){
                    if(err) throw err;
                });
            }
            res.redirect('/admin');
        });
    });
};

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else
        res.redirect('/login')
}