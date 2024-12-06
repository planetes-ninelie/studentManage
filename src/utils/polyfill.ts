//去除谷歌浏览器的scroll、wheel等事件警告
//https://blog.csdn.net/qq_63358859/article/details/134078025

// ; (function () {
//   if (typeof EventTarget !== 'undefined') {
//     const func = EventTarget.prototype.addEventListener
//     EventTarget.prototype.addEventListener = function (type, fn, capture) {
//       this.func = func
//       if (typeof capture !== 'boolean') {
//         capture = capture || {}
//         capture.passive = false
//       }
//       this.func(type, fn, capture)
//     }
//   }
// })()
