const mongoose = require('./db')
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    phone: String
})
const userModel = mongoose.model('user', userSchema)

module.exports = {
    userModel
}
  