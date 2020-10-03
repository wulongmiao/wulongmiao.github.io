/*返回底部：jquery实现*/
$(document).ready(function() {
    
    $("#back-down").hide();
    // 淡入淡出效果
    $(function() {
        $(window).scroll(function() {
            if ($(this).scrollTop()< 100) {
                $('#back-down').fadeIn();
            } else {
                $('#back-down').fadeOut();
            }
        });
    );

    // 回到底部
        $('#back-down>a').click(function() {
            $('body,html').animate({
                scrollTop:document.body.scrollHeight + 'px'
            }, 500);
            return false;
        });
});
