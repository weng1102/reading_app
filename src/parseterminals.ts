/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
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
import {
  ParseNode,
  ParseNodeSerializeFormatEnumType,
  ParseNodeSerializeTabular,
  ParseNodeSerializeColumnPad,
  ParseNodeSerializePaddedColumn
} from "./baseclasses";
import {
  endMarkupTag,
  isValidMarkupTag,
  TokenListType,
  Token
} from "./tokenizer";
import {
  ITerminalContent,
  TerminalMetaType,
  TerminalMetaEnumType,
  IWordTerminalMeta,
  IWordTerminalMetaInitializer,
  ICurrencyTerminalMeta,
  ICurrencyTerminalMetaInitializer,
  IPunctuationTerminalMeta,
  IPunctuationTerminalMetaInitializer
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
  content: string = "";
  type!: TerminalMetaEnumType;
  meta!: TerminalMetaType;
  //  tokenList: TokenListType = [];
  constructor(parent: ISentenceNode) {
    super(parent);
    this.parent = parent;
    Object.defineProperty(this, "userContext", { enumerable: false });
    //Object.defineProperty(this, "id", { enumerable: false });
  }
  parse(tokenList: TokenListType): number {
    let token: Token;
    if (tokenList !== undefined) {
      token = tokenList.shift()!;
      if (token !== undefined) {
        this.content = token.content;
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
        let replacer: any = (key, value) => {
          // if we get a function, give us the code for that function
          switch (key) {
            case "termIdx":
            case "firstTermIdx":
            //            case "nextTermIdx":
            //            case "prevTermIdx":
            case "recitable":
            case "audible":
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
  parse(tokenList: TokenListType) {
    let retVal = super.parse(tokenList);
    //    this.meta.termIdx = this.userContext.terminals.push(this.meta) - 1;
    this.userContext.terminals.push(this.meta);
    //    console.log(`WORD meta terminalIdx=${this.meta.termIdx}`);
    //.termIdx = this.userContext.nextTerminalIdx;
    return retVal;
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
  parse(tokenList: TokenListType) {
    let retVal = super.parse(tokenList);
    this.userContext.terminals.push(this.meta);
    //    this.meta.termIdx = this.userContext.nextTerminalIdx;
    return retVal;
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
    } catch (e) {
      this.logger.error(`${this.constructor.name}: ${e.message}`);
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
    let tokenListCount = super.parse(tokenList);
    this.userContext.terminals.push(this.meta);
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
    let tokenListCount: number = super.parse(tokenList);
    // replace comma with [.]?
    this.meta.altrecognition = this.content.replace(/,/g, "[,]?");
    this.userContext.terminals.push(this.meta);
    //  this.meta.termIdx = this.userContext.nextTerminalIdx;
    // check for additional processing for this.content

    // check for additional attributes for this.content
    // pronunciationDictionary
    // recognitionpattern
    return tokenListCount;
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
    this.userContext.terminals.push(this.meta);
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
    let tokenListCount: number = super.parse(tokenList);
    this.userContext.terminals.push(this.meta.currency);
    // this.meta.currency.termIdx = this.userContext.nextTerminalIdx;
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
