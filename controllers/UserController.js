var mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.findUserByUsername = function(username, next) {
  User.find({username: username}, function(err, users) {
    if (err) {
      next(err);
    } else if (users.length != 1){
      next({message: 'found number of users: '+users.length});
    } else {
      next(null, users[0]);
    }
  })
};
