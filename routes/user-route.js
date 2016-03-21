'use strict';
// let fs = require('fs');
let express =require('express');
let router = express.Router();
let bodyParser = require('body-parser');
require('./file-route.js');
let User = require('../models/User');

router.use(bodyParser.json());


router.route('/users')
.post((req, res)=>{
  console.log('POST to /users');
  var newUser = new User(req.body);
  newUser.save((err, user)=>{
    if (err) res.send(err);
    res.json(user);
  });
})
.get((req, res)=>{
  console.log('GET hit for /users');
  User.find({}, (err, users)=>{
    if(err) res.send(err);
    res.json({data: users});
  });
});

//user id
router.route('/users/:user')
.get((err, res)=>{

})
.put((err, res)=>{

})
.delete((err, res)=>{

});


//user files
router.route('/users/:user/files')
.get((err, res)=>{

})
.post((err, res)=>{

});

module.exports = router;
