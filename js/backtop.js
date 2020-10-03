/*返回顶部：jquery实现*/
    
    $("#back-top").hide();
    // 淡入淡出效果
    $(function() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('#back-top').fadeIn();
            } else {
                $('#back-top').fadeOut();
            }
        });
    );

    // 回到顶部
        $('#back-top>a').click(function() {
            $('body,html').animate({
                scrollTop: 0
            }, 500);
            return false;
        });
        
/*返回底部：jquery实现*/

$("#back-down").hide();
// 淡入淡出效果
$(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop()>100) {
            $('#back-down').fadeIn();
        } else {
            $('#back-down').fadeOut();
        }
    });
);

// 回到底部
    $('#back-down>a').click(function() {
        $('body,html').animate({
            scrollTop:$(document).height()-$(window).height()
        }, 500);
        return false;
    });
