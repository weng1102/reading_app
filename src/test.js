var  { Logger, MyDate } = require('../src/utilities.js');
var  { Tokenizer } = require('../src/tokenizer.js');
var  { PageContent, SectionContent, SentenceContent, UserContext } = require('../src/parser.js');
var  { PageFormatter, TestFormatter } = require('../src/parser.js');
const { TokenTypes }  = require('../src/tokentypes.js');

const ut_tokenizer = require('../data/unittest_tokenizer.json');
const ut_parser = require('../data/unittest_parser.json');
const ut_transformer = require('../data/unittest_transformer.json');
const ut_sentences01 = require('../data/unittest_sentences01.json');
const fs = require('fs');
const path = require('path');

var tokenType;
var spanTree;
var outputHTML;
var tokenlist;
const utjson = {
  id: "0",
  content: "",
  expected: { tokenizer: "", parser: "", transformer:"" }
};
const utjson1 = {
  id: "0",
  timestamp: "",
  content: "",
  actual: "",
  expected: ""
};

const basepath = "D:\\users\\wen\\documents\\personal\\ronlyn\\medical\\therapy\\SLP\\reading_app\\";
const htmloutput = basepath+"test2_parser.html";
const uttokenout = basepath+"data\\ut01token.txt";
const utparserout = basepath+"data\\ut01parse.txt";
const uttransformout = basepath+"data\\ut01transform.txt";
const utoutput = false; // create expected values for unit test

let logger = new Logger();
let pageNode = new PageContent(this);
let passCount = 0;
let secId = 0;
let sentId = 0;
let totalCount = 0;
let totalPassCount = 0;
let timestamp = new MyDate().yyyymmddhhmmss();
let userRonlyn = new UserContext("Ronlyn");
logger.verboseMode = true;
logger.adornMode = true;
let testSectionLabel = "";
let unitTestSuccessful;

console.log(path.basename(__filename) + " started at " + timestamp);
console.log("verbose mode: "+(logger.verboseMode ? "ON" : "OFF"));
console.log("adorn mode: "+(logger.adornMode ? "ON" : "OFF"));
console.log("unit test output mode: " + (utoutput ? "ON" : "OFF"));

totalPassCount = 0;
totalCount = 0;
logger.adorn("*********************************************");
logger.adorn("* S E N T E N C E  T O K E N I Z E R ********");
if (uttokenout) fs.writeFileSync(uttokenout, timestamp + "\n");
if (uttransformout) fs.writeFileSync(uttransformout, timestamp+"\n");
for (let secIdx = 0; secIdx < ut_sentences01.UnitTest01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_sentences01.UnitTest01.sections[secIdx].id;
  testSectionLabel = "Tokenizer01 SECTION[" + secId + "]";
  logger.adorn("*********************************************");
  logger.adorn(testSectionLabel+": "+ ut_sentences01.UnitTest01.sections[secIdx].name);
  for (let sentIdx = 0; sentIdx < ut_sentences01.UnitTest01.sections[secIdx].sentences.length; sentIdx++) {
    sentId = ut_sentences01.UnitTest01.sections[secIdx].sentences.id;
    testSentLabel = testSectionLabel + "[" + sentIdx + "]: ";
    logger.adorn("---------------------------------------------");
    logger.adorn(testSentLabel + ut_sentences01.UnitTest01.sections[secIdx].name);
    logger.adorn(testSentLabel + ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].content);
    let input = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx];
    let tokenizer = new Tokenizer(this);
    let result = tokenizer.insertMarkupTags(input.content);
    logger.adorn(testSentLabel + result + " (Marked up)");
    let tokens = tokenizer.tokenize(result);
    unitTestSuccessful = tokenizer.unitTest(
                            tokenizer.serializeForUnitTest(tokenizer.tokenize(result)),
                            input.expected.tokenizer);
    if (unitTestSuccessful) passCount++;
    logger.adorn(testSentLabel + ((unitTestSuccessful) ? "PASSED" : "FAILED"));
    if (utoutput) {
      utjson.id = sentIdx;
      utjson.content = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].content;
      utjson.expected.tokenizer = tokenizer.serializeForUnitTest(tokens);
      fs.appendFileSync(uttokenout, JSON.stringify(utjson) + "\n,");
    }
  }
  console.log(testSectionLabel + ": " + passCount + "/"
              + ut_sentences01.UnitTest01.sections[secIdx].sentences.length + " PASSED");
  totalPassCount += passCount;
  totalCount += ut_sentences01.UnitTest01.sections[secIdx].sentences.length;
}
console.log("Tokenizer01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED");

tokens = null;
totalPassCount = 0;
totalCount = 0;
//logger.diagnosticMode = true;
logger.adorn("*********************************************");
logger.adorn("* S E N T E N C E  P A R S E R **************");
if (utoutput) {
  fs.writeFileSync(utparserout, timestamp+"\n");
}
for (let secIdx = 0; secIdx < ut_sentences01.UnitTest01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_sentences01.UnitTest01.sections[secIdx].id;
  testSectionLabel = "Parser01 SECTION[" + secId + "]";
  logger.adorn("*********************************************");
  logger.adorn(testSectionLabel+": "+ ut_sentences01.UnitTest01.sections[secIdx].name);
//  console.log("UT01:SECTION["+secIdx+"]: "+testSource.UT01.section[secIdx].name);
  for(let sentIdx = 0; sentIdx < ut_sentences01.UnitTest01.sections[secIdx].sentences.length; sentIdx++) {
    sentId = ut_sentences01.UnitTest01.sections[secIdx].sentences.id;
    testSentLabel = testSectionLabel + "[" + sentIdx + "]: ";
    logger.adorn("---------------------------------------------");
//    logger.adorn(testSectionLabel + ": " + ut_sentences01.UnitTest01.section[secIdx].name);
    logger.adorn(testSentLabel + ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].content);
    let input = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx];  // need id and content
    let sentenceNode = new SentenceContent(this);
    sentenceNode.userContext = userRonlyn;
    let actual = sentenceNode.serializeForUnitTest(sentenceNode.parse(input));
    let expected = input.expected.parser;
    unitTestSuccessful = sentenceNode.unitTest(actual, expected);
//    logger.diagnosticMode = true;
//    logger.diagnostic(sentenceNode.serializeAsTable(25,10,10));
//    unitTestSuccessful = sentenceNode.unitTest(actual, input.expected.parser);
    if (unitTestSuccessful) {
      passCount++;
    }
    else {
      logger.diagnosticMode = true;
      logger.diagnostic(sentenceNode.serializeAsTable());
//      logger.diagnostic(sentenceNode.serializeForUnitTest(actual));
      utjson1.id = input.id;
      utjson1.timestamp = new MyDate().yyyymmddhhmmss();
      utjson1.content = input.content;
      utjson1.actual = actual;
      utjson1.expected = expected;
      fs.writeFileSync(utparserout, timestamp+"\n");
      fs.appendFileSync(utparserout, JSON.stringify(utjson1) + ",\n");
      logger.diagnostic("actual:   " + actual);
      logger.diagnostic("expected: " + expected);
      logger.diagnosticMode = false;
    }
    logger.adorn(testSentLabel + ((unitTestSuccessful) ? "PASSED" : "FAILED"));
    if (utoutput) {
      utjson.id = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].id;
      utjson.content = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].content;
      utjson.expected.parser = sentenceNode.serializeForUnitTest();
      fs.appendFileSync(utparserout, JSON.stringify(utjson) + ",\n");
//      utjson.id = sentIdx;
//      utjson.content = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].content;
      utjson.expected.transformer = sentenceNode.transform();
      fs.appendFileSync(uttransformout, JSON.stringify(utjson) + ",\n");

    }
  }
  console.log(testSectionLabel + ": " + passCount +"/"
              + ut_sentences01.UnitTest01.sections[secIdx].sentences.length + " PASSED");
  totalPassCount += passCount;
  totalCount += ut_sentences01.UnitTest01.sections[secIdx].sentences.length;
}
console.log("Parser01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED");

totalPassCount = 0;
totalCount = 0;
logger.adorn("*********************************************");
logger.adorn("* S E N T E N C E   T R A N S F O R M E R ***");
for (let secIdx = 0; secIdx < ut_sentences01.UnitTest01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_sentences01.UnitTest01.sections[secIdx].id;
  testSectionLabel = "Trasformer01 SECTION[" + secId + "]";
  logger.adorn("*********************************************");
  logger.adorn(testSectionLabel+": "+ ut_sentences01.UnitTest01.sections[secIdx].name);
//  console.log("UT01:SECTION["+secIdx+"]: "+testSource.UT01.section[secIdx].name);
  for(let sentIdx = 0; sentIdx < ut_sentences01.UnitTest01.sections[secIdx].sentences.length; sentIdx++) {
    sentId = ut_sentences01.UnitTest01.sections[secIdx].sentences.id;
    testSentLabel = testSectionLabel + "[" + sentIdx + "]: ";
    logger.adorn("---------------------------------------------");
//    logger.adorn(testSectionLabel + ": " + ut_sentences01.UnitTest01.section[secIdx].name);
    logger.adorn(testSentLabel + ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].content);
    let input = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx];
    let sentenceNode = new SentenceContent(this);
    sentenceNode.userContext = userRonlyn;
    sentenceNode.parse(input);
    unitTestSuccessful = sentenceNode.unitTest(sentenceNode.transform(), input.expected.transformer);
//    logger.diagnosticMode = true;
//    logger.diagnostic(sentenceNode.serializeAsTable(25,10,10));

//    unitTestSuccessful = (actual === input.expected.transformer ? true : false);
    if (unitTestSuccessful) {
      passCount++;
    }
    else {
      logger.diagnostic(sentenceNode.serializeAsTable());
/*
      utjson1.id = input.id;
      utjson1.timestamp = new MyDate().yyyymmddhhmmss();
      utjson1.content = input.content;
      utjson1.actual = sentenceNode.transform();
      utjson1.expected = input.expected.transformer;
      fs.writeFileSync(uttransformout, timestamp+"\n");
      fs.appendFileSync(uttransformout, JSON.stringify(utjson1) + ",\n");
//      logger.diagnostic(sentenceNode.serializeForUnitTest(actual));
      logger.diagnostic(input.expected.transformer);
      */
    }
    logger.adorn(testSentLabel + ((unitTestSuccessful) ? "PASSED" : "FAILED"));
    if (utoutput) {
      utjson.id = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].id;
      utjson.content = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].content;
//      utjson.expected.transformer = sentenceNode.serializeForUnitTest();
//      fs.appendFileSync(utparserout, JSON.stringify(utjson) + ",\n");
//      utjson.id = sentIdx;
//      utjson.content = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].content;
      utjson.expected.transformer = sentenceNode.transform();
      fs.appendFileSync(uttransformout, JSON.stringify(utjson) + ",\n");

    }
  }
  console.log(testSectionLabel + ": " + passCount +"/"
              + ut_sentences01.UnitTest01.sections[secIdx].sentences.length + " PASSED");
  totalPassCount += passCount;
  totalCount += ut_sentences01.UnitTest01.sections[secIdx].sentences.length;
}
console.log("Transformer01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED");


logger.adorn("*********************************************");
logger.adorn("* P A R A G R A P H  P A R S E R ************");
let paragraphNode;
let sentIdx;
let htmlstring = "<html>";
if (utoutput) {
//  fs.writeFileSync(uttransformout, timestamp+"\n");
}
for (let secIdx = 0; secIdx < ut_sentences01.UnitTest01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_sentences01.UnitTest01.sections[secIdx].id;
  testSectionLabel = "Parser01 SECTION[" + secId + "]";
  logger.adorn("*********************************************");
  logger.adorn(testSectionLabel+": "+ ut_sentences01.UnitTest01.sections[secIdx].name);
  paragraphNode = new SectionContent(this);
  paragraphNode.userContext = userRonlyn;
  paragraphNode.id = ut_sentences01.UnitTest01.sections[secIdx].id;
  paragraphNode.name = ut_sentences01.UnitTest01.sections[secIdx].name;
  paragraphNode.parse(ut_sentences01.UnitTest01.sections[secIdx].sentences);
  logger.info(paragraphNode.unitTest(ut_sentences01.UnitTest01.sections[secIdx].sentences));
  logger.diagnostic((paragraphNode.serializeAsTable(30, 10, 10)));
  htmlstring = htmlstring + paragraphNode.transform();
  if (htmloutput) fs.writeFileSync(htmloutput, htmlstring);
/*
  if (utoutput) {
    // create transformer file from parser input file
    for (let sentIdx = 0; sentIdx < ut_sentences01.UnitTest01.sections[secIdx].sentences.length; sentIdx++) {
      utjson.id = sentIdx;
      utjson.content = ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].content;
      utjson.expected.transformer = paragraphNode.sentences[sentIdx].transform();
      fs.appendFileSync(uttransformout, JSON.stringify(utjson) + ",\n");
    }
  }
  */
}
logger.adorn("*********************************************");
logger.adorn("* S E C T I O N   T R A N S F O R M E R *****");

for (let secIdx = 0; secIdx < ut_sentences01.UnitTest01.sections.length; secIdx++) {
  passCount = 0;
  testSectionLabel = "Transformer01 SECTION[" + secId + "]";
  logger.adorn("*********************************************");
  paragraphNode = new SectionContent(this);
  paragraphNode.userContext = userRonlyn;
  paragraphNode.id = ut_sentences01.UnitTest01.sections[secIdx].id;
  paragraphNode.name = ut_sentences01.UnitTest01.sections[secIdx].name;
  paragraphNode.parse(ut_sentences01.UnitTest01.sections[secIdx].sentences);
  logger.info(paragraphNode.unitTest(ut_sentences01.UnitTest01.sections[secIdx].sentences));
}

logger.adorn("********************************************");
logger.adorn("* P A G E  P A R S E R *********************");
testSectionLabel = "Parser01 page";
logger.adorn("********************************************");
logger.adorn(testSectionLabel+": "+ ut_sentences01.UnitTest01.name);
pageNode = new PageContent(this);
pageNode.userContext = userRonlyn;
pageNode.parse(ut_sentences01.UnitTest01);
logger.diagnostic((pageNode.serializeAsTable(40, 10, 10)));
let pageFormatter = new TestFormatter(this);
pageFormatter.userContext = userRonlyn;
pageFormatter.content = pageNode;
let htmlString = pageFormatter.transform();
if (htmloutput) fs.writeFileSync(htmloutput, htmlString);
//console.log(htmlString);
/*
listFormatter.input = paragraphNode;
htmlString = listFormatter.html(chapterNode);
htmlString = listFormatter.html(paragraphNode);
htmlString = listFormatter.html(sentenceNode);

htmlstring = chapterNode(listParagraphFormatter);

chapterNode.formatter = listFormatter;
htmlstring = chapterNode.formatter.html(); // uses parent to access content
*/
