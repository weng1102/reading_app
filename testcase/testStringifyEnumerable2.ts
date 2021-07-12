class child {
  constructor() {}
  f: string = "f";
}
abstract class abstractclass {
  constructor() {}
  a: string = "a";
  b: string = "b";
  e: child = new child();
}
class class1 extends abstractclass {
  constructor() {
    super();
    //    Object.defineProperty(this, this.exclude, { enumerable: false });
  }
  c: string = "c";
  d: string = "d";
}
let obj = new class1();
obj.a = "1";
Object.defineProperty(obj, "a", { enumerable: false });
Object.defineProperty(obj, "c", { enumerable: false });
console.log(JSON.stringify(obj));
Object.defineProperty(obj, "a", { enumerable: true });
console.log(JSON.stringify(obj));
Object.defineProperty(obj.e, "f", { enumerable: false });
console.log(JSON.stringify(obj));
