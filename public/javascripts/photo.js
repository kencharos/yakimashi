$(document).ready(function(){
	//$(".group").colorbox({rel:'group', transition:"none", width:"90%", height:"90%",slideshow:true,slideshowSpeed:4000});
	var updateTile = function() {
		var zero = $("#zero").is(":checked");
		var noDisp = $("#nodisp_check").is(":checked");
		$("div.tile").each(function(){
			if ((!noDisp && $(this).hasClass("nodisp")) || (zero & $("span.count", $(this)).text() == "0")) {
				$("span.hide",$(this)).removeClass("group")
				$(this).fadeOut(800)
			} else {
				var group = $("span.hide",$(this));
				group.addClass("group")
				$(this).fadeIn(800)
			}
		})
	}


	$(".inline").colorbox({inline:true, width:"90%", height:"90%"});
	$(".inline").click(function(){initialModal($("img",$(this)).attr("src"))})
	$("#slide").click(function(){
		$("div.tile .group")
			.colorbox({rel:'group', transition:"none", width:"90%", height:"100%",slideshow:true,slideshowSpeed:4000})
		$("#cboxContent").on({
		  'swipeleft' : function(ev) {
		    $("#cboxNext").click()
		  },
		  'swiperight' : function(ev) {
		    $("#cboxPrevious").click()
		  }
		});

		$(".group:first").click() })
	$("#zero").click(updateTile)
	$("#nodisp_check").click(updateTile)
	$("#next").click(function() {
			updateModal(function(imgUrl){
				var list = filterImage();
				var i = indexImg(list, imgUrl);
				if (i == list.length - 1) {
					alert("先頭に戻ります。")
					initialModal(list[0])
				} else {
					initialModal(list[i + 1])
				}
		})
	})
	$("#prev").click(function() {
			updateModal(function(imgUrl){
				var list = filterImage();
				var i = indexImg(list, imgUrl);
				if (i == 0) {
					alert("最後にいきます。")
					initialModal(list[list.length -1])
				} else {
					initialModal(list[i - 1])
				}
		})
	})
	$("#sheetbutton").click(function(){
		location.href=location.pathname + "/" +$("#sheet").val()
	})
	$("#command").click(function() {
		var c = "export SRC=\nexport DIST=\n\n"
		$("div.tile").each(function(){
			if (!$(this).hasClass("nodisp")) {
				var size = parseInt($("span.count", $(this)).text())
				var name = $("img", $(this)).attr("src").split("/").reverse()[0];
				console.log(size +":"+$("img", $(this)).attr("src"))
				for (var i = 0; i < size; i++) {
					c = c + "$SRC/" + name +" $DIST/" + name.split(".")[0] +"_" + i +"." + name.split(".")[1] + "\n"
				}
			}
		})
		alert(c)
	})
	$('#inline_content').on({
		  'swipeleft' : function(ev) {
		    $("#next").click()
		  },
		  'swiperight' : function(ev) {
		    $("#prev").click()
		  }
		});
	var filterImage = function(){
		var array = new Array()
		$("div.tile").each(function(){
			if(!$(this).hasClass("nodisp")) {
				array.push($("img",$(this)).attr("src"))
			}
		})
		return array
	}
	var indexImg = function(array, url) {

		for (i in array) {
			if (array[i].indexOf(url) >= 0) {
				return parseInt(i)
			}
		}
		return -1
	}
	var initialModal = function(img) {

				console.log(img)
		var path = img.split("/")
		$.get("/photo",
    		{"album": path[path.length - 2], "name":path[path.length - 1]}
    	).then(
			function(data){

				$("#inline_content :checkbox").removeAttr("checked")
				for(i in data.labels) {
						var label = data.labels[i]
						// if reopen inline window, checkbox is not chekced by attr("checked", true)
						$("#label_" + label).each(function(){this.click()})
				}
				if (data.noDisp) {
					$("#noDisp").each(function(){this.click()})
				}
				$("#img").attr({src:img})
				// setup form
				$("#id").val(data.id)
				$("#album").val(data.album)
				$("#name").val(data.name)
				$("#comment").val(data.comment)
				$("#album").val(data.album)
				$("#etc").val(data.etc)
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
			data:JSON.stringify(json),
			dataType: "text", //responce data tyoe
			contentType:"application/json; charset=utf-8"
		}).done(function(imgUrl) {
				var cnt = json.labels.length + json.etc
				var tile = $("div.tile span[href$='" + imgUrl + "']").parent()
				$("span.count", tile).text(cnt + "")
				if (json.noDisp) {
					tile.addClass("nodisp")
				} else {
					tile.removeClass("nodisp")
				}
				updateTile()
				cont(imgUrl)
		})
	}


	updateTile();
});