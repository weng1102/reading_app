import * as fs from "fs";
import * as path from "path";
import assert from "assert";
//import * as fs from "fs";
import { ParseNodeSerializeFormatEnumType } from "./baseClasses";
import { Logger } from "./logger";
//import { FileParseNode } from "./parsefiles";
import { AppNode } from "./parseapp";
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
let appNode: AppNode = new AppNode();
let logger: Logger = appNode.logger;
appNode.logger.appName = "parsetest01";
let inputFileSpecs: string[];
let switches: string[] = [];
let args: string[] = process.argv.slice(2);
while (args.length > 0 && args[0].length > 0 && args[0][0] === "-") {
  switches.push(args.shift()!);
}
if (switches.includes("--help")) {
  logger.info(
    `Usage: node parsetest01.ts [OPTIONS] [FILE(s)]\n` +
      `Parses markdown files into json output for reader\n\n` +
      `Options:\n` +
      `  --dumpjson       display generated json\n` +
      `  --dumplinks      display link list\n` +
      `  --dumpsections   display section list\n` +
      `  --dumpsentences  display sentence list\n` +
      `  --dumpterminals  display terminal list\n` +
      `  --dumptree       display parse tree\n` +
      `  --nooutput       do not generate output json file(s)\n` +
      `  --testreload     reload generated file\n` +
      `  --adorn          adorn output mode\n` +
      `  --diagnostic     diagnostic output mode\n` +
      `  --verbose        verbose output mode\n`,
    false,
    false,
    false,
    false
  );
  process.exit();
}
logger.adornMode = switches.includes("--adorn");
logger.diagnosticMode = switches.includes("--diagnostic");
logger.verboseMode = switches.includes("--verbose");
logger.info(
  `adorn mode: ${logger.adornMode ? "ON" : "OFF"}`,
  false,
  false,
  false,
  false
);
logger.info(
  `diagnostic mode: ${logger.diagnosticMode ? "ON" : "OFF"}`,
  false,
  false,
  false,
  false
);
logger.info(
  `verbose mode: ${logger.verboseMode ? "ON" : "OFF"}`,
  false,
  false,
  false,
  false
);
inputFileSpecs = args.filter(mdFiles => mdFiles.endsWith(inputExtension));
for (let inputFileSpec of inputFileSpecs) {
  let pageNode = new PageParseNode(appNode);
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
  if (switches.includes("--dumpdatasource")) {
    logger.info(
      `dumping datasource for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(
      pageNode.dataSource.serialize(ParseNodeSerializeFormatEnumType.TABULAR),
      false,
      false,
      false,
      false
    );
  }
  if (switches.includes("--dumptree")) {
    logger.info(
      `dumping tree for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(
      pageNode.serialize(ParseNodeSerializeFormatEnumType.TREEVIEW),
      false,
      false,
      false,
      false
    );
  }
  if (switches.includes("--dumpjson")) {
    logger.info(
      `dumping json for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(
      pageNode.serialize(ParseNodeSerializeFormatEnumType.TABULAR),
      false,
      false,
      false,
      false
    );
  }
  if (switches.includes("--dumpterminals")) {
    logger.info(
      `dumping terminal list for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(
      pageNode.userContext.terminals.serialize(),
      false,
      false,
      false,
      false
    );
  }
  if (switches.includes("--dumpsentences")) {
    logger.info(
      `dumping sentence list for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(
      pageNode.userContext.sentences.serialize(),
      false,
      false,
      false,
      false
    );
  }
  if (switches.includes("--dumplinks")) {
    logger.info(
      `dumping links for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(
      pageNode.userContext.links.serialize(),
      false,
      false,
      false,
      false
    );
  }
  if (switches.includes("--dumpsections")) {
    logger.info(
      `dumping section list for ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    logger.info(
      pageNode.userContext.sections.serialize(),
      false,
      false,
      false,
      false
    );
  }
  let json: string = pageNode.serialize(ParseNodeSerializeFormatEnumType.JSON);
  if (!switches.includes("--nooutput")) {
    logger.info(
      `generating json file ${path.basename(outputFileSpec)}`,
      false,
      false,
      false,
      false
    );
    fs.writeFileSync(outputFileSpec, json);
  }
  if (switches.includes("--testreload")) {
    let inputStr: string = fs.readFileSync(outputFileSpec).toString();
    let reloaded: IPageContent = JSON.parse(inputStr);
    try {
      assert.deepEqual(reloaded, pageNode);
    } catch (e) {
      console.log((<Error>e).message);
      logger.info(
        `integrity failed for file ${path.basename(outputFileSpec)}`,
        false,
        false,
        false,
        false
      );
    }
  }
}
