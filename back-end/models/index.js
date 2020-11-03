// Import dependencies
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const dbConfig = require("../config/database.config.js");
const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;
db.profile = require("./profile.model")(mongoose);
db.family = require("./family.model")(mongoose);
db.position = require("./position.model")(mongoose);

module.exports = db;