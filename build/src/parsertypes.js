'use strict';
const ContentNodeType = {
    WORD: 'WORD',
    DATE: 'DATE',
    TIME: 'TIME',
    WHITESPACE: 'WHITESPACE',
    MLSELFCLOSINGTAG: 'HTMLSELFCLOSINGTAG',
    // Requires semantic analysis to recombine WORD+, PUNCTUATIONS+
    EMAILADDRESS: 'EMAILADDRESS',
    URL: 'URL',
    STREETNUMBER: 'STREETNUMBER',
    POSSESSIVE: 'POSSESSIVE',
    PHONENUMBER: 'PHONENUMBER',
    CONTRACTION: 'CONTRACTION',
    TOKEN: 'TOKEN',
    USD: 'USD',
    NUMBER: 'NUMBER',
    DECIMAL: 'DECIMAL',
    TITLE: 'TITLE',
    // These HTMLtags and attributes will be propagated for FORMATTING ONLY
    MLSTARTTAG: 'MLSTARTTAG',
    MLENDTAG: 'MLENDTAG',
    MLTAG: "MLTAG",
    MLSELFCLOSINGTAG: 'HTMLSELFCLOSINGTAG',
    HTMLSTARTTAG: "HTMLSTARTTAG",
    HTMLENDTAG: "HTMLENDTAG",
    HTMLATTRLIST: 'HTMLATTRLIST',
    HTMLSELFCLOSINGTAG: 'HTMLTAG_SELFCLOSE',
    PUNCTUATION: 'PUNCTUATION',
    TBD: 'TBD',
    WORD: 'WORD'
};
module.exports = { ContentNodeType };