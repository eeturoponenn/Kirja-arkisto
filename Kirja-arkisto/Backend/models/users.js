const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: String,
  author: String,
  orderNum: Number,
  condition: Number,
  etukansikuva: String,
  takakansikuva: String,
  lisakuva1: String,
  hankintahinta: Number,
  hankintaAika: String,
  kuvausteksti: String,
  piirtajat: String,
  ensipainosvuosi: Number,
  painos: Number

});

const seriesSchema = new mongoose.Schema({
  // _id: {type: mongoose.Schema.Types.ObjectId},
  name: String,
  description: String,
  books: [bookSchema]
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  series: [seriesSchema]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
