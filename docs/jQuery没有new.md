# jQuery 没有 new ?

------

文接上篇：https://juejin.cn/post/7298160530291539980

## 简单几句

这篇进入 jQuery 初始化篇章......了解 jQuery 是如何 `new` 出来的

## 撸起袖子先观察

在使用库时我们常常是直接使用，而没有一个 `new` 的实例化操作，同时还支持链式调用操作。

```js
$('#app').add();
$('p')
```

那么就可以初步猜测

-  jQuery 执行后返回的是一个实例而非直接挂载的构造函数到 window 上
- 想要支持链式调用，那么最简单的方式就是进行 `return this`

## 拿出键盘就是淦

首先通过 `console.log('jquery', $)`打印一下 `$`看看 jquery 是什么东西:

![jquery-func](H:\git-online\jquery-org\draw-io\jquery-func.png)

**执行后 `$`打印出来是一个函数，含有入参和返回值**

那么再对执行 `$()`可以得到什么

![jquery-function](H:\git-online\jquery-org\draw-io\jquery-function.png)

得到的是一个由 init() 方法构造的**实例**，同时原型对象上存在 n 多种方法

从上面看知道 jquery 实际上是做了 `new`操作的，同时**将 init() 作为构造函数**

### jQuery 的 `new` 操作时如何做的？

先来复习一下一个对象被实例化是如何操作的

```js
  var z_jQuery = function () {
    this.name = 'kobe';
  };

  z_jQuery.prototype.getName = function() {
      return this.name;
  }

  var newJq = new z_jQuery();	// 实例化
```

而 jQuery 不同的是将 `newJq`最为实例返回，按照这个思路改造 `z_jQuery`：

```js
  var z_jQuery = function () {
    return new z_jQuery();
  };
  // ncaught RangeError: Maximum call stack size exceeded
```

无限引用爆栈了，报错！！！

按照 jQuery 的思路，使用 init 方法作为构造函数，同时将其添加到原型对象上

```js
  var z_jQuery = function (selector, context) {
    return new z_jQuery.prototype.init(selector, context);
  };

  z_jQuery.prototype = {
    init: function (selector, context) {
      return this;
    },
    add: function () {},
    addClass: function () {},
    // ...
  };

  console.log("z_jquery", z_jQuery());
```

这时候 `new` 出来的实例是这样的

![z_jquery_init](H:\git-online\jquery-org\draw-io\z_jquery_init.png)

可以看到原型上面没有东西。这是因为这个 new 操作中，**init 构造函数原型对象上没有东西**

这里回顾一下 `new`操作如何实现的

- 在内存中创建一个空对象
- **将构造函数的原型对象赋值给空对象的原型**
- 执行构造函数
- 返回构造函数里的新对象或空对象

那么既然没有东西，可以改造代码：

```js
  var z_jQuery = function (selector, context) {
    return new z_jQuery.prototype.init(selector, context);
  };

  z_jQuery.prototype = {
    init: function (selector, context) {
      return this;
    },
    add: function () {},
    addClass: function () {},
  };

  z_jQuery.prototype.init.prototype = {
    addClass: function () {},
  };

  console.log("z_jquery", z_jQuery());
```

这个时候的实例上原型就存在了属性 `addClass`

![z_jquery_func](H:\git-online\jquery-org\draw-io\z_jquery_func.png)

那么想要使用 jQuery 上的原型方法。可以将 jQuery 原型对象赋值给 init 构造函数的原型。最终方案：

```js
  var z_jQuery = function (selector, context) {
    return new z_jQuery.prototype.init(selector, context);
  };

  z_jQuery.prototype = {
    init: function (selector, context) {
      return this;
    },
    add: function () {
      return this;
    },
    addClass: function () {},
  };
  // 重写原型
  z_jQuery.prototype.init.prototype = z_jQuery.prototype;

  console.log("z_jquery", z_jQuery());
```

那么就可以达到预期效果：

![z_jquery_function](H:\git-online\jquery-org\draw-io\z_jquery_function.png)

**既然是返回的实例而非构造函数，为什么不直接用 init 返回实例，而是使用 new 操作？**

根据这个思路改造代码

```js
  var z_jQuery = function (selector, context) {
    return z_jQuery.prototype.init(selector, context);
  };

  z_jQuery.prototype = {
    init: function (selector, context) {
      return this;
    },
    add: function () {
      return this;
    },
    addClass: function () {},
  };

  console.log("z_jquery", z_jQuery());
```

得到的实例：

![z_jquery_obj](H:\git-online\jquery-org\draw-io\z_jquery_obj.png)

这时候 **init 中的 `this`指向的是 `z_jQuery`构造函数创建的实例。**那么就存在一个问题：

```js
  var z_jQuery = function (selector, context) {
    return z_jQuery.prototype.init(selector, context);
  };

  z_jQuery.prototype = {
    init: function (selector, context) {
      this.age = 18;
      return this;
    },
    add: function () {
      return this.age + 1;
    },
    addClass: function () {},
    age: 12,
  };

  console.log("z_jquery", z_jQuery());
  console.log("z_jquery", z_jQuery().add());	// 19
```

这里的 age 是 19 而不是 13。

> `init`方法是在 `z_jQuery.prototype`上定义的，而非构造函数内部定义。而 `init`被作为构造器。在**实例化时实例会继承原型对象上的属性与方法**。在**实例化时继承是发生在构造函数执行之前**的，这就导致 `age`被覆盖。导致作用域污染。

那么就需要分割作用域。使用 `new` 操作来重写原型。

------

解决完作用域问题，此时还存在一个问题：

### z_jQuery 的 `prototype` 被重写，构造函数的原型链断开

`z_jQuery` 构造函数的原型 `z_jQuery.prototype` 被重写为一个新对象，这个新对象没有原生的 `constructor` 属性，因此它的 `constructor` 属性将指向 `Object` 构造函数。

**这就使得 `instanceof`失效**。解决这个问题：

```js
  // jQuery 构造函数
  var z_jQuery = function (selector, context) {
    return new z_jQuery.prototype.init(selector, context);
  };

  // jQuery 原型
  z_jQuery.prototype = {
    constructor: z_jQuery,	// 设置构造函数
    // jQuery 构造
    init: function (selector, context) {
      if (!selector) {
        return this;
      }
      return this;
    },
    age: function () {
      return this.age;
    },
  };

  z_jQuery.prototype.init.prototype = z_jQuery.prototype;

  // test
  console.log("z_jquery", z_jQuery());
  console.log("age func", z_jQuery().age());
```

## 总结

- 通过在原型对象上 `init` 构造函数来创建实例，然后重写构造函数的原型，即可为新实例添加 z_jQuery 原型对象上的属性&方法

