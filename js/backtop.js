/*返回顶部：jquery实现*/
    // 回到顶部
        $('#back-top>a').click(function() {
            $('body,html').animate({
                scrollTop: 0
            }, 500);
            return false;
        });

// 回到底部
    $('#back-down>a').click(function() {
        $('body,html').animate({
            scrollTop:$(document).height()
        }, 500);
        return false;
    });
