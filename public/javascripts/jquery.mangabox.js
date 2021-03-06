(function($){
    $.fn.mangabox = function(options){
        var defaultDisplay = 0;
        var animateTime = 500;
        var width = 1000;
        var height = 600;

        if (typeof(options) != 'undefined') {
            if (typeof(options.defaultDisplay) != 'undefined') {
                defaultDisplay = options.defaultDisplay;
            }
            if (typeof(options.speed) != 'undefined') {
                animateTime = options.speed;
            }

            if (typeof(options.width) != 'undefined') {
                width = options.width;
            }

            if (typeof(options.height) != 'undefined') {
                height = options.height;
            }
        }
        $('body').append('<style>.mangabox{width:' + width + 'px;height:' + height + 'px;}</style>');
        $(this).addClass('mangabox');

        $('.mangabox > div').each(function(index){
            $(this).addClass('animate-block').children('div').each(function(){
                $(this).addClass('page');
            });
        });

        $('.mangabox').each(function(){
            var total = $(this).find('.animate-block').length;
            var prevBlock = '<div class="prev"></div>';
            var nextBlock = '<div class="next animate-button"></div>';
            
            if (defaultDisplay > total - 1) {
                defaultDisplay = total - 1;
            }

            $($(this).find('div.animate-block').get(defaultDisplay)).addClass('active');
            if (defaultDisplay == 0) {
                prevBlock = '<div class="prev disable"></div>';
            }
            if (defaultDisplay == total - 1) {
                nextBlock = '<div class="next animate-button disable"></div>';
            }
            $(this).prepend(prevBlock).append(nextBlock).data('display', defaultDisplay);
        })


        $('.mangabox .prev').on('click', function(e){
            var mangabox = $(this).parent();
            var index = mangabox.data('display');

            if (index != 0) {
                var current = $(mangabox.find('.animate-block').get(index));
                var next = $(mangabox.find('.animate-block').get(index - 1));
                current.removeClass('active');
                next.addClass('active');
                current.fadeOut(animateTime, function(){
                });
                next.fadeIn(animateTime, function(){
                    mangabox.data('display', index - 1);
                    mangabox.find('.next').removeClass('disable');
                });

                if (index - 1 == 0) {
                    $(this).addClass('disable');
                }
            }
        });
        $('.mangabox .next').on('click', function(e){
            var mangabox = $(this).parent();
            var index = mangabox.data('display');
            var total = mangabox.find('div.animate-block').length;
            if (total - 1 != index) {
                var current = $(mangabox.find('.animate-block').get(index));
                var next = $(mangabox.find('.animate-block').get(index + 1));
                current.removeClass('active');
                next.addClass('active').css({display:'none'});
                current.fadeOut(animateTime, function(){
                });
                next.fadeIn(animateTime, function(){
                    mangabox.data('display', index + 1);
                    mangabox.find('.prev').removeClass('disable');
                });

                if (index + 1 == total - 1) {
                    $(this).addClass('disable');
                }
            }
        });
        
    }
})(jQuery);