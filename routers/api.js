var express = require('express');
var router = express.Router();
//引入模型操作数据库
var User = require('../models/User');
var Contents = require('../models/Content');
//返回前端的统一格式
var responseData;
router.use( function (req,res,next){
	responseData = {
		code: 0,
		message: ""
	}
	next()
});

//用户注册
/*注册逻辑
 
 * 1:用户名不能为空
 * 2：两次密码必须一致
 * */


router.post('/user/register',function(req,res,next){

	var username = req.body.username ;
	var Password = req.body.Password;
	var rePassword = req.body.rePassword;
	
//	
//	
//	//判断
	if(username == ''){
		responseData.code = 1;
		responseData.message = "用户名不能为空";
		res.json(responseData);
		return
	};
////两次输入密码必须一致且不能为空
	if(Password == ''){
		responseData.code = 2;
		responseData.message = "密码不能为空";
		res.json(responseData);
		return
	}else if(Password != rePassword){
		responseData.code = 3;
		responseData.message = "两次输入的密码不一致";
		res.json(responseData);
		return
	}
	
	//验证用户名是否已经被注册
	User.findOne({
		username:username
	}).then(function(userInfo){
		if(userInfo){
			responseData.code = 4;
			responseData.message = "用户名已经被注册";
			res.json(responseData);
			return
		}
		//没有被注册，保存在数据库中
		var users = new User({
			username: username,
			Password: Password
		});
		return users.save();
	}).then(function(newUserInfo){
		responseData.message = "注册成功";
		res.json(responseData)
		
	});
});
router.post('/user/login',function(req,res,next){
		var username = req.body.username;
		var Password = req.body.Password;
		if( username == '' | Password == ""){
			responseData.code = 1;
			responseData.message = "用户名和密码不能为空";
			res.json(responseData);
			return
		};
		
		//从数据库中查询前端给出的用户名和密码是否存在
		User.findOne({
			username:username,
			Password:Password
		}).then(function(userInfo){
			if(!userInfo){
				responseData.code = 2;
				responseData.message = "用户名或密码错误",
				res.json(responseData)
				return;
			}
				//用户名和密码均正确
			responseData.message = "恭喜，登录成功";
			responseData.userInfo = {
				_id:userInfo._id,
				username:userInfo.username					
			};
			req.cookies.set('userInfo',JSON.stringify({
				_id:userInfo._id,
				username:userInfo.username		
			}));
			res.json(responseData)
			return
		})
	})

/*退出*/
router.get('/user/logout',function(req,res){
	req.cookies.set('userInfo',null);
	res.json(responseData)

});

/**
 * 每一次页面重载时检测是否有留言存在
 *
 */
router.get('/comments',function(req,res){
    var contentId = req.query.contentid || '';
    Contents.findOne({
        _id:contentId
    }).then(function(newContent){
        responseData.data = newContent;
        res.json(responseData);
        return
    });
})
//新添加评论
router.post('/comments/post',function(req,res){
	var contentId = req.body.contentid || '';
	var postData = {
		username:req.userInfo.username,
		postTime:new Date(),
		content:req.body.content
	};

	//查询当前文章内容信息
	Contents.findOne({
		_id:contentId
	}).then(function(content){
		content.comments.push(postData);
		return content.save();
	}).then(function(newContent){
        responseData.message = "评论成功";
        responseData.data = newContent;
		res.json(responseData);

        return


	});

});
module.exports = router;
