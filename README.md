# jquery-org
------

此仓库用以记录 jquery 学习（包含应用、源码阅读、笔记）之路

同时将学习收获更新至掘金：

[https://juejin.cn/column/7295576148363231271]: 	"jquery 专栏"



## 开篇

作为一名前端小白，我将以 **jquery 是什么**，**jquery 怎么用**，**jquery 常用方法的实现（读源码）**三部分为核心，逐步加强对 jquery 的理解。目的旨在学习 jquery 其中的设计思想，代码技巧及结合自己学习前端以来的知识点总结沉淀经验



## 仓库目录


```js
jquery-org
├─ docs	// 学习笔记文档
├─ jquery-hairy	// 简易 jquery / 源码注释
├─ jquery-org-2.0.3	// jquery 源码 2.0.3 版本
├─ src	// 实践文件
└─ test	// 手写测试文件

```



## jquery 学习

用过 jquery 的同学都知道 jquery 暴露给应用程序的是一个 jquery 对象，然后通过这个 jquery 对象获取 HTML 中的元素，然后对元素进行 DOM 操作。

```js
$(xxx).css(xxx);
$(yyy).html('xxx').css(xxx);
```

那么将从 jquery 对象如何构建到 jquery 对象如何获取、操作元素为思路进行源码阅读，并对常见的 DOM 操作进行 jquery 方式和原生 DOM 方式进行对比

### 应用学习方式

学习常用 jquery 方法的使用，参考

[https://www.w3school.com.cn/jquery/jquery_ref_selectors.asp]: 	"w3school 参考手册"

进行用例学习。边用边读源码



### 源码学习方式

结合 src 中的实践，在浏览器中对 jquery.js 进行断点调试来逐步解析 jquery 库执行过程



## 最终产物

尝试实现简易 jquery-hairy 及笔记文档



## 学习周期

仓库与掘金长期更新......