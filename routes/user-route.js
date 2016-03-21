'use strict';
let express =require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let User = require('../models/User');
let File = require('../models/File');
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var s3 = new AWS.S3();
// var s3 = new AWS.S3();


router.use(bodyParser.json());

router.route('/users')
.post((req, res)=>{
  console.log('POST to /users');
  var newUser = new User(req.body);
  newUser.save((err, user)=>{
    if (err) res.send(err);
    res.json({data: user});
  });

})
.get((req, res)=>{
  console.log('GET hit for /users');
  User.find({}, (err, users)=>{
    if(err) res.send(err);
    res.json(users);
  });
});
router.route('/users/:user')
.get((req, res)=>{
  console.log('GET /users/:user was hit');
  User.findById(req.params.user, (err, user)=>{
    if(err) res.send(err);
    res.json(user);
    console.log('USER: ' + user);
  });
})
.put((req, res)=>{
  console.log('PUT /users:user was hit');
  User.findByIdAndUpdate(req.params.user, req.body, (err)=>{
    if (err) res.send(err);
    res.json({msg: 'updated'});
  });
})
.delete((req, res)=>{
  console.log('DELETE was hit for /users/:user');
  User.find({user: req.params.user}, (err, user)=>{
    user.remove((err)=>{
      if (err) res.send(err);
      res.json({msg: 'deleted user'});
    });
  });
});

//user files
router.route('/users/:user/files')
// .post((req, res)=>{
  .post((req, res)=>{
    console.log('post was hit for /files');
    var params = {Bucket: 'lw401restbucket', Key: req.body.user.fileName, Body: req.body.content};
    s3.putObject(params,(err)=> {
      console.log(err);
      s3.getSignedUrl('putObj', params, (err, content)=>{
        var newFile = new File({content: content});
        newFile.save((err, file)=>{
          if (err) res.send(err);
          res.json(file);
        });
      });
    });
  })
//   console.log('POST /users/:user/files was hit');
//   var newFile = new File({
//     _user: req.params.user,
//     fileName: req.body.fileName,
//     // url: req.body.url,
//     content: req.body.content
//   });
//   newFile.save((err, file)=>{
//     if (err) res.send(err);
//     res.json(file);
//   });
// })
.get((req, res)=>{
  console.log('GET /users/:user/files was hit');
  User.find({user: req.params.user})
  .populate('files')
  .exec((err, user)=>{
    if(err) res.send(err);
    res.json(user);
  });
});
module.exports = router;
