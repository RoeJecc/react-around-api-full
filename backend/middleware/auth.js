const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const AuthenticationError = require('../errors/authentication-error');

dotenv.config();
const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(req.headers);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log("token error");
    //throw new AuthenticationError('Authentication Required.');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      JWT_SECRET,
    );
    console.log('payload good', payload);
  } catch (err) {
   // throw new AuthenticationError('Authentication Required.')
  }
  req.current_user = payload;
  next();
};

module.exports = auth;