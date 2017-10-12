GevManLazyLoadPlugin = new (function($){
    var effects = ['effect-slideup', 'effect-slidedown', 'effect-slidefromleft', 'effect-slidefromright', 'effect-zoomin', 'effect-zoomout', 'effect-rotate', 'effect-skew']
    this.useCSSAnimations = jQuery('.cssanimations').length;
    this.defaultDelay = undefined;
    this.defaultSpeed = undefined;
    var callbacks = []

    var that = this;
    function getWindowHeight() {
        var myWidth = 0, myHeight = 0;
        if( typeof( window.innerWidth ) == 'number' ) {
            //Non-IE
            myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            //IE 6+ in 'standards compliant mode'
            myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            //IE 4 compatible
            myHeight = document.body.clientHeight;
        }

        return myHeight
    };

    function appearBox(element, element_top, bottom_of_window) {
        var buffer = $(element).outerHeight()/2;
        if( bottom_of_window > element_top + buffer) {
            setTimeout(function(){
                if ( that.useCSSAnimations ) {
                    element.removeClass('trigger');
                } else {
                    element.removeClass('trigger').animate({'opacity':'1'}, 0);
                }
                /* Check if there is a callback associated with this element. */
                if (element.data('callback-id') !== undefined) {
                    var callback_id = element.data('callback-id');
                    if(callback_id >= 0 && callback_id < callbacks.length)
                        callbacks[callback_id](element);
                }
            }, element.data('delay') !== undefined? element.data('delay') : that.defaultDelay);
        }
    };

    function registerAnimation(element, effect, delay, speed, callback) {
        var effect = effect || 'random'
        if(effect == 'random'){
            effect = effects[Math.floor(Math.random() * effects.length)];
        }
        $(element).addClass('lazy-load-box').addClass('trigger').addClass(effect);

        if(delay !== undefined)
            $(element).data('delay', delay);

        if(speed !== undefined)
            $(element).data('speed', speed);

        if(callback !== undefined) {
            count = callbacks.push(callback);
            $(element).data('callback-id', count - 1);
        }
    };
    this.registerAnimation = registerAnimation;

    $.fn.GevManLazyLoadPlugin = function(effect, delay, speed, callback) {
        $(this).each(function(){
            registerAnimation(this, effect, delay, speed, callback);
        });
    };

    $(function() {
        if(!device.mobile() && !device.tablet()){
            $('.lazy-load-box.trigger').each( function(i){
                var element_offset = $(this).offset();
                var element_top = element_offset.top;
                var bottom_of_window = $(window).scrollTop() + getWindowHeight();
                appearBox($(this), element_top, bottom_of_window);
            });

            $(window).scroll( function() {
                $('.lazy-load-box.trigger').each( function(i){
                    var element_offset = $(this).offset(),
                        element_top = element_offset.top,
                        bottom_of_window = $(window).scrollTop() + getWindowHeight();

                    appearBox($(this), element_top, bottom_of_window);
                });

            });
        } else {
            $('.lazy-load-box').each( function(i) {
                $(this).removeClass('trigger').css('opacity', '1');
            });
        }
    });
})(jQuery);