import * as path from "path";
import * as fs from "fs";

const AppInfo = require(path.resolve("./appinfo.json")); // should use module.paths and find-me.js
import { MyDate } from "./utilities";
import { Logger } from "./logger";
import { TokenListType, Tokenizer } from "./tokenizer";
import { SentenceNode } from "./parsesentences";
import { ParseNodeSerializeFormatEnumType, UserContext } from "./baseClasses";
//import { dataAdapter } from "./dataadapter";
///import  { PageContent } from 'parser.js';
//import  { SectionContent } from 'parser.js';
//const  { TestFormatter } = require('parser.js');
//const { TokenTypes }  = require('tokentypes.js');

// unit tests
//const ut_tokenizer = require('unittest_tokenizer.json');
//const ut_parser = require('unittest_parser.json');
//const ut_transformer = require('unittest_transformer.json');
import unittestdata from "./unittest_sentences01";
import { UnittestDataType, UnittestSentenceType } from "./unittest_sentences01";
///import { UnittestDataType, UnittestSentenceType } from 'unittest_sentences01';

// unit test outputs (optional based on utoutput boolean below)
const basepath = path.resolve();
///const htmloutput = path.join(basepath, "unittest01.html");
const utresultDir = path.join(
  basepath,
  AppInfo.path.relative.unittest,
  AppInfo.path.relative.results
);
const uttokenout = path.join(utresultDir, "ut01token_sentences.json");
const utparseout = path.join(utresultDir, "ut01parse_sentences.json");
const uttransformout = path.join(utresultDir, "ut01transform_sentences.json");
///const uttransformsectionout = path.join(utresultDir, "ut01transform_sections.json");
const utoutput = true; // should be command switch
/*
const utSentencesJson =  {
  UnitTest01: {
    timestamp:"",
    sections: [
      { id: "0",
      content: "",
      sentences: [
        { actual: { tokenizer: "", parser: "", transformer:"" }
        }
      ]}
    ]}
  };
  */
interface utSectionResultsType {
  timestamp: string;
  sections: [
    {
      id: number;
      name: string;
      sentences: utSentenceResultsType[];
    }
  ];
}
interface utSentenceResultsType {
  id: number;
  content: string;
  expected: {
    tokenizer: string;
    parser: string;
    transformer: string;
  };
}
const utSectionResultsInitState: utSectionResultsType = {
  timestamp: "",
  sections: [
    {
      id: 0,
      name: "",
      sentences: []
    }
  ]
};
/*
const utSectionsJson = {
  UnitTest01: {
    timestamp: "",
    sections: [
      {  id: "",
        content: "",
        actual: "",
      }
    ]
  }
};
*/
/*
const utjson = {
  id: "0",
  name: "",
  content: "",
  actual: "",
  expected: { "tokenizer":"", "parser":"", "transformer":"" }
};
*/
/*
const utjson2 = {
  id: "0",
  name: "",
  actual: "",
  expected: ""
};
*/
let logger = new Logger(this);
///let pageNode = new PageContent(this);
let passCount: number = 0;
let secId: number = 0;
let sentId: number = 0;
let grandTotalCount: number = 0;
let grandTotalPassCount: number = 0;
let testSentLabel: string;
let totalCount: number = 0;
let totalPassCount: number = 0;
let timestamp: string = new MyDate().yyyymmddhhmmss();
let userRonlyn = new UserContext("Ronlyn");
logger.verboseMode = true;
logger.adornMode = true;
let testSectionLabel: string = "";
let unitTestSuccessful: boolean;
//logger.diagnosticMode = true;
logger.info(
  `${path.basename(__filename)} started at ${timestamp}`,
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
logger.info(
  `adorn mode: ${logger.adornMode ? "ON" : "OFF"}`,
  false,
  false,
  false,
  false
);
logger.info(
  `unit test output mode: ${utoutput ? "ON" : "OFF"}`,
  false,
  false,
  false,
  false
);

let resultsSecIdx: number;
totalPassCount = 0;
totalCount = 0;
logger.adorn(
  "*********************************************",
  false,
  false,
  false,
  false
);
logger.adorn(
  "* S E N T E N C E  T O K E N I Z E R ********",
  false,
  false,
  false,
  false
);
//let results = new Object();
let ut_sentences01: UnittestDataType = unittestdata;
let results: utSectionResultsType = utSectionResultsInitState; // = utSentenceResultsInitState;
///results = utSentenceResultsType();
results.timestamp = timestamp;
for (let secIdx = 0; secIdx < ut_sentences01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_sentences01.sections[secIdx].id;
  //utoutput
  resultsSecIdx =
    results.sections.push({
      id: secId,
      name: ut_sentences01.sections[secIdx].name,
      sentences: []
    }) - 1;
  testSectionLabel = `Tokenizer01 SECTION[${secId}]`;
  logger.adorn(
    "*********************************************",
    false,
    false,
    false,
    false
  );
  logger.adorn(
    testSectionLabel + ": " + ut_sentences01.sections[secIdx].name,
    false,
    false,
    false,
    false
  );
  let tokenizer = new Tokenizer(this);
  for (
    let sentIdx = 0;
    sentIdx < ut_sentences01.sections[secIdx].sentences.length;
    sentIdx++
  ) {
    sentId = ut_sentences01.sections[secIdx].sentences[sentIdx].id;
    testSentLabel = `${testSectionLabel}[${sentIdx}]:`;
    logger.adorn(
      "---------------------------------------------",
      false,
      false,
      false,
      false
    );
    logger.adorn(
      `${testSentLabel}${ut_sentences01.sections[secIdx].name}`,
      false,
      false,
      false,
      false
    );
    logger.adorn(
      `${testSentLabel}${ut_sentences01.sections[secIdx].sentences[sentIdx].content}`,
      false,
      false,
      false,
      false
    );
    let input = ut_sentences01.sections[secIdx].sentences[sentIdx];
    let result = tokenizer.insertMarkupTags(input.content);
    logger.adorn(
      `${testSentLabel}${result} (Marked up)`,
      false,
      false,
      false,
      false
    );
    let tokenList: TokenListType;
    tokenList = tokenizer.tokenize(result);
    unitTestSuccessful = tokenizer.unitTest(
      tokenizer.serializeForUnitTest(tokenList),
      input.expected.tokenizer
    );
    logger.info(
      `${testSentLabel}${unitTestSuccessful ? "PASSED" : "FAILED"}`,
      false,
      false,
      false,
      false
    );
    if (unitTestSuccessful) {
      passCount++;
    } else {
      // dump
      //      logger.diagnosticMode = true;
      logger.diagnostic(tokenizer.serializeAsTable(tokenList));
    }
    //utoutput
    results.sections[resultsSecIdx].sentences.push({
      id: sentId,
      content: input.content,
      expected: {
        tokenizer: tokenizer.serializeForUnitTest(tokenList),
        parser: "",
        transformer: ""
      }
    });
  }
  logger.info(
    `${testSectionLabel}: ${passCount}/` +
      `${ut_sentences01.sections[secIdx].sentences.length} PASSED`,
    false,
    false,
    false,
    false
  );
  totalPassCount += passCount;
  totalCount += ut_sentences01.sections[secIdx].sentences.length;
}
if (utoutput) fs.writeFileSync(uttokenout, JSON.stringify(results));
logger.info(
  `Tokenizer01 Overall total: ${totalPassCount}/${totalCount} PASSED`,
  false,
  false,
  false,
  false
);
grandTotalPassCount = totalPassCount;
grandTotalCount = totalCount;
//tokens = null;
totalPassCount = 0;
totalCount = 0;

logger.diagnosticMode = true;
logger.adorn(
  "*********************************************",
  false,
  false,
  false,
  false
);
logger.adorn(
  "* S E N T E N C E  P A R S E R **************",
  false,
  false,
  false,
  false
);
results = utSectionResultsInitState; // = utSentenceResultsInitState;
results.timestamp = timestamp;
for (let secIdx = 0; secIdx < ut_sentences01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_sentences01.sections[secIdx].id;
  //utoutput
  resultsSecIdx =
    results.sections.push({
      id: secId,
      name: ut_sentences01.sections[secIdx].name,
      sentences: []
    }) - 1;
  testSectionLabel = "Parser01 SECTION[" + secId + "]";
  logger.adorn(
    "*********************************************",
    false,
    false,
    false,
    false
  );
  logger.adorn(
    testSectionLabel + ": " + ut_sentences01.sections[secIdx].name,
    false,
    false,
    false,
    false
  );
  for (
    let sentIdx = 0;
    sentIdx < ut_sentences01.sections[secIdx].sentences.length;
    sentIdx++
  ) {
    sentId = ut_sentences01.sections[secIdx].sentences[sentIdx].id;
    testSentLabel = testSectionLabel + "[" + sentIdx + "]: ";
    logger.adorn(
      "---------------------------------------------",
      false,
      false,
      false,
      false
    );
    //    logger.adorn(testSectionLabel + ": " +  ut_sentences01.section[secIdx].name);
    logger.adorn(
      testSentLabel +
        ut_sentences01.sections[secIdx].sentences[sentIdx].content,
      false,
      false,
      false,
      false
    );
    let input = ut_sentences01.sections[secIdx].sentences[sentIdx]; // need id and content
    let tokenizer = new Tokenizer(this);
    let tokenizerResult = tokenizer.serializeForUnitTest(
      tokenizer.tokenize(tokenizer.insertMarkupTags(input.content))
    );
    let sentenceNode: SentenceNode = new SentenceNode(null, input.content);
    sentenceNode.userContext = userRonlyn;
    sentenceNode.id = input.id;
    sentenceNode.content = input.content;
    sentenceNode.parse();
    let parserResult: string = sentenceNode.serialize(
      ParseNodeSerializeFormatEnumType.UNITTEST
    );
    let expected = input.expected.parser;
    unitTestSuccessful = sentenceNode.unitTest(parserResult, expected);
    logger.adorn(
      testSentLabel + (unitTestSuccessful ? "PASSED" : "FAILED"),
      false,
      false,
      false,
      false
    );
    if (unitTestSuccessful) {
      passCount++;
    } else {
      logger.diagnosticMode = true;
      logger.diagnostic("actual:   " + parserResult);
      logger.diagnostic("expected: " + expected);
      logger.diagnostic(
        `${sentenceNode.serialize(
          ParseNodeSerializeFormatEnumType.TREEVIEW,
          "+-"
        )}`
      );
      logger.diagnosticMode = false;
    }
    console.log(
      `${sentenceNode.serialize(ParseNodeSerializeFormatEnumType.TREEVIEW, "")}`
    );

    //utoutput
    results.sections[resultsSecIdx].sentences.push({
      id: sentId,
      content: input.content,
      expected: {
        tokenizer: tokenizerResult,
        parser: parserResult,
        transformer: ""
      }
    });
  }
  logger.info(
    testSectionLabel +
      ": " +
      passCount +
      "/" +
      ut_sentences01.sections[secIdx].sentences.length +
      " PASSED",
    false,
    false,
    false,
    false
  );
  totalPassCount += passCount;
  totalCount += ut_sentences01.sections[secIdx].sentences.length;
}
if (utoutput) {
  fs.writeFileSync(utparseout, JSON.stringify(results));
}
logger.info(
  "Parser01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED",
  false,
  false,
  false,
  false
);
grandTotalPassCount += totalPassCount;
grandTotalCount += totalCount;

logger.diagnosticMode = true;
logger.adorn(
  "*********************************************",
  false,
  false,
  false,
  false
);
logger.adorn(
  "* S E C T I O N   P A R S E R ***************",
  false,
  false,
  false,
  false
);
testSectionLabel = "Parser01 SECTION[" + secId + "]";
logger.adorn(
  "*********************************************",
  false,
  false,
  false,
  false
);

/*
totalPassCount = 0;
totalCount = 0;
logger.adorn("*********************************************", false, false, false, false);
logger.adorn("* S E N T E N C E   T R A N S F O R M E R ***", false, false, false, false);
results.timestamp = timestamp;
results = utSectionResultsInitState; // = utSentenceResultsInitState;
for (let secIdx = 0; secIdx <  ut_sentences01.sections.length; secIdx++) {
  passCount = 0;
  secId =  ut_sentences01.sections[secIdx].id;
  //utoutput
  resultsSecIdx = results.sections.push({
    id: secId,
    name: ut_sentences01.sections[secIdx].name,
    sentences:[] }) - 1;
  testSectionLabel = "Transformer01 SECTION[" + secId + "]";
  logger.adorn("*********************************************", false, false, false, false);
  logger.adorn(testSectionLabel+": "+  ut_sentences01.sections[secIdx].name, false, false, false, false);
  for(let sentIdx = 0; sentIdx <  ut_sentences01.sections[secIdx].sentences.length; sentIdx++) {
    sentId =  ut_sentences01.sections[secIdx].sentences[sentIdx].id;
    let testSentLabel = testSectionLabel + "[" + sentIdx + "]: ";
    logger.adorn("---------------------------------------------", false, false, false, false);
//    logger.adorn(testSectionLabel + ": " +  ut_sentences01.section[secIdx].name);
    logger.adorn(testSentLabel +  ut_sentences01.sections[secIdx].sentences[sentIdx].content, false, false, false, false);
    let input =  ut_sentences01.sections[secIdx].sentences[sentIdx];
    let sentenceNode = new SentenceContent(this);
    sentenceNode.userContext = userRonlyn;
    sentenceNode.parse(input);
    let actual = sentenceNode.transform();
    unitTestSuccessful = sentenceNode.unitTest(actual, input.expected.transformer);
    logger.info(testSentLabel + ((unitTestSuccessful) ? "PASSED" : "FAILED"), false, false, false, false);
    if (unitTestSuccessful) {
      passCount++;
    }
    else {
      logger.diagnosticMode = true;
      logger.diagnostic(sentenceNode.serializeAsTable(25,10,10));
      logger.diagnostic("actual:   " + sentenceNode.transform());
      logger.diagnostic("expected: " + input.expected.transformer);
    }
    results.sections[resultsSecIdx].sentences.push({
      id: sentId,
      actual: input.content,
      tokenizer: "",
      parser: "",
      transformer: actual });
  }
  logger.info(testSectionLabel + ": " + passCount +"/"
              +  ut_sentences01.sections[secIdx].sentences.length + " PASSED",
              false, false, false, false);
  totalPassCount += passCount;
  totalCount +=  ut_sentences01.sections[secIdx].sentences.length;
}
if (utoutput) fs.writeFileSync(uttransformout, JSON.stringify(results));
logger.info("Transformer01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED",
            false, false, false, false);
grandTotalPassCount += totalPassCount;
grandTotalCount += totalCount;
/*
passCount = 0;
totalCount = 0;
logger.adorn("*********************************************", false, false, false, false);
logger.adorn("* S E C T I O N  T R A N S F O R M E R ******", false, false, false, false);
results = utSectionResultsInitState; // = utSentenceResultsInitState;
results.timestamp = timestamp;
let sectionNode;
let htmlstring = "<html>";
for (let secIdx = 0; secIdx <  ut_sentences01.sections.length; secIdx++) {
  totalCount++;
  secId =  ut_sentences01.sections[secIdx].id;
  testSectionLabel = "Transformer01 SECTION[" + secId + "]: ";
  logger.adorn("*********************************************", false, false, false, false);
  logger.adorn(testSectionLabel +  ut_sentences01.sections[secIdx].name, false, false, false, false);
  sectionNode = new SectionContent(this);
  sectionNode.userContext = userRonlyn;
  sectionNode.id =  ut_sentences01.sections[secIdx].id;
  sectionNode.name =  ut_sentences01.sections[secIdx].name;
//  sectionNode.parse( ut_sentences01.sections[secIdx].sentences);
  sectionNode.parseUnittest( ut_sentences01.sections[secIdx].sentences);
  let actual = sectionNode.transform();
  let expected =  ut_sentences01.sections[secIdx].expected;
  //utoutput
  results.sections.push({
    id: secId,
    name: ut_sentences01.sections[secIdx].name,
    actual: actual,
    expected: expected });
//  logger.info(sectionNode.unitTest( ut_sentences01.sections[secIdx].sentences));
  let unitTestSuccessful = sectionNode.unitTest(actual, expected);
  if (unitTestSuccessful) {
    passCount++;
  }
  else {
    logger.diagnosticMode = true;
    logger.diagnostic((sectionNode.serializeAsTable(30, 10, 10)));
    logger.diagnostic("actual:   " + sectionNode.transform());
    logger.diagnostic("expected: " + expected.transformer);
  }
  logger.adorn(testSectionLabel + ((unitTestSuccessful) ? "PASSED" : "FAILED"), false, false, false, false);
}
if (utoutput) fs.writeFileSync(uttransformsectionout, JSON.stringify(results));
logger.info("Transformer01 SECTION Overall total: " + passCount + "/" + totalCount + " PASSED",
            false, false, false, false);
grandTotalPassCount += passCount;
grandTotalCount += totalCount;

logger.adorn("********************************************", false, false, false, false);
logger.adorn("* P A G E  P A R S E R *********************", false, false, false, false);
testSectionLabel = "Tranformer01 PAGE";
logger.adorn("********************************************", false, false, false, false);
pageNode = new PageContent(this);
pageNode.userContext = userRonlyn;
pageNode.parse( ut_sentences01);
logger.diagnostic((pageNode.serializeAsTable(40, 10, 10)));
let pageFormatter = new TestFormatter(this);
pageFormatter.userContext = userRonlyn;
pageFormatter.content = pageNode;
let htmlString = pageFormatter.transform();
if (htmloutput) fs.writeFileSync(htmloutput, htmlString);
logger.info(testSectionLabel+": Browse " + htmloutput, false, false, false, false);
*/
logger.adorn(
  "********************************************",
  false,
  false,
  false,
  false
);
logger.info(
  `${path.basename(
    __filename
  )} GRAND TOTAL:${grandTotalPassCount}/${grandTotalCount} PASSED`,
  false,
  false,
  false,
  false
);
logger.adorn(
  "********************************************",
  false,
  false,
  false,
  false
);
