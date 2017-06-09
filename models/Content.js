var mongoose = require('mongoose');
var contentSchemas = require('../schemas/content');
module.exports = mongoose.model('Content',contentSchemas);
