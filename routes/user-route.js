'use strict';

let express =require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let User = require('../models/User');
let File = require('../models/File');

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
    res.json({_user: users});
  });
});

//user id
router.route('/users/:user')
.get((req, res)=>{
  console.log('GET /users/:user was hit');
  User.findById(req.params.id, (err, user)=>{
    if(err) res.send(err);
    res.json(user);
    console.log('USER: ' + user);
  });
})
.put((req, res)=>{
  console.log('PUT /users:user was hit');
  User.findByIdAndUpdate(req.params.id, req.body, (err, user)=>{
    if (err) res.send(err);
    res.json(user);
  });
})
.delete((req, res)=>{
  console.log('DELETE was hit for /users/:user');
  User.findById(req.params.id, (err, user)=>{
    user.remove((err)=>{
      if (err) res.send(err);
      res.json({msg: 'deleted user'});
    });
  });
});

//user files
router.route('/users/:user/files')
.post((req, res)=>{
  console.log('POST /users/:user/files was hit');
  let newFile = new File({
    _user: req.params.user,
    fileName: req.body.fileName,
    url: req.body.url
  });
  newFile.save((err, file)=>{
    if (err) res.send(err);
    res.json(file);
  });
})
.get((req, res)=>{
  console.log('GET /users/:user/files was hit');
  File.find({_user: req.params.user})
  .populate('_user')
  .exec((err, files)=>{
    if(err) res.send(err);
    res.json(files);
  });
});
module.exports = router;
