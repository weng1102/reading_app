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
inputMdFile = "curriculum/lists.md";
inputMdFile = "curriculum/shortlists.md";
//inputMdFile = "curriculum/terminals.md";
//inputMdFile = "curriculum/terminals_date3.md";
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
console.log(
  pageNode.dataSource.serialize(ParseNodeSerializeFormatEnumType.TABULAR, "")
);
// fileNode = new FileParseNode(this);
// linesParsed = fileNode.connect(inputMdFile);
// fileNode.parse();
// fileNode.serialize();
/*
if (logger.diagnosticMode) {
  for (let i = 0; i < .buffer.length; i++) {
    console.log(
      `${zeroPad(i + 1, 3)}: {${ds.buffer[i].groups}} (type:${
        ds.buffer[i].mdtype
      })`
    );
  }
}
*/
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
fs.writeFileSync(
  "./src/parsetest.json",
  pageNode.serialize(ParseNodeSerializeFormatEnumType.JSON)
);
