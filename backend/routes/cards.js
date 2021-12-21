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
  createCard
);

router.delete(
  "/:id",
  auth,
  deleteCard
);

router.put(
  "/likes/:id",
  auth,
  likeCard
);

router.delete(
  "/likes/:id",
  auth,
  unlikeCard
);

module.exports = router;
