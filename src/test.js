var  { Logger, MyDate } = require('../src/utilities.js');
var  { Tokenizer } = require('../src/tokenizer.js');
var  { PageContent, SectionContent, SentenceContent, UserContext } = require('../src/parser.js');
var  { PageFormatter, TestFormatter } = require('../src/parser.js');
const { TokenTypes }  = require('../src/tokentypes.js');

const ut_tokenizer = require('../data/unittest_tokenizer.json');
const ut_parser = require('../data/unittest_parser.json');
const ut_transformer = require('../data/unittest_transformer.json');
var  ut_sentences01 = require('../data/unittest_sentences01.json');
const fs = require('fs');
const path = require('path');
var tokenType;
var spanTree;
var outputHTML;
var tokenlist;
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
const utSentenceResults = {
  timestamp:"",
  sections: [ {
    id: "",
    sentences: [ { actual:"", tokenizer: "", parser: "", transformer:"" }]
  }]
};
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
const utjson = {
  id: "0",
  name: "",
  content: "",
  actual: "",
  expected: { "tokenizer":"", "parser":"", "transformer":"" }
};
const utjson2 = {
  id: "0",
  name: "",
  actual: "",
  expected: ""
};

const basepath = "D:\\users\\wen\\documents\\personal\\ronlyn\\medical\\therapy\\SLP\\reading_app\\";
const htmloutput = basepath+"unittest01.html";
//const utcombinedout = basepath+"data\\ut01combined.txt";
const uttokenout = basepath+"data\\ut01token_sentences.json";
const utparseout = basepath+"data\\ut01parse_sentences.json";
const uttransformout = basepath+"data\\ut01transform_sentences.json";
//const uttransformsentout = basepath+"data\\ut01transform_sent.txt";
const uttransformsectionout = basepath+"data\\ut01transform_sections.json";
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

logger.info(path.basename(__filename) + " started at " + timestamp, false, false, false, false);
logger.info("verbose mode: "+(logger.verboseMode ? "ON" : "OFF"), false, false, false, false);
logger.info("adorn mode: "+(logger.adornMode ? "ON" : "OFF"), false, false, false, false);
logger.info("unit test output mode: " + (utoutput ? "ON" : "OFF"), false, false, false, false);

//let results = new utSentenceResults;
//let results = new Object(utSentenceResults);
let resultsSecIdx;
totalPassCount = 0;
totalCount = 0;
logger.adorn("*********************************************");
logger.adorn("* S E N T E N C E  T O K E N I Z E R ********");
let results = new Object();
results.timestamp = timestamp;
results.sections = [];
for (let secIdx = 0; secIdx < ut_sentences01.UnitTest01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_sentences01.UnitTest01.sections[secIdx].id;
  //utoutput
  resultsSecIdx = results.sections.push({id: secId,
      name: ut_sentences01.UnitTest01.sections[secIdx].name, sentences:[] }) - 1;
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
    logger.adorn(testSentLabel + ((unitTestSuccessful) ? "PASSED" : "FAILED"));
    if (unitTestSuccessful) {
      passCount++;
    }
    else {
      // dump
      logger.diagnosticMode = true;
      logger.diagnostic(tokenizer.serializeAsTable());
    }
    //utoutput
  results.sections[resultsSecIdx].sentences.push( { id: sentId, content: input.content,
                                  tokenizer: tokenizer.serializeForUnitTest(tokens)});
  }
  logger.info(testSectionLabel + ": " + passCount + "/"
              + ut_sentences01.UnitTest01.sections[secIdx].sentences.length + " PASSED",
              false, false, false, false);
  totalPassCount += passCount;
  totalCount += ut_sentences01.UnitTest01.sections[secIdx].sentences.length;
}
if (utoutput) fs.writeFileSync(uttokenout, JSON.stringify(results));
logger.info("Tokenizer01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED",
            false, false, false, false);

tokens = null;
totalPassCount = 0;
totalCount = 0;
//logger.diagnosticMode = true;
logger.adorn("*********************************************");
logger.adorn("* S E N T E N C E  P A R S E R **************");
results = new Object();
results.timestamp = timestamp;
results.sections = [];
for (let secIdx = 0; secIdx < ut_sentences01.UnitTest01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_sentences01.UnitTest01.sections[secIdx].id;
  //utoutput
  resultsSecIdx = results.sections.push({id: secId,
      name: ut_sentences01.UnitTest01.sections[secIdx].name, sentences:[] }) - 1;
  testSectionLabel = "Parser01 SECTION[" + secId + "]";
  logger.adorn("*********************************************");
  logger.adorn(testSectionLabel+": "+ ut_sentences01.UnitTest01.sections[secIdx].name);
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
    logger.adorn(testSentLabel + ((unitTestSuccessful) ? "PASSED" : "FAILED"));
    if (unitTestSuccessful) {
      passCount++;
    }
    else {
      logger.diagnosticMode = true;
      logger.diagnostic("actual:   " + actual);
      logger.diagnostic("expected: " + expected);
      logger.diagnostic(sentenceNode.serializeAsTable());
      logger.diagnosticMode = false;
    }
    //utoutput
    results.sections[resultsSecIdx].sentences.push({ id: sentId, content: input.content,
                                    parser: JSON.stringify(actual) });
  }
  logger.info(testSectionLabel + ": " + passCount +"/"
              + ut_sentences01.UnitTest01.sections[secIdx].sentences.length + " PASSED",
              false, false, false, false);
  totalPassCount += passCount;
  totalCount += ut_sentences01.UnitTest01.sections[secIdx].sentences.length;
}
if (utoutput) fs.writeFileSync(utparseout, JSON.stringify(results));
logger.info("Parser01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED",
            false, false, false, false);

totalPassCount = 0;
totalCount = 0;
logger.adorn("*********************************************");
logger.adorn("* S E N T E N C E   T R A N S F O R M E R ***");
results = new Object();
results.timestamp = timestamp;
results.sections = [];
for (let secIdx = 0; secIdx < ut_sentences01.UnitTest01.sections.length; secIdx++) {
  passCount = 0;
  secId = ut_sentences01.UnitTest01.sections[secIdx].id;
  //utoutput
  resultsSecIdx = results.sections.push({id: secId,
      name: ut_sentences01.UnitTest01.sections[secIdx].name, sentences:[] }) - 1;
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
    actual = sentenceNode.transform();
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
    results.sections[resultsSecIdx].sentences.push({ id: sentId, content: input.content,
                                                    transformer: actual });
  }
  logger.info(testSectionLabel + ": " + passCount +"/"
              + ut_sentences01.UnitTest01.sections[secIdx].sentences.length + " PASSED",
              false, false, false, false);
  totalPassCount += passCount;
  totalCount += ut_sentences01.UnitTest01.sections[secIdx].sentences.length;
}
if (utoutput) fs.writeFileSync(uttransformout, JSON.stringify(results));
logger.info("Transformer01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED",
            false, false, false, false);

passCount = 0;
totalCount = 0;
logger.adorn("*********************************************");
logger.adorn("* S E C T I O N  T R A N S F O R M E R ******");
results = new Object();
results.timestamp = timestamp;
results.sections = [];
let sectionNode;
let htmlstring = "<html>";
for (let secIdx = 0; secIdx < ut_sentences01.UnitTest01.sections.length; secIdx++) {
  totalCount++;
  secId = ut_sentences01.UnitTest01.sections[secIdx].id;
  testSectionLabel = "Transformer01 SECTION[" + secId + "]: ";
  logger.adorn("*********************************************");
  logger.adorn(testSectionLabel + ut_sentences01.UnitTest01.sections[secIdx].name);
  sectionNode = new SectionContent(this);
  sectionNode.userContext = userRonlyn;
  sectionNode.id = ut_sentences01.UnitTest01.sections[secIdx].id;
  sectionNode.name = ut_sentences01.UnitTest01.sections[secIdx].name;
  sectionNode.parse(ut_sentences01.UnitTest01.sections[secIdx].sentences);
  let actual = sectionNode.transform();
  let expected = ut_sentences01.UnitTest01.sections[secIdx].expected;
  //utoutput
  results.sections.push({id: secId, name: ut_sentences01.UnitTest01.sections[secIdx].name,
                        actual: actual, expected: expected });
//  logger.info(sectionNode.unitTest(ut_sentences01.UnitTest01.sections[secIdx].sentences));
  let unitTestSuccessful = sectionNode.unitTest(actual, expected);
  if (unitTestSuccessful) {
    passCount++;
  }
  else {
    logger.diagnostic((sectionNode.serializeAsTable(30, 10, 10)));
    logger.diagnostic("actual:   " + sectionNode.transform());
    logger.diagnostic("expected: " + input.expected.transformer);
  }
  logger.adorn(testSectionLabel + ((unitTestSuccessful) ? "PASSED" : "FAILED"));
}
if (utoutput) fs.writeFileSync(uttransformsectionout, JSON.stringify(results));
logger.info("Transformer01 SECTION Overall total: " + passCount + "/" + totalCount + " PASSED",
            false, false, false, false);

logger.adorn("********************************************");
logger.adorn("* P A G E  P A R S E R *********************");
testSectionLabel = "Parser01 page";
logger.adorn("********************************************");
pageNode = new PageContent(this);
pageNode.userContext = userRonlyn;
pageNode.parse(ut_sentences01.UnitTest01);
logger.diagnostic((pageNode.serializeAsTable(40, 10, 10)));
let pageFormatter = new TestFormatter(this);
pageFormatter.userContext = userRonlyn;
pageFormatter.content = pageNode;
let htmlString = pageFormatter.transform();
if (htmloutput) fs.writeFileSync(htmloutput, htmlString);
