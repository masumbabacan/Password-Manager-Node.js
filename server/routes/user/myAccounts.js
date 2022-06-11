var express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const crypto = require("crypto-js");
const mongoose = require("mongoose");
const Account = mongoose.model("Accounts");
const User = mongoose.model("Users");
const ObjectId = require('mongodb').ObjectId;
var router = express.Router();



router.get('/', function (req, res, next) {
    if (req.session.user) {
        let user = req.session.user;
        res.render("user/myAccounts", { user: user });
    } else {
        res.redirect("login");
    }
});

router.post('/passwordCheck',urlencodedParser,(req,res,next) => {
    const hashKey = "123abc!";
    if (req.session.user) {
        User.findOne({email : req.session.user.email}).then((user) => {
            let bytes = crypto.AES.decrypt(user.password,hashKey);
            let decryptPassword = bytes.toString(crypto.enc.Utf8);
            if (req.body.password === decryptPassword) {
                Account.find({ "$and": [{ "user.email": user.email }] },(err,response) => {
                    if (!err) {
                        const accountHash = "IoaBMW,wa5782p";
                        const passwordHash = "H!Mnpintd2r!";
                        const descriptionHash = "H!Mnpintd2r!IoaBMW,wa5782p";
                        response.forEach(element => {
                            let bytesAccount = crypto.AES.decrypt(element.account,accountHash);
                            let bytesPassword = crypto.AES.decrypt(element.password,passwordHash);
                            let bytesDescription = crypto.AES.decrypt(element.description,descriptionHash);
                            let decryptAccount = bytesAccount.toString(crypto.enc.Utf8);
                            let decryptPassword = bytesPassword.toString(crypto.enc.Utf8);
                            let decryptDescription = bytesDescription.toString(crypto.enc.Utf8);
                            element.account = decryptAccount;
                            element.password = decryptPassword;
                            element.description = decryptDescription;
                        });
                        return res.status(200).jsonp({ status: "success", msg: "Başarılı", data : response });
                    }
                })
            }else{
                return res.status(200).jsonp({ status: "error", msg: "Şifre Yanlış" });
            }
        }).catch(() => {
            return res.status(200).jsonp({ status: "error", msg: "Bir hata oluştu" });
        });
    }else{
        res.redirect("login");
    }
})

router.post('/deleteAccount',urlencodedParser, function (req, res, next) {
    Account.deleteOne({_id : ObjectId(req.body.data)},(err) => {
        if (!err) {
            return res.status(200).jsonp({ status: "success", msg: "Başarılı" });
        }else{
            console.log(4);
            return res.status(200).jsonp({ status: "success", msg: "Başarısız" });
        }
    })
});

module.exports = router;
