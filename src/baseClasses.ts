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
  PronunciationDictionary
  // RecognitionDictionary
} from "./dictionary";
import { TokenListType } from "./tokenizer";
import { Logger } from "./logger";
import { IDataSource, BasicMarkdownSource } from "./dataadapter";
import { ITerminalInfo } from "./pagecontentType";
export const TREEVIEW_PREFIX = "+-";
export const IDX_INITIALIZER = -9999;
export abstract class BaseClass {
  logger: Logger;
  parent: any;
  constructor(parent) {
    if (parent !== undefined || parent !== null) {
      this.parent = parent;
    }
    if (
      this.parent !== undefined &&
      this.parent !== null &&
      this.parent.logger !== undefined
    ) {
      this.logger = parent.logger; // inherit existing logger handle
    } else {
      this.logger = new Logger(this); // create new logger handle
    }
    Object.defineProperty(this, "parent", { enumerable: false });
    Object.defineProperty(this, "logger", { enumerable: false });
  }
}
class TerminalArray extends Array<ITerminalInfo> {
  constructor(...args) {
    super(...args);
  }
  previousTerminalIdx: number = -1;
  push(terminal: ITerminalInfo) {
    //    super.push(terminal); just extends and not overload not overridden
    terminal.termIdx = this.length;
    if (this.previousTerminalIdx !== -1)
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
    return super.push(terminal);
  }
  serialize(): string {
    let outputStr: string = "[idx ]:  term content    ARVF  next prev \n";
    for (let i = 0; i < this.length; i++) {
      outputStr = `${outputStr}[${i.toString().padStart(4, "0")}]: ${this[
        i
      ].termIdx
        .toString()
        .padStart(5)} ${this[i].content
        .substring(0, 10)
        .padEnd(10, " ")} ${this[i].audible
        .toString()
        .substring(0, 1)
        .toUpperCase()}${this[i].recitable
        .toString()
        .substring(0, 1)
        .toUpperCase()}${this[i].visible
        .toString()
        .substring(0, 1)
        .toUpperCase()}${this[i].fillin
        .toString()
        .substring(0, 1)
        .toUpperCase()} ${
        this[i].nextTermIdx.length === 0
          ? "na".padStart(5)
          : this[i].nextTermIdx[0].toString().padStart(5)
      }${
        this[i].prevTermIdx.length === 0
          ? "na".padStart(5)
          : this[i].prevTermIdx[0].toString().padStart(5)
      }\n`;
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
  // need authentication infoblock at some point
  constructor(name: string) {
    //    this._parent = parent;
    this.terminals = new TerminalArray();
    this.username = name;
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
  constructor(parent) {
    super(parent);
    Object.defineProperty(this, "dataSource", { enumerable: false });
  }
}
export const enum ParseNodeSerializeFormatEnumType {
  JSON = "JSON",
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
