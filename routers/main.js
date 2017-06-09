var express = require('express');
var router = express.Router();
//读取分类模型
var Categories = require('../models/Categories');
var Contents = require('../models/Content');
var data;

/*处理通用函数*/
router.use(function(req,res,next){
    data = {
        userInfo:req.userInfo,
        categories:[]
    }
    Categories.find().then(function(categories){
        data.categories = categories;
        next();
    });
});
/*首页*/
router.get('/', function(req,res,next) {
        data.category = req.query.category || '';
        data. count = 0;
        data.page = Number(req.query.page || 1);
        data.limit = 4;
        data.pages = 0;
	var where = {};
	if(data.category){
		where.category = data.category;
	}

    Contents.where(where).count().then(function (count) {

        data.count = count;

        data.pages = Math.ceil(data.count/data.limit);
        //计算页码的最小值
        data.page = Math.min(data.page,data.pages);
        //取值不能小于1
        data.page = Math.max(data.page,1);
        //忽略的条数
        var skip = (data.page - 1)*data.limit;

        return  Contents.where(where).find().sort({_id:-1}).limit(data.limit).skip(skip).populate(['category','User']);
}).then(function (contents) {

	data.contents = contents;
    res.render('main/index',data);
	})
})
router.get('/view',function(req,res){
    var contentId = req.query.contentid || '';
    Contents.findOne({
        _id:contentId
    }).then(function(content){
        data.content = content;
        content.views++;
        content.save();

        res.render('main/view',data)
    })
})

module.exports = router;