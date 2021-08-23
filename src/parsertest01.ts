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
inputMdFile = "curriculum/test1.md";
//inputMdFile = "curriculum/blockquote.md";
//inputMdFile = "curriculum/paraheading.md";
//inputMdFile = "curriculum/lists.md";
//inputMdFile = "curriculum/shortlists.md";
//inputMdFile = "curriculum/terminals_date3.md";
inputMdFile = "curriculum/terminals_date1.md";
//inputMdFile = "curriculum/terminals_email.md";
inputMdFile = "curriculum/terminals.md";
inputMdFile = "curriculum/terminals_email.md";
inputMdFile = "curriculum/test1.md";
inputMdFile = "curriculum/terminals_acronym.md";
let logger = new Logger(this);
///let pageNode = new PageContent(this);
//let timestamp: string = new MyDate().yyyymmddhhmmss();
//let userRonlyn = new UserContext("Ronlyn");
logger.verboseMode = true;
logger.adornMode = true;
//logger.diagnosticMode = true;
//
// logger.info(
//   `${path.basename(__filename)} started at ${timestamp}`,
//   false,
//   false,
//   false,
//   false
// );
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

logger.info(
  `input file: ${path.basename(inputMdFile)}`,
  false,
  false,
  false,
  false
);
let pageNode = new PageParseNode(this);
linesParsed = pageNode.dataSource.connect(inputMdFile);
pageNode.dataSource.serialize();
pageNode.parse();
pageNode.transform();
//console.log(`nextWordIdx=${pageNode.userContext.nextTerminalIdx}`);
logger.info(
  `${linesParsed} source line(s) parsed into ${pageNode.dataSource.length()} annotated line(s)`,
  false,
  false,
  false,
  false
);
console.log(
  pageNode.serialize(ParseNodeSerializeFormatEnumType.TREEVIEW, "page", "")
);
console.log(
  pageNode.serialize(ParseNodeSerializeFormatEnumType.TABULAR, "page", "")
);
//console.log(pageNode.userContext.terminals.serialize());
// pageNode.userContext.terminals[566].termIdx = 8888;
// pageNode.userContext.terminals[567].termIdx = 9999;
// console.log(pageNode.userContext.terminals.serialize());
// console.log(
//   pageNode.serialize(ParseNodeSerializeFormatEnumType.TABULAR, "page", "")
// );
//console.log(pageNode.serialize(ParseNodeSerializeFormatEnumType.JSON));
// fs.writeFileSync(
//   "./src/parsetest.json",
//   pageNode.serialize(ParseNodeSerializeFormatEnumType.JSON)
// );
