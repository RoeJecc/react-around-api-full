const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-error");
const AuthenticationError = require("../errors/authentication-error");
const BadRequestError = require("../errors/bad-request-error");

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
}

function createCard(req, res, next) {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Invalid data passed.");
      } else {
        next(err);
      }
    });
}

function deleteCard(req, res, next) {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Card not found.");
      } else if (card.owner.toString() !== req.user._id) {
        throw new AuthenticationError("Not authorized.");
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid data Passed.");
      } else {
        next(err);
      }
    });
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        throw new NotFoundError("Card not found.");
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid data passed.");
      } else {
        next(err);
      }
    });
}

function unlikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      }
      return next(new NotFoundError("Card not found."));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid data passed.");
      } else {
        next(err);
      }
    });
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
