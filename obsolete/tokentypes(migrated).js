/*******************************************
 * Reading Monitor v2.0
 * (c) 2017, 2018, 2019, 2020 by Wen Eng. All rights reserved.
 ********************************************/
'use strict';
 const TokenType = { // symbols used for type definition
  CONTRACTION: 'MLTAG.CONTRACTION',
  USD: 'MLTAG.USD',
  USD_END: 'MLTAG.USDCURRENCY_END',
  DATE1: 'MLTAG.DATE1',
  DATE2: 'MLTAG.DATE2',
  DATE3: 'MLTAG.DATE3',
  DATE_END: 'MLTAG.DATE_END',
  EMAILADDRESS: 'MLTAG_EMAILADDRESS',
  EMAILADDRESS_END: 'MLTAG.EMAILADDRESS_END',
  FILLIN: 'MLTAG.FILLIN',
  FILLIN_END: 'MLTAG.FILLINTAG_END',
  NUMBER: 'NUMBER',
  NUMBER_WITHCOMMAS: 'MLTAG.NUMBER_WITHCOMMAS',
  NUMBER_WITHCOMMAS_END: 'MLTAG.NUMBER_WITHCOMMASEND',
  MLTAG: 'MLTAG',
  MLTAG_END: 'MLTAG_END',
  MLTAG_SELFCLOSING: 'MLTAG_SELFCLOSING',
  PHONENUMBER: 'MLTAG.PHONENUMBER',
  PHONENUMBER_END: 'MLTAG.PHONENUMBER_END',
  PUNCTUATION: 'PUNCTUATION', // unhandled lexical punctuation
  PUNCTUATION_APOSTROPHE: 'PUNCTUATION.APOSTROPHE', // for possessives and contractions
  PUNCTUATION_ATSIGN: 'PUNCTUATION.ATSIGN', // for emails voice recognizes "at"
  PUNCTUATION_COLON: 'PUNCTUATION.COLON', // for time
  PUNCTUATION_COMMA: 'PUNCTUATION.COMMA', // for numbers
  PUNCTUATION_DASH: 'PUNCTUATION.DASH', // for phone numbers
  PUNCTUATION_DOT: 'PUNCTUATION.DOT', // for decimals
  PUNCTUATION_DOUBLEQUOTE: 'PUNCTUATION.DOUBLEQUOTE',
  PUNCTUATION_FORWARDSLASH: 'PUNCTUATION_FORWARDSLASH', // for dates, URLs
  PUNCTUATION_LPAREN: 'PUNCTUATION.LPAREN', // for phone numbers
  PUNCTUATION_RPAREN: 'PUNCTUATION.RPAREN', // for phone numbers
  PUNCTUATION_USD: 'PUNCTUATION.USDSIGN', // for US currency
  TBD: 'TBD', // initial state
  TIME: 'MLTAG.TIME',
  TIME_END: 'MLTAG.TIME_END',
  TOKEN: 'MLTAG.EXPLICITTOKEN', // <token>
  TOKEN_END: 'MLTAG.EXPLICITTOKEN_END', // <token>
  UNHANDLED: '*****UNHANDLED*****',  // no explicit token type
  WORD: 'WORD',
  WHITESPACE: 'WHITESPACE'
};
const TokenTag = {  // literals used as comparators
  ATSIGN: '@',
  DATE1: '<date1>', // e.g., 03 Jan(uary) 2020
  DATE2: '<date2>', // e.g., Jan(uary) 3, 2020
  DATE3: '<date3>', // Jan(uary) 3
  CONTRACTION: '<contraction>', //
  CONTRACTION_D: '<contraction d>', // e.g., They'd
  CONTRACTION_LL: '<contraction ll>',
  CONTRACTION_M:  '<contraction m>',
  CONTRACTION_RE: '<contraction re>',
  CONTRACTION_S:  '<contraction s>',
  CONTRACTION_NT:  '<contraction nt>',
  CONTRACTION_VE: '<contraction ve>',
  POSSESSIVE_S:  '<possessive>', // handled by CONTRACTION_S
  EMAILADDRESS: '<emailaddr>',
  FILLIN: '<fillin>',
  FORWARDSLASH: '/',
  APOSTROPHE: "'", // for possessives and contractions
  COLON: ':', // for time
  COMMA: ',', // for numbers
  DASH: '-', // for phone numbers
  DOUBLEQUOTE: '""',
  DOT: '.', // for decimals, doman names
  LPAREN: '(', // for phone numbers
  NUMBER_WITHCOMMAS: '<numberwcommas>',
  RPAREN: ')', // for phone numbers
  LANGLEBRACKET: '<',
  PHONENUMBER: '<telephone number>',
  RANGLEBRACKET: '>',
  TBD:"",
  TIME: '<time>',
  TOKEN: '<token>',
  URL: '<url>',
  USD: '<usd>',
  USDSIGN: '$', // for US currency
  WORD: 'WORD'
};
const ParserNodeType = { // must be unique
  WORD: 'WORD',
  DATE: 'DATE',
  TIME: 'TIME',
  WHITESPACE: 'WHITESPACE',
  MLSELFCLOSINGTAG: 'HTMLSELFCLOSINGTAG',
  // Requires semantic analysis to recombine WORD+, PUNCTUATIONS+
  EMAILADDRESS: 'EMAILADDRESS',
  URL: 'URL',
  STREETNUMBER: 'STREETNUMBER', // 20680 pronounced "2","0","6","8","0"
  POSSESSIVE: 'POSSESSIVE',
  PHONENUMBER: 'PHONENUMBER',
  CONTRACTION: 'CONTRACTION',
  TOKEN: 'TOKEN', // EXPLICIT token <token>ABC</token> to escape further parsing
  USD: 'USD', // perhaps required to escape default pronunciation?
  NUMBER: 'NUMBER', // perhaps required to escape default pronunciation?
  DECIMAL: 'DECIMAL', // perhaps required to escape default pronunciation?
  TITLE: 'TITLE', // Mr. should be a single span ; should be special case of abbreviations

  // These HTMLtags and attributes will be propagated for FORMATTING ONLY
  MLSTARTTAG: 'MLSTARTTAG', //not necessarily HTML
  MLENDTAG: 'MLENDTAG',
  MLTAG: "MLTAG",
  MLSELFCLOSINGTAG: 'HTMLSELFCLOSINGTAG',
  HTMLSTARTTAG: "HTMLSTARTTAG",
  HTMLENDTAG: "HTMLENDTAG",
  HTMLATTRLIST: 'HTMLATTRLIST', // needed for propagation across span tree
  HTMLSELFCLOSINGTAG: 'HTMLTAG_SELFCLOSE', //not supported
  TBD: 'TBD',
  WORD: 'WORD'
};
const MarkupTokenTypeList1 = [
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
    pattern: /(?<=^|\W)((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\s*(Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)\ ((1[6-9]|[2-9]\d)\d{2})(?=\s)/g }, //DD MMM YYYY
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

function isValidMarkupTag(tag) {
  return ((tag.length > 2) && (tag.slice(0,1) === TokenTag.LANGLEBRACKET)
          && (tag.slice(-1)===TokenTag.RANGLEBRACKET));
};
export function endMarkupTag(tag) {
  let retValue = null;
  if (isValidMarkupTag(tag)) {
    retValue = tag.slice(0,1)+"/"+tag.slice(1);
  }
  return retValue;
}
module.exports = { TokenType, endMarkupTag, TokenTag };
