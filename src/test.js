var  { Logger, MyDate } = require('../src/utilities.js');
var  { Tokenizer } = require('../src/tokenizer.js');
var  { PageContent, SectionContent, SentenceContent, UserContext } = require('../src/parser.js');
var  { PageFormatter, TestFormatter } = require('../src/parser.js');
const { TokenTypes }  = require('../src/tokentypes.js');

const ut_tokenizer = require('../data/unittest_tokenizer.json');
const ut_parser = require('../data/unittest_parser.json');
const fs = require('fs');
const path = require('path');

var tokenType;
var spanTree;
var outputHTML;
var tokenlist;
const utjson = {
  id: "0",
  content: "",
  expected: ""
};

const basepath = "D:\\users\\wen\\documents\\personal\\ronlyn\\medical\\therapy\\SLP\\reading_app\\";
const htmloutput = basepath+"test2_parser.html";
const uttokenout = basepath+"data\\ut01token.txt";
const utparserout = basepath+"data\\ut01parse.txt";
const utoutput = true; // create expected values for unit test

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
for (let secIdx = 0; secIdx < ut_tokenizer.Tokenizer01.section.length; secIdx++) {
  passCount = 0;
  secId = ut_tokenizer.Tokenizer01.section[secIdx].id;
  testSectionLabel = "Tokenizer01 SECTION[" + secId + "]";
  logger.adorn("*********************************************");
  logger.adorn(testSectionLabel+": "+ ut_tokenizer.Tokenizer01.section[secIdx].name);
  for (let sentIdx = 0; sentIdx < ut_tokenizer.Tokenizer01.section[secIdx].sentences.length; sentIdx++) {
    sentId = ut_tokenizer.Tokenizer01.section[secIdx].sentences.id;
    testSentLabel = testSectionLabel + "[" + sentIdx + "]: ";
    logger.adorn("---------------------------------------------");
    logger.adorn(testSentLabel + ut_tokenizer.Tokenizer01.section[secIdx].name);
    logger.adorn(testSentLabel + ut_tokenizer.Tokenizer01.section[secIdx].sentences[sentIdx].content);
    let input = ut_tokenizer.Tokenizer01.section[secIdx].sentences[sentIdx];
    let tokenizer = new Tokenizer(this);
    let result = tokenizer.insertMarkupTags(input.content);
    logger.adorn(testSentLabel + result + " (Marked up)");
    let tokens = tokenizer.tokenize(result);
    unitTestSuccessful = tokenizer.unitTest(tokens, input.expected);
    if (unitTestSuccessful) passCount++;
    logger.adorn(testSentLabel + ((unitTestSuccessful) ? "PASSED" : "FAILED"));
    if (utoutput) {
      utjson.id = sentIdx;
      utjson.content = ut_tokenizer.Tokenizer01.section[secIdx].sentences[sentIdx].content;
      utjson.expected = tokenizer.serializeForUnitTest(tokens);
      fs.appendFileSync(uttokenout, JSON.stringify(utjson) + "\n,");
    }
  }
  console.log(testSectionLabel + ": " + passCount + "/"
              + ut_tokenizer.Tokenizer01.section[secIdx].sentences.length + " PASSED");
  totalPassCount += passCount;
  totalCount += ut_tokenizer.Tokenizer01.section[secIdx].sentences.length;
}
console.log("Tokenizer01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED");

tokens = null;
totalPassCount = 0;
totalCount = 0;
//logger.diagnosticMode = true;
logger.adorn("*********************************************");
logger.adorn("* S E N T E N C E  P A R S E R **************");
if (utoutput) fs.writeFileSync(utparserout, timestamp+"\n");
for (let secIdx = 0; secIdx < ut_parser.Parser01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_parser.Parser01.sections[secIdx].id;
  testSectionLabel = "Parser01 SECTION[" + secId + "]";
  logger.adorn("*********************************************");
  logger.adorn(testSectionLabel+": "+ ut_parser.Parser01.sections[secIdx].name);
//  console.log("UT01:SECTION["+secIdx+"]: "+testSource.UT01.section[secIdx].name);
  for(let sentIdx = 0; sentIdx < ut_parser.Parser01.sections[secIdx].sentences.length; sentIdx++) {
    sentId = ut_parser.Parser01.sections[secIdx].sentences.id;
    testSentLabel = testSectionLabel + "[" + sentIdx + "]: ";
    logger.adorn("---------------------------------------------");
//    logger.adorn(testSectionLabel + ": " + ut_parser.Parser01.section[secIdx].name);
    logger.adorn(testSentLabel + ut_parser.Parser01.sections[secIdx].sentences[sentIdx].content);
    let input = ut_parser.Parser01.sections[secIdx].sentences[sentIdx];
    let sentenceNode = new SentenceContent(this);
    sentenceNode.userContext = userRonlyn;
    let actual = sentenceNode.parse(input);
//    logger.diagnosticMode = true;
//    logger.diagnostic(sentenceNode.serializeAsTable(25,10,10));
    unitTestSuccessful = sentenceNode.unitTest(actual, input.expected);
    if (unitTestSuccessful) {
      passCount++;
    }
    else {
      logger.diagnostic(sentenceNode.serializeAsTable());
      logger.diagnostic(sentenceNode.serializeForUnitTest(actual));
      logger.diagnostic(input.expected);
    }
    logger.adorn(testSentLabel + ((unitTestSuccessful) ? "PASSED" : "FAILED"));
    if (utoutput) {
      utjson.id = sentIdx;
      utjson.content = ut_parser.Parser01.sections[secIdx].sentences[sentIdx].content;
      utjson.expected = sentenceNode.serializeForUnitTest(sentenceNode);
      fs.appendFileSync(utparserout, JSON.stringify(utjson) + ",\n");
    }
  }
  console.log(testSectionLabel + ": " + passCount +"/"
              + ut_parser.Parser01.sections[secIdx].sentences.length + " PASSED");
  totalPassCount += passCount;
  totalCount += ut_parser.Parser01.sections[secIdx].sentences.length;
}
console.log("Parser01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED");

logger.adorn("*********************************************");
logger.adorn("* P A R A G R A P H  P A R S E R ************");
let paragraphNode;
let htmlstring = "<html>";
for (let secIdx = 0; secIdx < ut_parser.Parser01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_parser.Parser01.sections[secIdx].id;
  testSectionLabel = "Parser01 SECTION[" + secId + "]";
  logger.adorn("*********************************************");
  logger.adorn(testSectionLabel+": "+ ut_parser.Parser01.sections[secIdx].name);
  paragraphNode = new SectionContent(this);
  paragraphNode.userContext = userRonlyn;
  paragraphNode.id = ut_parser.Parser01.sections[secIdx].id;
  paragraphNode.name = ut_parser.Parser01.sections[secIdx].name;
  paragraphNode.parse(ut_parser.Parser01.sections[secIdx].sentences);
  logger.info(paragraphNode.unitTest(ut_parser.Parser01.sections[secIdx].sentences));
  logger.diagnostic((paragraphNode.serializeAsTable(30, 10, 10)));
  htmlstring = htmlstring + paragraphNode.transform();
  if (htmloutput) fs.writeFileSync(htmloutput, htmlstring);
}
logger.adorn("********************************************");
logger.adorn("* P A G E  P A R S E R *********************");
testSectionLabel = "Parser01 page";
logger.adorn("********************************************");
logger.adorn(testSectionLabel+": "+ ut_parser.Parser01.name);
pageNode = new PageContent(this);
pageNode.userContext = userRonlyn;
pageNode.parse(ut_parser.Parser01);
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
