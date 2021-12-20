const express = require("express");
const { celebrate, Joi } = require("celebrate");
const router = express.Router();
const validateUrl = require('../middleware/validateUrl');
const auth = require('../middleware/auth');

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/userController");

router.get("/", getUsers);

router.get(
  "/me",
  auth,
  // celebrate({
  //   body: Joi.object().keys({
  //     email: Joi.string().required().email(),
  //   }),
  // }),
  getCurrentUser
);

router.get(
  "/:id",
  auth,
  // celebrate({
  //   params: Joi.object().keys({
  //     id: Joi.string().hex().length(24).required(),
  //   }),
  // }),
  getUserById
);

router.patch(
  "/me",
  auth,
  // celebrate({
  //   body: Joi.object().keys({
  //     name: Joi.string().required().min(2).max(30),
  //     about: Joi.string().required().min(2).max(30),
  //   }),
  // }),
  updateUser
);

router.patch(
  "/me/avatar",
  auth,
  // celebrate({
  //   body: Joi.object().keys({
  //     avatar: Joi.string().required().custom(validateUrl),
  //   }),
  // }),
  updateAvatar
);

module.exports = router;
