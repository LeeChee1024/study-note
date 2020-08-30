// 非严格相等==
let arr = [0, '', false, null, undefined]
for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
        // 类型相同===，类型不同，undefined和null等，bool首先转数字，object ToPrimitive，字符串和数字 字符串会转数字。
        // console.log(arr[i],arr[j],arr[i]==arr[j])
    }
}
console.log('__________________')
// typeof 和 Object.prototype.toString结果
// typeof 两个特例 function null
// Object.prototype.toString 一个特例 Function
arr.push(...[Number, Symbol(1), {}]);
for (let item of arr) {
    // console.log(typeof item)
    // console.log(Object.prototype.toString.call(item))
}

// 实现继承
function Foo(a) {
    this.a = a;
}

Foo.prototype.show = function () {
    console.log(this.a);
}

function Sub(a) {
    //调用父类的构造函数，给实例添加构造器属性
    Sub.prototype.__proto__.constructor.call(this, a);
}

//下面是添加原型链属性
//方法一：子类的__proto__ 等于 父类的prototype
Sub.prototype.__proto__ = Foo.prototype;
//方法二：子类的__proto__ 等于 一个父类的实例，该实例的__proto__已经等于父类的__proto__，但是实例的constructor还是Foo所以要修改
// Sub.prototype=new Foo();
// Sub.prototype.constructor=Sub;
let sub = new Sub(3);
// sub.show()
// console.log('sub show hasOwnProperty', sub.hasOwnProperty('show'))
// console.log('foo show hasOwnProperty', new Foo().hasOwnProperty('show'))
// console.log('foo show hasOwnProperty', Foo.prototype.hasOwnProperty('show'))
// 该方法会忽略掉那些从原型链上继承到的属性。和 in 不同


//手动实现new
// https://www.cnblogs.com/echolun/p/10903290.html
function diyNewMethod(constuctor1, ...args1) {
    //1.赋值原型链上的属性
    let obj = Object.create(constuctor1.prototype);//constuctor1.prototype赋值给obj.__proto__
    //同理可以写成
    // let obj={};
    // obj.__proto__=constuctor1.prototype;

    //2.赋值构造器属性
    let result = constuctor1.apply(obj, args1);//构造器非new调用，不一定会返回this，这个时候我们要的东西就是obj
    return result ? result : obj
}

// console.log(diyNewMethod(Foo, 2))

//手动实现instanceof
//看type是否在实例的原型链上
function diyIntanceof(instance, type) {
    if (instance === null) return false;//已经找到Object.__proto__结束
    if (instance.__proto__ === type.prototype) {
        return true;
    } else {
        return diyIntanceof(instance.__proto__, type)
    }
}

// console.log(diyIntanceof(new Sub(), Number))

//为什么要有变量提升
// https://www.cnblogs.com/echolun/p/11438363.html

// 在生成执行上下文时，会有两个阶段。
// 第一个阶段是创建的阶段（具体步骤是创建 VO），JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined，
// 所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。

//深浅拷贝
//直接赋值、浅拷贝、深拷贝
//浅拷贝实现方式：1.Object.assign() 2.展开运算符 3.数组一些返回新数组的方法 比如contact slice
//深拷贝实现方式:  1.JSON.parse(JSON.stringify())循环引用、函数、undefined、symbol做key有问题 2.new MessageChannel();

//手动实现浅拷贝
function shallowClone(obj) {
    let res = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            res[key] = obj[key]
        }
    }
    return res
}

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

function isObject(value) {
    return typeof value === 'object' && value !== null
}

function deepClone(obj,weakMap=new WeakMap()) {
    if (!isObject(obj)) return obj;// 如果是六大基本类型或者函数就直接返回
    // if (obj instanceof Date) return new Date(obj); //一些内置对象我们是可以单独处理的
    // if (obj instanceof RegExp) return new RegExp(obj);
    let mapValue=map.get(obj)
    if (mapValue){
        return mapValue
    }
    let cloneObj = new obj.constructor();
    map.seal(obj,cloneObj);
    // Reflect.ownKeys(obj);可以取出Symbol做的key
    // 上述方法没有的时候使用    let symKeys = Object.getOwnPropertySymbols(obj);
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            cloneObj[key] = deepClone(value,weakMap)
        }
    }
    return cloneObj
}
