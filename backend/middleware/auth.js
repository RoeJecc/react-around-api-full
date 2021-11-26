const jwt = require('jsonwebtoken');

const AuthenticationError = require('../errors/authentication-error');


const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthenticationError('Authentication Required.');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key'
    );
  } catch (err) {
    throw new AuthenticationError('Authentication Required.')
  }
  req.user = payload;
  next();
};

module.exports = auth;