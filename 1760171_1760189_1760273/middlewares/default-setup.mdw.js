const express = require("express");

module.exports = function (app) {
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use("/public", express.static("public"));
};
