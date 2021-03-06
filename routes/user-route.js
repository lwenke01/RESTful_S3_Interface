'use strict';
let express =require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let User = require('../models/User');
let File = require('../models/File');
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var s3 = new AWS.S3();



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
  User.find({}).populate('files').exec( (err, users)=>{
    if(err) res.send(err);
    res.json({data: users});

  });
});
router.route('/users/:user')
.get((req, res)=>{
  console.log('GET /users/:user was hit');
  User.findById(req.params.user).populate('files').exec((err, user)=>{
    if(err) res.send(err);
    res.json(user);

  });
})
.put((req, res)=>{
  console.log('PUT /users:user was hit');
  User.findByIdAndUpdate(req.params.user, req.body, (err, user)=>{
    if (err) res.send(err);
    res.json(user);

  });
})
.delete((req, res)=>{
  console.log('DELETE was hit for /users/:user');
  User.findById({_id: req.params.user}).populate('files').exec((err, user)=>{
    console.log(user);
    var params = {Bucket: 'lw401restbucket', Key: req.body.fileName};
    s3.deleteObject(params, (err, data)=>{
      if(err) res.send(err);
      console.log(data);
    });
    User.remove((err, user)=>{
      console.log(user + 'is now deleted');
    });
  });

});



router.route('/users/:user/files')
  .post((req, res)=>{
    console.log('post was hit for /files');
    var params = {Bucket: 'lw401restbucket', Key: req.body.fileName, ACL: 'public-read-write', Body: JSON.stringify(req.body.content)};
    s3.putObject(params,(err)=> {
      console.log(err);
      s3.getSignedUrl('putObject', params, (err, url)=>{
        var newFile = new File();
        newFile.save((err, file)=>{
          if (err) res.send(err);
          User.findByIdAndUpdate(req.params.id, {$push: {files: file._id, url: url}}, (err, file)=>{
            if (err) res.send(err);
            res.json(file);
            res.end();

          });
        });
      });
    });
  })

.get((req, res)=>{
  console.log('GET /users/:user/files was hit');
  User.findById({_id: req.params.user})
  .populate('files')
  .exec((err, user)=>{
    if(!user) res.send(err);
    res.json(user);
    res.end();
  });
});
module.exports = router;
