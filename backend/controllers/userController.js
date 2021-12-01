const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const AuthenticationError = require("../errors/authentication-error");
const ConflictError = require("../errors/conflict-error");
const User = require("../models/user");

const { NODE_ENV, JWT_SECRET } = process.env;

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
        return res.status(200).send({ user });
      }
    })
    .catch(next)
}

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("User not found");
      } else {
        return res.status(200).send({ user });
      }
    })
    .catch(console.log(req), next);
};

function createUser(req, res, next) {
  const { name, about, avatar, email, password } = req.body;

  User.findOne({ email }).then((userExists) => {
    if (userExists) {
      throw new ConflictError("User already exists.");
    }
  });

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
    .then((user) => res.send({ _id: user._id, email: user.email }))
    .catch((err) => {
      if (err.name === "MongoError" && err.code === 11000) {
        throw new BadRequestError("User already exists.");
      } else {
        next(err);
      }
    })
    .catch(next);
}

function updateUser(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found.');
      } else {
        res.status(200).send({ data: user })
      }
    })
    .catch(next);
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id,
    { avatar },
    { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found.');
      } else {
        res.status(200).send({ data: user });
      }
    })
    .catch(next);
}

function login(req, res, next) {
  const { password, email } = req.body;

  return User.findUserByCredentials(password, email)
    .then((user) => {
      if (!user) {
        throw new AuthorizationError("Not Authorized");
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "super-secret-key",
        { expiresIn: "7d" }
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
