class Test {
    name: string
}

let test = new Test();
test.name = 'hello world';
console.log(test);

function* f(a) {
    let v = a * (yield 8);
    return v;
}

let ttt=f(6);
console.log(ttt.next());
console.log(ttt.next(12));
console.log(ttt.next());
console.log(ttt.next());
