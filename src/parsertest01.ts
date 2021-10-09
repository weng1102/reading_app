import * as fs from "fs";
import * as path from "path";
//import * as fs from "fs";
import { ParseNodeSerializeFormatEnumType } from "./baseClasses";
import { Logger } from "./logger";
//import { FileParseNode } from "./parsefiles";
import { PageParseNode } from "./parsepages";
PageParseNode;

//const zeroPad = (num, places) => String(num).padStart(places, "0");

//let fileNode: FileParseNode;
//let pageNode: PageParseNode;
let linesParsed: number;
let inputMdFile: string;
let outputFile: string;
const inputPath: string = "curriculum/";
const outputPath: string = "reading_fe_app/src/content/";
const inputType: string = "md"; // markdown
const outputType: string = "json";
const filenameList: string[] = [
  "blockquote",
  "terminals",
  "terminals_acronym",
  "terminals",
  "3wordsentences",
  "terminals_email",
  "terminals_date2",
  "test1",
  "shortlists"
];
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

for (let fileName of filenameList) {
  inputMdFile = `${inputPath}${fileName}.${inputType}`;
  outputFile = `${outputPath}${fileName}.${outputType}`;

  logger.info(
    `parsing file: ${path.basename(inputMdFile)}`,
    false,
    false,
    false,
    false
  );
  let pageNode = new PageParseNode(this);
  linesParsed = pageNode.dataSource.connect(inputMdFile);
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
  pageNode.name = `${fileName}`;
  // console.log(`writing file ${outputFile}`);
  fs.writeFileSync(
    outputFile,
    pageNode.serialize(ParseNodeSerializeFormatEnumType.JSON)
  );
}
