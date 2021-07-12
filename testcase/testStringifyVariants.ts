export enum VariantEnumType {
  variant1,
  variant2
}

type VariantType = VariantType1 | VariantType2;

interface VariantType1 {
  type: VariantEnumType.variant1; // can have zero (when immediately followed by subsecion) or more sentences
  prop1: number;
}
interface VariantType2 {
  type: VariantEnumType.variant2; // can have zero (when immediately followed by subsecion) or more sentences
  prop2: number;
}
class page {
  constructor() {
    this.prop2.push(new section1());
    this.prop2.push(new section2());
  }
  prop1: number = 11;
  prop2: ISectionData[] = [];
  func1() {}
  func2() {}
}
interface ISectionData {
  prop1: number;
  prop2: number;
  meta: VariantType;
}
interface ISectionMethods {
  func1(): void;
}
class section1 implements ISectionData, ISectionMethods {
  constructor() {
    this.meta.prop1 = 111;
  }
  prop1: number = 22;
  prop2: number = 333;
  meta: VariantType1 = { type: VariantEnumType.variant1, prop1: 111 };
  func1() {}
  func4() {}
}
class section2 implements ISectionData, ISectionMethods {
  constructor() {
    this.meta.prop2 = 111;
  }
  prop1: number = 222;
  prop2: number = 3333;
  meta: VariantType2 = { type: VariantEnumType.variant2, prop2: 1111 };
  func1() {}
  func4() {}
}

let me = new page();
let result: string = JSON.stringify(me);
console.log(result);
