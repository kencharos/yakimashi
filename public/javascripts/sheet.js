$(document).ready(function(){
	$(".swipebox").swipebox({
		rightBar : true,
		rightBarInitial : function(slide){
			var path = $("img", slide).attr("src").split("/");
			$("#name").val(path[path.length-1])
		},
		rightBarHtmlId : "inline"
	});

	$("input[name='target']").click(function(){

		var index = location.pathname.lastIndexOf("/");
		location.href= location.pathname.substring(0, index)
			+ "/" +this.value
	})
});
