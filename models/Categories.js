var mongoose = require('mongoose');
var categoriesSchemas = require('../schemas/categories');
module.exports = mongoose.model('Categories',categoriesSchemas);
