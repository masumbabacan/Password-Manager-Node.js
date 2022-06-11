const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("Users");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/', function (req, res, next) {
    res.render('public/forgotPassword');
});

router.post('/', urlencodedParser, function (req, res, next) {
    forgotPassword(req, res, next);
});
module.exports = router;

function forgotPassword(req, res, next) {
    let email = req.body.email;
    const verificationCode = Math.floor(Math.random() * 10000000);
    User.findOneAndUpdate({ email: email }, { verificationCode: verificationCode }).then((user) => {
        if (user) {
            const transporter = nodemailer.createTransport({
                direct: true, host: 'smtp.yandex.com', port: 465,
                auth: { user: 'masum@btmteknoloji.com', pass: 'Btm@123456' }, secure: true
            });
            var mailOptions = {
                from: 'masum@btmteknoloji.com', to: email,
                subject: "PASSWORD MANAGER",
                html: `
                        <div style="font-weight:bold; color:red;">Şifrenizi sıfırlayabilmek için aşağıdaki sıfırlama kodunu ilgili alana giriniz</div>
                        <div style="font-weight:bold; color:green;">Sıfırlama Kodunuz : ${verificationCode}</div>
                      `
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(200).jsonp({
                        status: "error",
                        msg: "Email gönderilirken bir hata oluştu. Lütfen tekrar deneyin veya bize ulaşın.",
                    })
                } else {
                    res.status(200).jsonp({
                        status: "success",
                        msg: "Sıfırlama Kodunuz başarılı bir şekilde gönderildi. Şimdi şifrenizi sıfırlayabilirsiniz.",
                    })
                }
            });
        } else {
            res.status(200).jsonp({
                status: "error",
                msg: "Lütfen email adresinizi kontrol edin",
            })
        }
    })
}