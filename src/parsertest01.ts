import * as fs from "fs";
import * as path from "path";
import assert from "assert";
//import * as fs from "fs";
import { ParseNodeSerializeFormatEnumType } from "./baseClasses";
import { Logger } from "./logger";
//import { FileParseNode } from "./parsefiles";
import { AppNode } from "./parseapp";
import { PageParseNode } from "./parsepages";
import CSiteMap from "./parsesitemaps";
import { IPageContent } from "./pageContentType";

const Usage: string =
  `Usage: node parsetest01.ts [OPTIONS] [FILE(s)]\n` +
  `Parses markdown files into json output for reader\n\n` +
  `Options:\n` +
  `  --dumpdatasource display parsed markdown\n` +
  `  --dumpheadings   display headings for navbar\n` +
  `  --dumpfillins    display fillins\n` +
  `  --dumpjsondataappdisplay generated json\n` +
  `  --dumplinks      display link list\n` +
  `  --dumpsections   display section list\n` +
  `  --dumpsentences  display sentence list\n` +
  `  --dumpsitemap    display sitemap iff --sitemap\n` +
  `  --dumpterminals  display terminal list\n` +
  `  --dumptree       display parse tree\n` +
  `  --sitemap        creates sitemap json\n` +
  `  -x=[exclusions]  sitemap exclusions (must follow --sitemap)\n` +
  `  --nooutput       do not generate output json file(s)\n` +
  `  --testreload     reload generated file\n` +
  `  --adorn          adorn output mode\n` +
  `  --diagnostic     diagnostic output mode\n` +
  `  --verbose        verbose output mode\n`;

const curriculumPath: string = "curriculum/";
const distPath: string = "dist/";
const mdExtension: string = ".md"; // markdown
const jsonExtension: string = ".json";
let appNode: AppNode = new AppNode();
let logger: Logger = appNode.logger;
appNode.logger.appName = "parsetest01";
let inputFileSpecs: string[];
let switches: string[] = [];
let args: string[] = process.argv.slice(2);

while (args.length > 0 && args[0].length > 0 && args[0][0] === "-") {
  switches.push(args.shift()!);
}
if (switches.includes("--help") || switches.includes("-help")) {
  logger.info(Usage, false, false, false, false);
  process.exit();
}
logger.adornMode = switches.includes("--adorn");
logger.diagnosticMode = switches.includes("--diagnostic");
logger.verboseMode = switches.includes("--verbose");
logger.info(`adorn mode: ${logger.adornMode ? "ON" : "OFF"}`);
logger.info(`diagnostic mode: ${logger.diagnosticMode ? "ON" : "OFF"}`);
logger.info(`verbose mode: ${logger.verboseMode ? "ON" : "OFF"}`);
if (switches.includes("--sitemap")) {
  // Should be refactored into parsesitemap(distPath)
  let siteMap: CSiteMap = new CSiteMap(appNode);
  logger.info(`generating sitemap`, false, false, false, false);
  let exclusionList: string = switches[switches.indexOf("--sitemap") + 1];
  if (exclusionList !== undefined) {
    exclusionList = exclusionList.substring(
      exclusionList.indexOf("=") + 1,
      exclusionList.length
    );
    siteMap.exclusionList = exclusionList;
  }
  siteMap.parse();
  if (switches.includes("--dumpsitemap")) {
    logger.info(
      siteMap.serialize(ParseNodeSerializeFormatEnumType.TABULAR),
      false,
      false,
      false,
      false
    );
  }
  if (!switches.includes("--nooutput")) {
    let outputFileSpec = `${curriculumPath}sitemap${mdExtension}`;
    if (switches.includes("--sitemapless")) {
      console.log("sitemapless");
    }
    let mdOutputStr: string = siteMap.serialize(
      ParseNodeSerializeFormatEnumType.MARKDOWN
    );
    logger.info(`generating markdown file ${path.basename(outputFileSpec)}`);
    fs.writeFileSync(outputFileSpec, mdOutputStr);
  }
} else {
  // if switches were parsed properly above, only the file parameter remains.
  inputFileSpecs = args.filter(mdFiles => mdFiles.endsWith(mdExtension));
  if (inputFileSpecs.length === 0) {
    logger.warning(`No files specified`);
  } else if (inputFileSpecs[0].indexOf("*") > 0) {
    logger.error(`No files found for pattern ${args}`);
  } else {
    logger.info(
      `Found ${inputFileSpecs.length} markdown source file${
        inputFileSpecs.length === 1 ? "" : "s"
      }.`
    );
    for (let inputFileSpec of inputFileSpecs) {
      let pageNode = new PageParseNode(appNode);
      let linesParsed: number;
      linesParsed = pageNode.dataSource.connect(inputFileSpec);
      logger.info(
        `Markdown source file ${inputFileSpec} contains ${linesParsed} line${
          linesParsed === 1 ? "" : "s"
        }.`
      );
      pageNode.parse();
      pageNode.transform();

      let fileName = inputFileSpec.substring(
        inputFileSpec.indexOf("/") + 1,
        inputFileSpec.indexOf(".")
      );
      pageNode.filename = `${fileName}${jsonExtension}`;
      let outputFileSpec = `${distPath}${fileName}${jsonExtension}`;
      if (switches.includes("--dumpdatasource")) {
        logger.info(
          `dumping datasource for ${path.basename(outputFileSpec)}`,
          false,
          false,
          false,
          false
        );
        logger.info(
          pageNode.dataSource.serialize(
            ParseNodeSerializeFormatEnumType.TABULAR
          ),
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
      if (switches.includes("--dumpheadings")) {
        logger.info(
          `dumping navbar headings for ${path.basename(outputFileSpec)}`,
          false,
          false,
          false,
          false
        );
        logger.info(
          pageNode.userContext.headings.serialize(),
          false,
          false,
          false,
          false
        );
      }
      if (switches.includes("--dumpfillins")) {
        logger.info(
          `dumping fillins for ${path.basename(outputFileSpec)}`,
          false,
          false,
          false,
          false
        );
        logger.info(
          pageNode.userContext.fillins.serialize(),
          false,
          false,
          false,
          false
        );
      }

      let json: string = pageNode.serialize(
        ParseNodeSerializeFormatEnumType.JSON
      );
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
  }
  // this switch should ignore any other file list parsing with a warning.
  // create site map.
  // 1)  read distDir/  directory
  // 2) open each md to get title, description, category filkename
  // 3) create array of objects with properties in 2)
  // 4) sort by category e.g., https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
  // 5) list with section, sentence, link
  //    * category 1
  //      * [link 1](link1)
  //      * [link 2](link2)
  //    * category 2
  //      * [link 3](link3)
  // 7) write sitemap.md
  // 8) parse sitemap.md into sitemap.json
}
