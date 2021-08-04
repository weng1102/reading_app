class parentClass {
  constructor() {}
  method1(arg0: string = "default") {
    console.log(`arg0=${arg0}`);
  }
}
class childClass extends parentClass {
  constructor() {
    super();
  }
}
let obj: childClass = new childClass();
obj.method1();
obj.method1("explicit");
