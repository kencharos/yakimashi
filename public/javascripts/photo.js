$(document).ready(function(){

	var swipeboxParam = {
		rightBar : true,
		rightBarInitial : function(slide){
			initialDetail($("img", slide).attr("src"))
		},
		rightBarUpdate : function(){
			updateDetail()
		},
		rightBarHtmlId : "inline_content"
	}
	// ui refresh
	var updateTile = function() {
		var zero = $("#zero").is(":checked");
		var noDisp = $("#nodisp_check").is(":checked");


		$("div.tile .swipebox").unbind('click');
		var print =0;
		$("div.tile").each(function(){
			$("a",$(this)).removeClass("swipebox")

			if ((!noDisp && $(this).hasClass("nodisp")) || (zero & $("span.count", $(this)).text() == "0")) {
				$(this).fadeOut(800)
			} else {
				var swipebox = $("a",$(this));
				swipebox.addClass("swipebox")
				$(this).fadeIn(800)
				print += parseInt($("span.count", $(this)).text());
			}
		})
		$("#print").text(print);

		$("div.tile .swipebox").swipebox(swipeboxParam);
	}

	// event handling
	$("#zero").click(updateTile)
	$("#nodisp_check").click(updateTile)

	$("#sheetbutton").click(function(){
		location.href=location.pathname + "/" +$("#sheet").val()
	})
	$("#command").click(function() {
		var c = "export SRC=\nexport DIST=\n\n"
		var res = new Array();
		$("div.tile").each(function(){
			if (!$(this).hasClass("nodisp")) {
				var size = parseInt($("span.count", $(this)).text())
				var name = $("img", $(this)).attr("src").split("/").reverse()[0];
				var label = [];
				var labeltext = $("span.label", $(this)).text();
				if (labeltext != "") {
					label = $("span.label", $(this)).text().split(",")
				}

				for (var l in label) {
					res.push("cp $SRC/" + name +" $DIST/" + label[l] + "_"+name);
				}
				for (var i = 0; i < size-label.length; i++) {
					res.push("cp $SRC/" + name +" $DIST/" + "Z_etc" + i +"_"  +name);
				}
			}
		})

		for (var i in res) {
			c += res[i] + "\n"
		}

		alert(c)
	})

	// ajax functions
	var initialDetail = function(img) {
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

				$("#printDate").text("");
				var tile = $("div .tile a[href='" + img +"']").parent();
				$("#printDate").text($("span.date", tile).text());
			}
		);
	}

	var updateDetail = function() {
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
				var tile = $("div.tile img[src$='" + imgUrl + "']").parent().parent().parent();
				$("span.count", tile).text(cnt + "")
				if (json.noDisp) {
					tile.addClass("nodisp")
				} else {
					tile.removeClass("nodisp")
				}
				$("a",tile).attr("title", json.comment);
				$("a.img",tile).attr("alt", json.comment);


				$("span.label",tile).text(array.join(","));
				updateTile()
		})
	}

	updateTile();
});
