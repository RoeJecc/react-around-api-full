const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AuthorizationError = require('../errors/authentication-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer'
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return RegExp(/https?:\/\/(www\.)?[\w\][/.~:?%#@!$&'()*+,;=-]+\..+/).test(v);
      },
      message: (props) => `${props.value} is not a valid URL`,
    },
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Invalid email or password.');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError('Invalid email or password.');
          }

          return user;
        });
    });
};


module.exports = mongoose.model('user', userSchema);
