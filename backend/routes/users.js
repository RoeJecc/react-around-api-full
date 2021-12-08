const express = require("express");
const { celebrate, Joi } = require("celebrate");
const router = express.Router();
const validateUrl = require('../middleware/validateUrl');

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
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
    }),
  }),
  getCurrentUser
);

router.get(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById
);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateUrl),
    }),
  }),
  updateAvatar
);

module.exports = router;
