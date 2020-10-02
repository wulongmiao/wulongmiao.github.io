/*返回顶部：jquery实现*/
$(document).ready(function() {
    
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
});
