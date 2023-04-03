/*******************************************
 * Reading Monitor v2.0
 * (c) 2017, 2018, 2019, 2020 by Wen Eng. All rights reserved.
 ********************************************/

"use strict";
///import { endMarkupTag, TokenLiteral } from './tokentypes';
import { IsError } from "./utilities";
import { Logger } from "./logger";
// Definition of tokens to be tokenized (Map guarantees order)

// Add additional patterns to be processed as parser markup directives.
// In the case of dates, the specific format is valuable to preserve since
// parsing will be handled differently. In the case of contractions, all parsing
// will be managed the same so preserving their specific type of contraction is
// not required. If it does become necessary, the relevant tags can be expressed
// at that time.
// Note: Markup tokens are identified before tokenizing.

// symbols used for type of token AND to access TokenTypeList array
export const enum TokenLiteral { // literals used as comparators
  APOSTROPHE = "'", // for possessives and contractions
  ATSIGN = "@", // for emailaddress
  COLON = ":", // for time
  COMMA = ",", // for numbers
  DASH = "-", // for phone numbers
  DOUBLEQUOTE = '""',
  DOT = ".", // for decimals, doman names
  EXCLAMATION = "!", // for image
  FORWARDSLASH = "/",
  LPAREN = "(", // for phone numbers
  RPAREN = ")", // for phone numbers
  LBRACKET = "[",
  RBRACKET = "]",
  LANGLEBRACKET = "<",
  RANGLEBRACKET = ">",
  UNDERSCORE = "_",
  USDSIGN = "$", // for US currency
  PERCENTSIGN = "%",
  PLUSSIGN = "+",
  LESSTHANSIGN = "<",
  GREATERTHANSIGN = ">",
  EQUALSIGN = "=",
  AMPERSAND = "&",
  NUMBERSIGN = "#",
  DEGREE = "\u00B0",
  DEGREES_C = "\u00B0C",
  DEGREES_F = "\u00B0F"
}
export const enum TokenType {
  WORD = 0,
  MLTAG,
  MLTAG_END,
  NUMBER,
  PUNCTUATION,
  WHITESPACE,
  MLTAG_SELFCLOSING,
  SYMBOL,
  TBD
}
export const enum TokenLabelType { // must correspond to TokenType
  WORD = "WORD",
  SYMBOL = "SYMBOL",
  MLTAG = "MLTAG",
  MLTAG_END = "MLTAG_END",
  NUMBER = "NUMBER",
  NUMERALS = "NUMERALS",
  PUNCTUATION = "PUNCTUATION", // unhandled lexical punctuation
  WHITESPACE = "WHITESPACE",
  MLTAG_SELFCLOSING = "MLTAG_SELFCLOSING",
  TBD = "TBD"
}
// these "markups" identify special content that require special semantic
// processing  form proper terms not recognized by speech recognition engine
// if not properly tokenized.
// For instance, the term 3/14/21 should listen for March 3rd 2021...and
// not just three, forteen, twenty-one.
export const enum MarkupTokenType { // labels used for markup in interim output
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
  IMAGE,
  LINK,
  NUMBER_WITHCOMMAS
  // NUMERALS
}
// used as markup labels for intermediate serialization between tokenizing and
// parsing. Markdown labels (e.g., strong, em fillin) require explicit close
// tags because markdown close tags are already embedded within markdown
// inputs
export const enum MarkupLabelType {
  CONTRACTION = "<contraction>",
  USD = "<usd>",
  DATE1 = "<date1>",
  DATE2 = "<date2>",
  DATE3 = "<date3>",
  EMAILADDRESS = "<emailaddress>",
  IMAGE = "<image>",
  LINK = "<link>",
  NUMBER_WITHCOMMAS = "<numberwcommas>",
  NUMERALS = "<numerals>",
  PHONENUMBER = "<telephone number>",
  TIME = "<time>",
  TOKEN = "<explicittoken>", // <token>

  // for markdowns
  FILLIN = "<fillin>",
  CUELIST = "<cuelist>",
  CUELIST_CLOSE = "</cuelist>",

  // passthru markdowns
  STRONG = "<strong>",
  EM = "<em>",
  STRONG_CLOSE = "</strong>",
  EM_CLOSE = "</em>"
  // PASSTHRU = "<passthru>"
  //  STRONG_EM_OPEN = "<em><strong>",
  //  STRONG_EM_CLOSE = "</em></strong>"
}
// export const enum MarkdownMarkupLabelType {
//   EM_OPEN = "<em>",
//   EM_CLOSE = "</em>",
//   FILLIN_OPEN = "<fillin>",
//   FILLIN_CLOSE = "</fillin>",
//   STRONG_OPEN = "<strong>",
//   STRONG_CLOSE = "</strong>",
// }

interface TokenItemType {
  type: TokenType;
  label: TokenLabelType;
  pattern: RegExp;
}
interface MarkupTokenItemType {
  type: MarkupTokenType;
  label: MarkupLabelType;
  pattern: RegExp;
}
interface TokenJson {
  TOK: string;
  TYP: string;
  //  POS: number,
  LEN: number;
}
type TokenDictionaryType = Record<TokenType, TokenItemType>;
const TokenDictionary: TokenDictionaryType = {
  [TokenType.WORD]: {
    type: TokenType.WORD,
    label: TokenLabelType.WORD,
    pattern: /([A-Za-z]+)/
  },
  [TokenType.NUMBER]: {
    type: TokenType.NUMBER,
    label: TokenLabelType.NUMBER,
    pattern: /([0-9]+)/
  },
  [TokenType.SYMBOL]: {
    type: TokenType.SYMBOL,
    label: TokenLabelType.SYMBOL,
    pattern: /([@#%&\+])/
  },
  [TokenType.PUNCTUATION]: {
    type: TokenType.PUNCTUATION,
    label: TokenLabelType.PUNCTUATION,
    pattern: /([,.\/$\^\*;:{}=\-_'~()\"\?\.!])/
  },
  [TokenType.MLTAG]: {
    type: TokenType.MLTAG,
    label: TokenLabelType.MLTAG,
    pattern: /(<[\w\s="/.':;#-\/\?]+>)/
  },
  [TokenType.MLTAG_END]: {
    type: TokenType.MLTAG_END,
    label: TokenLabelType.MLTAG_END,
    pattern: /(<[\w\s="/.':;#-\/\?]+>)/
  },
  [TokenType.WHITESPACE]: {
    type: TokenType.WHITESPACE,
    label: TokenLabelType.WHITESPACE,
    pattern: /(<[\w\s="/.':;\-\/\?]+>)/
  },
  [TokenType.MLTAG_SELFCLOSING]: {
    type: TokenType.MLTAG_SELFCLOSING,
    label: TokenLabelType.MLTAG_SELFCLOSING,
    pattern: /(<[\w\s="/.':;#-\/\?]+\/>)/
  },
  [TokenType.TBD]: {
    type: TokenType.TBD,
    label: TokenLabelType.TBD,
    pattern: /(<[\w\s="/.':;#-\/\?]+>)/
  }
};
const TokenizingPatternSource: string =
  TokenDictionary[TokenType.WORD].pattern.source +
  "|" +
  TokenDictionary[TokenType.NUMBER].pattern.source +
  "|" +
  TokenDictionary[TokenType.SYMBOL].pattern.source +
  "|" +
  TokenDictionary[TokenType.PUNCTUATION].pattern.source +
  "|" +
  TokenDictionary[TokenType.MLTAG].pattern.source +
  "|" +
  TokenDictionary[TokenType.MLTAG_END].pattern.source +
  "|" +
  TokenDictionary[TokenType.MLTAG_SELFCLOSING].pattern.source;

type MarkupTokenDictionaryType = Record<MarkupTokenType, MarkupTokenItemType>;
const MarkupTokenDictionary: MarkupTokenDictionaryType = {
  [MarkupTokenType.USD]: {
    type: MarkupTokenType.USD,
    label: MarkupLabelType.USD,
    pattern: /(?<=^|\W|\[|\()\$(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d\d)?(?=\s|\W|$|[.!?\\-])/g
    // with 1st capturing group: (?<=^|\W|\[|\()(\$([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d)(\.\d\d)?)(?=\s|\W|$|[.!?\\-])
  },
  [MarkupTokenType.EMAILADDRESS]: {
    type: MarkupTokenType.EMAILADDRESS,
    label: MarkupLabelType.EMAILADDRESS,
    pattern: /(?<=^|\W|\[|\()([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})(?=(?=\s|\W|$|[.!?\\-]))/g
    //  with 1st capturing group (?<=^|\W|\[|\()([a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]+\.[a-zA-Z]{2,5})(?=(?=\s|\W|$|[.!?\\-]))
  },
  [MarkupTokenType.PHONENUMBER]: {
    type: MarkupTokenType.PHONENUMBER,
    label: MarkupLabelType.PHONENUMBER,
    pattern: /(?<=^|\W|\[_|\(\_)\((\d{3}\)\s\d{3}-\d{4})(?=\_]|\W|$)/g
    //  with 1st capturing group SAME AS ABOVE
  },
  [MarkupTokenType.TIME]: {
    type: MarkupTokenType.TIME,
    label: MarkupLabelType.TIME,
    pattern: /(?<=^|\W|\[|\()([0-9]|[0-1][0-9]|[2][0-3]):([0-5][0-9])(?=(\W|$))/g
    // with 1st capturing group ((0?[1-9]|1[0-2]):([0-5]\d)\s?((?:A|P)\.?M\.?))
  },
  [MarkupTokenType.DATE1]: {
    type: MarkupTokenType.DATE1,
    label: MarkupLabelType.DATE1,
    pattern: /(?<=^|\W|\[|\(|_)()((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember))?))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\s*(Jan(\.|(uary))?|Feb(\.|(ruary))?|Ma(r(\.|(ch))?|y)|Apr(\.|(il))?|Jun(\.|(e))?|Jul(\.|(y))?|Aug(\.|(ust))?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(\.|(ember))?)\ ((1[6-9]|[2-9]\d)\d{2})(?=[\s\.,\?\!)_]|$)/g //DD MMM YYYY
    // with 1st capturing group: (?<=^|\W|\[|\()(((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\s*(Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)\ ((1[6-9]|[2-9]\d)\d{2}))(?=[\s\.,\?\!]|$)
  },
  [MarkupTokenType.DATE2]: {
    type: MarkupTokenType.DATE2,
    label: MarkupLabelType.DATE2,
    pattern: /(?<=^|\W|\[|\()(Jan(.|(uary))?|Feb(.|(ruary))?|Ma(r(.|(ch))?|y)|Apr(.|(il))?|Jul(.|(y))?|Jun(.|(e))?|Aug(.|(ust))?|Oct(.|(ober))?|(Sep(?=\b|t)t?|Nov|Dec)(.|(ember))?)\ ((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\s*(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8]),[\s]*((1[6-9]|[2-9]\d)\d{2})(?=(\W|$))/g //MMM* DD,YYYY
  },
  [MarkupTokenType.DATE3]: {
    type: MarkupTokenType.DATE3,
    label: MarkupLabelType.DATE3,
    pattern: /(?<=^|\W|\[|\()((Jan(.|(uary))?|Feb(.|(ruary))?|Ma(r(.|(ch))?|y)|Apr(.|(il))?|Jul(.|(y))?|Jun(.|(e))?|Aug(.|(ust))?|Oct(.|(ober))?|(Sep(?=\b|t)t?|Nov|Dec)(.|(ember))?)\ ((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\s*(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8]))(?!,|[1-9])(?=[\s\.,\?\!]|$)/g //MMM* DD\
  },
  [MarkupTokenType.CONTRACTION_D]: {
    type: MarkupTokenType.CONTRACTION_D,
    label: MarkupLabelType.CONTRACTION,
    pattern: /(?<=^|\s|\[|\(|^$)([A-Za-z]+)\'d(?=\s|\W|$|[.!?\\-])/g
  },
  [MarkupTokenType.CONTRACTION_LL]: {
    type: MarkupTokenType.CONTRACTION_LL,
    label: MarkupLabelType.CONTRACTION,
    pattern: /(?<=^|\s|\[|\(|^$)([A-Za-z]+)\'ll(?=\s|\W|$|[.!?\\-])/g
  },
  [MarkupTokenType.CONTRACTION_M]: {
    type: MarkupTokenType.CONTRACTION_M,
    label: MarkupLabelType.CONTRACTION,
    pattern: /(?<=^|\s|\[|\(|^$)I\'m(?=\s|\W|$|[.!?\\-])/g
  },
  [MarkupTokenType.CONTRACTION_RE]: {
    type: MarkupTokenType.CONTRACTION_RE,
    label: MarkupLabelType.CONTRACTION,
    pattern: /(?<=^|\W|\[|\(|^$)(([Yy]ou|[Ww]e|[Tt]hey|[Ww]hat)\'re)(?=\s|\W|$|[.!?\\-])/g
  },
  [MarkupTokenType.CONTRACTION_NT]: {
    type: MarkupTokenType.CONTRACTION_NT,
    label: MarkupLabelType.CONTRACTION,
    pattern: /(?<=^|\W|\[|\(|^$)([Ii]s|[Aa]re|[Ww]as|[Ww]ere|[Hh]ave|[Hh]as|[Hh]ad|[Ww]o|[Ww]ould|[Dd]o|[Dd]oes|[Dd]id|[Cc]a|[Cc]ould|[Ss]hould|[Mm]igh|[Mm]ust])n\'t(?=\s|\W|$|[.!?\\-])/g
  },
  [MarkupTokenType.CONTRACTION_S]: {
    type: MarkupTokenType.CONTRACTION_S,
    label: MarkupLabelType.CONTRACTION,
    pattern: /(?<=^|\s|\[|\[_|\(|^$)([A-Za-z]+\'s)(?=\s|\W|$|[.!?\-_\]])/g // also includes possessives
  },
  [MarkupTokenType.CONTRACTION_VE]: {
    type: MarkupTokenType.CONTRACTION_VE,
    label: MarkupLabelType.CONTRACTION,
    pattern: /(?<=^|\s|\[|\(|^$)(I|[Yy]ou|[Ww]e|[Tt]hey|[Ss]hould|[Cc]ould|[Ww]ould|[Mm]ight|[Mm]ust)\'ve(?=\s|\W|$|[.!?\\-])/g
  },
  // [MarkupTokenType.NUMERALS]: {
  //   type: MarkupTokenType.NUMERALS,
  //   label: MarkupLabelType.NUMERALS,
  //   pattern: /(?<=^|\s|\[|\(|^$)(#(\d+)#)(?=\s|\W|$|[.!?\\-])/g
  //   // scan for token that require potential markup tags
  // },
  [MarkupTokenType.NUMBER_WITHCOMMAS]: {
    type: MarkupTokenType.NUMBER_WITHCOMMAS,
    label: MarkupLabelType.NUMBER_WITHCOMMAS,
    pattern: /(?<=^|\s|\[|\(|^$)(\d{0,3},)?(\d{3},)*(\d{1,3},\d{3})(?=\s|\W|$|[.!?\\-])/g
    // scan for token that require potential markup tags
  },
  [MarkupTokenType.IMAGE]: {
    type: MarkupTokenType.IMAGE,
    label: MarkupLabelType.IMAGE,
    //    pattern: /(?<=^|\W)(!\[)([a-zA-Z0-9 _\-\.!]+\])(\(.+\))/g
    pattern: /(!\[)([a-zA-Z0-9 _\-\.!]+\])(\([^\(]*\))/g
    // lookbehind must be preceded by beginning of line or any word
  },
  [MarkupTokenType.LINK]: {
    type: MarkupTokenType.LINK,
    label: MarkupLabelType.LINK,
    pattern: /(?<!\!)(\[.+\])(\([^\(]*\))/g
    // (["'\(\[]?|\!\[|\[\()
    // scan for token that require potential markup tags [link name](url)
  }
};
export const enum MarkdownIndexType {
  // defines order of markdown replacement e.g., FILLIN processed first.
  FILLIN = 0,
  CUELIST,
  EM,
  NUMERALS,
  STRONG
}
export const enum MarkdownTokenType {
  CUELIST,
  FILLIN,
  EM,
  NUMERALS,
  STRONG
  // STRONG_EM_OPEN,
  // STRONG_EM_CLOSE
}
interface MarkdownTokenItemType {
  type: MarkdownTokenType;
  //  markdown: MarkdownLabelType;
  label: MarkupLabelType;
  pattern: RegExp;
}
const enum MarkdownLabelType {
  EM = "**",
  FILLIN_OPEN = "[_",
  FILLIN_CLOSE = "_]",
  STRONG = "*",
  STRONG_EM = "***", // cannot handle this combined tag. See below
  CUELIST_OPEN = "=(",
  CUELIST_CLOSE = ")"
}
type MarkdownTokenDictionaryType = Record<
  MarkdownIndexType,
  MarkdownTokenItemType
>;
const MarkdownTokenDictionary: MarkdownTokenDictionaryType = {
  [MarkdownIndexType.FILLIN]: {
    type: MarkdownTokenType.FILLIN,
    label: MarkupLabelType.FILLIN,
    pattern: /(?<=\s|^|[\.,!'"])\[_((\<\w+( \w+)*\>){0,1}(\w|\s|[',:\-\(\)@_\.#\$])*((<(\/\w+( \w+)*\>)){0,1}))_](?=$|\s|[\.,!"\?])/g
    //       /(?<=\s|^|[\.,!'"])\[_(((\<(\w+)\>){0,1}((\w|\s|[',:\-\(\)@_\.#\$])+))(\<(\/\w+)\>){0,1})_\](?=$|\s|[\.,!"\?])/g

    // expanded \w+ with just about anything pattern.+ because special parse types are too complex
    // patterns are too complex.
    //1/13/2023
    // pattern: /(?<=\s|^|[\.,!'"])\[_((\w+)(=\(([\w\s,]+){0,1}\))*)_\](?=$|\s|[\.,!"\?])/g
    // pattern: /(?<=\s|^|[\.,!'"])\[_((\w+)(=\((\w+|\s|,)*\)){0,1})_\](?=$|\s|[\.,!"\?])/g
    // pattern: /(?<=\s|^|[\.,!'"])\[_((\w|[\s"'\/\-\(\)\@\.,\:;\$\<\>%!])+)_\](?=$|\s|[\.,!"\?])/g
    //    markdown: MarkdownLabelType.FILLIN_OPEN
  },
  [MarkdownIndexType.CUELIST]: {
    type: MarkdownTokenType.CUELIST,
    label: MarkupLabelType.CUELIST,
    pattern: /(?<=\w)=\(((\w+|\s|,|POS:|DEF:)*)\)(?=$|\s|<\/|\*|_]|[\.,!"\?])/g
    // pattern: /(?<=\s|^|[\.,!'"])\[_((\w|[\s"'\/\-\(\)\@\.,\:;\$\<\>%!])+)_\](?=$|\s|[\.,!"\?])/g
    //    markdown: MarkdownLabelType.FILLIN_OPEN
  },
  [MarkdownIndexType.NUMERALS]: {
    type: MarkdownTokenType.NUMERALS,
    label: MarkupLabelType.NUMERALS,
    pattern: /(?<=^|\s|\[|\(|^$)#(\d+)#(?=\s|\W|$|[.!?\\-])/g
    // scan for token that require potential markup tags
  },
  [MarkdownIndexType.EM]: {
    type: MarkdownTokenType.EM,
    label: MarkupLabelType.EM,
    pattern: /(?<=\s|^|[\.,!'"])\*\*((\w|[\s"'\/\-\(\)\_\@\.,\:;\$\<\>])+)\*\*(?=$|\s|[\.,!"\?])/g
    //    markdown: MarkdownLabelType.EM
  },
  [MarkdownIndexType.STRONG]: {
    type: MarkdownTokenType.STRONG,
    label: MarkupLabelType.STRONG,
    pattern: /(?<=\s|^|[\.,!'"])\*((\w|[\s"'\/\-\(\)\_\@\.,\:;\$\<\>])+)\*(?=$|\s|[\.,!"\?])/g
    //    markdown: MarkdownLabelType.STRONG
  }
  ///////////////////////////////////////////////////////////////////////////
  // Combined ***:
  // CANNOT define what is the closing tag for *** because it may not be ***
  // but could be \*(.*)\*\* and vice versa.
  ///////////////////////////////////////////////////////////////////////////

  // [MarkdownTokenType.STRONG_EM_OPEN]: {
  //   type: MarkdownTokenType.STRONG_EM_OPEN,
  //   label: MarkupLabelType.STRONG_EM_OPEN,
  //   pattern: /(?<=\s|^|[\.,!'"])\*\*\*((\w|[\s"'\/\-\(\)\_\@\.,\:;\$\<\>])+))/g
  //   //    markdown: MarkdownLabelType.STRONG
  // },
  // [MarkdownTokenType.STRONG_EM_CLOSE]: {
  //   type: MarkdownTokenType.STRONG_EM_CLOSE,
  //   label: MarkupLabelType.STRONG_EM_CLOSE,
  //   pattern: /(?<=\s|^|[\.,!'"])\*\*\*((\w|[\s"'\/\-\(\)\_\@\.,\:;\$\<\>])+)\*(?=$|\s|[\.,!"\?])/g
  //   //    markdown: MarkdownLabelType.STRONG
  // }
};
export type TokenListType = Array<Token>;

// Tokens that do not follow standard tokenizing where markups must be inserted
export class Tokenizer {
  readonly logger: Logger;
  readonly parent: any;
  readonly tokenizingPattern: RegExp;
  constructor(parent: any) {
    this.parent = parent;
    this.logger = new Logger(this);
    this.tokenizingPattern = new RegExp(TokenizingPatternSource, "g");
  }
  tokenize(sentence: string): TokenListType {
    // matches token pattern without whitespace instead of using delimited
    // whitespace.
    let tokenOnlyList: RegExpMatchArray | null;
    let tokenList: TokenListType = []; // to be returned including whitespace
    let currentPos: number = 0;
    //  this.logger.diagnosticMode = true;
    try {
      // Goal: Tokenize while preserving whitespace. Compare original string
      // with array of non-whitespace tokens, tokensOnly and extract and
      // insert whitespace between non-whitespace tokens.
      tokenOnlyList = sentence.match(this.tokenizingPattern); // token list without whitespace
      if (tokenOnlyList === null) {
        return [];
      }
      for (let tokenOnly of tokenOnlyList) {
        let tokenPos: number = sentence.indexOf(tokenOnly, currentPos);
        if (currentPos < tokenPos) {
          // positioned before token: whitespace
          let prefix: string = sentence.substring(currentPos, tokenPos);
          tokenList.push(
            new Token(
              prefix,
              TokenType.WHITESPACE,
              currentPos,
              tokenPos - currentPos
            )
          );
          currentPos = tokenPos; // position beyond prefixed whitespace
        }
        if (currentPos === tokenPos) {
          // positioned at token: whitespace before token
          tokenList.push(
            new Token(
              tokenOnly,
              this.tokenType(tokenOnly),
              currentPos,
              tokenOnly.length
            )
          );
          currentPos = tokenPos + tokenOnly.length; // positioned beyond token
        } else {
          //SHOULD THROW EXCEPTION
          throw new Error(
            `Tokenizer.tokenize(): string.match(regexp) returned ` +
              `a token that is not found in the string.`
          ); // EXCEPTIONAL
        }
      } // for-of
      if (currentPos === sentence.length) {
        //EOL
      } else if (currentPos < sentence.length) {
        // positioned at trailing whitespace
        let postfix: string = sentence.substring(currentPos, sentence.length);
        tokenList.push(
          new Token(
            postfix,
            TokenType.WHITESPACE,
            currentPos,
            sentence.length - currentPos
          )
        );
      } else {
        throw new Error(
          `Tokenizer.tokenize(): currentPos=${currentPos} is ` +
            `positioned beyond end of string {${sentence}}`
        ); // EXCEPTIONAL
      }
      this.logger.diagnostic(this.serialize(tokenList));
      return tokenList;
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(
          `Tokenizer.tokenize() caught/rethrew exception - ${e.message}`
        );
      } else {
        throw e;
      }
      throw e;
    } // catch
  } //tokens method
  reset() {
    // reentrant object should not require reset of state
  }
  addMarkupTags(sentence: string): string {
    let result: string = sentence;
    /// this.logger.diagnosticMode = true;
    try {
      result = this.insertMarkupTags(sentence);
      // console.log(`insertMarkupTags=${result}`);
      result = this.replaceMarkdownTags(result);
      // console.log(`replaceMarkdownTags=${result}`);
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(
          `Tokenizer.insertMarkupTags(): Caught exception - ${e.message}`
        );
      } else {
        throw e;
      }
    } finally {
      return result;
    }
  }
  insertMarkupTags(sentence: string): string {
    let result: string = sentence;
    let markupTokenItem: MarkupTokenItemType;
    let tokenList: RegExpMatchArray | null;
    for (let key in MarkupTokenDictionary) {
      let key1: any = key as unknown; //ugh
      markupTokenItem = MarkupTokenDictionary[<MarkupTokenType>key1];
      let markupTokenLength: number = markupTokenItem.label.length;
      //tokenList = sentence.match(markupTokenItem.pattern); // with global flag set
      tokenList = result.match(markupTokenItem.pattern); // with global flag set
      //Consider using pattern.exec
      if (tokenList !== null) {
        let startPos = 0;
        let tokenPos = 0;
        tokenList.forEach((token: string) => {
          // indexOf works iff token found via pattern can be definitively
          // found within the substring. Counterexample, the pattern ()?<=\w)\*
          // only matches the strong closing tag markdown symbol but the
          // indexof("*") will match any * in the string. If this becomes an issue, this string.match() should be replaced with regex.exec().
          tokenPos = result.indexOf(token, startPos);
          if (tokenPos < 0) {
            // Found in tokenlist by match(regexp) but not found by indexOf
            this.logger.error(
              `{${token}} not found in string after position=${startPos}`
            );
            // should throw exception
          } else if (
            tokenPos >= markupTokenLength &&
            result
              .substr(tokenPos - markupTokenLength, markupTokenLength)
              .toLowerCase() === markupTokenItem.label.toLowerCase()
          ) {
            this.logger.warning(
              `{${token}} already tagged as ${markupTokenItem.label}.`
            );
          } //if (markupTokenItem.markdown.length === 0) {
          // splice in the markup tags
          else {
            result =
              result.slice(0, tokenPos) + // portion of sentence before token
              markupTokenItem.label +
              token +
              endMarkupTag(markupTokenItem.label) +
              result.slice(tokenPos + token.length); // portion of sentence after token
            startPos =
              markupTokenLength +
              tokenPos +
              token.length +
              endMarkupTag(markupTokenItem.label).length +
              1;
          }
        });
      } else {
        //          console.log("no matches on "+appSpecificTag.label);
      }
    }
    return result;
  }
  replaceMarkdownTags(sentence: string): string {
    // differs from addMarkupTags because the existing open and
    // closing markdown tags are being replaced together whereas the above
    // insertMarkupTags() method recognizes patterns within non-delimited
    // prose e.g., contractions and ADDS tags before the parsing begins

    // This algorithm ignors *** combined, juncstapositioned markdown tags
    // e.g., ***
    let markdownTokenItem: MarkdownTokenItemType;
    let matchedToken: RegExpExecArray | null;
    // console.log(`insidereplaceMarkdown:sentence1 ${sentence}`);
    for (let key in MarkdownTokenDictionary) {
      let key1: any = key as unknown; //ugh
      markdownTokenItem = MarkdownTokenDictionary[<MarkdownTokenType>key1];
      while (
        // multiple occurrences
        (matchedToken = markdownTokenItem.pattern.exec(sentence)) !== null
      ) {
        // console.log(
        //   `insidereplaceMarkdown:matchedToken.index ${matchedToken.index}`
        // );
        // console.log(`insidereplaceMarkdown:matchedToken[0] ${matchedToken[0]}`);
        // console.log(`insidereplaceMarkdown:matchedToken[1] ${matchedToken[1]}`);
        // substitution code being careful of lastIndex
        sentence =
          sentence.substr(0, matchedToken.index) +
          markdownTokenItem.label +
          matchedToken[1] +
          endMarkupTag(markdownTokenItem.label) +
          sentence.substr(matchedToken.index + matchedToken[0].length);
      }
    }
    // console.log(`insidereplaceMarkdown:sentence2 ${sentence}`);
    return sentence;
  }
  serialize(tokenList: TokenListType) {
    var tokenString = "";
    tokenList.forEach(
      token => (tokenString = tokenString + `{${token.content}}`)
    );
    return tokenString;
  }
  serializeAsTable(
    tokenList: TokenListType,
    col1?: number,
    col2?: number,
    col3?: number
  ): string {
    var tokenString = "\n";
    tokenList.forEach(
      token =>
        (tokenString =
          tokenString + token.serializeColumnar(col1, col2, col3) + "\n")
    );
    tokenString = tokenString.slice(0, -1);
    return tokenString;
  }
  serializeForUnitTest(tokenList: TokenListType): string {
    let tokenJson: TokenJson = { TOK: "", TYP: "", LEN: 0 };
    let tokenListString: string = "";
    tokenList.forEach(token => {
      tokenListString = tokenListString + token.serializeForUnitTest(tokenJson);
    });
    return tokenListString;
  }
  tokenType(tokenContent: string): TokenType {
    let type: TokenType;
    if (tokenContent.match(TokenDictionary[TokenType.MLTAG].pattern)) {
      if (tokenContent.substring(1, 2) === TokenLiteral.FORWARDSLASH) {
        type = TokenType.MLTAG_END;
      } else if (tokenContent.slice(-2, -1) === TokenLiteral.FORWARDSLASH) {
        // should use regExp pattern
        type = TokenType.MLTAG_SELFCLOSING;
      } else {
        type = TokenType.MLTAG;
      }
    } else if (tokenContent.match(TokenDictionary[TokenType.SYMBOL].pattern)) {
      type = TokenType.SYMBOL;
    } else if (
      tokenContent.match(TokenDictionary[TokenType.PUNCTUATION].pattern)
    ) {
      type = TokenType.PUNCTUATION;
    } else if (tokenContent.match(TokenDictionary[TokenType.NUMBER].pattern)) {
      type = TokenType.NUMBER;
    } else if (tokenContent.match(TokenDictionary[TokenType.WORD].pattern)) {
      type = TokenType.WORD;
    } else {
      type = TokenType.TBD; // catch all but should apply word pattern
    }
    return type;
  }
  unitTest(actual: string, expected: string): boolean {
    //return this.serializeForUnitTest(actual) === expected;
    return actual === expected;
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
  constructor(
    content: string,
    type: TokenType,
    position: number,
    length: number
  ) {
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
  serializeColumnar(
    colWidth1?: number,
    colWidth2?: number,
    colWidth3?: number
  ) {
    switch (arguments.length) {
      case 0:
        colWidth1 = this.content.length + 1;
      case 1:
        colWidth2 = this.content.length + 7; // 7 = string labels length
      case 2:
        colWidth3 = this.position + this.length + 3; // 3 = string formatting length
    }
    return (
      `{${this.content}}`.padEnd(colWidth1! - 2) +
      `(type:${TokenDictionary[this.type].label})`.padEnd(
        colWidth2! - TokenDictionary[this.type].label.toString().length - 7
      ) +
      `(${this.position.toString()},${this.length.toString()})`.padEnd(
        colWidth3!
      )
    );
  }
  serializeForUnitTest(tokenJson: TokenJson) {
    tokenJson.TOK = this.content;
    tokenJson.TYP = TokenDictionary[this.type].label;
    //    tokenJson.POS = this.position;
    tokenJson.LEN = this.length;
    return JSON.stringify(tokenJson);
  }
} // Token class
export function isValidMarkupTag(tag: string): boolean {
  // should apply match with patterns
  return (
    tag.length > 2 &&
    tag.slice(0, 1) === TokenLiteral.LANGLEBRACKET &&
    tag.slice(-1) === TokenLiteral.RANGLEBRACKET
  );
}
export function endMarkupTag(tag: MarkupLabelType | string): string {
  return isValidMarkupTag(tag) ? tag.slice(0, 1) + "/" + tag.slice(1) : "";
}
