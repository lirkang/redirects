# 移除重定向和优化页面布局

一个用来移除部分页面链接重定向和一些无用的广告的 `chrome` 插件

## 现在支持

- [百度](https://www.baidu.com)
- [Bilibil](https://www.bilibili.com)
- [Google](https://www.google.com)
- [掘金](https://www.juejin.cn)
- [CSDN](https://www.csdn.net/)
- [知乎](https://www.zhihu.com)

## 原理

- 修改页面: 通过 Chrome 提供的 Api 向页面注入可以访问 Dom 树的 js, 删除或者修改 Dom 结构
- 移除重定向: 通过 fetch 接口或者从 href 中解析出真实的地址并替换 a 标签的 href 属性

## 为什么要移除重定向

如果留心观察浏览器, 可以发现当鼠标移动到链接上时, 浏览器的左下角会如图所示显示出点击后的跳转链接

![链接](<./public/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE(10).png>)

`http://www.baidu.com/link?url=nzyRFH7tfho6jGneb4zEOLExMpZDMOHBdSKbMZa2h8X9WQFrj2Ws3CuMdVsDySEMkXHRphbpFIUykfK1aiUiZTSO9nPZM0lrNO89KN5yZ5IvyigK_TrSYvXCHKHMeXbr`

这一串链接是百度加密后的地址, 所以访问的流程是点开链接 -> 访问百度的服务器 -> 服务器返回新地址 -> 浏览器响应新地址

中间这一部分是正常用户完全不需要的流程也不想要, 所以我们需要通过一些方法移除它

## 为什么要移除广告

~~为了美好的心情~~

## 示例

下面是一些截图

![正常状态](<./public/屏幕截图(4).png> '屏幕截图')

![开启插件后](<./public/屏幕截图(5).png> '屏幕截图')

![正常状态](<./public/屏幕截图(6).png> '屏幕截图')

![开启插件后](<./public/屏幕截图(7).png> '屏幕截图')

![正常状态](<./public/屏幕截图(8).png> '屏幕截图')

![开启插件后](<./public/屏幕截图(9).png> '屏幕截图')

## 使用方法

打开 `Chromium` 内核的浏览器的扩展界面, 如图所示

![开启插件后](<./public/屏幕截图(11).png> '屏幕截图')

开发开发者选项后, 选择加载已解压的扩展程序, 选择从 `github` 下载的源代码

### 完
