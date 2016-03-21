'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let fileSchema = new Schema({
  _user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  fileName: String,
  url: String,
  content: String,
  updated: {type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
