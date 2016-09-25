var model = require('./block.model.js'),
  keypair = require('keypair'),
  exec = require('child_process').exec;
var cmd = 'prince -v builds/pdf/book.html -o builds/pdf/book.pdf';

exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
});

exports.createUser = function() {
  var pair = keypair();
  return pair;  // The pair should be added to the User before
    // adding to the database.
};

exports.createBaby = function(user, next) {
  // The user already has a public and private pair, and the
  // user has already been saved to the database.
  // Just create the baby contract.
  // This _should_ be asynchronous, but not today.
  var cmd = './block/contractScripts/createNewBabyContract '+user.public;
  exec(cmd, function(error, stdout, stderr) {
    next(error);
  });
};

exports.createBabyParent = function(user) {
  // ???
};

exports.addPermission = function(holder, receiver) {
  // from is a full Baby structure, which contains private key
  // to is a public identifier of the recipient of permissions
  // returns, what, a transaction ID?
};

exports.revokePermission = function(holder, receiver) {
  // ??? Is the owner of permission always the revoker?
  // or can a government admin revoke permission?
};

exports.timeRevoke = function(time, holder, receiver, type) {
  // time -- the time in days from today when the permission is revoked
  // holder -- the person who holds the permissions
  // receiver -- the person who is granted the permission for a limited time
  // type -- the permission type that will be granted and then revoked.
  // returns a transactionid?
};

exports.timePermission = function(time, holder, receiver, type) {
  // time -- time in days from today
  // holder -- the person who holds the permissions
  // receiver -- the person who is granted the permission for a limited time
  // type -- the permission type that will be granted and then revoked.
  // returns a transactionid?
};

exports.accessCheck_WhoseRecordsCanIAccess = function(receiver) {
  // returns the array of persons the receiver has view permissions for
};

exports.accessCheck_WhoCanAccessMyRecords = function(holder) {
  // returns the array of persons who can access the holder's records.
};
