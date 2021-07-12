/*******************************************
 * Reading Monitor v2.0
 * (c) 2017, 2018, 2019, 2020, 2021 by Wen Eng. All rights reserved.
 ********************************************/
'use strict';
export const enum TokenType  {
  // symbols used for type of token AND to access TokenTypeList array
  WORD = 0,
  MLTAG,
  MLTAG_END,
  NUMBER,
  PUNCTUATION, // unhandled lexical punctuation
  WHITESPACE,
  MLTAG_SELFCLOSING
};
export const enum TokenLabelType {
  WORD = "WORD",
  MLTAG = "MLTAG",
  MLTAG_END = "MLTAG_END",
  NUMBER = 'NUMBER',
  PUNCTUATION = 'PUNCTUATION', // unhandled lexical punctuation
  WHITESPACE = 'WHITESPACE',
  MLTAG_SELFCLOSING = 'MLTAG_SELFCLOSING'
}
/*
enum PunctuationTokenType {
  PUNCTUATION_APOSTROPHE = 'PUNCTUATION.APOSTROPHE', // for possessives and contractions
  PUNCTUATION_ATSIGN = 'PUNCTUATION.ATSIGN', // for emails voice recognizes "at"
  PUNCTUATION_COLON = 'PUNCTUATION.COLON', // for time
  PUNCTUATION_COMMA = 'PUNCTUATION.COMMA', // for numbers
  PUNCTUATION_DASH = 'PUNCTUATION.DASH', // for phone numbers
  PUNCTUATION_DOT = 'PUNCTUATION.DOT', // for decimals
  PUNCTUATION_DOUBLEQUOTE = 'PUNCTUATION.DOUBLEQUOTE',
  PUNCTUATION_FORWARDSLASH = 'PUNCTUATION_FORWARDSLASH', // for dates, URLs
  PUNCTUATION_LPAREN = 'PUNCTUATION.LPAREN', // for phone numbers
  PUNCTUATION_RPAREN = 'PUNCTUATION.RPAREN', // for phone numbers
  PUNCTUATION_USD = 'PUNCTUATION.USDSIGN' // for US currency
}
*/
export enum TokenLiteral {  // literals used as comparators
  APOSTROPHE = "'", // for possessives and contractions
  ATSIGN = '@', // for emailaddress
  COLON = ':', // for time
  COMMA = ',', // for numbers
  DASH = '-', // for phone numbers
  DOUBLEQUOTE = '""',
  DOT = '.', // for decimals, doman names
  FORWARDSLASH = '/',
  LPAREN = '(', // for phone numbers
}
export enum MarkupTokenType  { // symbols used for type definition
  CONTRACTION = '<CONTRACTION>',
  USD = '<USD>',
  DATE = '<DATE>',
  DATE1 = '<DATE1>',
  DATE2 = '<DATE2>',
  DATE3 = '<DATE3>',
  EMAILADDRESS = '<EMAILADDRESS>',
  FILLIN = '<FILLIN>',
  NUMBER_WITHCOMMAS = '<NUMBER_WITHCOMMAS>',
  PHONENUMBER = '<PHONENUMBER>',
  TIME = '<TIME>',
  TOKEN = '<EXPLICITTOKEN>', // <token>
  UNHANDLED = '<UNHANDLED>',  // no explicit token type
};
/*
CONTRACTION = '<CONTRACTION>',
CONTRACTION_END = '</CONTRACTION>',
CURRENCY = '<CURRENCY>',
CURRENCY_END = '</CURRENCY>',
USD = '<USD>',
USD_END = '</USD>',
DATE = '<DATE>',
DATE_END = '</DATE>',
DATE1 = '<DATE1>',
DATE2 = '<DATE2>',
DATE3 = '<DATE3>',
EMAILADDRESS = '<EMAILADDRESS>',
EMAILADDRESS_END = '</EMAILADDRESS>',
FILLIN = '<FILLIN>',
FILLIN_END = 'MLTAG.FILLINTAG_END',
NUMBER_WITHCOMMAS = '<NUMBER_WITHCOMMAS>',
NUMBER_WITHCOMMAS_END = 'MLTAG.NUMBER_WITHCOMMASEND',
MLTAG_SELFCLOSING = '<SELFCLOSING>',
PHONENUMBER = '<PHONENUMBER>',
PHONENUMBER_END = '</PHONENUMBER>',
TBD = 'TBD', // initial state
TIME = '<TIME>',
TIME_END = '</TIME_END>',
TOKEN = '<EXPLICITTOKEN>', // <token>
TOKEN_END = '</EXPLICITTOKEN_END>', // <token>
UNHANDLED = '<UNHANDLED>',  // no explicit token type

*/
export type MarkupTokenSubtype = MarkupTokenDateSubType
  | MarkupTokenContractionSubType
  | MarkupTokenCurrencySubType;

enum MarkupTokenDateSubType {
  DATE1 = '<date1>', // e.g., 03 Jan(uary) 2020
  DATE2 = '<date2>', // e.g., Jan(uary) 3, 2020
  DATE3 = '<date3>', // Jan(uary) 3
}
enum MarkupTokenCurrencySubType {
  USD = '<usd>',
  EURO = '<euro>'
}
enum MarkupTokenContractionSubType {
  CONTRACTION_D = '<contraction d>', // e.g., They'd
  CONTRACTION_LL = '<contraction ll>',
  CONTRACTION_M =  '<contraction m>',
  CONTRACTION_RE = '<contraction re>',
  CONTRACTION_S =  '<contraction s>',
  CONTRACTION_NT =  '<contraction nt>',
  CONTRACTION_VE = '<contraction ve>'
}
export enum MarkupTokenTag {  // literals used as comparators
  DATE1 = '<date1>', // e.g., 03 Jan(uary) 2020
  DATE2 = '<date2>', // e.g., Jan(uary) 3, 2020
  DATE3 = '<date3>', // Jan(uary) 3
  CONTRACTION = '<contraction>', //
  POSSESSIVE_S =  '<possessive>', // handled by CONTRACTION_S
  EMAILADDRESS = '<emailaddr>',
  FILLIN = '<fillin>',
  NUMBER_WITHCOMMAS = '<numberwcommas>',
  RPAREN = ')', // for phone numbers
  LANGLEBRACKET = '<',
  PHONENUMBER = '<telephone number>',
  RANGLEBRACKET = '>',
  TBD = "",
  TIME = '<time>',
  TOKEN = '<token>',
  URL = '<url>',
  USD = '<usd>',
  USDSIGN = '$', // for US currency
  WORD = 'WORD'
};

enum ParserNodeType { // must be unique
  WORD = 'WORD',
  DATE = 'DATE',
  TIME = 'TIME',
  WHITESPACE = 'WHITESPACE',
  MLSELFCLOSINGTAG = 'HTMLSELFCLOSINGTAG',
  // Requires semantic analysis to recombine WORD+, PUNCTUATIONS+
  EMAILADDRESS = 'EMAILADDRESS',
  URL = 'URL',
  STREETNUMBER = 'STREETNUMBER', // 20680 pronounced "2","0","6","8","0"
  POSSESSIVE = 'POSSESSIVE',
  PHONENUMBER = 'PHONENUMBER',
  CONTRACTION = 'CONTRACTION',
  TOKEN = 'TOKEN', // EXPLICIT token <token>ABC</token> to escape further parsing
  USD = 'USD', // perhaps required to escape default pronunciation?
  NUMBER = 'NUMBER', // perhaps required to escape default pronunciation?
  DECIMAL = 'DECIMAL', // perhaps required to escape default pronunciation?
  TITLE = 'TITLE', // Mr. should be a single span ; should be special case of abbreviations

  // These HTMLtags and attributes will be propagated for FORMATTING ONLY
  MLSTARTTAG = 'MLSTARTTAG', //not necessarily HTML
  MLENDTAG = 'MLENDTAG',
  MLTAG = "MLTAG",
  HTMLSTARTTAG = "HTMLSTARTTAG",
  HTMLENDTAG = "HTMLENDTAG",
  HTMLATTRLIST = 'HTMLATTRLIST', // needed for propagation across span tree
  HTMLSELFCLOSINGTAG = 'HTMLTAG_SELFCLOSE', //not supported
  TBD = 'TBD'
};
function isValidMarkupTag(tag: TokenTag): boolean {
  return ((tag.length > 2) && (tag.slice(0,1) === TokenTag.LANGLEBRACKET)
          && (tag.slice(-1)===TokenTag.RANGLEBRACKET));
};
export function endMarkupTag(tag: TokenTag): string {
  return (isValidMarkupTag(tag) ? tag.slice(0,1)+"/"+tag.slice(1) : "");
}
module.exports = { TokenType, endMarkupTag, TokenTag };
