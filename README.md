# 轮播组件

支持左右轮播和淡入淡出两种效果，同一个页面可以出现多个 slider。

支持配置项：

slideEffect: (string | default: 'slide') 'slide'|'fadeout', 轮播效果, 左右轮播或者淡入淡出
autoSlide: (boolean | default: true) true|false, 是否自动轮播
slideInterval: (number | default: 5000) 自动轮播的时间间隔, ms
sliderWillSlide(now, next): (function) 将要 slide 的时候调用的回调函数, 传递参数: 当前 slide, 将要出现的 slide
sliderDidSlide(now, prev): (function) slide 结束的时调用的回调函数, 传递参数: 当前 slide, 上一个 slide
支持方法：

setActiveSlide(slide) 将 slide 设置为当前
