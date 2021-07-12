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
import {
  PageContentType,
  OrderedListTypeEnumType,
  PageFormatEnumType,
  SectionContentType,
  SectionVariantEnumType,
  SentenceContentType,
  TerminalContentType,
  UnorderedListMarkerEnumType
} from "./pageContentType";
import {
  AcronymMap,
  BaseClass,
  CardinalNumberMap,
  Logger,
  MonthFromAbbreviationMap,
  OrdinalNumberMap,
  UserContext
} from "./utilities";
import {
  IDataSource,
  BasicMarkdownSource,
  RawMarkdownSource
} from "./dataadapter";

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
abstract class Content extends BaseClass {
  protected id: number | null;
  protected name: string;
  protected parent: BaseClass;
  protected _userContext!: UserContext;
  protected _markdownDataSource!: BasicMarkdownSource;
  constructor(parent: any | undefined) {
    super(parent);
    this.id = null;
    this.name = "";
    this.parent = parent;
    this._userContext =
      typeof parent !== "undefined" &&
      parent !== null &&
      typeof parent._userContext !== "undefined"
        ? parent._userContext
        : null;
  }
  get userContext() {
    if (this._userContext === null) {
      let e = new Error();
      e.message = "user context is null";
      this.logger.error(e.message);
      throw e;
    } else {
      return this._userContext;
    }
  }
  set userContext(userContext) {
    this._userContext = userContext;
  }
  parse() {
    // different for each type of Content
  }
  serialize() {}
  transform() {}
}
class FileContent extends Content {
  // markdown file can contain one or more pages
  pageNodes: IPageNode[] = [];
  constructor(parent) {
    super(parent);
  }
  connect(fileName: string) {
    // should handle JSON, unittest or MD files based on filetype?
    this._markdownDataSource = new BasicMarkdownSource(this);
    // this._markdownDataSource = new RawMarkdownSource(this);
    return this._markdownDataSource.connect(fileName);
  }
}
export interface IPageNode {
  id: number;
  name: string;
  description: string;
  firstTermIdx: number;
  sectionNodes: ISectionNode[];
  connect(fileName: string): number;
  parse(): any; // any to avoid compilation error, should be removed
  transform(): any;
  serialize(): SectionContentType | any; // any to avoid compilation error, should be removed
}
export class PageNode extends FileContent implements IPageNode {
  id: number = 0;
  name: string = "";
  description: string = "";
  protected owner: string = "";
  protected pageFormatType = PageFormatEnumType.default;
  protected created: Date = new Date();
  protected modified?: Date;
  protected transformed?: Date;
  firstTermIdx: number = -1;
  protected lastTermIdx: number = -1;
  sectionNodes: ISectionNode[] = [];
  constructor(parent) {
    super(parent);
  }
  parse() {
    if (this._markdownDataSource === undefined) {
      this.logger.warning(`Data Source is required but undefined`);
      return;
    }
    this._markdownDataSource.serialize();
    for (const record of this._markdownDataSource.buffer) {
      record;
    }
    /*
    const zeroPad = (num, places) => String(num).padStart(places, "0");
    for (let i = 0; i < this._markdownDataSource.buffer.length; i++) {
      console.log(
        `${zeroPad(i + 1, 3)}: {${
          this._markdownDataSource.buffer[i].content
        }} (tag:${this._markdownDataSource.buffer[i].mdtype})`
      );
    }
    */

    // PageSourceType input
  }
  serialize(): PageContentType | null {
    let sectionContent: SectionContentType[] = [];
    for (let section of this.sectionNodes) {
      // could embed as Big arrow function below
      //    sectionContent.firstTermIdx(section.serialize()); // where sectionContent = results.sections
    }
    let result: PageContentType = {
      id: this.id,
      name: this.name,
      description: this.description,
      owner: "",
      pageFormatType: this.pageFormatType,
      created: this.created,
      modified: this.modified === undefined ? this.created : this.modified,
      transformed:
        this.transformed === undefined ? this.created : this.transformed,
      firstTermIdx: this.firstTermIdx,
      lastWordIdx: this.lastTermIdx,
      sections: sectionContent
    };
    return result;
  }
  transform(): any {}
}
interface ISectionNode {
  id: number;
  name: string;
  description: string;
  firstTermIdx: number;
  sentenceNodes: SentenceContentType[];
  parse(): any; // any to avoid compilation error, should be removed
  transform(): any;
  serialize(): SectionContentType | any; // any to avoid compilation error, should be removed
  // all of the finer details are hidden from the interface and conveyed via the (variants of) SectionContentType
}
abstract class AbstractSectionNode extends Content implements ISectionNode {
  // based on SectionVariantEnumType
  readonly id: number = 0;
  name: string = "";
  description: string = "";
  firstTermIdx: number = 0;
  sentenceNodes: SentenceContentType[] = [];
  constructor(parent) {
    super(parent);
  }
  // should use abstract to force implmenetation in derived classes
  parse() {}
  transform() {}
  serialize() {}
}
class SectionNode_HEADING extends AbstractSectionNode implements ISectionNode {
  // can have zero (when immediately followed by subsecion) or more sentences
  readonly type: SectionVariantEnumType = SectionVariantEnumType.heading;
  protected title: string = `${this.name}: ${this.description}`; // otherwise defaults to  name: description above
  protected recitable: boolean = false;
  protected audible: boolean = false;
  protected level: number = 0;
  constructor(parent) {
    super(parent);
  }
}
abstract class SectionNode_LIST extends AbstractSectionNode
  implements ISectionNode {}
class SectionNode_PARAGRAPH extends SectionNode_LIST implements ISectionNode {
  readonly type: SectionVariantEnumType = SectionVariantEnumType.paragraph;
  style: string = ""; // overrides css <p> but not user profile
  constructor(parent) {
    super(parent);
  }
  parse() {}
  serialize() {
    return null;
  }
}
class SectionNode_LIST_ORDERED extends SectionNode_LIST
  implements ISectionNode {
  readonly type: SectionVariantEnumType = SectionVariantEnumType.ordered_list;
  protected startNumber: number = 1;
  protected listType: OrderedListTypeEnumType =
    OrderedListTypeEnumType.numerical; //  overrides css but not user profile
}
class SectionNode_LIST_UNORDERED extends SectionNode_LIST
  implements ISectionNode {
  readonly type: SectionVariantEnumType = SectionVariantEnumType.unordered_list;
  protected marker: UnorderedListMarkerEnumType =
    UnorderedListMarkerEnumType.disc; // overrides css but not user profile
}
class SectionNode_FILLIN extends AbstractSectionNode implements ISectionNode {}
class SectionNode_PHOTOENTRY extends AbstractSectionNode
  implements ISectionNode {
  readonly type: SectionVariantEnumType = SectionVariantEnumType.photo_entry;
  protected image: string = ""; // path to img/filename
}
/*
remaining SectionNode types from enum SectionVariantEnumType {
  subsection,
  fillin_list,
  unittest
  */
interface ISentenceNode {
  readonly id: number;
  readonly content: string;
  readonly firstWordIdx: number;
  readonly terminalNodes: ITerminalNode[];
  parse(sentence: string);
  transform();
  serialize(): SentenceContentType | any;
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
abstract class AbstractSentenceNode extends Content implements ISentenceNode {
  id: number = 0;
  content: string = "";
  firstWordIdx: number = 0;
  terminalNodes: ITerminalNode[] = [];
  constructor(parent: ISectionNode | null) {
    super(parent);
  }
  //protected set content(content: string) {}
  parse() {}
  transform() {}
  serialize(): SentenceContentType | any {}
  serializeForUnitTest(): string {
    let output: string = "";
    //let terminalNode: ITerminalNode;
    this.terminalNodes.forEach(terminalNode => {
      output = output + terminalNode.serializeForUnitTest();
    });
    return output;
  }
  serializeColumnar(
    prefix?: string,
    col0?: number,
    col1?: number,
    col2?: number,
    col3?: number
  ): string {
    let table: string = `sentence[${this.id}]: ${this.content}\n`;
    if (prefix === undefined) prefix = "+-";
    for (let node of this.terminalNodes) {
      table =
        table + `${node.serializeColumnar(prefix, col0, col1, col2, col3)}\n`;
    }
    return table.slice(0, -1);
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
    //    this.logger.diagnosticMode = true;
    let markedUpSentence: string = this.tokenizer.insertMarkupTags(
      this.content
    );
    let tokens: TokenListType = this.tokenizer.tokenize(markedUpSentence);
    this.parseTokens(tokens);
    return this.terminalNodes;
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
        this.logger.diagnostic(
          `Encountered token type=${token.type} with markup tag=${token.content}`
        );
        terminalNode = new TerminalNodeMarkupClassMap[
          token.content.toLowerCase()
        ](this);
        //            terminalNode.userContext = this.userContext;
      } else if (token.type in TerminalNodeClassMap) {
        terminalNode = new TerminalNodeClassMap[token.type](this);
        //          terminalNode.userContext = this.userContext;
        this.logger.diagnostic(`Encountered token type=${token.type}`);
      } else {
        this.logger.diagnostic(
          `Encountered unexpected token type=${token.type}`
        );
      }
      if (terminalNode) {
        this.logger.diagnostic(`Parsing node=${token.content}`);
        terminalNode.parse(tokens);
        this.logger.diagnostic(`Parsed results=${terminalNode.content}`);
        this.terminalNodes.push(terminalNode);
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

interface ITerminalNode {
  id: number;
  type: number;
  content: string;
  children: ITerminalNode[]; // children supersede tokens!
  altpronunciation: string;
  altrecognition: string;
  tokens: TokenListType;
  parent: ISentenceNode;
  parse(tokenList: TokenListType): number;
  /* Manages processing within the scope of the term's tokens
   * 1) decomposing words to correct for speech recognition shortcomings
   *    (408) is interpreted as "4", "0", "8"
   *    Mar 17, 1983 is interpreted as "March", "17th", "1983"
   *    weng@gmail.com is interpreted as "weng", "at", "gmail" "dot", "com"
   * 2) acronyms and abbreviations (need to be conservative here though)
   * 3) alternate pronunciationDictionary
   * 4) alternate recognition patterns
   *
   * Anthing that requires knowledge outside of term is handled by parent
   *  such as word sequencing and pageunique ids
   */
  serialize(): TerminalContentType;
  serializeForUnitTest(): string;
  serializeColumnar(
    prefix?: string,
    colWidth0?: number,
    colWidth1?: number,
    colWidth2?: number,
    colWidth13?: number
  ): string;
}
abstract class AbstractTerminalNode extends BaseClass implements ITerminalNode {
  readonly id: number = 0;
  type!: number;
  content: string = "";
  children: ITerminalNode[] = []; // children supersede tokens!
  altpronunciation: string = "";
  altrecognition: string = "";
  tokens: TokenListType = []; // kill this property; superseded by children
  parent: ISentenceNode;
  protected firstWordIdx: number = -1;
  constructor(parent) {
    super(parent);
    this.parent = parent;
  }
  parseTokenList(tokenList: TokenListType): number {
    let token: Token = tokenList.shift()!;
    if (token !== undefined) {
      this.content = token.content;
      // Expanding acronym
      if (/^[A-Z]{3,}$/.test(this.content) && AcronymMap.has(this.content)) {
        let expansionCsv = AcronymMap.get(this.content);
        if (expansionCsv !== undefined) {
          let expansionList = expansionCsv.split(",");
          for (let idx = 0; idx < this.content.length; idx++) {
            let child = new TerminalNode_WORD(this);
            child.content = this.content.slice(idx, idx + 1);
            child.altpronunciation = expansionList[idx];
            child.altrecognition = expansionList[idx];
            this.children.push(child);
          }
        }
      }
    }
    return this.tokens.length;
  }
  serialize(): TerminalContentType | any {
    return;
  }
  serializeColumnar(
    prefix?: string,
    colWidth0?: number,
    colWidth1?: number,
    colWidth2?: number,
    colWidth3?: number
  ): string {
    if (prefix === undefined) prefix = "";
    if (colWidth0 === undefined) colWidth0 = 2;
    if (colWidth1 === undefined) colWidth1 = 15;
    if (colWidth2 === undefined) colWidth2 = 12;
    if (colWidth3 === undefined) colWidth3 = 25;
    let table =
      " ".padEnd(colWidth0) +
      `${prefix}{${this.content}}`.padEnd(colWidth1) +
      `${TerminalNodeEnumMap.get(this.type)}`.padEnd(colWidth2) +
      `${this.constructor.name}`.padEnd(colWidth3) +
      ` ${this.altpronunciation} ${this.altrecognition}`;
    //    if (this.children.length > 0) output = `${output} `;
    prefix = " ".padEnd(prefix.length) + prefix;
    this.children.forEach(child => {
      table =
        table +
        "\n" +
        child.serializeColumnar(
          prefix,
          colWidth0,
          colWidth1,
          colWidth2,
          colWidth3
        );
    });
    //    if (this.children.length > 0) output = `${output.slice(0, -1)})`; // remove trailing comma

    return table;
  }
  serializeForUnitTest(): string {
    interface INodeJson {
      ID: number;
      TERM: string;
      TYPE: number;
      PRON: string;
      RECO: string;
    }
    // should be a loop
    let nodeJson: INodeJson = { ID: 0, TERM: "", TYPE: 0, PRON: "", RECO: "" };
    let output: string = "";
    nodeJson.ID = -1;
    nodeJson.TERM = this.content;
    nodeJson.TYPE = this.type;
    nodeJson.PRON = this.altpronunciation;
    nodeJson.RECO = this.altrecognition;
    output = output + JSON.stringify(nodeJson);
    this.children.forEach(child => {
      nodeJson.ID = child.id;
      nodeJson.TERM = child.content;
      nodeJson.TYPE = child.type;
      nodeJson.PRON = child.altpronunciation;
      nodeJson.RECO = child.altrecognition;
      output = output + JSON.stringify(nodeJson);
    });
    return output;
  }
}
abstract class TerminalNode_AUDIBLE extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
  }
}
abstract class TerminalNode_NONAUDIBLE extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
  }
}
class TerminalNode_WORD extends TerminalNode_AUDIBLE implements ITerminalNode {
  constructor(parent) {
    super(parent);
    this.type = TerminalNodeEnumType.WORD;
  }
  parse(tokenList: TokenListType): number {
    let tokenListCount: number = super.parse(tokenList);
    // check for additional processing for this.content
    // acronymMap lookup. If necessary, create children terminalNodes

    // check for additional attributes for this.content
    // pronunciationDictionary
    // recognitionpattern
    return tokenListCount;
  }
}
class TerminalNode_NUMBER extends TerminalNode_AUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    this.type = TerminalNodeEnumType.NUMBER;
  }
}
class TerminalNode_PUNCTUATION extends TerminalNode_NONAUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    this.type = TerminalNodeEnumType.PUNCTUATION;
  }
}
class TerminalNode_MLTAG extends TerminalNode_NONAUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    this.type = TerminalNodeEnumType.MLTAG;
  }
}
class TerminalNode_MLTAG_END extends TerminalNode_NONAUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    this.type = TerminalNodeEnumType.MLTAG_END;
  }
}

class TerminalNode_MLTAG_SELFCLOSING extends TerminalNode_NONAUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    this.type = TerminalNodeEnumType.MLTAG_SELFCLOSING;
  }
}
class TerminalNode_WHITESPACE extends TerminalNode_NONAUDIBLE
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    this.type = TerminalNodeEnumType.WHITESPACE;
  }
}
abstract class TerminalNode_MLTAG_ extends TerminalNode_AUDIBLE
  implements ITerminalNode {
  //  markupLabel: string;
  constructor(parent) {
    super(parent);
    //    markupLabel = "";
  }
  parse(tokenList: TokenListType): number {
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
    this.type = TerminalNodeEnumType.MLTAG;
  }
  parse(tokenList: TokenListType): number {
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
        let child: ITerminalNode;
        switch (token.type) {
          case TokenType.NUMBER: // just in case (no pun intended)
            child = new TerminalNode_NUMBER(this);
            child.content = token.content;
            break;
          case TokenType.PUNCTUATION: // ultimately must create token literal dictionary to support !#$%&'*+-/=?^_`{|}~
            child = new TerminalNode_WORD(this);
            child.content = token.content;
            if (token.content === TokenLiteral.ATSIGN) {
              child.altpronunciation = "at";
            } else if (token.content === TokenLiteral.DOT) {
              child.altpronunciation = "dot";
            } else if (token.content === TokenLiteral.DASH) {
              child.altpronunciation = "dash";
            } else if (token.content === TokenLiteral.UNDERSCORE) {
              child.altpronunciation = "underscore";
            }
            break;
          default:
            // treat everything else as word
            child = new TerminalNode_WORD(this);
            child.content = token.content;
        }
        this.children.push(child);
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
    this.type = TerminalNodeEnumType.MLTAG;
  }
  parse(tokenList: TokenListType): number {
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
      this.children.push(child);
      token = tokenList.shift()!;
      this.logger.diagnostic(token.content);
      // expecting ###
      this.content = this.content + token.content;
      [...token!.content].forEach(numeral => {
        child = new TerminalNode_NUMBER(this);
        child.content = numeral;
        this.children.push(child);
      });
      token = tokenList.shift()!;
      this.logger.diagnostic(token.content);

      // expecting )
      if (token.content !== TokenLiteral.RPAREN)
        throw `${errorMsg} expected "${TokenLiteral.RPAREN}"`;

      this.content = this.content + token.content;
      child = new TerminalNode_PUNCTUATION(this);
      child.content = token.content;
      this.children.push(child);
      token = tokenList.shift();
      this.logger.diagnostic(token!.content);

      if (token!.type === TokenType.WHITESPACE) {
        this.content = this.content + token!.content;
        child = new TerminalNode_WHITESPACE(this);
        child.content = token!.content;
        this.children.push(child);
        token = tokenList.shift();
        this.logger.diagnostic(token!.content);
      }
      // ### prefix
      errorMsgPostfix = "parsing prefix";
      this.content = this.content + token!.content;
      [...token!.content].forEach(numeral => {
        child = new TerminalNode_NUMBER(this);
        child.content = numeral;
        this.children.push(child);
      });
      token = tokenList.shift()!;
      this.logger.diagnostic(token!.content);
      // expecting dash
      if (token.content !== TokenLiteral.DASH)
        throw `${errorMsg} expected "${TokenLiteral.DASH}"`;

      this.content = this.content + token.content;
      child = new TerminalNode_PUNCTUATION(this);
      child.content = token.content;
      this.children.push(child);
      token = tokenList.shift()!; // expecting line number

      this.logger.diagnostic(token!.content);
      errorMsgPostfix = "parsing line number";
      this.content = this.content + token.content;
      [...token!.content].forEach(numeral => {
        child = new TerminalNode_NUMBER(this);
        child.content = numeral;
        this.children.push(child);
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
    this.type = TerminalNodeEnumType.MLTAG;
  }
}
class TerminalNode_MLTAG_DATE1 extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    this.type = TerminalNodeEnumType.MLTAG;
  }
  parse(tokenList: TokenListType): number {
    let errorMsg: string = `Error parsing tokens for object ${this.constructor.name}`;
    let errorMsgPostFix: string = "";
    let child: ITerminalNode;
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
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        if (OrdinalNumberMap.has(token.content)) {
          child.altpronunciation = OrdinalNumberMap.get(token.content)!;
        }
        this.children.push(child);
      }
      token = tokenList.shift()!;
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        child = new TerminalNode_WHITESPACE(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.children.push(child);
      }
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing month";
      if (token !== undefined && token.type === TokenType.WORD) {
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        child.altpronunciation = MonthFromAbbreviationMap.get(
          token.content.slice(0, 3).toLowerCase()
        )!;
        this.children.push(child);
      }
      token = tokenList.shift()!;
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.children.push(child);
      }
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing year";
      if (token !== undefined) {
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        if (token.content.length === 4) {
          child.altpronunciation = `${CardinalNumberMap.get(
            token.content.slice(0, 2)
          )} ${CardinalNumberMap.get(token.content.slice(2, 4))}`;
        }
        this.children.push(child);
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
    this.type = TerminalNodeEnumType.MLTAG;
  }
  parse(tokenList: TokenListType): number {
    let errorMsg: string = `Error parsing tokens for object ${this.constructor.name}`;
    let errorMsgPostFix: string = "";
    let child: ITerminalNode;
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
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        child.altpronunciation = MonthFromAbbreviationMap.get(
          token.content.slice(0, 3).toLowerCase()
        )!;
        this.children.push(child);
      }
      token = tokenList.shift()!;
      if (
        token !== undefined &&
        token.type === TokenType.PUNCTUATION &&
        token.content === TokenLiteral.DOT
      ) {
        errorMsgPostFix = "parsing dot";
        child = new TerminalNode_PUNCTUATION(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.children.push(child);
        token = tokenList.shift()!;
      }
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        errorMsgPostFix = "parsing whitespace";
        child = new TerminalNode_WHITESPACE(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.children.push(child);
      }
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing day";
      if (token !== undefined) {
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        if (OrdinalNumberMap.has(token.content)) {
          child.altpronunciation = OrdinalNumberMap.get(token.content)!;
        }
        this.children.push(child);
      }
      token = tokenList.shift()!;
      if (
        token !== undefined &&
        token.type === TokenType.PUNCTUATION &&
        token.content === TokenLiteral.COMMA
      ) {
        errorMsgPostFix = "parsing comma";
        child = new TerminalNode_PUNCTUATION(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.children.push(child);
      }
      token = tokenList.shift()!;
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        errorMsgPostFix = "parsing whitespace";
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.children.push(child);
        token = tokenList.shift()!;
      }
      errorMsgPostFix = "parsing year";
      if (token !== undefined) {
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        if (token.content.length === 4) {
          child.altpronunciation = `${CardinalNumberMap.get(
            token.content.slice(0, 2)
          )} ${CardinalNumberMap.get(token.content.slice(2, 4))}`;
        }
        this.children.push(child);
      }
      tokenList.shift(); // discard endtag
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
    this.type = TerminalNodeEnumType.MLTAG;
  }
  parse(tokenList: TokenListType): number {
    let errorMsg: string = `Error parsing tokens for object ${this.constructor.name}`;
    let errorMsgPostFix: string = "";
    let child: ITerminalNode;
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
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        child.altpronunciation = MonthFromAbbreviationMap.get(
          token.content.slice(0, 3).toLowerCase()
        )!;
        this.children.push(child);
      }
      token = tokenList.shift()!;
      if (
        token !== undefined &&
        token.type === TokenType.PUNCTUATION &&
        token.content === TokenLiteral.DOT
      ) {
        errorMsgPostFix = "parsing dot";
        child = new TerminalNode_PUNCTUATION(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.children.push(child);
        token = tokenList.shift()!;
      }
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        errorMsgPostFix = "parsing whitespace";
        child = new TerminalNode_WHITESPACE(this);
        this.content = this.content + token.content;
        child.content = token.content;
        this.children.push(child);
      }
      token = tokenList.shift()!;
      errorMsgPostFix = "parsing day";
      if (token !== undefined) {
        child = new TerminalNode_NUMBER(this);
        this.content = this.content + token.content;
        child.content = token.content;
        if (OrdinalNumberMap.has(token.content)) {
          child.altpronunciation = OrdinalNumberMap.get(token.content)!;
        }
        this.children.push(child);
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
    this.type = TerminalNodeEnumType.WORD;
  }
}
class TerminalNode_MLTAG_NUMBER_WITHCOMMAS extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    this.type = TerminalNodeEnumType.NUMBER;
  }
  parse(tokenList: TokenListType): number {
    let tokenListCount: number = super.parse(tokenList);
    // replace comma with [.]?
    this.altrecognition = this.content.replace(/,/g, "[,]?");
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
    this.type = TerminalNodeEnumType.MLTAG;
  }
}
class TerminalNode_MLTAG_USD extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    this.type = TerminalNodeEnumType.MLTAG;
  }
}
type ContentNodeClassType =
  | typeof TerminalNode_WORD
  | typeof TerminalNode_NUMBER
  | typeof TerminalNode_PUNCTUATION
  | typeof TerminalNode_MLTAG
  | typeof TerminalNode_MLTAG_END
  | typeof TerminalNode_MLTAG_SELFCLOSING
  | typeof TerminalNode_WHITESPACE;
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
