const path = require("path");
const express = require("express");
const { convertToMarkdown } = require("./markdownConverter");

module.exports = function setupRoutes(app) {
  app.post("/convert", async (req, res) => {
    const markdownContent = await convertToMarkdown(req.body);
    res.send(markdownContent);
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  });

  app.use(express.static(path.join(__dirname, "..", "public")));
};
