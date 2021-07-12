interface struct1 {
  content: string;
}
const struct1Initializer: struct1 = {
  content: ""
};
interface structx2 {
  field1: struct1;
  field2: struct1;
}
const structx2Initializer: structx2 = {
  field1: struct1Initializer,
  field2: struct1Initializer
};
let var1: structx2 = {
  field1: { content: "", anotherStr: "" },
  field2: { content: "", anotherStr: "" }
};
console.log(`initialized...`);
console.log(`var1.field1.content=${var1.field1.content} (expected "")`);
console.log(`var1.field2.content=${var1.field2.content} (expected "")`);

console.log(`set field1 only...`);
var1.field1.content = "11";
console.log(`var1.field1.content=${var1.field1.content} (expected "11")`);
console.log(`var1.field2.content=${var1.field2.content} (expected "")`);
var1.field2.content = "22";
let str: string = JSON.stringify(var1);
console.log(var1);
console.log(`set field2 only...`);
console.log(`var1.field1.content=${var1.field1.content} (expected "11")`);
console.log(`var1.field2.content=${var1.field2.content} (expected "22")`);

console.log(`reinitialized...`);
var1 = structx2Initializer;
console.log(`var1.field1.content=${var1.field1.content} (expected "")`);
console.log(`var1.field2.content=${var1.field2.content} (expected "")`);
