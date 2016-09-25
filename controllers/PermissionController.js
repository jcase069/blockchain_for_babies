var mongoose = require('mongoose'),
	Permission = mongoose.model('Permission');

exports.create = function(holder, receiver, next) {
  // create a permission from holder to receiver.
  var permission = new Permission();
  permission.holder = holder.public;
  permission.receiver = receiver.public;
  permission.save(function (err) {
    next(err);
  })
};

exports.listWhoCanViewMyRecords = function(holder) {
  return [];
};

exports.listWhoseRecordsICanView = function(receiver) {
  return [];
};
