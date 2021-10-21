import * as fs from "fs";
import * as path from "path";
//import * as fs from "fs";
import { ParseNodeSerializeFormatEnumType } from "./baseClasses";
import { Logger } from "./logger";
//import { FileParseNode } from "./parsefiles";
import { PageParseNode } from "./parsepages";
///PageParseNode;

//const zeroPad = (num, places) => String(num).padStart(places, "0");

//let fileNode: FileParseNode;
//let pageNode: PageParseNode;
let linesParsed: number;
let inputMdFile: string;
let outputFile: string;
const inputPath: string = "curriculum/";
const outputPath: string = "dist/";
const inputExtension: string = ".md"; // markdown
const outputExtension: string = ".json";

let logger = new Logger(this);
///let pageNode = new PageContent(this);
//let timestamp: string = new MyDate().yyyymmddhhmmss();
//let userRonlyn = new UserContext("Ronlyn");
logger.verboseMode = true;
logger.adornMode = true;
//logger.diagnosticMode = true;
//
logger.info(
  `verbose mode: ${logger.verboseMode ? "ON" : "OFF"}`,
  false,
  false,
  false,
  false
);
logger.info(
  `adorn mode: ${logger.adornMode ? "ON" : "OFF"}`,
  false,
  false,
  false,
  false
);
let inputFileSpecs: string[] = process.argv
  .slice(2)
  .filter(mdFiles => mdFiles.endsWith(inputExtension));
for (let inputFileSpec of inputFileSpecs) {
  let pageNode = new PageParseNode(this);
  linesParsed = pageNode.dataSource.connect(inputFileSpec);
  // console.log(
  //   pageNode.dataSource.serialize(ParseNodeSerializeFormatEnumType.TABULAR)
  // );
  pageNode.parse();
  pageNode.transform();
  //console.log(`nextWordIdx=${pageNode.userContext.nextTerminalIdx}`);
  // logger.info(
  //   `${linesParsed} source line(s) parsed into ${pageNode.dataSource.length()} annotated line(s)`,
  //   false,
  //   false,
  //   false,
  //   false
  // );
  // console.log(`tree view:
  //   ${pageNode.serialize(ParseNodeSerializeFormatEnumType.TREEVIEW, "page", "")}`);
  // console.log(`tabular view:
  //   ${pageNode.serialize(ParseNodeSerializeFormatEnumType.TABULAR, "page", "")}`);
  // console.log(`terminal List:`);
  // console.log(pageNode.userContext.terminals.serialize());
  // console.log(`heading List:`);
  // console.log(pageNode.userContext.headings.serialize());
  // console.log(`sentence List (of consecutive terminals):`);
  // console.log(pageNode.userContext.sentences.serialize());
  // console.log(`section List (of consecutive terminals):`);
  // console.log(pageNode.userContext.sections.serialize());
  // console.log(pageNode.serialize(ParseNodeSerializeFormatEnumType.JSON));
  let fileName = inputFileSpec.substring(
    inputFileSpec.indexOf("/") + 1,
    inputFileSpec.indexOf(".")
  );
  pageNode.filename = `${fileName}${outputExtension}`;
  let outputFileSpec = `${outputPath}${fileName}${outputExtension}`;
  logger.info(
    `generating file ${path.basename(outputFileSpec)}`,
    false,
    false,
    false,
    false
  );

  fs.writeFileSync(
    outputFileSpec,
    pageNode.serialize(ParseNodeSerializeFormatEnumType.JSON)
  );
}
