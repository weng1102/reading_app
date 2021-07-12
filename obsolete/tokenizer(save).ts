/*******************************************
 * Reading Monitor v2.0
 * (c) 2017, 2018, 2019, 2020 by Wen Eng. All rights reserved.
 ********************************************/

'use strict';
import { endMarkupTag, TokenLiteral } from './tokentypes';
import { Logger } from './utilities';

// Definition of tokens to be tokenized (Map guarantees order)

// Add additional patterns to be processed as parser markup directives.
// In the case of dates, the specific format is valuable to preserve since
// parsing will be handled differently. In the case of contractions, all parsing
// will be managed the same so preserving their specific type of contraction is
// not required. If it does become necessary, the relevant tags can be expressed
// at that time.
// Note: Markup tokens are identified before tokenizing.

// symbols used for type of token AND to access TokenTypeList array
const enum TokenType {
  WORD = 0,
  MLTAG,
  MLTAG_END,
  NUMBER,
  PUNCTUATION,
  WHITESPACE,
  MLTAG_SELFCLOSING,
  TBD
};
const enum TokenLabelType {
  WORD = "WORD",
  MLTAG = "MLTAG",
  MLTAG_END = "MLTAG_END",
  NUMBER = 'NUMBER',
  PUNCTUATION = 'PUNCTUATION', // unhandled lexical punctuation
  WHITESPACE = 'WHITESPACE',
  MLTAG_SELFCLOSING = 'MLTAG_SELFCLOSING'
}
// these "markups" identify special content that require special semantic
// processing  form proper terms not recognized by speech recognition engine
// if not properly tokenized.
// For instance, the term 3/14/21 should listen for March 3rd 2021...and
// not just three, forteen, twenty-one.
const enum MarkupTokenType  { // labels used for markup in interim output
  USD = 0,
  EMAILADDRESS,
  PHONENUMBER,
  TIME,
  DATE1,
  DATE2,
  DATE3,
  CONTRACTION_D,
  CONTRACTION_LL,
  CONTRACTION_M,
  CONTRACTION_RE,
  CONTRACTION_NT,
  CONTRACTION_S,
  CONTRACTION_VE,
  NUMBER_WITHCOMMAS
}
// used as markup labels for intermediate serialization between tokenizing and parsing
const enum MarkupLabelType {
  CONTRACTION = '<CONTRACTION>',
  USD = '<USD>',
  DATE = '<DATE>',
  DATE1 = '<DATE1>',
  DATE2 = '<DATE2>',
  DATE3 = '<DATE3>',
  EMAILADDRESS = '<EMAILADDRESS>',
  NUMBER_WITHCOMMAS = '<NUMBER_WITHCOMMAS>',
  PHONENUMBER = '<PHONENUMBER>',
  TIME = '<TIME>',
  TOKEN = '<EXPLICITTOKEN>', // <token>
  FILLIN = '<FILLIN>',
  UNHANDLED = '<UNHANDLED>',  // no explicit token type
}
interface TokenMapItemType {
  type: TokenType,
  label: TokenLabelType,
  pattern: RegExp
}
interface MarkupTokenItemType {
  type: MarkupTokenType,
  label: MarkupLabelType,
  pattern: RegExp
}
interface TokenJson {
  TOK: string,
  TYP: number,
  POS: number,
  LEN: number
};

export type TokenListType = Array<Token>;

// Tokens that do not follow standard tokenizing where markups must be inserted
export class Tokenizer {
  readonly logger: Logger;
  readonly parent: any;
  readonly tokenizingPattern: RegExp;
  readonly tokenMap: Map<TokenType, TokenMapItemType>;
  readonly markupTokenMap: Map<MarkupTokenType, MarkupTokenItemType>;
//  readonly type tokenizerTokenTypeMap;

  constructor(parent: any) {
    this.parent = parent;
    this.logger = new Logger(this);
    // Build token pattern from TokenTypeList
    this.tokenMap = new Map([
      [TokenType.WORD, {
        type: TokenType.WORD,
        label: TokenLabelType.WORD,
        pattern: /([A-Za-z]+)/
      }],
      [TokenType.NUMBER, {
        type: TokenType.NUMBER,
        label: TokenLabelType.NUMBER,
        pattern: /([0-9]+)/
      }],
      [TokenType.PUNCTUATION, {
       type: TokenType.PUNCTUATION,
        label: TokenLabelType.PUNCTUATION,
        pattern: /([,.\/#$%\^&\*;:{}=\-_'~()\"\?\.!@])/
      }],
      [TokenType.MLTAG, {
       type: TokenType.MLTAG,
        label: TokenLabelType.MLTAG,
        pattern: /(<[\w\s="/.':;#-\/\?]+>)/
      }],
      [TokenType.MLTAG_END, {
        type: TokenType.MLTAG_END,
        label: TokenLabelType.MLTAG_END,
        pattern: /(<[\w\s="/.':;#-\/\?]+>)/
      }]
    ]);
    let tokenizingPatternSource = "";
    this.tokenMap.forEach((TokenizerTokenItem: TokenMapItemType) => {
      tokenizingPatternSource = tokenizingPatternSource + TokenizerTokenItem.pattern.source +"|";
    });
    this.tokenizingPattern = new RegExp(tokenizingPatternSource.slice(0,-1),"g");

    this.markupTokenMap = new Map([
      [MarkupTokenType.USD, {
        type: MarkupTokenType.USD,
        label: MarkupLabelType.USD,
        pattern: /(?<=^|\W)\$(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d\d)?(?=\s|\W|$|[.!?\\-])/g
      }],
      [MarkupTokenType.EMAILADDRESS, {
        type: MarkupTokenType.EMAILADDRESS,
          label: MarkupLabelType.EMAILADDRESS,
          pattern: /(?<=^|\W)([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})(?=(?=\s|\W|$|[.!?\\-]))/g
      }],
      [MarkupTokenType.PHONENUMBER, {
        type: MarkupTokenType.PHONENUMBER,
        label: MarkupLabelType.PHONENUMBER,
        pattern: /(?<=^|\W)\(\d{3}\)\s\d{3}-\d{4}(?=(\W|$))/g
      }],
      [MarkupTokenType.TIME, {
        type: MarkupTokenType.TIME,
        label: MarkupLabelType.TIME,
        pattern: /(?<=^|\W)([0-9]|[0-1][0-9]|[2][0-3]):([0-5][0-9])(?=(\W|$))/g
      }],
      [MarkupTokenType.DATE1, {
        type: MarkupTokenType.DATE1,
        label: MarkupLabelType.DATE1,
        pattern: /(?<=^|\W)((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\s*(Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)\ ((1[6-9]|[2-9]\d)\d{2})(?=\s)/g //DD MMM YYY
      }],
      [MarkupTokenType.DATE2, {
        type: MarkupTokenType.DATE2,
        label: MarkupLabelType.DATE2,
        pattern: /(?<=^|\W)(Jan(.|(uary))?|Feb(.|(ruary))?|Ma(r(.|(ch))?|y)|Apr(.|(il))?|Jul(.|(y))?|Jun(.|(e))?|Aug(.|(ust))?|Oct(.|(ober))?|(Sep(?=\b|t)t?|Nov|Dec)(.|(ember))?)\ ((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\s*(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8]),[\s]*((1[6-9]|[2-9]\d)\d{2})(?=(\W|$))/g //MMM* DD,YYYY
      }],
      [MarkupTokenType.DATE3, {
        type: MarkupTokenType.DATE3,
        label: MarkupLabelType.DATE3,
        pattern: /(?<=^|\W)(Jan(.|(uary))?|Feb(.|(ruary))?|Ma(r(.|(ch))?|y)|Apr(.|(il))?|Jul(.|(y))?|Jun(.|(e))?|Aug(.|(ust))?|Oct(.|(ober))?|(Sep(?=\b|t)t?|Nov|Dec)(.|(ember))?)\ ((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\s*(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])(?=\s)/g //MMM* DD\
      }],
      [MarkupTokenType.CONTRACTION_D,
      { type: MarkupTokenType.CONTRACTION_D,
        label: MarkupLabelType.DATE2,
        pattern: /(?<=^|\s|^$)([A-Za-z]+)\'d(?=\s|\W|$|[.!?\\-])/g
      }],
      [MarkupTokenType.CONTRACTION_LL, {
        type: MarkupTokenType.CONTRACTION_LL,
        label: MarkupLabelType.CONTRACTION,
        pattern: /(?<=^|\s|^$)([A-Za-z]+)\'ll(?=\s|\W|$|[.!?\\-])/g
      }],
      [MarkupTokenType.CONTRACTION_M, {
        type: MarkupTokenType.CONTRACTION_M,
        label: MarkupLabelType.CONTRACTION,
        pattern: /(?<=^|\s|^$)I\'m(?=\s|\W|$|[.!?\\-])/g
      }],
      [MarkupTokenType.CONTRACTION_RE, {
        type: MarkupTokenType.CONTRACTION_RE,
        label: MarkupLabelType.CONTRACTION,
        pattern: /(?<=^|\W|^$)(([Yy]ou|[Ww]e|[Tt]hey|[Ww]hat)\'re)(?=\s|\W|$|[.!?\\-])/g
      }],
      [MarkupTokenType.CONTRACTION_NT, {
        type: MarkupTokenType.CONTRACTION_NT,
        label: MarkupLabelType.CONTRACTION,
        pattern: /(?<=^|\W|^$)([Ii]s|[Aa]re|[Ww]as|[Ww]ere|[Hh]ave|[Hh]as|[Hh]ad|[Ww]o|[Ww]ould|[Dd]o|[Dd]oes|[Dd]id|[Cc]a|[Cc]ould|[Ss]hould|[Mm]igh|[Mm]ust])n\'t(?=\s|\W|$|[.!?\\-])/g
      }],
      [MarkupTokenType.CONTRACTION_S,{
        type: MarkupTokenType.CONTRACTION_S,
        label: MarkupLabelType.CONTRACTION,
        pattern: /(?<=^|\s|^$)([A-Za-z]+)\'s(?=\s|\W|$|[.!?\\-])/g // also includes possessives
      }],
      [MarkupTokenType.CONTRACTION_VE, {
       type: MarkupTokenType.CONTRACTION_VE,
        label: MarkupLabelType.CONTRACTION,
        pattern: /(?<=^|\s|^$)(I|[Yy]ou|[Ww]e|[Tt]hey|[Ss]hould|[Cc]ould|[Ww]ould|[Mm]ight|[Mm]ust)\'ve(?=\s|\W|$|[.!?\\-])/g
      }],
      [MarkupTokenType.NUMBER_WITHCOMMAS, {
        type: MarkupTokenType.NUMBER_WITHCOMMAS,
        label: MarkupLabelType.CONTRACTION,
        pattern: /(?<=^|\s|^$)(\d{0,3},)?(\d{3},)*(\d{1,3},\d{3})(?=\s|\W|$|[.!?\\-])/g
      // scan for token that require potential markup tags
      }]
    ])
  };
tokenize(sentence: string): TokenListType {
  // matches token pattern without whitespace instead of delimited whitespace
  // TokenTypeList MUST be initialized in enum TokenType order! Otherwise,
  // it should be reimplemented as a Map with key TokenType
  let tokenOnlyList: RegExpMatchArray | null;
  let tokenList: TokenListType = []; // to be returned including whitespace
//  let t: number = 0;
  let currentPos: number = 0;
  try {
    // Goal: Tokenize while preserving whitespace. Compare original string with array
    // of non-whitespace tokens, tokensOnly and extract and insert whitespace between
    // non-whitespace tokens.
    tokenOnlyList = sentence.match(this.tokenizingPattern); // token list without whitespace
    this.logger.diagnosticMode = false;
    this.logger.diagnostic(`tokenOnlyList=${tokenOnlyList}`);
    if (tokenOnlyList === null) {
      this.logger.diagnostic("tokenList=null");
      return [];
    }
    for (let tokenOnly of tokenOnlyList) {
      let tokenPos: number = sentence.indexOf(tokenOnly, currentPos);

      // positioned before token: whitespace before token
      if (currentPos < tokenPos) {
        tokenList.push(new Token(sentence.substring(currentPos, tokenPos),
                            TokenType.WHITESPACE,
                            currentPos,
                            tokenPos - currentPos)); // length
        currentPos = tokenPos;  // potition beyond whitespace
      }
      // positioned at token: whitespace before token
      if (currentPos === tokenPos) { // positioned at token
          tokenList.push(new Token(tokenOnly,
                            this.tokenType(tokenOnly),
                            currentPos,
                            tokenOnly.length));
          currentPos = tokenPos + tokenOnly.length; // positioned beyond token

          if (currentPos < sentence.length) { // positioned at trailing whitespace, if any
            tokenList.push(new Token(sentence.substring(currentPos, sentence.length),
                              TokenType.WHITESPACE,
                              currentPos,
                              sentence.length - currentPos));
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
  insertMarkupTags(sentence: string): string {
    /// this.logger.diagnosticMode = true;
    try {
      let result = sentence;
      this.markupTokenMap.forEach((markupTokenMapItem) => {
        let tokenList = result.match(markupTokenMapItem.pattern); // with global flag set
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
            else if (tokenPos >= markupTokenMapItem.label.length
              && result.substr((tokenPos - markupTokenMapItem.label.length), markupTokenMapItem.label.length)
                === markupTokenMapItem.label) {
              this.logger.warning("{" + token + "} already tagged as "
                    + markupTokenMapItem.label+".");
            }
            else {
              // splice in the markup tags
              result = result.slice(0, tokenPos)  // sentence before token
                        + markupTokenMapItem.label + token + endMarkupTag(markupTokenMapItem.label)
                        + result.slice(tokenPos + token.length);  // sentence after token
              startPos = markupTokenMapItem.label.length + tokenPos + token.length
                        + endMarkupTag(markupTokenMapItem.label).length
                        + 1;
            }
          }); //tokenList.forEach()
        } //(tokenList !== null)
        else {
          //          console.log("no matches on "+appSpecificTag.label);
        }
      }); // appSpecificTag.forEach()
      return result;
    }
    catch(e) {
      console.error("Tokenizer.insertMarkupTags(): Caught exception - "+e.message);
      throw(e);
    }
  }
  serialize(tokenList: TokenListType) {
      var tokenString ="";
      tokenList.forEach(token => tokenString = tokenString + "{"+token.content+"} " );
      return tokenString;
    }
  serializeAsTable(tokenList: TokenListType, col1?: number, col2?: number, col3?: number): string {
    var tokenString ="\n";
    tokenList.forEach(token => tokenString = tokenString + token.serializeColumnar(col1, col2, col3)+"\n");
    tokenString = tokenString.slice(0, -1);
    return tokenString;
  }
  serializeForUnitTest(tokenList: TokenListType): string {
    let tokenJson: TokenJson = { TOK: "", TYP: 0, POS: 0, LEN: 0 };
    let tokenListString: string ="";
    tokenList.forEach(token => {
      tokenListString = tokenListString + token.serializeForUnitTest(tokenJson);
    });
    return tokenListString;
  }
  tokenType(tokenContent: string): TokenType {
    let type: TokenType;
    if (tokenContent.match(this.tokenMap[TokenType.MLTAG].pattern)) {
      if (tokenContent.substring(1,2) === TokenLiteral.FORWARDSLASH) {
          type = TokenType.MLTAG_END;
      }
      else if (tokenContent.slice(-2,-1) === TokenLiteral.FORWARDSLASH) {
          type = TokenType.MLTAG_SELFCLOSING;
      }
      else {
          type = TokenType.MLTAG;
      }
    }
    else if (tokenContent.match(this.tokenMap[TokenType.PUNCTUATION].pattern)) {
      type = TokenType.PUNCTUATION;
    }
    else if (tokenContent.match(this.tokenMap[TokenType.NUMBER].pattern)) {
      type = TokenType.NUMBER;
    }
    else if (tokenContent.match(this.tokenMap[TokenType.WORD].pattern)) {
//      else if (token.match(this._wordTokenPattern)) {
      type = TokenType.WORD;
    }
    else {
      type = TokenType.TBD; // catch all but should apply word pattern
    }
    return type;
  };
  unitTest(actual: string, expected: string): boolean {
    //return this.serializeForUnitTest(actual) === expected;
    return (actual === expected);
  } // unitTest
} // tokenizer class
export class Token {
  readonly content: string = "";
  readonly type: TokenType = TokenType.TBD;
  readonly position: number = 0;
  readonly length: number = 0;
//  protected parserType: number;
//  protected _attributeList: string[]; // = new Array;  // used by parser
//  protected _alternatePronunciation: string = ""; // regexp

  constructor(content: string, type: TokenType, position: number, length: number) {
    switch (arguments.length) {
      case 4:
            this.length = length;
      case 3:
            this.position = position;
      case 2:
            this.type = type;
      case 1:
          this.content = content;
    }
  }
  /*
  get attributeList() {
    return this._attributeList[0];
  }
  set attribute(attr) {
    this._attributeList[0] = attr;
  }
  addAttribute(attr) {
    this._attributeList[this._attributeList.length+1] = attr;
  }
  get parserType() {
    return this._parserType;
  }
  set parserType(parserType) {
    this._type = parserType;
  }
  */
  serializeColumnar(colWidth1?: number, colWidth2?: number, colWidth3?: number) {
    switch(arguments.length) {
      case 0:
        colWidth1 = this.content.length + 1;
      case 1:
        colWidth2 = this.content.length + 7; // 7 = string labels length
      case 2:
        colWidth3 = this.position+this.length + 3; // 3 = string formatting length
    }
    return ("{" + this.content + "}").padEnd(colWidth1! - 2)
          + ("(type:" + this.type + ")".padEnd(colWidth2! - this.type.toString().length - 7)
          + "("+this.position.toString() + "," + this.length.toString() + ")").padEnd(colWidth3!);
  }
  serializeForUnitTest(tokenJson: TokenJson) {
    tokenJson.TOK = this.content;
    tokenJson.TYP = this.type;
    tokenJson.POS = this.position;
    tokenJson.LEN = this.length;
    return JSON.stringify(tokenJson);
  }
} // Token class
