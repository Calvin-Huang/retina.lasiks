$(function(){
    var originHeight = 53;
    initialLocation();

    $('#back-top').click(function(){
        $('html, body').animate({
            scrollTop : 0
        }, 1000);
    });
    $('#start').click(function(){
        moveToRowBlock(1);
    });
    $('.next').find('a').each(function(index){
        this.onclick = function() {
            moveToRowBlock(index + 2);
        }
    });

    $('.last').on('click', 'a', function(e){
        $('html, body').stop(true).animate({
            scrollTop : $(document).height() - $(window).height() + 'px'
        }, 10000, 'easeOutExpo');
    });

    $('#retina-submit').on('click', function(){
        var model = $('#model');
        $('#small-ticket').animate({
            'margin-top' : -300
        }, 3000, function(){
            $('#small-ticket').animate({
                'opacity' : 0,
            });
        });

        setTimeout(function(){
            $('#ticket').fadeIn(2000);
        }, 3000);

        stop = true;

        $(this).animate({
            'margin-top' : -44
        }, 3000, 'easeOutExpo', function(){
            var stop = false;
            flowMotion(this);

            $(this).hover(function(){
                stop = true;
            }, function(){
                stop = false;
                flowMotion(this);
            });

            this.onclick = function(){
                $.ajax({
                    url : '/api.php',
                    type : 'GET',
                    data : {
                        action : 'addTicketLog',
                        token : $('#token').text(),
                        name : $('#name').val(),
                        year : $('#year').val(),
                        email : $('#email').val(),
                        nearsight : $('.css-checkbox:checked').val(),
                        lefteye : $('#lefteye').val(),
                        righteye : $('#righteye').val(),
                    },
                    dataType : 'json',
                    success : function(){
                        window.alert('感謝您的回覆!');
                        window.location.href = '';
                    },
                    error : function(jqXHR, textStatus, errorThrown){
                        var response = JSON.parse(jqXHR.responseText);
                        if (response.message == '重複發送請求時間小於設定值600秒') {
                            window.alert('感謝您的熱心參與 ~ 但是請你等10分鐘後才可以填寫另一張票券唷');
                        } else {
                            window.alert(response.message);
                        }
                    }
                });
            }
        });
        function flowMotion(render){
            if (!stop) {
                var button = $(render);
                var current = button.data('flow');
                var top = parseInt($(render).css('top').replace('px', ''), 10);
                var flow = 10;
                if (typeof(current) == 'undefined') {
                    current = 0;
                }
                var next = (current + 1) % 2;
                $(render).animate({
                    top : top + flow * ((current == 0) ? -1 : 1)
                }, 2500, function(){
                    button.data('flow', next);
                    flowMotion(render);
                });
            }
        }
    });

    // 當滾動到地球高度再過一半的時候開始把票機送出來
    $(window).scroll(function(){
        var scrollTop = $(document).scrollTop();
        var totalHeight = $(document).height() - $(window).height() - 300;
        var earthPosition = totalHeight - 388;

        // console.log('scrollTop : ' + scrollTop + ', earthPosition : ' + totalHeight);
        if (scrollTop >= totalHeight) {
            $('#earth').animate({
                bottom : 0
            }, 10000, 'easeOutExpo');
        }
    });

    var slideContainer = $('#slideContainer');
    slideContainer.children('img').css({
        'position' : 'absolute',
        'display' : 'none'
    });
    // slideContainer.css({
    //     'cursor' : 'pointer'
    // });
    $('.hint-button').on('click', function(){
        $('#illustrate').show(); 
        $(this).css({
            display : 'none'
        });
        $('.animate-button:first').animate({
            top: 260,
            left: 872
        }, 5000, 'easeOutExpo');
    });
    function fadeInSlide(index) {
        var current = index;
        var next = (index + 1) % slideContainer.children('img').size();
        $(slideContainer.children('img').get(current)).fadeOut(1000);
        $(slideContainer.children('img').get(next)).fadeIn(1000);
        setTimeout(function() {

            fadeInSlide(next);
        }, 3500);
    };

    // 開始輪播
    fadeInSlide(0);

    function moveToRowBlock(number) {
        var offsetTop = $('.row').get(number).offsetTop - 10;
        $('html, body').stop(true).animate({
            scrollTop : offsetTop,
        }, 980);
    }

    function moveToBottom(){

    }

    function initialLocation() {
        var hash = parseInt(location.hash.replace('#', ''), 10);
        if (hash && hash != $('.row').length - 1) {
            moveToRowBlock(hash);
        } else {

        }
    }

    $('.mangabook').mangabox();

    $('.mangabox').find('.page').each(function(index){
        if (index % 2 == 1) {
            $(this).html('<div>' + $(this).html() + '</div>');
        }
    });

    var animateImages = [
        ['images/airetina-next01.png', '<img src="images/airetina-next01a.png"><img src="images/airetina-next01b.png"><img src="images/airetina-next01c.png">'],
        ['images/airetina-next01.png', '<img src="images/airetina-next01a.png"><img src="images/airetina-next01b.png"><img src="images/airetina-next01c.png">'],
        ['images/airetina-next02a.png', '<img src="images/airetina-next02a.png"><img src="images/airetina-next02b.png"><img src="images/airetina-next02c.png">'],
        ['images/airetina-next03a.png', '<img src="images/airetina-next03a.png"><img src="images/airetina-next03b.png"><img src="images/airetina-next03c.png">'],
        ['images/airetina-next04a.png', '<img src="images/airetina-next04a.png"><img src="images/airetina-next04b.png"><img src="images/airetina-next04c.png">'],
        ['images/airetina-next05.png', '<img src="images/airetina-next05a.png"><img src="images/airetina-next05b.png"><img src="images/airetina-next05c.png">'],
        ['images/airetina-next05.png', '<img src="images/airetina-next05a.png"><img src="images/airetina-next05b.png"><img src="images/airetina-next05c.png">'],
    ];

    $('.animate-button').eq(0).on('click', function(){
        setTimeout(function(){
            $(this).hide();
            $('.animate-button').eq(1).animate({
                top : 240,
                left: 872
            }, 3000, 'easeOutExpo', function(){
                var stop = false;

                flowMotion(this);

                $(this).hover(function(){
                    stop = true;
                }, function(){
                    stop = false;
                    flowMotion(this);
                });

                function flowMotion(render){
                    if (!stop) {
                        var button = $(render);
                        var current = button.data('flow');
                        var top = parseInt($(render).css('top').replace('px', ''), 10);
                        var flow = 10;
                        if (typeof(current) == 'undefined') {
                            current = 0;
                        }
                        var next = (current + 1) % 2;
                        $(render).animate({
                            top : top + flow * ((current == 0) ? -1 : 1)
                        }, 2500, function(){
                            button.data('flow', next);
                            flowMotion(render);
                        });
                    }
                }
            });
        });
    });

    $('#illustrate .page div').each(function(index){
        $(this).css({
            margin : '2px 0px 3px 30px'
        });
    });

    $('.animate-button').each(function(index){

        var stop = false;

        $(this).append(animateImages[index][1]).css({
            'background-image' : 'url(' + animateImages[index][0] + ')'
        });

        if (index != 1) {
            flowMotion(this);
        }
        stopMotion(this);

        $(this).hover(function(){
            stop = true;
        }, function(){
            stop = false;
            stopMotion(this);
            if (index != 1) {
                flowMotion(this);
            }
        }).click(function(){
            stop = true;
        });

        function stopMotion(render){
            if (!stop) {
                var imagesRender = $(render).find('img');
                var button = $(render);
                var current = button.data('index');
                if (typeof(current) == 'undefined') {
                    current = 0;
                }
                var next = (current + 1) % imagesRender.size();
                current = parseInt(current, 10);

                $(imagesRender).eq(current).fadeOut(350);
                $(imagesRender).eq(next).fadeIn(350);
                setTimeout(function(){
                    button.data('index', next);
                    stopMotion(render);
                }, 350);
            }
        }

        function flowMotion(render){
            if (!stop) {
                var button = $(render);
                var current = button.data('flow');
                var top = parseInt($(render).css('top').replace('px', ''), 10);
                var flow = 10;
                if (typeof(current) == 'undefined') {
                    current = 0;
                }
                var next = (current + 1) % 2;
                $(render).animate({
                    top : top + flow * ((current == 0) ? -1 : 1)
                }, 2500, function(){
                    button.data('flow', next);
                    flowMotion(render);
                });
            }
        }
    });

    $('.css-checkbox').on('click', function(){
        $('.css-checkbox').not($(this)).attr('checked', false);
        // $(this).attr('checked', true);
    });
});