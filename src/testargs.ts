export function ParseNodeSerializeTabular(...fields: string[]): string {
  let outputStr = "";
  fields.forEach(field => {
    outputStr = `${outputStr} ${field.substring(0, 20).padEnd(20)}`;
  });
  return outputStr;
}
console.log(
  ParseNodeSerializeTabular(
    "a12345678901234567890123",
    "b12345678901234567890123",
    "c12345678901234567890123"
  )
);
