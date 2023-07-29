/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: baseclasses.ts
 *
 * Defines base classes, abstract classes and (enum) constants,
 * interface and abstract classes to support object parse tree
 *
 * Version history:
 *
 **/
import * as fs from "fs";
import { FileExists } from "./utilities";
import DictionaryType, {
  PronunciationDictionary,
  RecognitionDictionary
} from "./dictionary";
import { TokenListType } from "./tokenizer";
import { Logger } from "./logger";
import { IDataSource, BasicMarkdownSource } from "./dataadapter";

// Technically, these should be defined somewhere else since in requires
// PageContentType
import {
  IHeadingListItem,
  ISentenceListItem,
  ISectionListItem,
  ITerminalListItem,
  ILinkListItem,
  ISectionFillinSetting,
  ISectionFillinItem,
  LinkIdxDestinationType,
  ISectionFillinItemInitializer,
  PartOfSpeechEnumType,
  SectionFillinResponsesProgressionEnum,
  SectionFillinLayoutType
} from "./pageContentType";
import { IPageContent } from "./pageContentType";
import { IsDefined } from "./utilities";
export const TREEVIEW_PREFIX = "+-";
export const IDX_INITIALIZER = -9999;
export abstract class BaseClass {
  _logger: Logger;
  _parent: any;
  constructor(parent: any) {
    if (parent !== undefined && parent !== null) {
      this._parent = parent;
    }
    if (
      this._parent !== undefined &&
      this._parent !== null &&
      this._parent._logger !== undefined
    ) {
      this._logger = parent._logger; // inherit existing _logger handle
    } else {
      this._logger = new Logger(this); // create new logger handle
    }
    Object.defineProperty(this, "_parent", { enumerable: false });
    Object.defineProperty(this, "_logger", { enumerable: false });
  }
  get logger(): Logger {
    return this._logger;
  }
}
class TerminalArray extends Array<ITerminalListItem> {
  constructor(...args: any) {
    super(...args);
  }
  previousTerminalIdx: number = IDX_INITIALIZER;
  // get lastIdx(): number {
  //   return this.length - 1
  // }
  get lastIdx(): number {
    return this.length - 1;
  }
  push(terminal: ITerminalListItem): number {
    //    super.push(terminal); just extends and not overload not overridden
    //  terminal.termIdx = this.length - 1;
    terminal.termIdx = super.push(terminal) - 1;
    if (this.previousTerminalIdx !== IDX_INITIALIZER)
      terminal.prevTermIdx.push(this.previousTerminalIdx);
    if (
      this.previousTerminalIdx >= 0 &&
      this.previousTerminalIdx < this.length
    ) {
      this[this.previousTerminalIdx].nextTermIdx.push(terminal.termIdx);
    }
    this.previousTerminalIdx = terminal.termIdx;
    // console.log(
    //   `#######termIdx=${terminal.termIdx}#######content=${terminal.content}`
    // );
    //    return super.push(terminal);
    return terminal.termIdx;
  }
  parse(): number {
    this.forEach(terminal => {
      //      if (terminal.altrecognition.length === 0) {
      terminal.altrecognition =
        RecognitionDictionary[terminal.content.toLowerCase()] !== undefined
          ? RecognitionDictionary[terminal.content.toLowerCase()]
          : "";
      // } else {
      //   console.log(`altrecog[${terminal.content}]=${terminal.altrecognition}`);
      // }
      if (terminal.altpronunciation.length === 0)
        terminal.altpronunciation =
          PronunciationDictionary[terminal.content.toLowerCase()] !== undefined
            ? PronunciationDictionary[terminal.content]
            : "";
    });
    return this.length;
  }
  serialize(): string {
    let altrecog,
      altpro: string = "";
    let outputStr: string =
      "[idx ]:  term ARLVNBI  next prev sent  sect link   fillins content\n";
    for (const [i, element] of this.entries()) {
      if (element.altrecognition.length > 0) {
        altrecog = `(rec: ${element.altrecognition})`;
      } else {
        altrecog = "";
      }
      if (element.altpronunciation.length > 0) {
        altpro = `(pro: ${element.altpronunciation})`;
      } else {
        altpro = "";
      }
      outputStr = `${outputStr}[${i
        .toString()
        .padStart(4, "0")}]: ${element.termIdx
        .toString()
        .padStart(5)} ${element.audible
        .toString()
        .substring(0, 1)
        .toUpperCase()}${element.recitable
        .toString()
        .substring(0, 1)
        .toUpperCase()}${element.linkable
        .toString()
        .substring(0, 1)
        .toUpperCase()}${element.visible
        .toString()
        .substring(0, 1)
        .toUpperCase()}${element.numberAsNumerals
        .toString()
        .substring(0, 1)
        .toUpperCase()}${element.bold
        .toString()
        .substring(0, 1)
        .toUpperCase()}${element.italics
        .toString()
        .substring(0, 1)
        .toUpperCase()} ${
        element.nextTermIdx.length === 0
          ? "na".padStart(5)
          : element.nextTermIdx[0].toString().padStart(5)
      }${
        element.prevTermIdx.length === 0
          ? "na".padStart(5)
          : element.prevTermIdx[0].toString().padStart(5)
      }${element.sentenceIdx
        .toString()
        .padStart(5)} ${element.sectionIdx
        .toString()
        .padStart(5)} ${(element.linkIdx < 0
        ? "na".padStart(4)
        : element.linkIdx.toString()
      ).padStart(4)} ${(element.fillin.sectionIdx < 0
        ? "na".padStart(4)
        : element.fillin.sectionIdx.toString()
      ).padStart(4)} ${(element.fillin.responseIdx < 0
        ? "na".padStart(4)
        : element.fillin.responseIdx.toString()
      ).padStart(4)} ${element.content} ${altrecog} ${altpro}\n`;
    }
    return outputStr;
  }
}
class FillinArray extends Array<ISectionFillinItem> {
  constructor(...args: any) {
    super(...args);
  }
  parse(): number {
    // reorder tag into enum order
    const posOrder: string[] = Object.values(PartOfSpeechEnumType);
    let orderedTags: string[];
    for (const fillin of this) {
      orderedTags = fillin.tags.sort(
        (a: string, b: string) =>
          posOrder.indexOf(a as string) - posOrder.indexOf(b as string)
      );
      fillin.tags = orderedTags;
    }
    return this.length;
  }
  push(sectionList: ISectionFillinItem): number {
    // needs to store the nearest termIdx so that parse can later find
    // the actual visible, recitable terminal in parse
    let length = super.push(sectionList);
    this[length - 1].idx = length - 1;
    return length;
  }
  addResponse(item: string, tag: string = ""): [number, number] {
    let fillinListIdx: number;
    let fillinIdx: number;
    if (this.length === 0) this.push(ISectionFillinItemInitializer());
    fillinListIdx = this.length - 1;
    fillinIdx =
      this[fillinListIdx].responses.push({
        content: item,
        tag: tag,
        referenceCount: 1
      }) - 1;

    let duplicateIdx = this[fillinListIdx].tags.findIndex(
      tagItem => tag === tagItem
    );
    // console.log(`duplicateIdx=${duplicateIdx}`);
    if (duplicateIdx < 0) {
      this[fillinListIdx].tags.push(tag);
    }
    /*
responses.filter(item => {
  let duplicateIdx = uniqueResponses.findIndex(
    response => response.content === item.content
  );
  if (duplicateIdx < 0) {
    uniqueResponses.push(
      IFillinResponseItemInitializer(
        item.content,
        item.tag,
        item.referenceCount
      )
    );
*/

    return [fillinListIdx, fillinIdx];
  }
  serialize(): string {
    let outputStr: string = `[idx ]: ${"".padEnd(17)} refCount order\n`;
    for (const [i, element] of this.entries()) {
      outputStr = `${outputStr}[${i
        .toString()
        .padStart(4, "0")}]: idx: ${element.idx.toString()}, ${
        element.showPresets ? "showHelpPresets" : ""
      }, helpPresetLevel=${element.presetLevel}, ${
        element.authorSetting.layout
      }, progressionOrder=${element.authorSetting.progressionOrder.toString()}, gridColumns=${
        element.authorSetting.gridColumns
      }, ${element.authorSetting.unique ? "unique" : ""}, ${
        element.authorSetting.showReferenceCount ? "showReferenceCount" : ""
      }, ${element.authorSetting.groupByTags ? "groupByTags" : ""}, ${
        element.allowReset ? "allowReset" : ""
      }, responsesLayout=${element.authorSetting.responsesLayout}, ${
        element.authorSetting.showAlternatives ? "showAlternatives" : ""
      }, ${
        element.authorSetting.showResponseTags ? "showResponseTags" : ""
      },  ${
        element.authorSetting.showResponsesInPrompts
          ? "showResponsesInPrompts"
          : ""
      }\n`;
      for (const [j, response] of element.responses
        //        .sort((a, b) => (a.content > b.content ? 1 : -1))
        .entries()) {
        outputStr = `${outputStr}+-[${j
          .toString()
          .padStart(2, "0")}]: ${response.content.padEnd(
          25
        )}${response.tag.padEnd(10)}${response.referenceCount.toString()}\n`;
      }
      if (element.tags.length > 0) {
        outputStr = `${outputStr}  tags:`;
        for (const tag of element.tags) {
          //        .sort((a, b) => (a.content > b.content ? 1 : -1))
          outputStr = `${outputStr} ${tag},`;
        }
        outputStr = `${outputStr.substring(0, outputStr.length - 1)}\n`;
      }
      if (element.alternatives.length > 0) {
        outputStr = `outputStr\n   alternatives:`;
        for (const alternative of element.alternatives) {
          //        .sort((a, b) => (a.content > b.content ? 1 : -1))
          outputStr = `${outputStr}, ${alternative}`;
        }
      }
    }
    return outputStr;
  }
}
/*
element.title
}", "${element.description}", sectionFillinIdx=${
element.sectionFillinIdx
}, ${element.layout}, ${sortOrderToLabel(
element.sortOrder
)}, gridColumns=${element.gridColumns}, ${
element.unique ? "unique" : ""
},${element.showReferenceCount ? "showReferenceCount" : ""}, ${
element.showResponseTags ? "showResponseTags" : ""
},${element.groupByTags ? "groupByTags" : ""}, ${
element.showResponseTags ? "showResponseTags" : ""
}, ${element.showPromptTags ? "showPromptTags" : ""},  ${element.allowReset ? "allowReset" : ""}, ${
element.allowUserFormatting ? "allowUserFormatting" : ""
}`;
*/

class HeadingArray extends Array<IHeadingListItem> {
  constructor(...args: any) {
    super(...args);
  }
  push(heading: IHeadingListItem): number {
    // needs to store the nearest termIdx so that parse can later find
    // the actual visible, recitable terminal in parse
    return super.push(heading);
  }
  parse(): number {
    // starting from nearest termIdx, traverse and find
    // the actual visible, recitable terminal in parse
    // for (const element of this) {
    //   if (element.terminalCountPriorToHeading <= 0) {
    //     element.termIdx = 0; // default to beginning of terminals array
    //   } else {
    //     let idx: number;
    //     for (
    //       idx = element.terminalCountPriorToHeading;
    //       !(terminals[idx].visible && terminals[idx].recitable);
    //       idx++
    //     );
    //     element.termIdx = idx;
    //   }
    //   //console.log(`HeadingArray prior=${element.terminalCountPriorToHeading} term=${element.termIdx}`);
    // }
    return this.length;
  }
  serialize(): string {
    let outputStr: string = "[hidx]: lvl  idx title\n";
    for (const [i, element] of this.entries()) {
      outputStr = `${outputStr}[${i
        .toString()
        .padStart(4, "0")}]: ${element.headingLevel
        .toString()
        .padStart(3, " ")} ${element.termIdx.toString().padStart(4, " ")} ${
        element.title
      }\n`;
    }
    return outputStr;
  }
}
class SentenceArray extends Array<ISentenceListItem> {
  constructor(...args: any) {
    super(...args);
  }
  push(sentence: ISentenceListItem): number {
    return super.push(sentence);
  }
  parse(): number {
    return this.length;
  }
  serialize(): string {
    let outputStr: string = "[ idx]:  1st last punct\n";
    for (const [i, element] of this.entries()) {
      outputStr = `${outputStr}[${i
        .toString()
        .padStart(4, "0")}]: ${element.firstTermIdx
        .toString()
        .padStart(4, " ")} ${element.lastTermIdx.toString().padStart(4, " ")} ${
        element.lastPunctuation
      }\n`;
    }
    return outputStr;
  }
}
class SectionArray extends Array<ISectionListItem> {
  constructor(...args: any) {
    super(...args);
  }
  push(section: ISectionListItem): number {
    return super.push(section);
  }
  parse(): number {
    return this.length;
  }
  serialize(): string {
    let outputStr: string = "[ idx]:  1st last type\n";
    for (const [i, element] of this.entries()) {
      outputStr = `${outputStr}[${i
        .toString()
        .padStart(4, "0")}]: ${element.firstTermIdx
        .toString()
        .padStart(4, " ")} ${element.lastTermIdx
        .toString()
        .padStart(4, " ")} ${element.type.toString().padStart(4, " ")}\n`;
    }
    return outputStr;
  }
}
class LinkArray extends Array<ILinkListItem> {
  constructor(...args: any) {
    super(...args);
  }
  push(link: ILinkListItem): number {
    return super.push(link);
  }
  parse(
    headingListLength: number,
    sectionListLength: number,
    terminalListLength: number
  ): number {
    // If both section and terminal indices are specified, terminal idx
    // takes precedence over section idx.
    // Validate links and sectionIdx and terminalIdx before setting
    // valid flag
    for (const [i, element] of this.entries()) {
      let intrapageLink: boolean =
        !IsDefined(element.destination.page) ||
        element.destination.page.length === 0;
      element.valid = false;
      if (intrapageLink) {
        if (
          element.destination.linkIdxType === LinkIdxDestinationType.heading
        ) {
          element.valid =
            element.destination.headingIdx >= 0 &&
            element.destination.headingIdx < headingListLength;
        } else if (
          element.destination.linkIdxType === LinkIdxDestinationType.section
        ) {
          element.valid =
            element.destination.sectionIdx >= 0 &&
            element.destination.sectionIdx < sectionListLength;
        } else if (
          element.destination.linkIdxType === LinkIdxDestinationType.terminal
        ) {
          element.valid =
            element.destination.terminalIdx >= 0 &&
            element.destination.terminalIdx < terminalListLength;
        } else {
        }
      } else {
        let pageFile: string = `dist\\${element.destination.page.trim()}.json`;
        if (FileExists(pageFile)) {
          // and not already the currently open
          // load json and check section and terminal lists
          if (element.destination.linkIdxType === LinkIdxDestinationType.page) {
            // don't need to check link id, go to top of page
            element.valid = true;
            // element.destination.headingIdx = 0;
            // element.destination.sectionIdx = 0;
            // element.destination.terminalIdx = 0;
          } else {
            let pageContent: IPageContent;
            let inputStr: string = fs.readFileSync(pageFile).toString();
            // should find all pageFile references within linkList. Difficult
            // algorithm. Need to sort LinkList by destination pages OR just
            // be inefficient and open the file(s) again.
            pageContent = JSON.parse(inputStr);
            //            let linkList: ILinkListItem[] = pageContent.linkList;
            if (
              element.destination.linkIdxType ===
              LinkIdxDestinationType.terminal
            ) {
              element.valid =
                element.destination.terminalIdx >= 0 &&
                element.destination.terminalIdx <
                  pageContent.terminalList.length;
              if (element.valid) {
                element.destination.sectionIdx =
                  pageContent.terminalList[
                    element.destination.terminalIdx
                  ].sectionIdx;
              }
            } else if (
              element.destination.linkIdxType === LinkIdxDestinationType.section
            ) {
              element.valid =
                element.destination.sectionIdx >= 0 &&
                element.destination.sectionIdx <
                  pageContent.sectionList.length &&
                pageContent.sectionList[element.destination.sectionIdx]
                  .firstTermIdx >= 0 &&
                pageContent.sectionList[element.destination.sectionIdx]
                  .lastTermIdx < pageContent.terminalList.length;
              if (element.valid) {
                element.destination.terminalIdx =
                  pageContent.sectionList[
                    element.destination.sectionIdx
                  ].firstTermIdx;
              }
              // } else if (
              //   element.destination.linkIdxType === LinkIdxDestinationType.heading
              // ) {
              //   element.valid =
              //     element.destination.terminalIdx >= 0 &&
              //     element.destination.terminalIdx <
              //       pageContent.terminalList.length;
              //   if (element.valid) {
              //     element.destination.sectionIdx =
              //       pageContent.terminalList[
              //         element.destination.terminalIdx
              //       ].sectionIdx;
              //   }
            } else if (
              element.destination.linkIdxType === LinkIdxDestinationType.heading
            ) {
              element.valid =
                element.destination.headingIdx >= 0 &&
                element.destination.headingIdx <
                  pageContent.headingList.length &&
                pageContent.headingList[element.destination.headingIdx]
                  .termIdx >= 0 &&
                pageContent.headingList[element.destination.headingIdx]
                  .termIdx < pageContent.terminalList.length;
              if (element.valid) {
                element.destination.terminalIdx =
                  pageContent.headingList[
                    element.destination.headingIdx
                  ].termIdx;
                element.destination.sectionIdx =
                  pageContent.terminalList[
                    element.destination.terminalIdx
                  ].sectionIdx;
              }
            } else {
            }
          }
        }
      }
    }
    return this.length;
  }
  serialize(): string {
    let outputStr: string =
      "[idx ]  " +
      "page/url".padEnd(40, " ") +
      "type       head sect term valid \n";
    for (const [i, element] of this.entries()) {
      outputStr += `[${i.toString().padStart(4, "0")}]: ${
        IsDefined(element.destination.page) &&
        element.destination.page.length > 0
          ? element.destination.page.padEnd(40, " ")
          : "(current page)".padEnd(40, " ")
      }${element.destination.linkIdxType.toString().padEnd(9, " ")}  ${(element
        .destination.headingIdx !== IDX_INITIALIZER
        ? element.destination.headingIdx
        : "na"
      )
        .toString()
        .padEnd(4, " ")} ${(element.destination.sectionIdx !== IDX_INITIALIZER
        ? element.destination.sectionIdx
        : "na"
      )
        .toString()
        .padEnd(4, " ")} ${(element.destination.terminalIdx !== IDX_INITIALIZER
        ? element.destination.terminalIdx
        : "na"
      )
        .toString()
        .padEnd(4, " ")} ${element.valid}\n`;
    }
    outputStr +=
      "Note: The preceding head, sect, term refer are idxs in their respective (non-url) target page when validated.";
    return outputStr;
  }
}
export class UserContext {
  /* look at the altPro and altRec that are for personalized entries
     should be readable from an external file that will not require recompile
     to recognize (unlike the Dictionary objects)

      this._altRecognitionMap = new Map();
      mapEntries = JSON.parse(FileAltRecog);
      for (let key of Object.keys(mapEntries)) {
        this._altRecognitionMap.set(key, mapEntries[key]);
      }
      this._altPronunciationMap = new Map();
      mapEntries = JSON.parse(FileAltPronun);
      for (let key of Object.keys(mapEntries)) {
        this._altPronunciationMap.set(key, mapEntries[key]);
      };
    }
    get altPronunciationMap() {
      return this._altPronunciationMap;
    }
    get altRecognitionMap() {
      return this._altRecognitionMap;
    }
    get name() {
      return this._name;
    }
    set name(name) {
    this._name = name;
    }
  }*/
  readonly username: string;
  terminals: TerminalArray;
  headings: HeadingArray;
  sections: SectionArray;
  sentences: SentenceArray;
  links: LinkArray;
  fillins: FillinArray;
  // need authentication infoblock at some point
  constructor(name: string) {
    //    this._parent = parent;
    this.username = name;
    this.terminals = new TerminalArray();
    this.headings = new HeadingArray();
    this.sections = new SectionArray();
    this.sentences = new SentenceArray();
    this.links = new LinkArray();
    this.fillins = new FillinArray();
    ////    this._pages = new Array();
  }
  // protected terminalIdx: number = 0;
  // get currentTerminalIdx(): number {
  //   return this.terminalIdx;
  // }
  // function terminals(idx: number): ITerminalInfo {
  //   if (idx >=0 && idx < this.terminals.length) {
  //     return this.terminals[idx];
  //     else
  // }
  get pronunciationDictionary(): DictionaryType {
    // should actually return the combined user and general dictionary
    return PronunciationDictionary;
  }
  get recognitionDictionary(): DictionaryType {
    // should actually return the combined user and general dictionary
    return PronunciationDictionary;
  }
}
// separate properties from methods because need abide by PageContentType so
// data serialization via JSON.stringify() is simplified.
export interface IUserContent {
  userContext: UserContext;
}
export abstract class UserNode extends BaseClass implements IUserContent {
  constructor(parent: any) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });
  }
  userContext: UserContext = new UserContext("anonymous");
}
export interface IFileContent {
  dataSource: IDataSource;
}
type IFileNode = IUserContent & IFileContent;

export class FileNode extends UserNode implements IFileNode {
  dataSource!: IDataSource;
  // markdown file can contain one or more pages
  constructor(parent: any) {
    super(parent);
    Object.defineProperty(this, "dataSource", { enumerable: false });
  }
}
export const enum ParseNodeSerializeFormatEnumType {
  JSON = "JSON",
  MARKDOWN = "MARKDOWN",
  TABULAR = "TABULAR",
  TREEVIEW = "TREEVIEW",
  UNITTEST = "UNITTEST" // similar to JSON but with enumerable definitions or or replaceer()
}
export const ParseNodeSerializeColumnWidths: number[] = [
  40,
  20,
  20,
  20,
  20,
  20,
  20,
  20
];
export function ParseNodeSerializeTabular(...fields: string[]): string {
  let outputStr = "";
  fields.forEach((field, i) => {
    outputStr = `${outputStr} ${field
      .substring(0, ParseNodeSerializeColumnWidths[i])
      .padEnd(ParseNodeSerializeColumnWidths[i])}`;
  });
  return outputStr;
}
export function ParseNodeSerializePaddedColumn(
  colNum: number,
  field: string
): string {
  return field.padEnd(
    Math.max(ParseNodeSerializeColumnWidths[colNum] - field.length, 0)
  );
}
export function ParseNodeSerializeColumnPad(
  colNum: number,
  field0?: string,
  field1?: string,
  field2?: string,
  field3?: string
): string {
  //generates column pad  based on field widths in arglist AND ParseNodeSerialColumnWidths[]
  let width: number = 0;
  if (field0 !== undefined) width = width + field0.length;
  if (field1 !== undefined) width = width + field1.length;
  if (field2 !== undefined) width = width + field2.length;
  if (field3 !== undefined) width = width + field3.length;
  colNum =
    colNum < 0 || colNum > ParseNodeSerializeColumnWidths.length ? colNum : 0;
  return " ".repeat(
    Math.max(ParseNodeSerializeColumnWidths[colNum] - width, 0)
  );
}
export interface IParseNode {
  parse(tokenList?: TokenListType): number;
  transform(): number;
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string, // overrides default values defined with objects: file, page, section, sentence...
    prefix?: string // primarily used for treeview
  ): string;
}
//export abstract class ParseNode extends BaseClass implements IParseNode {
export abstract class ParseNode extends BaseClass implements IParseNode {
  // implements:
  // - properties: parent, logger, userContext, datasource
  // - parse(), transform(), serialize()
  constructor(parent: any) {
    super(parent);
    if (
      parent !== undefined &&
      parent !== null &&
      parent.userContext !== undefined
    ) {
      this.userContext = parent.userContext;
    } else {
      this.userContext = new UserContext("anonymous");
    }
    if (
      parent !== undefined &&
      parent !== null &&
      parent.dataSource !== undefined
    ) {
      this.dataSource = parent.dataSource;
    } else {
      this.dataSource = new BasicMarkdownSource(this);
    }
    Object.defineProperty(this, "dataSource", { enumerable: false });
    Object.defineProperty(this, "userContext", { enumerable: false });
    //  Object.defineProperty(this, "dataSource", { enumerable: false });
  }
  userContext!: UserContext;
  // PROPOSED ENHANCEMENT: use file extension to determine datasource type
  // For now, assume basic .md
  dataSource!: IDataSource;
  abstract parse(tokenList?: TokenListType): number;
  serialize(
    format: ParseNodeSerializeFormatEnumType = ParseNodeSerializeFormatEnumType.JSON,
    label: string = this.constructor.name,
    prefix: string = ""
  ): string {
    let outputStr: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        if (prefix.length >= TREEVIEW_PREFIX.length)
          prefix = prefix.slice(0, -TREEVIEW_PREFIX.length) + TREEVIEW_PREFIX;
        outputStr = `\n${prefix}${label}`;
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        outputStr = `\n${label}`;
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        // may require setting "enumerable" or replacer
        outputStr = JSON.stringify(this);
        break;
      }
      case ParseNodeSerializeFormatEnumType.JSON:
      default: {
        outputStr = JSON.stringify(this);
        break;
      }
    }
    return outputStr;
  }
  transform(): number {
    return this.userContext.terminals.length;
  }
}
// const compareString = (a: string, b: string): number => {
//   return a > b ? 1 : -1;
// };
// export const SortOrderToLabel = (sortOrder: SectionFillinSortOrder): string => {
//   switch (sortOrder) {
//     case SectionFillinSortOrder.alphabetical:
//       return SectionFillinSortOrder.toString(); //"alphabetical order";
//     case SectionFillinSortOrder.random:
//       return "random order";
//     default:
//       return "insert order (default)";
//   }
// };
export function helpfulnessLevel(group: ISectionFillinSetting): number {
  let helpfulness: number = 0;
  if (group.showResponsesInPrompts) helpfulness += 1000;
  if (group.layout !== SectionFillinLayoutType.hidden) {
    if (group.showPromptTags) {
      helpfulness += 500;
    }
    switch (group.progressionOrder) {
      case SectionFillinResponsesProgressionEnum.alphabetical:
        helpfulness += 200;
        break;
      case SectionFillinResponsesProgressionEnum.inorder:
        helpfulness += 300;
        break;
      case SectionFillinResponsesProgressionEnum.random:
        helpfulness += 100;
        break;
      default:
    }
    switch (group.groupByTags) {
      case true:
        helpfulness += 10;
        break;
      case false:
        break;
      default:
    }
    switch (group.layout) {
      case SectionFillinLayoutType.grid:
        helpfulness += 4;
        break;
      case SectionFillinLayoutType.list:
        helpfulness += 3;
        break;
      case SectionFillinLayoutType.csv:
        helpfulness += 2;
        break;
    }
  }
  return helpfulness;
}
