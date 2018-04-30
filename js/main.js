/**
 * @file slide
 * @author author-duanwenjian(duanwenjianvip@gmail.com.cn)
 *         author-...(email)
 * @createTime 2018/4/28 - 上午11:14
 */
"use strict";
(function (window) {
    function slide(el, cfg) {
        var _timerID = null;
        var _clearID = null;
        /**
         * slide 初始化 cfg{object}
         * @param {array | default: []} images :
         * @param {string | default: 'slide'} slideEffect : 'slide'|'fadeout' 轮播效果, 左右轮播或者淡入淡出
         * @param {boolean | default: true } autoSlide : true | false 是否自动轮播
         * @param {number | default: 5000} slideInterval : ms 自动轮播的时间间隔
         * @param {function} sliderWillSlide : callback 将要 slide 的时候调用的回调函数, 传递参数: 当前 slide, 将要出现的 slide
         * @param {function} sliderDidSlide : callback function slide 结束的时调用的回调函数, 传递参数: 当前 slide, 上一个 slide
         * */
        var config = {
            images: cfg.images || [],
            ele: document.querySelectorAll(el)[0],
            slides: null,//document.querySelectorAll(el)[0].children[0].children,
            slideEffect: cfg.slideEffect || 'slide',
            autoSlide: cfg.autoSlide || true,
            direction: cfg.direction || 'right',
            slideInterval: cfg.slideInterval || 5000,
            sliderWillSlide: cfg.sliderWillSlide || function () {
            },
            sliderDidSlide: cfg.sliderDidSlide || function () {
            },
            activeIndex: 0,//以数据驱动显示
            slideLength: 0,//cfg.images&&cfg.images.length
            animationsTime: 300
        };

        var _screenWidth = config.ele.offsetWidth;
        // 内部方法
        //内部获取配置方法
        var _get = function (n) {
            return config[n];
        };
        //内部设置变量方法
        var _set = function (n, v) {
            if (v === undefined) {
                return false;
            }
            config[n] = v;
        };
        /**
         * 生成随机颜色
         * @param null
         * */
        var _getColor = function () {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            return "rgb(" + r + ',' + g + ',' + b + ")";
        }
        //初始化方法 设置轮播自动开始
        var _init = function () {
            //生成页面元素
            //获取 目标元素容器
            var sContent = _get('ele');
            // 创建div元素
            var wra = document.createElement('DIV');
            //设置 class 样式
            wra.className = 'slide-wrapper';
            // 获取设置的 轮播样式
            var slideEffect = _get('slideEffect');
            // css animation time
            var animationTime = _get('animationsTime');
            // 判断轮播样式
            if (slideEffect === 'slide') {
                //左右轮播
                _setStyle(wra, {
                    transitionDuration: animationTime + "ms",
                    transform: "translate3d(" + (-1 * _screenWidth) + "px, 0px, 0px)"
                });
                // wra.style = "transition-duration:"+animationTime+"ms;transform:translate3d(" + (-1 * _screenWidth) + "px, 0px, 0px);";
            } else if (slideEffect === 'fadeout') {
                //淡入淡出
                //wra.style = "";
            }
            ;
            //获取需要展示的元素 数量
            var eleArr = _get('images');
            // 循环生成 原属详细内容
            for (var i = 0, len = eleArr.length; i < len; i++) {
                //为向左轮播添加过度 缓存样式
                if (i == 0) {
                    slideEffect === 'slide' && wra.appendChild(_createDivEle(eleArr[eleArr.length - 1]));
                }
                wra.appendChild(_createDivEle(eleArr[i]));
                //为向右添加过度缓存样式
                if (i == eleArr.length - 1 && slideEffect === 'slide') {
                    //目前生成元素个数
                    var _l = wra.children.length;
                    //第一个 位置 的过度 slide 的颜色等于 最后一个
                    wra.children[0].style.backgroundColor = wra.children[_l - 1].style.backgroundColor;
                    //添加 最后一个 过度 slide
                    wra.appendChild(_createDivEle(eleArr[0]));
                    //最后一个 位置 的过度 slide 的颜色等于 第二个
                    wra.children[_l].style.backgroundColor = wra.children[1].style.backgroundColor;
                }
            }
            //内容添加到容器
            sContent.appendChild(wra);
            //数据缓存需要操作的 dom 元素
            _set('slides', wra.children);
            _set('slideLength', eleArr.length);

            //获取自动播放属性
            if (_get('autoSlide') === true) {
                //清除历史 定时器 id
                clearInterval(_timerID);
                //设置定时器 轮播
                _timerID = setInterval(_autoSlide, _get('slideInterval'));
                //淡入淡出显示 第一个
                slideEffect === 'fadeout' && _showSlide(0);
            }
        };

        /**
         * 生成单个slide
         * @param {string} html ：页面内容
         * */
        var _createDivEle = function (html) {
            //创建 div 元素
            var div = document.createElement('DIV');
            //获取 轮播 样式以类型生成相应的 轮播元素
            var slideEffect = _get('slideEffect');
            //判断轮播样式
            if (slideEffect === 'slide') {
                div.className = 'slide-item active-slide';
            } else if (slideEffect === 'fadeout') {
                div.className = 'slide-item active-fadeOut';
            }
            div.innerHTML = 'Slide ' + html;
            div.style.backgroundColor = _getColor();
            return div;
        };

        /**
         * 显示指定 主要应用于淡入淡出样式
         * @param {number} index ：指定下标
         * */
        var _showSlide = function (index) {
            //获取所有的 slide
            var slides = _get('slides');
            var len = _get('slideLength');
            //求余 判断显示的内容
            index = index % len;
            //如果是 第一个轮播以后 便设置第一个样式
            if (index >= 1) {
                _setStyle(slides[index - 1], {
                    zIndex: -1,
                    opacity: 0
                });
                // slides[index - 1].setAttribute('style', 'z-index:-1;opacity:0');
            } else {
                //如果是第一个 那么上一个便是 最后一个
                _setStyle(slides[len - 1], {
                    zIndex: -1,
                    opacity: 0
                });
                // slides[len - 1].setAttribute('style', 'z-index:-1;opacity:0');
            }
            //回调当前元素
            var eli = index;
            //动画之前回调 传入当前元素 和 下一个元素
            _sliderWillSlide(eli, eli + 1);
            //设置当前 样式显示
            _setStyle(slides[index], {
                zIndex: 1,
                opacity: 1
            });
            // slides[index].setAttribute('style', 'z-index:1;opacity:1');
            //动画结束回调
            _sliderDidSlide(eli, eli - 1);
            index++;
            //设置下一个显示 位置
            _set('activeIndex', index);
        };
        /**
         * 设置样式
         * @param {element} ele 需要设置的元素
         * @param  {object} style 样式
         * */
        var _setStyle = function (ele, style) {
            for (var i in style) {
                ele.style[i] = style[i];
            }
            return ele;
        };
        /**
         * 移动至指定位置 主要应用于左右轮播样式
         * @param {number} index ：指定位置的下标 0 开始
         * */
        var _moveTo = function (index) {
            // css animation time
            var cssAnimationTime = _get('animationsTime');
            //定义移动 c3 动画
            var transitionDuration = cssAnimationTime + 'ms', transform, x;
            //获取轮播总数
            var len = _get('slideLength');
            //设置过度slide 和 第一个 slide 切换
            var animationTime = _get('slideInterval');
            //判断左右移动方向
            if (_get('direction') == 'right') {
                //右边移动 计算移动位置
                x = '-' + ((index + 1) * _screenWidth) + 'px';
                //如果下一个 是最后一个 提前定义最后一个和第一个的切换动画
                if (index === (len - 1)) {
                    //定于切换动画之前 清除以前的切换动画定时器
                    clearTimeout(_clearID);
                    //定义最后一个 预备动画和第一个的切换
                    _clearID = setTimeout(function () {
                        // var transitionDuration = 'transition-duration:0ms', transform;
                        // transform = 'transform:translate3d(' + (-1 * _screenWidth) + 'px, 0px, 0px)';
                        _setStyle(_get('ele').children[0], {
                            transitionDuration: '0ms',
                            transform: 'translate3d(' + (-1 * _screenWidth) + 'px, 0px, 0px)'
                        });
                        // _get('ele').children[0].setAttribute('style', transitionDuration + ';' + transform);
                        _set('activeIndex', 0);
                    }, animationTime + cssAnimationTime);
                }
            } else {
                //左边移动计算 移动位置
                x = '-' + (index * _screenWidth) + 'px';
                //如果是第一个 清除以前定义的定时器 并且定义定时器 为 过度动画和 最后一个元素的切换
                if (index === 0) {
                    clearTimeout(_clearID);
                    //定义第一个元素之前的过度动画 和最后一个元素的切换
                    _clearID = setTimeout(function () {
                        // var transitionDuration = 'transition-duration:0ms', transform;
                        // transform = 'transform:translate3d(-2070px, 0px, 0px)';
                        // _get('ele').children[0].setAttribute('style', transitionDuration + ';' + transform);
                        _setStyle(_get('ele').children[0], {
                            transitionDuration: '0ms',
                            transform: 'translate3d(-2070px, 0px, 0px)'
                        });
                        _set('activeIndex', len);
                    }, cssAnimationTime);
                }
            }
            // 当前元素 与下一个元素的 动画距离计算
            transform = 'translate3d(' + x + ', 0px, 0px)';
            //回调当前元素
            var eli = index;
            //动画之前回调 传入当前元素 和 下一个元素
            _sliderWillSlide(eli, eli + 1);
            //开始动画
            // _get('ele').children[0].setAttribute('style', transitionDuration + ';' + transform);
            _setStyle(_get('ele').children[0], {
                transitionDuration: transitionDuration,
                transform: transform
            });
            //动画结束回调
            _sliderDidSlide(eli, eli - 1);
            //数据记录当前动画元素 下标
            _set('activeIndex', index);

        };

        /**
         * 自动轮播
         * @param null
         * */
        var _autoSlide = function () {
            //获取轮播方式
            var slideEffect = _get('slideEffect');
            //获取轮播当前下标
            var activeSlide = _get('activeIndex');
            //获取 slide 数量
            var len = _get('slideLength');
            //判断轮播方式
            if (slideEffect === 'slide') {
                if (_get('direction') == 'right') {
                    //向右轮播计算下一个位置
                    activeSlide++;
                    //加上最后一个过度位置
                    activeSlide = activeSlide % (len + 1);
                } else {
                    //向左轮播计算下一个位置
                    activeSlide--;
                    activeSlide = activeSlide < 0 ? 0 : activeSlide;
                }
                //左右轮播 开始
                _moveTo(activeSlide)
            } else if (slideEffect === 'fadeout') {
                //淡入淡出 开始
                _showSlide(activeSlide);
            }
        };
        /**
         * 移动到指定slide
         * @param {number} slide 指定slide下标
         * */
        var _setActiveSlide = function (slide) {
            //提供统一的对外方法 用以调用 轮播
            if (slide === undefined) {
                return;
            }
            var slideEffect = _get('slideEffect');
            //根据不同的轮播样式 开始轮播动画
            if (slideEffect === 'slide') {
                _moveTo(slide);
            } else {
                _showSlide(slide);
            }

        };
        /**
         * 动画开始前的回调
         * @param {object} now
         * @param {object} next
         * */
        var _sliderWillSlide = function (now, next) {
            //判断回调函数时候满足
            if (!_get('sliderWillSlide') && typeof _get('sliderWillSlide') !== 'function') {
                return false;
            }
            var slids = _get('slides');
            return setting.sliderWillSlide(slids[now], slids[next] || slids[0]);
        };
        /**
         * 动画开始后的回调
         * @param {object} now
         * @param {object} prev
         * */
        var _sliderDidSlide = function (now, prev) {
            //判断回调函数时候满足
            if (!_get('sliderDidSlide') && typeof _get('sliderDidSlide') !== 'function') {
                return false;
            }
            var len = _get('slideLength');
            //为 0 上一个 为最后一个
            prev = prev >= 0 ? prev : (len - 1);
            var slids = _get('slides');
            return setting.sliderDidSlide(slids[now], slids[prev] || slids[slids.length - 1]);
        }
        _init();


        //特权方法
        return {
            //对外可以调用的方法
            setActiveSlide: _setActiveSlide
        };
    }

    //提供外部访问
    window.slide = slide;
})(window);

var setting = {
    images: ['1', '2', '3', '4', '5'],
    sliderWillSlide: function (now, next) {
        console.log([now.innerHTML, next.innerHTML]);
    },
    sliderDidSlide: function (now, pre) {
        console.log([now.innerHTML, pre.innerHTML]);
    },
};
//初始化 设置
var slides = new slide('.slide-container', setting);
