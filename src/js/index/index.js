define([
    'jquery',
    'temp',
    'swiper',
    'lazyload',
    'text!template/index.html',
    'text!template/bolck-list.html',
    'text!template/recommend-list.html',
    'text!template/dl-list.html'
], function($, temp, Swiper, lazyload, str, block, recommend, dltext) {
    //首页table切换
    var index = 0;
    $('.header span').on('click', function() {
        index = $(this).index();
        change();
    });

    function change() {
        $('.header span').eq(index).addClass('active').siblings().removeClass('active');
        $('.content').css({
            transform: 'translate(-' + index * 100 + '%,0)'
        })
    };

    //渲染书城内容
    $.ajax({
        url: '/api/index', //api/list?curpage=1&limit=20
        dataType: "json",
        success: initBookCity
    });
    //书架内容
    $.ajax({
        url: "/api/bookself",
        dataType: 'json',
        success: initBookSelf
    });

    function initBookSelf(data) {
        temp(block, data.items, '.book-self-cont>div');
        $("img.lazy").lazyload({
            effect: "fadeIn",
            container: $(".book-self")
        });
        $('.book-self-btn').on('click', function() {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                temp(block, data.items, '.book-self-cont>div');
            } else {
                temp(dltext, data.items, '.book-self-cont>div');
            }
            $("img.lazy").lazyload({
                effect: "fadeIn",
                container: $(".book-self")
            });
        })
    };

    function initBookCity(data) {
        //轮播图和主结构
        temp(str, data.items[0].data, '.book-city-cont');
        new Swiper('.banner', {
            loop: true,
            autoplay: {
                delay: 1000
            }
        });
        //本周最火
        temp(block, data.items[1].data.data, '.week-hot-cont');
        //限时免费
        data.items[5].data.data.map(function(v) {
            v.title = v.data.title;
            v.cover = v.data.cover;
            v.fiction_id = v.data.fiction_id;
        });
        temp(block, data.items[5].data.data, '.time-free-cont');
        //重磅推荐
        var index = 0;
        temp(recommend, changedata(index, data.items[2].data.data), '.recommend-cont');
        //女生最爱
        temp(dltext, changedata(index, data.items[3].data.data), '.gril-cont');
        //男生最爱
        temp(dltext, changedata(index, data.items[4].data.data), '.boy-cont');
        //精选专题
        temp($('.text').html(), data.items[6], '.sift-cont');
        //图片懒加载
        $("img.lazy").lazyload({
            effect: "fadeIn",
            container: $(".book-city")
        });
        //上拉加载
        loadMore('.book-city');
        //换一换
        $('.book-city').on('click', '.change-btn', function() {
            var index = $(this).data('id') * 1;
            var ind = $(this).attr('data'); //2 重磅推荐 34 女生男生最爱
            var obj = data.items[ind];
            index++;
            index = index % (obj.data.count / 5);
            $(this).data('id', index);
            var str = ind == 2 ? recommend : dltext;
            temp(str, changedata(index, obj.data.data), '.' + $(this).prev().attr('class'));
        });
    };


    function changedata(ind, arr) {
        var limit = 5;
        var startind = ind * limit; //0 5
        var endind = ind * limit + limit; //4 9
        var newarr = arr.slice(startind, endind);
        newarr.map(function(v, i) {
            v.count = i + 1;
        });
        return newarr;
    }
    //页码
    var pagenum = 0;

    function loadMore(parent) {
        if (pagenum >= 3) {
            $('.loading').html('暂无更多数据');
            return false;
        }
        //可视区域的高度
        var clientH = $(parent).height();
        $(parent).on('scroll', function() {
            //最大滚动距离
            var maxh = $(this).children().height() - clientH;
            if ($(this).scrollTop() + 40 >= maxh) {
                $(this).off('scroll');
                pagenum++;
                render(pagenum);
            }
        });
    };

    function render(n) {
        $.ajax({
            url: "/api/loadmore",
            data: {
                pagenum: n,
                limit: 20
            },
            dataType: "json",
            success: function(data) {
                temp(dltext, data.items, '.load-cont-list', 1);
                loadMore('.book-city');
                $("img.lazy").lazyload({
                    effect: "fadeIn",
                    container: $(".book-city")
                });
            }
        })
    }
});