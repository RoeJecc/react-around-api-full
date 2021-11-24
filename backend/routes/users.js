const express = require("express");
const { celebrate, Joi } = require("celebrate");
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/userController");

router.get("/users", getUsers);

router.get(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
    }),
  }),
  getCurrentUser
);

router.get(
  "/users/:id",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById
);

router.post("/users", createUser);

router.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);

router.patch(
  "/users/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
    }),
  }),
  updateAvatar
);

module.exports = router;
