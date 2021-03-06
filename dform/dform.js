/*!
 * dform.js v0.4.7
 */
;(function($) {
    var dform = function(){

    };

    dform.prototype.init = function($formCnt, options) {
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
    };

    dform.prototype.debug = function(msg) {
        if (this.options.debug==true && window.console) console.log(msg);
    };

    dform.prototype.post = function($clicked){
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
            base.debug('bload');
            base.$formCnt.find('[name="submitted"]').val('yes');

			var url = base.$form.attr('action');
			if (url == '') url = document.URL;
            if (false !== base.options.url)
            {
                url = base.options.url;
            }

            var form_data = base.$form.serializeArray();
            if ($clicked && $clicked.attr('name') && $clicked.attr('value')) {
                form_data.push({'name':$clicked.attr('name'),'value':$clicked.attr('value')});
            }
            
            var dataType = (true === base.options.jsonp) ? 'jsonp' : 'json';

            $.ajax({
                type: 'POST',
                cache: false,
                url: url,
                data: form_data,
                beforeSend : base.options.beforeSend,
                dataType: dataType,
                success: function(data, status){
                    base.debug('success');
                    base.debug(data);

                    // if using onComplete
                    if ($.isFunction(base.options.onComplete)) {
                        base.options.onComplete.call(this, data);
                        return;
                    } else {
                        // custom modalType
                        if (data.modalType) base.options.modalType = data.modalType;

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
    };

    dform.prototype.addErrorClass = function(fld) {
        var base = this;

        var ele = base.$form.find('[name="'+fld+'"]');

        switch (base.options.errorClassType) {
            case 'parent':
                ele.closest( base.options.errorClassSelector ).addClass(base.options.errorClass);
                base.debug('Add Err Class ['+base.options.errorClass+'] to parent div of ['+fld+']');
                break
            case 'input':
                ele.addClass(base.options.errorClass);
                base.debug('Add Err Class ['+base.options.errorClass+'] to input ['+fld+']');
                break;
        }
    };

    dform.prototype.handleError = function(data){
        var base = this;

        // call custom onError function
        if ($.isFunction(base.options.onError)) base.options.onError.call(this, data);

        // handle full message display 
        if (base.options.fullErrorType !== false) {
            var msg = (data.msg) ? data.msg : base.$errCnt.html(); // set message
            var fullErrorType = (data.fullErrorType) ? data.fullErrorType : base.options.fullErrorType; // override type

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

        // add error class AND returned field messages
        if (data.errFldMsgs !== undefined) {
            base.debug("Going to add error messages");
            for (var key in data.errFldMsgs) {
                base.debug(" - "+key);
                // error class
                base.addErrorClass(key);

                // error messages
                var ele = base.$form.find('[name="'+key+'"]');
                var $errMsgsCnt = ele.closest( base.options.errorClassSelector ).find('.dfrmErrMsgs');
                if ($errMsgsCnt.length > 0) {
                    $errMsgsCnt.show();
                    for (var i=0; i < data.errFldMsgs[key].length; i++) {
                        $errMsgsCnt.append('<li>'+data.errFldMsgs[key][i]+'</li>');
                    }
                }
            }
        } else {
            base.debug('No Error Messages');
        }

        // add error class
        if (data.errFlds !== undefined && data.errFlds.length > 0) {
            base.debug('Going to add error class to fields by '+base.options.errorClassType);
            for (var i=0; i < data.errFlds.length; i++) {
                base.addErrorClass(data.errFlds[i]);
            }
        } else {
            base.debug('No Error Fields');
        }

        // scrolltop
        var winScrollTop = $(window).scrollTop();
        if (base.options.scrollTopOnError == true) {
            base.debug('Scrolling to top');
            base.scrollTop();
        }

        // scroll first
        if (base.options.scrollFirstOnError == true) {
            base.debug('Scrolling to first element with error class ['+base.options.errorClass+']');
            var firstError = base.$formCnt.find('.'+base.options.errorClass+':first');
            if (firstError.length > 0) {
                if (winScrollTop > firstError.offset().top) {
                    base.debug('Scroll to ['+firstError.offset().top+']');
                    $('html, body').animate({
                        scrollTop: firstError.offset().top - base.options.scrollOffsetOnError
                    }, base.options.scrollSpeed);
                } else {
                    base.debug('Not going to scroll cause ['+winScrollTop+'] <= ['+firstError.offset().top+']');
                }
            }
        }
    };

    dform.prototype.handleSuccess = function(data){
        var base = this;

        if ($.isFunction(base.options.onSuccess)) base.options.onSuccess.call(this, data);

        var msg = (data.msg) ? data.msg : base.$sucCnt.html();
        var successType = (data.successType) ? data.successType : base.options.successType;

        if (successType) {
            redirectTo = (data.redirect) ? data.redirect : (base.options.redirect) ? base.options.redirect : false;

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
    };

    dform.prototype.scrollTop = function(){
        var base = this;

        var winScrollTop = $(window).scrollTop();
        if (winScrollTop > base.$formCnt.offset().top) {
            $('html, body').animate({
                scrollTop: base.$formCnt.offset().top - base.options.scrollOffsetOnError
            }, base.options.scrollSpeed);
        }
    };

    dform.prototype.modalMessage = function(options){
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
                if (!$.fancybox) {
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
                if (!TINY) {
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
            case 'bootbox':
                bootbox.dialog({
                    message: options.message,
                    title: options.title
                });

                if (options.autohide !== false) {
                    setTimeout(function(){
                        bootbox.hideAll();
                        if (options.redirect !== false) base.redirect(options.redirect);
                    }, (options.autohide));
                }
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
    };

    dform.prototype.redirect = function(redirectTo){
        window.location = redirectTo;
    };

    // plugin
    $.fn.dform = function(options, callback) {		
        var defaults = {
            debug		: false,	// debug mode
            bloadOpts	: {},	// bload options
            beforeSend  : function(){}, // before send on ajax
            
            url : false, // manually set url
            jsonp : false, // set to jsonp
            
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
                var dformInst = new dform();
                $(this).data('dform', dformInst);
            }

            dformInst.init($(this), options);

            return dformInst;
        });
    };
})(jQuery);