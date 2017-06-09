/**
 * Created by Administrator on 2017/5/21.
 */
//评论
var limit = 2;
var page =1;
var comments = [];
$(function(){
    $("#submit").on("click",function(){
        $.ajax({
            type:"post",
            url:'/api/comments/post',
            dataType:"json",
            data:{
                contentid:$("#contentId").val(),
                content:$('#sear').val()
            },
            success:function(responseData){
                $('#sear').val("");
                comments = responseData.data.comments.reverse()
                renderComment()
            }
        })
    });

/*
* 每次在页面重载的时候获取评论的条数
* */

    $.ajax({
        type:"get",
        url:'/api/comments',
        dataType:"json",
        data:{
            contentid:$("#contentId").val()
        },
        success:function(responseData){
            comments =  responseData.data.comments.reverse()
            renderComment()

        }
    })
 $(".pager").delegate("a",'click',function(){
     if($(this).parent().hasClass('previous')){
        page--;
     }else{
        page++;

     }
     renderComment()
 });

/*
* 渲染添加评论后的内容
* */
    function renderComment(){
        $("#commentsList").html(comments.length)
        var totalList = comments.length ;
        var pages = Math.ceil( totalList/limit )
        var start = Math.max(0,(page-1)*limit);

        var end =Math.min(start+limit,comments.length);
        $(".showList").html(page+'/'+pages)
        if(page<=1){
            page=1;
            $(".J_next").html("下一页")
            $(".J_prev").html("没有上一页了")
        }else{
                page=pages;
                $(".J_next").html("没有下一页了")
                 $(".J_prev").html("上一页")
        }
        if(comments.length == 0){
            $('.messageList').html( '<p class="titleM">还没有留言</p>');
            $(".showList").html(page+'/'+page)
        }else{
            var html = '';
            for(var i = start;i<end;i++){
                html +='<div class="messageBox">'+' <div class="message">'+
                    '<span class="user"><strong>'+comments[i].username+'</strong></span>'+
                    '<span class="time">'+formateTime(comments[i].postTime)+'</span>'+
                    '<div class="list">'+comments[i].content+'</div>'+'</div></div>'
            }
            $('.messageList').html(html).fideIn();

        }

     }
     /*
     * 处理时间格式
     * */
     function formateTime(d){
        var date1 = new Date(d);
        return date1.getFullYear() +'年'+(date1.getMonth()+1) +'月'+date1.getDate() +'日'+date1.getHours() +':'+date1.getMinutes() +':'+date1.getSeconds()
     }





})

