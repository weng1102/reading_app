import * as fs from "fs";
import * as path from "path";
//import * as fs from "fs";
import { ParseNodeSerializeFormatEnumType } from "./baseClasses";
import { Logger } from "./logger";
//import { FileParseNode } from "./parsefiles";
import { PageParseNode } from "./parsepages";
import { IPageContent } from "./pageContentType";
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
let inputFileSpecs: string[];
let switches: string[] = [];
let args: string[] = process.argv.slice(2);
while (args.length > 0 && args[0].length > 0 && args[0][0] === "-") {
  switches.push(args.shift()!);
}
inputFileSpecs = args.filter(mdFiles => mdFiles.endsWith(inputExtension));
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
  if (switches.includes("-dumptree")) {
    logger.info(
      `dumping tree for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(pageNode.serialize(ParseNodeSerializeFormatEnumType.TREEVIEW),
      false,
      false,
      false,
      false
    )
  }
  if (switches.includes("-dumpjson")) {
    logger.info(
      `dumping json for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(pageNode.serialize(ParseNodeSerializeFormatEnumType.TABULAR),
      false,
      false,
      false,
      false
    )
  }
  if (switches.includes("-dumpterminals")) {
    logger.info(
      `dumping terminal list for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(pageNode.userContext.terminals.serialize(),
      false,
      false,
      false,
      false
    )
  }
  if (switches.includes("-dumpsentences")) {
    logger.info(
      `dumping sentence list for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(pageNode.userContext.sentences.serialize(),
      false,
      false,
      false,
      false
    )
  }
  if (switches.includes("-dumpsections")) {
    logger.info(
      `dumping section list for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(pageNode.userContext.sections.serialize(),
      false,
      false,
      false,
      false
    )
  }
  logger.info(
    `generating json file ${path.basename(outputFileSpec)}`,
    false,
    false,
    false,
    false
  );
  let json: string = pageNode.serialize(ParseNodeSerializeFormatEnumType.JSON);
  fs.writeFileSync(outputFileSpec, json);
  // // let reloaded: IPageContent = JSON.parse(json);
  // // if (reloaded !== pageNode.serialize(ParseNodeSerializeFormatEnumType.JSON)) {
  // //   logger.info(
  // //     `integrity failed for file ${path.basename(outputFileSpec)}`,
  // //     false,
  // //     false,
  // //     false,
  // //     false
  // //   );
  // }
}
