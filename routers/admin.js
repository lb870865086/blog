var express = require('express');
var router = express.Router();
//读取用户列表模型
var User = require('../models/User');
//读取分类模型
var Categories = require('../models/Categories');
var Contents = require('../models/Content');

router.use( function (req,res,next){
	if( req.userInfo.username != "admin"){
		res.send("对不起，只有管理员才能进去后台管理页面");
		return;
//		console.log(req.username)
	}
	next()
	
});

//首页路由
router.get('/',function(req,res,next){
	//路由链接到admin下的admin.html文件
		res.render('admin/index',{
			userInfo:req.userInfo
		});	
});


//新增一个用户管理功能的路由
router.get('/user',function(req,res,next){
	
/*
 * 从数据库中读取所有的用户列表数据
 * 
 * limit限制获取的数据条数
 * skip()忽略的数据条数
 * 每一页显示的内容以及忽略的信息数量计算方式 （当前页 -1）*limit
 * 
 * 
 * */
var page = Number(req.query.page || 1);
var limit = 4;

var pages = 0;
	/*获取数据库里面的数据总的数量*/
	User.count().then(function(count){
		//计算总的页数
		pages = Math.ceil(count/limit);
		//计算页码的最小值
		page = Math.min(page,pages);
		//取值不能小于1
		page = Math.max(page,1);
		//忽略的条数
		var skip = (page - 1)*limit;
		
		User.find().limit(limit).skip(skip).then(function(users){
			//路由链接到用户列表展示页面
		res.render('admin/user_index',{
				userInfo:req.userInfo,		
				users:users,
				pages:pages,
				limit:limit,
				count:count,
				page:page
			});
		});
	});
})
/*分类首页*/
	router.get("/category",function(req,res){
		var page = Number(req.query.page || 1);
		var limit = 4;
		
		var pages = 0;
			/*获取数据库里面的数据总的数量*/
			Categories.count().then(function(count){
				//计算总的页数
				pages = Math.ceil(count/limit);
				//计算页码的最小值
				page = Math.min(page,pages);
				//取值不能小于1
				page = Math.max(page,1);
				//忽略的条数
				var skip = (page - 1)*limit;
				
				Categories.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
					//路由链接到用户列表展示页面
				res.render('admin/category_index',{
						userInfo:req.userInfo,		
						categories:categories,
						pages:pages,
						limit:limit,
						count:count,
						page:page
					});
				});
			});
	});
/*分类的添加*/
	router.get("/category/add",function(req,res){
		res.render('admin/category_add',{
			userInfo:req.userInfo
		});
	});
/*分类的保存*/
	router.post("/category/add",function(req,res){ 
		//获取前端表单提交的信息
		var name = req.body.name || '';
		if( name == '' ){
			res.render('admin/err',{
				userInfo:req.userInfo,
				message:'输入不能为空'
			});
			return;
		};
		//查看数据库中是否有相同的name存在
		Categories.findOne({
			name:name
		}).then(function(rs){
			//数据库中已经存在
			if(rs){
				res.render('admin/err',{
				userInfo:req.userInfo,
				message:'分类已经存在'
				});
				return Promise.reject();
			}else{
				//数据库中不存在，需要保存
				return new Categories({
					name:name
				}).save();
			}
		}).then(function(newCategory){
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'保存成功',
				url:'/admin/category'
			})
		})
	});
	
	/*分类修改*/
	router.get('/category/edit',function(req,res){
		//获取需要操作的id名
		var id = req.query.id || '';
		//获取要修改的信息
		Categories.findOne({
			_id:id
		}).then(function(category){
			if(!category){
				res.render('admin/err',{
					userInfo:req.userInfo,
					message:'分类信息不存在'
				});
			}else{
				res.render('admin/edit',{
					userInfo:req.userInfo,
					category:category
				});
			}
		})
	});
	/*修改保存*/
	router.post('/category/edit',function(req,res){
		//获取需要操作的id名
		var name = req.body.name || '';
		//获取需要操作的id名
		var id = req.query.id || '';
		//获取要修改的信息
		
		Categories.findOne({
			_id:id
		}).then(function(category){
			if(!category){
				res.render('admin/err',{
					userInfo:req.userInfo,
					message:'分类信息不存在'
				});
				return Promise.reject();
			}else{
				//当用户没有做任何操作的时候
				if(name == category.name){
					res.render('admin/success',{
						userInfo:req.userInfo,
						message:'保存成功',
						url:'/admin/category'
					});
					return Promise.reject();
				}else{
					return Categories.findOne({
						_id: {$ne:id},
						name: name
					});
				}
			}
		}).then(function(sameCategory){
			if(sameCategory){
				res.render('admin/err',{
					userInfo:req.userInfo,
					message:'分类信息已经存在'
				});
				return Promise.reject();
			}else{
				return Categories.update({
					_id:id
				},{
					name:name
				});
			}
		}).then(function(){
			res.render('admin/success',{
					userInfo:req.userInfo,
					message:'修改成功',
					url:'/admin/category'
				});
		})
	});
	
	/*分类的删除*/
	router.get('/category/delete',function(req,res){
		//获取要删除的ID名
		var id = req.query.id || '';
		Categories.remove({
			_id:id
		}).then(function(){
			res.render('admin/success',{
					userInfo:req.userInfo,
					message:'删除成功',
					url:'/admin/category'
				});
		})
	});
	


		/*内容添加页面*/
	router.get('/content/add',function(req,res){
		Categories.find().sort({_id:-1}).then(function(categories){
				res.render('admin/content_add',{
					userInfo:req.userInfo,
					categories:categories
			})
		})
	});
	
	//内容保存
	router.post('/content/add',function(req,res){
		if(req.body.category==''){
			res.render('admin/err',{
				userInfo:req.userInfo,
				message:'输入的内容分类不能为空'
			});
			return
		}
	if(req.body.title==''){
			res.render('admin/err',{
				userInfo:req.userInfo,
				message:'输入的内容标题不能为空'
			})
			return;
		}

		//保存数据到数据库

		new Contents({
			title:req.body.title,
			description:req.body.description,
			cagetory:req.body.category,
			user:req.userInfo._id.toString(),
			content:req.body.content
		}) .save().then(function(){
            res.render('admin/success',{
                userInfo:req.userInfo,
                message:'保存成功',
                url:'/admin/content'
            });
        });
    });

/*内容首页*/
	router.get("/content",function(req,res){
		var page = Number(req.query.page || 1);
		var limit = 4;

		var pages = 0;

		/*获取数据库里面的数据总的数量*/
        Contents.count().then(function(count){
                    //计算总的页数
			pages = Math.ceil(count/limit);
                    //计算页码的最小值
			page = Math.min(page,pages);
                    //取值不能小于1
			page = Math.max(page,1);
                    //忽略的条数
			var skip = (page - 1)*limit;
            Contents.find().sort({_id:-1}).limit(limit).skip(skip).populate(['category','User']).sort({addTime:-1}).then(function(contents){
                    //路由链接到用户列表展示页面
                    res.render('admin/content_index',{
							userInfo:req.userInfo,
							contents:contents,
							pages:pages,
							limit:limit,
							count:count,
							page:page

                    	});
                    });

                });
            });
//
// 	//内容修改
router.get('/content/edit',function(req,res){
    //获取需要操作的id名
    var id = req.query.id || '';
    var categories = [];
    Categories.find().sort({_id:-1}).then(function(rs){
        categories = rs;
        //获取要修改的信息
       return  Contents.findOne({
            _id:id
        }).then(function(contents){
            if(!contents){
                res.render('admin/err',{
                    userInfo:req.userInfo,
                    message:'分类信息不存在'
                });
                return Promise.reject();
            }else{
                res.render('admin/content_edit',{
                    userInfo:req.userInfo,
                    content:contents,
                    categories:categories
                });
            }
        })
    })


});
//内容保存
router.post('/content/edit',function(req,res){
    //获取需要操作的id名
    var name = req.body.name || '';
    //获取需要操作的id名
    var id = req.query.id || '';
    //获取要修改的信息
    if(req.body.category==''){
        res.render('admin/err',{
            userInfo:req.userInfo,
            message:'输入的内容分类不能为空'
        });
        return
    }
    if(req.body.title==''){
        res.render('admin/err',{
            userInfo:req.userInfo,
            message:'输入的内容标题不能为空'
        })
        return;
    }
 Contents.update({
                _id:id,
				title:req.body.title,
                content:req.body.content,
                description:req.body.description
            }).then(function(){
				 res.render('admin/success',{
					 userInfo:req.userInfo,
					 message:'修改成功',
					 url:'/admin/content'
				 });
 });
    })

router.get('/content/delete',function(req,res){
    //获取要删除的ID名
    var id = req.query.id || '';
    Contents.remove({
        _id:id
    }).then(function(){
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'删除成功',
            url:'/admin/content'
        });
    })
});
module.exports = router;