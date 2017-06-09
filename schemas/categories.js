/**/
var mongoose = require('mongoose');
//定义用户的表结构
module.exports =  mongoose.Schema({
	//分类表结构
	name:String,
	id:Number(String)
});
