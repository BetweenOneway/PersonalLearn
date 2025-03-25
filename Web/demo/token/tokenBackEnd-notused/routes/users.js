var express = require('express');
var router = express.Router();
let jwt = require('jsonwebtoken');
const { userModel } = require('../model/model')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res) => {
  const { username } = req.body;
  const user = await userModel.findOne({ username });
  if (user) {
    res.send({
      code:200
    })
  }

});


module.exports = router;
