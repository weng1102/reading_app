/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
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
// MarkdownRecordType generalizes record type actually encountered as
// MarkdownRecordTagType in the markdown files. E.g., HEADING vs HEADING01
export const enum MarkdownRecordType {
  BLOCKQUOTE = "BLOCKQUOTE",
  BUTTONGRID = "BUTTONGRID",
  BUTTONGRID_END = "BUTTONGRID_END",
  COMMENT = "COMMENT",
  EMPTY = "EMPTY",
  GROUPFILLIN = "GROUPFILLIN_SECTION",
  GROUPFILLIN_END = "GROUPFILLIN_SECTION_END",
  FILLIN = "FILLIN_SECTION",
  FILLIN_END = "FILLIN_SECTION_END",
  HEADING = "HEADING",
  // HEADINGLABELED = "HEADINGLABELED",
  LISTITEM_END = "LISTITEM_END",
  LISTITEM_ORDERED = "LISTITEM_ORDERED",
  LISTITEM_UNORDERED = "LISTITEM_UNORDERED",
  PAGE = "PAGE",
  PAGETITLE = "PAGETITLE",
  PARAGRAPH = "PARAGRAPH",
  PARAGRAPH_END = "PARAGRAPH_END",
  PASSTHRUTAG = "PASSTHRUTAG",
  IMAGEENTRY = "IMAGEENTRY",
  IMAGEENTRY_END = "IMAGEENTRY_END",
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
//   IMAGEENTRY = "IMAGEENTRY",
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
//   IMAGEENTRY_END = "IMAGEENTRY_END",
//   SECTION_END = "SECTION_END"
// }
// export enum MarkdownLastTagType {
//   UNKNOWN = "UNKNOWN" // should always be last
// }
// // interface SectionTag {
// //   tagType: tags
// // }
// export const MarkdownRecordType = {
//   ...MarkdownSectionTagType,
//   ...MarkdownItemTagType,
//   ...MarkdownTbdTagType,
//   ...MarkdownEndTagType,
//   ...MarkdownLastTagType
// };
// export type MarkdownRecordType =
//   | MarkdownSectionTagType
//   | MarkdownItemTagType
//   | MarkdownTbdTagType
//   | MarkdownEndTagType
//   | MarkdownLastTagType;
export const enum MarkdownRecordTagType {
  BLOCKQUOTE = "BLOCKQUOTE",
  BUTTONGRID = "BUTTONGRID",
  BUTTONGRID_END = "BUTTONGRID_END",
  PARAGRAPH = "PARAGRAPH",
  EMPTY = "EMPTY",
  HEADING01 = "HEADING01",
  HEADING02 = "HEADING02",
  HEADING03 = "HEADING03",
  HEADING04 = "HEADING04",
  HEADING05 = "HEADING05",
  HEADING06 = "HEADING06",
  // HEADINGLABELED = "HEADINGLABELED",
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
  GROUPFILLIN = "GROUPFILLIN_SECTION",
  GROUPFILLIN_END = "GROUPFILLIN_SECTION_END",
  FILLIN = "FILLIN_SECTION",
  FILLIN_END = "FILLIN_SECTION_END",
  PAGE = "PAGE",
  IMAGEENTRY = "IMAGEENTRY",
  IMAGEENTRY_END = "IMAGEENTRY_END",
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
  recordType: MarkdownRecordType;
  listDepth: number; // only applicable LISTITEAM
  headingLevel: number; // mutually exclusive from listDepth
  autoNumberedTag: string;
  lineNo: number;
}
// interface RegExpMatchArrayWithTagType {
//   groups: RegExpMatchArray;
//   tag: string;
// }
//type MarkdownClassDictionaryType = Record<MarkdownRecordTagType, MarkdownRecordType>;
/* Each pattern will define one explicit capture group () to
   be returned. Hence. the pattern cannot use the global flag g
   because final output will only include the first group encountered:
   group[1] until a use case requires the expansion of this definition.
*/
// contentCaptureGroup === 0 => passthru
interface MarkdownPatternItemType {
  pattern: RegExp;
  recordType: MarkdownRecordType;
  labelTagCaptureGroup: number;
  contentCaptureGroup: number;
  //  sectionType: MarkDownSectionTagType
}
type MarkdownPatternDictionaryType = Record<
  MarkdownRecordTagType,
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
// Need \s+ trailing pattern to identify MarkdownRecordType.SENTENCE otherwise
// split pattern with cleave embedded "." (i.e., period) found in
// non-terminating circustances (e.g., file.type)

//const PARAGRAPH_TO_SENTENCES2: RegExp = /(?<!\w\.\w.)(?<![A-Z][a-z][a-z]\.)([\.\?!][\"\u2018\u2019\u201c\u201d\)\]]*\s*(?<![A-Z][a-z]\.)(?<![A-Z]\.)\s+)/;
//const PARAGRAPH_PATTERN: RegExp = /^([ "'\(\!]?[A-Za-z0-9\$\@]{1}.*)$/m;
//const PARAGRAPH_PATTERN: RegExp = /^((["'\(\[]?|\!\[|\[\()[A-Za-z0-9\$\@]{1}.*)$/m;
const PARAGRAPH_PATTERN: RegExp = /^(\s*((["'\(\[]?|(#[0-9]+)|\!\[|\[\(|\[_\({0,1}|)[A-Za-z0-9\$\@]{1}.*))$/m;
// \!\[ added to support ![image]
// \[\ added to support leading image
// \[\( only to support [link] where link starts with ( Need to be careful what is considered beginning of a paragraph
// \[_ added  to support leading fillins [_
// added ({0,1} to support leading fillins followed by ( e.g., phone numbers
const LIST_CONTINUATION: RegExp = /(^\s*(([\*\-\+]\s)([^\s].*))|(^(([1-9]\.|[A-Z]\.|[1-9][a-z]\.)\s)))/;

const MarkdownPatternDictionary: MarkdownPatternDictionaryType = {
  [MarkdownRecordTagType.HEADING01]: {
    //    pattern: /^#\s([0-9]\.|[A-Z]\.|[0-9][a-z]\.)*([^\s].*)$/,
    pattern: /^#\s(([1-9]\.|[A-Z]\.)\s)*(.*)$/,
    recordType: MarkdownRecordType.HEADING,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 3
  },
  [MarkdownRecordTagType.HEADING02]: {
    pattern: /^##\s(([1-9]\.|[A-Z]\.)\s)*(.*)$/,
    recordType: MarkdownRecordType.HEADING,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 3
  },
  [MarkdownRecordTagType.HEADING03]: {
    pattern: /^###\s(([1-9]\.|[A-Z]\.)\s)*(.*)$/,
    recordType: MarkdownRecordType.HEADING,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 3
  },
  [MarkdownRecordTagType.HEADING04]: {
    pattern: /^####\s(([1-9]\.|[A-Z]\.)\s)*(.*)$/,
    recordType: MarkdownRecordType.HEADING,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 3
  },
  [MarkdownRecordTagType.HEADING05]: {
    pattern: /^#####\s(([1-9]\.|[A-Z]\.)\s)*(.*)$/,
    recordType: MarkdownRecordType.HEADING,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 3
  },
  [MarkdownRecordTagType.HEADING06]: {
    pattern: /^######\s(([1-9]\.|[A-Z]\.)\s)*(.*)$/,
    recordType: MarkdownRecordType.HEADING,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 3
  },
  // [MarkdownRecordTagType.HEADINGLABELED]: {
  //   pattern: /^#A\s([^\s].*)$/,
  //   recordType: MarkdownRecordType.HEADINGLABELED
  // },
  [MarkdownRecordTagType.BLOCKQUOTE]: {
    // > takes precedecence of other list item
    pattern: /^\>\s([^\s].*)$/,
    recordType: MarkdownRecordType.BLOCKQUOTE,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.BUTTONGRID]: {
    pattern: /^\[\[button-grid:\s(.*)\]\]\s*$/,
    recordType: MarkdownRecordType.BUTTONGRID,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 0
  },
  [MarkdownRecordTagType.BUTTONGRID_END]: {
    pattern: /^\[\[\/button-grid\]\]\s*$/,
    recordType: MarkdownRecordType.BUTTONGRID_END,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 0
  },
  [MarkdownRecordTagType.LISTITEM_UNORDERED01]: {
    pattern: /^[\*\-\+]\s([^\s].*)$/,
    recordType: MarkdownRecordType.LISTITEM_UNORDERED,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.LISTITEM_UNORDERED02]: {
    pattern: /^\s{2}[\*\-\+]\s([^\s].*)$/,
    recordType: MarkdownRecordType.LISTITEM_UNORDERED,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.LISTITEM_UNORDERED03]: {
    pattern: /^\s{4}[\*\-\+]\s([^\s].*)$/,
    recordType: MarkdownRecordType.LISTITEM_UNORDERED,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.LISTITEM_UNORDERED04]: {
    pattern: /^\s{6}[\*\-\+]\s([^\s].*)$/,
    recordType: MarkdownRecordType.LISTITEM_UNORDERED,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.PAGE]: {
    //    pattern: /^\[\[page:\s(((.*)))\/\]\]$/i, // [[page: */]] should contain title and other info
    pattern: /^\[\[page:\s(.*)\/\]\]$/,
    recordType: MarkdownRecordType.PAGE,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.LISTITEM_ORDERED01]: {
    pattern: /^(([1-9]\.|[A-Z]\.|[1-9][a-z]\.|[A-Z][1-9]\.)+\s)(.*)$/,
    //    pattern: /^([0-9]|[A-Z])\.\s([^\s].*)$/,
    recordType: MarkdownRecordType.LISTITEM_ORDERED,
    labelTagCaptureGroup: 2,
    contentCaptureGroup: 3
  },
  [MarkdownRecordTagType.LISTITEM_ORDERED02]: {
    pattern: /^\s{2}(([1-9]\.|[A-Z]\.|[1-9][a-z]\.|[A-Z][1-9]\.)\s)+(.*)$/,
    recordType: MarkdownRecordType.LISTITEM_ORDERED,
    labelTagCaptureGroup: 2,
    contentCaptureGroup: 3
  },
  [MarkdownRecordTagType.LISTITEM_ORDERED03]: {
    pattern: /^\s{4}(([1-9]\.|[A-Z]\.|[1-9][a-z]\.|[A-Z][1-9]\.)\s)+(.*)$/,
    recordType: MarkdownRecordType.LISTITEM_ORDERED,
    labelTagCaptureGroup: 2,
    contentCaptureGroup: 3
  },
  [MarkdownRecordTagType.LISTITEM_ORDERED04]: {
    pattern: /^\s{6}(([1-9]\.|[A-Z]\.|[1-9][a-z]\.|[A-Z][1-9]\.)\s)+(.*)$/,
    recordType: MarkdownRecordType.LISTITEM_ORDERED,
    labelTagCaptureGroup: 2,
    contentCaptureGroup: 3
  },
  [MarkdownRecordTagType.PARAGRAPH]: {
    pattern: PARAGRAPH_PATTERN,
    recordType: MarkdownRecordType.PARAGRAPH,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 0 // passthru
  },
  [MarkdownRecordTagType.COMMENT1]: {
    pattern: /^\[\/\/\]:\s(.*)$/,
    recordType: MarkdownRecordType.COMMENT,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.COMMENT2]: {
    pattern: /^\[\]:\s(.*)$/,
    recordType: MarkdownRecordType.COMMENT,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.COMMENT3]: {
    pattern: /^\[comment]:\s(.*)$/,
    recordType: MarkdownRecordType.COMMENT,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.IMAGEENTRY]: {
    pattern: /^\[\[image-entry:\s(.*)\]\]\s*$/i, // [[image-entry: *]]
    recordType: MarkdownRecordType.IMAGEENTRY,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.IMAGEENTRY_END]: {
    pattern: /^\[\[\/image-entry\]\]$/i, // [[/image-entry]]
    recordType: MarkdownRecordType.IMAGEENTRY_END,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 0
  },
  // [MarkdownRecordTagType.PAGETITLE]: {
  //   pattern: /\[\[page-title:\s(.*)\/\]\]$/i, // [[page-title: */]]
  //   recordType: MarkdownRecordType.PAGETITLE
  // },
  [MarkdownRecordTagType.GROUPFILLIN]: {
    pattern: /^\[\[groupfill-{0,1}in:\s(.*)\]\]\s*$/,
    recordType: MarkdownRecordType.GROUPFILLIN,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.GROUPFILLIN_END]: {
    pattern: /^\[\[\/groupfill-{0,1}in\]\]$/,
    recordType: MarkdownRecordType.GROUPFILLIN_END,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 0
  },
  [MarkdownRecordTagType.FILLIN]: {
    pattern: /^\[\[fill-{0,1}in:\s(.*)\]\]\s*$/,
    recordType: MarkdownRecordType.FILLIN,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.FILLIN_END]: {
    pattern: /^\[\[\/fill-{0,1}in\]\]$/,
    recordType: MarkdownRecordType.FILLIN_END,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 0
  },
  [MarkdownRecordTagType.PASSTHRUTAG]: {
    pattern: /^\[\[\/([A-Za-z\-]*)\]:\s([^\s].*)$/,
    recordType: MarkdownRecordType.PASSTHRUTAG,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 1
  },
  [MarkdownRecordTagType.EMPTY]: {
    pattern: /^\s*$/,
    recordType: MarkdownRecordType.EMPTY,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 0
  },
  [MarkdownRecordTagType.TBD]: {
    pattern: /(.*)$/,
    recordType: MarkdownRecordType.TBD,
    labelTagCaptureGroup: 0,
    contentCaptureGroup: 0
  }
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
  setCurrentIdx(idx: number): void;
  currentRecord(): TaggedStringType;
  fileName: string;
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
  fileName: string = "";
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
  setCurrentIdx(idx: number) {
    if (idx > 0 && idx < this.buffer.length) this.bufferIdx;
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
    if (colWidth1 === undefined) colWidth1 = 60;
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
            current.content === undefined
              ? "(undefined)"
              : current.recordType === MarkdownRecordType.SENTENCE
              ? current.content + "<eos>"
              : current.content;
          let lineNoStr: string =
            current.lineNo > 0
              ? `[${zeroPad(current.lineNo, colWidth2 - 2)}]` // line no.
              : " ".padEnd(5);
          let lvl =
            current.listDepth > 0
              ? "(lvl=" + numToStr(current.listDepth) + ")"
              : "";
          let autoNumberedTag =
            current.autoNumberedTag.length > 0
              ? "(tag=" + current.autoNumberedTag + ")"
              : "";

          outputStr =
            outputStr +
            `${zeroPad(lineNo + 1, colWidth0 - 2)}: ${content.padEnd(
              colWidth1
            )}${content.length > 0 ? " " : ""}${lineNoStr} ${
              current.listDepth > 0 ? numToStr(current.listDepth) : "-"
            } ${current.recordType} ${lvl} ${autoNumberedTag}\n`;
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
    this.fileName = fileName;
    let inputBuffer: string[];
    //    this.logger.diagnosticMode = true;
    this.logger.diagnostic(`input file: ${fileName}`);
    inputBuffer = fs
      .readFileSync(fileName)
      .toString()
      .replace(/[\u2018\u2019]/g, "'") // single { left | right } quote to apostrophe
      .replace(/\[u201C\u201D]/g, '"') // double { left | right } quote to double quote
      .replace(/\r/g, "") // explicit carriage return
      .replace(/[\u0000-\u0008]+/g, "") // non-printables
      .replace(/[\u0009]+/g, "\t") // non-printables
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
        recordType: MarkdownRecordType.TBD,
        listDepth: depth,
        headingLevel: 0,
        autoNumberedTag: "",
        lineNo: currentIdx + 1
      };
      let match: RegExpMatchArray = [];
      if (
        MarkdownPatternDictionary[MarkdownRecordTagType.EMPTY].pattern.test(
          inputBuffer[currentIdx]
        )
      ) {
        result.content = inputBuffer[currentIdx];
        result.recordType = MarkdownRecordType.EMPTY;
      } else {
        match = inputBuffer[currentIdx].match(/^(.*)$/)!;
        result.content = match[1];
        result.recordType = MarkdownRecordType.TBD;
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
    //     recordType: MarkdownRecordType.EMPTY,
    //     depth: depth,
    //     headingLevel: 0,
    //     lineNo: current.lineNo
    //   });
    //   return;
    // }
    try {
      if (current.content !== undefined) {
        let sentences = current.content.split(PARAGRAPH_TO_SENTENCES);
        resultBuffer.push({
          content: "[PARAGRAPH]",
          recordType: MarkdownRecordType.PARAGRAPH,
          listDepth: current.listDepth, //+ 1
          headingLevel: 0,
          autoNumberedTag: "",
          lineNo: current.lineNo
        });
        for (
          let sentenceIdx = 0;
          sentenceIdx < sentences.length;
          sentenceIdx = sentenceIdx + 2 // [odd] capture group (sentence) followed by [even] terminator
        ) {
          this.logger.diagnostic(
            `sentence[${sentenceIdx}]=${sentences[sentenceIdx] +
              (sentences[sentenceIdx + 1] !== undefined
                ? sentences[sentenceIdx + 1]
                : "")}`
          );
          // KLUDGE: (re)appending the blank character below replaces the one
          // ignored by the PARAGRAPH_TO_SENTENCES regexp pattern (via \s+
          // requirement) BUT ONLY APPLIES TO the sentence record object
          // (i.e., MarkdownRecordType.SENTENCE) AND NOT any other record types.
          // Sometime in the future, take a deep dive into a better fix.
          resultBuffer.push({
            content:
              sentences[sentenceIdx] +
              (sentences[sentenceIdx + 1] !== undefined
                ? sentences[sentenceIdx + 1] + " "
                : ""),
            recordType: MarkdownRecordType.SENTENCE,
            listDepth: current.listDepth, //+ 1
            headingLevel: 0,
            autoNumberedTag: "",
            lineNo: current.lineNo
          });
        }
      } else {
        this.logger.error(
          `Undefined current.content encountered parsing sentences at line ${current.lineNo}`
        );
      }
    } catch (e) {
      this.logger.error(
        `Unexpected error encountered parsing sentences at line ${current.lineNo}`
      );
    }
    resultBuffer.push({
      content: "[PARAGRAPH END]",
      recordType: MarkdownRecordType.PARAGRAPH_END,
      listDepth: depth, //+ 1
      headingLevel: 0,
      autoNumberedTag: "",
      lineNo: current.lineNo
    });
  }
  private lookup(mdString: string): TaggedStringType {
    let mdTag: MarkdownRecordTagType = MarkdownRecordTagType.TBD;
    let depth: number = 0;
    let autoNumberedTag: string = "";
    let contentCaptureGroup: string = "";
    let matches: RegExpMatchArray = [];
    // LISTITEM_ORDERED* has two capture groups and not one.
    for (mdTag in MarkdownPatternDictionary) {
      let regexpPattern = MarkdownPatternDictionary[mdTag].pattern;
      if (regexpPattern.test(mdString)) {
        matches = mdString.match(regexpPattern)!; // full match, capture groups
        //        matches = regexpPattern.exec(mdString)!;
        contentCaptureGroup =
          matches[MarkdownPatternDictionary[mdTag].contentCaptureGroup];
        if (MarkdownPatternDictionary[mdTag].labelTagCaptureGroup > 0) {
          autoNumberedTag =
            matches[MarkdownPatternDictionary[mdTag].labelTagCaptureGroup];
        }
        depth = Number.isNaN((depth = parseInt(mdTag.slice(-2)))) ? 0 : depth;
        // console.log(mdString);
        // console.log(
        //   `${mdTag}: content="${contentCaptureGroup}", tag="${autoNumberedTag}", depth=${depth}`
        // );
        break;

        // let i: number = 0;
        // console.log(
        //   `mdString="${mdString}"\ncontent="${contentCaptureGroup}" (${MarkdownPatternDictionary[mdTag].recordType}), tag=(${autoNumberedTag})`
        // );
        // for (i = 0; i < matches.length; i++) {
        //   console.log(`matches[${i}]=${matches[i]}`);
        // }
        /*
        if (
          MarkdownPatternDictionary[mdTag].recordType ===
          MarkdownRecordType.HEADING
        ) {
          if (matches[2] !== undefined) autoNumberedTag = matches[2];
          contentCaptureGroup = matches[3];
        } else if (
          MarkdownPatternDictionary[mdTag].recordType ===
          MarkdownRecordType.LISTITEM_ORDERED
        ) {
          contentCaptureGroup = matches[3];
          if (matches[2] !== undefined) autoNumberedTag = matches[2];
          depth = Number.isNaN((depth = parseInt(mdTag.slice(-2)))) ? 0 : depth;
        } else if (
          MarkdownPatternDictionary[mdTag].recordType ===
          MarkdownRecordType.LISTITEM_UNORDERED
        ) {
          contentCaptureGroup = matches[1];
          depth = Number.isNaN((depth = parseInt(mdTag.slice(-2)))) ? 0 : depth;
        } else if (
          MarkdownPatternDictionary[mdTag].recordType ===
          MarkdownRecordType.PARAGRAPH
        ) {
          contentCaptureGroup = matches[2];
        } else if (
          MarkdownPatternDictionary[mdTag].recordType ===
          MarkdownRecordType.EMPTY
        ) {
          contentCaptureGroup = "";
        } else if (
          MarkdownPatternDictionary[mdTag].recordType === MarkdownRecordType.TBD
        ) {
          contentCaptureGroup = mdString;
        } else if (matches[2] !== undefined) {
          contentCaptureGroup = matches[2];
          console.log(`matches=${matches}`);
        } else if (matches[2] !== undefined) {
          contentCaptureGroup = matches[2];
        } else {
          console.log(
            `ERROR: DataAdapter::lookup pattern failed for mdString=${mdString}`
          );
          let i: number = 0;
          console.log(
            `mdString="${mdString}"\ncontent="${contentCaptureGroup}" (${MarkdownPatternDictionary[mdTag].recordType}), tag=(${autoNumberedTag})`
          );
          for (i = 0; i < matches.length; i++) {
            console.log(`matches[${i}]=${matches[i]}`);
          }
        }
        */
        // let i: number = 0;
        // console.log(
        //   `mdString="${mdString}"\ncontent="${contentCaptureGroup}" (${MarkdownPatternDictionary[mdTag].recordType}), tag=(${autoNumberedTag})`
        // );
        // for (i = 0; i < matches.length; i++) {
        //   console.log(`matches[${i}]=${matches[i]}`);
        // }

        // break;
      }
    }
    //     return {
    //     content: matches.length > 0 ? matches[1] : "",
    //     recordType: MarkdownPatternDictionary[mdTag].recordType,
    //     depth:
    //       MarkdownPatternDictionary[mdTag].recordType !==
    //       MarkdownRecordType.HEADING
    //         ? depth
    //         : 0,
    //     headingLevel:
    //       MarkdownPatternDictionary[mdTag].recordType ===
    //       MarkdownRecordType.HEADING
    //         ? depth
    //         : 0,
    //     lineNo: 0
    //   };
    // }
    return {
      content: contentCaptureGroup,
      recordType: MarkdownPatternDictionary[mdTag].recordType,
      listDepth:
        MarkdownPatternDictionary[mdTag].recordType !==
        MarkdownRecordType.HEADING
          ? depth
          : 0,
      headingLevel:
        MarkdownPatternDictionary[mdTag].recordType ===
        MarkdownRecordType.HEADING
          ? depth
          : 0,
      autoNumberedTag: autoNumberedTag,
      lineNo: 0 // tbd
    };
  }
  parse(
    listDepth: number,
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
        `markdown looking up: "${inputBuffer[idx]}" as ${current.recordType} at line ${current.lineNo}`
      );
      // isListItem =
      //   current.recordType === MarkdownRecordType.LISTITEM_ORDERED ||
      //   current.recordType === MarkdownRecordType.LISTITEM_UNORDERED;

      // Needed to ignore depth for heading records
      if (current.listDepth < listDepth) {
        // just pop parse() call stack and allow completion of (current.listDepth
        // > depth) condition handle it (recursively)
        return idx;
      } else if (current.listDepth > listDepth) {
        // need to determine style of list from current record
        resultBuffer.push({
          content: `[SECTION START AT DEPTH=${listDepth + 1} TAG="${
            current.autoNumberedTag
          }"]`,
          recordType:
            current.recordType === MarkdownRecordType.LISTITEM_ORDERED
              ? MarkdownRecordType.SECTION_ORDERED
              : MarkdownRecordType.SECTION_UNORDERED,
          listDepth: listDepth + 1,
          headingLevel: 0,
          autoNumberedTag: current.autoNumberedTag,
          lineNo: current.lineNo
        });
        // Reposition to previous record so next pass (which
        // increments) can parse this record. OR could distribute idx++
        idx = this.parse(listDepth + 1, inputBuffer, idx, resultBuffer) - 1;
        resultBuffer.push({
          content: `[SECTION END AT DEPTH=${listDepth + 1} TAG="${
            current.autoNumberedTag
          }"]`,
          recordType: MarkdownRecordType.SECTION_END,
          listDepth: listDepth + 1,
          headingLevel: 0,
          autoNumberedTag: current.autoNumberedTag,
          lineNo: current.lineNo
        });
      } else {
        switch (current.recordType) {
          case MarkdownRecordType.PAGE: {
            resultBuffer.push(current);
            break;
          }
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
              content: `[LIST ITEM START AT DEPTH ${listDepth}]`,
              recordType: current.recordType,
              // current.recordType === MarkdownRecordType.LISTITEM_ORDERED
              //   ? MarkdownRecordType.SECTION_ORDERED
              //   : MarkdownRecordType.SECTION_UNORDERED,
              listDepth: listDepth,
              headingLevel: current.headingLevel,
              autoNumberedTag: current.autoNumberedTag,
              lineNo: current.lineNo
            });
            this.parseParagraph(current.listDepth, current, this.buffer);
            resultBuffer.push({
              content: `[LIST ITEM END AT DEPTH ${listDepth}]`,
              recordType: MarkdownRecordType.LISTITEM_END,
              // current.recordType === MarkdownRecordType.LISTITEM_ORDERED
              //   ? MarkdownRecordType.LISTITEM_ORDERED
              //   : MarkdownRecordType.LISTITEM_UNORDERED,
              listDepth: listDepth,
              headingLevel: 0,
              autoNumberedTag: "",
              lineNo: current.lineNo
            });
            break;
          }
          case MarkdownRecordType.BLOCKQUOTE: {
            resultBuffer.push({
              content: `[BLOCKQUOTE START ${listDepth}]`,
              recordType: MarkdownRecordType.BLOCKQUOTE,
              listDepth: current.listDepth,
              headingLevel: current.headingLevel,
              autoNumberedTag: "",
              lineNo: current.lineNo
            });
            this.parseParagraph(current.listDepth, current, this.buffer);
            resultBuffer.push({
              content: `[BLOCKQUOTE END ${listDepth}]`,
              recordType: MarkdownRecordType.SECTION_END,
              listDepth: current.listDepth,
              headingLevel: current.headingLevel,
              autoNumberedTag: "",
              lineNo: current.lineNo
            });
            break;
          }
          case MarkdownRecordType.PARAGRAPH: {
            this.parseParagraph(current.listDepth, current, this.buffer);
            break;
          }
          case MarkdownRecordType.IMAGEENTRY: {
            resultBuffer.push({
              content: current.content,
              recordType: MarkdownRecordType.IMAGEENTRY,
              listDepth: current.listDepth,
              headingLevel: current.headingLevel,
              autoNumberedTag: "",
              lineNo: current.lineNo
            });
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
