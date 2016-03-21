'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: String,
  files: [{type: String, ref: 'File'}],
  updated: {type: Date, default: Date.now }

});

module.exports = mongoose.model('User', userSchema);
