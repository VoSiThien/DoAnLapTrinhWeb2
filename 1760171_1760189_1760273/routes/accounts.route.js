const express = require("express");
const bcrypt = require("bcryptjs");

const accounts = require("../models/accounts.model");

const router = express.Router();

router.post('/register', async (req, res) => {
  const entity = {MatKhau: bcrypt.hashSync(req.body.password, 8), HoTen: req.body.name, Email: req.body.email, VaiTroID: 4};

  await accounts.readerAdding(entity);
});

module.exports = router;
