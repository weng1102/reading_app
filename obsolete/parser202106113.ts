// Goal: parser cretaes a parse tree for page object that has 1 or more section
// objects that each have 0 or more sentence objects that each can have one or
// more terminal objects. After completely parsing content, The parse tree can
// be serialized into json/ts based on PageContentType and its subtypes. The
// object properties will match the PageContentType interface for the
// corresponding object type to simplify serialization/unit testing.
//
// *Content (i.e., PageContent, SectionNode) = group of TerminalNodes
// TerminalNode = terminalNode = leafNode
import {
  endMarkupTag,
  isValidMarkupTag,
  Tokenizer,
  TokenType,
  TokenLabelType,
  TokenListType,
  TokenLiteral,
  Token,
  MarkupLabelType
} from "./tokenizer";
import { MarkdownType, MarkdownRecordType } from "./dataadapter";
import {
  IPageContent,
  ISectionContent,
  ISectionBlockquoteVariant,
  ISectionBlockquoteVariantInitializer,
  ISectionFillinVariant,
  ISectionFillinVariantInitializer,
  ISectionHeadingVariant,
  ISectionHeadingVariantInitializer,
  ISectionOrderedListVariant,
  ISectionOrderedListVariantInitializer,
  ISectionUnorderedListVariant,
  ISectionUnorderedListVariantInitializer,
  ISectionParagraphVariant,
  ISectionParagraphVariantInitializer,
  ISentenceContent,
  ITerminalContent,
  TerminalMetaType,
  TerminalMetaEnumType,
  IAudibleWordTerminalMeta,
  IAudibleWordTerminalMetaInitializer,
  INonaudibleWordTerminalMeta,
  INonaudibleWordTerminalMetaInitializer,
  OrderedListTypeEnumType,
  PageFormatEnumType,
  SectionVariantEnumType,
  SectionVariantType,
  UnorderedListMarkerEnumType
} from "./pageContentType";
import DictionaryType, {
  PronunciationDictionary,
  RecognitionDictionary
} from "./dictionary";
import {
  AcronymMap,
  //  BaseClass,
  CardinalNumberMap,
  Logger,
  MonthFromAbbreviationMap,
  OrdinalNumberMap,
  UserContext
} from "./utilities";
import {
  IDataSource,
  MarkdownSectionTagType,
  BasicMarkdownSource,
  RawMarkdownSource,
  TaggedStringType
} from "./dataadapter";
// import { UserNode } from "./baseClasses"
//const SectionNodeMap = new Map([MarkdownParsedTagType
const enum TerminalNodeEnumType {
  WORD = 0,
  NUMBER,
  PUNCTUATION,
  MLTAG,
  MLTAG_END,
  MLTAG_SELFCLOSING,
  WHITESPACE
}
const TerminalNodeEnumMap = new Map([
  [TerminalNodeEnumType.WORD, "WORD"],
  [TerminalNodeEnumType.NUMBER, "NUMBER"],
  [TerminalNodeEnumType.PUNCTUATION, "PUNCTUATION"],
  [TerminalNodeEnumType.MLTAG, "MLTAG"],
  [TerminalNodeEnumType.MLTAG_END, "MLTAG_END"],
  [TerminalNodeEnumType.MLTAG_SELFCLOSING, "MLTAG_SELFCLOSING"],
  [TerminalNodeEnumType.WHITESPACE, "WHITESPACE"]
]);
const enum MarkupNodeEnumType { //MarkupLabelType
  EMAILADDRESS = "<emailaddress>",
  PHONENUMBER = "<phonenumber>",
  TIME = "<time>",
  DATE1 = "<date1>",
  DATE2 = "<date2>",
  DATE3 = "<date3>",
  CONTRACTION = "<contraction>",
  NUMBER_WITHCOMMAS = "<number_withcommas>",
  TOKEN = "<token>",
  USD = "usd"
}
interface INodeJsonUnitTest {
  ID: number;
  TERM: string;
  TYPE: number;
  PRON: string;
  RECO: string;
}
let nodeJsonUnitTestInitializer: INodeJsonUnitTest = {
  ID: 0,
  TERM: "",
  TYPE: 0,
  PRON: "",
  RECO: ""
};
export abstract class BaseClass {
  logger!: Logger;
  parent!: any;
  constructor(parent) {
    if (parent === null) {
      this.logger = new Logger(this);
    } else {
      if (parent.logger !== undefined) {
        this.logger = parent.logger; // inherit existing logger handle
      } else {
        console.log(`WARNING: parent exists without a logger object`);
      }
    }
  }
}
export const enum ParseNodeSerializeFormatEnumType {
  JSON = "JSON",
  TABULAR = "TABULAR",
  UNITTEST = "UNITTEST"
}
interface IParseNode {
  parse(): number;
  transform(): number;
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    prefix?: string,
    col0?: number,
    col1?: number,
    col2?: number,
    col3?: number,
    col4?: number
  ): string;
}
abstract class ParseNode extends BaseClass implements IParseNode {
  // implements:
  // - properties: parent, logger, userContext, datasource
  // - parse(), transform(), serialize()
  constructor(parent: any) {
    super(parent);
    this.userContext = new UserContext("anonymous");
    this.dataSource = new BasicMarkdownSource(this);
  }
  userContext: UserContext;
  // PROPOSED ENHANCEMENT: use file extension to determine datasource type
  // For now, assume basic .md
  dataSource: IDataSource;
  abstract parse();
  abstract transform();
  abstract serialize();
}
// export interface IFileNodeMethods {
//   connect(fileName: string): number;
//   disconnect(): void;
//   length(): number;
//   parse(): any; // any to avoid compilation error, should be removed
//   transform(): any;
//   serialize(): string; // any to avoid compilation error, should be removed
// }
// interface IFileParseNode {
//   dataSource: IDataSource;
// }
type IPageNode = IPageContent & IParseNode;
export class FileParseNode extends ParseNode {
  // markdown file can contain one or more pages
  //  dataSource!: IDataSource;
  pageNodes: IPageNode[] = [];
  constructor(parent) {
    super(parent);
  }
  connect(fileName: string) {
    // should handle JSON, unittest or MD files based on filetype?
    // can be overridden in subclass. Perhaps, Raw should be instantiated here and not Basic
    this.dataSource; //
    //    this._markdownDataSource = new RawMarkdownSource(this);
    let result = this.dataSource.connect(fileName);
    this.dataSource.serialize();
    return result;
  }
  disconnect() {
    this.dataSource = undefined!; //hopefully allows GC to reclaim memory
  }
  length(): number {
    return this.dataSource.length();
  }
  parse() {
    return 0;
  } // any to avoid compilation error, should be removed
  transform() {
    return 0;
  }
  serialize() {
    return "";
  } // any to avoid compilation error, should be removed
}
type ISectionNode = ISectionContent & IParseNode;
export class PageParseNode extends ParseNode implements IPageContent {
  //  _data: PageContentType = InitialPageContentType;
  id: number = 0;
  name: string = "";
  description: string = "";
  owner: string = "";
  pageFormatType = PageFormatEnumType.default;
  created!: Date;
  modified!: Date;
  transformed!: Date;
  firstTermIdx: number = -1;
  lastTermIdx: number = -1;
  sections: ISectionNode[] = []; //needs to be reflected in _data.sections[]
  constructor(parent) {
    super(parent);
  }
  parse() {
    let current: TaggedStringType;
    if (this.dataSource === undefined) {
      this.logger.error(`Data Source is undefined`);
      return 0;
    }
    // assume datasource is a page (sections where depth=0), parse all direct children i.e., depth=0
    for (
      let current = this.dataSource.firstRecord();
      !this.dataSource.EOF();
      current = this.dataSource.nextRecord()
    ) {
      if (current.tagType in SectionNodeMarkdownClassMap) {
        let section = new SectionNodeMarkdownClassMap[current.tagType](this);
        console.log(`page.parse:current.content ${current.content}`);
        this.sections.push(section);
        section.parse();
      }
    }
    return 0;
  }
  serialize(): string {
    // replace all this with JSON.stringify(pageNode)
    // let sectionContent: ISectionContent[] = [];
    // this._data.description = "hi there!";
    // this._data.created = new Date("2021-05-24");
    // let str: string = JSON.stringify(this._data);
    // console.log(str);
    // let pageContent: PageContentType = JSON.parse(str);
    // console.log(`stringified then parsed=${pageContent.description}`);
    // console.log(`stringified then parsed=${pageContent.created}`);
    // this._markdownDataSource.serialize();
    // for (let section of this.sectionNodes) {
    //   // could embed as Big arrow function below
    //   //    sectionContent.firstTermIdx(section.serialize()); // where sectionContent = results.sections
    // }
    // let result: IPageContent = {
    //   id: this.id,
    //   name: this.name,
    //   description: this.description,
    //   owner: "",
    //   pageFormatType: this.pageFormatType,
    //   created: this.created,
    //   modified: this.modified === undefined ? this.created : this.modified,
    //   transformed:
    //     this.transformed === undefined ? this.created : this.transformed,
    //   firstTermIdx: this.firstTermIdx,
    //   lastTermIdx: this.lastTermIdx,
    //   sections: sectionContent
    // };
    return "";
  }
  transform(): any {}
}
// interface ISectionNode {
//   id: number;
//   name: string;
//   description: string;
//   firstTermIdx: number;
//   sentenceNodes: ISentenceContent[];
//   parse(): any; // any to avoid compilation error, should be removed
//   transform(): any;
//   serialize(): string; // any to avoid compilation error, should be removed
//   // all of the finer details are hidden from the interface and conveyed via the (variants of) SectionContentType
// }
//type ISectionNode = ISectionContent & IContentMethods;
// interface ISentenceMethods {
//   serializeColumnar(
//     prefix?: string,
//     col0?: number,
//     col1?: number,
//     col2?: number,
//     col3?: number
//   ): string;
//   serializeForUnitTest(): string;
// }
//
type ISentenceNode = ISentenceContent & IParseNode;
abstract class AbstractSentenceNode extends ParseNode implements ISentenceNode {
  id: number = 0;
  content: string = "";
  firstTermIdx: number = 0;
  terminals: ITerminalNode[] = [];
  constructor(parent: ISectionNode | null) {
    super(parent);
  }
  //protected set content(content: string) {}
  parse() {
    return 0;
  }
  transform() {
    return 0;
  }
  // serializeForUnitTest(): string {
  //   let output: string = "";
  //   //let terminalNode: ITerminalNode;
  //   this.terminals.forEach(terminalNode => {
  //     output =
  //       output +
  //       terminalNode.serialize(ParseNodeSerializeFormatEnumType.UNITTEST);
  //   });
  //   return output;
  // }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    prefix?: string,
    col0?: number,
    col1?: number,
    col2?: number,
    col3?: number,
    col4?: number
  ): string {
    let outputStr: string = "";
    this.logger.diagnostic(`AbstractSentenceNode.serialize: ${this.content}`);

    switch (format) {
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        //    console.log(`AbstractSentenceNode`);
        outputStr = `sentence[${this.id}]: ${this.content}\n`;
        if (prefix === undefined) prefix = "+-";
        console.log(`terminalnodes.length=${this.terminals.length}`);
        // for (let i: number = 0; i < this.terminals.length; i++) {
        //   console.log(`terminal=${this.terminals[i].content}`);
        // }
        for (let terminalNode of this.terminals) {
          // for (let i: number = 0; i < this.terminals.length; i++) {
          // console.log(`terminal1=${this.terminals[i].content}`);
          console.log(`terminal1=${terminalNode.content}`);
          console.log(`terminal type=${terminalNode.constructor.name}`);
          let temp: string = terminalNode.serialize(
            // `${this.terminals[i].serialize(
            ParseNodeSerializeFormatEnumType.TABULAR,
            prefix,
            col0,
            col1,
            col2,
            col3,
            col4
          );
          outputStr =
            outputStr +
            `${terminalNode.serialize(
              // `${this.terminals[i].serialize(
              ParseNodeSerializeFormatEnumType.TABULAR,
              prefix,
              col0,
              col1,
              col2,
              col3,
              col4
            )}\n`;
        }
        //      outputStr = outputStr.slice(0, -1);
        console.log(outputStr);
        console.log(`AbstractSentenceNode(${format}): ${outputStr}`);
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        for (let terminalNode of this.terminals) {
          //        this.terminals.forEach(terminalNode => {
          outputStr =
            outputStr +
            terminalNode.serialize(ParseNodeSerializeFormatEnumType.UNITTEST);
        }
        break;
      }
    }
    return outputStr;
  }
  unitTest(actual: string, expected: string): boolean {
    return actual === expected;
  }
}
export class SentenceNode extends AbstractSentenceNode
  implements ISentenceNode {
  protected tokenizer: Tokenizer = new Tokenizer(this);
  constructor(parent: ISectionNode | null, content?: string) {
    super(parent);
    if (content !== undefined) this.content = content; // not readonly inside class
  }
  parse() {
    this.logger.diagnosticMode = true;
    this.logger.verboseMode = true;
    let markedUpSentence: string = this.tokenizer.insertMarkupTags(
      this.content
    );
    let tokens: TokenListType = this.tokenizer.tokenize(markedUpSentence);
    this.parseTokens(tokens); //TokenListType
    //    return this.terminals;
    return this.terminals.length;
  }
  parseTokens(tokens: TokenListType) {
    let terminalNode: ITerminalNode | undefined;
    let token: Token | undefined = tokens[0]; // peek
    if (token === undefined) return; // empty
    //    this.logger.diagnostic(`token.name=$(token.content}`);
    try {
      if (
        token.type === TokenType.MLTAG &&
        token.content.toLowerCase() in TerminalNodeMarkupClassMap
      ) {
        terminalNode = new TerminalNodeMarkupClassMap[
          token.content.toLowerCase()
        ](this);
        //            terminalNode.userContext = this.userContext;
      } else if (token.type in TerminalNodeClassMap) {
        terminalNode = new TerminalNodeClassMap[token.type](this);
        //          terminalNode.userContext = this.userContext;
      } else {
        this.logger.diagnostic(
          `Encountered unexpected token type=${token.type}`
        );
      }
      if (terminalNode) {
        this.logger.diagnostic(
          `Created terminalNode type=${terminalNode.constructor.name} for ${token.content}`
        );
        terminalNode.parseTokenList(tokens); //TokenListType
        this.terminals.push(terminalNode);
        ///console.log(this.constructor.name+".parseTokens():ContentNodeClasses currentTokenIdx="+currentTokenIdx);
      } else {
        this.logger.error(
          `Encountered unhandled token type=${token.type} for token=${token.content}`
        );
        ///console.error(this.constructor.name+".parseTokens(): Unexpected token.type="+token.type+" token.tag="+tokens[currentTokenIdx].text);
      }
      this.parseTokens(tokens);
    } catch (e) {
      this.logger.error(`Unexpected error: ${e.message}`);
      console.log(e.stack);
    }
  }
}
//    terminals: TerminalContentType[]
abstract class SectionParseNode extends ParseNode implements ISectionContent {
  // based on SectionVariantEnumType
  readonly id: number = 0;
  name: string = "";
  description: string = "";
  firstTermIdx: number = 0;
  sentences: ISentenceNode[] = [];
  type!: SectionVariantEnumType; // initialized in subclass
  meta!: SectionVariantType; // initialized in subclass
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
  // should use abstract to force implmenetation in derived classes
  parse() {
    return 0;
  }
  transform() {
    return 0;
  }
  serialize(): string {
    return "";
  }
}
class SectionParseNode_HEADING extends SectionParseNode
  implements ISectionNode {
  // can have zero (when immediately followed by subsecion) or more sentences
  // readonly type: SectionVariantEnumType = SectionVariantEnumType.heading;
  // protected title: string = `${this.name}: ${this.description}`; // otherwise defaults to  name: description above
  // protected recitable: boolean = false;
  // protected audible: boolean = false;
  // protected level: number = 0;
  constructor(parent) {
    super(parent);
    console.log(
      `creating heading section ${
        parent._markdownDataSource.currentRecord().content
      }`
    );
  }
  meta: ISectionHeadingVariant = ISectionHeadingVariantInitializer;
  parse() {
    let current: TaggedStringType = this.parent._markdownDataSource.currentRecord();
    if (current.tagType === MarkdownRecordType.HEADING) {
      this.meta.title = current.content;
      this.meta.level = current.headingLevel;
      this.meta.type = SectionVariantEnumType.heading;
    } else {
      // logger.error
    }
    return 1;
  }
}
abstract class SectionParseNode_LIST extends SectionParseNode
  implements ISectionNode {}
class SectionParseNode_BLOCKQUOTE extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent) {
    super(parent);
    console.log("creating blockquote section");
  }
  meta: ISectionBlockquoteVariant = ISectionBlockquoteVariantInitializer;
  parse() {
    let current: TaggedStringType = this.parent.dataSource.currentRecord();
    if (current.tagType === MarkdownRecordType.BLOCKQUOTE) {
      if (
        this.parent.dataSource.nextRecord().tagType ===
        MarkdownRecordType.PARAGRAPH
      ) {
        for (
          current = this.parent.dataSource.nextRecord();
          !this.parent.dataSource.EOF() &&
          current.tagType === MarkdownRecordType.SENTENCE;
          current = this.parent.dataSource.nextRecord()
        ) {
          let sentence = new SentenceNode(this);
          sentence.content = current.content;
          this.meta.sentences.push(sentence);
          current = this.parent.dataSource.nextRecord();
        }
        if (current.tagType !== MarkdownRecordType.PARAGRAPH_END) {
          `expected PARAGRAPH parsing BLOCKQUOTE after line ${current.lineNo}`;
        }
      }
      this.logger.warning(
        `expected PARAGRAPH parsing BLOCKQUOTE at line ${current.lineNo}`
      );
    } else {
      this.logger.warning(
        `expected BLOCKQUOTE at line ${current.lineNo} not ${current.tagType}`
      );
    }
    return 0;
  }
  serialize() {
    return "";
  }
  transform() {
    return 0;
  }
}
class SectionParseNode_PARAGRAPH extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent) {
    super(parent);
    console.log("creating paragraph section");
  }
  meta: ISectionParagraphVariant = ISectionParagraphVariantInitializer;
  //  parse() {}
  serialize() {
    return "";
  }
}
class SectionParseNode_LIST_ORDERED extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent) {
    super(parent);
    console.log("creating ordered list section");
  }
  meta: ISectionOrderedListVariant = ISectionOrderedListVariantInitializer;
}
class SectionParseNode_LIST_UNORDERED extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent) {
    super(parent);
    console.log("creating unordered list section");
  }
  meta: ISectionUnorderedListVariant = ISectionUnorderedListVariantInitializer;
}
class SectionParseNode_FILLIN extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent) {
    super(parent);
    console.log("creating ordered fillin section");
  }
  meta: ISectionFillinVariant = ISectionFillinVariantInitializer;
}
class SectionParseNode_PHOTOENTRY extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent) {
    super(parent);
    console.log("creating ordered photoentry section");
  }
  readonly type: SectionVariantEnumType = SectionVariantEnumType.photo_entry;
  protected image: string = ""; // path to img/filename
}
/*
remaining SectionNode types from enum SectionVariantEnumType {
  subsection,
  fillin_list,
  unittest
  */
interface ISentenceNode1 {
  readonly id: number;
  readonly content: string;
  readonly firstWordIdx: number;
  readonly terminalNodes: ITerminalNode[];
  parse(sentence: string);
  transform();
  serialize(): string;
  serializeColumnar(
    prefix?: string,
    col0?: number,
    col1?: number,
    col2?: number,
    col3?: number
  ): string;
  //  unitTest(actual: string, expected: string): boolean;
}
type TerminalNodeClassType =
  | typeof TerminalNode_WORD
  | typeof TerminalNode_NUMBER
  | typeof TerminalNode_PUNCTUATION
  | typeof TerminalNode_MLTAG
  | typeof TerminalNode_MLTAG_END
  | typeof TerminalNode_MLTAG_SELFCLOSING
  | typeof TerminalNode_WHITESPACE;

///abstract class AbstractSentenceNode extends BaseClass implements ISentenceNode {
// interface ITerminalMethods {
//   // serialize(): string;
//   serializeForUnitTest(): string;
//   serializeColumnar(
//     prefix?: string,
//     colWidth0?: number,
//     colWidth1?: number,
//     colWidth2?: number,
//     colWidth13?: number
//   ): string;
// }
// interface ITerminalNode {
//   id: number;
//   type: number;
//   content: string;
//   children: ITerminalNode[]; // children supersede tokens!
//   altpronunciation: string;
//   altrecognition: string;
//   tokens: TokenListType;
//   parent: ISentenceNode;
//   parse(tokenList: TokenListType): number;
//   /* Manages processing within the scope of the term's tokens
//    * 1) decomposing words to correct for speech recognition shortcomings
//    *    (408) is interpreted as "4", "0", "8"
//    *    Mar 17, 1983 is interpreted as "March", "17th", "1983"
//    *    weng@gmail.com is interpreted as "weng", "at", "gmail" "dot", "com"
//    * 2) acronyms and abbreviations (need to be conservative here though)
//    * 3) alternate pronunciationDictionary
//    * 4) alternate recognition patterns
//    *
//    * Anthing that requires knowledge outside of term is handled by parent
//    *  such as word sequencing and pageunique ids
//    */
//   serialize(): string;
//   serializeForUnitTest(): string;
//   serializeColumnar(
//     prefix?: string,
//     colWidth0?: number,
//     colWidth1?: number,
//     colWidth2?: number,
//     colWidth13?: number
//   ): string;
// }
interface ITerminalParseNode {
  parseTokenList(tokenList: TokenListType): number;
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    prefix?: string,
    col0?: number,
    col1?: number,
    col2?: number,
    col3?: number,
    col4?: number
  ): string;
  transform(): number;
}
export type ITerminalNode = ITerminalContent & ITerminalParseNode; // & IContentMethods & ITerminalMethods;
abstract class AbstractTerminalNode extends ParseNode implements ITerminalNode {
  // readonly id: number = 0;
  // type!: number;
  // content: string = "";
  // children: ITerminalNode[] = []; // children supersede tokens!
  // altpronunciation: string = "";
  // altrecognition: string = "";
  // tokens: TokenListType = []; // kill this property; superseded by children
  // parent: ISentenceNode;
  // protected firstWordIdx: number = -1;
  id: number = 0;
  content: string = "";
  type!: TerminalMetaEnumType;
  meta!: TerminalMetaType;
  tokenList: TokenListType = [];
  constructor(parent) {
    super(parent);
    this.parent = parent;
  }
  parseTokenList(tokenList: TokenListType) {
    let token: Token = tokenList.shift()!;
    if (token !== undefined) {
      this.content = token.content;
    }
    this.logger.diagnostic(
      `abstract parseTokenList(): Parsing ${this.content}`
    );
    return tokenList.length;
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
    let outputStr: string = "";
    this.logger.diagnostic(`AbstractTerminalNode: ${this.content}`);
    //    let outputStr1: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        if (prefix === undefined) prefix = "";
        if (colWidth0 === undefined) colWidth0 = 2;
        if (colWidth1 === undefined) colWidth1 = 15;
        if (colWidth2 === undefined) colWidth2 = 12;
        if (colWidth3 === undefined) colWidth3 = 25;
        if (colWidth4 === undefined) colWidth4 = 50;
        outputStr =
          " ".padEnd(colWidth0) +
          `${prefix}{${this.content}}`.padEnd(colWidth1) +
          `${this.constructor.name}`.padEnd(colWidth2);
        //          console.log(`prefix.length=${prefix.length}`);
        //prefix = " ".padEnd(prefix.length) + prefix;
        // if (this.type === TerminalMetaEnumType.audibleword) {
        //   //coerce
        //   let termObj: TerminalNode_WORD = this as TerminalNode_WORD;
        // termObj.meta.children.forEach(child => {
        //   let childAsWordObj = child as TerminalNode_WORD;
        //   console.log(`children=${child.content}`);
        //   outputStr =
        //     outputStr +
        //     "\n" +
        //     childAsWordObj.serialize(
        //       format,
        //       prefix,
        //       colWidth0,
        //       colWidth1,
        //       colWidth2,
        //       colWidth3,
        //       colWidth4
        //     );
        // });
        // }
        //    if (this.children.length > 0) output = `${output.slice(0, -1)})`; // remove trailing comma
        this.logger.diagnostic(`AbstractTerminalNode: outputStr=${outputStr}`);
        break;
      }
      case ParseNodeSerializeFormatEnumType.JSON: {
        outputStr = JSON.stringify(this);
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        // REWRITE unit tests to accept just stringify object
        //  outputStr = JSON.stringify(this);
        // should be a loop
        this.logger.diagnostic(`terminal unittest this.type=${this.type}`);
        let nodeJson: INodeJsonUnitTest = nodeJsonUnitTestInitializer;
        let meta: IAudibleWordTerminalMeta = this
          .meta as IAudibleWordTerminalMeta;
        nodeJson.ID = -1;
        nodeJson.TERM = this.content;
        nodeJson.TYPE = this.type;
        //        nodeJson.PRON = meta.altpronunciation; // only generated for audiblewords
        //        nodeJson.RECO = meta.altrecognition; // only generated for audiblewords
        outputStr = outputStr + JSON.stringify(nodeJson);
        if (meta.children !== undefined && meta.children.length > 0) {
          meta.children.forEach(child => {
            let childTerm: ITerminalContent = child as ITerminalContent;
            nodeJson.ID = childTerm.id;
            nodeJson.TERM = childTerm.content;
            nodeJson.TYPE = childTerm.type;
            let childTermMeta = childTerm.meta as IAudibleWordTerminalMeta;
            nodeJson.PRON = childTermMeta.altpronunciation;
            nodeJson.RECO = childTermMeta.altrecognition;
            outputStr = outputStr + JSON.stringify(nodeJson);
          });
        }
        break;
      }
      default: {
      }
    }
    this.logger.diagnostic(`AbstractTerminalNode: outputStr=${outputStr}`);
    //    this.logger.diagnostic(`AbstractTerminalNode: outputStr1=${outputStr1}`);
    return outputStr;
  }
  // serializeColumnar(
  //   prefix?: string,
  //   colWidth0?: number,
  //   colWidth1?: number,
  //   colWidth2?: number,
  //   colWidth3?: number
  // ): string {
  //   if (prefix === undefined) prefix = "";
  //   if (colWidth0 === undefined) colWidth0 = 2;
  //   if (colWidth1 === undefined) colWidth1 = 15;
  //   if (colWidth2 === undefined) colWidth2 = 12;
  //   if (colWidth3 === undefined) colWidth3 = 25;
  //   let table =
  //     " ".padEnd(colWidth0) +
  //     `${prefix}{${this.content}}`.padEnd(colWidth1) +
  //     `${TerminalNodeEnumMap.get(this.type)}`.padEnd(colWidth2) +
  //     `${this.constructor.name}`.padEnd(colWidth3) +
  //     ` ${this.altpronunciation} ${this.altrecognition}`;
  //   //    if (this.children.length > 0) output = `${output} `;
  //   prefix = " ".padEnd(prefix.length) + prefix;
  //   this.children.forEach(child => {
  //     table =
  //       table +
  //       "\n" +
  //       child.serialize(
  //         format,
  //         prefix,
  //         colWidth0,
  //         colWidth1,
  //         colWidth2,
  //         colWidth3,
  //         colWidth4
  //       );
  //   });
  //   //    if (this.children.length > 0) output = `${output.slice(0, -1)})`; // remove trailing comma
  //
  //   return table;
  // }
  //  serializeForUnitTest(): string {
  //   interface INodeJson {
  //     ID: number;
  //     TERM: string;
  //     TYPE: number;
  //     PRON: string;
  //     RECO: string;
  //   }
  //   // should be a loop
  //   let nodeJson: INodeJson = { ID: 0, TERM: "", TYPE: 0, PRON: "", RECO: "" };
  //   let output: string = "";
  //   nodeJson.ID = -1;
  //   nodeJson.TERM = this.content;
  //   nodeJson.TYPE = this.type;
  //   nodeJson.PRON = this.altpronunciation;
  //   nodeJson.RECO = this.altrecognition;
  //   output = output + JSON.stringify(nodeJson);
  //   this.children.forEach(child => {
  //     nodeJson.ID = child.id;
  //     nodeJson.TERM = child.content;
  //     nodeJson.TYPE = child.type;
  //     nodeJson.PRON = child.altpronunciation;
  //     nodeJson.RECO = child.altrecognition;
  //     output = output + JSON.stringify(nodeJson);
  //   });
  //   return output;
  // }
}
abstract class CompoundTerminalNode extends AbstractTerminalNode
  implements ITerminalNode {
  children: ITerminalNode[] = [];
  constructor(parent) {
    super(parent);
  }
}
type IAudibleTerminalNode = ITerminalNode;
abstract class TerminalNode_AUDIBLE extends AbstractTerminalNode
  implements IAudibleTerminalNode {
  constructor(parent) {
    super(parent);
  }
  parse() {
    return 0;
  }
  parseTokenList(tokenList: TokenListType): number {
    let token: Token = tokenList.shift()!;
    if (token !== undefined) {
      this.content = token.content;
      this.meta = IAudibleWordTerminalMetaInitializer;
      if (/^[A-Z]{3,}$/.test(this.content) && AcronymMap.has(this.content)) {
        let expansionCsv = AcronymMap.get(this.content);
        if (expansionCsv !== undefined) {
          let expansionList = expansionCsv.split(",");
          for (let idx = 0; idx < this.content.length; idx++) {
            let child = new TerminalNode_WORD(this);
            child.content = this.content.slice(idx, idx + 1);
            child.meta.altpronunciation = expansionList[idx];
            child.meta.altrecognition = expansionList[idx];
            this.meta.children.push(child);
          }
        }
      }
    }
    return 1; //this.tokens.length;
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
    let outputStr: string = "";
    this.logger.diagnostic(
      `TerminalNode_Audible: serialize(${format}) this.type=${this.type} content=${this.content}`
    );

    switch (format) {
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        outputStr = super.serialize(
          format,
          prefix,
          colWidth0,
          colWidth1,
          colWidth2,
          colWidth3,
          colWidth4
        );
        this.logger.diagnostic(
          `TerminalNode_Audible: serialize(${format}) return from super.serialze()=${outputStr}`
        );
        outputStr =
          outputStr +
          ` ${this.meta.altpronunciation} ${this.meta.altrecognition}`;
        ///          if (this.children.length > 0) output = `${output} `;
        ///          console.log(`prefix.length=${prefix.length}`);
        ///  prefix = " ".padEnd(prefix.length) + prefix;
        let terminalNode: IAudibleTerminalNode;
        for (terminalNode of this.meta.children) {
          this.logger.diagnostic(
            `audible tabular children.type=${terminalNode.type} ${terminalNode.content} ${terminalNode.constructor.name}`
          );
        }
        // for (let i = 0; i < this.meta.children.length; i++) {
        //   this.logger.diagnostic(
        //     `TerminalNode_Audible: child.content=${this.meta.children[i].content} ${this.constructor.name}`
        //   );
        // }
        // this.meta.children.forEach(child => {
        //   this.logger.diagnostic(
        //     `TerminalNode_Audible: child.content=${child.content} again`
        //   );
        // this.logger.diagnostic(
        //   `TerminalNode_Audible: child.serialize(${format})=${this.meta.children[i].serialize(
        //     format,
        //     prefix,
        //     colWidth0,
        //     colWidth1,
        //     colWidth2,
        //     colWidth3,
        //     colWidth4
        //   )}`
        // );
        //          let terminalNode: IAudibleTerminalNode;
        for (terminalNode of this.meta.children) {
          outputStr =
            outputStr +
            "\n" +
            terminalNode.serialize(
              format,
              prefix,
              colWidth0,
              colWidth1,
              colWidth2,
              colWidth3,
              colWidth4
            );
        }

        `TerminalNode_Audible: serialize(${format}) return from meta.children.serialze()=${outputStr}`;
        //if (this.meta.children.length > 0) outputStr = `${outputStr.slice(0, -1)})`; // remove trailing comma
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        let nodeJson: INodeJsonUnitTest = nodeJsonUnitTestInitializer;
        let meta: IAudibleWordTerminalMeta = this
          .meta as IAudibleWordTerminalMeta;
        console.log(`IaudibleWord meta.altpron=${this.meta.altpronunciation}`);
        console.log(`IaudibleWord meta.altreg=${this.meta.altrecognition}`);
        nodeJson.ID = -1;
        nodeJson.TERM = this.content;
        nodeJson.TYPE = this.type; // terminalNode type
        nodeJson.PRON = this.meta.altpronunciation; // only generated for audiblewords
        nodeJson.RECO = this.meta.altrecognition; // only generated for audiblewords
        outputStr = outputStr + JSON.stringify(nodeJson);
        console.log(`IaudibleWord before children outputStr=${outputStr}`);
        if (this.meta.children !== undefined && this.meta.children.length > 0) {
          this.logger.diagnostic(
            `audible unittest children.length=${this.meta.children.length}`
          );
          let terminalNode: IAudibleTerminalNode;
          for (terminalNode of this.meta.children) {
            this.logger.diagnostic(
              `audible unittest children.type=${terminalNode.type} ${terminalNode.content} ${terminalNode.constructor.name}`
            );
            let nodeJson: INodeJsonUnitTest = nodeJsonUnitTestInitializer;
            let meta: IAudibleWordTerminalMeta = this
              .meta as IAudibleWordTerminalMeta;
            nodeJson.TERM = terminalNode.content;
            nodeJson.TYPE = terminalNode.type;
            nodeJson.PRON = meta.altpronunciation; // only generated for audiblewords
            nodeJson.RECO = meta.altrecognition; // only generated for audiblewords
            outputStr = outputStr + JSON.stringify(nodeJson);
            //        outputStr = outputStr + terminalNode.serialize(format);
          }
        }
        break;
      }
    }
    this.logger.diagnostic(
      `TerminalNode_AUDIBLE serialize(${format})=${outputStr}`
    );
    return outputStr;
  }
  transform() {
    return 0;
  }
  type: TerminalMetaEnumType = TerminalMetaEnumType.audibleword;
  meta: IAudibleWordTerminalMeta = IAudibleWordTerminalMetaInitializer;
}
abstract class TerminalNode_NONAUDIBLE extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
  }
  type: TerminalMetaEnumType = TerminalMetaEnumType.nonaudibleword;
  meta: INonaudibleWordTerminalMeta = INonaudibleWordTerminalMetaInitializer;
  parse() {
    return 0;
  }
  transform() {
    return 0;
  }
}
class TerminalNode_WORD extends TerminalNode_AUDIBLE implements ITerminalNode {
  constructor(parent) {
    super(parent);
    //    this.type = TerminalNodeEnumType.WORD;
  }
  type: TerminalMetaEnumType = TerminalMetaEnumType.audibleword;
  meta: IAudibleWordTerminalMeta = IAudibleWordTerminalMetaInitializer;
  //parse() {return 0} // implemented in parent class
  parseTokenList(tokenList: TokenListType): number {
    let tokenListCount: number = super.parseTokenList(tokenList);
    // check for additional processing for this.content
    // acronymMap lookup. If necessary, create children terminalNodes

    // check for additional attributes for this.content
    // pronunciationDictionary
    // recognitionpattern
    return tokenListCount;
  }
  transform() {
    return 0;
  }
}
class TerminalNode_NUMBER extends TerminalNode_AUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
  }
}
class TerminalNode_PUNCTUATION extends TerminalNode_NONAUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
  }
  type: TerminalMetaEnumType = TerminalMetaEnumType.punctuation;
  // parseTokenList(tokenList: TokenListType): number {
  //   let token: Token = tokenList.shift()!;
  //   if (token !== undefined) {
  //     this.content = token.content;
  //   }
  //   return tokenList.length; //this.tokens.length;
  // }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    prefix?: string,
    col0?: number,
    col1?: number,
    col2?: number,
    col3?: number,
    col4?: number
  ): string {
    return super.serialize(format, prefix, col0, col1, col2, col3, col4);
  }
}
class TerminalNode_MLTAG extends TerminalNode_NONAUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    //    this.type = TerminalNodeEnumType.MLTAG;
  }
}
class TerminalNode_MLTAG_END extends TerminalNode_NONAUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    //    this.type = TerminalNodeEnumType.MLTAG_END;
  }
}

class TerminalNode_MLTAG_SELFCLOSING extends TerminalNode_NONAUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    //    this.type = TerminalNodeEnumType.MLTAG_SELFCLOSING;
  }
}
class TerminalNode_WHITESPACE extends TerminalNode_NONAUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    //    this.type = TerminalNodeEnumType.WHITESPACE;
  }
}
abstract class TerminalNode_MLTAG_ extends CompoundTerminalNode
  implements ITerminalNode {
  //  markupLabel: string;
  constructor(parent) {
    super(parent);
    //    markupLabel = "";
  }
  parseTokenList(tokenList: TokenListType): number {
    // overrides standard parse()
    // assumes tokenList contains: <tag>one or more terms within tag</tag>
    // that cannot easily be tokenized using regexp. However, the default
    // behavior is to just concatenate the tokens within the markup tags
    let startTag = tokenList[0].content;
    if (tokenList.length > 2 && isValidMarkupTag(startTag)) {
      let endTag: string = endMarkupTag(startTag);
      //      let endTagIdx: number = tokenList.map(token => token.content).indexOf(endTag, 1);
      tokenList.shift(); // remove startTag
      this.content == "";
      let token: Token = tokenList.shift()!;
      while (token !== undefined && token.content !== endTag) {
        this.content = this.content + token.content;
        token = tokenList.shift()!;
      }
    } else {
      this.logger.error(
        `Encountered unhandled token for token=${startTag} within MLTAG_`
      );
    }
    return tokenList.length;
  }
}
class TerminalNode_MLTAG_EMAILADDRESS extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    //    this.type = TerminalNodeEnumType.MLTAG;
  }
  parseTokenList(tokenList: TokenListType): number {
    let errorMsg: string = `Error parsing tokens for object ${this.constructor.name}`;
    let errorMsgPostfix: string = "";
    let startTag = tokenList[0].content;
    if (tokenList.length > 2 && isValidMarkupTag(startTag)) {
      let endTag: string = endMarkupTag(startTag);
      tokenList.shift(); // remove startTag
      this.content == "";
      let token: Token = tokenList.shift()!;
      while (token !== undefined && token.content !== endTag) {
        this.content = this.content + token.content;
        ////        let child: ITerminalNode;
        switch (token.type) {
          case TokenType.NUMBER: {
            // just in case (no pun intended)
            let child: TerminalNode_NUMBER = new TerminalNode_NUMBER(this);
            child.content = token.content;
            this.meta.children.push(child);
            break;
          }
          case TokenType.PUNCTUATION: {
            // ultimately must create token literal dictionary to support !#$%&'*+-/=?^_`{|}~
            let child: TerminalNode_WORD = new TerminalNode_WORD(this);
            child.content = token.content;
            if (token.content === TokenLiteral.ATSIGN) {
              child.meta.altpronunciation = "at";
            } else if (token.content === TokenLiteral.DOT) {
              child.meta.altpronunciation = "dot";
            } else if (token.content === TokenLiteral.DASH) {
              child.meta.altpronunciation = "dash";
            } else if (token.content === TokenLiteral.UNDERSCORE) {
              child.meta.altpronunciation = "underscore";
            } else {
              // do nothing
            }
            if (child.meta.altpronunciation.length > 0)
              this.meta.children.push(child);
            break;
          }
          default:
            // treat everything else as word
            let child: TerminalNode_WORD = new TerminalNode_WORD(this);
            child.content = token.content;
        }
        token = tokenList.shift()!;
      }
      // nice to have: parse domain type (last child) e.g., com, edu for pronunciation
      // especially country us, ca, etc
    } else {
      this.logger.error(`${errorMsg} ${errorMsgPostfix}`);
    }
    return tokenList.length;
  }
}

class TerminalNode_MLTAG_PHONENUMBER extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
  }
  parseTokenList(tokenList: TokenListType): number {
    let errorMsg: string = `Error parsing tokens for object ${this.constructor.name}`;
    let errorMsgPostfix: string = "";
    try {
      // catch undefined runtime assertion
      let startTag = tokenList[0].content;
      //      this.logger.diagnosticMode = true;
      let token: Token | undefined;

      if (tokenList.length < 6 || !isValidMarkupTag(startTag))
        throw new Error(
          `${errorMsg} with only ${tokenList.length} tokens for ${startTag}`
        );
      tokenList.shift(); // remove startTag
      this.content == "";
      // parse area code (###)
      errorMsgPostfix = "parsing area code";
      token = tokenList.shift()!;
      this.logger.diagnostic(token.content);
      let child: ITerminalNode;
      // expecting (
      if (token.content !== TokenLiteral.LPAREN)
        throw new Error(`${errorMsg} expected "${TokenLiteral.LPAREN}"`);
      child = new TerminalNode_PUNCTUATION(this);
      this.content = this.content + token.content;
      child.content = token.content;
      this.meta.children.push(child);
      token = tokenList.shift()!;
      this.logger.diagnostic(token.content);
      // expecting ###
      this.content = this.content + token.content;
      [...token!.content].forEach(numeral => {
        child = new TerminalNode_NUMBER(this);
        child.content = numeral;
        this.meta.children.push(child);
      });
      token = tokenList.shift()!;
      this.logger.diagnostic(token.content);

      // expecting )
      if (token.content !== TokenLiteral.RPAREN)
        throw `${errorMsg} expected "${TokenLiteral.RPAREN}"`;

      this.content = this.content + token.content;
      child = new TerminalNode_PUNCTUATION(this);
      child.content = token.content;
      this.meta.children.push(child);
      token = tokenList.shift();
      this.logger.diagnostic(token!.content);

      if (token!.type === TokenType.WHITESPACE) {
        this.content = this.content + token!.content;
        child = new TerminalNode_WHITESPACE(this);
        child.content = token!.content;
        this.meta.children.push(child);
        token = tokenList.shift();
        this.logger.diagnostic(token!.content);
      }
      // ### prefix
      errorMsgPostfix = "parsing prefix";
      this.content = this.content + token!.content;
      [...token!.content].forEach(numeral => {
        child = new TerminalNode_NUMBER(this);
        child.content = numeral;
        this.meta.children.push(child);
      });
      token = tokenList.shift()!;
      this.logger.diagnostic(token!.content);
      // expecting dash
      if (token.content !== TokenLiteral.DASH)
        throw `${errorMsg} expected "${TokenLiteral.DASH}"`;

      this.content = this.content + token.content;
      child = new TerminalNode_PUNCTUATION(this);
      child.content = token.content;
      this.meta.children.push(child);
      token = tokenList.shift()!; // expecting line number

      this.logger.diagnostic(token!.content);
      errorMsgPostfix = "parsing line number";
      this.content = this.content + token.content;
      [...token!.content].forEach(numeral => {
        child = new TerminalNode_NUMBER(this);
        child.content = numeral;
        this.meta.children.push(child);
      });
      token = tokenList.shift()!; // discarding </phonenumber>
      //      let endTag: string = endMarkupTag(startTag);
    } catch (e) {
      this.logger.error(`${e.message}; ${errorMsgPostfix}`);
      throw e;
    }
    return tokenList.length;
  }
}
class TerminalNode_MLTAG_TIME extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
  }
}
class TerminalNode_MLTAG_DATE1 extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
  }
  parseToken(tokenList: TokenListType): number {
    let errorMsg: string = `Error parsing tokens for object ${this.constructor.name}`;
    let errorMsgPostFix: string = "";
    try {
      // catch undefined runtime assertion
      let startTag = tokenList[0].content;
      //      this.logger.diagnosticMode = true;
      let token: Token;

      if (tokenList.length < 6 || !isValidMarkupTag(startTag))
        throw new Error(
          `${errorMsg} with only ${tokenList.length} tokens for ${startTag}`
        );
      tokenList.shift(); // remove startTag
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing day";
      if (token !== undefined) {
        let child: TerminalNode_NUMBER;
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        if (OrdinalNumberMap.has(token.content)) {
          child.meta.altpronunciation = OrdinalNumberMap.get(token.content)!;
        }
        this.meta.children.push(child);
      }
      token = tokenList.shift()!;
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        let child: TerminalNode_WHITESPACE = new TerminalNode_WHITESPACE(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.meta.children.push(child);
      }
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing month";
      if (token !== undefined && token.type === TokenType.WORD) {
        let child: TerminalNode_WORD = new TerminalNode_WORD(this);
        this.content = this.content + token.content;
        child.content = token.content;
        child.meta.altpronunciation = MonthFromAbbreviationMap.get(
          token.content.slice(0, 3).toLowerCase()
        )!;
        this.meta.children.push(child);
      }
      token = tokenList.shift()!;
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        let child: TerminalNode_NUMBER = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.meta.children.push(child);
      }
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing year";
      if (token !== undefined) {
        let child: TerminalNode_NUMBER = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        if (token.content.length === 4) {
          child.meta.altpronunciation = `${CardinalNumberMap.get(
            token.content.slice(0, 2)
          )} ${CardinalNumberMap.get(token.content.slice(2, 4))}`;
        }
        this.meta.children.push(child);
      }
      tokenList.shift();
    } catch (e) {
      this.logger.error(`${e.message}; ${errorMsg} ${errorMsgPostFix}`);
      throw e;
    }
    return tokenList.length;
  }
}
class TerminalNode_MLTAG_DATE2 extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
  }
  parseTokenList(tokenList: TokenListType): number {
    let errorMsg: string = `Error parsing tokens for object ${this.constructor.name}`;
    let errorMsgPostFix: string = "";
    //    let child: ITerminalNode;
    try {
      let startTag = tokenList[0].content;
      //      this.logger.diagnosticMode = true;
      let token: Token;

      if (tokenList.length < 5 || !isValidMarkupTag(startTag))
        throw new Error(
          `${errorMsg} with only ${tokenList.length} tokens for ${startTag}`
        );
      tokenList.shift(); // remove startTag
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing month";
      if (token !== undefined && token.type === TokenType.WORD) {
        let child: TerminalNode_WORD = new TerminalNode_WORD(this);
        this.content = this.content + token.content;
        child.content = token.content;
        child.meta.altpronunciation = MonthFromAbbreviationMap.get(
          token.content.slice(0, 3).toLowerCase()
        )!;
        this.meta.children.push(child);
      }
      token = tokenList.shift()!;
      if (
        token !== undefined &&
        token.type === TokenType.PUNCTUATION &&
        token.content === TokenLiteral.DOT
      ) {
        errorMsgPostFix = "parsing dot";
        let child = new TerminalNode_PUNCTUATION(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.meta.children.push(child);
        token = tokenList.shift()!;
      }
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        errorMsgPostFix = "parsing whitespace";
        let child = new TerminalNode_WHITESPACE(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.meta.children.push(child);
      }
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing day";
      if (token !== undefined) {
        let child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        if (OrdinalNumberMap.has(token.content)) {
          child.meta.altpronunciation = OrdinalNumberMap.get(token.content)!;
        }
        this.meta.children.push(child);
      }
      token = tokenList.shift()!;
      if (
        token !== undefined &&
        token.type === TokenType.PUNCTUATION &&
        token.content === TokenLiteral.COMMA
      ) {
        errorMsgPostFix = "parsing comma";
        let child = new TerminalNode_PUNCTUATION(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.meta.children.push(child);
      }
      token = tokenList.shift()!;
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        errorMsgPostFix = "parsing whitespace";
        let child = new TerminalNode_WHITESPACE(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.meta.children.push(child);
        token = tokenList.shift()!;
      }
      errorMsgPostFix = "parsing year";
      if (token !== undefined) {
        let child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        if (token.content.length === 4) {
          child.meta.altpronunciation = `${CardinalNumberMap.get(
            token.content.slice(0, 2)
          )} ${CardinalNumberMap.get(token.content.slice(2, 4))}`;
        }
        this.meta.children.push(child);
      }
      tokenList.shift(); // discard endtag
      // for (let i = 0; i < this.meta.children.length; i++)
      //   console.log(
      //     `DATE2 children: ${this.meta.children[i].constructor.name}`
      //   );
    } catch (e) {
      this.logger.error(`${e.message}; ${errorMsg} ${errorMsgPostFix}`);
      throw e;
    }
    return tokenList.length;
  }
}
class TerminalNode_MLTAG_DATE3 extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    ///    this.type = TerminalNodeEnumType.MLTAG;
  }
  parseTokenList(tokenList: TokenListType): number {
    let errorMsg: string = `Error parsing tokens for object ${this.constructor.name}`;
    let errorMsgPostFix: string = "";
    //    let child: ITerminalNode;
    try {
      let startTag = tokenList[0].content;
      //      this.logger.diagnosticMode = true;
      let token: Token;

      if (tokenList.length < 5 || !isValidMarkupTag(startTag))
        throw new Error(
          `${errorMsg} with only ${tokenList.length} tokens for ${startTag}`
        );
      tokenList.shift(); // remove startTag
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing month";
      if (token !== undefined && token.type === TokenType.WORD) {
        let child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        child.meta.altpronunciation = MonthFromAbbreviationMap.get(
          token.content.slice(0, 3).toLowerCase()
        )!;
        this.meta.children.push(child);
      }
      token = tokenList.shift()!;
      if (
        token !== undefined &&
        token.type === TokenType.PUNCTUATION &&
        token.content === TokenLiteral.DOT
      ) {
        errorMsgPostFix = "parsing dot";
        let child = new TerminalNode_PUNCTUATION(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.meta.children.push(child);
        token = tokenList.shift()!;
      }
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        errorMsgPostFix = "parsing whitespace";
        let child = new TerminalNode_WHITESPACE(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.meta.children.push(child);
      }
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing day";
      if (token !== undefined) {
        let child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        if (OrdinalNumberMap.has(token.content)) {
          child.meta.altpronunciation = OrdinalNumberMap.get(token.content)!;
        }
        this.meta.children.push(child);
      }
      tokenList.shift(); // discard endtag
    } catch (e) {
      this.logger.error(`${e.message}; ${errorMsg} ${errorMsgPostFix}`);
      throw e;
    }
    return tokenList.length;
  }
}
class TerminalNode_MLTAG_CONTRACTION extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    ///    this.type = TerminalNodeEnumType.WORD;
  }
}
class TerminalNode_MLTAG_NUMBER_WITHCOMMAS extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    ///    this.type = TerminalNodeEnumType.NUMBER;
  }
  parseTokenList(tokenList: TokenListType): number {
    // parse into word with recogition without comma
    let tokenListCount: number = super.parseTokenList(tokenList);
    // replace comma with [.]?
    this.meta.altrecognition = this.content.replace(/,/g, "[,]?");
    // check for additional processing for this.content
    // acronymMap lookup. If necessary, create children terminalNodes

    // check for additional attributes for this.content
    // pronunciationDictionary
    // recognitionpattern
    return tokenListCount;
  }
}
class TerminalNode_MLTAG_TOKEN extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    ///    this.type = TerminalNodeEnumType.MLTAG;
  }
}
class TerminalNode_MLTAG_USD extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    ///    this.type = TerminalNodeEnumType.MLTAG;
  }
}
// type ContentNodeClassType =
//   | typeof TerminalNode_WORD
//   | typeof TerminalNode_NUMBER
//   | typeof TerminalNode_PUNCTUATION
//   | typeof TerminalNode_MLTAG
//   | typeof TerminalNode_MLTAG_END
//   | typeof TerminalNode_MLTAG_SELFCLOSING
//   | typeof TerminalNode_WHITESPACE;
type SectionNodeMarkdownClassType =
  | typeof SectionParseNode_BLOCKQUOTE
  | typeof SectionParseNode_HEADING
  | typeof SectionParseNode_PARAGRAPH
  | typeof SectionParseNode_LIST_ORDERED
  | typeof SectionParseNode_LIST_UNORDERED
  | typeof SectionParseNode_FILLIN
  | typeof SectionParseNode_PHOTOENTRY;
//   LIST_UNORDERED = "LIST_UNORDERED",
//   LIST_ORDERED = "LIST_ORDERED",
//   COMMENT = "COMMENT",
//   BLOCKQUOTE = "BLOCKQUOTE",
//   PASSTHRUTAG = "PASSTHRUTAG",
//   PHOTOENTRY = "PHOTOENTRY",
//   FILLIN = "FILLIN",
//   PAGE = "PAGE",
//   SENTENCE = "SENTENCE",
//   UNKNOWN = "UNKNOWN" // should always be last
//
type SectionNodeMarkdownMapType = Record<
  MarkdownSectionTagType,
  SectionNodeMarkdownClassType
>;
const SectionNodeMarkdownClassMap: SectionNodeMarkdownMapType = {
  [MarkdownSectionTagType.HEADING]: SectionParseNode_HEADING,
  [MarkdownSectionTagType.PARAGRAPH]: SectionParseNode_PARAGRAPH,
  [MarkdownSectionTagType.SECTION_ORDERED]: SectionParseNode_LIST_ORDERED,
  [MarkdownSectionTagType.SECTION_UNORDERED]: SectionParseNode_LIST_UNORDERED,
  [MarkdownSectionTagType.FILLIN]: SectionParseNode_FILLIN,
  [MarkdownSectionTagType.PHOTOENTRY]: SectionParseNode_PHOTOENTRY,
  [MarkdownSectionTagType.BLOCKQUOTE]: SectionParseNode_BLOCKQUOTE
};
type TerminalNodeMapType = Record<number, TerminalNodeClassType>;
const TerminalNodeClassMap: TerminalNodeMapType = {
  [TokenType.WORD]: TerminalNode_WORD,
  [TokenType.PUNCTUATION]: TerminalNode_PUNCTUATION,
  [TokenType.MLTAG]: TerminalNode_MLTAG,
  [TokenType.MLTAG_END]: TerminalNode_MLTAG_END,
  [TokenType.MLTAG_SELFCLOSING]: TerminalNode_MLTAG_SELFCLOSING,
  [TokenType.WHITESPACE]: TerminalNode_WHITESPACE,
  [TokenType.NUMBER]: TerminalNode_NUMBER
};
type TerminalNodeMarkupClassType =
  | typeof TerminalNode_MLTAG_EMAILADDRESS
  | typeof TerminalNode_MLTAG_PHONENUMBER
  | typeof TerminalNode_MLTAG_TIME
  | typeof TerminalNode_MLTAG_DATE1
  | typeof TerminalNode_MLTAG_DATE2
  | typeof TerminalNode_MLTAG_DATE3
  | typeof TerminalNode_MLTAG_CONTRACTION
  | typeof TerminalNode_MLTAG_NUMBER_WITHCOMMAS
  | typeof TerminalNode_MLTAG_TOKEN
  | typeof TerminalNode_MLTAG_USD;
type TerminalNodeMarkupMapType = Record<
  MarkupLabelType,
  TerminalNodeMarkupClassType
>;
const TerminalNodeMarkupClassMap: TerminalNodeMarkupMapType = {
  [MarkupLabelType.EMAILADDRESS]: TerminalNode_MLTAG_EMAILADDRESS,
  [MarkupLabelType.PHONENUMBER]: TerminalNode_MLTAG_PHONENUMBER,
  [MarkupLabelType.TIME]: TerminalNode_MLTAG_TIME,
  [MarkupLabelType.DATE1]: TerminalNode_MLTAG_DATE1,
  [MarkupLabelType.DATE2]: TerminalNode_MLTAG_DATE2,
  [MarkupLabelType.DATE3]: TerminalNode_MLTAG_DATE3,
  [MarkupLabelType.CONTRACTION]: TerminalNode_MLTAG_CONTRACTION,
  [MarkupLabelType.NUMBER_WITHCOMMAS]: TerminalNode_MLTAG_NUMBER_WITHCOMMAS,
  [MarkupLabelType.TOKEN]: TerminalNode_MLTAG_TOKEN,
  [MarkupLabelType.USD]: TerminalNode_MLTAG_USD
};

// LIST_UNORDERED = "LIST_UNORDERED",
// LIST_ORDERED = "LIST_ORDERED",
// COMMENT = "COMMENT",
// PASSTHRUTAG = "PASSTHRUTAG",
// PHOTOENTRY = "PHOTOENTRY",
// FILLIN = "FILLIN",
// PAGE = "PAGE",
// SENTENCE = "SENTENCE",
// UNKNOWN = "UNKNOWN" // should always be last

// Map token type with TerminalNode class type
/*
let terminalNodes: ITerminalNode[] = [];
let node: ITerminalNode = new TerminalNode_WORD(this);
let belongs: boolean = TokenType.WORD in TerminalNodeClassMap? true: false;
node = new TerminalNodeClassMap[TokenType.WORD](this);
terminalNodes.push(node);

let sentenceNodes: ISentenceNode[] = [];
let sentenceNode: ISentenceNode = new SentenceNode();
sentenceNodes.push(sentenceNode);

let sectionNodes: ISectionNode[] = [];
let sectionNode: ISectionNode = new SectionNode_PARAGRAPH(this);
sectionNode.parse();
sectionNodes.push(sectionNode);
*/
