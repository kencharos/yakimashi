$(document).ready(function(){
	$(".group").colorbox({rel:'group', transition:"none", width:"90%", height:"90%",slideshow:true,slideshowSpeed:4000});
	$(".inline").colorbox({inline:true, width:"80%", height:"100%"});
	$("#slide").click(function(){ $(".group:first").click() })
	
});