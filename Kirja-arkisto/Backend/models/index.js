const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./users");
db.role = require("./role");
db.series = require("./series");

db.ROLES = ["user"];
db.SERIES = ["series"];

module.exports = db;