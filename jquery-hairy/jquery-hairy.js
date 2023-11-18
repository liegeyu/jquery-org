(function (window, undefined) {
  console.log("hairy-arguments", window);

  // jQuery 构造函数
  var z_jQuery = function (selector, context) {
    return new z_jQuery.fn.init(selector, context);
  };

  // z_jQuery.fn 引用 z_jQuery.prototytpe
  z_jQuery.fn = z_jQuery.prototype = {
    constructor: z_jQuery,
    // z_jQuery 借用 init 构造
    init: function (selector, context) {
      if (!selector) {
        return this;
      }
      return this;
    },
  };

  z_jQuery.fn.init.prototype = z_jQuery.fn;

  // 添加属性 $
  window.$ = z_jQuery;
})(window);
