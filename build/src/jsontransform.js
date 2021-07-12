// Copyright (c) 2020
// Transforms cirriculum content found in /curriculum folder into spantree content in span folder
//
'use strict';
//const question = require("../src/nodejsutils.js");
const process = require("process");
const fs = require("fs");
const path = require("path");
const AppInfo = require(path.resolve('./appinfo.json')); // should use  module.paths and find-ne.js
//console.log("appinfo "+AppInfo.suffix);
const { Logger, MyDate, WildcardToRegex } = require(path.resolve(path.join(AppInfo.path.relative.source, "utilities.js")));
const { PageContent, UserContext } = require(path.resolve(path.join(AppInfo.path.relative.source, "parser.js")));
let jsonFilenameRegex;
let jsonFiles;
let transformCount = 0;
let logger = new Logger();
logger.showFunctionName = false;
let filenameInput = process.argv[2];
if (filenameInput === undefined) {
    jsonFilenameRegex = new RegExp(/^([a-zA-Z0-9\s_\\.\-\(\):])+\.(json)/);
}
else {
    jsonFilenameRegex = new RegExp(WildcardToRegex(filenameInput));
}
const curriculumPath = path.resolve(AppInfo.path.relative.curriculum);
const curriculumDistPath = path.join(curriculumPath, AppInfo.path.relative.distribution);
logger.info("Processing files in " + path.resolve(AppInfo.path.relative.curriculum), false, false, false, false);
jsonFiles = fs.readdirSync(curriculumPath).filter(jsonFile => jsonFile.match(jsonFilenameRegex));
for (let jsonFile of jsonFiles) {
    try {
        let targetFilename = jsonFile.replace(/\.[^/.]+$/, "") + AppInfo.suffixes.spantree + ".json";
        logger.info("Transforming " + jsonFile + " into " + targetFilename, false, false, false, false);
        let sourceJson = JSON.parse(fs.readFileSync(path.join(curriculumPath, jsonFile), 'utf-8'));
        let page = new PageContent(this);
        page.userContext = new UserContext("Ronlyn");
        page.parse(sourceJson);
        let secId, sentIdx;
        for (secId = 0; secId < sourceJson.sections.length; secId++) {
            for (sentIdx = 0; sentIdx < sourceJson.sections[secId].sentences.length; sentIdx++) {
                sourceJson.sections[secId].sentences[sentIdx].spantree = page.sections[secId].sentences[sentIdx].transform();
            }
        }
        sourceJson.transformed = new MyDate().yyyymmddhhmmss();
        fs.writeFileSync(path.join(curriculumDistPath, targetFilename), JSON.stringify(sourceJson));
        transformCount++;
    }
    catch (e) {
        logger.error("Unexpected error processing " + jsonFile + ": " + e.message);
    }
}
logger.info("Total files transformed: " + transformCount + " of " + jsonFiles.length, false, false, false, false);
