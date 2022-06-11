const express = require('express');
const { validationResult } = require("express-validator");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const crypto = require("crypto-js");
const mongoose = require("mongoose");
const User = mongoose.model("Users");
const registerRules = require("../../core/registerValidation");

const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('public/register');
});

router.post('/', urlencodedParser, registerRules, function (req, res, next) {
  register(req, res, next);
});


module.exports = router;

function register(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(200).jsonp(errors.array());
  } else {
    const hashKey = "123abc!";
    req.body.password = crypto.AES.encrypt(req.body.password, hashKey);
    new User({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password,
      status: false,
      accountStatus : true,
      verificationCode: "",
    }).save((err, response) => {
      if (err) {
        throw err;
      } else {
        return res.status(200).jsonp({ status: "success", msg: "Kayıt Başarılı" });
      }
    })
  }
}