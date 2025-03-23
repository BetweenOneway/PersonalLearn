const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/geren002').then(data => {
    console.log('连接成功,http://127.0.0.1:3000');
}).catch(err => {
    console.log('连接失败');
})
module.exports = mongoose
  