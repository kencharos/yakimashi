$(document).ready(function(){
	$(".group").colorbox({rel:'group', transition:"none", width:"90%", height:"90%",slideshow:true,slideshowSpeed:4000});
	$(".inline").colorbox({inline:true, width:"90%"});
	$(".inline").click(function(){$("#img").attr({src:$("img",$(this)).attr("src")})})
	$("#slide").click(function(){ $(".group:first").click() })
	$("#zero").click(function(){
		var on = this.checked;
		$("div.tile").each(function(){
			if ($("span.count", $(this)).text() == "0") {
				if (on) {
					$(this).fadeOut(1000)
				} else {
					$(this).fadeIn(1000)
				}
			}
		})
	})
	var noDispProc = function(disp){
		$("div.nodisp").each(function(){
			if (disp) {
				$(this).fadeIn(1000)
			} else {
				$(this).fadeOut(1000)
			}
		})
	}
	$("#nodisp").click(function(){
		var on = this.checked;
		noDispProc(on)
	})
	noDispProc(false)




});