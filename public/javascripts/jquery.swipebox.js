/*---------------------------------------------------------------------------------------------

@author       Constantin Saguin - @brutaldesign
@link            http://bsign.co
@github        http://github.com/brutaldesign/swipebox
@version     1.1.1
@license      MIT License

I fork this script.
add follows functions.
- right sidebar and sidebar sunction
----------------------------------------------------------------------------------------------*/

;(function (window, document, $, undefined) {

	$.swipebox = function(elem, options) {

		var defaults = {
			useCSS : true,
			hideBarsDelay : 3000,
			rightBar : false,
			rightBarInitial : function(slide){},
			rightBarUpdate : function(){},
			rightBarHtmlId : ""
		},

			plugin = this,
			$elem = $(elem),
			elem = elem,
			selector = elem.selector,
			$selector = $(selector),
			isTouch = document.createTouch !== undefined || ('ontouchstart' in window) || ('onmsgesturechange' in window) || navigator.msMaxTouchPoints,
			supportSVG = !!(window.SVGSVGElement),
			html = '<div id="swipebox-overlay">\
					<div id="swipebox-slider"></div>\
					<div id="swipebox-caption">\
						<span></span><a id="swipebox-close"></a>\
					</div>\
					<div id="swipebox-right"></div>\
					<div id="swipebox-action">\
						<div id="swipebox-thumbnail"><ul></ul></div>\
						<a id="swipebox-prev"></a>\
						<a id="swipebox-next"></a>\
					</div>\
			</div>';

		plugin.settings = {}

		plugin.init = function(){

			plugin.settings = $.extend({}, defaults, options);

			$selector.click(function(e){
				e.preventDefault();
				e.stopPropagation();
				index = $elem.index($(this));
				ui.target = $(e.target);
				ui.init(index);
			});
		}

		var restore = null;
		var ui = {

			init : function(index){
				this.target.trigger('swipebox-start');
				this.build();
				this.openSlide(index);
				this.openImg(index);
				this.preloadImg(index+1);
				this.preloadImg(index-1);
			},
			build : function(){
				var $this = this;

				$('body').append(html);

				if($this.doCssTrans()){
					$('#swipebox-slider').css({
						'-webkit-transition' : 'left 0.4s ease',
						'-moz-transition' : 'left 0.4s ease',
						'-o-transition' : 'left 0.4s ease',
						'-khtml-transition' : 'left 0.4s ease',
						'transition' : 'left 0.4s ease'
					});
					$('#swipebox-overlay').css({
						'-webkit-transition' : 'opacity 1s ease',
						'-moz-transition' : 'opacity 1s ease',
						'-o-transition' : 'opacity 1s ease',
						'-khtml-transition' : 'opacity 1s ease',
						'transition' : 'opacity 1s ease'
					});
					$('#swipebox-action, #swipebox-caption, #swipebox-right').css({
						'-webkit-transition' : '0.5s',
						'-moz-transition' : '0.5s',
						'-o-transition' : '0.5s',
						'-khtml-transition' : '0.5s',
						'transition' : '0.5s'
					});
					// initial inlinecontent
					if (this.useRight()) {
						restore =$("#" + plugin.settings.rightBarHtmlId).parent();
						var rightBarHtml = $("#" + plugin.settings.rightBarHtmlId).parent().html();
						$("#swipebox-right").html(rightBarHtml)
						restore.html("");
					}
				}

				if(supportSVG){
					var bg = $('#swipebox-close').css('background-image');
					bg = bg.replace('png', 'svg');
					$('#swipebox-action #swipebox-prev,#swipebox-action #swipebox-next,#swipebox-close').css({
						'background-image' : bg
					});
				}

				$elem.each(function(){
					$('#swipebox-slider').append('<div class="slide"></div>');
					// set tumbnail
					$('#swipebox-thumbnail ul').append('<li><img src="' + $(this).attr('href') +'"></img></li>');
				});
				// add move slide to clicked image
				$('#swipebox-thumbnail ul li').click(function() {
						var cur = 0;
						$('#swipebox-thumbnail ul li').each(function() {
							if ($(this).hasClass("current")) {
								cur = $(this).index()
							}
						})
						var diff = $(this).index() - cur
						if (diff > 0) {
							for (var i = 0; i < diff; i++) {
								$this.getNext();
							}
						} else if (diff < 0) {
							for (var i = 0; i < -diff; i++) {
								$this.getPrev();
							}
						}
					}
				)
				// set tumbnail withd
				$('#swipebox-thumbnail ul').width((elem.length * 155) + "px")

				$this.setDim();
				$this.actions();
				$this.keyboard();
				$this.gesture();
				$this.animBars();

				$(window).resize(function() {
					$this.setDim();
				}).resize();
			},

			setDim : function(){
				var sliderCss = {
					width : $(window).width(),
					height : window.innerHeight ? window.innerHeight : $(window).height() // fix IOS bug
				}

				$('#swipebox-overlay').css(sliderCss);

			},

			supportTransition : function() {
				var prefixes = 'transition WebkitTransition MozTransition OTransition msTransition KhtmlTransition'.split(' ');
				for(var i = 0; i < prefixes.length; i++) {
					if(document.createElement('div').style[prefixes[i]] !== undefined) {
						return prefixes[i];
					}
				}
				return false;
			},

			doCssTrans : function(){
				if(plugin.settings.useCSS && this.supportTransition() ){
					return true;
				}
			},

			useRight : function() {
				return plugin.settings.rightBar;
			},
			rightBarInitial : function(slide) {
				 plugin.settings.rightBarInitial(slide);
			},
			rightBarUpdate: function() {
				return plugin.settings.rightBarUpdate();
			},

			gesture : function(){
				if ( isTouch ){
					var $this = this,
					distance = null,
					swipMinDistance = 10,
					startCoords = {},
					endCoords = {};
					var b = $('#swipebox-caption' + (this.useRight() ? ', #swipebox-right' : ''));

					//b.addClass('visible-bars');
					//$this.setTimeout();

					$('#swipebox-slider,#swipebox-caption').bind('touchstart', function(e){

						$(this).addClass('touching');

						endCoords = e.originalEvent.targetTouches[0];
						startCoords.pageX = e.originalEvent.targetTouches[0].pageX;

						$('.touching').bind('touchmove',function(e){
							e.preventDefault();
							e.stopPropagation();
							endCoords = e.originalEvent.targetTouches[0];

						});

						return false;

				}).bind('touchend',function(e){

	           				e.preventDefault();
							e.stopPropagation();
	   						distance = endCoords.pageX - startCoords.pageX;

	       					if( distance >= swipMinDistance ){
	       						// swipeLeft
	       						$this.getPrev();
	       					}else if( distance <= - swipMinDistance ){
	       						// swipeRight
	       						$this.getNext();

	       					}else{
		       					// tap
								$this.toggleImage(endCoords.pageX, endCoords.pageY)
								if(!b.hasClass('visible-bars')){
									$this.showBars();
									//$this.setTimeout();
								}else{
									//$this.clearTimeout();
									$this.hideBars();
								}
			       			}

	       				$('.touching').off('touchmove').removeClass('touching');

						}
					);

           		}
			},

			setTimeout: function(){
				if(plugin.settings.hideBarsDelay > 0){
					var $this = this;
					$this.clearTimeout();
					$this.timeout = window.setTimeout( function(){
						$this.hideBars() },
						plugin.settings.hideBarsDelay
					);
				}
			},

			clearTimeout: function(){
				window.clearTimeout(this.timeout);
				this.timeout = null;
			},

			showBars : function(){
				var b = $('#swipebox-caption, #swipebox-action' + (this.useRight() ? ', #swipebox-right' : ''));
				if(this.doCssTrans()){
					b.addClass('visible-bars');
				}else{
					$('#swipebox-caption').animate({ top : 0 }, 500);
					$('#swipebox-action').animate({ bottom : 0 }, 500);
					if(this.useRight()) $('#swipebox-right').animate({ right : 0 }, 500);
					setTimeout(function(){
						b.addClass('visible-bars');
					}, 1000);
				}
			},

			hideBars : function(){
				var b = $('#swipebox-caption, #swipebox-action' + (this.useRight() ? ', #swipebox-right' : ''));
				if(this.doCssTrans()){
					b.removeClass('visible-bars');
				}else{
					$('#swipebox-caption').animate({ top : '-50px' }, 500);
					$('#swipebox-action').animate({ bottom : '-50px' }, 500);
					if(this.useRight()) $('#swipebox-right').animate({ bottom : '-50%' }, 500);
					setTimeout(function(){
						b.removeClass('visible-bars');
					}, 1000);
				}
			},

			animBars : function(){
				var $this = this;
				var b = $('#swipebox-caption, #swipebox-action' + (this.useRight() ? ', #swipebox-right' : ''));

				//b.addClass('visible-bars');
				//$this.setTimeout();

				$('#swipebox-slider').click(function(e){
					$this.toggleImage(e.pageX, e.pageY);
					if(!b.hasClass('visible-bars')){
						$this.showBars();
					} else {
						$this.hideBars();
					}
				});

				$('#swipebox-action').hover(function() {
				  		$this.showBars();
						b.addClass('force-visible-bars');
						//$this.clearTimeout();

					},function() {
						b.removeClass('force-visible-bars');
						//$this.setTimeout();
				});

			},

			keyboard : function(){
				var $this = this;
				$(window).bind('keyup', function(e){
					e.preventDefault();
					e.stopPropagation();
					if (e.keyCode == 37){
						$this.getPrev();
					}
					else if (e.keyCode==39){
						$this.getNext();
					}
					else if (e.keyCode == 27) {
						$this.closeSlide();
					}
				});
			},

			actions : function(){
				var $this = this;

				if( $elem.length < 2 ){
					$('#swipebox-prev, #swipebox-next').hide();
				}else{
					$('#swipebox-prev').bind('click touchend', function(e){
						e.preventDefault();
						e.stopPropagation();
						$this.getPrev();
						$this.setTimeout();
					});

					$('#swipebox-next').bind('click touchend', function(e){
						e.preventDefault();
						e.stopPropagation();
						$this.getNext();
						$this.setTimeout();
					});
				}

				$('#swipebox-close').bind('click touchend', function(e){
					$this.closeSlide();
				});
			},

			setSlide : function (index, isFirst){
				isFirst = isFirst || false;

				var slider = $('#swipebox-slider');

				if(this.doCssTrans()){
					slider.css({ left : (-index*100)+'%' });
				}else{
					slider.animate({ left : (-index*100)+'%' });
				}

				$('#swipebox-slider .slide').removeClass('current');
				$('#swipebox-slider .slide').eq(index).addClass('current');

				// set tumbnail
				$('#swipebox-thumbnail ul li').removeClass('current');
				var thum = $('#swipebox-thumbnail ul li').eq(index)
				thum.addClass('current');
				var area = $('#swipebox-thumbnail')
				var offset = thum.offset().left;
				if (offset < 0) {
					area.animate({scrollLeft:area.scrollLeft() +offset - 80},'normal')
				} else if ((offset + 154) > area.width()) {
					var diff = (offset + 154) - area.width();
					area.animate({scrollLeft:area.scrollLeft() + diff + 80},'normal')

				}

				this.setTitle(index);
				if (this.useRight()) {
					this.rightBarInitial($elem.eq(index));
				}
				if( isFirst ){
					slider.fadeIn();
				}

				$('#swipebox-prev, #swipebox-next').removeClass('disabled');
				if(index == 0){
					$('#swipebox-prev').addClass('disabled');
				}else if( index == $elem.length - 1 ){
					$('#swipebox-next').addClass('disabled');
				}
			},

			openSlide : function (index){

				$('body').addClass('swipebox');
				$(window).trigger('resize'); // fix scroll bar visibility on desktop
				this.setSlide(index, true);
			},

			preloadImg : function (index){
				var $this = this;
				setTimeout(function(){
					$this.openImg(index);
				}, 1000);
			},

			openImg : function (index){
				var $this = this;
				if(index < 0 || index >= $elem.length){
					return false;
				}

				$this.loadImg($elem.eq(index).attr('href'), function(){
					$('#swipebox-slider .slide').eq(index).html(this);
				});
			},


			setTitle : function(index, isFirst){
				$('#swipebox-caption span').empty();
				// add current of all caption
				$('#swipebox-caption span').append((index + 1) + " of " + $elem.length);

				if($elem.eq(index).attr('title')){
					$('#swipebox-caption span').append(" - " + $elem.eq(index).attr('title'));
				}
			},

			loadImg : function (src, callback){
				var img = $('<img>').on('load', function(){
					callback.call(img);
				});

				img.attr('src',src);
			},

			getNext : function (){
				var $this = this;
				index = $('#swipebox-slider .slide').index($('#swipebox-slider .slide.current'));
				if(index+1 < $elem.length){
					if (this.useRight) {
						console.log("upd")
						this.rightBarUpdate()
					}
					index++;
					$this.setSlide(index);
					$this.preloadImg(index+1);
				}
				else{

					$('#swipebox-slider').addClass('rightSpring');
					setTimeout(function(){
						$('#swipebox-slider').removeClass('rightSpring');
					},500);
				}
			},

			getPrev : function (){
				var $this = this;
				index = $('#swipebox-slider .slide').index($('#swipebox-slider .slide.current'));
				if(index > 0){
					if (this.useRight) {
						this.rightBarUpdate()
					}
					index--;
					$this.setSlide(index);
					$this.preloadImg(index-1);
				}
				else{

					$('#swipebox-slider').addClass('leftSpring');
					setTimeout(function(){
						$('#swipebox-slider').removeClass('leftSpring');
					},500);
				}
			},

			toggleImage : function (px, py){
				var $this = this;
				var img = $('#swipebox-slider .slide.current img');
				var imgDom = img.get(0);
				var onImage = imgDom.x <= px && px <= (imgDom.x + imgDom.width)
						&& imgDom.y <= py && py <= (imgDom.y + imgDom.height)
				if (!onImage) {
					return;
				}

				if (img.hasClass("zoom")) {
					img.removeClass("zoom")
					imgDom.style.width = null
					return
				}
				var box = img.parent().get(0);
				if (imgDom.width < box.clientWidth && imgDom.height < box.clientHeight) {
					img.addClass("zoom");
					imgDom.style.width = (imgDom.width * 1.15) +"px";
				}

			},

			closeSlide : function (){
				var $this = this;
				// restore inline content
				if (this.useRight()) {

					this.rightBarUpdate();
					var rightBarHtml = $("#swipebox-right").html();
					restore.html(rightBarHtml)
					$("#swipebox-right").html("")
				}
				$(window).trigger('resize');
				$('body').removeClass('swipebox');
				$this.destroy();
			},

			destroy : function(){
				var $this = this;
				$(window).unbind('keyup');
				$('body').unbind('touchstart');
				$('body').unbind('touchmove');
				$('body').unbind('touchend');
				$('#swipebox-slider').unbind();
				$('#swipebox-overlay').remove();
				$elem.removeData('_swipebox');
				$this.target.trigger('swipebox-destroy');
 			}

		}

		plugin.init();

	}

	$.fn.swipebox = function(options){
		if (!$.data(this, "_swipebox")) {
			var swipebox = new $.swipebox(this, options);
			this.data('_swipebox', swipebox);
		}
	}

}(window, document, jQuery));
