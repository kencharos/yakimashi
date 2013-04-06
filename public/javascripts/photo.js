$(document).ready(function(){
	$(".group").colorbox({rel:'group', transition:"none", width:"90%", height:"90%",slideshow:true,slideshowSpeed:4000});
	$(".inline").colorbox({inline:true, width:"90%", height:"90%"});
	$(".inline").click(function(){initialModal($("img",$(this)).attr("src"))})
	$("#slide").click(function(){ $(".group:first").click() })
	$("#zero").click(function(){
		var on = this.checked;
		$("div.tile").each(function(){
			if ($("span.count", $(this)).text() == "0") {
				if (on) {
					$(this).data("hide", true)
					$(this).fadeOut(1000)
				} else {
					$(this).removeData("hide")
					$(this).fadeIn(1000)
				}
			}
		})
	})
	$("#nodisp").click(function(){
		var on = this.checked;
		noDispProc(on)
	})
	$("#next").click(function() {
			updateModal(function() {
			var imgUrl = $("#img").attr("src")
			var list = filterImage();
			var i = indexImg(list, imgUrl);
			if (i == list.length - 1) {
				initialModal(list[0])
			} else {
				initialModal(list[i + 1])
			}
		})
	})
	$("#prev").click(function() {
			updateModal(function(){
			var imgUrl = $("#img").attr("src")
			var list = filterImage();
			var i = indexImg(list, imgUrl);
			if (i == 0) {
				initialModal(list[list.length -1])
			} else {
				initialModal(list[i - 1])
			}
		})
	})
	var filterImage = function(){
		var array = new Array()
		$("div.tile").each(function(){
			if($(this).data("hide") != undefined) {
				array.push($("img",$(this)).attr("src"))
			}
		})
		return array
	}
	var indexImg = function(array, url) {
		for (i in array) {
			if (array[i] == url) {
				return i
			}
		}
		return -1
	}
	var noDispProc = function(disp){
		$("div.nodisp").each(function(){
			if (disp) {
				$(this).removeData("hide")
				$(this).fadeIn(1000)
			} else {
				$(this).data("hide", true)
				$(this).fadeOut(1000)
			}
		})
	}
	var initialModal = function(img) {
		console.log(img)
		var path = img.split("/")
		$.get("/photo",
    		{"album": path[path.length - 2], "name":path[path.length - 1]}
    	).then(
			function(data){

				$("#inline_content :checkbox").removeAttr("checked")

				$("#img").attr({src:img})
				// setup form
				$("#id").val(data.id)
				$("#album").val(data.album)
				$("#name").val(data.name)
				if (data.noDisp) {
					$("#noDisp").attr("checked", true)
				}
				$("#comment").val(data.comment)
				$("#album").val(data.album)
				$("#etc").val(data.etc)

				for(i in data.labels) {
						var label = data.labels[i]
						$("#label_" + label).attr("checked", true)
				}
			}
		);
	}

	var updateModal = function(cont) {

		var array = new Array()
		$("#inline_content input[type='checkbox']").each(function(){
			if (this.id.indexOf("label_") == 0 && this.checked) {
				array.push(this.name)
			}
		})
		var json = {
			id:$("#id").val(),
			album:$("#album").val(),
			name:$("#name").val(),
			comment:$("#comment").val(),
			etc:parseInt($("#etc option:selected").val()),
			noDisp:$("#noDisp").is(':checked'),
			labels:array
		};

		$.ajax({url:"/photo",
			type:"POST",
			data:json,
			data:JSON.stringify(json),
			dataType: "json",
			contentType:"application/json; charset=utf-8"
		}).then(
			function(data) {
				var imgUrl = $("#img").attr("src")
				var cnt = data.labels.length + data.etc
				var tile = $("div.tile img[src='" + imgUrl + "']").parent()
				$("span", tile).text(cnt + "")
				if (data.nodisp) {
					tile.addClass("nodisp")
				} else {
					this.removeClass("nodisp")
				}
				// fadein
				var zeroCheck = $("#zero").is(':checked');
				var noDisp = !$("#noDisp").arrt("checked");
				if (tile.data("hide") != undefined) {
					// now fadeout
					if ((zeroCheck && cnt > 0) || (noDisp && !data.noDisp)) {
						tile.removeData("hide")
						tile.fadeIn(1000)
					}
				} else {
					// now fadeOut
					if ((zeroCheck && cnt == 0) || (nodisp && data.nodisp)) {
						tile.data("hide", true)
						tile.feadOut(1000)
					}
				}
				cont()
			}
		)
	}

	noDispProc(false)
});