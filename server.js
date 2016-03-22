'use strict';

let mongoose = require('mongoose');
let express = require('express');

let port = process.env.PORT || 4000;
let DB_PORT = process.env.MONGOLAB_URI || 'mongodb://localhost/db';
mongoose.connect(DB_PORT);

let users = require('./routes/user-route');
let files = require('./routes/file-route');

let app = express();
app.use('/', users);
app.use('/', files);

app.listen(port, ()=>{
  console.log('Magic is happening on port ' + port);
});
