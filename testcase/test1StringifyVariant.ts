// test stringify object
import {
  ITerminalContent,
  TerminalMetaEnumType,
  IWordTerminalMeta,
  IWordTerminalMetaInitializer,
  TerminalMetaType
} from "./PageContentType";

abstract class level1 {
  a1: number = 1;
  constructor() {}
}
abstract class level1_1 extends level1 implements ITerminalContent {
  a1_1: string = "a1_1";
  id: number = -1;
  content: string = "";
  type: TerminalMetaEnumType = TerminalMetaEnumType.word;
  meta: IWordTerminalMeta = IWordTerminalMetaInitializer;
  constructor(name) {
    super();
    this.content = name;
    //    Object.defineProperty(this, "a1_1", { enumerable: false }); // no necessary for circula reference problem
  }
}
class child extends level1_1 {
  childname: string = "";
  constructor(name) {
    super(name);
    this.content = name;
  }
}
class level3 extends level1_1 {
  constructor(name) {
    super(name);
    let thismeta = this.meta;
    Object.defineProperty(thismeta, "children", { enumerable: false });
  }
  parse() {
    return 0;
  }
  parseTokenList() {
    return 0;
  }
  transform() {
    return 0;
  }
  serialize() {
    return "";
  }
}
class level2 extends level1_1 {
  a2: string = "a2";
  excludeMe1: string = "exclude";
  children: child[] = [];
  constructor(name) {
    super(name);
    this.content = "name set by constructor";
    Object.defineProperty(this, "a2", { enumerable: false });
    Object.defineProperty(this, "excludeMe1", { enumerable: false });
    this.children.push(new child("child 1"));
    this.children.push(new child("child 2"));
  }
  parse() {
    return 0;
  }
  parseTokenList() {
    return 0;
  }
  transform() {
    return 0;
  }
  serialize(this): string {
    console.log(this.excludeMe1);
    return JSON.stringify(this);
  }
}
let level: level2 = new level2("level2");
level.id = 2;
level.meta.termIdx = 4;
level.excludeMe1 = "hi";
level.meta.audible = false;
let level_3 = new level3("child");
level_3.id = 22;
level_3.content = "level3";
//level.meta.children.push(level_3);
let strJson: string = level.serialize();
// type guards here
let obj: ITerminalContent = JSON.parse(strJson) as ITerminalContent;
console.log(`content=${obj.content}`);
console.log(`type=${obj.type}`);
console.log(`meta=${obj.meta}`);
let metaObj: IWordTerminalMeta = obj.meta as IWordTerminalMeta;
console.log(`meta.termIdx=${metaObj.termIdx}`);
