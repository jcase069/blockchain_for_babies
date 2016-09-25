// This file is for faking blockchain permissions auditing, inside a db.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.model('Permission', new Schema({
  holder: String, // public key of holder, who has records.
  receiver: String, // public key of recevier, who can view holder's records
}));
