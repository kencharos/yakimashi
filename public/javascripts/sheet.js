$(document).ready(function(){
	$(".swipebox").swipebox();
	
	var index = location.pathname.lastIndexOf("/");
	$("#sheetbutton").click(function(){
		location.href= location.pathname.substring(0, index)
			+ "/" +$("#sheet").val()
	})
	var target = location.pathname.substring(index+1)
	$("#sheet").val(target)
});