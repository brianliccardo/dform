/*!
 * dform.js v0.2.1
 */
(function($) {
	var Dform = function(formCnt, options) {
		var form = formCnt.find('form');
		var subBtn = formCnt.find('.subBtn');
		var errCnt = formCnt.find('.errorMsg');
		var sucCnt = formCnt.find('.successMsg');
		
		function setup() {
			// data defaults
			form.find('input, textarea').each(function(index, element) {
				if ($(this).val() == '') $(this).val($(this).attr("data-default"));

				$(this).focus(function() {
					if ($(this).val() == $(this).attr("data-default")) $(this).val('');
				});
				$(this).blur(function() {
					if ($(this).val() == '') $(this).val($(this).attr("data-default"));
				});
			});
			
			// setup actions
			subBtn.click(function(e) {
				e.preventDefault();
				post($(this));
			});
			form.submit(function(e){
				e.preventDefault();
				post();
			});
		}
		
		function handleError(data) {
			if ($.isFunction(options.onError)) options.onError.call(this);
			form.find('.valmessage').hide();
			sucCnt.hide();
			var msg = (data.msg) ? data.msg : errCnt.html();
			var dspErrMsg = (typeof data.dspErrMsg !== 'undefined' && data.dspErrMsg !== '') ? data.dspErrMsg : options.dspErrMsg;
			
			switch (dspErrMsg) {
				case 'modal':
					TINY.box.show({html:msg,animate:false,mask:false,boxid:'error'});
					break
				case 'show':
					errCnt.html(msg).show();
					break;
			}
			if (data.errFlds && data.errFlds.length > 0) {
				for (i=0; i < data.errFlds.length; i++) {
					if (data.errMsgs && data.errMsgs[data.errFlds[i]]) form.find('.val_' + data.errFlds[i]).html(data.errMsgs[data.errFlds[i]]);
					form.find('.val_' + data.errFlds[i]).show();
				}
			}
			if (options.addErrClass !== false) {
				for (i=0; i < data.errFlds.length; i++) {
					var ele = form.find('[name="'+data.errFlds[i]+'"]');
					if (options.bootstrap == true) {
						ele.parent('div').addClass(options.addErrClass);
					} else {
						ele.addClass(options.addErrClass);
					}
				}
			}
		}
		
		function handleSuccess(data) {
			if ($.isFunction(options.onSuccess)) options.onSuccess.call(this);
			form.find('.valmessage').hide();
			errCnt.hide();
			var msg = (typeof data.msg !== 'undefined' && data.msg !== '') ? data.msg : sucCnt.html();
			var dspSucMsg = (typeof data.dspSucMsg !== 'undefined' && data.dspSucMsg !== '') ? data.dspSucMsg : options.dspSucMsg;
			
			// remove error classes
			if (options.addErrClass !== false) {
				form.find('.'+options.addErrClass).removeClass(options.addErrClass);
			}
			
			switch (dspSucMsg) {
				case 'modal':
					//form.reset();
					TINY.box.show({html:msg,animate:false,close:false,mask:false,boxid:'success',autohide:3});
					break;
				case 'redirect':
					redirectTo = (data.redirect) ? data.redirect : options.redirect;
					window.location = redirectTo;
					break;
				case 'closeParent':
					parent.TINY.box.hide();
					break;
				case 'show':
					sucCnt.show();
					break;
				case 'showhide':
					sucCnt.show();
					var successHides = formCnt.find('.frmSuccessHide');
					if (successHides.length > 0) {
						successHides.hide();
					} else {
						form.hide();
					}
					break;
				default:
					break;
			}
		}
		
		function post(clicked) {
			if ($.isFunction(options.onBefore)) options.onBefore.call(this);
			subBtn.prop('disabled',true);
			form.find('input, textarea').each(function(){
				if ($(this).val() == $(this).attr('data-default')) {
					$(this).val('');
				}
			});
			if (options.debug==true) console.log('post');
			var bl = formCnt.bload(function(){
				if (options.debug==true) console.log('bload');
				formCnt.find('[name="submitted"]').val('yes');

				var url = form.attr('action');
				if (url == '') url = document.URL;
				
				var form_data = form.serializeArray();
				if (clicked != 'undefined' && clicked.attr('name') && clicked.attr('value')) {
					form_data.push({'name':clicked.attr('name'),'value':clicked.attr('value')});
				}
				
				$.post(url, form_data, function (data) {
					if (options.debug==true) console.log(data);
					bl.hide();
					subBtn.prop('disabled',false);
					if (data.error == true) {
						if (options.debug==true) console.log('error');
						form.find('input, textarea').each(function(){
							if ($(this).val() == '' && $(this).attr('data-default')) {
								$(this).val($(this).attr('data-default'));
							}
						});
						// undo error class
						if (options.addErrClass !== false) {
							form.find('.'+options.addErrClass).removeClass(options.addErrClass);
						}
						handleError(data);
					} else {
						if (options.debug==true) console.log('success');
						handleSuccess(data);
					}
				}, 'json');
			});
		}
		
		setup();
	};

   // plugin
	$.fn.dform = function(options) {
		var defaults = {
			dspErrMsg	: 'show', // modal, show
			dspSucMsg	: 'none', // modal, redirect, closeparent
			redirect	: '',
			addErrClass	: false, // add class to field that has an error
			debug		: false,
			bootstrap	: false,
			onBefore	: function(){},
			onSuccess	: function(){},
			onError		: function(){},
		}
		
		// override default settings with overridden vars
		var options =  $.extend(defaults, options);
		
		return this.each(function() {
			new Dform($(this), options);
		});
	};
})(jQuery);