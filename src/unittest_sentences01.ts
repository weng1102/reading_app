export interface UnittestDataType {
  id: number;
  name: string;
  description: string;
  sections: UnittestSectionType[];
}
interface UnittestSectionType {
  id: number;
  name: string;
  //  description: string;
  //  expected: string;
  sentences: UnittestSentenceType[];
}
export interface UnittestSentenceType {
  id: number;
  content: string;
  expected: {
    tokenizer: string;
    parser: string;
    transformer: string;
  };
}
interface UnittestTokenType {
  // array of replaces expected:tokensizer: string
  tokenType: number;
  position: number;
  length: string;
}
interface UnittestParseNodeType {
  // array of replaces expected:[parser]: string
  pasrserNodeType: number;
  startPosition: number;
  endPosition: number; // should be length like token
}
const unittestdata: UnittestDataType = {
  id: 1,
  name: "Unit test 01",
  description: "",
  sections: [
    {
      id: 1,
      name: "testing date format",
      sentences: [
        {
          id: 0,
          content: "3/17/1983",
          expected: {
            tokenizer:
              '{"TOK":"3","TYP":"NUMBER","LEN":1}{"TOK":"/","TYP":"PUNCTUATION","LEN":1}{"TOK":"17","TYP":"NUMBER","LEN":2}{"TOK":"/","TYP":"PUNCTUATION","LEN":1}{"TOK":"1983","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"3/17/1983","terminals":[{"content":"3","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"/","type":6,"meta":{"punctuationType":""}},{"content":"17","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"/","type":6,"meta":{"punctuationType":""}},{"content":"1983","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content: "Nov. 11, 1992",
          expected: {
            tokenizer:
              '{"TOK":"<date2>","TYP":"MLTAG","LEN":7}{"TOK":"Nov","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"11","TYP":"NUMBER","LEN":2}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"1992","TYP":"NUMBER","LEN":4}{"TOK":"</date2>","TYP":"MLTAG_END","LEN":8}',
            parser:
              '{"content":"Nov. 11, 1992","terminals":[{"content":"Nov. 11, 1992","type":2,"meta":{"format":1,"month":{"content":"Nov","altpronunciation":"november","altrecognition":""},"punctuation1":{"content":".","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"11","altpronunciation":"11th","altrecognition":""},"punctuation2":{"content":",","altpronunciation":"","altrecognition":""},"whitespace2":{"content":" ","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"19","altpronunciation":"","altrecognition":""},"withinCentury":{"content":"92","altpronunciation":"","altrecognition":""}}}}]}',
            transformer: ""
          }
        },
        {
          id: 3,
          content: "1/1/2000",
          expected: {
            tokenizer:
              '{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":"/","TYP":"PUNCTUATION","LEN":1}{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":"/","TYP":"PUNCTUATION","LEN":1}{"TOK":"2000","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"1/1/2000","terminals":[{"content":"1","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"/","type":6,"meta":{"punctuationType":""}},{"content":"1","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"/","type":6,"meta":{"punctuationType":""}},{"content":"2000","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 4,
          content: "3-17-1983",
          expected: {
            tokenizer:
              '{"TOK":"3","TYP":"NUMBER","LEN":1}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"17","TYP":"NUMBER","LEN":2}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"1983","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"3-17-1983","terminals":[{"content":"3","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"-","type":6,"meta":{"punctuationType":""}},{"content":"17","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"-","type":6,"meta":{"punctuationType":""}},{"content":"1983","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 5,
          content: "9/21/2015",
          expected: {
            tokenizer:
              '{"TOK":"9","TYP":"NUMBER","LEN":1}{"TOK":"/","TYP":"PUNCTUATION","LEN":1}{"TOK":"21","TYP":"NUMBER","LEN":2}{"TOK":"/","TYP":"PUNCTUATION","LEN":1}{"TOK":"2015","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"9/21/2015","terminals":[{"content":"9","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"/","type":6,"meta":{"punctuationType":""}},{"content":"21","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"/","type":6,"meta":{"punctuationType":""}},{"content":"2015","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        }
      ]
    },
    {
      id: 2,
      name: "testing time format",
      sentences: [
        {
          id: 0,
          content: "1pm",
          expected: {
            tokenizer:
              '{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":"pm","TYP":"WORD","LEN":2}',
            parser:
              '{"content":"1pm","terminals":[{"content":"1","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"pm","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 1,
          content: "2 p.m.",
          expected: {
            tokenizer:
              '{"TOK":"2","TYP":"NUMBER","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"p","TYP":"WORD","LEN":1}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"2 p.m.","terminals":[{"content":"2","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"p","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content: "1:20 pm",
          expected: {
            tokenizer:
              '{"TOK":"<time>","TYP":"MLTAG","LEN":6}{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":":","TYP":"PUNCTUATION","LEN":1}{"TOK":"20","TYP":"NUMBER","LEN":2}{"TOK":"</time>","TYP":"MLTAG_END","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"pm","TYP":"WORD","LEN":2}',
            parser:
              '{"content":"1:20 pm","terminals":[{"content":"1:20"},{"content":" ","type":10},{"content":"pm","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 3,
          content: "1:30pm",
          expected: {
            tokenizer:
              '{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":":","TYP":"PUNCTUATION","LEN":1}{"TOK":"30","TYP":"NUMBER","LEN":2}{"TOK":"pm","TYP":"WORD","LEN":2}',
            parser:
              '{"content":"1:30pm","terminals":[{"content":"1","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":":","type":6,"meta":{"punctuationType":""}},{"content":"30","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"pm","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 4,
          content: "4 o'clock",
          expected: {
            tokenizer:
              '{"TOK":"4","TYP":"NUMBER","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"o","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"clock","TYP":"WORD","LEN":5}',
            parser:
              '{"content":"4 o\'clock","terminals":[{"content":"4","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"o","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"clock","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 5,
          content: "noon",
          expected: {
            tokenizer: '{"TOK":"noon","TYP":"WORD","LEN":4}',
            parser:
              '{"content":"noon","terminals":[{"content":"noon","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 6,
          content: "midnight",
          expected: {
            tokenizer: '{"TOK":"midnight","TYP":"WORD","LEN":8}',
            parser:
              '{"content":"midnight","terminals":[{"content":"midnight","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 7,
          content: "12pm",
          expected: {
            tokenizer:
              '{"TOK":"12","TYP":"NUMBER","LEN":2}{"TOK":"pm","TYP":"WORD","LEN":2}',
            parser:
              '{"content":"12pm","terminals":[{"content":"12","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"pm","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 8,
          content: "3am",
          expected: {
            tokenizer:
              '{"TOK":"3","TYP":"NUMBER","LEN":1}{"TOK":"am","TYP":"WORD","LEN":2}',
            parser:
              '{"content":"3am","terminals":[{"content":"3","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"am","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        }
      ]
    },
    {
      id: 3,
      name: "testing number format",
      sentences: [
        {
          id: 1,
          content: "1500",
          expected: {
            tokenizer: '{"TOK":"1500","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"1500","terminals":[{"content":"1500","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content: "1,345",
          expected: {
            tokenizer:
              '{"TOK":"<numberwcommas>","TYP":"MLTAG","LEN":15}{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":"345","TYP":"NUMBER","LEN":3}{"TOK":"</numberwcommas>","TYP":"MLTAG_END","LEN":16}',
            parser:
              '{"content":"1,345","terminals":[{"content":"1,345","type":4,"meta":{"content":"","altpronunciation":"","altrecognition":"1[,]?345"}}]}',
            transformer: ""
          }
        },
        {
          id: 3,
          content: "1,234.2244",
          expected: {
            tokenizer:
              '{"TOK":"<numberwcommas>","TYP":"MLTAG","LEN":15}{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":"234","TYP":"NUMBER","LEN":3}{"TOK":"</numberwcommas>","TYP":"MLTAG_END","LEN":16}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"2244","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"1,234.2244","terminals":[{"content":"1,234","type":4,"meta":{"content":"","altpronunciation":"","altrecognition":"1[,]?234"}},{"content":".","type":6,"meta":{"punctuationType":""}},{"content":"2244","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 4,
          content: "0001",
          expected: {
            tokenizer: '{"TOK":"0001","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"0001","terminals":[{"content":"0001","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 5,
          content: "1.0001",
          expected: {
            tokenizer:
              '{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"0001","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"1.0001","terminals":[{"content":"1","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}},{"content":"0001","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        }
      ]
    },
    {
      id: 4,
      name: "testing phone numbers format",
      sentences: [
        {
          id: 0,
          content: "The number is 4445556666 exactly",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"number","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"4445556666","TYP":"NUMBER","LEN":10}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"exactly","TYP":"WORD","LEN":7}',
            parser:
              '{"content":"The number is 4445556666 exactly","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"number","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"4445556666","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"exactly","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 1,
          content: "The number (444) 5556666",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"number","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"(","TYP":"PUNCTUATION","LEN":1}{"TOK":"444","TYP":"NUMBER","LEN":3}{"TOK":")","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"5556666","TYP":"NUMBER","LEN":7}',
            parser:
              '{"content":"The number (444) 5556666","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"number","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"(","type":6,"meta":{"punctuationType":""}},{"content":"444","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":")","type":6,"meta":{"punctuationType":""}},{"content":" ","type":10},{"content":"5556666","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content: "The number 444 555-6666",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"number","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"444","TYP":"NUMBER","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"555","TYP":"NUMBER","LEN":3}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"6666","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"The number 444 555-6666","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"number","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"444","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"555","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"-","type":6,"meta":{"punctuationType":""}},{"content":"6666","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 3,
          content: "The phone number (444) 555-6666",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"phone","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"number","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<telephone number>","TYP":"MLTAG","LEN":18}{"TOK":"(","TYP":"PUNCTUATION","LEN":1}{"TOK":"444","TYP":"NUMBER","LEN":3}{"TOK":")","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"555","TYP":"NUMBER","LEN":3}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"6666","TYP":"NUMBER","LEN":4}{"TOK":"</telephone number>","TYP":"MLTAG_END","LEN":19}',
            parser:
              '{"content":"The phone number (444) 555-6666","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"phone","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"number","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"(444) 555-6666","type":5,"meta":{"countryCode":{"content":"","altpronunciation":"","altrecognition":""},"openBracket":"(","areaCode":[{"content":"4","altpronunciation":"","altrecognition":""},{"content":"4","altpronunciation":"","altrecognition":""},{"content":"4","altpronunciation":"","altrecognition":""}],"closeBracket":")","separator1":" ","exchangeCode":[{"content":"5","altpronunciation":"","altrecognition":""},{"content":"5","altpronunciation":"","altrecognition":""},{"content":"5","altpronunciation":"","altrecognition":""}],"separator2":"-","lineNumber":[{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""}]}}]}',
            transformer: ""
          }
        },
        {
          id: 4,
          content: "(444) 555-6666",
          expected: {
            tokenizer:
              '{"TOK":"<telephone number>","TYP":"MLTAG","LEN":18}{"TOK":"(","TYP":"PUNCTUATION","LEN":1}{"TOK":"444","TYP":"NUMBER","LEN":3}{"TOK":")","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"555","TYP":"NUMBER","LEN":3}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"6666","TYP":"NUMBER","LEN":4}{"TOK":"</telephone number>","TYP":"MLTAG_END","LEN":19}',
            parser:
              '{"content":"(444) 555-6666","terminals":[{"content":"(444) 555-6666","type":5,"meta":{"countryCode":{"content":"","altpronunciation":"","altrecognition":""},"openBracket":"(","areaCode":[{"content":"4","altpronunciation":"","altrecognition":""},{"content":"4","altpronunciation":"","altrecognition":""},{"content":"4","altpronunciation":"","altrecognition":""}],"closeBracket":")","separator1":" ","exchangeCode":[{"content":"5","altpronunciation":"","altrecognition":""},{"content":"5","altpronunciation":"","altrecognition":""},{"content":"5","altpronunciation":"","altrecognition":""}],"separator2":"-","lineNumber":[{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""}]}}]}',
            transformer: ""
          }
        },
        {
          id: 5,
          content: "The phone number twice (444) 555-6666  (777) 888-99999",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"phone","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"number","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"twice","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<telephone number>","TYP":"MLTAG","LEN":18}{"TOK":"(","TYP":"PUNCTUATION","LEN":1}{"TOK":"444","TYP":"NUMBER","LEN":3}{"TOK":")","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"555","TYP":"NUMBER","LEN":3}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"6666","TYP":"NUMBER","LEN":4}{"TOK":"</telephone number>","TYP":"MLTAG_END","LEN":19}{"TOK":"  ","TYP":"WHITESPACE","LEN":2}{"TOK":"(","TYP":"PUNCTUATION","LEN":1}{"TOK":"777","TYP":"NUMBER","LEN":3}{"TOK":")","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"888","TYP":"NUMBER","LEN":3}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"99999","TYP":"NUMBER","LEN":5}',
            parser:
              '{"content":"The phone number twice (444) 555-6666  (777) 888-99999","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"phone","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"number","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"twice","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"(444) 555-6666","type":5,"meta":{"countryCode":{"content":"","altpronunciation":"","altrecognition":""},"openBracket":"(","areaCode":[{"content":"4","altpronunciation":"","altrecognition":""},{"content":"4","altpronunciation":"","altrecognition":""},{"content":"4","altpronunciation":"","altrecognition":""}],"closeBracket":")","separator1":" ","exchangeCode":[{"content":"5","altpronunciation":"","altrecognition":""},{"content":"5","altpronunciation":"","altrecognition":""},{"content":"5","altpronunciation":"","altrecognition":""}],"separator2":"-","lineNumber":[{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""}]}},{"content":"  ","type":10},{"content":"(","type":6,"meta":{"punctuationType":""}},{"content":"777","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":")","type":6,"meta":{"punctuationType":""}},{"content":" ","type":10},{"content":"888","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"-","type":6,"meta":{"punctuationType":""}},{"content":"99999","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 6,
          content: "The phone number 444-555-6666",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"phone","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"number","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"444","TYP":"NUMBER","LEN":3}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"555","TYP":"NUMBER","LEN":3}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"6666","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"The phone number 444-555-6666","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"phone","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"number","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"444","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"-","type":6,"meta":{"punctuationType":""}},{"content":"555","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"-","type":6,"meta":{"punctuationType":""}},{"content":"6666","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 7,
          content: "The phone number 444.555.6666",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"phone","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"number","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"444","TYP":"NUMBER","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"555","TYP":"NUMBER","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"6666","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"The phone number 444.555.6666","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"phone","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"number","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"444","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}},{"content":"555","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}},{"content":"6666","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 8,
          content: "The phone number (444) 555-6666 and (444) 555-7777 too",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"phone","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"number","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<telephone number>","TYP":"MLTAG","LEN":18}{"TOK":"(","TYP":"PUNCTUATION","LEN":1}{"TOK":"444","TYP":"NUMBER","LEN":3}{"TOK":")","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"555","TYP":"NUMBER","LEN":3}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"6666","TYP":"NUMBER","LEN":4}{"TOK":"</telephone number>","TYP":"MLTAG_END","LEN":19}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<telephone number>","TYP":"MLTAG","LEN":18}{"TOK":"(","TYP":"PUNCTUATION","LEN":1}{"TOK":"444","TYP":"NUMBER","LEN":3}{"TOK":")","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"555","TYP":"NUMBER","LEN":3}{"TOK":"-","TYP":"PUNCTUATION","LEN":1}{"TOK":"7777","TYP":"NUMBER","LEN":4}{"TOK":"</telephone number>","TYP":"MLTAG_END","LEN":19}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"too","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"The phone number (444) 555-6666 and (444) 555-7777 too","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"phone","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"number","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"(444) 555-6666","type":5,"meta":{"countryCode":{"content":"","altpronunciation":"","altrecognition":""},"openBracket":"(","areaCode":[{"content":"4","altpronunciation":"","altrecognition":""},{"content":"4","altpronunciation":"","altrecognition":""},{"content":"4","altpronunciation":"","altrecognition":""}],"closeBracket":")","separator1":" ","exchangeCode":[{"content":"5","altpronunciation":"","altrecognition":""},{"content":"5","altpronunciation":"","altrecognition":""},{"content":"5","altpronunciation":"","altrecognition":""}],"separator2":"-","lineNumber":[{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""},{"content":"6","altpronunciation":"","altrecognition":""}]}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"(444) 555-7777","type":5,"meta":{"countryCode":{"content":"","altpronunciation":"","altrecognition":""},"openBracket":"(","areaCode":[{"content":"4","altpronunciation":"","altrecognition":""},{"content":"4","altpronunciation":"","altrecognition":""},{"content":"4","altpronunciation":"","altrecognition":""}],"closeBracket":")","separator1":" ","exchangeCode":[{"content":"5","altpronunciation":"","altrecognition":""},{"content":"5","altpronunciation":"","altrecognition":""},{"content":"5","altpronunciation":"","altrecognition":""}],"separator2":"-","lineNumber":[{"content":"7","altpronunciation":"","altrecognition":""},{"content":"7","altpronunciation":"","altrecognition":""},{"content":"7","altpronunciation":"","altrecognition":""},{"content":"7","altpronunciation":"","altrecognition":""}]}},{"content":" ","type":10},{"content":"too","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        }
      ]
    },
    {
      id: 5,
      name: "testing HTMLTAG",
      sentences: [
        {
          id: 0,
          content: "The quick <b>brown</b> fox",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<b>","TYP":"MLTAG","LEN":3}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":"</b>","TYP":"MLTAG_END","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"The quick <b>brown</b> fox","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"<b>","type":7},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"</b>"},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 1,
          content: '<span style="font-family:arial">The quick brown fox</span>',
          expected: {
            tokenizer:
              '{"TOK":"<span style=\\"font-family:arial\\">","TYP":"MLTAG","LEN":32}{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"</span>","TYP":"MLTAG_END","LEN":7}',
            parser:
              '{"content":"<span style=\\"font-family:arial\\">The quick brown fox</span>","terminals":[{"content":"<span style=\\"font-family:arial\\">","type":7},{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"</span>"}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content: "The quick brown<br/> jumped over the lazy dog",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":"<br/>","TYP":"MLTAG_SELFCLOSING","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"jumped","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"over","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"lazy","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"dog","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"The quick brown<br/> jumped over the lazy dog","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"<br/>"},{"content":" ","type":10},{"content":"jumped","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"over","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"lazy","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"dog","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 3,
          content: "<p>The quick brown fox</p>",
          expected: {
            tokenizer:
              '{"TOK":"<p>","TYP":"MLTAG","LEN":3}{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"</p>","TYP":"MLTAG_END","LEN":4}',
            parser:
              '{"content":"<p>The quick brown fox</p>","terminals":[{"content":"<p>","type":7},{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"</p>"}]}',
            transformer: ""
          }
        },
        {
          id: 4,
          content: "The <token>brown fox</token> jumped over the lazy dog",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<token>","TYP":"MLTAG","LEN":7}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"</token>","TYP":"MLTAG_END","LEN":8}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"jumped","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"over","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"lazy","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"dog","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"The <token>brown fox</token> jumped over the lazy dog","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"<token>","type":7},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"</token>"},{"content":" ","type":10},{"content":"jumped","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"over","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"lazy","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"dog","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 5,
          content: "<br/>",
          expected: {
            tokenizer: '{"TOK":"<br/>","TYP":"MLTAG_SELFCLOSING","LEN":5}',
            parser: '{"content":"<br/>","terminals":[{"content":"<br/>"}]}',
            transformer: ""
          }
        }
      ]
    },
    {
      id: 6,
      name: "testing USD",
      sentences: [
        {
          id: 0,
          content: "The quick $100 fox",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<usd>","TYP":"MLTAG","LEN":5}{"TOK":"$","TYP":"PUNCTUATION","LEN":1}{"TOK":"100","TYP":"NUMBER","LEN":3}{"TOK":"</usd>","TYP":"MLTAG_END","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"The quick $100 fox","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"$100","type":1,"meta":{"currency":{"content":"","altpronunciation":"","altrecognition":""},"amount":{"content":"","altpronunciation":"","altrecognition":""}}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 1,
          content: "The quick brown fox paid $100.",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"paid","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<usd>","TYP":"MLTAG","LEN":5}{"TOK":"$","TYP":"PUNCTUATION","LEN":1}{"TOK":"100","TYP":"NUMBER","LEN":3}{"TOK":"</usd>","TYP":"MLTAG_END","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"The quick brown fox paid $100.","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"paid","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"$100","type":1,"meta":{"currency":{"content":"","altpronunciation":"","altrecognition":""},"amount":{"content":"","altpronunciation":"","altrecognition":""}}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content: "$100 jumped over the $20",
          expected: {
            tokenizer:
              '{"TOK":"<usd>","TYP":"MLTAG","LEN":5}{"TOK":"$","TYP":"PUNCTUATION","LEN":1}{"TOK":"100","TYP":"NUMBER","LEN":3}{"TOK":"</usd>","TYP":"MLTAG_END","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"jumped","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"over","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<usd>","TYP":"MLTAG","LEN":5}{"TOK":"$","TYP":"PUNCTUATION","LEN":1}{"TOK":"20","TYP":"NUMBER","LEN":2}{"TOK":"</usd>","TYP":"MLTAG_END","LEN":6}',
            parser:
              '{"content":"$100 jumped over the $20","terminals":[{"content":"$100","type":1,"meta":{"currency":{"content":"","altpronunciation":"","altrecognition":""},"amount":{"content":"","altpronunciation":"","altrecognition":""}}},{"content":" ","type":10},{"content":"jumped","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"over","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"$20","type":1,"meta":{"currency":{"content":"","altpronunciation":"","altrecognition":""},"amount":{"content":"","altpronunciation":"","altrecognition":""}}}]}',
            transformer: ""
          }
        },
        {
          id: 3,
          content: "The brown fox wants $0.05",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"wants","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<usd>","TYP":"MLTAG","LEN":5}{"TOK":"$","TYP":"PUNCTUATION","LEN":1}{"TOK":"0","TYP":"NUMBER","LEN":1}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"05","TYP":"NUMBER","LEN":2}{"TOK":"</usd>","TYP":"MLTAG_END","LEN":6}',
            parser:
              '{"content":"The brown fox wants $0.05","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"wants","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"$0.05","type":1,"meta":{"currency":{"content":"","altpronunciation":"","altrecognition":""},"amount":{"content":"","altpronunciation":"","altrecognition":""}}}]}',
            transformer: ""
          }
        },
        {
          id: 4,
          content: "The $1,000,000 baby wants a dog.",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<usd>","TYP":"MLTAG","LEN":5}{"TOK":"$","TYP":"PUNCTUATION","LEN":1}{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":"000","TYP":"NUMBER","LEN":3}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":"000","TYP":"NUMBER","LEN":3}{"TOK":"</usd>","TYP":"MLTAG_END","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"baby","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"wants","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"a","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"dog","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"The $1,000,000 baby wants a dog.","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"$1,000,000","type":1,"meta":{"currency":{"content":"","altpronunciation":"","altrecognition":""},"amount":{"content":"","altpronunciation":"","altrecognition":""}}},{"content":" ","type":10},{"content":"baby","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"wants","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"a","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"dog","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 5,
          content:
            "$123,456.78 is a odd number with odder email fox@animal.com",
          expected: {
            tokenizer:
              '{"TOK":"<usd>","TYP":"MLTAG","LEN":5}{"TOK":"$","TYP":"PUNCTUATION","LEN":1}{"TOK":"123","TYP":"NUMBER","LEN":3}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":"456","TYP":"NUMBER","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"78","TYP":"NUMBER","LEN":2}{"TOK":"</usd>","TYP":"MLTAG_END","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"a","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"odd","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"number","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"with","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"odder","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"email","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"com","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}',
            parser:
              '{"content":"$123,456.78 is a odd number with odder email fox@animal.com","terminals":[{"content":"$123,456.78","type":1,"meta":{"currency":{"content":"","altpronunciation":"","altrecognition":""},"amount":{"content":"","altpronunciation":"","altrecognition":""}}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"a","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"odd","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"number","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"with","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"odder","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"email","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox@animal.com","type":3,"meta":{"userName":[{"content":"fox","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"animal","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"com","altpronunciation":"","altrecognition":""}]}}]}',
            transformer: ""
          }
        }
      ]
    },
    {
      id: 7,
      name: "testing date",
      sentences: [
        {
          id: 0,
          content: "The quick $100 fox on Jan. 1, 2020.",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<usd>","TYP":"MLTAG","LEN":5}{"TOK":"$","TYP":"PUNCTUATION","LEN":1}{"TOK":"100","TYP":"NUMBER","LEN":3}{"TOK":"</usd>","TYP":"MLTAG_END","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"on","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<date2>","TYP":"MLTAG","LEN":7}{"TOK":"Jan","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}{"TOK":"</date2>","TYP":"MLTAG_END","LEN":8}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"The quick $100 fox on Jan. 1, 2020.","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"$100","type":1,"meta":{"currency":{"content":"","altpronunciation":"","altrecognition":""},"amount":{"content":"","altpronunciation":"","altrecognition":""}}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"on","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"Jan. 1, 2020","type":2,"meta":{"format":1,"month":{"content":"Jan","altpronunciation":"january","altrecognition":""},"punctuation1":{"content":".","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"1","altpronunciation":"1st","altrecognition":""},"punctuation2":{"content":",","altpronunciation":"","altrecognition":""},"whitespace2":{"content":" ","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"20","altpronunciation":"(two thousand) | (twenty)","altrecognition":""},"withinCentury":{"content":"20","altpronunciation":"(twenty)","altrecognition":""}}}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 1,
          content: "Feb. 29, 2020, the quick brown fox leaped a day.",
          expected: {
            tokenizer:
              '{"TOK":"<date2>","TYP":"MLTAG","LEN":7}{"TOK":"Feb","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"29","TYP":"NUMBER","LEN":2}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}{"TOK":"</date2>","TYP":"MLTAG_END","LEN":8}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"leaped","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"a","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"day","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"Feb. 29, 2020, the quick brown fox leaped a day.","terminals":[{"content":"Feb. 29, 2020","type":2,"meta":{"format":1,"month":{"content":"Feb","altpronunciation":"february","altrecognition":""},"punctuation1":{"content":".","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"29","altpronunciation":"29th","altrecognition":""},"punctuation2":{"content":",","altpronunciation":"","altrecognition":""},"whitespace2":{"content":" ","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"20","altpronunciation":"(two thousand) | (twenty)","altrecognition":""},"withinCentury":{"content":"20","altpronunciation":"(twenty)","altrecognition":""}}}},{"content":",","type":6,"meta":{"punctuationType":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"leaped","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"a","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"day","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content: "Soon after March 31, 2018, the day jumped over lazy dog",
          expected: {
            tokenizer:
              '{"TOK":"Soon","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"after","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<date2>","TYP":"MLTAG","LEN":7}{"TOK":"March","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"31","TYP":"NUMBER","LEN":2}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2018","TYP":"NUMBER","LEN":4}{"TOK":"</date2>","TYP":"MLTAG_END","LEN":8}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"day","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"jumped","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"over","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"lazy","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"dog","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"Soon after March 31, 2018, the day jumped over lazy dog","terminals":[{"content":"Soon","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"after","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"March 31, 2018","type":2,"meta":{"format":1,"month":{"content":"March","altpronunciation":"march","altrecognition":""},"punctuation1":{"content":"","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"31","altpronunciation":"31st","altrecognition":""},"punctuation2":{"content":",","altpronunciation":"","altrecognition":""},"whitespace2":{"content":" ","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"20","altpronunciation":"(two thousand) | (twenty)","altrecognition":""},"withinCentury":{"content":"18","altpronunciation":"(eighteen)","altrecognition":""}}}},{"content":",","type":6,"meta":{"punctuationType":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"day","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"jumped","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"over","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"lazy","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"dog","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 3,
          content: "+August 22,2020",
          expected: {
            tokenizer:
              '{"TOK":"+","TYP":"WHITESPACE","LEN":1}{"TOK":"<date2>","TYP":"MLTAG","LEN":7}{"TOK":"August","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"22","TYP":"NUMBER","LEN":2}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}{"TOK":"</date2>","TYP":"MLTAG_END","LEN":8}',
            parser:
              '{"content":"+August 22,2020","terminals":[{"content":"+","type":10},{"content":"August 22,2020","type":2,"meta":{"format":1,"month":{"content":"August","altpronunciation":"august","altrecognition":""},"punctuation1":{"content":"","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"22","altpronunciation":"22nd","altrecognition":""},"punctuation2":{"content":",","altpronunciation":"","altrecognition":""},"whitespace2":{"content":"","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"20","altpronunciation":"(two thousand) | (twenty)","altrecognition":""},"withinCentury":{"content":"20","altpronunciation":"(twenty)","altrecognition":""}}}}]}',
            transformer: ""
          }
        },
        {
          id: 4,
          content: "August 2020 is not a fully defined date.",
          expected: {
            tokenizer:
              '{"TOK":"August","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"not","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"a","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fully","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"defined","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"date","TYP":"WORD","LEN":4}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"August 2020 is not a fully defined date.","terminals":[{"content":"August","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"2020","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"not","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"a","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fully","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"defined","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"date","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 5,
          content: "December is after Nov. 14 2020",
          expected: {
            tokenizer:
              '{"TOK":"December","TYP":"WORD","LEN":8}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"after","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<date3>","TYP":"MLTAG","LEN":7}{"TOK":"Nov","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"14","TYP":"NUMBER","LEN":2}{"TOK":"</date3>","TYP":"MLTAG_END","LEN":8}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}',
            parser:
              '{"content":"December is after Nov. 14 2020","terminals":[{"content":"December","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"after","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"Nov. 14","type":2,"meta":{"format":2,"month":{"content":"Nov","altpronunciation":"november","altrecognition":""},"punctuation1":{"content":".","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"14","altpronunciation":"14th","altrecognition":""},"punctuation2":{"content":"","altpronunciation":"","altrecognition":""},"whitespace2":{"content":"","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"","altpronunciation":"","altrecognition":""},"withinCentury":{"content":"","altpronunciation":"","altrecognition":""}}}},{"content":" ","type":10},{"content":"2020","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 6,
          content: "December 31, 2020 is after Nov. 14, 2020.",
          expected: {
            tokenizer:
              '{"TOK":"<date2>","TYP":"MLTAG","LEN":7}{"TOK":"December","TYP":"WORD","LEN":8}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"31","TYP":"NUMBER","LEN":2}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}{"TOK":"</date2>","TYP":"MLTAG_END","LEN":8}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"after","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<date2>","TYP":"MLTAG","LEN":7}{"TOK":"Nov","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"14","TYP":"NUMBER","LEN":2}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}{"TOK":"</date2>","TYP":"MLTAG_END","LEN":8}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"December 31, 2020 is after Nov. 14, 2020.","terminals":[{"content":"December 31, 2020","type":2,"meta":{"format":1,"month":{"content":"December","altpronunciation":"december","altrecognition":""},"punctuation1":{"content":"","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"31","altpronunciation":"31st","altrecognition":""},"punctuation2":{"content":",","altpronunciation":"","altrecognition":""},"whitespace2":{"content":" ","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"20","altpronunciation":"(two thousand) | (twenty)","altrecognition":""},"withinCentury":{"content":"20","altpronunciation":"(twenty)","altrecognition":""}}}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"after","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"Nov. 14, 2020","type":2,"meta":{"format":1,"month":{"content":"Nov","altpronunciation":"november","altrecognition":""},"punctuation1":{"content":".","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"14","altpronunciation":"14th","altrecognition":""},"punctuation2":{"content":",","altpronunciation":"","altrecognition":""},"whitespace2":{"content":" ","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"20","altpronunciation":"(two thousand) | (twenty)","altrecognition":""},"withinCentury":{"content":"20","altpronunciation":"(twenty)","altrecognition":""}}}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 7,
          content: "Is 24 Dec 2020 Xmas eve?",
          expected: {
            tokenizer:
              '{"TOK":"Is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<date1>","TYP":"MLTAG","LEN":7}{"TOK":"24","TYP":"NUMBER","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"Dec","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}{"TOK":"</date1>","TYP":"MLTAG_END","LEN":8}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"Xmas","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"eve","TYP":"WORD","LEN":3}{"TOK":"?","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"Is 24 Dec 2020 Xmas eve?","terminals":[{"content":"Is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"24 Dec 2020","type":2,"meta":{"format":0,"month":{"content":"Dec","altpronunciation":"december","altrecognition":""},"punctuation1":{"content":"","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"24","altpronunciation":"24th","altrecognition":""},"punctuation2":{"content":"","altpronunciation":"","altrecognition":""},"whitespace2":{"content":" ","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"20","altpronunciation":"(two thousand) | (twenty)","altrecognition":""},"withinCentury":{"content":"20","altpronunciation":"(twenty)","altrecognition":""}}}},{"content":" ","type":10},{"content":"Xmas","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"eve","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"?","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 8,
          content: "25 December 2020 is Xmas.",
          expected: {
            tokenizer:
              '{"TOK":"<date1>","TYP":"MLTAG","LEN":7}{"TOK":"25","TYP":"NUMBER","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"December","TYP":"WORD","LEN":8}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}{"TOK":"</date1>","TYP":"MLTAG_END","LEN":8}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"Xmas","TYP":"WORD","LEN":4}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"25 December 2020 is Xmas.","terminals":[{"content":"25 December 2020","type":2,"meta":{"format":0,"month":{"content":"December","altpronunciation":"december","altrecognition":""},"punctuation1":{"content":"","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"25","altpronunciation":"25th","altrecognition":""},"punctuation2":{"content":"","altpronunciation":"","altrecognition":""},"whitespace2":{"content":" ","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"20","altpronunciation":"(two thousand) | (twenty)","altrecognition":""},"withinCentury":{"content":"20","altpronunciation":"(twenty)","altrecognition":""}}}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"Xmas","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 9,
          content: "Dec 25, 2020 is Xmas.",
          expected: {
            tokenizer:
              '{"TOK":"<date2>","TYP":"MLTAG","LEN":7}{"TOK":"Dec","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"25","TYP":"NUMBER","LEN":2}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}{"TOK":"</date2>","TYP":"MLTAG_END","LEN":8}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"Xmas","TYP":"WORD","LEN":4}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"Dec 25, 2020 is Xmas.","terminals":[{"content":"Dec 25, 2020","type":2,"meta":{"format":1,"month":{"content":"Dec","altpronunciation":"december","altrecognition":""},"punctuation1":{"content":"","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"25","altpronunciation":"25th","altrecognition":""},"punctuation2":{"content":",","altpronunciation":"","altrecognition":""},"whitespace2":{"content":" ","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"20","altpronunciation":"(two thousand) | (twenty)","altrecognition":""},"withinCentury":{"content":"20","altpronunciation":"(twenty)","altrecognition":""}}}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"Xmas","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        }
      ]
    },
    {
      id: 8,
      name: "testing email addresses",
      sentences: [
        {
          id: 0,
          content: "The quick fox email is fox123@animal.com",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"email","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"123","TYP":"NUMBER","LEN":3}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"com","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}',
            parser:
              '{"content":"The quick fox email is fox123@animal.com","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"email","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox123@animal.com","type":3,"meta":{"userName":[{"content":"fox","altpronunciation":"","altrecognition":""},{"content":"123","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"animal","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"com","altpronunciation":"","altrecognition":""}]}}]}',
            transformer: ""
          }
        },
        {
          id: 1,
          content: "fox123@animal.org is the quick brown fox organization.",
          expected: {
            tokenizer:
              '{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"123","TYP":"NUMBER","LEN":3}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"org","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"organization","TYP":"WORD","LEN":12}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"fox123@animal.org is the quick brown fox organization.","terminals":[{"content":"fox123@animal.org","type":3,"meta":{"userName":[{"content":"fox","altpronunciation":"","altrecognition":""},{"content":"123","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"animal","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"org","altpronunciation":"","altrecognition":""}]}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"organization","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content:
            "fox123@animal.com and fox123@animal.org are both valid email addresses.",
          expected: {
            tokenizer:
              '{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"123","TYP":"NUMBER","LEN":3}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"com","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"123","TYP":"NUMBER","LEN":3}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"org","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"are","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"both","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"valid","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"email","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"addresses","TYP":"WORD","LEN":9}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"fox123@animal.com and fox123@animal.org are both valid email addresses.","terminals":[{"content":"fox123@animal.com","type":3,"meta":{"userName":[{"content":"fox","altpronunciation":"","altrecognition":""},{"content":"123","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"animal","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"com","altpronunciation":"","altrecognition":""}]}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox123@animal.org","type":3,"meta":{"userName":[{"content":"fox","altpronunciation":"","altrecognition":""},{"content":"123","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"animal","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"org","altpronunciation":"","altrecognition":""}]}},{"content":" ","type":10},{"content":"are","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"both","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"valid","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"email","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"addresses","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 3,
          content: "123fox@animal.com",
          expected: {
            tokenizer:
              '{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"123","TYP":"NUMBER","LEN":3}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"com","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}',
            parser:
              '{"content":"123fox@animal.com","terminals":[{"content":"123fox@animal.com","type":3,"meta":{"userName":[{"content":"123","altpronunciation":"","altrecognition":""},{"content":"fox","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"animal","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"com","altpronunciation":"","altrecognition":""}]}}]}',
            transformer: ""
          }
        },
        {
          id: 4,
          content: "Is fox123animal@world.edu a educational domain?",
          expected: {
            tokenizer:
              '{"TOK":"Is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"123","TYP":"NUMBER","LEN":3}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"world","TYP":"WORD","LEN":5}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"edu","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"a","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"educational","TYP":"WORD","LEN":11}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"domain","TYP":"WORD","LEN":6}{"TOK":"?","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"Is fox123animal@world.edu a educational domain?","terminals":[{"content":"Is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox123animal@world.edu","type":3,"meta":{"userName":[{"content":"fox","altpronunciation":"","altrecognition":""},{"content":"123","altpronunciation":"","altrecognition":""},{"content":"animal","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"world","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"edu","altpronunciation":"","altrecognition":""}]}},{"content":" ","type":10},{"content":"a","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"educational","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"domain","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"?","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 5,
          content: "fox.mammal@animal.mail.com valid?",
          expected: {
            tokenizer:
              '{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"mammal","TYP":"WORD","LEN":6}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"mail","TYP":"WORD","LEN":4}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"com","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"valid","TYP":"WORD","LEN":5}{"TOK":"?","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"fox.mammal@animal.mail.com valid?","terminals":[{"content":"fox.mammal@animal.mail.com","type":3,"meta":{"userName":[{"content":"fox","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"mammal","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"animal","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"mail","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"com","altpronunciation":"","altrecognition":""}]}},{"content":" ","type":10},{"content":"valid","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"?","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 6,
          content: "Only fox.dog@gmail.com is valid not cat.mouse@gmail",
          expected: {
            tokenizer:
              '{"TOK":"Only","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"dog","TYP":"WORD","LEN":3}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"gmail","TYP":"WORD","LEN":5}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"com","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"valid","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"not","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"cat","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"mouse","TYP":"WORD","LEN":5}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"gmail","TYP":"WORD","LEN":5}',
            parser:
              '{"content":"Only fox.dog@gmail.com is valid not cat.mouse@gmail","terminals":[{"content":"Only","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox.dog@gmail.com","type":3,"meta":{"userName":[{"content":"fox","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"dog","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"gmail","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"com","altpronunciation":"","altrecognition":""}]}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"valid","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"not","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"cat","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}},{"content":"mouse","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"@","type":6,"meta":{"punctuationType":""}},{"content":"gmail","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 7,
          content: "fox.animal.com email address without @ valid?",
          expected: {
            tokenizer:
              '{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"com","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"email","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"address","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"without","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"valid","TYP":"WORD","LEN":5}{"TOK":"?","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"fox.animal.com email address without @ valid?","terminals":[{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}},{"content":"animal","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}},{"content":"com","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"email","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"address","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"without","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"@","type":6,"meta":{"punctuationType":""}},{"content":" ","type":10},{"content":"valid","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"?","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        }
      ]
    },
    {
      id: 9,
      name: "testing existing tags",
      sentences: [
        {
          id: 0,
          content:
            "The quick fox email is <emailaddress>fox123@animal.com</emailaddress>",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"email","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"123","TYP":"NUMBER","LEN":3}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"com","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}',
            parser:
              '{"content":"The quick fox email is <emailaddress>fox123@animal.com</emailaddress>","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"email","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox123@animal.com","type":3,"meta":{"userName":[{"content":"fox","altpronunciation":"","altrecognition":""},{"content":"123","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"animal","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"com","altpronunciation":"","altrecognition":""}]}}]}',
            transformer: ""
          }
        },
        {
          id: 1,
          content:
            "<emailaddress>fox123@animal.org</emailaddress> is the quick brown fox organization.",
          expected: {
            tokenizer:
              '{"TOK":"<emailaddress>","TYP":"MLTAG","LEN":14}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":"123","TYP":"NUMBER","LEN":3}{"TOK":"@","TYP":"PUNCTUATION","LEN":1}{"TOK":"animal","TYP":"WORD","LEN":6}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"org","TYP":"WORD","LEN":3}{"TOK":"</emailaddress>","TYP":"MLTAG_END","LEN":15}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"is","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"organization","TYP":"WORD","LEN":12}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"<emailaddress>fox123@animal.org</emailaddress> is the quick brown fox organization.","terminals":[{"content":"fox123@animal.org","type":3,"meta":{"userName":[{"content":"fox","altpronunciation":"","altrecognition":""},{"content":"123","altpronunciation":"","altrecognition":""}],"separator":{"content":"@","altpronunciation":"at","altrecognition":""},"domainName":[{"content":"animal","altpronunciation":"","altrecognition":""},{"content":".","altpronunciation":"dot","altrecognition":""},{"content":"org","altpronunciation":"","altrecognition":""}]}},{"content":" ","type":10},{"content":"is","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"organization","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content:
            "The quick <usd>$100</usd> fox on <date2>Jan. 1, 2020</date2>.     ",
          expected: {
            tokenizer:
              '{"TOK":"The","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<usd>","TYP":"MLTAG","LEN":5}{"TOK":"$","TYP":"PUNCTUATION","LEN":1}{"TOK":"100","TYP":"NUMBER","LEN":3}{"TOK":"</usd>","TYP":"MLTAG_END","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"on","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<date2>","TYP":"MLTAG","LEN":7}{"TOK":"Jan","TYP":"WORD","LEN":3}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"1","TYP":"NUMBER","LEN":1}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"2020","TYP":"NUMBER","LEN":4}{"TOK":"</date2>","TYP":"MLTAG_END","LEN":8}{"TOK":".","TYP":"PUNCTUATION","LEN":1}{"TOK":"     ","TYP":"WHITESPACE","LEN":5}',
            parser:
              '{"content":"The quick <usd>$100</usd> fox on <date2>Jan. 1, 2020</date2>.     ","terminals":[{"content":"The","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"$100","type":1,"meta":{"currency":{"content":"","altpronunciation":"","altrecognition":""},"amount":{"content":"","altpronunciation":"","altrecognition":""}}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"on","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"Jan. 1, 2020","type":2,"meta":{"format":1,"month":{"content":"Jan","altpronunciation":"january","altrecognition":""},"punctuation1":{"content":".","altpronunciation":"","altrecognition":""},"whitespace1":{"content":" ","altpronunciation":"","altrecognition":""},"day":{"content":"1","altpronunciation":"1st","altrecognition":""},"punctuation2":{"content":",","altpronunciation":"","altrecognition":""},"whitespace2":{"content":" ","altpronunciation":"","altrecognition":""},"year":{"century":{"content":"20","altpronunciation":"(two thousand) | (twenty)","altrecognition":""},"withinCentury":{"content":"20","altpronunciation":"(twenty)","altrecognition":""}}}},{"content":".","type":6,"meta":{"punctuationType":""}},{"content":"     ","type":10}]}',
            transformer: ""
          }
        }
      ]
    },
    {
      id: 10,
      name: "testing contractions",
      sentences: [
        {
          id: 0,
          content: "I'd spot and they'd chase the quick brown fox",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"d","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"spot","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"they","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"d","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"chase","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"I\'d spot and they\'d chase the quick brown fox","terminals":[{"content":"I\'d","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"spot","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"they\'d","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"chase","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 1,
          content: "We'd call and I'd go.",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"We","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"d","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"call","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"d","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"We\'d call and I\'d go.","terminals":[{"content":"We\'d","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"call","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I\'d","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content: "You'd better be careful while he'd better not",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"You","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"d","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"be","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"careful","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"while","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"he","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"d","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"not","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"You\'d better be careful while he\'d better not","terminals":[{"content":"You\'d","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"be","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"careful","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"while","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"he\'d","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"not","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 3,
          content: "I'll spot and they'll chase the quick brown fox",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"ll","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"spot","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"they","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"ll","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"chase","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"I\'ll spot and they\'ll chase the quick brown fox","terminals":[{"content":"I\'ll","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"spot","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"they\'ll","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"chase","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 4,
          content: "We'll call and you'll go.",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"We","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"ll","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"call","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"you","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"ll","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"We\'ll call and you\'ll go.","terminals":[{"content":"We\'ll","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"call","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"you\'ll","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 5,
          content: "You'll be careful he'll not be",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"You","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"ll","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"be","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"careful","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"he","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"ll","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"not","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"be","TYP":"WORD","LEN":2}',
            parser:
              '{"content":"You\'ll be careful he\'ll not be","terminals":[{"content":"You\'ll","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"be","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"careful","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"he\'ll","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"not","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"be","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 6,
          content: "I'm spot and they'm chase the quick brown fox",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"spot","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"they","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"chase","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"I\'m spot and they\'m chase the quick brown fox","terminals":[{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"spot","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"they","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"chase","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 7,
          content: "We'm call and I'm go.",
          expected: {
            tokenizer:
              '{"TOK":"We","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"call","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"We\'m call and I\'m go.","terminals":[{"content":"We","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"call","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 8,
          content: "You'm better be careful while he'm better not",
          expected: {
            tokenizer:
              '{"TOK":"You","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"be","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"careful","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"while","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"he","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"not","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"You\'m better be careful while he\'m better not","terminals":[{"content":"You","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"be","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"careful","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"while","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"he","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"not","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 9,
          content: "I'm spot and they'm chase the quick brown fox",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"spot","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"they","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"chase","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"I\'m spot and they\'m chase the quick brown fox","terminals":[{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"spot","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"they","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"chase","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 10,
          content: "We'm call and I'm go.",
          expected: {
            tokenizer:
              '{"TOK":"We","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"call","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"We\'m call and I\'m go.","terminals":[{"content":"We","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"call","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 11,
          content: "You'm better be careful while he'm better not",
          expected: {
            tokenizer:
              '{"TOK":"You","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"be","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"careful","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"while","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"he","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"not","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"You\'m better be careful while he\'m better not","terminals":[{"content":"You","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"be","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"careful","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"while","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"he","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"not","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 12,
          content: "I'm spot and they'm chase the quick brown fox",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"spot","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"they","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"chase","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"I\'m spot and they\'m chase the quick brown fox","terminals":[{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"spot","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"they","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"chase","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 13,
          content: "We'm call and I'm go.",
          expected: {
            tokenizer:
              '{"TOK":"We","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"call","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"We\'m call and I\'m go.","terminals":[{"content":"We","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"call","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 14,
          content: "You'm better be careful while he'm better not",
          expected: {
            tokenizer:
              '{"TOK":"You","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"be","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"careful","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"while","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"he","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"not","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"You\'m better be careful while he\'m better not","terminals":[{"content":"You","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"be","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"careful","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"while","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"he","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"not","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 15,
          content: "I're spot and they're chase the quick brown fox",
          expected: {
            tokenizer:
              '{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"spot","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"they","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"chase","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"I\'re spot and they\'re chase the quick brown fox","terminals":[{"content":"I","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"spot","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"they\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"chase","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 16,
          content: "We're call and we're I'm go.",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"We","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"call","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"we","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"We\'re call and we\'re I\'m go.","terminals":[{"content":"We\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"call","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"we\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 17,
          content: "You're better we're be careful while he're better not",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"You","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"we","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"be","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"careful","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"while","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"he","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"not","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"You\'re better we\'re be careful while he\'re better not","terminals":[{"content":"You\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"we\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"be","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"careful","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"while","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"he","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"not","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 18,
          content: "I's spot and they's chase the quick brown fox",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"spot","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"they","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"chase","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"I\'s spot and they\'s chase the quick brown fox","terminals":[{"content":"I\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"spot","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"they\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"chase","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 19,
          content: "We's call and I'm go.",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"We","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"call","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"We\'s call and I\'m go.","terminals":[{"content":"We\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"call","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 20,
          content: "She's better be careful while he's better not",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"She","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"be","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"careful","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"while","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"he","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"not","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"She\'s better be careful while he\'s better not","terminals":[{"content":"She\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"be","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"careful","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"while","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"he\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"not","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 21,
          content: "I's spot and they's chase the quick brown fox",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"spot","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"they","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"chase","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"I\'s spot and they\'s chase the quick brown fox","terminals":[{"content":"I\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"spot","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"they\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"chase","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 22,
          content: "We't wasn't calling and I't can't go.",
          expected: {
            tokenizer:
              '{"TOK":"We","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"t","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"wasn","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"t","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"calling","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"t","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"can","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"t","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"We\'t wasn\'t calling and I\'t can\'t go.","terminals":[{"content":"We","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"t","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"wasn\'t","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"calling","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"t","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"can\'t","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 23,
          content: "They weren't careful while he's better",
          expected: {
            tokenizer:
              '{"TOK":"They","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"weren","TYP":"WORD","LEN":5}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"t","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"careful","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"while","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"he","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}',
            parser:
              '{"content":"They weren\'t careful while he\'s better","terminals":[{"content":"They","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"weren\'t","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"careful","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"while","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"he\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 24,
          content: "I's spot and they's chase the quick brown fox",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"spot","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"they","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"chase","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"the","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"quick","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"brown","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"fox","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"I\'s spot and they\'s chase the quick brown fox","terminals":[{"content":"I\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"spot","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"they\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"chase","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"the","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"quick","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"brown","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"fox","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 25,
          content: "We't wasn't calling and I't can't go.",
          expected: {
            tokenizer:
              '{"TOK":"We","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"t","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"wasn","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"t","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"calling","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"t","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"can","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"t","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"We\'t wasn\'t calling and I\'t can\'t go.","terminals":[{"content":"We","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"t","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"wasn\'t","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"calling","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":"\'","type":6,"meta":{"punctuationType":""}},{"content":"t","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"can\'t","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 26,
          content: "They weren't careful while he's better",
          expected: {
            tokenizer:
              '{"TOK":"They","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"weren","TYP":"WORD","LEN":5}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"t","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"careful","TYP":"WORD","LEN":7}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"while","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"he","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"s","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}',
            parser:
              '{"content":"They weren\'t careful while he\'s better","terminals":[{"content":"They","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"weren\'t","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"careful","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"while","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"he\'s","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        },
        {
          id: 27,
          content: "We're call and we're I'm go.",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"We","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"call","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"we","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"We\'re call and we\'re I\'m go.","terminals":[{"content":"We\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"call","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"we\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 28,
          content: "you're call and they're what're,  we're I'm go.",
          expected: {
            tokenizer:
              '{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"you","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"call","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"they","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"what","TYP":"WORD","LEN":4}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":"  ","TYP":"WHITESPACE","LEN":2}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"we","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"you\'re call and they\'re what\'re,  we\'re I\'m go.","terminals":[{"content":"you\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"call","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"they\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"what\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":",","type":6,"meta":{"punctuationType":""}},{"content":"  ","type":10},{"content":"we\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 29,
          content: "   we're call and we're I'm go.",
          expected: {
            tokenizer:
              '{"TOK":"   ","TYP":"WHITESPACE","LEN":3}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"we","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"call","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"and","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"we","TYP":"WORD","LEN":2}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"re","TYP":"WORD","LEN":2}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"m","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"go","TYP":"WORD","LEN":2}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"   we\'re call and we\'re I\'m go.","terminals":[{"content":"   ","type":10},{"content":"we\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"call","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"and","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"we\'re","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"I\'m","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"go","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 30,
          content: "Oh, she'd better not",
          expected: {
            tokenizer:
              '{"TOK":"Oh","TYP":"WORD","LEN":2}{"TOK":",","TYP":"PUNCTUATION","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"<contraction>","TYP":"MLTAG","LEN":13}{"TOK":"she","TYP":"WORD","LEN":3}{"TOK":"\'","TYP":"PUNCTUATION","LEN":1}{"TOK":"d","TYP":"WORD","LEN":1}{"TOK":"</contraction>","TYP":"MLTAG_END","LEN":14}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"better","TYP":"WORD","LEN":6}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"not","TYP":"WORD","LEN":3}',
            parser:
              '{"content":"Oh, she\'d better not","terminals":[{"content":"Oh","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":",","type":6,"meta":{"punctuationType":""}},{"content":" ","type":10},{"content":"she\'d","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"better","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"not","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}}]}',
            transformer: ""
          }
        }
      ]
    },
    {
      id: 11,
      name: "testing acronyms",
      sentences: [
        {
          id: 0,
          content: "I went to SCVMC for treatment.",
          expected: {
            tokenizer:
              '{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"went","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"to","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"SCVMC","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"for","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"treatment","TYP":"WORD","LEN":9}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"I went to SCVMC for treatment.","terminals":[{"content":"I","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"went","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"to","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"SCVMC","type":0,"meta":{"letters":[{"content":"S","altpronunciation":"santa","altrecognition":"santa"},{"content":"C","altpronunciation":"clara","altrecognition":"clara"},{"content":"V","altpronunciation":"valley","altrecognition":"valley"},{"content":"M","altpronunciation":"medical","altrecognition":"medical"},{"content":"C","altpronunciation":"center","altrecognition":"center"}]}},{"content":" ","type":10},{"content":"for","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"treatment","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 1,
          content: "I went to CSUEB for training.",
          expected: {
            tokenizer:
              '{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"went","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"to","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"CSUEB","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"for","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"training","TYP":"WORD","LEN":8}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"I went to CSUEB for training.","terminals":[{"content":"I","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"went","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"to","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"CSUEB","type":0,"meta":{"letters":[{"content":"C","altpronunciation":"cal","altrecognition":"cal"},{"content":"S","altpronunciation":"state","altrecognition":"state"},{"content":"U","altpronunciation":"university","altrecognition":"university"},{"content":"E","altpronunciation":"east","altrecognition":"east"},{"content":"B","altpronunciation":"bay","altrecognition":"bay"}]}},{"content":" ","type":10},{"content":"for","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"training","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 2,
          content: "I went to UCB for undergraduate study.",
          expected: {
            tokenizer:
              '{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"went","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"to","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"UCB","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"for","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"undergraduate","TYP":"WORD","LEN":13}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"study","TYP":"WORD","LEN":5}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"I went to UCB for undergraduate study.","terminals":[{"content":"I","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"went","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"to","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"UCB","type":0,"meta":{"letters":[{"content":"U","altpronunciation":"university","altrecognition":"university"},{"content":"C","altpronunciation":"california","altrecognition":"california"},{"content":"B","altpronunciation":"berkeley","altrecognition":"berkeley"}]}},{"content":" ","type":10},{"content":"for","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"undergraduate","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"study","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 3,
          content: "I went to SJS for SPARC.",
          expected: {
            tokenizer:
              '{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"went","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"to","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"SJS","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"for","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"SPARC","TYP":"WORD","LEN":5}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"I went to SJS for SPARC.","terminals":[{"content":"I","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"went","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"to","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"SJS","type":0,"meta":{"letters":[{"content":"S","altpronunciation":"san","altrecognition":"san"},{"content":"J","altpronunciation":"jose","altrecognition":"jose"},{"content":"S","altpronunciation":"state","altrecognition":"state"}]}},{"content":" ","type":10},{"content":"for","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"SPARC","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        },
        {
          id: 4,
          content: "I went to CSUEB for training.",
          expected: {
            tokenizer:
              '{"TOK":"I","TYP":"WORD","LEN":1}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"went","TYP":"WORD","LEN":4}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"to","TYP":"WORD","LEN":2}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"CSUEB","TYP":"WORD","LEN":5}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"for","TYP":"WORD","LEN":3}{"TOK":" ","TYP":"WHITESPACE","LEN":1}{"TOK":"training","TYP":"WORD","LEN":8}{"TOK":".","TYP":"PUNCTUATION","LEN":1}',
            parser:
              '{"content":"I went to CSUEB for training.","terminals":[{"content":"I","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"went","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"to","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"CSUEB","type":0,"meta":{"letters":[{"content":"C","altpronunciation":"cal","altrecognition":"cal"},{"content":"S","altpronunciation":"state","altrecognition":"state"},{"content":"U","altpronunciation":"university","altrecognition":"university"},{"content":"E","altpronunciation":"east","altrecognition":"east"},{"content":"B","altpronunciation":"bay","altrecognition":"bay"}]}},{"content":" ","type":10},{"content":"for","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":" ","type":10},{"content":"training","type":11,"meta":{"content":"","altpronunciation":"","altrecognition":""}},{"content":".","type":6,"meta":{"punctuationType":""}}]}',
            transformer: ""
          }
        }
      ]
    }
  ]
};
export default unittestdata;
