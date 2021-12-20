const express = require("express");
const { celebrate, Joi } = require("celebrate");
const router = express.Router();
const validateUrl = require("../middleware/validateUrl");
const auth = require("../middleware/auth");

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require("../controllers/cardsController");

router.get("/", getCards);

router.post(
  "/",
  auth,
  // celebrate({
  //   body: Joi.object().keys({
  //     name: Joi.string().required().min(2).max(30),
  //     link: Joi.string().required().custom(validateUrl),
  //   }),
  // }),
  createCard
);

router.delete(
  "/:id",
  auth,
  // celebrate({
  //   params: Joi.object().keys({
  //     id: Joi.string().hex().length(24),
  //   }),
  // }),
  deleteCard
);

router.put(
  "/likes/:id",
  auth,
  // celebrate({
  //   params: Joi.object().keys({
  //     id: Joi.string().hex().length(24).required(),
  //   }),
  // }),
  likeCard
);

router.delete(
  "/likes/:id",
  auth,
  // celebrate({
  //   params: Joi.object().keys({
  //     id: Joi.string().hex().length(24).required(),
  //   }),
  // }),
  unlikeCard
);

module.exports = router;
