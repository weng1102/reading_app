/*******************************************
 * Reading Monitor v2.0
 * (c) 2017, 2018, 2019, 2020 by Wen Eng. All rights reserved.
 ********************************************/

'use strict';
const  { TokenType, endMarkupTag, TokenTag } = require('../src/tokentypes.js');
const  { Logger } = require('../src/utilities.js');

// Definition of tokens to be tokenized (Mpa gurantees order)

// Add additional tokenTags/pattern to be processed as parser markup directives.
// The tag field contains the ML tag to be embedded.
// In the case of dates, the specific format is valuable to preserve since parsing will be handled
// differently. In the case of contractions, all parsing will be managed the same so preserving their
// specific type of contraction is not required. If it does become necessary, the relevant tags
// can be added at that time.
// Note: Definition of tokens to be identified with mark up tags before tokenizing. TokenType is not
// necessary because the method that uses this list does not record the Token Type, just the token tag

class Tokenizer {
  constructor(parent) {
    this._logger = new Logger(this);
    this._parent = parent;
    // Build token pattern from TokenTypeList
    let tokenPatternSource = "";
    this._TokenizerTokenTypeList = new Map( [
      [TokenType.WORD, { tag: TokenTag.WORD, pattern: /([A-Za-z]+)/ }],
      [TokenType.NUMBER, { tag: TokenTag.NUMBER, pattern: /([0-9]+)/ }],
      [TokenType.PUNCTUATION, { tag: TokenTag.PUNCTUATION, pattern: /([,.\/#$%\^&\*;:{}=\-_'~()\"\?\.!@])/ }],
      [TokenType.MLTAG, { tag: TokenTag.MLTAG, pattern: /(<[\w\s="/.':;#-\/\?]+>)/ }],
      [TokenType.MLTAG_END, { tag: TokenTag.MLTAG_END, pattern: /(<[\w\s="/.':;#-\/\?]+>)/ }]
    ]);
    this._TokenizerTokenTypeList.forEach((TokenizerTokenType) => {
      tokenPatternSource = tokenPatternSource + TokenizerTokenType.pattern.source +"|";
    });
    // should be its own object with iterator
    this._tokenPattern = new RegExp(tokenPatternSource.slice(0,-1),"g");
    this._MarkupTokenTypeList = [
      { tag: TokenTag.USD,
        type: TokenType.USD,
        pattern: /(?<=^|\W)\$(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d\d)?(?=\s|\W|$|[.!?\\-])/g },
      { tag: TokenTag.EMAILADDRESS,
        type: TokenType.EMAILADDRESS,
        pattern: /(?<=^|\W)([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})(?=(?=\s|\W|$|[.!?\\-]))/g },
      { tag: TokenTag.PHONENUMBER,
        type: TokenType.PHONENUMBER,
        pattern: /(?<=^|\W)\(\d{3}\)\s\d{3}-\d{4}(?=(\W|$))/g },
      { tag: TokenTag.TIME,
        type: TokenType.TIME,
        pattern: /(?<=^|\W)([0-9]|[0-1][0-9]|[2][0-3]):([0-5][0-9])(?=(\W|$))/g },
      { tag: TokenTag.DATE1,
        type: TokenType.DATE1,
        pattern: /(?<=^|\W)((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\s*(Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)\ ((1[6-9]|[2-9]\d)\d{2})(?=\s)/g }, //DD MMM YYY
      { tag: TokenTag.DATE2,
        type: TokenType.DATE2,
        pattern: /(?<=^|\W)(Jan(.|(uary))?|Feb(.|(ruary))?|Ma(r(.|(ch))?|y)|Apr(.|(il))?|Jul(.|(y))?|Jun(.|(e))?|Aug(.|(ust))?|Oct(.|(ober))?|(Sep(?=\b|t)t?|Nov|Dec)(.|(ember))?)\ ((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\s*(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8]),[\s]*((1[6-9]|[2-9]\d)\d{2})(?=(\W|$))/g }, //MMM* DD,YYYY
      { tag: TokenTag.DATE3,
        type: TokenType.DATE3,
        pattern: /(?<=^|\W)(Jan(.|(uary))?|Feb(.|(ruary))?|Ma(r(.|(ch))?|y)|Apr(.|(il))?|Jul(.|(y))?|Jun(.|(e))?|Aug(.|(ust))?|Oct(.|(ober))?|(Sep(?=\b|t)t?|Nov|Dec)(.|(ember))?)\ ((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\s*(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])(?=\s)/g }, //MMM* DD
      { tag: TokenTag.CONTRACTION,
        type: TokenType.CONTRACTION,
        pattern: /(?<=^|\s|^$)([A-Za-z]+)\'d(?=\s|\W|$|[.!?\\-])/g },
      { tag: TokenTag.CONTRACTION,
        type: TokenType.CONTRACTION,
        pattern: /(?<=^|\s|^$)([A-Za-z]+)\'ll(?=\s|\W|$|[.!?\\-])/g },
      { tag: TokenTag.CONTRACTION,
        type: TokenType.CONTRACTION,
        pattern: /(?<=^|\s|^$)I\'m(?=\s|\W|$|[.!?\\-])/g },
      { tag: TokenTag.CONTRACTION,
        type: TokenType.CONTRACTION,
        pattern: /(?<=^|\W|^$)(([Yy]ou|[Ww]e|[Tt]hey|[Ww]hat)\'re)(?=\s|\W|$|[.!?\\-])/g },
      { tag: TokenTag.CONTRACTION,
        type: TokenType.CONTRACTION,
        pattern: /(?<=^|\W|^$)([Ii]s|[Aa]re|[Ww]as|[Ww]ere|[Hh]ave|[Hh]as|[Hh]ad|[Ww]o|[Ww]ould|[Dd]o|[Dd]oes|[Dd]id|[Cc]a|[Cc]ould|[Ss]hould|[Mm]igh|[Mm]ust])n\'t(?=\s|\W|$|[.!?\\-])/g },
      { tag: TokenTag.CONTRACTION,
        type: TokenType.CONTRACTION,
        pattern: /(?<=^|\s|^$)([A-Za-z]+)\'s(?=\s|\W|$|[.!?\\-])/g }, // also includes possessives
      { tag: TokenTag.CONTRACTION,
        type: TokenType.CONTRACTION,
        pattern: /(?<=^|\s|^$)(I|[Yy]ou|[Ww]e|[Tt]hey|[Ss]hould|[Cc]ould|[Ww]ould|[Mm]ight|[Mm]ust)\'ve(?=\s|\W|$|[.!?\\-])/g },
      { tag: TokenTag.NUMBER_WITHCOMMAS,
        type: TokenType.CONTRACTION,
        pattern: /(?<=^|\s|^$)(\d{0,3},)?(\d{3},)*(\d{1,3},\d{3})(?=\s|\W|$|[.!?\\-])/g }
      // scan for token that require potential markup tags
    ];
  };
get logger() {
  return this._logger;
}
tokenize(sentence) {
    let tokenList = Array(); // to be returned including whitespace
    let t = 0;
    let currentPos = 0;
    try {
      // Goal: Tokenize while preserving whitespace. Compare original string with array
      // of non-whitespace tokens, tokensOnly and extract and insert whitespace between
      // non-whitespace tokens.
      let tokenOnlyList = sentence.match(this._tokenPattern); // token list without whitespace
      this.logger.diagnosticMode = false;
      this.logger.diagnostic("tokenOnlyList="+tokenOnlyList);
      for (var tokenOnly of tokenOnlyList) {
        let tokenPos  = sentence.indexOf(tokenOnly, currentPos);
        if (currentPos < tokenPos) { // whitespace before token
          tokenList[t++] = new Token(sentence.substring(currentPos, tokenPos),
                            TokenType.WHITESPACE, currentPos, tokenPos - currentPos);
          currentPos = tokenPos;
        }
        if (currentPos === tokenPos) { // positioned at token
          tokenList[t++] = new Token(tokenOnly, this.tokenType(tokenOnly), currentPos,
                            tokenOnly.length);
          currentPos = tokenPos + tokenOnly.length; // positioned at next token
          if (currentPos < sentence.length) { // positioned at trailing whitespace, if any
            tokenList[t] = new Token(sentence.substring(currentPos, sentence.length),
                            TokenType.WHITESPACE, currentPos, sentence.length - currentPos);
          }
          else if (currentPos > sentence.length) {
            throw new Error("Tokenizer.tokenize(): currentPos="+currentPos+" is positioned beyond end of string {"+sentence+"}"); // EXCEPTIONAL
          }
          else {
            // EOL
          }
        }
        else {
           //SHOULD THROW EXCEPTION
          throw new Error("Tokenizer.tokenize(): string.match(regexp) returned a token that "+
                    "is not found in the string.");  // EXCEPTIONAL
        }
      } // for-of
      this.logger.diagnostic(this.serialize(tokenList));
      return tokenList;
    } // try
    catch(e) {
      console.log("Tokenizer.tokenize() caught/rethrew exception - "+e.message);
      throw(e);
    } // catch
  } //tokens method
  reset(){
  };
  insertMarkupTags(sentence) {
    /// this.logger.diagnosticMode = true;
    try {
      let result = sentence;
      this._MarkupTokenTypeList.forEach((markupTag) => {
        let tokenList = result.match(markupTag.pattern); // with global flag set
        if (tokenList !== null) {
          let startPos = 0;
          let tokenPos = 0;
          tokenList.forEach((token) => {
            tokenPos = result.indexOf(token, startPos);
            if (tokenPos < 0) {
              // Found by regexp match and stored in tokenlist but not found by indexOf
              this.logger.error("{" + token + "} not found in string from after pos="
                                + startPos);
              // should throw exception
            }
            else if (tokenPos >= markupTag.tag.length
              & result.substr((tokenPos - markupTag.tag.length), markupTag.tag.length)
                === markupTag.tag) {
              this.logger.warning("{" + token + "} already tagged as "
                    + markupTag.tag+".");
            }
            else {
              // splice in the markup tags
              result = result.slice(0, tokenPos)  // sentence before token
                        + markupTag.tag + token + endMarkupTag(markupTag.tag)
                        + result.slice(tokenPos + token.length);  // sentence after token
              startPos = markupTag.tag.length + tokenPos + token.length
                        + endMarkupTag(markupTag.tag).length
                        + 1;
            }
          }); //tokenList.forEach()
        } //(tokenList !== null)
        else {
          //          console.log("no matches on "+appSpecificTag.tag);
        }
      }); // appSpecificTag.forEach()
      return result;
    }
    catch(e) {
      console.error("Tokenizer.insertMarkupTags(): Caught exception - "+e.message);
      throw(e);
    }
  }
  serialize(tokenList) {
      var tokenString ="";
      tokenList.forEach(token => tokenList = tokenList + "{"+token.text+"} " );
      return tokenString;
    }
  serializeAsTable(tokenList, col1, col2, col3) {
    var tokenString ="\n";
    tokenList.forEach(token => tokenString = tokenString + token.serializeColumnar(col1, col2, col3)+"\n");
    tokenString = tokenString.slice(0, -1);
    return tokenString;
  }
  serializeForUnitTest(tokens) {
    let tokenJson = { TOK: "", TYP: "", POS: 0, LEN: 0 };
    let tokenList ="";
    tokens.forEach(token => {
      tokenList = tokenList + token.serializeForUnitTest(tokenJson);
    });
    return tokenList;
  }
  tokenType(token) {
    let type = TokenType.TBD;
    if (token.match(this._TokenizerTokenTypeList.get(TokenType.MLTAG).pattern)) {
      if (token.substring(1,2) === TokenTag.FORWARDSLASH) {
          type = TokenType.MLTAG_END;
      }
      else if (token.slice(-2,-1) === TokenTag.FORWARDSLASH) {
          type = TokenType.MLTAG_SELFCLOSING;
      }
      else {
          type = TokenType.MLTAG;
      }
    }
    else if (token.match(this._TokenizerTokenTypeList.get(TokenType.PUNCTUATION).pattern)) {
      type = TokenType.PUNCTUATION;
    }
    else if (token.match(this._TokenizerTokenTypeList.get(TokenType.NUMBER).pattern)) {
      type = TokenType.NUMBER;
    }
    else if (token.match(this._TokenizerTokenTypeList.get(TokenType.WORD).pattern)) {
//      else if (token.match(this._wordTokenPattern)) {
      type = TokenType.WORD;
    }
    else {
      type = TokenType.UNHANDLED; // catch all but should apply word pattern
    }
    return type;
  };
  unitTest(actual, expected) {
    return this.serializeForUnitTest(actual) === expected;
  } // unitTest
} // tokenizer class
class Token {
  constructor(text, type, position, length) {
    this._text ="";
    this._type = TokenType.TBD;
    this._position = 0;
    this._length = 0;
    this._parseType;
    this._attributeList = new Array;  // used by parser
    this._alternatePronunciation = ""; // regexp
    switch (arguments.length) {
      case 4:
            this._length = length;
      case 3:
            this._position = position;
      case 2:
            this._type = type;
      case 1:
          this._text = text;
    }
  }
  get attributeList() {
    return this._attribute[0];
  }
  set attribute(attr) {
    this._attribute[0] = attr;
  }
  addAttribute(attr) {
    this._attribute[this._attribute.length+1] = attr;
  }
  get length() {
    return this._length;
  }
  set length(length) {
    this._length = length;
  }
  get position() {
    return this._position;
  }
  set position(position) {
    this._position = position;
  }
  get text() {
    return this._text;
  }
  set text(textContent) {
    this._text = textContent;
  }
  get parserType() {
    return this._type;
  }
  set parserType(parserType) {
    this._type = parserType;
  }
  get type() {
    return this._type;
  }
  set type(tokenType) {
    this._type = tokenType;
  }
  serializeColumnar(colWidth1, colWidth2, colWidth3) {
    switch(arguments.length) {
      case 0:
        colWidth1 = this._text.length + 1;
      case 1:
        colWidth2 = this._type.length + 7; // 7 = string labels length
      case 2:
        colWidth3 = this._position.length+this._length.length + 3; // 3 = string formatting length
    }
    return ("{" + this._text + "}").padEnd(colWidth1-2)
          + ("(type:" + this._type + ")".padEnd(colWidth2 - this._type.toString().length - 7)
          + "("+this._position.toString() + "," + this.length.toString() + ")").padEnd(colWidth3);
  }
  serializeForUnitTest(tokenJson) {
    tokenJson.TOK = this.text;
    tokenJson.TYP = this.type;
    tokenJson.POS = this.positon;
    tokenJson.LEN = this.length;
    return JSON.stringify(tokenJson);
  }
} // Token class
function getFunctionName() {
  return getFunctionName.caller.name;
}
module.exports = { Tokenizer, Token };
