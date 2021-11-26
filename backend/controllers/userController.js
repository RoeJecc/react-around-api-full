const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const AuthenticationError = require("../errors/authentication-error");
const ConflictError = require("../errors/conflict-error");
const User = require("../models/user");

dotenv.config();
const { NODE_ENV, JWT_SECRET } = process.env;

function getUsers(req, res, next) {
  User.find({})
    .select("+password")
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
}

function getUserById(req, res, next) {
  User.findById(req.params.id === "me" ? req.user._id : req.params.id)
    .select("+password")
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
      throw new NotFoundError("User not found.");
    })
    .catch((err) => {
      if (err.name === "CastError" || err.name === "TypeError") {
        throw new NotFoundError("User not found.");
      }
      next(err);
    })
    .catch(next);
}

const getCurrentUser = (req, res, next) => {
  User.findById(req.params.id === "me" ? req.user._id : req.params.id)
    .select("+password")
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError("User not found.");
      }
      next(err);
    })
    .catch(next);
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
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { name, about } },
    { new: true, runValidators: true }
  )
    .select("+password")
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Unable to update user.");
      }
      next(err);
    })
    .catch(next);
}

function updateAvatar(req, res, next) {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar: req.body.avatar },
    { new: true, runValidators: true }
  )
    .select("+password")
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Unable to update avatar.");
      }
      next(err);
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
