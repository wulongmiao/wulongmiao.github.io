/*返回底部：jquery实现*/
$(document).ready(function() {


    // 回到底部
        $('#back-down>a').click(function() {
            $('body,html').animate({
                scrollTop:document.body.scrollHeight-document.body.clientHeight
            }, 500);
            return false;
        });
});
