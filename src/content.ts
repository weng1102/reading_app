import PageContentType  from "pageContentType";
import { PageFormatEnumType } from "pageContentType";
import { SectionVariantEnumType } from "pageContentType";
import { TerminalMetaEnumType } from "pageContentType";

const data: PageContentType = {
    id: 0,
    name: "Three-Word Sentences",
    description: "Three-Word Sentences",
    owner: "",
    pageFormatType: PageFormatEnumType.default,
    created: undefined,
    modified: undefined,
    transformed: undefined,
    firstWordIdx: 0,
    lastWordIdx: 22,
    sections: [
      {
        id: 0,
        name: "Ronlyn's three-word sentences",
        description: "Ronlyn's three-word sentences",
        firstWordIdx: 0,
        meta: {
          type: SectionVariantEnumType.paragraph,
          style: ""
        },
        sentences: [
          {
            id: 0,
            content: "I'm Ronlyn Goo.",
            firstWordIdx: 0,
            terminals: [
              {
                content: "I'm",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 0,
                  wordIdx: 0,
                  nextWordIdx: [1],
                  prevWordIdx: [0],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "Ronlyn",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 1,
                  wordIdx: 1,
                  prevWordIdx: [0],
                  nextWordIdx: [2],
                  active: true,
                  altrecognition: "\"^(ron|ro[ns]a{0,1}l[aiye]nd{0,1})$\"",
                  altpronunciation: "",
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "Goo",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 2,
                  wordIdx: 2,
                  prevWordIdx: [1],
                  nextWordIdx: [3],
                  active: false,
                  "altrecognition": "\"^(g[ou])\"",
                  altpronunciation: "",
                  visited: false
                }
              },
              {
                content: ".",
                meta: {
                  type: TerminalMetaEnumType.punctuation,
                  punctuationType: "period"
                }
              }
            ]
          },
          {
            id: 1,
            content: "I'm a woman.",
            firstWordIdx: 3,
            terminals: [
              {
                content: "I'm",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 3,
                  wordIdx: 3,
                  nextWordIdx: [2],
                  prevWordIdx: [4],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "a",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 4,
                  wordIdx: 4,
                  nextWordIdx: [3],
                  prevWordIdx: [5],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "woman",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 5,
                  wordIdx: 5,
                  nextWordIdx: [4],
                  prevWordIdx: [6],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: ".",
                meta: {
                  type: TerminalMetaEnumType.punctuation,
                  punctuationType: "period"
                }
              }
            ]
          }
        ]
      },
      {
        id: 1,
        name: "Ronlyn's random sentence list:",
        description: "",
        firstWordIdx: 6,
        meta: {
          type: SectionVariantEnumType.paragraph,
          style: ""
        },
        sentences: [
          {
            id: 0,
            "content": "ant crawls fast",
            firstWordIdx: 6,
            terminals: [
              {
                content: "ants",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 6,
                  wordIdx: 6,
                  nextWordIdx: [5],
                  prevWordIdx: [7],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                },
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "crawl",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 7,
                  wordIdx: 7,
                  nextWordIdx: [6],
                  prevWordIdx: [8],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "very",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 8,
                  wordIdx: 8,
                  nextWordIdx: [7],
                  prevWordIdx: [9],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "fast",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 9,
                  wordIdx: 9,
                  nextWordIdx: [8],
                  prevWordIdx: [10],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: ".",
                meta: {
                  type: TerminalMetaEnumType.punctuation,
                  punctuationType: "period"
                }
              }
            ]
          },
          {
            id: 10,
            content: "cats says meow.",
            firstWordIdx: 10,
            terminals: [
              {
                content: "cat",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 0,
                  wordIdx: 10,
                  nextWordIdx: [9],
                  prevWordIdx: [11],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "says",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 11,
                  wordIdx: 11,
                  nextWordIdx: [10],
                  prevWordIdx: [12],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "a",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 0,
                  wordIdx: 12,
                  nextWordIdx: [11],
                  prevWordIdx: [13],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "meow",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 13,
                  wordIdx: 13,
                  nextWordIdx: [12],
                  prevWordIdx: [14],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: ".",
                meta: {
                  type: TerminalMetaEnumType.punctuation,
                  punctuationType: "period"
                }
              }
            ]

          },
          {
            id: 2,
            content: "the quick brown fox jumped over the lazy dog.",
            firstWordIdx: 14,
            terminals: [
              {
                content: "the",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 14,
                  wordIdx: 14,
                  nextWordIdx: [13],
                  prevWordIdx: [15],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "quick",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 15,
                  wordIdx: 14,
                  nextWordIdx: [13],
                  prevWordIdx: [15],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "brown",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 16,
                  wordIdx: 16,
                  nextWordIdx: [15],
                  prevWordIdx: [17],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "fox",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 17,
                  wordIdx: 17,
                  nextWordIdx: [16],
                  prevWordIdx: [18],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "jumped",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 18,
                  wordIdx: 18,
                  nextWordIdx: [17],
                  prevWordIdx: [19],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "over",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 19,
                  wordIdx: 19,
                  nextWordIdx: [18],
                  prevWordIdx: [20],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "the",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 20,
                  wordIdx: 20,
                  nextWordIdx: [21],
                  prevWordIdx: [23],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "lazy",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 21,
                  wordIdx: 21,
                  nextWordIdx: [20],
                  prevWordIdx: [22],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: " ",
                meta: {
                  type: TerminalMetaEnumType.whitespace,
                  whitespaceType: "space"
                }
              },
              {
                content: "dog",
                meta: {
                  type: TerminalMetaEnumType.audibleword,
                  id: 22,
                  wordIdx: 22,
                  nextWordIdx: [21],
                  prevWordIdx: [],
                  altpronunciation: "",
                  altrecognition: "",
                  active: false,
                  visited: false
                }
              },
              {
                content: ".",
                meta: {
                  type: TerminalMetaEnumType.punctuation,
                  punctuationType: "period"
                }
              }
            ]
          }
        ]
      }
    ]
  }
export default data
