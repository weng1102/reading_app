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
import {
  // endMarkupTag,
  // isValidMarkupTag,
  // Tokenizer,
  // TokenType,
  // TokenLabelType,
  TokenListType
  // TokenLiteral,
  // Token,
  // MarkupLabelType
} from "./tokenizer";
//import { MarkdownType, MarkdownTagType } from "./dataadapter";
// import {
//   IPageContent,
//   ISectionContent,
//   ISentenceContent,
//   ITerminalContent,
//   PageFormatEnumType
// } from "./pageContentType";
import {
  // AcronymMap,
  // CardinalNumberMap,
  Logger
  // MonthFromAbbreviationMap,
  // OrdinalNumberMap
} from "./logger";
import {
  IDataSource,
  //  MarkdownSectionTagType,
  BasicMarkdownSource
  //  RawMarkdownSource,
  //  TaggedStringType
} from "./dataadapter";

//const SectionNodeMap = new Map([MarkdownParsedTagType
// const enum TerminalNodeEnumType {
//   WORD = 0,
//   NUMBER,
//   PUNCTUATION,
//   MLTAG,
//   MLTAG_END,
//   MLTAG_SELFCLOSING,
//   WHITESPACE
// }
export abstract class BaseClass {
  logger: Logger;
  parent: any;
  constructor(parent) {
    if (parent !== undefined || parent !== null) {
      this.parent = parent;
    }
    if (this.parent !== null && this.parent.logger !== undefined) {
      this.logger = parent.logger; // inherit existing logger handle
    } else {
      this.logger = new Logger(this); // create new logger handle
    }
    Object.defineProperty(this, "parent", { enumerable: false });
    Object.defineProperty(this, "logger", { enumerable: false });
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
  // need authentication infoblock at some point
  constructor(name: string) {
    //    this._parent = parent;
    this.username = name;
    ////    this._pages = new Array();
  }
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
  UNITTEST = "UNITTEST"
}
export interface IParseNode {
  parse(tokenList?: TokenListType): number;
  transform(): number;
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string,
    col0?: number,
    col1?: number,
    col2?: number,
    col3?: number,
    col4?: number
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
    Object.defineProperty(this, "userContent", { enumerable: false });
    //  Object.defineProperty(this, "dataSource", { enumerable: false });
  }
  userContext!: UserContext;
  // PROPOSED ENHANCEMENT: use file extension to determine datasource type
  // For now, assume basic .md
  dataSource!: IDataSource;
  //  abstract parse(): number;
  abstract parse(tokenList?: TokenListType): number;
  abstract transform(): number;
  abstract serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string,
    colWidth0?: number,
    colWidth1?: number,
    colWidth2?: number,
    colWidth3?: number,
    colWidth4?: number
  ): string;
}
