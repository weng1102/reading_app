"use strict";
var { Logger, MyDate } = require('../src/utilities.js');
const ut_parser = require('../data/unittest_parser.json');
const ut_transformer = require('../data/unittest_transformer.json');
//const ut_sentences01 = require('../data/unittest_sentences01.json');
const fs = require('fs');
const path = require('path');
const basepath = "D:\\users\\wen\\documents\\personal\\ronlyn\\medical\\therapy\\SLP\\reading_app\\";
let jsonString = fs.readFileSync(basepath + 'data\\unittest_sentences01.json');
let ut_sentences01 = JSON.parse(jsonString);
console.log(ut_sentences01);
for (let secIdx = 0; secIdx < ut_sentences01.UnitTest01.sections.length; secIdx++) {
    for (let sentIdx = 0; sentIdx < ut_sentences01.UnitTest01.sections[secIdx].sentences.length; sentIdx++) {
        ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].id = ut_parser.Parser01.sections[secIdx].sentences[sentIdx].id;
        ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].expected.parser = ut_parser.Parser01.sections[secIdx].sentences[sentIdx].expected;
        ut_sentences01.UnitTest01.sections[secIdx].sentences[sentIdx].expected.transformer = ut_transformer.Transformer01.sections[secIdx].sentences[sentIdx].expected;
    }
}
console.log("ut01 content:" + ut_sentences01.UnitTest01.sections[0].sentences[0].content);
console.log("ut01 tokenizer:" + ut_sentences01.UnitTest01.sections[0].sentences[0].expected.tokenizer);
console.log("ut01 parser:" + ut_sentences01.UnitTest01.sections[0].sentences[0].expected.parser);
console.log("ut01 transformer:" + ut_sentences01.UnitTest01.sections[0].sentences[0].expected.transformer);
fs.writeFileSync(basepath + 'data\\unittest_sentences01a.json', JSON.stringify(ut_sentences01));
