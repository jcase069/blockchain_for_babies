var mongoose = require('mongoose'),
	Permission = mongoose.model('Permission'),
	_ = require('underscore');

exports.create = function(holder, receiver, next) {
  // create a permission from holder to receiver.
  var permission = new Permission();
  permission.holder = holder.public;
  permission.receiver = receiver.public;
  permission.save(function (err) {
    next(err);
  })
};

exports.listWhoCanViewMyRecords = function(holder, next) {
	Permission.find({holder: holder.public}, function(err, permissions) {
		if (err) {
			return next(err);
		}
		var toReturn = _.map(permissions, function(permission) {return permission.receiver});
		next(null, toReturn);
	});
};

exports.listWhoseRecordsICanView = function(receiver, next) {
	Permission.find({receiver: receiver.public}, function(err, permissions) {
		if (err) {
			return next(err);
		}
		next(null, _.map(permissions, function(permission) {return permission.holder}));
	});
};
