var mongoose = require('mongoose');
var schemas = require('../schemas/Users');
module.exports = mongoose.model('User',schemas);
