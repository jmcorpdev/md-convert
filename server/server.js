const express = require("express");
const setupMiddleware = require("./middleware");
const setupRoutes = require("./routes");
const { port } = require("./config");

const server = () => {
  const app = express();

  setupMiddleware(app);
  setupRoutes(app);

  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
};

module.exports = server;
