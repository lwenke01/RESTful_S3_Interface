'use strict';
let express =require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let File = require('../models/File');

var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
var s3 = new AWS.S3();


router.use(bodyParser.json());

router.route('/files')
// .post((req, res)=>{
//   console.log('post was hit for /files');
//   var params = {Bucket: 'lw401restbucket', Key: req.body.fileName, ACL:'public-read-write', Body: JSON.stringify(req.body.content)};
//   s3.putObject(params,(err)=> {
//     console.log(err);
//     s3.getSignedUrl('putObj', params, (err, url)=>{
//       var newFile = new File({url: url});
//       newFile.save((err, file)=>{
//         if (err) res.send(err);
//         res.json(file);
//       });
//     });
//   });
// })
.get((req, res)=>{
  console.log('get /files was hit');
  File.find({}, (err, files)=>{
    if(err) res.send(err);
    res.json(files);
    res.end();
  });
});
router.route('/files/:file')
.get((req, res)=>{
  console.log('Get /files/:file was hit');
  File.findById(req.params.file, (err, file)=>{
    if (err) res.send(err);
    res.json(file);
    res.end();
  });
})
.put((req, res)=>{
  console.log('PUT /files/:file was hit');
  var params = {Bucket: 'lw401restbucket', Key: req.body.fileName, ACL: 'public-read-write', Body: req.body.content};
  s3.putObject(params,(err)=> {
    console.log(err);
    s3.getSignedUrl('putObject', params, (err, file)=>{
      File.findByIdAndUpdate(req.params.id, {$push: {fileName: file}}, (err, file)=>{
        if (err) res.send(err);
        res.json({
          data: file,
          msg: 'updated file'});
      });

    });
  });
})
.delete((req, res)=>{
  console.log('DELETE files/:file was hit');
  File.findById({_id: req.params.id}, (err)=>{
    console.log(err);
    var params = {Bucket: 'lw401restbucket', Key: req.body.fileName};
    s3.deleteObject(params, (err, data)=>{
      if(err) res.send(err);
      console.log(data);
    });
    File.remove((err, file)=>{
      console.log(file + ' was deleted');
    });

  });

});



module.exports = router;
