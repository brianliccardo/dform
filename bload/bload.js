/*!
 * bload.js v0.4.0
 */
;(function($) {
	var bload = function(tomask, options, callback){
		this.showing = false;
		this.$tomask = tomask;
		this.options = options;
		this.callback = callback;
		this.show();
	};
	
	bload.prototype.show = function(){
		var base = this;

		if (base.showing == true) return;

		// simple / image
		var pos = base.$tomask.offset();
		if (base.options.fullScreen == false) {
			switch (base.options.imageAlign) {
				case 'top':
					var left = pos.left + ( (base.$tomask.width() - (base.options.imageDims.w + (base.options.imagePadding * 2))) / 2 );
					var top = pos.top + 8;
					break
				case 'bottom':
					var left = pos.left + ( (base.$tomask.width() - (base.options.imageDims.w + (base.options.imagePadding * 2))) / 2 );
					var top = pos.top + ( (base.$tomask.height() - (base.options.imageDims.h + (base.options.imagePadding * 2))) - 8);
					break
				case 'left':
					var left = pos.left + 8;
					var top = pos.top + ( (base.$tomask.height() - (base.options.imageDims.h + (base.options.imagePadding * 2))) / 2 );
					break;
				case 'right':
					var left = pos.left + ( (base.$tomask.width() - (base.options.imageDims.w + (base.options.imagePadding * 2))) - 8 );
					var top = pos.top + ( (base.$tomask.height() - (base.options.imageDims.h + (base.options.imagePadding * 2))) / 2 );
					break;
				default: // centered
					var left = pos.left + ( (base.$tomask.width() - (base.options.imageDims.w + (base.options.imagePadding * 2))) / 2 );
					var top = pos.top + ( (base.$tomask.height() - (base.options.imageDims.h + (base.options.imagePadding * 2))) / 2 );
					break;
			}
			var maskPosition = 'absolute';
		} else {
			var left = ( ($(window).width() - (base.options.imageDims.w + (base.options.imagePadding * 2))) / 2 );
			var top = ( ($(window).height() - (base.options.imageDims.h + (base.options.imagePadding * 2))) / 2 );
			var maskPosition = 'fixed';
		}
		var maskCss = {
			padding : base.options.imagePadding + 'px',
			backgroundColor : '#000',
			position : maskPosition,
			borderRadius : '4px 4px 4px 4px',
			top : top,
			left : left,
			zIndex: 10000,
		};

		base.$mask = $('<div />').css(maskCss);

		var showBloading = (base.$tomask.is(':visible') == false && base.options.fullScreen == false) ? false : true;

		if (showBloading) {
			if (base.options.imagePath === false) {
				base.$mask.append($('<div />').addClass('bloading'));
			} else {
				base.$mask.append($('<div />').css({
					backgroundImage : 'url(' + base.options.imagePath + ')',
					width : base.options.imageDims.w + 'px',
					height : base.options.imageDims.h + 'px'
				}));
			}
		}

		callback = base.callback;
		base.showing = true;

		// create/append full overlay
		if (base.options.overlay.show === true) {
			var css = {
				position : 'fixed',
				top : 0,
				left : 0,
				width : '100%',
				height : '100%',
				backgroundColor: base.options.overlay.color,
				zIndex: 9999,
			};

			if (base.options.fullScreen == false) {
				css.position = 'absolute';
				css.top = pos.top+'px';
				css.left = pos.left+'px';
				css.width = base.$tomask.width()+'px';
				css.height = base.$tomask.height()+'px';
			}

			if (showBloading) {
				base.$overlay = $('<div />').css(css);
				$("body").append( base.$overlay.fadeTo(base.options.fadeInSpeed, base.options.overlay.opacity) );
			}
		}
		// append image
		$("body").append(base.$mask.fadeTo(base.options.fadeInSpeed, base.options.maskOpacity, function(){
				if ($.isFunction(callback)) {
					callback.call(this, base);
				}
			}));
	};
	
	bload.prototype.hide = function(){
		this.showing = false;
		this.$mask.remove();
		if (this.options.overlay.show == true) this.$overlay.remove();
	};

	// plugin
	$.fn.bload = function(options, callback) {		
		var defaults = {
			fadeInSpeed		: 300,
			maskOpacity		: .4,
			imagePath		: false,
			imagePadding	: 16,
			imageDims		: {w:32,h:32},
			imageAlign		: 'center',
			fullScreen		: false,
			overlay : {
				show		: false,
				color		: '#000',
				opacity		: .2				
			}
		};
		
		if ($.isFunction(options)) {
			callback = options;
			options = defaults;
		} else {
			var options =  $.extend(true, defaults, options);
		}
		
		if ($(this).data('bloadInit') === true) {
			var bloadInst = $(this).data('bload');
		} else {
			$(this).data('bloadInit', true);
			var bloadInst = new bload($(this), options, callback);
			$(this).data('bload', bloadInst);
		}

		return bloadInst;
	};
})(jQuery);