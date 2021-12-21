const express = require("express");
const { celebrate, Joi } = require("celebrate");
const router = express.Router();
const validateUrl = require("../middleware/validateUrl");
const auth = require("../middleware/auth");

const {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/userController");

router.get("/", getUsers);

router.get("/me", auth, getCurrentUser);

router.get("/:id", auth, getUserById);

router.patch("/me", auth, updateUser);

router.patch("/me/avatar", auth, updateAvatar);

module.exports = router;
