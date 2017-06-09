/**/
var mongoose = require('mongoose');
//定义用户的表结构
module.exports = new mongoose.Schema({
	//内容表结构
	category: {
		type:mongoose.Schema.Types.ObjectId,
		//引用
		ref:'Categories'
	},
	/*内容标题*/
	title:{
		type:String,
		default:''
	},
	/*简介*/
	description:{
        type:String,
        default:''
	},
	/*内容*/
	content:{
        type:String,
        default:''
	},
	Users:{
       // type:mongoose.Schema.Types.ObjectId,
        type:String,
		//引用
        // ref:'User'
		default:'admin'
	},
	addTime:{
		type:Date,
		default:new Date()
	},
	//阅读量
	views:{
		type:Number,
		default:0
	},
    comments:{
	    type:Array,
        default:[]
    }
});
