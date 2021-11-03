/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: dataadapter.ts
 *
 * Read line-based modified markdown-format page content

 * Proposed enhancement: detect type of datasource by file
 * extension e.g., .txt, .md, etc)
 *
 * Version history:
 *
 **/
//import * as path from "path";
import * as fs from "fs";
import {
  BaseClass,
  //  UserContext,
  ParseNodeSerializeFormatEnumType
} from "./baseClasses";
//const AppInfo = require(path.resolve("./appinfo.json")); // should use module.paths and find-me.js
//import { MyDate } from "./utilities";
//import { Logger } from "./logger";
import { IPageContent } from "./PageContentType";
// import * as rl from 'readline-sync';
export const enum MarkdownTagType {
  BLOCKQUOTE = "BLOCKQUOTE",
  COMMENT = "COMMENT",
  EMPTY = "EMPTY",
  FILLIN = "FILLIN",
  FILLIN_END = "FILLIN_END",
  HEADING = "HEADING",
  LISTITEM_END = "LISTITEM_END",
  LISTITEM_ORDERED = "LISTITEM_ORDERED",
  LISTITEM_UNORDERED = "LISTITEM_UNORDERED",
  PAGE = "PAGE",
  PAGETITLE = "PAGETITLE",
  PARAGRAPH = "PARAGRAPH",
  PARAGRAPH_END = "PARAGRAPH_END",
  PASSTHRUTAG = "PASSTHRUTAG",
  PHOTOENTRY = "PHOTOENTRY",
  PHOTOENTRY_END = "PHOTOENTRY_END",
  SECTION_END = "SECTION_END",
  SECTION_ORDERED = "SECTION_ORDERED",
  SECTION_UNORDERED = "SECTION_UNORDERED",
  SENTENCE = "SENTENCE",
  TBD = "TBD"
}
// export enum MarkdownSectionTagType {
//   PARAGRAPH = "PARAGRAPH",
//   HEADING = "HEADING",
//   SECTION_ORDERED = "SECTION_ORDERED",
//   SECTION_UNORDERED = "SECTION_UNORDERED",
//   BLOCKQUOTE = "BLOCKQUOTE",
//   PHOTOENTRY = "PHOTOENTRY",
//   FILLIN = "FILLIN",
//   EMPTY = "EMPTY",
//   TBD = "TBD"
// }
// export enum MarkdownItemTagType {
//   LISTITEM_UNORDERED = "LISTITEM_UNORDERED",
//   LISTITEM_ORDERED = "LISTITEM_ORDERED",
//   SENTENCE = "SENTENCE"
// }
// export enum MarkdownTbdTagType {
//   PAGE = "PAGE",
//   COMMENT = "COMMENT",
//   PASSTHRUTAG = "PASSTHRUTAG"
// }
// export enum MarkdownEndTagType {
//   FILLIN_END = "FILLIN_END",
//   LISTITEM_END = "LISTITEM_END",
//   PARAGRAPH_END = "PARAGRAPH_END",
//   PHOTOENTRY_END = "PHOTOENTRY_END",
//   SECTION_END = "SECTION_END"
// }
// export enum MarkdownLastTagType {
//   UNKNOWN = "UNKNOWN" // should always be last
// }
// // interface SectionTag {
// //   tagType: tags
// // }
// export const MarkdownTagType = {
//   ...MarkdownSectionTagType,
//   ...MarkdownItemTagType,
//   ...MarkdownTbdTagType,
//   ...MarkdownEndTagType,
//   ...MarkdownLastTagType
// };
// export type MarkdownTagType =
//   | MarkdownSectionTagType
//   | MarkdownItemTagType
//   | MarkdownTbdTagType
//   | MarkdownEndTagType
//   | MarkdownLastTagType;

// export const enum MarkdownTagType {
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
  PAGETITLE = "PAGETITLE",
  PHOTOENTRY = "PHOTOENTRY",
  PHOTOENTRY_END = "PHOTOENTRY_END",
  TBD = "TBD" // should always be last
}
// const enum MarkDownSectionTagType {
//   SECTION_ORDERED = "SECTION_ORDERED",
//   SECTION_UNORDERED = "SECTION_UNORDERED"
// }

//const pattern_boldtext = /\*\*(.*)\*\*/gim;
//const pattern_italics = /\*(.*)\*/gim;

export interface TaggedStringType {
  content: string;
  tagType: MarkdownTagType;
  depth: number;
  headingLevel: number;
  lineNo: number;
}
// interface RegExpMatchArrayWithTagType {
//   groups: RegExpMatchArray;
//   tag: string;
// }
//type MarkdownClassDictionaryType = Record<MarkdownType, MarkdownTagType>;
/* Each pattern will define one explicit capture group () to
   be returned. Hence. the pattern cannot use the global flag g
   because final output will only include the first group encountered:
   group[1] until a use case requires the expansion of this definition.
*/
interface MarkdownPatternItemType {
  pattern: RegExp;
  tagType: MarkdownTagType;
  //  sectionType: MarkDownSectionTagType
}
type MarkdownPatternDictionaryType = Record<
  MarkdownType,
  MarkdownPatternItemType
>;
///const PARAGRAPH_PATTERN: RegExp = /["']?[A-Z][^.?!]+((?![.?!]['"]?\s["']?[A-Z][^.?!]).)+[.?!'"]+/g;
//const PARAGRAPH_TO_SENTENCES: RegExp = /[^\.\!\?]*[\.\!\?]/;
//const PARAGRAPH_TO_SENTENCES: RegExp = /?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s/m;
const PARAGRAPH_TO_SENTENCES: RegExp = /([\.\?!][\'\"\u2018\u2019\u201c\u201d\)\]]*\s*)(?<!\w\.\w.)(?<![A-Z][a-z][a-z]\.)(?<![A-Z][a-z]\.)(?<![A-Z]\.)\s+/;
// matches the first capture group: standard terminating punctuations and
// the occasional bracketing characters e.g. parentheticals but excluding
// certain other conditions where punctuations are appropriate but not
// necessarily terminating. For instance, certain abbreviations that occur
// at the end of sentence will be incorrectly detected: [A-Z][a-z]\.,
// [A-Z][a-z][a-z]\. But the probability of this is less than that of a
// premature termination based on that same pattern. unicode characters u2018,
// u2019, u201c, u201d correspond to single and double left and right quotes
// respectively.
//
// The negative lookbehind looks backward into the expression to check if the
// text inside the lookbehind can be matched. (?<!a)b matches "b" NOT preceded
// by "a". In this case, it tries to match ellipsis (but ignores invisible
// characters at the end of sentence.

//const PARAGRAPH_TO_SENTENCES2: RegExp = /(?<!\w\.\w.)(?<![A-Z][a-z][a-z]\.)([\.\?!][\"\u2018\u2019\u201c\u201d\)\]]*\s*(?<![A-Z][a-z]\.)(?<![A-Z]\.)\s+)/;
const PARAGRAPH_PATTERN: RegExp = /^([ "'\(]?[A-Za-z0-9\$\@]{1}.*)$/m;
const MarkdownPatternDictionary: MarkdownPatternDictionaryType = {
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
  [MarkdownType.BLOCKQUOTE]: {
    // > takes precedecence of other list item
    pattern: /^\>\s([^\s].*)$/,
    tagType: MarkdownTagType.BLOCKQUOTE
  },
  [MarkdownType.LISTITEM_UNORDERED01]: {
    pattern: /^[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownTagType.LISTITEM_UNORDERED
  },
  [MarkdownType.LISTITEM_UNORDERED02]: {
    pattern: /^\s{2}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownTagType.LISTITEM_UNORDERED
  },
  [MarkdownType.LISTITEM_UNORDERED03]: {
    pattern: /^\s{4}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownTagType.LISTITEM_UNORDERED
  },
  [MarkdownType.LISTITEM_UNORDERED04]: {
    pattern: /^\s{6}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownTagType.LISTITEM_UNORDERED
  },
  [MarkdownType.LISTITEM_ORDERED01]: {
    pattern: /^[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownTagType.LISTITEM_ORDERED
  },
  [MarkdownType.LISTITEM_ORDERED02]: {
    pattern: /^\s{2}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownTagType.LISTITEM_ORDERED
  },
  [MarkdownType.LISTITEM_ORDERED03]: {
    pattern: /^\s{4}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownTagType.LISTITEM_ORDERED
  },
  [MarkdownType.LISTITEM_ORDERED04]: {
    pattern: /^\s{6}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownTagType.LISTITEM_ORDERED
  },
  [MarkdownType.PARAGRAPH]: {
    pattern: PARAGRAPH_PATTERN,
    tagType: MarkdownTagType.PARAGRAPH
  },
  [MarkdownType.COMMENT1]: {
    pattern: /^\[\/\/\]:\s(.*)$/,
    tagType: MarkdownTagType.COMMENT
  },
  [MarkdownType.COMMENT2]: {
    pattern: /^\[\]:\s(.*)$/,
    tagType: MarkdownTagType.COMMENT
  },
  [MarkdownType.COMMENT3]: {
    pattern: /^\[comment]:\s(.*)$/,
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
  [MarkdownType.PAGETITLE]: {
    pattern: /\[\/\/page title\]:\s(.*)/i,
    tagType: MarkdownTagType.PAGETITLE
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
  [MarkdownType.EMPTY]: {
    pattern: /^\s*$/,
    tagType: MarkdownTagType.EMPTY
  },
  [MarkdownType.TBD]: { pattern: /(.*)$/, tagType: MarkdownTagType.TBD }
};

export interface IDataSource {
  connect(fileName: string): number;
  disconnect(): void;
  parse(
    depth: number,
    buffer: string[],
    current: number,
    resultBuffer: TaggedStringType[]
  ): number;
  currentIdx(): number;
  currentRecord(): TaggedStringType;
  firstRecord(): TaggedStringType;
  length(): number;
  nextRecord(): TaggedStringType;
  previousRecord(): TaggedStringType;
  EOF(): boolean;
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    prefix?: string,
    colWidth0?: number,
    colWidth1?: number,
    colWidth2?: number,
    colWidth3?: number,
    colWidth4?: number
  ): string;

  //  buffer: TaggedStringType[]
}
abstract class MarkdownSource extends BaseClass implements IDataSource {
  protected buffer: TaggedStringType[] = [];
  protected pageContent!: IPageContent;
  protected bufferIdx: number = -1;
  constructor(parent: any) {
    super(parent);
    //Object.defineProperty(this, "dataSource", { enumerable: false });
    // Object.defineProperty(this, "buffer", { enumerable: false });
    // Object.defineProperty(this, "bufferIdx", { enumerable: false });
  }
  abstract connect(fileName: string): number;
  disconnect(): void {
    this.buffer = [];
    // OR this.buffer.length = 0;
  }
  abstract parse(
    depth: number,
    inputBuffer: string[],
    current: number,
    resultBuffer: TaggedStringType[]
  ): number;
  currentIdx() {
    return this.bufferIdx;
  }
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
    this.bufferIdx = Math.min(this.bufferIdx + 1, this.buffer.length);
    return this.buffer[this.bufferIdx];
  }
  previousRecord(): TaggedStringType {
    // could throw TypeError upon access attempt
    this.bufferIdx = this.bufferIdx === 0 ? 0 : this.bufferIdx - 1;
    return this.buffer[this.bufferIdx];
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    prefix?: string,
    colWidth0?: number,
    colWidth1?: number,
    colWidth2?: number,
    colWidth3?: number,
    colWidth4?: number
  ): string {
    if (prefix === undefined) prefix = "";
    if (colWidth0 === undefined) colWidth0 = 5;
    if (colWidth1 === undefined) colWidth1 = 50;
    if (colWidth2 === undefined) colWidth2 = 5;
    if (colWidth3 === undefined) colWidth3 = 5;
    if (colWidth4 === undefined) colWidth4 = 10;
    let outputStr: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TABULAR: {
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
            current.lineNo > 0
              ? `[${zeroPad(current.lineNo, colWidth2 - 2)}]` // line no.
              : " ".padEnd(5);
          let lvl =
            current.headingLevel > 0
              ? "(lvl=" + numToStr(current.headingLevel) + ")"
              : "";
          outputStr =
            outputStr +
            `${zeroPad(lineNo + 1, colWidth0 - 2)}: ${content.padEnd(
              colWidth1
            )}${content.length > 0 ? " " : ""}${lineNoStr} ${
              current.depth > 0 ? numToStr(current.depth) : "-"
            } ${current.tagType} ${lvl}\n`;
          lineNo++;
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST:
        {
          outputStr = JSON.stringify(this); // , this.StringifyReplacerForParseTest
        }
        break;
    }
    return outputStr;
  }
}
export class RawMarkdownSource extends MarkdownSource implements IDataSource {
  readonly parent: any;
  constructor(parent: any) {
    super(parent);
  }
  connect(fileName: string): number {
    let inputBuffer: string[];
    //    this.logger.diagnosticMode = true;
    this.logger.diagnostic(`input file: ${fileName}`);
    inputBuffer = fs
      .readFileSync(fileName)
      .toString()
      .replace(/[\u2018\u2019]/g, "'") // single left quote to apostrophe
      // .replace(/\u2018/g, "'") // single left quote to apostrophe
      // .replace(/\u2019/g, "'") // single left quote to apostrophe
      .replace(/\[u201C\u201D]/g, '\"') // double left quote to double quote
      // .replace(/\u201C/g, '\"') // double right quote to double quote
      .replace(/\r/g, "") // double right quote to double quote
      .replace(/[\u0000-\u0008]+/g,"") // non-printables
      .replace(/[\u0009]+/g,"\t") // non-printables
      .split("\n");

    let inputCount = this.parse(0, inputBuffer, 0, this.buffer);

    if (this.logger.warnings() > 0) {
      this.logger.warning(
        `Encountered ${this.logger.warnings()} warning${
          this.logger.warnings() === 1 ? "" : "s"
        } parsing '${fileName}'`
      );
    }
    this.bufferIdx = 0;
    return inputCount;
  }
  parse(
    depth: number,
    inputBuffer: string[],
    currentIdx: number,
    resultBuffer: TaggedStringType[]
  ): number {
    // recursive descent
    if (currentIdx < inputBuffer.length) {
      let result: TaggedStringType = {
        content: "",
        tagType: MarkdownTagType.TBD,
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
        result.tagType = MarkdownTagType.EMPTY;
      } else {
        match = inputBuffer[currentIdx].match(/^(.*)$/)!;
        result.content = match[1];
        result.tagType = MarkdownTagType.TBD;
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
  constructor(parent: any) {
    super(parent);
    Object.defineProperty(this, "_logger", { enumerable: false });
    Object.defineProperty(this, "_parent", { enumerable: false });
  }
  private parseParagraph(
    depth: number,
    current: TaggedStringType,
    resultBuffer: TaggedStringType[]
  ) {
    // if (current.content === undefined) {
    //   resultBuffer.push({
    //     content: "",
    //     tagType: MarkdownTagType.EMPTY,
    //     depth: depth,
    //     headingLevel: 0,
    //     lineNo: current.lineNo
    //   });
    //   return;
    // }
    let sentences = current.content.split(PARAGRAPH_TO_SENTENCES);
    resultBuffer.push({
      content: "[PARAGRAPH]",
      tagType: MarkdownTagType.PARAGRAPH,
      depth: current.depth, //+ 1
      headingLevel: 0,
      lineNo: current.lineNo
    });
    try {
      for (
        let sentenceIdx = 0;
        sentenceIdx < sentences.length;
        sentenceIdx = sentenceIdx + 2 // [odd] capture group (setnence) followed by [evem] terminator
      ) {
        this.logger.diagnostic(
          `sentence[${sentenceIdx}]=${sentences[sentenceIdx] +
            (sentences[sentenceIdx + 1] !== undefined
              ? sentences[sentenceIdx + 1]
              : "")}`
        );
        resultBuffer.push({
          content:
            sentences[sentenceIdx] +
            (sentences[sentenceIdx + 1] !== undefined
              ? sentences[sentenceIdx + 1]
              : ""),
          tagType: MarkdownTagType.SENTENCE,
          depth: current.depth, //+ 1
          headingLevel: 0,
          lineNo: current.lineNo
        });
      }
    } catch (e) {
      this.logger.error(
        `unexpected error encountered parsing sentences at line ${current.lineNo}`
      );
    }
    resultBuffer.push({
      content: "[PARAGRAPH END]",
      tagType: MarkdownTagType.PARAGRAPH_END,
      depth: depth, //+ 1
      headingLevel: 0,
      lineNo: current.lineNo
    });
  }
  private lookup(mdString: string): TaggedStringType {
    let mdTag: MarkdownType = MarkdownType.TBD;
    let depth: number = 0;
    let matches: RegExpMatchArray = [];
    for (mdTag in MarkdownPatternDictionary) {
      let regexpPattern = MarkdownPatternDictionary[mdTag].pattern;
      if (regexpPattern.test(mdString)) {
        matches = mdString.match(regexpPattern)!; // full match, capture groups
        depth = Number.isNaN((depth = parseInt(mdTag.slice(-2)))) ? 0 : depth;
        break;
      }
    }
    return {
      content: matches.length > 0 ? matches[1] : "",
      tagType: MarkdownPatternDictionary[mdTag].tagType,
      depth:
        MarkdownPatternDictionary[mdTag].tagType !== MarkdownTagType.HEADING
          ? depth
          : 0,
      headingLevel:
        MarkdownPatternDictionary[mdTag].tagType === MarkdownTagType.HEADING
          ? depth
          : 0,
      lineNo: 0
    };
  }
  parse(
    depth: number,
    inputBuffer: string[],
    currentInputIdx: number,
    resultBuffer: TaggedStringType[]
  ): number {
    if (currentInputIdx > inputBuffer.length) {
      return inputBuffer.length; // EOF
    }
    let idx: number = 0;
    for (idx = currentInputIdx; idx < inputBuffer.length; idx++) {
      let current: TaggedStringType = this.lookup(inputBuffer[idx]);
      //this.logger.diagnosticMode = true;
      current.lineNo = idx + 1;
      this.logger.diagnostic(
        `markdown looking up: "${inputBuffer[idx]}" as ${current.tagType} at line ${current.lineNo}`
      );
      if (current.depth < depth) {
        // just pop call stack and allow completion of (current.depth > depth)
        //  condition handle it (recursively)
        return idx;
      } else if (current.depth > depth) {
        resultBuffer.push({
          content: `[SECTION START AT DEPTH ${depth + 1}]`,
          tagType:
            current.tagType === MarkdownTagType.LISTITEM_ORDERED
              ? MarkdownTagType.SECTION_ORDERED
              : MarkdownTagType.SECTION_UNORDERED,
          depth: depth + 1,
          headingLevel: 0,
          lineNo: current.lineNo
        });
        idx = this.parse(depth + 1, inputBuffer, idx, resultBuffer) - 1;
        // decrement to reposition at previous record so next pass (which increments) can
        // parse this record. OR could distribute idx++
        resultBuffer.push({
          content: `[SECTION END AT DEPTH ${depth + 1}]`,
          tagType: MarkdownTagType.SECTION_END,
          depth: depth + 1,
          headingLevel: 0,
          lineNo: current.lineNo
        });
      } else {
        switch (current.tagType) {
          case MarkdownTagType.PAGETITLE: {
            resultBuffer.push(current);
            break;
          }
          case MarkdownTagType.EMPTY: {
            this.buffer.push(current); //EMPTY
            break;
          }
          case MarkdownTagType.HEADING: {
            resultBuffer.push(current);
            break;
          }
          case MarkdownTagType.LISTITEM_ORDERED:
          case MarkdownTagType.LISTITEM_UNORDERED: {
            resultBuffer.push({
              content: `[LIST ITEM START AT DEPTH ${depth}]`,
              tagType: current.tagType,
              // current.tagType === MarkdownTagType.LISTITEM_ORDERED
              //   ? MarkdownTagType.SECTION_ORDERED
              //   : MarkdownTagType.SECTION_UNORDERED,
              depth: depth,
              headingLevel: 0,
              lineNo: current.lineNo
            });
            this.parseParagraph(current.depth, current, this.buffer);
            resultBuffer.push({
              content: `[LIST ITEM END AT DEPTH ${depth}]`,
              tagType: MarkdownTagType.LISTITEM_END,
              // current.tagType === MarkdownTagType.LISTITEM_ORDERED
              //   ? MarkdownTagType.LISTITEM_ORDERED
              //   : MarkdownTagType.LISTITEM_UNORDERED,
              depth: depth,
              headingLevel: 0,
              lineNo: current.lineNo
            });
            break;
          }
          case MarkdownTagType.BLOCKQUOTE: {
            resultBuffer.push({
              content: `[BLOCKQUOTE START ${depth}]`,
              tagType: MarkdownTagType.BLOCKQUOTE,
              depth: current.depth,
              headingLevel: current.headingLevel,
              lineNo: current.lineNo
            });
            this.parseParagraph(current.depth, current, this.buffer);
            resultBuffer.push({
              content: `[BLOCKQUOTE END ${depth}]`,
              tagType: MarkdownTagType.SECTION_END,
              depth: current.depth,
              headingLevel: current.headingLevel,
              lineNo: current.lineNo
            });
            break;
          }
          case MarkdownTagType.PARAGRAPH: {
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
