/*!
 * dform.js v0.3.7
 */
;(function($) {
	var dform = {
		init : function ($formCnt, options) {
			var base = this;
			
			base.options	= options;
			base.$formCnt	= $formCnt;
			base.$form		= $formCnt.find('form');
			base.$subBtn	= $formCnt.find('.subBtn');
			
			base.$errCnt	= $formCnt.find('.errorMsg');
			base.$sucCnt	= $formCnt.find('.successMsg');
			
			base.$subBtn.prop('disabled',false);
			
			// data defaults
			base.$form.find('input, textarea').each(function(index, element) {
				if ($(this).val() == '') $(this).val($(this).attr("data-default"));

				$(this).focus(function() {
					if ($(this).val() == $(this).attr("data-default")) $(this).val('');
				});
				
				$(this).blur(function() {
					if ($(this).val() == '') $(this).val($(this).attr("data-default"));
				});
			});
			
			// hide error messages
			base.$form.find('.'+base.options.errorFieldMsgClass).hide();
			
			// setup actions
			base.$subBtn.click(function(e) {
				e.preventDefault();
				base.post($(this));
			});
			
			base.$form.submit(function(e){
				e.preventDefault();
				base.post(base.$subBtn);
			});
		},
		
		debug : function(msg) {
			if (this.options.debug==true && typeof window.console !== 'undefined') console.log(msg);
		},
		
		post : function($clicked) {
			var base = this;
			
			if ($.isFunction(base.options.onBefore)) base.options.onBefore.call(this);
			
			// hide message containers
			base.$errCnt.hide();
			base.$sucCnt.hide();
			
			// hide error messages
			base.$formCnt.find('.'+base.options.errorFieldMsgClass).hide();
			
			base.$subBtn.prop('disabled',true);
			base.$form.find('input, textarea').each(function(){
				if ($(this).val() == $(this).attr('data-default')) {
					$(this).val('');
				}
			});
			
			base.debug('post');
			
			base.$formCnt.bload(base.options.bloadOpts, function(bload){
				//var bload = bload;
				base.debug('bload');
				base.$formCnt.find('[name="submitted"]').val('yes');

				var url = base.$form.attr('action');
				if (url == '') url = document.URL;
				
				var form_data = base.$form.serializeArray();
				if ($clicked != 'undefined' && $clicked.attr('name') && $clicked.attr('value')) {
					form_data.push({'name':$clicked.attr('name'),'value':$clicked.attr('value')});
				}
				
				$.ajax({
					type: 'POST',
					cache: false,
					url: url,
					data: form_data,
					dataType: 'json',
					success: function(data, status){
						base.debug('success');
						base.debug(data);
						
						// if using onComplete
						if ($.isFunction(base.options.onComplete)) {
							base.options.onComplete.call(this, data);
							return;
						} else {
							// custom modalType
							if (typeof data.modalType !== 'undefined') base.options.modalType = data.modalType;
							
							// undo error class
							if (base.options.errorClass !== false) {
								base.$formCnt.find('.'+base.options.errorClass).removeClass(base.options.errorClass);
							}
							
							// using success/error handlers
							if (data.status == 'error') {
								base.debug('status error');
								base.$form.find('input, textarea').each(function(){
									if ($(this).val() == '' && $(this).attr('data-default')) {
										$(this).val($(this).attr('data-default'));
									}
								});

								base.handleError(data);
							} else {
								base.debug('status success');
								base.handleSuccess(data);
							}
						}
					},
					error: function(data, status, error){
						base.debug('error');
					},
					complete: function(data, status){
						base.debug('complete');
						
						bload.hide();
						base.$subBtn.prop('disabled',false);
					}
				});
			});
		},
		
		handleError : function(data) {
			var base = this;
			
			// call custom onError function
			if ($.isFunction(base.options.onError)) base.options.onError.call(this, data);
			
			// handle full message display 
			if (base.options.fullErrorType !== false) {
				var msg = (typeof data.msg !== 'undefined') ? data.msg : base.$errCnt.html(); // set message
				var fullErrorType = (typeof data.fullErrorType !== 'undefined' && data.fullErrorType !== '') ? data.fullErrorType : base.options.fullErrorType; // override type

				switch (fullErrorType) {
					case 'modal':
						base.modalMessage({message:msg, type:'error'});
						break
					case 'show':
						base.$errCnt.html(msg).show();
						break;
				}
			}
			
			// show error field messages
			if (data.errFlds && data.errFlds.length > 0) {
				for (i=0; i < data.errFlds.length; i++) {
					if (data.errMsgs && data.errMsgs[data.errFlds[i]]) base.$formCnt.find('.dfrm_' + data.errFlds[i]).html(data.errMsgs[data.errFlds[i]]);
					base.$formCnt.find('.dfrm_' + data.errFlds[i]).show();
				}
			}
			
			// add error class
			if (typeof data.errFlds !== 'undefined' && data.errFlds != null) {
				for (i=0; i < data.errFlds.length; i++) {
					var ele = base.$form.find('[name="'+data.errFlds[i]+'"]');
					
					switch (base.options.errorClassType) {
						case 'parent':
							ele.closest( base.options.errorClassSelector ).addClass(base.options.errorClass);
							base.debug('Add Err Class ['+base.options.errorClass+'] to parent div of ['+data.errFlds[i]+']');
							break
						case 'input':
							ele.addClass(base.options.errorClass);
							base.debug('Add Err Class ['+base.options.errorClass+'] to input ['+data.errFlds[i]+']');
							break;
					}
				}
			}
			
			// scrolltop
			var winScrollTop = $(window).scrollTop();
			if (base.options.scrollTopOnError == true) {
				base.scrollTop();
			}
			
			// scroll first
			if (base.options.scrollFirstOnError == true) {
				var firstError = base.$formCnt.find('.'+base.options.errorClass+':first');
				if (firstError.length > 0) {
					if (winScrollTop > firstError.offset().top) {
						$('html, body').animate({
							scrollTop: firstError.offset().top - base.options.scrollOffsetOnError
						}, base.options.scrollSpeed);
					}
				}
			}
		},
		
		handleSuccess : function(data) {
			var base = this;
			
			if ($.isFunction(base.options.onSuccess)) base.options.onSuccess.call(this, data);
			
			var msg = (typeof data.msg !== 'undefined' && data.msg !== '') ? data.msg : base.$sucCnt.html();
			var successType = (typeof data.successType !== 'undefined' && data.successType !== '') ? data.successType : base.options.successType;
			
			if (successType !== false) {
				redirectTo = (typeof data.redirect !== 'undefined' && data.redirect != null) ? data.redirect : (typeof base.options.redirect !== 'undefined') ? base.options.redirect : false;
				switch (successType) {
					case 'modalRedirect':
						base.modalMessage({message:msg, type:'success', autohide:base.options.modalAutoHide, redirect:redirectTo});
						break;
					case 'modal':
						base.modalMessage({message:msg, type:'success', autohide:base.options.modalAutoHide});
						break;
					case 'redirect':
						base.redirect(redirectTo);
						break;
					case 'closeModal':
						parent.TINY.box.hide();
						break;
					case 'reloadParent':
						parent.window.location = parent.window.location;
						break;
					case 'show':
						base.$sucCnt.html(msg).show();
						break;
					case 'showhide':
						base.$sucCnt.html(msg).show();
						var successHides = base.$formCnt.find('.frmSuccessHide');
						if (successHides.length > 0) {
							successHides.hide();
						} else {
							base.$form.hide();
						}
						break;
				}
			}
			
			if (base.options.scrollTopOnSuccess == true) {
				base.scrollTop();
			}
		},
		
		scrollTop : function() {
			var base = this;
			
			var winScrollTop = $(window).scrollTop();
			if (winScrollTop > base.$formCnt.offset().top) {
				$('html, body').animate({
					scrollTop: base.$formCnt.offset().top - base.options.scrollOffsetOnError
				}, base.options.scrollSpeed);
			}
		},
		
		modalMessage : function(options) {
			var base = this;
			
			var defaults = {
				title: false,
				message: '',
				type: 'success',
				autohide: false,
				redirect: false
			};
			var options =  $.extend(true, defaults, options);
			
			if (options.title == false) options.title = (options.type == 'success') ? 'Success' : 'Error';
			
			switch(base.options.modalType) {
				case 'fancybox':
					if (typeof $.fancybox === 'undefined') {
						alert('missing fancybox');
					} else {
						$.fancybox.open({
							type: 'html',
							autoHeight: true,
							minHeight: 50,
							content: options.message
						});
						if (options.autohide !== false) {
							setTimeout(function(){
								$.fancybox.close();
							}, (options.autohide));
						}
					}
					break;
				case 'tinybox': // tinbox has display bug in bootstrap
					if (typeof TINY === 'undefined') {
						alert('missing tinybox');
					} else {
						var tinyOpts = {html:options.message,animate:false,close:false,mask:false,boxid:options.type,autohide:(options.autohide / 1000)};
						if (options.redirect !== false) {
							tinyOpts.closejs = function(){
								 base.redirect(options.redirect);
							};
						}
						TINY.box.show(tinyOpts);
					}
					break;
				case 'jqueryui' :
					$('#dformModalJqueryUI').dialog('destroy');
					if ($('#dformModalJqueryUI').length == 0) {
						$('body').append('<div id="dformModalJqueryUI" title=""><p id="dformModalMessageJqueryUI"></p></div>');
					}
					console.log('Title:'+options.title);
					$('#dformModalJqueryUI').attr('title',options.title); // set title
					$('#dformModalMessageJqueryUI').html(options.message); // set message

					$('#dformModalJqueryUI').dialog({
						buttons: {
							Close: function() {
								$(this).dialog('close');
							}
						}
					});
					break;
				default: // bootstrap
					if ($('#dformModal').length == 0) {
						$('body').append('<div class="modal" id="dformModal" role="dialog"aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="dformModalTitle"></h4></div><div class="modal-body"><p id="dformModalMessage"></p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div>');
					}
					$('#dformModalTitle').html(options.title); // set title
					$('#dformModalMessage').html(options.message); // set message
					$('#dformModalTitle').removeClass('text-success').removeClass('text-danger');
					if (options.type == 'success') $('#dformModalTitle').addClass('text-success');
					if (options.type == 'error') $('#dformModalTitle').addClass('text-danger');
					$('#dformModal').modal({show:true}); // ,backdrop:false

					if (options.autohide !== false) {
						setTimeout(function(){
							$('#dformModal').modal('hide');
							if (options.redirect !== false) base.redirect(options.redirect);
						}, (options.autohide));
					}
					break;
			}
		},
		
		redirect : function(redirectTo) {
			window.location = redirectTo;
		} 
	};


	// plugin
	$.fn.dform = function(options, callback) {		
		var defaults = {
			debug		: false,	// debug mode
			bloadOpts	: {},	// bload options
			
			// callbacks
			onBefore	: false,
			onComplete	: false,	// if set will not to success/error just returns data for custom handling
			onSuccess	: false,	// if set will call before doing its own success handler
			onError		: false,	// if set will call before doing its own error handler
			
			// field error handling
			errorClassType		: 'parent',
			errorClassSelector	: 'div',
			errorClass			: 'has-error',
			errorFieldMsgClass	: 'dfrmErrorMsg', // class to add to custom field error messags. 
			scrollTopOnError	: false, // scroll to top of container on error (usefull for large forms)
			scrollOffsetOnError	: 0,
			scrollFirstOnError	: false, // scroll to first error field (if out of view)
			scrollSpeed			: 500, 
			scrollTopOnSuccess	: true, // scroll to top of container on success (usefull for large forms)
			
			// single error message display
			fullErrorType	: 'show',		// show, modal
			modalType		: 'bootstrap',	// bootstrap / tinybox / fancybox / jqueryui,
			modalAutoHide	: 3000,			// autohide time
			successType		: 'showhide',	// showhide, show, redirect, modal, modalRedirect
			redirect		: false			// location to redirect to on success
		};
		
		var options =  $.extend(true, defaults, options);
		
		return this.each(function() {
			if ($(this).data('dformInit') === true) {
				var dformInst = $(this).data('dform');
			} else {
				$(this).data('dformInit', true);
				var dformInst = Object.create(dform);
				$(this).data('dform', dformInst);
			}

			dformInst.init($(this), options);

			return dformInst;
		});
	};
})(jQuery);