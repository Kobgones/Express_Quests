require("dotenv").config();
const express = require("express");
const { validateMovie, validateUser } = require("./validators.js");

const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const usersHandlers = require("./usersHandlers");
const { hashPassword, verifyPassword, verifyToken } = require("./auth");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", usersHandlers.getUsers);
app.get("/api/users/:id", usersHandlers.getUsersById);

app.post(
  "/api/login",
  usersHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken); // following routes will need the token to be executed

app.post("/api/movies", verifyToken, validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.post("/api/users", hashPassword, usersHandlers.postUser);
app.put("/api/users/:id", validateUser, usersHandlers.updateUser);
app.delete("/api/users/:id", usersHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
