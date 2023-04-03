/***
 * Read line-based modified markdown-format page content
 */
import * as path from "path";
import * as fs from "fs";
const AppInfo = require(path.resolve("./appinfo.json")); // should use module.paths and find-me.js
import { Logger, BaseClass, MyDate, UserContext } from "./utilities";
import { IPageContent } from "./PageContentType";
// import * as rl from 'readline-sync';

export enum MarkdownSectionTagType {
  PARAGRAPH = "PARAGRAPH",
  HEADING = "HEADING",
  SECTION_ORDERED = "SECTION_ORDERED",
  SECTION_UNORDERED = "SECTION_UNORDERED",
  BLOCKQUOTE = "BLOCKQUOTE",
  PHOTOENTRY = "PHOTOENTRY",
  FILLIN = "FILLIN"
}
export enum MarkdownItemTagType {
  EMPTY = "EMPTY",
  LISTITEM_UNORDERED = "LISTITEM_UNORDERED",
  LISTITEM_ORDERED = "LISTITEM_ORDERED",
  SENTENCE = "SENTENCE"
}
export enum MarkdownTbdTagType {
  PAGE = "PAGE",
  COMMENT = "COMMENT",
  PASSTHRUTAG = "PASSTHRUTAG"
}
export enum MarkdownEndTagType {
  FILLIN_END = "FILLIN_END",
  LISTITEM_END = "LISTITEM_END",
  PARAGRAPH_END = "PARAGRAPH_END",
  PHOTOENTRY_END = "PHOTOENTRY_END",
  SECTION_END = "SECTION_END"
}
export enum MarkdownLastTagType {
  UNKNOWN = "UNKNOWN" // should always be last
}
export const MarkdownRecordType = {
  ...MarkdownSectionTagType,
  ...MarkdownItemTagType,
  ...MarkdownTbdTagType,
  ...MarkdownEndTagType,
  ...MarkdownLastTagType
};
// type MarkdownRecordType =
//   | MarkdownParsedTagType
//   | MarkdownTbdTagType
//   | MarkdownNonparsedType
//   | MarkdownLastTagType;
// export const enum MarkdownRecordType {
//   PARAGRAPH = "PARAGRAPH",
//   PARAGRAPH_END = "PARAGRAPH_END",
//   EMPTY = "EMPTY",
//   HEADING = "HEADING",
//   SECTION_ORDERED = "SECTION_ORDERED",
//   SECTION_UNORDERED = "SECTION_UNORDERED",
//   SECTION_FILLIN = "SECTION_FILLIN",
//   SECTION_PHOTOENTRY = "SECTION_PHOTOENTRY_START",
//   SECTION_PHOTOENTRY_END = "SECTION_PHOTOENTRY_END",
//   SECTION_END = "SECTION_END",
//   LISTITEM_UNORDERED = "LISTITEM_UNORDERED",
//   LISTITEM_ORDERED = "LISTITEM_ORDERED",
//   COMMENT = "COMMENT",
//   BLOCKQUOTE = "BLOCKQUOTE",
//   PASSTHRUTAG = "PASSTHRUTAG",
//   PHOTOENTRY = "PHOTOENTRY",
//   PHOTOENTRY_END = "PHOTOENTRY_END",
//   FILLIN = "FILLIN",
//   FILLIN_END = "FILLIN_END",
//   PAGE = "PAGE",
//   SENTENCE = "SENTENCE",
//   UNKNOWN = "UNKNOWN" // should always be last
// }
export const enum MarkdownType {
  BLOCKQUOTE = "BLOCKQUOTE",
  PARAGRAPH = "PARAGRAPH",
  EMPTY = "EMPTY",
  HEADING01 = "HEADING01",
  HEADING02 = "HEADING02",
  HEADING03 = "HEADING03",
  HEADING04 = "HEADING04",
  HEADING05 = "HEADING05",
  HEADING06 = "HEADING06",
  LISTITEM_UNORDERED01 = "LISTITEM_UNORDERED01",
  LISTITEM_UNORDERED02 = "LISTITEM_UNORDERED02",
  LISTITEM_UNORDERED03 = "LISTITEM_UNORDERED03",
  LISTITEM_UNORDERED04 = "LISTITEM_UNORDERED04",
  LISTITEM_ORDERED01 = "LISTITEM_ORDERED01",
  LISTITEM_ORDERED02 = "LISTITEM_ORDERED02",
  LISTITEM_ORDERED03 = "LISTITEM_ORDERED03",
  LISTITEM_ORDERED04 = "LISTITEM_ORDERED04",
  COMMENT1 = "COMMENT1",
  COMMENT2 = "COMMENT2",
  COMMENT3 = "COMMENT3",
  PASSTHRUTAG = "PASSTHRUTAG",
  FILLIN = "LIST_FILLIN",
  FILLIN_END = "LIST_FILLIN_END",
  PAGE = "PAGE",
  PHOTOENTRY = "PHOTOENTRY",
  PHOTOENTRY_END = "PHOTOENTRY_END",
  UNKNOWN = "UNKNOWN" // should always be last
}
const enum MarkDownSectionTagType {
  SECTION_ORDERED = "SECTION_ORDERED",
  SECTION_UNORDERED = "SECTION_UNORDERED"
}

//const pattern_boldtext = /\*\*(.*)\*\*/gim;
//const pattern_italics = /\*(.*)\*/gim;

export interface TaggedStringType {
  content: string;
  tagType: MarkdownRecordType;
  depth: number;
  headingLevel: number;
  lineNo: number;
}
// interface RegExpMatchArrayWithTagType {
//   groups: RegExpMatchArray;
//   tag: string;
// }
//type MarkdownClassDictionaryType = Record<MarkdownType, MarkdownRecordType>;
/* Each pattern will define one explicit capture group () to
   be returned. Hence. the pattern cannot use the global flag g
   because final output will only include the first group encountered:
   group[1] until a use case requires the expansion of this definition.
*/
interface MarkdownPatternItemType {
  pattern: RegExp;
  tagType: MarkdownRecordType;
  //  sectionType: MarkDownSectionTagType
}
type MarkdownPatternDictionaryType = Record<
  MarkdownType,
  MarkdownPatternItemType
>;
///const PARAGRAPH_PATTERN: RegExp = /["']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/g;
//const PARAGRAPH_TO_SENTENCES: RegExp = /[^\.\!\?]*[\.\!\?]/;
//const PARAGRAPH_TO_SENTENCES: RegExp = /?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/m;
const PARAGRAPH_TO_SENTENCES1: RegExp = /([\.\?!][\'\"\u2018\u2019\u201c\u201d\)\]]*\s*)(?<!\w\.\w.)(?<![A-Z][a-z][a-z]\.)(?<![A-Z][a-z]\.)(?<![A-Z]\.)\s+/;
// matches the first capture group: standard terminating punctuations and
// the occasional bracketing characters e.g. parentheticals but excluding
// certain other conditions where punctuations are appropriate but not
// necessarily terminating. For instance, certain abbreviations that occur
// at the end of sentence will be incorrectly detected: [A-Z][a-z]\.,
// [A-Z][a-z][a-z]\. But the probability of this is less than that of a
// premature termination based on that same pattern

//const PARAGRAPH_TO_SENTENCES2: RegExp = /(?<!\w\.\w.)(?<![A-Z][a-z][a-z]\.)([\.\?!][\"\u2018\u2019\u201c\u201d\)\]]*\s*(?<![A-Z][a-z]\.)(?<![A-Z]\.)\s+)/;
const PARAGRAPH_PATTERN: RegExp = /^(["']?[A-Za-z\$\@]{1}.*)$/m;
const MarkdownPatternDictionary: MarkdownPatternDictionaryType = {
  [MarkdownType.PARAGRAPH]: {
    pattern: PARAGRAPH_PATTERN,
    tagType: MarkdownRecordType.PARAGRAPH
  },
  [MarkdownType.EMPTY]: { pattern: /^\s*$/, tagType: MarkdownRecordType.EMPTY },
  [MarkdownType.HEADING01]: {
    pattern: /^#\s([^\s].*)$/,
    tagType: MarkdownRecordType.HEADING
  },
  [MarkdownType.HEADING02]: {
    pattern: /^##\s([^\s].*)$/,
    tagType: MarkdownRecordType.HEADING
  },
  [MarkdownType.HEADING03]: {
    pattern: /^###\s([^\s].*)$/,
    tagType: MarkdownRecordType.HEADING
  },
  [MarkdownType.HEADING04]: {
    pattern: /^####\s([^\s].*)$/,
    tagType: MarkdownRecordType.HEADING
  },
  [MarkdownType.HEADING05]: {
    pattern: /^#####\s([^\s].*)$/,
    tagType: MarkdownRecordType.HEADING
  },
  [MarkdownType.HEADING06]: {
    pattern: /^######\s([^\s].*)$/,
    tagType: MarkdownRecordType.HEADING
  },
  [MarkdownType.LISTITEM_UNORDERED01]: {
    pattern: /^[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownRecordType.LISTITEM_UNORDERED
  },
  [MarkdownType.LISTITEM_UNORDERED02]: {
    pattern: /^\s{2}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownRecordType.LISTITEM_UNORDERED
  },
  [MarkdownType.LISTITEM_UNORDERED03]: {
    pattern: /^\s{4}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownRecordType.LISTITEM_UNORDERED
  },
  [MarkdownType.LISTITEM_UNORDERED04]: {
    pattern: /^\s{6}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownRecordType.LISTITEM_UNORDERED
  },
  [MarkdownType.LISTITEM_ORDERED01]: {
    pattern: /^[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownRecordType.LISTITEM_ORDERED
  },
  [MarkdownType.LISTITEM_ORDERED02]: {
    pattern: /^\s{2}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownRecordType.LISTITEM_ORDERED
  },
  [MarkdownType.LISTITEM_ORDERED03]: {
    pattern: /^\s{4}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownRecordType.LISTITEM_ORDERED
  },
  [MarkdownType.LISTITEM_ORDERED04]: {
    pattern: /^\s{6}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownRecordType.LISTITEM_ORDERED
  },
  [MarkdownType.BLOCKQUOTE]: {
    pattern: /^\>\s([^\s].*)$/,
    tagType: MarkdownRecordType.BLOCKQUOTE
  },
  [MarkdownType.COMMENT1]: {
    pattern: /^\[\/\/\]:\s(.*)$/,
    tagType: MarkdownRecordType.COMMENT
  },
  [MarkdownType.COMMENT2]: {
    pattern: /^\[\]:\s(.*)$/,
    tagType: MarkdownRecordType.COMMENT
  },
  [MarkdownType.COMMENT3]: {
    pattern: /^\[comment]:\s(.*)$/,
    tagType: MarkdownRecordType.COMMENT
  },
  [MarkdownType.PHOTOENTRY]: {
    pattern: /\[\/\/photo-entry\]:\s(image=.*)$/i,
    tagType: MarkdownRecordType.PHOTOENTRY
  },
  [MarkdownType.PHOTOENTRY_END]: {
    pattern: /\[\/\/photo-entry-end\]$/i,
    tagType: MarkdownRecordType.PHOTOENTRY_END
  },
  [MarkdownType.PAGE]: {
    pattern: /\[\/\/page\]:\s(.*)$/i,
    tagType: MarkdownRecordType.PAGE
  },
  [MarkdownType.FILLIN]: {
    pattern: /\[\/\/fill-in\]:(.*)$/,
    tagType: MarkdownRecordType.FILLIN
  },
  [MarkdownType.FILLIN_END]: {
    pattern: /\[\/\/fill-in-end\]$/,
    tagType: MarkdownRecordType.FILLIN_END
  },
  [MarkdownType.PASSTHRUTAG]: {
    pattern: /^\[\/\/([A-Za-z\-]*)\]:\s([^\s].*)$/,
    tagType: MarkdownRecordType.PASSTHRUTAG
  },
  [MarkdownType.UNKNOWN]: { pattern: /(.*)$/, tagType: MarkdownRecordType.UNKNOWN }
};

export interface IDataSource {
  connect(fileName: string): number;
  parse(
    depth: number,
    buffer: string[],
    current: number,
    resultBuffer: TaggedStringType[]
  ): number;
  currentRecord(): TaggedStringType;
  firstRecord(): TaggedStringType;
  length(): number;
  nextRecord(): TaggedStringType;
  EOF(): boolean;
  serialize();
  //  buffer: TaggedStringType[]
}
abstract class MarkdownSource extends BaseClass implements IDataSource {
  protected buffer: TaggedStringType[] = [];
  protected pageContent!: IPageContent;
  protected bufferIdx: number = 0;
  constructor(parent) {
    super(parent);
  }
  abstract connect(fileName: string): number;
  abstract parse(
    depth: number,
    inputBuffer: string[],
    current: number,
    resultBuffer: TaggedStringType[]
  ): number;
  currentRecord(): TaggedStringType {
    // could throw TypeError upon access attempt
    return this.buffer[this.bufferIdx];
  }
  EOF(): boolean {
    return this.bufferIdx > this.buffer.length - 1;
  }
  firstRecord(): TaggedStringType {
    // could throw TypeError upon access attempt
    this.bufferIdx = 0;
    return this.buffer[this.bufferIdx];
  }
  length(): number {
    return this.buffer.length;
  }
  nextRecord(): TaggedStringType {
    // could throw TypeError upon access attempt
    this.bufferIdx++;
    return this.buffer[this.bufferIdx];
  }
  serialize() {
    const zeroPad = (num: number, places: number) =>
      String(num).padStart(places, "0");
    const numToStr = (depth: number) => (depth >= 0 ? `${depth}` : ``);
    let lineNo: number = 0;
    for (
      let current = this.firstRecord();
      !this.EOF();
      current = this.nextRecord()
    ) {
      //      current = this.currentRecord();
      let content =
        current.content === undefined ? "(undefined)" : current.content;
      let lineNoStr: string =
        current.lineNo > 0 ? `[${zeroPad(current.lineNo, 3)}]` : "     ";
      let lvl =
        current.headingLevel > 0
          ? "(lvl=" + numToStr(current.headingLevel) + ")"
          : "";
      console.log(
        `${zeroPad(lineNo + 1, 3)}: ${content.padEnd(35)}${
          content.length > 0 ? " " : ""
        }${lineNoStr} ${current.depth > 0 ? numToStr(current.depth) : "-"} ${
          current.tagType
        } ${lvl}`
      );
      lineNo++;
    }
  }
}
export class RawMarkdownSource extends MarkdownSource implements IDataSource {
  readonly parent: any;
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
      .replace(/[\r]/g, "")
      .split("\n");

    let inputCount = this.parse(0, inputBuffer, 0, this.buffer);

    if (this.logger.warnings() > 0) {
      this.logger.warning(
        `Encountered ${this.logger.warnings()} warning${
          this.logger.warnings() === 1 ? "" : "s"
        } parsing '${fileName}'`
      );
    }
    return inputCount;
  }
  parse(
    depth,
    inputBuffer: string[],
    currentIdx: number,
    resultBuffer: TaggedStringType[]
  ): number {
    // recursive descent
    if (currentIdx < inputBuffer.length) {
      let result: TaggedStringType = {
        content: "",
        tagType: MarkdownRecordType.UNKNOWN,
        depth: depth,
        headingLevel: 0,
        lineNo: currentIdx + 1
      };
      let match: RegExpMatchArray = [];
      if (
        MarkdownPatternDictionary[MarkdownType.EMPTY].pattern.test(
          inputBuffer[currentIdx]
        )
      ) {
        result.content = inputBuffer[currentIdx];
        result.tagType = MarkdownRecordType.EMPTY;
      } else {
        match = inputBuffer[currentIdx].match(/^(.*)$/)!;
        result.content = match[1];
        result.tagType = MarkdownRecordType.UNKNOWN;
      }
      this.buffer.push(result);
      this.parse(depth, inputBuffer, currentIdx + 1, resultBuffer);
    }
    return 0;
  }
}
export class BasicMarkdownSource extends RawMarkdownSource
  implements IDataSource {
  buffer: TaggedStringType[] = [];
  constructor(parent) {
    super(parent);
  }
  private parseParagraph(
    depth: number,
    current: TaggedStringType,
    resultBuffer: TaggedStringType[]
  ) {
    // if (current.content === undefined) {
    //   resultBuffer.push({
    //     content: "",
    //     tagType: MarkdownRecordType.EMPTY,
    //     depth: depth,
    //     headingLevel: 0,
    //     lineNo: current.lineNo
    //   });
    //   return;
    // }
    let sentences = current.content.split(PARAGRAPH_TO_SENTENCES1);
    resultBuffer.push({
      content: "[PARAGRAPH]",
      tagType: MarkdownRecordType.PARAGRAPH,
      depth: current.depth, //+ 1
      headingLevel: 0,
      lineNo: 0
    });
    try {
      for (
        let sentenceIdx = 0;
        sentenceIdx <= sentences.length - 1;
        sentenceIdx = sentenceIdx + 2
      ) {
        resultBuffer.push({
          content:
            sentences[sentenceIdx] +
            (sentences[sentenceIdx + 1] !== undefined
              ? sentences[sentenceIdx + 1]
              : ""),
          tagType: MarkdownRecordType.SENTENCE,
          depth: current.depth, //+ 1
          headingLevel: 0,
          lineNo: current.lineNo
        });
      }
    } catch (e) {
      console.log(`unexpected error encountered parsing sentences`);
    }
    resultBuffer.push({
      content: "[PARAGRAPH END]",
      tagType: MarkdownRecordType.PARAGRAPH_END,
      depth: depth, //+ 1
      headingLevel: 0,
      lineNo: 0
    });
  }
  private lookup(mdString: string): TaggedStringType {
    let mdTag: MarkdownType = MarkdownType.UNKNOWN;
    let currentDepth: number = 0;
    let matches: RegExpMatchArray = [];
    for (mdTag in MarkdownPatternDictionary) {
      let regexpPattern = MarkdownPatternDictionary[mdTag].pattern;
      if (regexpPattern.test(mdString)) {
        matches = mdString.match(regexpPattern)!; // full match, capture groups
        currentDepth = Number.isNaN((currentDepth = parseInt(mdTag.slice(-2))))
          ? 0
          : currentDepth;
        break;
      }
    }
    return {
      content: matches.length > 0 ? matches[1] : "",
      tagType: MarkdownPatternDictionary[mdTag].tagType,
      depth:
        MarkdownPatternDictionary[mdTag].tagType !== MarkdownRecordType.HEADING
          ? currentDepth
          : 0,
      headingLevel:
        MarkdownPatternDictionary[mdTag].tagType === MarkdownRecordType.HEADING
          ? currentDepth
          : 0,
      lineNo: 0
    };
  }
  // parseSave(
  //   depth: number,
  //   inputBuffer: string[],
  //   currentInputIdx: number,
  //   resultBuffer: TaggedStringType[]
  // ): number {
  //   if (currentInputIdx > inputBuffer.length - 1) {
  //     return inputBuffer.length; // EOF
  //   }
  //   let current: TaggedStringType = this.lookup(inputBuffer[currentInputIdx]);
  //   console.log(
  //     `***PARSE: ${current.content} ${current.tagType} ${current.depth}`
  //   );
  //   switch (current.tagType) {
  //     case MarkdownRecordType.EMPTY: {
  //       this.buffer.push(current); //EMPTY
  //     }
  //     case MarkdownRecordType.HEADING: {
  //       console.log(`   heading ${current.content}`);
  //       // ignore changes in currentDepth for now until headings e.g. <h1> are
  //       // treated as section headers
  //       resultBuffer.push(current);
  //       break;
  //     }
  //     case MarkdownRecordType.LISTITEM_ORDERED:
  //     case MarkdownRecordType.LISTITEM_UNORDERED: {
  //       //        const InitialListDepth = 0;
  //       console.log(`   list item ${current.content}`);
  //       currentInputIdx = this.parseList(
  //         depth,
  //         inputBuffer,
  //         currentInputIdx,
  //         current,
  //         resultBuffer
  //       );
  //       break;
  //     }
  //     case MarkdownRecordType.BLOCKQUOTE: {
  //       console.log(`   block quote ${current.content}`);
  //       this.parseParagraph(current.depth, current, this.buffer);
  //       break;
  //     }
  //     case MarkdownRecordType.PARAGRAPH: {
  //       console.log(`   paragraph ${current.content}`);
  //       this.parseParagraph(current.depth, current, this.buffer);
  //       break;
  //     }
  //     default: {
  //       console.log(`   default ${current.content}`);
  //       resultBuffer.push(current);
  //     }
  //   } //end switch
  //   return this.parse(depth, inputBuffer, currentInputIdx + 1, resultBuffer); //parse next record
  // }
  //
  parse(
    depth: number,
    inputBuffer: string[],
    currentInputIdx: number,
    resultBuffer: TaggedStringType[]
  ): number {
    let idx: number = inputBuffer.length - 1;
    if (currentInputIdx > inputBuffer.length - 1) {
      return idx; // EOF
    }
    for (idx = currentInputIdx; idx < inputBuffer.length - 1; idx++) {
      let current: TaggedStringType = this.lookup(inputBuffer[idx]);
      current.lineNo = idx + 1;
      if (current.depth < depth) {
        // just pop call stack and allow completion of (current.depth > depth)
        //  condition handle it (recursively)
        return idx;
      } else if (current.depth > depth) {
        resultBuffer.push({
          content: `[SECTION START AT DEPTH ${depth + 1}]`,
          tagType:
            current.tagType === MarkdownRecordType.LISTITEM_ORDERED
              ? MarkdownRecordType.SECTION_ORDERED
              : MarkdownRecordType.SECTION_UNORDERED,
          depth: depth + 1,
          headingLevel: 0,
          lineNo: 0
        });
        idx = this.parse(depth + 1, inputBuffer, idx, resultBuffer) - 1;
        //reposition to previous record so next pass (which increments) can
        // parse this record. OR could distribute idx++
        resultBuffer.push({
          content: `[SECTION END AT DEPTH ${depth + 1}]`,
          tagType: MarkdownRecordType.SECTION_END,
          depth: depth + 1,
          headingLevel: 0,
          lineNo: 0
        });
      } else {
        switch (current.tagType) {
          case MarkdownRecordType.EMPTY: {
            this.buffer.push(current); //EMPTY
            break;
          }
          case MarkdownRecordType.HEADING: {
            resultBuffer.push(current);
            break;
          }
          case MarkdownRecordType.LISTITEM_ORDERED:
          case MarkdownRecordType.LISTITEM_UNORDERED: {
            resultBuffer.push({
              content: `[LIST ITEM START AT DEPTH ${depth}]`,
              tagType: current.tagType,
              // current.tagType === MarkdownRecordType.LISTITEM_ORDERED
              //   ? MarkdownRecordType.SECTION_ORDERED
              //   : MarkdownRecordType.SECTION_UNORDERED,
              depth: depth,
              headingLevel: 0,
              lineNo: 0
            });
            this.parseParagraph(current.depth, current, this.buffer);
            resultBuffer.push({
              content: `[LIST ITEM END AT DEPTH ${depth}]`,
              tagType: MarkdownRecordType.LISTITEM_END,
              // current.tagType === MarkdownRecordType.LISTITEM_ORDERED
              //   ? MarkdownRecordType.LISTITEM_ORDERED
              //   : MarkdownRecordType.LISTITEM_UNORDERED,
              depth: depth,
              headingLevel: 0,
              lineNo: 0
            });

            break;
          }
          case MarkdownRecordType.BLOCKQUOTE: {
            this.parseParagraph(current.depth, current, this.buffer);
            break;
          }
          case MarkdownRecordType.PARAGRAPH: {
            this.parseParagraph(current.depth, current, this.buffer);
            break;
          }
          default: {
            resultBuffer.push(current);
          }
        } //end switch
      }
    }
    return idx; //parse next record
  }
}
