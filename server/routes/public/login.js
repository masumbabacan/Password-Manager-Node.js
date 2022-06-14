const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended : false});
const crypto = require("crypto-js");
const mongoose = require("mongoose");
const User = mongoose.model("Users");

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('public/login');
});

router.post('/', urlencodedParser,function(req, res, next) {
    login(req,res,next);
});

router.get('/logout', function(req, res, next) {
    logOut(req, res, next);
    res.redirect("/giris-yap");
});
module.exports = router;


//---------------------------------------------------------------------------------------//
function login(req,res,next) {
    const hashKey = "123abc!";
    User.findOne({email : req.body.email}).then((user) => {
        if (user.accountStatus !== false) {
            bytes = crypto.AES.decrypt(user.password,hashKey);
            decryptPassword = bytes.toString(crypto.enc.Utf8);
            if (req.body.password === decryptPassword) {
                if (user.status !== false) {
                    req.session.user = user;
                    return res.status(200).jsonp({
                        status : "success",
                        msg : "giriş başarılı",
                        redirect: "anasayfa",
                    })
                }else{
                    return res.status(200).jsonp({
                        status : "emailVerification", 
                        msg : "Email Adresinizi doğrulamanız gerekmektedir",
                        data : user.email,
                        redirect : "email-dogrulama",
                    })
                }
            }else{
                return res.status(200).jsonp({
                    status : "error", 
                    msg : "Kullanıcı adı veya şifre hatalı",
                })
            }
        }else{
            return res.status(200).jsonp({
                status : "error", 
                msg : "Hesabınız daha önceden silinmiş gözüküyor. Bir hata olduğunuz düşünüyorsanız bizimle iletişime geçebilirsiniz",
            })
        }
    }).catch(() => {
        return res.status(200).jsonp({
            status : "error", 
            msg : "Kullanıcı adı veya şifre hatalı",
        });
    })
}

function logOut(req, res, next) {
    return req.session.destroy();
}