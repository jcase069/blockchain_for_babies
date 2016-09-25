var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();
var blockController = require('../block/block.controller');
var permissionController = require('../controllers/PermissionController');
var userController = require('../controllers/UserController');


router.get('/', function (req, res) {
    res.render('landing', { title : "Blockchain for Babies" });
});

router.get('/home', function (req, res) {
   if (req.user && req.user.username=="admin") {
     res.redirect('/adminhome');
     return;
   }
   permissionController.listWhoCanViewMyRecords(req.user, function(err, receiverArray) {
     if (err) {
       return res.render('home', { error : err.message });
     }
     permissionController.listWhoseRecordsICanView(req.user, function(err, holderArray) {
       if (err) {
         return res.render('home', { error : err.message });
       }
       res.render('home', {
         title : "Blockchain for Babies",
         user: req.user,
         holders: holderArray,
         receivers: receiverArray
       });
     });
   });
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
    if(req.body.password !== req.body.password2) {
        return res.render('createparent', { error : "Passwords don't match" });
    }
    console.log('creating user, '+JSON.stringify(req.body));
    var user = _createUserFromBody(req.body);
    User.register(user, req.body.password, function(err, user) {
        if (err) {
            console.log('error returned from user register: '+JSON.stringify(err));
            return res.render('createparent', { error : err.message, user: req.username });
        }
        res.redirect('/adminhome');
    });
});

router.get('/createbaby', function(req, res, next) {
  res.render('createbaby', {user: req.user});
});

var _createUserFromBody = function(body) {
  var pair = blockController.createUser();
  var user = new User({
      username: body.username,
      password: body.password,
      firstname: body.firstname,
      lastname: body.lastname,
      birthdate: body.birthdate,
      address: body.address,
      phonenumber: body.phone,
      email: body.email,
      public: pair.public,
      private: pair.private,
      admin: false
  });
  return user;
}

router.post('/createbaby', function(req, res) {
    req.body.password = "1";  // mongoose local won't let us create a user w/o password.
    var user = _createUserFromBody(req.body); // This should be asynchronous.  Blow me.
    User.register(user, req.body.password, function(err, user) {
        if (err) {
            return res.render('createbaby', { error : err.message });
        }
        if (req.body.parent1 == null) {
          return res.redirect('/adminhome');
        } else {
          // add a permission.  Holder is req.user.  Receiver has a username of req.body.parent1
          userController.findUserByUsername(req.body.parent1, function(err, receiver) {
            if (err) {
              return res.render('createbaby', { error : err.message });
            }
            permissionController.create(req.user, receiver, function(err) {
              if (err) {
                return res.render('createbaby', { error: err.message });
              }
              return res.redirect('/adminhome');
            })
          });
        }
    });
});

router.post('/grantaccesstoparent', function(req, res) {
  // find the user with viewer_username
  userController.findUserByUsername(req.body.username, function(err, receiver_user) {
    if (err) {
      return res.render('/home', {error : err.message});
    } else {
      permissionController.create(req.user, receiver_user, function(err) {
        if (err) {
          return res.render('/home', {error : err.message});
        } else {
          res.redirect('/home');  // Now the new permissions should be reflected.
        }
      });
    }
  });
});

router.get('/configure', function(req, res, next) {
  res.render('configure', {user: req.user});
});

router.post('/', function(req, res, next) {
  res.render('configure', {user: req.user});
});

module.exports = router;
