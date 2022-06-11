const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("Users");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended : false});
/* GET home page. */
router.get('/:data', function(req, res, next) {
    const verificationCode = Math.floor(Math.random() * 10000000);
    User.findOneAndUpdate({email : req.params.data},{"verificationCode":verificationCode}).then((user) => {
        if (user) {
              const transporter = nodemailer.createTransport({direct:true, host: 'smtp.yandex.com', port: 465,
                auth: {user: 'masum@btmteknoloji.com', pass: 'Btm@123456' },secure: true
              });
              
              var mailOptions = {from: 'masum@btmteknoloji.com',to: req.params.data,
                subject: "PASSWORD MANAGER",
                html: `
                        <div style="font-weight:bold; color:red;">Üyeliğinizi doğrulamak için aşağıdaki kodu ekrandaki alana girin ve email adresinizi doğrulayın.</div>
                        <div style="font-weight:bold; color:green;">Doğrulama Kodunuz : ${verificationCode}</div>
                      `
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.render("public/emailVerification",{data:{status:"error",msg:"Bir hata ile karşılaşıldı lütfen tekrar deneyin",value:req.params.data}});
                } else {
                  res.render("public/emailVerification",{data:{status:"success",msg:"Doğrulama kodunuz başarılı bir şekilde gönderildi!",value:req.params.data}});
                }
              });
        }else{
            res.render("public/emailVerification",{data:{status:"error",msg:"Bir hata ile karşılaşıldı lütfen tekrar deneyin",value:req.params.data}});
        }
    })
});

router.post('/', urlencodedParser,function(req, res, next) {
  let verificationCode = req.body.verificationCode;
  User.findOne({email : req.body.email}).then((user) => {
    if (req.body.verificationCode === user.verificationCode) {
      User.findOneAndUpdate({email : user.email},{status : true}).then((user) => {
        if (user) {
          res.status(200).jsonp({
            status : "success", 
            msg : "Email adresiniz başarılı bir şekilde onaylandı. Şimdi giriş yapabilirsiniz",
          });
        }else{
          res.status(200).jsonp({
            status : "error", 
            msg : "Bir hata oluştu lütfen tekrar deneyin veya bizimle iletişime geçin.",
          });
        }
      }).catch(() => {
        res.status(200).jsonp({
          status : "error", 
          msg : "Bir hata oluştu lütfen tekrar deneyin veya bizimle iletişime geçin.",
        });
      })
    }else{
      res.status(200).jsonp({
        status : "error", 
        msg : "Doğrulama kodunu doğru girdiğinizden emin olun.",
    });
    }
  }).catch(() => {
      res.status(200).jsonp({
          status : "error", 
          msg : "Bir hata oluştu lütfen tekrar deneyin veya bizimle iletişime geçin.",
      });
  })
});

  


module.exports = router;
