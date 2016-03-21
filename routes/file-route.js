'use strict';
let express =require('express');
let router = express.Router();
let bodyParser = require('body-parser');


let File = require('../models/File');

router.use(bodyParser.json());

router.route('/files')
.post((req, res)=>{
  console.log('post was hit for /files');
  var newFile = new File(req.body);
  newFile.save((err, file)=>{
    if (err) res.send(err);
    res.json(file);
  });
})
.get((req, res)=>{
  console.log('get /files was hit');
  File.find({}, (err, files)=>{
    if(err) res.send(err);
    res.json({data: files});
  });
});
//files/:file route
router.route('/files/:file')
.get((req, res)=>{
  console.log('Get /files/:file was hit');
  File.findById(req.params.id, (err, file)=>{
    if (err) res.send(err);
    res.json(file);
  });
})
.put((req, res)=>{
  console.log('PUT /files/:file was hit');
  File.findByIdAndUpdate(req.params.id, req.body, (err, file)=>{
    if(err) res.send(err);
    res.json(file);
  });
})
.delete((req, res)=>{
  console.log('DELETE files/:file was hit');
  File.remove({id: req.params.id}, (err, file)=>{
    if (err) res.send(err);
    res.json({message: 'file was deleted '+ file});
  });
});



module.exports = router;
