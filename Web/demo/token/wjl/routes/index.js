var express = require('express');
var router = express.Router();
const multiparty = require('multiparty')
let { cateModel, shopModel } = require('../model/model')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/list', async (req, res) => {
  await cateModel.create(req.body)
  res.send({
    code: 200
  })
})




router.post('/upload', (req, res) => {
  const form = new multiparty.Form()
  form.uploadDir = './upload'
  form.parse(req, (err, fields, fiels) => {
      res.send({
          path: 'http://127.0.0.1:3000/' + fiels.file[0].path
      })
  })
})

module.exports = router;
