/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: parseterminals.ts
 *
 * Create various terminal objects from serialized input. As
 * each type of object becomes implemented, separate parseterminals_*
 * files are created to keep the file size manageable.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { IsError } from "./utilities";
import {
  IDX_INITIALIZER,
  ParseNode,
  ParseNodeSerializeFormatEnumType,
  ParseNodeSerializeTabular,
  ParseNodeSerializeColumnPad,
  ParseNodeSerializePaddedColumn
} from "./baseclasses";
import {
  endMarkupTag,
  isValidMarkupTag,
  MarkupLabelType,
  TokenLiteral,
  TokenListType,
  Token
} from "./tokenizer";
import {
  ITerminalContent,
  TerminalMetaType,
  TerminalMetaEnumType,
  ISymbolTerminalMeta,
  ISymbolTerminalMetaInitializer,
  IWordTerminalMeta,
  IWordTerminalMetaInitializer,
  ICurrencyTerminalMeta,
  ICurrencyTerminalMetaInitializer,
  IPassthruTagTerminalMeta,
  IPassthruTagTerminalMetaTerminalMetaInitializer,
  IPunctuationTerminalMeta,
  IPunctuationTerminalMetaInitializer,
  ITerminalListItemInitializer,
  IWhitespaceTerminalMeta,
  IWhitespaceTerminalMetaInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
export interface ITerminalParseNode {
  parse(tokenList: TokenListType): number;
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string;
  transform(): number;
}
export type ITerminalNode = ITerminalContent & ITerminalParseNode;
export abstract class AbstractTerminalNode extends ParseNode
  implements ITerminalParseNode {
  id: number = 0;
  termIdx: number = IDX_INITIALIZER;
  content: string = "";
  cueList: string = "";
  firstTermIdx: number = IDX_INITIALIZER;
  lastTermIdx: number = IDX_INITIALIZER;
  type!: TerminalMetaEnumType;
  meta!: TerminalMetaType;
  //  tokenList: TokenListType = [];
  constructor(parent: ISentenceNode) {
    super(parent);
    this._parent = parent;
    Object.defineProperty(this, "userContext", { enumerable: false });
    //Object.defineProperty(this, "id", { enumerable: false });
  }
  parse(tokenList: TokenListType): number {
    let token: Token;
    if (tokenList !== undefined) {
      token = tokenList.shift()!;
      //      token = tokenList[0];
      if (token !== undefined) {
        this.content = token.content; // should be TerminalInfo
        //look for <cuelist>. Take a peek at next characters
        if (
          tokenList.length > 2 &&
          tokenList[0].content === MarkupLabelType.CUELIST //peek
        ) {
          tokenList.shift()!; // discard <cuelist>
          token = tokenList.shift()!;
          let cueList: string = "";
          for (
            ;
            token.content !== MarkupLabelType.CUELIST_CLOSE;
            token = tokenList.shift()!
          ) {
            cueList = `${cueList}${token.content}`;
          }
          this.cueList = cueList;
        }
      }
    }
    return tokenList.length;
  }
  stringifyReplacerForParseTest(key: string, value: any) {
    switch (key) {
      //      case "id":
      case "termIdx":
      case "firstTermIdx":
      case "nextTermIdx":
      case "prevTermIdx":
      case "recitable":
      case "audible":
      case "linkable":
      case "visible":
        return undefined;
      default:
        return value;
    }
  }

  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    /// serialize only the non-meta fields. Subclasses Should
    /// call this via super.serialize(...).
    let outputStr: string = "";
    //  this.logger.diagnostic(`AbstractTerminalNode: ${this.content}`);
    //    let outputStr1: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        label =
          label === undefined || label.length === 0
            ? `{${this.content}}`
            : label;
        //        let termIdx: string = (this.termIdx !==0? "(termIdx="+this.termIdx.toString()+")":"";
        label =
          label +
          ParseNodeSerializeColumnPad(0, prefix + label) +
          this.constructor.name +
          ParseNodeSerializeColumnPad(1, this.constructor.name);
        outputStr = `${super.serialize(format, label, prefix)}`;

        if (this.cueList.length > 0) {
          label = `{${this.cueList}}`;
          prefix = prefix + "  ";
          label =
            label +
            ParseNodeSerializeColumnPad(0, prefix + label) +
            this.constructor.name +
            ":CUELIST";
          outputStr = `${outputStr}${super.serialize(format, label, prefix)}`;
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        label =
          label === undefined
            ? ParseNodeSerializeTabular(this.constructor.name, this.content)
            : label;
        outputStr = super.serialize(format, label);
        break;
      }
      case ParseNodeSerializeFormatEnumType.JSON: {
        outputStr = JSON.stringify(this);
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        // Object.defineProperty(this, "id", { enumerable: false });
        // Object.defineProperty(this, "terminals.meta.termIdx", {
        //   enumerable: false
        // });
        let replacer: any = (key: string, value: any) => {
          // if we get a function, give us the code for that function
          switch (key) {
            case "termIdx":
            case "firstTermIdx":
            //            case "nextTermIdx":
            //            case "prevTermIdx":
            case "recitable":
            case "audible":
            case "linkable":
            case "visible":
              return undefined;
            default:
              return value;
          }
        };
        outputStr = outputStr + JSON.stringify(this, replacer);
        break;
      }
      default: {
      }
    }
    return outputStr;
  }
  transform() {
    this.logger.diagnostic(
      `transform() abstract method requires implementation`
    );
    return -1;
  }
}
export class TerminalNode_WORD extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
  }
  type = TerminalMetaEnumType.word;
  meta: IWordTerminalMeta = IWordTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    // let token: Token;
    // if (tokenList !== undefined) {
    //   token = tokenList.shift()!;
    //   if (token !== undefined) {
    //     this.content = token.content; // should be TerminalInfo
    super.parse(tokenList);
    this.meta.content = this.content;
    if (this.cueList.length > 0) {
      this.meta.cues = this.cueList.split(",");
    }
    this.termIdx = this.userContext.terminals.push(
      ITerminalListItemInitializer(this.meta)
    );
    this.meta.termIdx = this.termIdx;
    this.firstTermIdx = this.termIdx;
    this.lastTermIdx = this.termIdx;
    if (this.cueList.length > 0) {
      this.meta.cues = this.cueList.split(",");
    }
    return tokenList.length;
  }

  transform() {
    return 0;
  }
}
export class TerminalNode_SYMBOL extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
  }
  type = TerminalMetaEnumType.symbol;
  meta: ISymbolTerminalMeta = ISymbolTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    // let token: Token;
    // if (tokenList !== undefined) {
    //   token = tokenList.shift()!;
    //   if (token !== undefined) {
    //     this.content = token.content; // should be TerminalInfo
    super.parse(tokenList);
    this.meta.content = this.content;
    switch (this.content) {
      case TokenLiteral.PERCENTSIGN:
        this.meta.altpronunciation = "percent";
        this.meta.altrecognition = "percent";
        break;
    }
    // should lookup altrecognition
    // should lookup altpronunciation
    this.termIdx = this.userContext.terminals.push(
      ITerminalListItemInitializer(this.meta)
    );
    this.meta.termIdx = this.termIdx;
    this.firstTermIdx = this.termIdx;
    this.lastTermIdx = this.termIdx;
    return tokenList.length;
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    let outputStr = super.serialize(format, label, prefix);
    console.log(`hello`);
    return outputStr;
  }
  transform() {
    return 0;
  }
}
export class TerminalNode_NUMBER extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
  }
  type = TerminalMetaEnumType.word;
  meta: IWordTerminalMeta = IWordTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    // let token: Token;
    // if (tokenList !== undefined) {
    //   token = tokenList.shift()!;
    //   if (token !== undefined) {
    //     this.content = token.content; // should be TerminalInfo
    super.parse(tokenList);
    this.meta.content = this.content;
    this.termIdx = this.userContext.terminals.push(
      ITerminalListItemInitializer(this.meta)
    );
    this.meta.termIdx = this.termIdx;
    this.firstTermIdx = this.termIdx;
    this.lastTermIdx = this.termIdx;
    return tokenList.length;
  }
  transform() {
    return 0;
  }
}
export class TerminalNode_PUNCTUATION extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
  }
  type: TerminalMetaEnumType = TerminalMetaEnumType.punctuation;
  meta: IPunctuationTerminalMeta = IPunctuationTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    let token: Token;
    if (tokenList !== undefined) {
      token = tokenList.shift()!;
      if (token !== undefined) {
        this.content = token.content; // should be TerminalInfo
        this.meta.content = token.content;
        // this.termIdx = this.userContext.terminals.push(
        //   ITerminalListItemInitializer(this.meta)
        // );
      }
    }
    return tokenList.length;
  }

  transform() {
    return 0;
  }
}
export class TerminalNode_MLTAG extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    //    this.type = TerminalNodeEnumType.MLTAG;
  }
}
export class TerminalNode_MLTAG_END extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    //    this.type = TerminalNodeEnumType.MLTAG_END;
  }
}
export class TerminalNode_MLTAG_SELFCLOSING extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    //    this.type = TerminalNodeEnumType.MLTAG_SELFCLOSING;
  }
}
export class TerminalNode_TBD extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    assert(`Encountered undefined token type ${this.constructor.name}`);
  }
  type = TerminalMetaEnumType.tbd;
}
export class TerminalNode_WHITESPACE extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
  }
  type = TerminalMetaEnumType.whitespace;
  meta: IWhitespaceTerminalMeta = IWhitespaceTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    let token: Token;
    if (tokenList !== undefined) {
      token = tokenList.shift()!;
      if (token !== undefined) {
        this.content = token.content; // should be TerminalInfo
        this.meta.content = token.content;
        // this.termIdx = this.userContext.terminals.push(
        //   ITerminalListItemInitializer(this.meta)
        // );
      }
    }
    return tokenList.length;
  }
}
export class TerminalNode_PASSTHRUTAG extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
  }
  type = TerminalMetaEnumType.passthruTag;
  meta = IPassthruTagTerminalMetaTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    let markupTag: string = tokenList[0].content;
    assert(
      isValidMarkupTag(markupTag),
      `not a valid markup tag ${markupTag} for ${this.constructor.name} parsing`
    );
    this.meta.tag = `{${markupTag}}`;
    tokenList.shift()!;
    return 0;
  }
  serialize(
    format: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    label = this.meta.tag;
    return super.serialize(format, label, prefix);
    // }
  }
}
export abstract class TerminalNode_MLTAG_ extends AbstractTerminalNode
  implements ITerminalNode {
  //  markupLabel: string;
  constructor(parent: ISentenceNode) {
    super(parent);
  }
  parse(tokenList: TokenListType): number {
    // overrides standard parse()
    // assumes tokenList contains: <tag>one or more terms within tag</tag>
    // that cannot easily be tokenized using regexp. However, the default
    // behavior is to just concatenate the tokens within the markup tags
    try {
      let startTag = tokenList[0].content;
      assert(
        tokenList.length > 2,
        `not enough tokens for ${this.constructor.name} parsing`
      );
      assert(
        isValidMarkupTag(startTag),
        `invalid markup tag(s) parsing ${this.constructor.name}`
      );
      let endTag: string = endMarkupTag(startTag);

      tokenList.shift(); // remove startTag
      let token: Token = tokenList.shift()!;
      while (token !== undefined && token.content !== endTag) {
        this.content = this.content + token.content;
        token = tokenList.shift()!;
      }
      // handled in the subclass
      // this.meta = IWordTerminalMetaInitializer(token.content);
      // this.userContext.terminals.push(this.meta);
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(`${this.constructor.name}: ${e.message}`);
      } else {
        throw e;
      }
    } finally {
      return tokenList.length;
    }
  }
}

export class TerminalNode_MLTAG_TIME extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
  }
}
export class TerminalNode_MLTAG_CONTRACTION extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
  }
  type = TerminalMetaEnumType.word;
  meta = IWordTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    super.parse(tokenList);
    this.meta.content = this.content;
    this.termIdx = this.userContext.terminals.push(
      ITerminalListItemInitializer(this.meta)
    );
    this.meta.termIdx = this.termIdx;
    this.firstTermIdx = this.termIdx;
    this.lastTermIdx = this.termIdx;

    //    this.meta.termIdx = this.userContext.nextTerminalIdx;
    return tokenList.length;
  }
  // serialize(format: ParseNodeSerializeFormatEnumType, label?: string): string {
  //   switch (format) {
  //     case ParseNodeSerializeFormatEnumType.TABULAR: {
  //       label =
  //         label === undefined
  //           ? ParseNodeSerializeTabular(
  //               this.constructor.name,
  //               this.content,
  //               "",
  //               this.meta.termIdx.toString()
  //             )
  //           : label;
  //       break;
  //     }
  //     default:
  //       break;
  //   }
  //   return super.serialize(format, label);
  // }
}
export class TerminalNode_MLTAG_NUMBER_WITHCOMMAS extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
  }
  type = TerminalMetaEnumType.numberwithcommas;
  meta: IWordTerminalMeta = IWordTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    super.parse(tokenList);
    // replace comma with [.]?
    this.meta.content = this.content;
    this.meta.altrecognition = this.content.replace(/,/g, "[,]?"); // override word.parse
    this.termIdx = this.userContext.terminals.push(
      ITerminalListItemInitializer(this.meta)
    );
    this.meta.termIdx = this.termIdx;
    this.firstTermIdx = this.termIdx;
    this.lastTermIdx = this.termIdx;
    return tokenList.length;

    return tokenList.length;
  }
  serialize(format: ParseNodeSerializeFormatEnumType, label?: string): string {
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        label =
          label === undefined
            ? ParseNodeSerializeTabular(
                this.constructor.name,
                this.content,
                this.meta.altpronunciation,
                this.meta.termIdx.toString()
              )
            : label;
        break;
      }
      default:
        break;
    }
    return super.serialize(format, label);
  }
}
export class TerminalNode_MLTAG_TOKEN extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    ///    this.type = TerminalNodeEnumType.MLTAG;
  }
  type = TerminalMetaEnumType.word;
  meta: IWordTerminalMeta = IWordTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    let tokenListCount: number = super.parse(tokenList);
    //KNOWN ISSUE IF TOKEN CONTAINS MULTIPLE WORDS
    this.meta.content = this.content;
    this.termIdx = this.userContext.terminals.push(
      ITerminalListItemInitializer(this.meta)
    );
    this.meta.termIdx = this.termIdx;
    this.firstTermIdx = this.termIdx;
    this.lastTermIdx = this.termIdx;

    //    this.meta.termIdx = this.userContext.nextTerminalIdx;
    return tokenListCount;
  }
  // serialize(format: ParseNodeSerializeFormatEnumType, label?: string): string {
  //   switch (format) {
  //     case ParseNodeSerializeFormatEnumType.TABULAR: {
  //       label =
  //         label === undefined
  //           ? ParseNodeSerializeTabular(
  //               this.constructor.name,
  //               this.content,
  //               this.meta.altpronunciation,
  //               this.meta.termIdx.toString()
  //             )
  //           : label;
  //       break;
  //     }
  //     default:
  //       break;
  //   }
  //   return super.serialize(format, label);
  // }
}
export class TerminalNode_MLTAG_USD extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    ///    this.type = TerminalNodeEnumType.MLTAG;
  }
  type = TerminalMetaEnumType.currency;
  meta: ICurrencyTerminalMeta = ICurrencyTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    super.parse(tokenList);
    // KNOWN ISSUE HERE
    this.termIdx = this.userContext.terminals.push(
      ITerminalListItemInitializer(this.meta.currency)
    );
    this.firstTermIdx = this.termIdx;
    this.lastTermIdx = this.termIdx;

    // this.meta.currency.termIdx = this.userContext.nextTerminalIdx;
    return tokenList.length;
  }
  // serialize(format: ParseNodeSerializeFormatEnumType, label?: string): string {
  //   switch (format) {
  //     case ParseNodeSerializeFormatEnumType.TABULAR: {
  //       label =
  //         label === undefined
  //           ? ParseNodeSerializeTabular(
  //               this.constructor.name,
  //               this.content,
  //               this.meta.currency.content,
  //               this.meta.currency.termIdx.toString()
  //             )
  //           : label;
  //       break;
  //     }
  //     default:
  //       break;
  //   }
  //   return super.serialize(format, label);
  // }
}
