const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-error");
const AuthorizationError = require("../errors/authentication-error");

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
}

function createCard(req, res, next) {
  Card.create({ name: req.body.name, link: req.body.link, owner: req.current_user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Card not found.");
      } else if (card.owner.toString() !== req.current_user._id) {
        throw new AuthorizationError("Not authorized.");
      }
      res.status(200).send({ data: card });
    })
    .catch(next);
}

function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.current_user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        throw new NotFoundError("Card not found.");
      }
    })
    .catch(next);
}

function unlikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.current_user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      }
      return next(new NotFoundError("Card not found."));
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
