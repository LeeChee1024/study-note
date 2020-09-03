// 非严格相等==
// let arr = [0, '', false, null, undefined];
// for (let i = 0; i < arr.length; i++) {
//     for (let j = 0; j < arr.length; j++) {
//         类型相同===，类型不同，undefined和null等，bool首先转数字，object ToPrimitive，字符串和数字 字符串会转数字。
//         console.log(arr[i],arr[j],arr[i]==arr[j])
//     }
// }
// typeof 和 Object.prototype.toString结果
// typeof 两个特例 function null
// Object.prototype.toString 一个特例 Function
// arr.push(...[Number, Symbol(1), {}]);
// for (let item of arr) {
// console.log(typeof item)
// console.log(Object.prototype.toString.call(item))
// }

// ————————————————————————————————————————————————————————

// 实现继承
// 先定义一下什么叫继承，子类实例可以使用父类实例的属性，就叫做继承.属性既包括原型链属性、也包括构造器属性
//下面实现的继承都是要得到一个可以用来new的子类构造函数。还有其他实现办法，用一个函数返回的就是子类实例
// function Foo(a) {
//     this.a = a;
//     this.b = 'foo-b'
//     this.showB = function () {
//         console.log(this.b)
//     }
// }
//
// Foo.prototype.show = function () {
//     console.log(this.a);
// };
//
// function Sub(a) {
//     //调用父类的构造函数，给实例添加构造器属性  这个属于构造继承
//     Sub.prototype.__proto__.constructor.call(this, a);
// }
//
// //让子类获取原型链属性
// function extends1(SubClass, SuperClass) {
// //    用原型链的方式让子类可以访问到父类的方法，也就是说SubClass.prototype.__proto__=SuperClass.prototype
// //方法一：子类的__proto__ 等于 父类的prototype 这个属于原型继承
// //     SubClass.prototype.__proto__ = SuperClass.prototype;
// //     或者用这个方法优雅一点，不直接操作Object.setPrototypeOf(obj, prototype)
// //     Object.setPrototypeOf(SubClass.prototype,SuperClass.prototype)
// //方法二：子类的__proto__ 等于 一个父类的实例，该父类实例的__proto__已经等于父类的prototype，但是实例的constructor还是SuperClass所以要修改 这个属于实例基继承，这个和构造机器一起用变成组合继承
// //     SubClass.prototype = new SuperClass();
// //     SubClass.prototype.constructor = SubClass;
// //     方法三:使用现成的Object.creat方法,该方法就是把第一个参数作为输出结果的__proto__
// //     SubClass.prototype = Object.create(SuperClass.prototype, {
// //         constructor: {
// //             value: SubClass,
// //             enumerable: false,
// //             writable: true,
// //             configurable: true
// //         }
// //     })
// //    方法四：有个很挫的拷贝继承把SuperClass.prototype的属性在构造器里面都付给子类实例
// //    方法五：寄生继承我不推荐这个方法，等于一个对象可能是两个构造函数的prototype，少点的那一步不如用方法一+构造继承
// }
//
//
//
// //下面是添加原型链属性
// extends1(Sub, Foo);
//
// let sub = new Sub(3);
// sub.show();
// sub.showB();
// console.log(sub instanceof Foo);
// console.log(sub instanceof Sub);
// console.log('sub show hasOwnProperty', sub.hasOwnProperty('show'))
// console.log('foo show hasOwnProperty', new Foo().hasOwnProperty('show'))
// console.log('foo show hasOwnProperty', Foo.prototype.hasOwnProperty('show'))
// // 该方法会忽略掉那些从原型链上继承到的属性。和 in 不同

//手动实现new,构造函数new调用如果内部返回一个对象，就使用这个对象，不是对象或者没有返回，就返回this
// https://www.cnblogs.com/echolun/p/10903290.html
// function diyNewMethod(constructor1, ...args1) {
//     //1.赋值原型链上的属性
//     let obj = Object.create(constructor1.prototype);//constuctor1.prototype赋值给obj.__proto__
//     //同理可以写成
//     // let obj={};
//     // obj.__proto__=constructor1.prototype;
//
//     //2.赋值构造器属性
//     let result = constructor1.apply(obj, args1);//构造器非new调用，不一定会返回this，这个时候我们要的东西就是obj
//     return typeof result === 'object' ? result : obj
// }

// console.log(diyNewMethod(Foo, 2))

//手动实现instanceof
//看type是否在实例的原型链上
// function diyIntanceof(instance, type) {
//     if (instance === null) return false;//已经找到Object.__proto__结束
//     if (instance.__proto__ === type.prototype) {
//         return true;
//     } else {
//         return diyIntanceof(instance.__proto__, type)
//     }
// }

// console.log(diyIntanceof(new Sub(), Number))

//为什么要有变量提升
// https://www.cnblogs.com/echolun/p/11438363.html

// 在生成执行上下文时，会有两个阶段。
// 第一个阶段是创建的阶段（具体步骤是创建 VO），JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined，
// 所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

// ————————————————————————————————————————————————————————
//深浅拷贝
//直接赋值、浅拷贝、深拷贝
//浅拷贝实现方式：1.Object.assign() 2.展开运算符 3.数组一些返回新数组的方法 比如contact slice
//深拷贝实现方式:  1.JSON.parse(JSON.stringify())循环引用、函数、undefined、symbol做key有问题 2.new MessageChannel();

//手动实现浅拷贝
// function shallowClone(obj) {
//     let res = {};
//     for (let key in obj) {
//         if (obj.hasOwnProperty(key)) {
//             res[key] = obj[key]
//         }
//     }
//     return res
// }

//手动实现深拷贝
// https://segmentfault.com/a/1190000020255831
// 分析一下深拷贝
//1.就是对于不同类型的属性做不同类型的处理，
//首先按照typeof 分为 number,string,boolean,undefined,symbol,function,object
//除object之外的类型都是可以直接返回的,object中的null也是直接返回
//object中有些特定的对象我们是可以直接复制出值得，比如Error、RegExp、Date
//然后对于一般的object/map/set/array就是要进行递归
//2.对于循环引用
//循环引用的都是对象，所以当value为对象的时候，我们先去map里面看是否有现成的，如果有就返回现成的，没有的话，新建一个现成的，同时还要存入map中
//3.对于递归及深度优先会爆仓，可以选择用数组来实现广度优先的拷贝

// function isObject(value) {
//     return typeof value === 'object' && value !== null
// }
//
// function deepClone(obj,weakMap=new WeakMap()) {
//     if (!isObject(obj)) return obj;// 如果是六大基本类型或者函数就直接返回
//     // if (obj instanceof Date) return new Date(obj); //一些内置对象我们是可以单独处理的
//     // if (obj instanceof RegExp) return new RegExp(obj);
//     let mapValue=weakMap.get(obj);
//     if (mapValue){
//         return mapValue
//     }
//     let cloneObj = new obj.constructor();
//     weakMap.set(obj,cloneObj);
//     // Reflect.ownKeys(obj);可以取出Symbol做的key
//     // 上述方法没有的时候使用    let symKeys = Object.getOwnPropertySymbols(obj);
//     for (let key in obj) {
//         if (obj.hasOwnProperty(key)) {
//             const value = obj[key];
//             cloneObj[key] = deepClone(value,weakMap)
//         }
//     }
//     return cloneObj
// }

// ————————————————————————————————————————————————————————
//模块化CommonJs/ESM/AMD/CMD

// AMD
// define(['./a', './b'], function(a, b) {
//     a.do()
//     b.do()
// })
//CMD
// define(function(require, exports, module) {
//     var a = require('./a')
//     a.doSomething()
//     var b = require('./b')
//     b.doSomething()
// })


//防抖debounce 节流throttle
//详见html

// ________________________
//this绑定规则

// 箭头函数,没有prototype
// 显示绑定bind apply call或者构造绑定
// 隐士绑定 及 a.b.c.d()绑定到c
// 默认绑定undefined 或者 global

// new a.b.c() 会绑定到new
// a.b.c.call(d) 会绑定到d
// c() 会绑定到undefined 或者 global
// 会存在一个 既有new 又有显式绑定的情况吗，我没发现
// new c.bind(d) 按照执行顺序是先bind，返回值没有prototype，不能new，报错
// new c.apply(d) 按照执行顺序是先apply，然后函数就执行完了，new的就不是那个函数了，new的都不是个函数
// 所以我认为不会出现new和显示冲突的情况


// apply call bind
// apply和call的区别只是参数的形式不一样，call参数分开，apply参数是数组
//手动实现call,是Function的prototype方法,apply类似
// Function.prototype.diyCall = function (context, ...arg) {
//     context = context || window
//     context.fn = this;
//     let result
//     if (arg.length) {
//         result = context.fn(...arg);
//     } else {
//         result = context.fn();
//     }
//     context.fn = undefined;
//     return result
// };
//
// let a = {
//     b: 1,
//     c(d) {
//         this.d = d
//         console.log(this.b, this.d)
//     }
// };
// //
// a.c(1);
//
// a.c.diyCall({
//     b:2
// },4,5);

// 手动实现bind,不能更改this
// Function.prototype.diyBind = function (context) {
//     let fn = this;
//     let res = function (...arg) {
//         let _this = context;
//         if (this instanceof res)_this=this;//确定是new在调用，就new优先，否则bin优先
//         // let _this = (!this || this ===  global) ? context : this;//js自带的bind应该是没有这一步,有这一步是软bind
//         return fn.call(_this, ...arg)
//     };
//     res.prototype.__proto__ = fn.prototype;//js自带的bind应该是没有这一步，并且返回的函数没有没有prototype
//     return res;
// };
//
// let test2 = {b: 2};
// const bindTest = a.c.diyBind(test2);
//
// bindTest(2)
//
// let test3 = {
//     b: 3,
//     c: bindTest
// }
// test3.c(3)
//
// console.log(test2)
// let test4 = new bindTest(4)
// console.log(test2)
// console.log(test4)
// bindTest.diyBind({b: 5})(5)
//
// let jsBindTest=a.c.bind(test2);
// console.log(jsBindTest)//没有prototype
//
// this.a=7
// const arrowBindTest=()=>{
//     console.log(this.a)
// }
// console.log(arrowBindTest())
