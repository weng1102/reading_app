/*******************************************
 * Reading Monitor v2.0
 * (c) 2017, 2018, 2019, 2020 by Wen Eng. All rights reserved.
 ********************************************/
// Regroups, rearranges and applies markup attributes across tokens based
// on markup and compensate for idiosyncracies of the Google Voice API
'use strict';
const { altRecognition } = require('../data/altrecognition.json');
const { ContentNodeType } = require('../src/parsertypes.js');
const { endMarkupTag, TokenType, TokenTag } = require('../src/tokentypes.js');
const { Tokenizer } = require('../src/tokenizer.js');
const { AcronymMap, Logger, MyDate, MonthFromAbbreviationMap, OrdinalNumberMap, RecognitionMap } = require('../src/utilities.js');
const fs = require('fs');
const FileAltRecog = fs.readFileSync("./data/altrecognition.json", "utf-8"); // should be user specific
const FileAltPronun = fs.readFileSync("./data/altpronunciation.json", "utf-8"); // should be user specific
const WordSeqNumPlaceholder = "#TBD#";
const WordSeq = 'wordseq="' + WordSeqNumPlaceholder + '"';
const AltRecognitionAttr = "altrecognition"; // user specific
const RecognitionAttr = "recognition"; // built-in patterns e.g., abbreviated month, ordinal day
const AltPronunciationAttr = "altpronunciation"; // user specific
const PronunciationAttr = "pronunciation"; // TBD
//const ContentNPrefix = "ContentN_";
class BaseClass {
    constructor(parent) {
        this._logger = new Logger(this);
    }
    get logger() {
        return this._logger;
    }
    set logger(obj) {
        this._logger = obj;
    }
}
class UserContext extends BaseClass {
    constructor(name) {
        super();
        //    this._parent = parent;
        let mapEntries;
        this._name = name;
        this._pages = new Array();
        this._altRecognitionMap = new Map();
        mapEntries = JSON.parse(FileAltRecog);
        for (let key of Object.keys(mapEntries)) {
            this._altRecognitionMap.set(key, mapEntries[key]);
        }
        this._altPronunciationMap = new Map();
        mapEntries = JSON.parse(FileAltPronun);
        for (let key of Object.keys(mapEntries)) {
            this._altPronunciationMap.set(key, mapEntries[key]);
        }
        ;
    }
    get altPronunciationMap() {
        return this._altPronunciationMap;
    }
    get altRecognitionMap() {
        return this._altRecognitionMap;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
}
class Formatter extends BaseClass {
    // formatter (sub)classes strictly manage the transformation of Content, NOT the creation or
    // modification of Content.
    constructor(parent) {
        super();
        this._content = null;
        this._parent = parent;
        this._userContext = (typeof parent !== "undefined" && parent !== null && typeof parent.userContext !== "undefined") ? parent.userContext : null;
    }
    get content() {
        return this._content;
    }
    set content(content) {
        this._content = content;
    }
    get userContext() {
        if (this._userContext === null) {
            let e = new Error();
            e.message = "user context is null";
            this.logger.error(e.message);
            throw (e);
        }
        else {
            return this._userContext;
        }
    }
    set userContext(user) {
        this._userContext = user;
    }
    transform() {
        this.logger.warning("abstract method referenced with no implementation");
    }
}
class PageFormatter extends Formatter {
    constructor(parent) {
        super(parent);
    }
    ;
    serializeAsHTML() {
    }
}
class ListFormatter extends Formatter {
    constructor(parent) {
    }
    ;
}
class FillinListFormatter extends ListFormatter {
    // List of items with fillin table at top of section
    constructor(parent) {
    }
    ;
}
class FillinSequenceListFormatter extends FillinListFormatter {
    // List of items with fillin table at top of section
    // e.g. fill in missing words from sentence
    constructor(parent) {
    }
    ;
}
class FillinRandomListFormatter extends FillinListFormatter {
    // List of items with fillin table at top of section
    // e.g. guess from a fill-in list
    constructor(parent) {
    }
    ;
}
class JournalFormatter extends Formatter {
    // Interprets input JSON section as captions for image assicated with each caption
    constructor(parent) {
    }
    ;
}
class JournalEntryFormatter extends Formatter {
    constructor(parent) {
        super(parent);
    }
}
class StoryFormatter extends Formatter {
    // Interprets input JSON section as a paragraph with or without line numbers
    constructor(parent) {
    }
    ;
}
class TestFormatter extends Formatter {
    // Interprets input JSON section as a paragraph with or without line numbers
    constructor(parent) {
        super(parent);
        //    console.log("*************constructor():"+this.constructor.name);
        //    if (typeof this._userContext !== 'undefined') console.log("*************constructor():user.name"+this.constructor.name+this._userContext.name);
    }
    ;
    transform() {
        ///  this.logger.diagnosticMode = true;
        this.logger.diagnostic("transforming page");
        let outputString = "<html>\n"
            + "<head>\n"
            + '<style type="text/css">\n'
            + ".span {\n"
            + " padding: 0px 0px;\n"
            + "}\n"
            + "</style>\n"
            + "</head>\n"
            + "<body>\n"
            + "<div class=page>\n";
        let sectionFormatter = new ListSectionFormatter(this);
        this.content.sections.forEach(section => {
            sectionFormatter.content = section;
            outputString = outputString + sectionFormatter.transform();
        });
        return outputString + "</div>\n<body>\n</html>";
    }
}
class SectionFormatter extends Formatter {
    constructor(parent) {
        super(parent);
        this._sentenceFormatter = new SentenceFormatter(this);
    }
    get sentenceFormatter() {
        return this._sentenceFormatter;
    }
    set sentenceFormatter(sentenceFormatter) {
        this._sentenceFormatter = sentenceFormatter;
    }
    transform() {
        ///    this.logger.diagnosticMode = true;
        this.logger.diagnostic("transforming sections");
        let outputString = "<div sectionid="
            + this.content.id + " class=section><span>"
            + this.content.name + "</span>\n";
        ///    let sentenceFormatter = new SentenceFormatter(this);
        this.content.sentences.forEach(sentence => {
            this.sentenceFormatter.content = sentence;
            outputString = outputString + this.sentenceFormatter.transform();
        });
        return outputString + "</div>\n";
    }
}
class ParagraphFormatter extends SectionFormatter {
    constructor(parent) {
        super(parent);
    }
}
class ListSectionFormatter extends SectionFormatter {
    constructor(parent) {
        super(parent);
        this.sentenceFormatter = new ListItemFormatter(this);
    }
    transform() {
        this.logger.diagnostic("transforming sections into list");
        return "<ul>" + super.transform() + "</ul>";
    }
}
class SentenceFormatter extends Formatter {
    constructor(parent) {
        super(parent);
    }
    transform() {
        return this.content.transform();
        /*
        this.logger.diagnosticMode = true;
        this.logger.diagnostic("transforming sentence ("+this.content.tokens.length+" nodes)");
        let sectionid = this.content.parent.id;
        let outputString = '<span class"=sentence" sectionid="'+ sectionid + '" sentenceid="'
                            + this.content.id + '">';
        let nextWordIdx = 0;
        let span = "";
        this.content.tokens.forEach(token => {
          // handle alternate altRecognition attribute
          if (token.type !== ContentNodeType.WHITESPACE && token.type !== ContentNodeType.PUNCTUATION) {
            span = "<span nextwordidx=TBD";
            if (this.userContext != null) {
              const exclusionList = [ TokenType.MLTAG, TokenType.MLTAG_END ];
              let altRecog = this.userContext.altRecognitionMap.get(token.content(exclusionList));
              if (typeof altRecog !== "undefined" && altRecog !== null) span = span + ' altRecognition="' + altRecog + '"';
            }
            span = span + ">";
          }
          else { // no alternate altRecognition
            span = "<span>";
          }
          outputString = outputString + span + token.transform() + this.spanEndTag);
        });
        //replace all nextwordidx=TBD with the proper id
        //
        return outputString + "\n";
        */
    }
}
class ListItemFormatter extends SentenceFormatter {
    constructor(parent) {
        super(parent);
    }
    transform() {
        this.logger.diagnostic("transforming sentence into list (" + this.content.tokens.length + " nodes)");
        return "<li>" + super.transform() + "</li>\n";
    }
}
class Content extends BaseClass {
    constructor(parent) {
        super(parent);
        this._id = "";
        this._name = "";
        this._parent = parent;
        this._userContext = (typeof parent !== "undefined" && parent !== null && typeof parent.userContext !== "undefined") ? parent.userContext : null;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get parent() {
        return this._parent;
    }
    get userContext() {
        if (this._userContext === null) {
            let e = new Error();
            e.message = "user context is null";
            this.logger.error(e.message);
            throw (e);
        }
        else {
            return this._userContext;
        }
    }
    set userContext(userContext) {
        this._userContext = userContext;
    }
    parse() {
        this.logger.warning("abstract method referenced with no implementation");
    }
    spanElement(content) {
        return this.spanStartTag(content) + content + this.spanEndTag();
    }
    spanStartTag() {
        return "<span>";
    }
    spanEndTag() {
        return "</span>";
    }
}
class PageContent extends Content {
    constructor(parent) {
        super(parent);
        this._sectionNodes = new Array();
    }
    get sections() {
        return this._sectionNodes;
    }
    parse(page) {
        this.id = page.id;
        this.name = page.name;
        page.sections.forEach(section => {
            //        this.logger.diagnosticMode = true;
            let sectionNode = new SectionContent(this);
            sectionNode.id = section.id;
            sectionNode.name = section.name;
            sectionNode.parse(section.sentences);
            this._sectionNodes.push(sectionNode);
        });
    }
    serializeAsTable(col1, col2, col3) {
        let table = "";
        this._sectionNodes.forEach(sectionNode => {
            table = "\nsection[" + sectionNode.id + "]: " + sectionNode.name + "\n" + sectionNode.input + "\n" + sectionNode.serializeAsTable(col1, col2, col3) + "\n";
        });
        return table.slice(0, -1);
    }
    unitTest(page) {
    }
}
class SectionContent extends Content {
    // a section is defined as a group of sentences or group of sections
    // aka (un)ordered list of sentences aka paragraph, aka journal entry (including images)
    // object is responsible for reading a section of a JSON object including the section details
    // and the associated sentences and return a parse tree.
    constructor(parent) {
        super(parent);
        this._sectionNodes = new Array();
        this._sentenceNodes = new Array();
    }
    get sentences() {
        return this._sentenceNodes;
    }
    parse(sentenceRecords) {
        sentenceRecords.forEach(sentenceRecord => {
            //
            // must discern subsection vs. sentence. Sentences are parsed with the current sectionNode
            //then additional subsectiions if any.
            ///this.logger.diagnosticMode = true;
            let sentenceNode = new SentenceContent(this);
            this.logger.diagnostic("sentence=" + sentenceRecord.content);
            sentenceNode.parse(sentenceRecord);
            this._sentenceNodes.push(sentenceNode);
        });
    }
    serializeAsTable(col1, col2, col3) {
        let table = "";
        this._sentenceNodes.forEach(sentenceNode => {
            table = table + "section[" + this.id + "] " + this.name + "\n" + sentenceNode.serializeAsTable(col1, col2, col3) + "\n";
        });
        return table.slice(0, -1);
    }
    transform() {
        //    let  outputString = "<br>"+this.name;
        let outputString = "";
        this.logger.diagnostic("transforming section (" + this.sentences.length + " sentences)");
        this.sentences.forEach(sentence => {
            outputString = outputString + sentence.transform() + "\n";
            //this.logger.info(str);
        });
        return outputString.slice(0, -1);
    }
    unitTest(actual, expected) {
        return actual == expected;
    }
}
class SentenceContent extends Content {
    constructor(parent) {
        super(parent);
        this._input = "";
        this._tokenizer = new Tokenizer(this);
        this._parserNodes = new Array;
        //this._tokens = tokens;
        // Generic token typesidentified by tokenizer
        this._ContentNodeClasses = {
            [TokenType.WORD]: ContentNode_WORD,
            [TokenType.NUMBER]: ContentNode_NUMBER,
            [TokenType.PUNCTUATION]: ContentNode_PUNCTUATION,
            [TokenType.MLTAG]: ContentNode_MLTAG,
            [TokenType.MLTAG_END]: ContentNode_MLTAG_END,
            [TokenType.MLTAG_SELFCLOSING]: ContentNode_MLTAG_SELFCLOSING,
            [TokenType.WHITESPACE]: ContentNode_WHITESPACE
        };
        // Application-specific markup tags and associated parser mode type
        this._ParserMarkupNodeClasses = {
            [TokenTag.EMAILADDRESS]: ContentNode_MLTAG_EMAILADDRESS,
            [TokenTag.PHONENUMBER]: ContentNode_MLTAG_PHONENUMBER,
            [TokenTag.TIME]: ContentNode_MLTAG_TIME,
            [TokenTag.DATE1]: ContentNode_MLTAG_DATE1,
            [TokenTag.DATE2]: ContentNode_MLTAG_DATE2,
            [TokenTag.DATE3]: ContentNode_MLTAG_DATE3,
            [TokenTag.CONTRACTION]: ContentNode_MLTAG_CONTRACTION,
            [TokenTag.NUMBER_WITHCOMMAS]: ContentNode_MLTAG_NUMBER_WITHCOMMAS,
            [TokenTag.TOKEN]: ContentNode_MLTAG_TOKEN,
            [TokenTag.USD]: ContentNode_MLTAG_USD
        };
        this.reset();
        //    this._parserType = 0;  // derived in part from token type but more detailed
        //    this._parserNodes = new Array;
        //    this._tokens = null;
    }
    ;
    get tokens() {
        return this._parserNodes;
    }
    get input() {
        return this._input;
    }
    set input(sentence) {
        this._input = sentence;
    }
    parse(sentenceRecord) {
        this.id = sentenceRecord.id;
        this.input = sentenceRecord.content;
        //    this.id = sentence.id;
        let result = this._tokenizer.insertMarkupTags(sentenceRecord.content);
        let tokens = this._tokenizer.tokenize(result);
        let parserTree = this.parseTokens(tokens);
        return parserTree;
    }
    parseTokens(tokens) {
        ///    this.logger.diagnosticMode = true;
        this._tokens = tokens;
        let tokenIdx = 0;
        while (tokenIdx < tokens.length) {
            let parserNode = null; //declaration
            let token = tokens[tokenIdx];
            this.logger.diagnostic("token.name=" + token.text);
            this.logger.diagnostic("tokenIdx=" + tokenIdx);
            try {
                if ((token.type === TokenType.MLTAG)
                    && (tokens[tokenIdx].text.toLowerCase() in this._ParserMarkupNodeClasses)) {
                    this.logger.diagnostic("Encountered token type=" + token.type + " with markup tag=" + token.text);
                    parserNode = new this._ParserMarkupNodeClasses[token.text.toLowerCase()](this, tokenIdx);
                    parserNode.userContext = this.userContext;
                }
                else if (token.type in this._ContentNodeClasses) {
                    parserNode = new this._ContentNodeClasses[token.type](this, tokenIdx);
                    parserNode.userContext = this.userContext;
                    this.logger.diagnostic("Encountered token type=" + token.type);
                }
                else {
                    this.logger.diagnostic("Encountered unexpected token type=" + token.type);
                }
                if (parserNode !== null) {
                    this.logger.diagnostic("Adding node=" + token.name);
                    tokenIdx = parserNode.parse(tokenIdx);
                    this._parserNodes.push(parserNode);
                    ///console.log(this.constructor.name+".parseTokens():ContentNodeClasses tokenIdx="+tokenIdx);
                }
                else {
                    this.logger.error("Encountered unhandled token type=" + token.type + "for token=" + token.name);
                    ///console.error(this.constructor.name+".parseTokens(): Unexpected token.type="+token.type+" token.tag="+tokens[tokenIdx].text);
                    tokenIdx++;
                }
            }
            catch (e) {
                this.logger.error("Unexpected error: " + e.message);
                console.log(e.stack);
                tokenIdx++;
            }
        }
        return this._parserNodes;
    }
    ;
    reset() {
        this._parserType = 0; // derived in part from token type but more detailed
        this._parserNodes = new Array;
        this._tokens = null;
    }
    serialize() {
    }
    serializeAsTable(col1, col2, col3) {
        let table = "sentence[" + this.id + "]: " + this.input + "\n";
        for (let parserNode of this._parserNodes) {
            table = table + "sentence[" + this.id + "]: " + parserNode.serializeColumnar(col1, col2, col3) + "\n";
        }
        return table.slice(0, -1);
    }
    serializeForUnitTest() {
        let nodeList = "";
        this._parserNodes.forEach(node => {
            nodeList = nodeList + node.serializeForUnitTest();
        });
        return nodeList;
    } //serializeForUnitTest
    spanStartTag(pageId, sectionId, sentenceId) {
        return '<span class="sentence" pageid="' + pageId + '" sectionid="' + sectionId + '" sentenceid="' + sentenceId + '">';
    }
    transform() {
        //  this.logger.diagnosticMode = true;
        //    let pageId;
        this.logger.diagnostic("transforming sentence (" + this._parserNodes.length + " nodes)");
        let sectionid = this.parent.id;
        let pageId = (this.parent.parent === undefined ? undefined : this.parent.parent.id);
        let outputString = this.spanStartTag(pageId, this.parent.id, this.id) + "\n";
        this._parserNodes.forEach(node => {
            outputString = outputString + node.transform();
        });
        outputString = outputString + this.spanEndTag();
        //replace all WordSeq placeholders with the proper idx, which is more complex but more robust
        let nextWordIdx = 0;
        for (let pos = outputString.indexOf(WordSeqNumPlaceholder), nextWordIdx = 0; pos > 0; nextWordIdx++) {
            outputString = outputString.slice(0, pos) + nextWordIdx + outputString.slice(pos + WordSeqNumPlaceholder.length);
            pos = outputString.indexOf(WordSeqNumPlaceholder);
        }
        return outputString + "\n";
    }
    unitTest(actual, expected) {
        //    return this.serializeForUnitTest(actual) === expected;
        return (actual === expected);
    }
}
;
class ContentNode extends Content {
    constructor(parent, tokenIdx) {
        super(parent);
        //    this._tokenList = new Array;  // consider keeping link (by reference) to token list
        this.logger = new Logger(this);
        ///this.logger.diagnosticMode = true;
        this._parentNode = parent;
        //    this._tokens = tokens;
        this._type = ContentNodeType.TBD; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
        this._tokenStartIdx = null;
        this._tokenEndIdx = null;
    }
    get parent() {
        return this._parent;
    }
    get type() {
        return this._type;
    }
    get tokens() {
        return this._parentNode._tokens;
    }
    content(typeExclusionList) {
        if (typeof typeExclusionList === "undefined")
            typeExclusionList = [];
        let outputString = "";
        for (let idx = this._tokenStartIdx; idx <= this._tokenEndIdx; idx++) {
            if (!typeExclusionList.includes(this.tokens[idx].type)) {
                outputString = outputString + this.tokens[idx].text;
            }
        }
        return outputString;
    }
    parse(tokenIdx) {
        // single token with no markup tags
        this.logger.diagnostic("Parsing node =" + this.tokens[tokenIdx].text);
        this._tokenStartIdx = tokenIdx;
        this._tokenEndIdx = tokenIdx;
        return tokenIdx + 1;
    }
    serialize() {
        //each node produces its own output
    }
    serializeColumnar(colWidth1, colWidth2) {
        let tokenList = "";
        for (let idx = this._tokenStartIdx; idx <= this._tokenEndIdx; idx++) {
            tokenList = tokenList + this.tokens[idx].text;
        }
        if (arguments.length < 1)
            colWidth1 = 25;
        if (arguments.length < 2)
            colWidth2 = 10;
        return ("{" + tokenList + "}").padEnd(colWidth1)
            + ("(" + this._tokenStartIdx + ".." + this._tokenEndIdx + ") ").padEnd(colWidth2)
            + "(" + this.constructor.name + ")";
    }
    serializeForUnitTest() {
        let nodeJson = { TYP: "", START: 0, END: 0 };
        nodeJson.TYP = this._type;
        nodeJson.START = this._tokenStartIdx;
        nodeJson.END = this._tokenEndIdx;
        return JSON.stringify(nodeJson);
    }
    transform() {
        this.logger.diagnostic("transforming content node (" + this._type + ")");
        //    let content = this.content();
        return this.spanElement(this.content());
    }
}
class ContentNode_AUDIBLE extends ContentNode {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
    }
    spanStartTag(content, recogPatternArg) {
        let outputString;
        let recogPattern;
        if (content === undefined) {
            outputString = super.spanStartTag();
        }
        else {
            outputString = super.spanStartTag().slice(0, -1) + " " + WordSeq;
            if (recogPatternArg !== undefined && content.toLowerCase() !== recogPatternArg) {
                recogPattern = recogPatternArg; // argument overrides default map value
            }
            else {
                let recogPattern = RecognitionMap.get(content);
            }
            if (recogPattern !== undefined) {
                outputString = outputString + ' ' + RecognitionAttr + '="' + recogPattern + '"';
            }
            if (this.userContext != null) {
                let altRecogPattern = this.userContext.altRecognitionMap.get(content);
                if (altRecogPattern !== undefined) {
                    outputString = outputString + ' ' + AltRecognitionAttr + '="' + altRecogPattern + '"';
                }
                let pronunciation = this.userContext.altPronunciationMap.get(content);
                if (pronunciation !== undefined) {
                    outputString = outputString + ' ' + AltPronunciationAttr + '="' + pronunciation + '"';
                }
            }
            else {
                this.logger.warning("user context not available");
            }
            outputString = outputString + super.spanStartTag().slice(-1);
        }
        return outputString;
    }
}
class ContentNode_NONAUDIBLE extends ContentNode {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
    }
}
class ContentNode_WORD extends ContentNode_AUDIBLE {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._type = ContentNodeType.WORD; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
    }
    parse(tokenIdx) {
        return super.parse(tokenIdx);
    }
    transform() {
        const exclusionList = [TokenType.MLTAG, TokenType.MLTAG_END];
        let outputString = "";
        let content = this.content(exclusionList);
        // acronym word
        if (!(/^[A-Z]{3,}$/.test(content) && AcronymMap.has(content))) {
            outputString = this.spanElement(content);
        }
        else {
            let acronym = AcronymMap.get(content);
            if (acronym !== undefined) {
                let acronymList = acronym.split(',');
                if (acronymList.length != content.length)
                    this.logger.error('acronym translation for "' + content + '" is inconsistent');
                for (let idx = 0; idx < content.length; idx++) {
                    let letter = content.slice(idx, idx + 1);
                    outputString = outputString
                        + this.spanStartTag(letter, acronymList[idx])
                        + letter + this.spanEndTag();
                }
            }
            else {
                this.logger.error('acronym map has() "' + content + '" but could not get() it');
            }
        }
        return outputString;
    }
}
class ContentNode_NUMBER extends ContentNode_WORD {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._type = ContentNodeType.NUMBER; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
    }
}
class ContentNode_WHITESPACE extends ContentNode_NONAUDIBLE {
    // not much to do here but is placeholder for any processing beyond them
    // base class
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._type = ContentNodeType.WHITESPACE; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
    }
}
class ContentNode_PUNCTUATION extends ContentNode_NONAUDIBLE {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._type = ContentNodeType.PUNCTUATION; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
    }
}
class ContentNode_MLTAG extends ContentNode_NONAUDIBLE {
    // 1) manages the stack of markup
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.MLTAG; // used by subclasses
        this._type = ContentNodeType.MLTAG; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
        //console.log("inside " + this.constructor.name);
    }
    transform() {
        this.logger.diagnostic("transforming content node (" + this._type + ")");
        return this.content(); // passthru
    }
}
class ContentNode_MLTAG_ extends ContentNode_AUDIBLE {
    // 1) manages the stack of markup
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._type = ContentNodeType.MLTAG; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
        this._markupTag = TokenTag.MLTAG; // used by subclasses
        //    this._type = TokenType.UNHANDLED; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
    }
    ;
    parse(tokenIdx) {
        this._tokenStartIdx = tokenIdx;
        let endTagIdx = this.tokens.map(token => token.text).indexOf(endMarkupTag(this._markupTag), this._tokenStartIdx + 1);
        if (endTagIdx < 0) { // end tag not found
            this.logger.warning("No matching end tag found for " + this._markupTag);
            this._tokenEndIdx = this._tokenStartIdx; // If endTag is not found, then tag is standalone
        }
        else {
            this._tokenEndIdx = endTagIdx; // include closing tag iff found
        }
        return this._tokenEndIdx + 1;
    }
    transform() {
        const exclusionList = [TokenType.MLTAG, TokenType.MLTAG_END];
        let content = this.content(exclusionList);
        let outputString = this.spanStartTag(content) + content + this.spanEndTag();
        return outputString;
    }
}
class ContentNode_MLTAG_END extends ContentNode_NONAUDIBLE {
    // 1) manages the stack of markup
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._type = ContentNodeType.MLTAG;
        this._markupTag = TokenTag.MLTAG_END; // used by subclasses
    }
    ;
}
class ContentNode_MLTAG_SELFCLOSING extends ContentNode_NONAUDIBLE {
    // 1) manages the stack of markup
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._type = ContentNodeType.MLTAG;
        this._markupTag = TokenTag.MLTAG_SELFCLOSING; // used by subclasses
    }
    ;
    transform() {
        this.logger.diagnostic("transforming content node (" + this._type + ")");
        return this.content();
    }
}
class ContentNode_MLTAG_EMAILADDRESS extends ContentNode_MLTAG_ {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.EMAILADDRESS; // used by subclasses
    }
    transform() {
        // remove ml tag
        // Consolidate local part everything to @; additional segmentation fox123 to
        // "fox "123" shall be handled by further tokenizing
        // <token>fox</token><token>123</token> in source. Still needs to be implemented below.
        // OR tokenize baed on valid separators (underscores, dot(s), $, dash
        // @ w/ altRecognition="at"
        // Consolidate everything right of @ into domain name; additional segmentation
        // e.g. stanford.edu into <token>stanford.</token><token>edu</token> w/ altRecognition
        // for EDU in source and "." w/ altRecognition="dot" or dot-com
        let atsignIdx = null;
        let domainPart = "";
        let localPart = "";
        let outputString;
        // ugh. linear search! Fortunately typically only length<10
        for (let idx = this._tokenStartIdx + 1; idx < this._tokenEndIdx && atsignIdx === null; idx++) {
            if (this.tokens[idx].text === "@")
                atsignIdx = idx;
        }
        if (atsignIdx !== null) {
            // skip first and last elements of ml tag
            for (let idx = this._tokenStartIdx + 1; idx < atsignIdx; idx++) {
                localPart = localPart + this.tokens[idx].text;
            }
            for (let idx = atsignIdx + 1; idx < this._tokenEndIdx; idx++) {
                domainPart = domainPart + this.tokens[idx].text;
            }
            outputString = this.spanStartTag(localPart) + localPart + this.spanEndTag()
                + this.spanStartTag(this.tokens[atsignIdx].text, "at")
                + this.tokens[atsignIdx].text + this.spanEndTag() //atsign
                + this.spanStartTag(domainPart) + domainPart + this.spanEndTag();
        }
        else {
            this.logger.warning('email token missing "@" in token from sectionId=' + this.parent.parent.id + " sendtenceId=" + this.parent.id);
            outputString = super.content();
        }
        return outputString;
    }
}
class ContentNode_MLTAG_PHONENUMBER extends ContentNode_MLTAG_ {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.PHONENUMBER; // used by subclasses
    }
    transform() {
        this.logger.diagnostic("transforming content node (" + this._type + ")");
        let outputString = "";
        let idx = this._tokenStartIdx;
        //assert
        if (this._tokenEndIdx - this._tokenStartIdx !== 8
            || this.tokens[this._tokenStartIdx].text !== TokenTag.PHONENUMBER
            || this.tokens[this._tokenEndIdx].text !== endMarkupTag(TokenTag.PHONENUMBER)) {
            this.logger.error("phone number is improperly formatted and transformed as standard content");
            outputString = super.content(); // just default formatting
        }
        else {
            let areaCodeIdx = idx + 2;
            outputString = super.spanStartTag() + this.tokens[idx + 1].text + this.spanEndTag(); // (
            for (let areaCodedigitPos = 0; areaCodedigitPos < 3; areaCodedigitPos++) {
                let areaCodedigit = this.tokens[areaCodeIdx].text.slice(areaCodedigitPos, areaCodedigitPos + 1);
                outputString = outputString + this.spanStartTag(areaCodedigit) + areaCodedigit + this.spanEndTag();
            }
            outputString = outputString + super.spanStartTag() + this.tokens[idx + 3].text + this.spanEndTag(); // )
            outputString = outputString + super.spanStartTag() + this.tokens[idx + 4].text + this.spanEndTag(); // space
            let exchangeIdx = idx + 5;
            for (let exchangeDigitPos = 0; exchangeDigitPos < 3; exchangeDigitPos++) {
                let exchangeDigit = this.tokens[exchangeIdx].text.slice(exchangeDigitPos, exchangeDigitPos + 1);
                outputString = outputString + this.spanStartTag(exchangeDigit) + exchangeDigit + this.spanEndTag();
            }
            outputString = outputString + super.spanStartTag() + this.tokens[idx + 6].text + this.spanEndTag(); // -
            let subscriberIdx = idx + 7;
            for (let subscriberDigitPos = 0; subscriberDigitPos < 4; subscriberDigitPos++) {
                let subscriberDigit = this.tokens[subscriberIdx].text.slice(subscriberDigitPos, subscriberDigitPos + 1);
                outputString = outputString + this.spanStartTag(subscriberDigit) + subscriberDigit + this.spanEndTag();
            }
        }
        return outputString;
    }
}
class ContentNode_MLTAG_TIME extends ContentNode_MLTAG_ {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.TIME; // used by subclasses
    }
}
class ContentNode_MLTAG_DATE1 extends ContentNode_MLTAG_ {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.DATE1; // used by subclasses
    }
    transform() {
        // e.g.,<date1>3 Jan(uary) 2020</date1> => 3rd of January 2020
        // token[0] = <date1>
        // token[1] = day
        // token[2] = \s
        // token[3] = mon(th)
        // token[4] = \s
        // token[5] = year
        // token[6] = </date1>
        let outputString;
        let currentIdx = this._tokenStartIdx + 1; // offset skips mltag
        let day = this.tokens[currentIdx++].text;
        let whitespace1 = this.tokens[currentIdx++].text;
        let month = this.tokens[currentIdx++].text;
        let monthName = MonthFromAbbreviationMap.get(month.slice(0, 3).toLowerCase());
        let whitespace2 = this.tokens[currentIdx++].text;
        let year = this.tokens[currentIdx++].text;
        outputString = this.spanStartTag(day, OrdinalNumberMap.get(day))
            + day + this.spanEndTag()
            + this.spanStartTag() + whitespace1 + this.spanEndTag()
            + this.spanStartTag(month, monthName) + month
            + this.spanEndTag()
            + this.spanStartTag() + whitespace2 + this.spanEndTag()
            + this.spanStartTag() + year + this.spanEndTag();
        return outputString;
    }
}
class ContentNode_MLTAG_DATE3 extends ContentNode_MLTAG_ {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.DATE3;
    }
    transform() {
        // Jan(uary) DDth with no succeeding comma or year. less restrictive than Date2
        // e.g., Jan(uary) 3, 2020
        // token[idx] = <date3>
        // token[idx++] = mon(th)
        // token[idx++] = '.' //optional
        // token[idx++] = \s
        // token[idx++] = day
        // since this object transforms part of <Date2> the endTokenIdx is not necessarily valid
        let outputString;
        let currentIdx = this._tokenStartIdx + 1; // offset skips mltag
        let month = this.tokens[currentIdx++].text;
        let monthName = MonthFromAbbreviationMap.get(month.slice(0, 3).toLowerCase());
        let dot = (this.tokens[currentIdx].text == TokenTag.DOT ? this.tokens[currentIdx++].text : "");
        let whitespace = this.tokens[currentIdx++].text;
        let day = this.tokens[currentIdx++].text;
        let whatever = this.tokens[currentIdx++].text;
        outputString = this.spanStartTag(month, monthName) + month + this.spanEndTag()
            + this.spanStartTag() + dot + this.spanEndTag()
            + this.spanStartTag() + whitespace + this.spanEndTag()
            + this.spanStartTag(day, OrdinalNumberMap.get(day)) + day + this.spanEndTag();
        return outputString;
    }
}
class ContentNode_MLTAG_DATE2 extends ContentNode_MLTAG_DATE3 {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.DATE2; // used by subclasses
    }
    transform() {
        let comma;
        let whitespace = "";
        let year;
        let outputString = super.transform();
        if ((/\s+/).test(this.tokens[this._tokenEndIdx - 2].text)) {
            whitespace = this.tokens[this._tokenEndIdx - 2].text;
            comma = this.tokens[this._tokenEndIdx - 3].text;
        }
        else {
            comma = this.tokens[this._tokenEndIdx - 2].text;
        }
        year = this.tokens[this._tokenEndIdx - 1].text;
        outputString = outputString + this.spanStartTag() + comma + this.spanEndTag()
            + this.spanStartTag() + whitespace + this.spanEndTag()
            + this.spanStartTag(year) + year + this.spanEndTag();
        return outputString;
    }
}
class ContentNode_MLTAG_CONTRACTION extends ContentNode_MLTAG_ {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.CONTRACTION;
    }
}
class ContentNode_MLTAG_NUMBER_WITHCOMMAS extends ContentNode_MLTAG_ {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.NUMBER_WITHCOMMAS;
    }
    transform() {
        // remove commas for the altRecognition. Should check for altRecognition too!
        let outputString;
        let recog;
        let token;
        const exclusionList = [TokenType.MLTAG, TokenType.MLTAG_END];
        token = super.content(exclusionList);
        recog = token.replace(/,/g, '');
        outputString = this.spanStartTag(token, recog) + token + this.spanEndTag();
        return outputString;
    }
}
class ContentNode_MLTAG_TOKEN extends ContentNode_MLTAG_ {
    // should be processed first because this is intended to escape tokenizing NOT parsing
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.TOKEN;
    }
}
class ContentNode_MLTAG_USD extends ContentNode_MLTAG_ {
    constructor(parent, tokenIdx) {
        super(parent, tokenIdx);
        this._markupTag = TokenTag.USD;
    }
    transform() {
        this.logger.diagnostic("transforming content node (" + this._type + ")");
        let outputString;
        const exclusionList = [TokenType.MLTAG, TokenType.MLTAG_END];
        if (this.tokens[this._tokenStartIdx].text !== TokenTag.USD
            || this.tokens[this._tokenEndIdx].text !== endMarkupTag(TokenTag.USD)) {
            this.logger.error("US currency is improperly formatted and transformed as standard content");
            outputString = super.content(exckusionList); // just default formatting
        }
        else { // at present, this is the same as the default behavior
            let token = super.content(exclusionList);
            outputString = this.spanStartTag(token) + token + this.spanEndTag(); // just default formatting
        }
        return outputString;
    }
}
module.exports = { PageContent, PageFormatter, SectionContent, SentenceContent, TestFormatter, UserContext };
