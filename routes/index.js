var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();
var blockController = require('../block/block.controller');


router.get('/', function (req, res) {
    res.render('landing', { title : "Blockchain for Babies" });
});

router.get('/home', function (req, res) {
   if (req.user && req.user.username=="admin") {
     res.redirect('/adminhome');
     return;
   }
   res.render('home', { title : "Blockchain for Babies", user: req.user });
});

router.get('/adminhome', function (req, res) {
    res.render('adminhome', { title : "Blockchain for Babies", user: req.user });
});

router.get('/signup', function(req, res) {
    res.render('signup', {  });
});

router.post('/signup', function(req, res) {
    console.log(req.body);
    if(req.body.password !== req.body.password2) {
        return res.render('signup', { error : "Passwords don't match" });
    }
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            return res.render('signup', { error : err.message });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/home');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

router.get('/createparent', function(req, res, next) {
  res.render('createparent', {user: req.user});
});

router.post('/createparent', function(req, res) {
    console.log(req.body);
    if(req.body.password !== req.body.password2) {
        return res.render('createparent', { error : "Passwords don't match" });
    }
    var pair = blockController.createUser();
    var user = new User({
        username: req.body.username,
        public: pair.public,
        private: pair.private,
        admin: false
    });
    User.register(user, req.body.password, function(err, user) {
        if (err) {
            return res.render('createparent', { error : err.message, user: req.username });
        }
        res.redirect('/adminhome');
    });
});

router.get('/createbaby', function(req, res, next) {
  res.render('createbaby', {user: req.user});
});

router.post('/createbaby', function(req, res) {
    console.log(req.body);
    var pair = blockController.createUser();
    var user = new User({
        username: req.body.username,
        public: pair.public,
        private: pair.private,
        admin: false
    });
    User.register(new User({ username : req.body.username }), "1", function(err, user) {
        if (err) {
            return res.render('createbaby', { error : err.message });
        }
        res.redirect('/adminhome');
    });
});



router.get('/configure', function(req, res, next) {
  res.render('configure', {user: req.user});
});

router.post('/', function(req, res, next) {
  res.render('configure', {user: req.user});
});

module.exports = router;
