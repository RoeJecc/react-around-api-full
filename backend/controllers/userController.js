const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const AuthenticationError = require("../errors/authentication-error");
const ConflictError = require("../errors/conflict-error");
const User = require("../models/user");

dotenv.config();
const { JWT_SECRET } = process.env;

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
}

function getUserById(req, res, next) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found.");
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(next);
}

const getCurrentUser = (req, res, next) => {
  console.log('getCurrntuser', req.current_user)
  // console.log({req});
  User.findById(req.current_user._id)
    .then((user) => {
      console.log('user qeury', user)
      if (!user) {
        throw new NotFoundError("User not found.");
      }
        return res.status(200).send({ user });

    })
    .catch(next);
};

function createUser(req, res, next) {
  const { name, about, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((userExists) => {
      if (userExists) {
        throw new ConflictError("User already exists.");
      }

      bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          })
        )
        .then((user) =>
          res.status(200).send({
            _id: user._id,
            email: user.email,
          })
        );
    })
    .catch((err) => {
      if (err.name === "MongoError" && err.code === 11000) {
        throw new ConflictError("User already exists.");
      } else {
        next(err);
      }
    });
}

function updateUser(req, res, next) {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User does not exist.");
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(next);
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User does not exist");
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthorizationError("Not Authorized");
      }
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
      );
      res.send({ token });
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
