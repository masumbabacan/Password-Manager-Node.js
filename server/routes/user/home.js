var express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const crypto = require("crypto-js");
const mongoose = require("mongoose");
const Account = mongoose.model("Accounts");
var router = express.Router();

const { check, validationResult } = require("express-validator");


let accountRules = [
    check("account")
        .isLength({ min : 2, max : 150 }).withMessage("kullanıcı adı en az 2 en fazla 150 karakter olmalıdır"),
    check("password")
        .isLength({ min : 2, max : 150 }).withMessage("Şifre en az 2 en fazla 150 karakter olmalıdır"),
    check("description")
        .isLength({ min : 2, max : 150 }).withMessage("Açıklama en az 2 en fazla 150 karakter olmalıdır"),
];


router.get('/', function (req, res, next) {
    if (req.session.user) {
        let user = req.session.user;
        res.render("user/home", { user: user });
    } else {
        res.redirect("login");
    }
});

router.post('/createAccount',accountRules,urlencodedParser,function(req,res,next){
    if (req.session.user) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).jsonp(errors.array());
        }else{
            const accountHash = "IoaBMW,wa5782p";
            const passwordHash = "H!Mnpintd2r!";
            const descriptionHash = "H!Mnpintd2r!IoaBMW,wa5782p";
            req.body.account = crypto.AES.encrypt(req.body.account, accountHash);
            req.body.password = crypto.AES.encrypt(req.body.password, passwordHash);
            req.body.description = crypto.AES.encrypt(req.body.description, descriptionHash);

            new Account({
                account : req.body.account,
                password : req.body.password,
                description : req.body.description,
                user : req.session.user
            }).save((err, response) => {
                if (err) {
                    return res.status(200).jsonp({ status: "error", msg: "Kayıt oluşturulurken bir hata oluştu" });
                } else {
                    return res.status(200).jsonp({ status: "success", msg: "Kayıt Başarılı" });
                }
            })
        }
    }else{
        res.redirect("login");
    }
});

module.exports = router;
