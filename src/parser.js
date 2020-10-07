/*******************************************
 * Reading Monitor v2.0
 * (c) 2017, 2018, 2019, 2020 by Wen Eng. All rights reserved.
 ********************************************/
 // Regroups, rearranges and applies markup attributes across tokens based
 // on markup and compensate for idiosyncracies of the Google Voice API

'use strict';
const  { altRecognition } = require('../data/altrecognition.json');
const  { ContentNodeType } = require('../src/parsertypes.js');
const  { endMarkupTag, TokenType, TokenTag } = require('../src/tokentypes.js');
const  { Tokenizer } = require('../src/tokenizer.js');
const  { Logger, AbbreviatedMonthMap, OrdinalNumberMap } = require('../src/utilities.js');
const fs = require('fs');

const WordSeqNumPlaceholder = "#TBD#";
const WordSeq = 'wordseq="' + WordSeqNumPlaceholder + '"';

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
    this._name = name;
    this._pages = new Array();
    this._altRecognitionMap = new Map();
    let altRecog = fs.readFileSync("./data/altrecognition.json", "utf-8");
    let mapEntries = JSON.parse(altRecog);
    for (let key of Object.keys(mapEntries)) {
      this._altRecognitionMap.set(key, mapEntries[key]);
    };
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
    get userContext() {   // should be refactored into a parent class below BaseClass: BaseClassWithUserContext
      if (this._userContext === null) {
        let e = new Error();
        e.message = "user context is null";
        this.logger.error(e.message);
        throw(e);
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
  };
  serializeAsHTML() {

  }
}
class ListFormatter extends Formatter {
  constructor(parent) {

  };
}
class FillinListFormatter extends ListFormatter {
  // List of items with fillin table at top of section
  constructor(parent) {

  };
}
class FillinSequenceListFormatter extends FillinListFormatter {
  // List of items with fillin table at top of section
  // e.g. fill in missing words from sentence
  constructor(parent) {

  };
}
class FillinRandomListFormatter extends FillinListFormatter {
  // List of items with fillin table at top of section
  // e.g. guess from a fill-in list
  constructor(parent) {

  };
}
class JournalFormatter extends Formatter {
  // Interprets input JSON section as captions for image assicated with each caption
  constructor(parent) {

  };
}
class JournalEntryFormatter extends Formatter {
    constructor(parent) {
      super(parent);
    }
  }
class StoryFormatter extends Formatter {
  // Interprets input JSON section as a paragraph with or without line numbers
  constructor(parent) {

  };
}
class TestFormatter extends Formatter {
  // Interprets input JSON section as a paragraph with or without line numbers
  constructor(parent) {
    super(parent);
//    console.log("*************constructor():"+this.constructor.name);
//    if (typeof this._userContext !== 'undefined') console.log("*************constructor():user.name"+this.constructor.name+this._userContext.name);
  };
  transform() {
    this.logger.diagnosticMode = true;
    this.logger.diagnostic("transforming page");
    let outputString =  "<html>\n"
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
    this.logger.diagnosticMode = true;
    this.logger.diagnostic("transforming sections");
    let outputString = "<div sectionid="+this.content.id+" class=section><span>"+this.content.name + "</span>\n";
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
      // handle alternate pronunciation attribute
      if (token.type !== ContentNodeType.WHITESPACE && token.type !== ContentNodeType.PUNCTUATION) {
        span = "<span nextwordidx=TBD";
        if (this.userContext != null) {
          const exclusionList = [ TokenType.MLTAG, TokenType.MLTAG_END ];
          let altRecog = this.userContext.altRecognitionMap.get(token.content(exclusionList));
          if (typeof altRecog !== "undefined" && altRecog !== null) span = span + ' altRecognition="' + altRecog + '"';
        }
        span = span + ">";
      }
      else { // no alternate pronunciation
        span = "<span>";
      }
      outputString = outputString + span + token.transform() + "</span>";
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
    this.logger.diagnostic("transforming sentence into list ("+this.content.tokens.length+" nodes)");
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
      throw(e);
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
    this.name = page.id;
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
      table =  "\nsection["+sectionNode.id+"]: "+sectionNode.name+"\n"+sectionNode.input + "\n" + sectionNode.serializeAsTable(col1, col2, col3)+"\n";
    });
    return table.slice(0,-1);
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
        this.logger.diagnosticMode = true;
        let sentenceNode = new SentenceContent(this);
        this.logger.diagnostic(sentenceRecord.content);
        sentenceNode.parse(sentenceRecord);
        this._sentenceNodes.push(sentenceNode);
      });
  }
  serializeAsTable(col1, col2, col3) {
    let table = "";
    this._sentenceNodes.forEach(sentenceNode => {
      table = table + "section["+this.id+"] "+this.name+"\n" + sentenceNode.serializeAsTable(col1, col2, col3)+"\n";
    });
    return table.slice(0,-1);
  }
  transform() {
    let  outputString = "<br>"+this.name;
    this.logger.diagnostic("transforming section ("+this._sentenceNodes.length+" sentences)");
    this._sentenceNodes.forEach(sentence => {
      outputString = outputString + sentence.transform()+"\n";
      //this.logger.info(str);
    });
    return outputString.slice(0,-1);
  }
  unitTest(expectedValues) {
    let passCount = 0;
    let totalCount = this._sentenceNodes.length;
    for (let sentIdx = 0; sentIdx < totalCount; sentIdx++) {
      let actual = this._sentenceNodes[sentIdx].serializeForUnitTest();
      let expected = expectedValues[sentIdx].expected;
      if (this._sentenceNodes[sentIdx].unitTest(actual, expected)) passCount++;
    }
    return "section["+this.id+"]:" + this.name+": "+passCount +"/" + totalCount  + " PASSED";
  }
}
class SentenceContent extends Content {
  constructor(parent) {
    super(parent);
    this._input = "";
    this._tokenizer = new Tokenizer(this);
    this._parserNodes = new Array;
    this._tokens = tokens;
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
  };
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
      let parserNode = null;  //declaration
      let token = tokens[tokenIdx];
      this.logger.diagnostic("token.name=" + token.text);
      this.logger.diagnostic("tokenIdx=" + tokenIdx);
      try {
        if ((token.type === TokenType.MLTAG)
            && (tokens[tokenIdx].text.toLowerCase() in this._ParserMarkupNodeClasses)) {
            this.logger.diagnostic("Encountered token type="+ token.type + " with markup tag=" + token.text);
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
          this.logger.error("Encountered unhandled token type=" + token.type + "for token="+token.name);
          ///console.error(this.constructor.name+".parseTokens(): Unexpected token.type="+token.type+" token.tag="+tokens[tokenIdx].text);
          tokenIdx++;
        }
      }
      catch(e) {
        this.logger.error("Unexpected error: "+e.message);
        console.log(e.stack);
        tokenIdx++;
      }
    }
  return this._parserNodes;
  };
  emitDom(){

  }
  reset() {
    this._parserType = 0;  // derived in part from token type but more detailed
    this._parserNodes = new Array;
    this._tokens = null;
  }
  serialize() {

  }
  serializeAsTable(col1, col2, col3) {
    let table = "sentence["+this.id+"]: " + this.input + "\n";
    for (let parserNode of this._parserNodes) {
      table = table + "sentence["+this.id+"]: "+ parserNode.serializeColumnar(col1, col2, col3)+"\n";
    }
    return table.slice(0,-1);
  }
  serializeAsHTML() {
    this.logger.diagnostic("transforming sentence ("+this._tokens.length+" nodes)");
    let outputString = "<div>";
    this._parserNodes.forEach(node => {
        outputString = outputString + node.transform();
    });
    return outputString + "</div>";
  }
  serializeForUnitTest() {
    let nodeList = "";
      this._parserNodes.forEach(node => {
      nodeList = nodeList + node.serializeForUnitTest();
    } );
    return nodeList;
  } //serializeForUnitTest
transform() {
  this.logger.diagnosticMode = true;
  this.logger.diagnostic("transforming sentence ("+this._parserNodes.length+" nodes)");
  let sectionid = this.parent.id;
  let outputString = '<span class="sentence" sectionid="'+ sectionid + '" sentenceid="'
                      + this.id + '">\n';
  this._parserNodes.forEach(node => {
    outputString = outputString + node.transform();
  });
  outputString = outputString + "</span>"; // sentence /span

  //replace all WordSeq placeholders with the proper idx, which is more complex but more robust
  let nextWordIdx = 0;
  for (let pos = outputString.indexOf(WordSeqNumPlaceholder), nextWordIdx = 0; pos > 0; nextWordIdx++) {
    outputString = outputString.slice(0, pos) + nextWordIdx + outputString.slice(pos + WordSeqNumPlaceholder.length);
    pos = outputString.indexOf(WordSeqNumPlaceholder);
  }
  return outputString + "\n";
}
/*
  this._parserNodes.forEach(node => {
      outputString = outputString + node.transform();
  });
  return outputString + "</div>";
}
*/

unitTest(actual, expected) {
    return this.serializeForUnitTest(actual) === expected;
  }
};
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
  serializeColumnar(colWidth1, colWidth2) {
    let tokenList = "";
    for (let idx = this._tokenStartIdx; idx <= this._tokenEndIdx; idx++) {
      tokenList = tokenList + this._parentNode._tokens[idx].text;
    }
    if (arguments.length < 1) colWidth1 = 25;
    if (arguments.length < 2) colWidth2 = 10;
    return ("{" + tokenList + "}").padEnd(colWidth1)
        + ("("+this._tokenStartIdx+".."+this._tokenEndIdx+") ").padEnd(colWidth2)
        + "("+this.constructor.name+")";
  }
  parse(tokenIdx) {
    this.logger.diagnostic("Parsing node ="+this._parentNode._tokens[tokenIdx].text);
    this._tokenStartIdx = tokenIdx;
    this._tokenEndIdx = tokenIdx;
    return ++tokenIdx;
  }
  serialize() {
    //each node produces its own output
  }
  serializeForUnitTest() {
    let nodeJson = { TYP: "", START: 0, END: 0 };
    nodeJson.TYP = this._type;
    nodeJson.START = this._tokenStartIdx;
    nodeJson.END = this._tokenEndIdx;
    return JSON.stringify(nodeJson);
  }
  content(typeExclusionList) {
    if (typeof typeExclusionList === "undefined") typeExclusionList = [];
    let outputString = "";
    for (let idx = this._tokenStartIdx;
      idx <= this._tokenEndIdx; idx++) {
        if (!typeExclusionList.includes(this._parentNode._tokens[idx].type)) {
          outputString = outputString + this._parentNode._tokens[idx].text;
        }
    }
    return outputString;
  }
  transform() {
    this.logger.diagnostic("transforming content node ("+ this._type+")");
    return "<span>" + this.content() + "</span>";
  }
}
class ContentNode_WORD extends ContentNode {
  constructor(parent, tokenIdx) {
    super(parent, tokenIdx);
    this._type = ContentNodeType.WORD; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
  //
  parse(tokenIdx) {
    return super.parse(tokenIdx);
  }
  transform() {
    const exclusionList = [ TokenType.MLTAG, TokenType.MLTAG_END ];
    let outputString = '<span ' + WordSeq;
    let content = this.content(exclusionList);
    if (this.userContext != null) {
      let altRecog = this.userContext.altRecognitionMap.get(content);
      if (typeof altRecog !== "undefined" && altRecog !== null)
          outputString = outputString + ' altRecognition="' + altRecog + '"';
    }
    outputString = outputString + ">";
    return outputString + content + "</span>";
  }
}
class ContentNode_NUMBER extends ContentNode_WORD {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = ContentNodeType.NUMBER; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
}
class ContentNode_WHITESPACE extends ContentNode {
  // not much to do here but is placeholder for any processing beyond them
  // base class
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = ContentNodeType.WHITESPACE; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
}
class ContentNode_PUNCTUATION extends ContentNode {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = ContentNodeType.PUNCTUATION; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
}
class ContentNode_MLTAG extends ContentNode { // ALL markup tags INCLUDING PASSTHRUS
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.MLTAG;  // used by subclasses
    this._type = ContentNodeType.MLTAG; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
    //console.log("inside " + this.constructor.name);
  }
  transform() {
    this.logger.diagnostic("transforming content node ("+ this._type+")");
    return this.content();
  }
}
class ContentNode_MLTAG_ extends ContentNode_MLTAG { // interally handled MLTAGs
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.MLTAG;  // used by subclasses
//    this._type = TokenType.UNHANDLED; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  };
  parse(tokenIdx) {
  this._tokenStartIdx = tokenIdx;
    let idx = 0;
    let markupTag = this._markupTag;
    let findIdx = this._parentNode._tokens.map(token => token.text).indexOf(endMarkupTag(this._markupTag), this._tokenStartIdx+1);
    if (findIdx < 0) {  // end tag not found
      this.logger.warning("No matching end tag found for "+this._markupTag);
      this._tokenEndIdx = this._tokenStartIdx; // If endTag is not found, then tag is standalone
    }
    else {
      this._tokenEndIdx = findIdx; // include closing tag iff found
    }
    return this._tokenEndIdx + 1;
  }
  transform() {
    const exclusionList = [ TokenType.MLTAG, TokenType.MLTAG_END ];
    let altRecog, altRecogPattern;
    let content = this.content(exclusionList);
    let outputString = '<span ' + WordSeq;

    altRecogPattern = this.userContext.altRecognitionMap.get(content);
    if (typeof altRecogPattern !== "undefined" && altRecogPattern !== null) {
      outputString = outputString + ' altRecognition="' + altRecogPattern + '">';
    }
    else {
      outputString = outputString + ">";
    }
    outputString = outputString + content + '</span>';   // just default formatting
    return outputString;
  }
}
class ContentNode_MLTAG_END extends ContentNode {
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = ContentNodeType.MLTAG;
    this._markupTag = TokenTag.MLTAG_END;  // used by subclasses
  };
}
class ContentNode_MLTAG_SELFCLOSING extends ContentNode {
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = ContentNodeType.MLTAG;
    this._markupTag = TokenTag.MLTAG_SELFCLOSING;  // used by subclasses
  };
  transform() {
    this.logger.diagnostic("transforming content node ("+ this._type+")");
    return this.content();
  }
}
class ContentNode_MLTAG_EMAILADDRESS extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.EMAILADDRESS;  // used by subclasses
  }
  transform() {
    // remove ml tag
    // Consolidate local part everything to @; additional segmentation fox123 to
    // "fox "123" shall be handled by further tokenizing
    // <token>fox</token><token>123</token> in source. Still needs to be implemented below.
    // OR tokenize baed on valid separators (underscores, dot(s), $, dash
    // @ w/ altpronunciation="at"
    // Consolidate everything right of @ into domain name; additional segmentation
    // stanford.edu into <token>stanford.</token><token>edu</token> w/ altpronunciation
    // for EDU in source and . w/ altPronunciation="dot" or dot-com
    let atsignIdx = null;
    let outputString = "";
    // ugh. linear search! Fortunately typically only length<10
    for (let idx = this._tokenStartIdx + 1; idx < this._tokenEndIdx && atsignIdx === null; idx++) {
      if (this._parentNode._tokens[idx].text === "@") atsignIdx = idx ;
    }
    if (atsignIdx !== null) {
        outputString = '<span ' + WordSeq + '>';
        // skip first and last elements of ml tag
        for (let idx = this._tokenStartIdx + 1; idx < atsignIdx; idx++) {
          outputString = outputString + this._parentNode._tokens[idx].text;
        }
        outputString = outputString + "</span>"
                      + '<span pronunciation="at" ' + WordSeq + ">"
                      + this._parentNode._tokens[atsignIdx].text + "</span>"  //atsign
                      + "<span "+ WordSeq + ">";

        for (let idx = atsignIdx + 1; idx < this._tokenEndIdx; idx++) {
          outputString = outputString + this._parentNode._tokens[idx].text;
        }
        outputString = outputString + "</span>";
      }
      else {
          this.logger.error("missing @ in email");
      }
    return outputString;
  }
}
class ContentNode_MLTAG_PHONENUMBER extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.PHONENUMBER;  // used by subclasses
  }
  transform() {
    this.logger.diagnostic("transforming content node ("+ this._type+")");
    let outputString  = "";
    let idx = this._tokenStartIdx;
    if (this._tokenEndIdx - this._tokenStartIdx !== 8
      || this.tokens[this._tokenStartIdx].text !== TokenTag.PHONENUMBER
      || this.tokens[this._tokenEndIdx].text !== endMarkupTag(TokenTag.PHONENUMBER)) {
      this.logger.warning("phone number is improperly formatted and transformed as standard content");
      outputString = super.content();   // just default formatting
    }
    else {
      outputString  =
          '<span> ' + this.tokens[idx + 1].text + '</span>' // (
        + '<span ' + WordSeq + '>'  + this.tokens[idx + 2].text.slice(0,1) + '</span>'
        + '<span ' + WordSeq + '>'  + this.tokens[idx + 2].text.slice(1,2) + '</span>'
        + '<span ' + WordSeq + '>'  + this.tokens[idx + 2].text.slice(2,3) + '</span>'
        + '<span>'                  + this.tokens[idx + 3].text            + '</span>' // )
        + '<span>'                  + this.tokens[idx + 4].text            + '</span>' // space
        + '<span ' + WordSeq + '>'  + this.tokens[idx + 5].text.slice(0,1) + '</span>'
        + '<span ' + WordSeq + '>'  + this.tokens[idx + 5].text.slice(1,2) + '</span>'
        + '<span ' + WordSeq + '>'  + this.tokens[idx + 5].text.slice(2,3) + '</span>'
        + '<span>'                  + this.tokens[idx + 6].text            + '</span>' // -
        + '<span ' + WordSeq + '>'  + this.tokens[idx + 7].text.slice(0,1) + '</span>'
        + '<span ' + WordSeq + '>'  + this.tokens[idx + 7].text.slice(1,2) + '</span>'
        + '<span ' + WordSeq + '>'  + this.tokens[idx + 7].text.slice(2,3) + '</span>'
        + '<span ' + WordSeq + '>'  + this.tokens[idx + 7].text.slice(3,4) + '</span>';
    }
    return outputString;
  }
}
class ContentNode_MLTAG_TIME extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.TIME;  // used by subclasses
  }
}
class ContentNode_MLTAG_DATE1 extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.DATE1;  // used by subclasses
  }
  transform() {
    // e.g., 03 Jan(uary) 2020
  }
}
class ContentNode_MLTAG_DATE2 extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.DATE2;  // used by subclasses
  }
  transform() {
    // e.g., Jan(uary) 3, 2020
    let pronunciationAttr = "";
    let outputString = "";
///    for (let idx = this._tokenStartIdx; idx <= this._tokenEndIdx; idx++) {
///      console.log("date 2 ###"+this.tokens[idx].text);
///    }
    let currentIdx = this._tokenStartIdx + 1; // offset skips mltag
    let abbreviatedMonth = this._parentNode._tokens[currentIdx + 1].text === ".";
    if (abbreviatedMonth) {
      let abbreviatedMonthTag = this._parentNode._tokens[currentIdx].text.slice(0,3).toLowerCase();
      try {
///        pronunciationAttr = 'pronunciation="' + AbbreviatedMonthMap.get(abbreviatedMonthTag.toLowerCase()) +'"';
        pronunciationAttr = ' pronunciation="' + AbbreviatedMonthMap.get(abbreviatedMonthTag) +'"';
      }
      catch(e) {
        console.log(e.message);
        this.logger.error("invalid abbreviated month "+abbreviatedMonthTag);
      }
    }
    outputString = "<span " + WordSeq + pronunciationAttr + ">"
                    + this.tokens[currentIdx++].text + "</span>"; // month
    if (abbreviatedMonth)
      outputString = outputString
                    + "<span>" + this.tokens[currentIdx++].text + "</span>"; // "."
      outputString = outputString
                    + "<span>" + this.tokens[currentIdx++].text + "</span>"; // space
      let day = this.tokens[currentIdx++].text;
      if(!isNaN(parseInt(day))) {
        pronunciationAttr = ' pronunciation="'+ OrdinalNumberMap.get(day) + '" ';
      }
      outputString = outputString
                    + '<span ' + WordSeq + pronunciationAttr + ">" + day + "</span>"
                    + "<span>" + this.tokens[currentIdx++].text + "</span>" // comma
                    + "<span>" + this.tokens[currentIdx++].text + "</span>" // space
                    + "<span "+ WordSeq + ">" + this.tokens[currentIdx++].text + "</span>"; // year

    for (let idx = currentIdx + 1; idx < this._tokenEndIdx; idx++) {
      outputString = outputString + this.tokens[idx].text;
    }
//    outputString = outputString + "</span>";
    return outputString;
  }
}
class ContentNode_MLTAG_DATE3 extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.DATE3;
  }
  transform() {
    // Jan(uary) 3
  }
}
class ContentNode_MLTAG_CONTRACTION extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.CONTRACTION;
  }
}
class ContentNode_MLTAG_NUMBER_WITHCOMMAS extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.NUMBER_WITHCOMMAS;
  }
  transform() {
    // remove commas for the altPronunciation. Should check for altPronunciation too!
    let outputString;
    let altRecog;
    const exclusionList = [ TokenType.MLTAG, TokenType.MLTAG_END ];
    altRecog = super.content(exclusionList).replace(/,/g,'');
    outputString = '<span ' + WordSeq + ' altrecognition="'+ altRecog + '">'
                    + super.content(exclusionList); + "</span>";
    return outputString;
  }
}
class ContentNode_MLTAG_TOKEN extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.TOKEN;
  }
//  transform() { // handled by parent class
//    return super.transform();
//  }
}
class ContentNode_MLTAG_USD extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.USD;
  }
  transform() {
    this.logger.diagnostic("transforming content node ("+ this._type+")");

    let outputString;
    const exclusionList = [ TokenType.MLTAG, TokenType.MLTAG_END ];
    if (this.tokens[this._tokenStartIdx].text !== TokenTag.USD
        || this.tokens[this._tokenEndIdx].text !== endMarkupTag(TokenTag.USD)) {
      this.logger.error("US currency is improperly formatted and transformed as standard content");
      outputString = super.content(exckusionList);   // just default formatting
    }
    else {  // at present, this is the same as the default behavior
      outputString  =
         '<span ' + WordSeq + '>'  + super.content(exclusionList) + '</span>';   // just default formatting

    }
    return outputString;
  }
}
module.exports = { PageContent, PageFormatter, SectionContent, SentenceContent, TestFormatter, UserContext };
