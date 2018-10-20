const mongoose = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator'),
      config = require('config'),
      jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 7,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 1024
  }
});

userSchema.plugin(uniqueValidator);

userSchema.methods.generateJwt = function() {
  const token = jwt.sign({
    _id: this._id,
    email: this.email
  },
  config.get('jwtPrivateKey'),
  { expiresIn: '1h' });

  return token;
}

module.exports = mongoose.model('User', userSchema);