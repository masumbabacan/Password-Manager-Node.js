var {check} = require("express-validator");
var mongoose = require("mongoose");
var User = mongoose.model("Users");

let registerRules = [
  check("name")
      .isLength({min : 2, max : 30}).withMessage("isim en az 2 en fazla 30 karakter olabilir"),
  check("surname")
      .isLength({min : 2, max : 30}).withMessage("soyisim en az 2 en fazla 30 karakter olabilir"),
  check("email")
      .isEmail().withMessage("Email doğru bir formatta değil")
      .isLength({min : 5, max : 30}).withMessage("Email en az 5 en fazla 30 karakter içerebilir")
      .custom((value) => {
        return User.findOne({email : value}).then(user => {
          if (user) {
            return Promise.reject("Bu email zaten var");
          }
        })
      }),
  check("password")
      .isStrongPassword().withMessage("Güçlü bir parola oluşturunuz"),
  check("confirmPassword")
      .custom((value, {req}) => {
        if (value !== req.body.password) {
          return Promise.reject("Şifreler birbiri ile uyuşmuyor");
        }else{
          return true;
        }
      })
];

module.exports = registerRules;