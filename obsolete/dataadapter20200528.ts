/***
 * Read line-based modified markdown-format page content
 */
import * as path from "path";
import * as fs from "fs";
const AppInfo = require(path.resolve("./appinfo.json")); // should use module.paths and find-me.js
import { Logger, BaseClass, MyDate, UserContext } from "./utilities";
import { IPageContent } from "./PageContentType";
// import * as rl from 'readline-sync';

export enum MarkdownParsedTagType {
  PARAGRAPH = "PARAGRAPH",
  EMPTY = "EMPTY",
  HEADING = "HEADING",
  SECTION_ORDERED = "SECTION_ORDERED",
  SECTION_UNORDERED = "SECTION_UNORDERED",
  LIST_UNORDERED = "LIST_UNORDERED",
  LIST_ORDERED = "LIST_ORDERED",
  BLOCKQUOTE = "BLOCKQUOTE",
  PHOTOENTRY = "PHOTOENTRY",
  FILLIN = "FILLIN",
  PAGE = "PAGE",
  SENTENCE = "SENTENCE"
}
export enum MarkdownTbdTagType {
  PASSTHRUTAG = "PASSTHRUTAG"
}
export enum MarkdownNonparsedType {
  COMMENT = "COMMENT",
  FILLIN_END = "FILLIN_END",
  PARAGRAPH_END = "PARAGRAPH_END",
  PHOTOENTRY_END = "PHOTOENTRY_END",
  SECTION_END = "SECTION_END"
}
export enum MarkdownLastTagType {
  UNKNOWN = "UNKNOWN" // should always be last
}
export const MarkdownRecordType = {
  ...MarkdownParsedTagType,
  ...MarkdownTbdTagType,
  ...MarkdownNonparsedType,
  ...MarkdownLastTagType
};
type MarkdownRecordType =
  | MarkdownParsedTagType
  | MarkdownTbdTagType
  | MarkdownNonparsedType
  | MarkdownLastTagType;
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
//   LIST_UNORDERED = "LIST_UNORDERED",
//   LIST_ORDERED = "LIST_ORDERED",
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
  LIST_UNORDERED01 = "LIST_UNORDERED01",
  LIST_UNORDERED02 = "LIST_UNORDERED02",
  LIST_UNORDERED03 = "LIST_UNORDERED03",
  LIST_UNORDERED04 = "LIST_UNORDERED04",
  LIST_ORDERED01 = "LIST_ORDERED01",
  LIST_ORDERED02 = "LIST_ORDERED02",
  LIST_ORDERED03 = "LIST_ORDERED03",
  LIST_ORDERED04 = "LIST_ORDERED04",
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

//const pattern_boldtext = /\*\*(.*)\*\*/gim;
//const pattern_italics = /\*(.*)\*/gim;

export interface TaggedStringType {
  content: string;
  tagType: MarkdownRecordType;
  depth: number;
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
  [MarkdownType.LIST_UNORDERED01]: {
    pattern: /^[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownRecordType.LIST_UNORDERED
  },
  [MarkdownType.LIST_UNORDERED02]: {
    pattern: /^\s{2}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownRecordType.LIST_UNORDERED
  },
  [MarkdownType.LIST_UNORDERED03]: {
    pattern: /^\s{4}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownRecordType.LIST_UNORDERED
  },
  [MarkdownType.LIST_UNORDERED04]: {
    pattern: /^\s{6}[\*\-\+]\s([^\s].*)$/,
    tagType: MarkdownRecordType.LIST_UNORDERED
  },
  [MarkdownType.LIST_ORDERED01]: {
    pattern: /^[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownRecordType.LIST_ORDERED
  },
  [MarkdownType.LIST_ORDERED02]: {
    pattern: /^\s{2}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownRecordType.LIST_ORDERED
  },
  [MarkdownType.LIST_ORDERED03]: {
    pattern: /^\s{4}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownRecordType.LIST_ORDERED
  },
  [MarkdownType.LIST_ORDERED04]: {
    pattern: /^\s{6}[0-9]+\.\s([^\s].*)$/,
    tagType: MarkdownRecordType.LIST_ORDERED
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
  parse(depth: number, buffer: string[], current: number): number;
  currentRecord(): TaggedStringType;
  firstRecord(): TaggedStringType;
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
  abstract parse(depth: number, inputBuffer: string[], current: number): number;
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
  nextRecord(): TaggedStringType {
    // could throw TypeError upon access attempt
    this.bufferIdx++;
    return this.buffer[this.bufferIdx];
  }
  serialize() {
    const zeroPad = (num: number, places: number) =>
      String(num).padStart(places, "0");
    const numToStr = (depth: number) => (depth >= 0 ? `depth:${depth}` : ``);
    //
    // let current: TaggedStringType;
    let i: number = 0;
    // for (let i = 0; i < this.buffer.length; i++) {
    //   let content: string =
    //     this.buffer[i].content === undefined
    //       ? "(undefined)"
    //       : this.buffer[i].content;
    //   console.log(
    //     `${zeroPad(i + 1, 3)}: ${content.padEnd(35)}${
    //       content.length > 0 ? " " : ""
    //     }(tagType:${this.buffer[i].tagType} ${numToStr(this.buffer[i].depth)})`
    //   );
    // }
    for (
      let current = this.firstRecord();
      !this.EOF();
      current = this.nextRecord()
    ) {
      //      current = this.currentRecord();
      let content =
        current.content === undefined ? "(undefined)" : current.content;
      console.log(
        `${zeroPad(i + 1, 3)}: ${content.padEnd(35)}${
          content.length > 0 ? " " : ""
        }(tagType:${current.tagType} ${numToStr(current.depth)})`
      );
      i++;
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

    this.parse(0, inputBuffer, 0);

    if (this.logger.warnings() > 0) {
      this.logger.warning(
        `Encountered ${this.logger.warnings()} warning${
          this.logger.warnings() === 1 ? "" : "s"
        } parsing '${fileName}'`
      );
    }
    return this.buffer.length;
  }
  parse(depth, inputBuffer: string[], current: number): number {
    // recursive descent
    if (current < inputBuffer.length) {
      let result: TaggedStringType = {
        content: "",
        tagType: MarkdownRecordType.UNKNOWN,
        depth: depth
      };
      let match: RegExpMatchArray = [];
      if (
        MarkdownPatternDictionary[MarkdownType.EMPTY].pattern.test(
          inputBuffer[current]
        )
      ) {
        result.content = inputBuffer[current];
        result.tagType = MarkdownRecordType.EMPTY;
      } else {
        match = inputBuffer[current].match(/^(.*)$/)!;
        result.content = match[1];
        result.tagType = MarkdownRecordType.UNKNOWN;
      }
      this.buffer.push(result);
      this.parse(depth, inputBuffer, current + 1);
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
  private parseList(
    listDepth: number,
    inputBuffer: string[],
    currentInputIdx: number,
    resultBuffer: TaggedStringType[]
  ): number {
    if (currentInputIdx === inputBuffer.length - 1) return currentInputIdx; //EOF
    let current = this.lookup(inputBuffer[currentInputIdx]);
    if (listDepth === current.depth) {
      // if (current.content === undefined) {
      this.buffer.push(current);
      // } else {
      //   console.log(`inside parseList parseParagraph ${current.content}`)
      //   this.parseParagraph(current, this.buffer);
      // }
      currentInputIdx = this.parseList(
        listDepth,
        inputBuffer,
        ++currentInputIdx,
        resultBuffer
      );
    } else if (listDepth < current.depth) {
      resultBuffer.push({
        content: `INSERTED: SECTION START AT DEPTH ${listDepth + 1}`,
        tagType:
          current.tagType === MarkdownRecordType.LIST_ORDERED
            ? MarkdownRecordType.SECTION_ORDERED
            : MarkdownRecordType.SECTION_UNORDERED,
        depth: listDepth + 1
      });
      currentInputIdx = this.parseList(
        listDepth + 1,
        inputBuffer,
        currentInputIdx,
        resultBuffer
      );
    } else {
      resultBuffer.push({
        content: `INSERTED: SECTION END AT DEPTH ${listDepth}`,
        tagType:
          current.tagType === MarkdownRecordType.LIST_ORDERED
            ? MarkdownRecordType.SECTION_ORDERED
            : MarkdownRecordType.SECTION_UNORDERED,
        depth: listDepth
      });
      currentInputIdx = this.parse(
        listDepth - 1,
        inputBuffer,
        currentInputIdx,
        resultBuffer
      );
    }
    return currentInputIdx;
  }
  private parseParagraph(
    depth: number,
    current: TaggedStringType,
    resultBuffer: TaggedStringType[]
  ) {
    if (current.content === undefined) {
      resultBuffer.push({
        content: "",
        tagType: MarkdownRecordType.EMPTY,
        depth: depth
      });
      return;
    }
    let sentences = current.content.split(PARAGRAPH_TO_SENTENCES1);
    resultBuffer.push({
      content: "REPARSED INTO SENTENCES",
      tagType: MarkdownRecordType.PARAGRAPH,
      depth: current.depth //+ 1
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
          depth: current.depth //+ 1
        });
      }
    } catch (e) {
      console.log(`unexpected error encountered processing sentences`);
    }
    resultBuffer.push({
      content: "REPARSED INTO SENTENCES END",
      tagType: MarkdownRecordType.PARAGRAPH_END,
      depth: depth //+ 1
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
      depth: currentDepth
    };
  }
  parse(depth: number, inputBuffer: string[], currentInputIdx: number): number {
    if (currentInputIdx > inputBuffer.length - 1) {
      return inputBuffer.length; // EOF
    }
    let current: TaggedStringType = this.lookup(inputBuffer[currentInputIdx]);
    switch (current.tagType) {
      case MarkdownRecordType.HEADING: {
        // ignore changes in currentDepth for now until headings e.g. <h1> are
        // treated as section headers
        this.buffer.push(current);
        break;
      }
      case (MarkdownRecordType.LIST_ORDERED, MarkdownRecordType.LIST_UNORDERED): {
        const InitialListDepth = 0;
        currentInputIdx = this.parseList(
          InitialListDepth,
          inputBuffer,
          currentInputIdx,
          this.buffer
        );
        break;
      }
      case MarkdownRecordType.BLOCKQUOTE: {
        console.log(`encountered block quote ${current.content}`);
        this.parseParagraph(current.depth, current, this.buffer);
        break;
      }
      case MarkdownRecordType.PARAGRAPH: {
        console.log(`encountered paragraph ${current.content}`);
        this.parseParagraph(current.depth, current, this.buffer);
        break;
      }
      default: {
        this.buffer.push(current);
      }
    } //end switch
    return this.parse(depth, inputBuffer, currentInputIdx + 1); //parse next record
  }
}
