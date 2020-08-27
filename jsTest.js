// 非严格相等==
let arr=[0,'',false,null,undefined]
for (let i = 0; i <arr.length ; i++) {
    for (let j = 0; j <arr.length ; j++) {
        // 类型相同===，类型不同，undefined和null等，bool首先转数字，object ToPrimitive，字符串和数字 字符串会转数字。
        // console.log(arr[i],arr[j],arr[i]==arr[j])
    }
}
console.log('__________________')
// typeof 和 Object.prototype.toString结果
arr.push(...[Number,Symbol(1),{}]);
for (let item of arr){
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
    Sub.prototype.__proto__.constructor.call(this,a);
}

//下面是添加原型链属性
//方法一：子类的__proto__ 等于 父类的prototype
Sub.prototype.__proto__ = Foo.prototype;
//方法二：子类的__proto__ 等于 一个父类的实例，该实例的__proto__已经等于父类的__proto__，但是实例的constructor还是Foo所以要修改
// Sub.prototype=new Foo();
// Sub.prototype.constructor=Sub;
let sub = new Sub(3);
sub.show()

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
    return result? result : obj
}

console.log(diyNewMethod(Foo,2))

//手动实现instanceof
//看type是否在实例的原型链上
function diyIntanceof(instance,type) {
    if (instance===null) return false;//已经找到Object.__proto__结束
    if (instance.__proto__===type.prototype){
        return true;
    }else {
        return diyIntanceof(instance.__proto__,type)
    }
}

console.log(diyIntanceof(new Sub(),Number))

//为什么要有变量提升
// https://www.cnblogs.com/echolun/p/11438363.html

// 在生成执行上下文时，会有两个阶段。
// 第一个阶段是创建的阶段（具体步骤是创建 VO），JS 解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟好空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为 undefined，
// 所以在第二个阶段，也就是代码执行阶段，我们可以直接提前使用。
