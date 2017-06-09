$(function(){
	//获取dom节点
	var JS_resigner = $(".JS_resigner");
	var JS_login = $(".JS_login")
	JS_resigner.on('click',function(){
		$(".login").hide();
		$(".resigner").show()
	});
	JS_login.on('click',function(){
		$(".login").show();
		$(".resigner").hide()
	});
	
	//Ajax请求数据，注册页面
	$(".resigner").find("a").on("click",function(){
		$.ajax({
			type:"post",
			url:"/api/user/register",
			dataType:"json",
			data:{
				username:$('.resigner').find('[name = "username"]').val(),
				Password:$('.resigner').find('[name = "password"]').val(),
				rePassword:$('.resigner').find('[name = "repassword"]').val(),
				
			},
			success:function(result){
				$(".show_result_resiginer").html(result.message).addClass("show_warn");
				if(!result.code){
					setTimeout(function(){
						$(".show_result").addClass("show_success").siblings().removeClass("show_warn")
						$(".login").show();
						$(".resigner").hide()
					},1000)
				}
			}
		});
	})
	
	//登录模块
	$("#login").on("click",function(){


		//发送Ajax请求
		$.ajax({
			type:"post",
			url:"/api/user/login",
			dataType:"json",
			data:{
				username:$('.login').find('[name = "username"]').val(),
				Password:$('.login').find('[name = "password"]').val(),
			},
			success:function(result){
				
				if(result.code){
					$(".show_result_login").html(result.message).addClass("show_warn")
					setTimeout(function(){
						$(".show_result_login").html("")
					},1000);
				}else if(!result.code){
					window.location.reload();
				}
			}
		});
	})
	
	//退出按钮
	$(".back").on("click",function(result){
		$.ajax({
			url:'api/user/logout',
			success:function(){
				if(!result.code){
					window.location.reload();
				}
			}
		})
	})




})
