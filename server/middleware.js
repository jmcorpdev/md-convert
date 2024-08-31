const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

module.exports = function setupMiddleware(app) {
  app.use(bodyParser.text({ type: "text/html" }));
  app.use(
    express.static(path.join(__dirname, "..", "public"), {
      setHeaders: (res, filePath) => {
        const contentTypes = {
          ".css": "text/css",
          ".js": "application/javascript",
          ".txt": "text/plain",
        };
        const ext = path.extname(filePath);
        if (contentTypes[ext]) {
          res.setHeader("Content-Type", contentTypes[ext]);
        }
      },
    })
  );
};
