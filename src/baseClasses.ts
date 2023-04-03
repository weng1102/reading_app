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
  ISectionFillinHelpSetting,
  ISectionFillinItem,
  ISectionFillinItemInitializer,
  SectionFillinSortOrder,
  SectionFillinLayoutType
} from "./pageContentType";
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
      if (terminal.altrecognition.length === 0) {
        terminal.altrecognition =
          RecognitionDictionary[terminal.content] !== undefined
            ? RecognitionDictionary[terminal.content]
            : "";
      }
      if (terminal.altpronunciation.length === 0)
        terminal.altpronunciation =
          PronunciationDictionary[terminal.content] !== undefined
            ? PronunciationDictionary[terminal.content]
            : "";
    });
    return this.length;
  }
  serialize(): string {
    let altrecog,
      altpro: string = "";
    let outputStr: string =
      "[idx ]:  term ARLVN  next prev sent  sect link   fillins content\n";
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
    // category i.e., part of speech) lookup.
    return this.length;
  }
  push(sectionList: ISectionFillinItem): number {
    // needs to store the nearest termIdx so that parse can later find
    // the actual visible, recitable terminal in parse
    let length = super.push(sectionList);
    this[length - 1].idx = length - 1;
    return length;
  }
  addResponse(item: string): [number, number] {
    let fillinListIdx: number;
    let fillinIdx: number;
    if (this.length === 0) this.push(ISectionFillinItemInitializer());
    fillinListIdx = this.length - 1;
    fillinIdx =
      this[fillinListIdx].responses.push({
        content: item,
        category: "",
        referenceCount: 1
      }) - 1;
    return [fillinListIdx, fillinIdx];
  }
  serialize(): string {
    let outputStr: string = `[idx ]: ${"".padEnd(17)} refCount order\n`;
    for (const [i, element] of this.entries()) {
      outputStr = `${outputStr}[${i
        .toString()
        .padStart(4, "0")}]: idx: ${element.idx.toString()}, ${
        element.showHelpPresets ? "showHelpPresets" : ""
      } helpPresetLevel=${element.helpPresetLevel} ${
        element.authorHelpSetting.layout
      }, ${SortOrderToLabel(
        element.authorHelpSetting.sortOrder
      )}, gridColumns=${element.authorHelpSetting.gridColumns}, ${
        element.authorHelpSetting.unique ? "unique" : ""
      }, ${
        element.authorHelpSetting.showReferenceCount ? "showReferenceCount" : ""
      }, ${
        element.authorHelpSetting.groupByCategory ? "groupByCategory" : ""
      }, ${element.allowReset ? "allowReset" : ""}, ${
        element.authorHelpSetting.showResponseHints ? "showResponseHints" : ""
      },  ${
        element.authorHelpSetting.showResponsesInPrompts
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
        )}${response.referenceCount.toString()}\n`;
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
element.showResponseHints ? "showResponseHints" : ""
},${element.groupByCategory ? "groupByCategory" : ""}, ${
element.showResponseHints ? "showResponseHints" : ""
}, ${element.showPromptHints ? "showPromptHints" : ""},  ${element.allowReset ? "allowReset" : ""}, ${
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
  parse(): number {
    return this.length;
  }
  serialize(): string {
    let outputStr: string = "[idx ]  page/url            sect term  valid \n";
    for (const [i, element] of this.entries()) {
      outputStr += `[${i.toString().padStart(4, "0")}]: ${(element.destination
        .page.length === 0
        ? "(current page)"
        : element.destination.page
      ).padEnd(20, " ")}${(element.destination.sectionIdx !== IDX_INITIALIZER
        ? +element.destination.sectionIdx
        : "na"
      )
        .toString()
        .padStart(4, " ")} ${(element.destination.terminalIdx !==
      IDX_INITIALIZER
        ? +element.destination.terminalIdx
        : "na"
      )
        .toString()
        .padStart(4, " ")}  ${element.valid}\n`;
    }
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
export const SortOrderToLabel = (sortOrder: SectionFillinSortOrder): string => {
  switch (sortOrder) {
    case SectionFillinSortOrder.alphabetical:
      return "alphabetical order";
    case SectionFillinSortOrder.random:
      return "random order";
    default:
      return "insert order (default)";
  }
};
export function helpfulnessLevel(group: ISectionFillinHelpSetting): number {
  let helpfulness: number = 0;
  if (group.showResponsesInPrompts) helpfulness += 1000;
  if (group.layout !== SectionFillinLayoutType.hidden) {
    if (group.showPromptHints) {
      helpfulness += 500;
    }
    switch (group.sortOrder) {
      case SectionFillinSortOrder.alphabetical:
        helpfulness += 200;
        break;
      case SectionFillinSortOrder.insert:
        helpfulness += 300;
        break;
      case SectionFillinSortOrder.random:
        helpfulness += 100;
        break;
      default:
    }
    switch (group.groupByCategory) {
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
