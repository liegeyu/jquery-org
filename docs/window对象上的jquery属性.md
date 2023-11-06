# window 对象上的 jquery 属性

------

## 简短几句

本文作为 jquery 学习之路的开端，首先要知道 jquery 是什么？引用 jQuery 中文文档的正文第一句话：

> **jQuery 是一个高效、精简并且功能丰富的 JavaScript 工具库。**

从中提取关键词：**JavaScript**、**工具库**

## JavaScript

jquery 既然和 js 相关，那么就来回顾一下 javascript 的组成：

- **核心（ECMAScript）**
- **文档对象模型（DOM）**
- **浏览器对象模型（BOM）**

![draw-1-js](H:\git-online\jquery-org\draw-io\draw-1-js.png)

这里对主要内容不做过多赘述，只点明基本概念及作用：

> ECMAScript 即 ECMA-262 定义的语言，并不局限于 Web 浏览器。
>
> DOM 是一个应用编程接口，用于在 HTML 中使用扩展的 XML。提供网页内容交互的方法和接口。
>
> BOM 是浏览器对象接口，用于支持访问和操作浏览器的窗口。提供浏览器交互的方法和接口。

三者关系：**Web 浏览器只是 ECMAScript 实现可能存在的一种宿主环境。宿主环境提供 ECMAScript 的基准实现和与环境自身交互必需的扩展（DOM、BOM等）。扩展使用 ECMAScript 核心类型和语法，提供特定于环境的额外功能（其它环境还包括 node.js 等）。**

## 工具库

作为一名 js 程序员，肯定对 javascript 不会陌生，同样也对浏览器不会陌生。前端开发大部分都是围绕着 web 浏览器进行。在浏览器崛起的时代，jQuery 的出现是历史必然。

它提供的 API **易于使用且兼容众多浏览器**，这让诸如 HTML 文档遍历和操作、事件处理、动画和 Ajax 操作更加简单。

学习源码，学的是它的设计思想。在这之前，得先知道如何使用它。

## 引入 jQuery

在 `index.html`中引入 jQuery，只需要一个一个 `<script>` 标签。引入它我们即能通过 `$` 进行访问其方法

```js
$('#app').add()
```

这是使用 jQuery 的常规操作。那么由此发问：

## 为什么是 $ ? $ 从何而来？

显而易见的是：

>  `$` 只是一个字面量，而且是由通过 `<script>` 标签引入的 jQuery “导出” 的产物。

在 jQuery 中它是这么做的：使用一个**立即执行函数**，以 **window 对象**入参，将 jQuery 属性添加到 window 对象中。

```js
(function (window, undefined) {
  // ....
})(window);
```

在 js 中万物皆可是对象，在调用方法时我们可以直接 `obj.funA()`，此处等同于 `window.$('#app')`，那么发问：

### 为什么是 window 对象，而不是其它对象？

在开篇说到 JavaScript 的组成，BOM 是使用 js 开发 Web 应用程序的核心。

> **window 对象则是 BOM 的核心。表示浏览器实例。**window 对象在浏览器中拥有双重身份，一个是 ECMAScript 中的 Global 对象，另一个是浏览器窗口的 js 接口。

不意外的是：**因为 window 对象的属性在全局作用域中有效，所以浏览器 API 及相关构造函数都已 window 对象属性的形式暴露出来。 jQuery 作为 js 的工具库同理。**

那么 window 对象内部肯定是不存在 `$`成员， 在函数内部，我们只要为 window 对象添加 `$`属性即可

```js
// 直接添加属性
window.$ = 123;
```

除此之外，js 中因为全局作用域的原因，可以通过 var 来声明变量使其添加到 window 对象中

```js
// 通过 var
var $ = 123;
```

![image-20231106180422020](C:\Users\48042\AppData\Roaming\Typora\typora-user-images\image-20231106180422020.png)

在 jQuery 中使用的是立即执行函数操作 window 对象，而非 var 关键字。



### 既然可以使用 var，那还用立即执行函数干什么？

立即执行函数是什么？

> 立即执行函数就是声明一个匿名函数，并马上调用这个匿名函数

其作用是：**创建一个独立的作用域（块级作用域），这个作用域里面的变量，外面访问不到（即避免"变量污染"）**

在此处举个例子：

```js
for (var i = 0; i < 5; i++) {
    setTimeout(() => {
        console.log(i);
    }, 1000 * i);
}

```

此处输出的是 `5, 5, 5, 5, 5`，但是改造一下：

```js
for (var i = 0; i < 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
```

此处输出的是 `0, 1, 2, 3, 4`



## jQuery 是工具库，而不是框架？

来到 jQuery 的本质：

> **jQuery 主要提供了一系列的工具和方法，用于简化JavaScript代码的编写和操作。**

相比于常见的前端架构模式 MVC 和 MVVM，jQuery 更加轻量，简化 Web 操作。