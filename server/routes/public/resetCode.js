const express = require('express');
const {body,validationResult} = require("express-validator");
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended : false});
const mongoose = require("mongoose");
const User = mongoose.model("Users");
const crypto = require("crypto-js");

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("public/resetCode");
});

router.post('/',urlencodedParser,body('password').isStrongPassword().withMessage("Güçlü bir şifre oluşturunuz"),(req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).jsonp(errors.array());
    }else{
        var hashKey = "123abc!";
        User.findOneAndUpdate({email : req.body.email, verificationCode : req.body.code},{password : crypto.AES.encrypt(req.body.password,hashKey).toString()}).then((user) => {
            if (user) {
                res.status(200).jsonp({
                    status : "success",
                    msg : "Şifre başarılı bir şekilde değiştirildi"
                })
            }else{
                res.status(200).jsonp({
                    status : "error",
                    msg : "Email veya doğrulama kodu hatalı"
                })
            }
        })
    }
    
})

module.exports = router;
