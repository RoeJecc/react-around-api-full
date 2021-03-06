const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const NotFoundError = require("./errors/not-found-error");
const { celebrate, Joi, errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");
const validateUrl = require("./middleware/validateUrl");
const { createUser, login } = require("./controllers/userController");
require("dotenv").config();

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://localhost:27017/aroundb");

const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");

app.use(express.json());
app.use(helmet());
app.use(cors("*"));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(errorLogger);
app.use(errors());

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateUrl),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.get("*", () => {
  throw new NotFoundError("Requested resource not found.");
});



app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
