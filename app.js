/*应用程序的启动入口文件*/
/*引入 express框架*/

var express = require('express');
/*加载模板*/
var swig = require('swig');

//加载数据库
var mongoose = require('mongoose');

//加载body-parser处理前端提交的数据
var bodyParser = require('body-parser');
//创建app应用
var app = express();
//加载cookies
var cookies = require('cookies');

//设置静态文件托管
app.use('/public',express.static(__dirname + '/public') );
//配置应用模板
//定义当前应用使用的模板引擎
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
app.set('views','./views');
//注册所使用的模板引擎，第一个参数必须是view engine 第二个参数必须与定义模板文件的第一个参数一致
app.set('view engine','html');
//在开发的过程中需要取消模板缓存
swig.setDefaults({cache:false})

//body-parser设置
app.use(bodyParser.urlencoded({extended:true}))
//设置cookies
app.use(function(req,res,next){
	req.cookies = new cookies(req,res);
	
	//解析登录的用户信息
	req.userInfo = {};
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));
		}catch(e){}
	}
	next();
})





/*根据不同的功能划分不同的模块*/
//后台管理模块
app.use('/admin',require('./routers/admin'));
////根据ajax请求的数据模块
app.use('/api',require('./routers/api'));
////前台展示模块
app.use('/',require('./routers/main'));


//数据库的链接
mongoose.connect('mongodb://localhost:27017/blog2',function(err){
	if(err){
		console.log("数据库链接失败")
	}else{
		console.log("数据库链接成功");
		app.listen(8081);
	}
	
})

//监听http请求


//一般的网站运行步骤
/*
 * 用户发起http请求-》URL-》解析路由-》找到匹配的规则-》执行指定的绑定函数，返回对应的内容给用户
 * 
 静态资源
/public -》静态 -》 直接读取制定目录下的文件public/。。。。。,返回给用户。
-》动态 -》处理业务逻辑，加载模板 ,解析模板，一般用到app.get('路径',function(){函数体})这种方式 -》返回数据给用户
 * 
 * */


