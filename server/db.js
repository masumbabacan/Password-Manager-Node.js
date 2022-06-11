var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/password-manager");

var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    status: Boolean,
    accountStatus: Boolean,
    verificationCode: String,
});

var accountShema = new Schema({
    account : String,
    password : String,
    description : String,
    user : Object,
})


mongoose.model("Users", userSchema);
mongoose.model("Accounts", accountShema);

module.exports = mongoose;