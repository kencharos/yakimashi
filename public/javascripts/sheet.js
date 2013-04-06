$(document).ready(function(){
	$(".group").colorbox({rel:'group', transition:"none", width:"90%", height:"100%",slideshow:true,slideshowSpeed:4000})
	$("#slide").click(function(){
		$(".group:first").click() }
	)
	var index = location.pathname.lastIndexOf("/");
	$("#sheetbutton").click(function(){
		location.href= location.pathname.substring(0, index)
			+ "/" +$("#sheet").val()
	})
	var target = location.pathname.substring(index+1)
	$("#sheet").val(target)
});