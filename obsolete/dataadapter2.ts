/***
 * Read line-based modified markdown-format page content
 */
import * as path from "path";
import * as fs from "fs";
const AppInfo = require(path.resolve("./appinfo.json")); // should use module.paths and find-me.js
import { Logger, BaseClass, MyDate, UserContext } from "./utilities";
// import * as rl from 'readline-sync';
const enum MarkdownTagType {
  SENTENCES = "SENTENCES",
  EMPTY = "EMPTY",
  HEADING = "HEADING",
  SECTION_ORDERED = "SECTION_ORDERED",
  SECTION_UNORDERED = "SECTION_UNORDERED",
  SECTION_FILLIN = "SECTION_FILLIN",
  SECTION_PHOTOENTRY = "SECTION_PHOTOENTRY_START",
  SECTION_PHOTOENTRY_END = "SECTION_PHOTOENTRY_END",
  SECTION_END = "SECTION_END",
  SECTION_PARAGRAPH = "SECTION_PARAGRAPH",
  LIST_UNORDERED = "LIST_UNORDERED",
  LIST_ORDERED = "LIST_ORDERED",
  BLOCKQUOTE = "BLOCKQUOTE",
  COMMENT = "COMMENT",
  PASSTHRUTAG = "PASSTHRUTAG",
  PARAGRAPH = "PARAGRAPH",
  PARAGRAPH_END = "PARAGRAPH_END",
  PHOTOENTRY = "PHOTOENTRY",
  PHOTOENTRY_END = "PHOTOENTRY_END",
  FILLIN = "FILLIN",
  FILLIN_END = "FILLIN_END",
  PAGE = "PAGE",
  UNKNOWN = "UNKNOWN" // should always be last
}
const enum MarkdownType {
  SENTENCES = "SENTENCES",
  EMPTY = "EMPTY",
  HEADING01 = "HEADING01",
  HEADING02 = "HEADING02",
  HEADING03 = "HEADING03",
  HEADING04 = "HEADING04",
  HEADING05 = "HEADING05",
  HEADING06 = "HEADING06",
  LIST_UNORDERED01 = "LIST_UNORDERED01",
  LIST_UNORDERED02 = "LIST_UNORDERED02",
  LIST_UNORDERED03 = "LIST_UNORDERED03",
  LIST_UNORDERED04 = "LIST_UNORDERED04",
  LIST_ORDERED01 = "LIST_ORDERED01",
  LIST_ORDERED02 = "LIST_ORDERED02",
  LIST_ORDERED03 = "LIST_ORDERED03",
  LIST_ORDERED04 = "LIST_ORDERED04",
  BLOCKQUOTE = "BLOCKQUOTE",
  COMMENT = "COMMENT",
  PASSTHRUTAG = "PASSTHRUTAG",
  FILLIN = "LIST_FILLIN",
  FILLIN_END = "LIST_FILLIN_END",
  PAGE = "PAGE",
  PHOTOENTRY = "PHOTOENTRY",
  PHOTOENTRY_END = "PHOTOENTRY_END",
  UNKNOWN = "UNKNOWN" // should always be last
}

//const pattern_boldtext = /\*\*(.*)\*\*/gim;
//const pattern_italics = /\*(.*)\*/gim;

export interface MarkdownWithTagType {
  content: string[];
  tagType: MarkdownTagType;
  depth: number;
}
interface RegExpMatchArrayWithTagType {
  groups: RegExpMatchArray;
  tag: string;
}
//type MarkdownClassDictionaryType = Record<MarkdownType, MarkdownTagType>;
/* Each pattern will define one explicit capture group () to
   be returned. Hence. the pattern cannot use the global flag g
   because final output will only include the first group encountered:
   group[1] until a use case requires the expansion of this definition.
*/
interface MarkdownPatternItemType {
  pattern: RegExp;
  tagType: MarkdownTagType;
}
type MarkdownPatternDictionaryType = Record<
  MarkdownType,
  MarkdownPatternItemType
>;
const SENTENCES_PATTERN: RegExp = /["']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/g;
//const PARAGRAPH_TO_SENTENCES: RegExp = /[^\.\!\?]*[\.\!\?]/;
//const PARAGRAPH_TO_SENTENCES1: RegExp = /?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/;
//pattern: /^(["']?[A-Za-z\$\@]{1}.*)$/m,
const MarkdownPatternDictionary: MarkdownPatternDictionaryType = {
  [MarkdownType.SENTENCES]: {
    pattern: SENTENCES_PATTERN,
    tagType: MarkdownTagType.SENTENCES
  },
  [MarkdownType.EMPTY]: { pattern: /^\s*$/, tagType: MarkdownTagType.EMPTY },
  [MarkdownType.HEADING01]: {
    pattern: /^#\s([^\s].*)$/,
    tagType: MarkdownTagType.HEADING
  },
  [MarkdownType.HEADING02]: {
    pattern: /^##\s([^\s].*)$/,
    tagType: MarkdownTagType.HEADING
  },
  [MarkdownType.HEADING03]: {
    pattern: /^###\s([^\s].*)$/,
    tagType: MarkdownTagType.HEADING
  },
  [MarkdownType.HEADING04]: {
    pattern: /^####\s([^\s].*)$/,
    tagType: MarkdownTagType.HEADING
  },
  [MarkdownType.HEADING05]: {
    pattern: /^#####\s([^\s].*)$/,
    tagType: MarkdownTagType.HEADING
  },
  [MarkdownType.HEADING06]: {
    pattern: /^######\s([^\s].*)$/,
    tagType: MarkdownTagType.HEADING
  },
  [MarkdownType.LIST_UNORDERED01]: {
    pattern: /^[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownTagType.LIST_UNORDERED
  },
  [MarkdownType.LIST_UNORDERED02]: {
    pattern: /^\s{2}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownTagType.LIST_UNORDERED
  },
  [MarkdownType.LIST_UNORDERED03]: {
    pattern: /^\s{4}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownTagType.LIST_UNORDERED
  },
  [MarkdownType.LIST_UNORDERED04]: {
    pattern: /^\s{6}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownTagType.LIST_UNORDERED
  },
  [MarkdownType.LIST_ORDERED01]: {
    pattern: /^[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownTagType.LIST_ORDERED
  },
  [MarkdownType.LIST_ORDERED02]: {
    pattern: /^\s{2}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownTagType.LIST_ORDERED
  },
  [MarkdownType.LIST_ORDERED03]: {
    pattern: /^\s{4}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownTagType.LIST_ORDERED
  },
  [MarkdownType.LIST_ORDERED04]: {
    pattern: /^\s{6}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownTagType.LIST_ORDERED
  },
  [MarkdownType.BLOCKQUOTE]: {
    pattern: /^\>\s([^\s].*)$/,
    tagType: MarkdownTagType.BLOCKQUOTE
  },
  [MarkdownType.COMMENT]: {
    pattern: /^\[(\/\/|)\]:\s(.*)$/,
    tagType: MarkdownTagType.COMMENT
  },
  [MarkdownType.PHOTOENTRY]: {
    pattern: /\[\/\/photo-entry\]:\s(image=.*)$/i,
    tagType: MarkdownTagType.PHOTOENTRY
  },
  [MarkdownType.PHOTOENTRY_END]: {
    pattern: /\[\/\/photo-entry-end\]$/i,
    tagType: MarkdownTagType.PHOTOENTRY_END
  },
  [MarkdownType.PAGE]: {
    pattern: /\[\/\/page\]:\s(.*)$/i,
    tagType: MarkdownTagType.PAGE
  },
  [MarkdownType.FILLIN]: {
    pattern: /\[\/\/fill-in\]:(.*)$/,
    tagType: MarkdownTagType.FILLIN
  },
  [MarkdownType.FILLIN_END]: {
    pattern: /\[\/\/fill-in-end\]$/,
    tagType: MarkdownTagType.FILLIN_END
  },
  [MarkdownType.PASSTHRUTAG]: {
    pattern: /^\[\/\/([A-Za-z\-]*)\]:\s([^\s].*)$/,
    tagType: MarkdownTagType.PASSTHRUTAG
  },
  [MarkdownType.UNKNOWN]: { pattern: /(.*)$/, tagType: MarkdownTagType.UNKNOWN }
};

export interface IMarkdownSource {
  connect(fileName: string): number;
  parse(record: string): MarkdownWithTagType;
  serialize();
  //  buffer: RegExpMatchArrayWithTagType[];
  buffer: MarkdownWithTagType[];
}
abstract class MarkdownSource extends BaseClass implements IMarkdownSource {
  buffer: MarkdownWithTagType[] = [];
  constructor(parent) {
    super(parent);
  }
  abstract connect(fileName: string): number;
  abstract parse(record: string): MarkdownWithTagType;
  serialize() {
    const zeroPad = (num: number, places: number) =>
      String(num).padStart(places, "0");
    const numToStr = (depth: number) => (depth >= 0 ? `depth:${depth}` : ``);
    for (let i = 0; i < this.buffer.length; i++) {
      let content: string =
        this.buffer[i].content[0] === undefined
          ? "(undefined)"
          : this.buffer[i].content[0];
      console.log(
        `$$$$$$$$$$$$${zeroPad(i + 1, 3)}: ${content.padEnd(35)}${
          content.length > 0 ? " " : ""
        }(tagType:${this.buffer[i].tagType} ${numToStr(this.buffer[i].depth)})`
      );
    }
  }
}
export class RawMarkdownSource extends MarkdownSource
  implements IMarkdownSource {
  readonly parent: any;
  //  buffer: RegExpMatchArrayWithTagType[] = [];
  ///buffer: MarkdownWithTagType[] = [];
  constructor(parent) {
    super(parent);
  }
  connect(fileName: string): number {
    let inputBuffer: string[];
    //    this.logger.diagnosticMode = true;
    this.logger.diagnostic(`input file: ${fileName}`);
    inputBuffer = fs
      .readFileSync(fileName)
      .toString()
      .split("\n");
    let previous: MarkdownWithTagType = {
      content: [],
      tagType: MarkdownTagType.UNKNOWN,
      depth: 0
    };
    for (let record of inputBuffer) {
      this.logger.diagnostic(`${record}`);
      let current: MarkdownWithTagType = this.parse(
        record.replace(/[\r]$/, "")
      );
      // check for section transition
      if (
        current.tagType === MarkdownTagType.HEADING ||
        previous.tagType === MarkdownTagType.HEADING
      ) {
        // could use headings to define section but for now translates into <h1>...
        // heading transitions would occur when the next heading at the same level
        // is encountered: ""# a heading" then ""# another heading"
      } else if (
        (previous.tagType === MarkdownTagType.LIST_ORDERED ||
          previous.tagType === MarkdownTagType.LIST_UNORDERED ||
          current.tagType === MarkdownTagType.LIST_ORDERED ||
          current.tagType === MarkdownTagType.LIST_UNORDERED) &&
        current.depth !== previous.depth
      ) {
        this.insertListSection(previous, current);
      } else if (
        previous.tagType !== MarkdownTagType.SENTENCES ||
        current.tagType === MarkdownTagType.SENTENCES
      ) {
        this.buffer.push({
          content: [],
          tagType: MarkdownTagType.PARAGRAPH,
          depth: current.depth
        });
      } else {
      }
      this.buffer.push(current);
      previous = current;
      if (
        this.buffer[this.buffer.length - 1].tagType === MarkdownTagType.UNKNOWN
      ) {
        this.logger.warning(
          `line ${this.buffer.length} could not be parsed: ${record}`
        );
      }
    }
    if (this.logger.warnings() > 0) {
      this.logger.warning(
        `Encountered ${this.logger.warnings()} warning${
          this.logger.warnings() === 1 ? "" : "s"
        } parsing '${fileName}'`
      );
    }
    return this.buffer.length;
  }
  insertListSection(
    _previous: MarkdownWithTagType,
    _current: MarkdownWithTagType
  ) {
    return;
  }
  parse(line: string): MarkdownWithTagType {
    let content: string;
    let match: RegExpMatchArray = [];
    let mdTag: MarkdownType;
    if (MarkdownPatternDictionary[MarkdownType.EMPTY].pattern.test(line)) {
      content = line;
      mdTag = MarkdownType.EMPTY;
    } else {
      match = line.match(/^(.*)$/)!;
      content = match[1];
      mdTag = MarkdownType.UNKNOWN;
    }
    let retval: MarkdownWithTagType = {
      content: [],
      tagType: MarkdownTagType.UNKNOWN,
      depth: 0
    };
    retval.content.push(content);
    return retval;
  }
}
export class BasicMarkdownSource extends RawMarkdownSource
  implements IMarkdownSource {
  buffer: MarkdownWithTagType[] = [];
  constructor(parent) {
    super(parent);
  }
  parse(line: string): MarkdownWithTagType {
    let matches: RegExpMatchArray = [];
    let depth: number = 0;
    let mdTag: MarkdownType = MarkdownType.UNKNOWN;
    let retval: MarkdownWithTagType = {
      content: [],
      tagType: MarkdownTagType.UNKNOWN,
      depth: 0
    };
    for (mdTag in MarkdownPatternDictionary) {
      let regexpPattern = MarkdownPatternDictionary[mdTag].pattern;
      if (regexpPattern.test(line)) {
        matches = line.match(regexpPattern)!; // full match, capture groups
        depth = Number.isNaN((depth = parseInt(mdTag.slice(-2)))) ? 0 : depth;
        if (mdTag === MarkdownType.SENTENCES) {
          if (matches[1] !== undefined) {
            if (matches !== null)
              matches.forEach((sentence: string) => {
                retval.content.push(sentence);
                console.log(`matches=${sentence}`);
              });
            //          let sentenceList: string[] = matches[1].split(SENTENCES_PATTERN);
            //          console.log(`sentenceList=${sentenceList}`);
          } else {
            retval.content.push(matches[0]);
            console.log(`matches[0]=${matches[0]}`);
          }
        }
        // if (mdTag === MarkdownType.BLOCKQUOTE) {
        //   let sentences = matches[1].match(
        //     /["']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/g
        //   );
        //   console.log(`blockquote: ${sentences!.length}`);
        // }
        retval.content.push(matches[1]);
        retval.tagType = MarkdownPatternDictionary[mdTag].tagType;
        break;
      }
    }
    // split() paragraph to sentences      /["']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/
    retval.depth = depth;
    return retval;
  }
  insertListSection(
    previous: MarkdownWithTagType,
    current: MarkdownWithTagType
  ) {
    if (current.depth > previous.depth) {
      for (let depth = previous.depth + 1; depth <= current.depth; depth++) {
        this.buffer.push({
          content: [],
          tagType:
            current.tagType === MarkdownTagType.LIST_ORDERED
              ? MarkdownTagType.SECTION_ORDERED
              : MarkdownTagType.SECTION_UNORDERED,
          depth: depth
        });
      }
    } else if (current.depth < previous.depth) {
      for (let depth = previous.depth; depth > current.depth; depth--) {
        this.buffer.push({
          content: [],
          tagType: MarkdownTagType.SECTION_END,
          depth: depth
        });
      }
    } else {
      // do nothing
    }
  }
}
export class SectionedMarkdownSource extends RawMarkdownSource
  implements IMarkdownSource {
  constructor(parent) {
    super(parent);
  }
  parse(line: string): MarkdownWithTagType {
    let val: MarkdownWithTagType;
    val = super.parse(line);
    //look at previous tag and current tag tp determine whether a section
    //should be inserted before returning
    //    this.buffer.push(this.parse(record.replace(/[\r]$/, "")));

    // if (mdTag === MarkdownType.BLOCKQUOTE) {
    //   let sentences = matches[1].match(
    //     /["']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/g
    //   );
    //   console.log(`blockquote: ${sentences!.length}`);
    // }
    //  break;
    //}
    //}
    // split() paragraph to sentences      /["']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/
    return val;
  }
}
