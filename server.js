const express = require("express");
const app = express();
const PORT = 3000;

// To access the variables defined in .env file
require("dotenv").config();

// morgan is logging middleware maintained by the Expressjs team
app.use(require("morgan")("dev"));

app.use(express.json());

app.use(require("./api/auth").router);

app.use("/tasks", require("./api/tasks"));

app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something broke :(");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
