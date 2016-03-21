'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let userSchema = new Schema({
  user: String,
  files: [{type: Schema.ObjectId, ref: 'File'}],
  updated: {type: Date, default: Date.now }

});

module.exports = mongoose.model('User', userSchema);
