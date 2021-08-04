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
  // BaseClass,
  // IParseNode,
  ParseNode,
  ParseNodeSerializeFormatEnumType,
  ParseNodeSerializeColumnPad
} from "./baseclasses";
import {
  endMarkupTag,
  isValidMarkupTag,
  // Tokenizer,
  // TokenType,
  // TokenLabelType,
  TokenListType,
  // TokenLiteral,
  Token
  // MarkupLabelType
} from "./tokenizer";
// import { MarkdownType, MarkdownTagType } from "./dataadapter";
import {
  // IPageContent,
  // ISectionContent,
  // ISectionBlockquoteVariant,
  // ISectionBlockquoteVariantInitializer,
  // ISectionFillinVariant,
  // ISectionFillinVariantInitializer,
  // ISectionHeadingVariant,
  // ISectionHeadingVariantInitializer,
  // ISectionOrderedListVariant,
  // ISectionOrderedListVariantInitializer,
  // ISectionUnorderedListVariant,
  // ISectionUnorderedListVariantInitializer,
  // ISectionParagraphVariant,
  // ISectionParagraphVariantInitializer,
  // ISentenceContent,
  ITerminalContent,
  TerminalMetaType,
  TerminalMetaEnumType,
  // OrderedListTypeEnumType,
  // PageFormatEnumType,
  // SectionVariantEnumType,
  // SectionVariantType,
  // UnorderedListMarkerEnumType,
  // IAcronymTerminalMeta,
  // IAcronymTerminalMetaInitializer,
  IWordTerminalMeta,
  IWordTerminalMetaInitializer,
  ICurrencyTerminalMeta,
  ICurrencyTerminalMetaInitializer,
  // IDateTerminalMeta,
  // IDateTerminalMetaInitializer,
  // DateFormatEnumType,
  // IPhoneNumberTerminalMeta,
  // IPhoneNumberTerminalMetaInitializer,
  IPunctuationTerminalMeta,
  IPunctuationTerminalMetaInitializer
  // IReferenceTerminalMeta,
  // ITimeTerminalMeta,
  // IWhitespaceTerminalMeta,
  // IEmailAddressTerminalMeta,
  // IEmailAddressTerminalMetaInitializer,
  // ITerminalInfo,
  // ITerminalInfoInitializer,
  // IYearTerminalMeta
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
// import {
//   TerminalNode_MLTAG_DATE1,
//   TerminalNode_MLTAG_DATE2,
//   TerminalNode_MLTAG_DATE3
// } from "./parseterminals_dates";
// import { TerminalNode_MLTAG_PHONENUMBER } from "./parseterminals_phonenumber";
// import { TerminalNode_MLTAG_EMAILADDRESS } from "./parseterminals_emailaddress";
// import DictionaryType, {
//   PronunciationDictionary,
//   RecognitionDictionary
// } from "./dictionary";
// // import {
// //   AcronymMap,
// //   CardinalNumberMap,
// //   Logger,
// //   MonthFromAbbreviationMap,
// //   OrdinalNumberMap,
// //   UserContext
// // } from "./utilities";
// import {
//   IDataSource,
//   //  MarkdownSectionTagType,
//   BasicMarkdownSource,
//   RawMarkdownSource,
//   TaggedStringType
// } from "./dataadapter";

// export interface INodeJsonUnitTest {
//   ID: number;
//   TERM: string;
//   TYPE: number;
//   PRON: string;
//   RECO: string;
// }
// export function INodeJsonUnitTestInitializer(
//   id?: number,
//   term?: string,
//   type?: number,
//   pron?: string,
//   reco?: string
// ): INodeJsonUnitTest {
//   return {
//     ID: (id !== undefined ? 0 : id)!,
//     TERM: (term === undefined ? "" : term)!,
//     TYPE: (type === undefined ? 0 : type)!,
//     PRON: (pron === undefined ? "" : pron)!,
//     RECO: (reco === undefined ? "" : reco)!
//   };
// }
export interface ITerminalParseNode {
  parse(tokenList: TokenListType): number;
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): // colWidth0?: number,
  // colWidth1?: number,
  // colWidth2?: number,
  // colWidth3?: number,
  // colWidth4?: number
  string;
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
  //  abstract parse(list: TokenListType): number;
  //  abstract parse(noneOrList: | TokenListType): number;

  parse(tokenList: TokenListType): number {
    let token: Token;
    if (tokenList !== undefined) {
      token = tokenList.shift()!;
      if (token !== undefined) {
        this.content = token.content;
      }
    }
    // this.logger.diagnostic(
    //   `abstract parseTokenList(): Parsing ${this.content}`
    // );
    return tokenList.length;
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
        label =
          label +
          ParseNodeSerializeColumnPad(0, prefix, label) +
          `${this.constructor.name}`;
        outputStr = `${super.serialize(format, label, prefix)}`;
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        label = `{${this.content}}`.padEnd(2) + `${this.constructor.name}`;
        outputStr = `${super.serialize(format, label, prefix)}\n`;
        break;
      }
      case ParseNodeSerializeFormatEnumType.JSON: {
        outputStr = JSON.stringify(this);
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        Object.defineProperty(this, "id", { enumerable: false });
        outputStr = outputStr + JSON.stringify(this);
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
    return super.parse(tokenList);
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
  // parse() {
  //   return 0;
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
      //      this.content == ""; // assumes initialization at declaration/constructor
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
    this.type = TerminalMetaEnumType.word;
    this.meta = IWordTerminalMetaInitializer();
  }
  parse(tokenList: TokenListType): number {
    return super.parse(tokenList);
  }
}
export class TerminalNode_MLTAG_NUMBER_WITHCOMMAS extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    ///    this.type = TerminalNodeEnumType.NUMBER;
  }
  type = TerminalMetaEnumType.word;
  meta: IWordTerminalMeta = IWordTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    // parse into word with recogition without comma
    let tokenListCount: number = super.parse(tokenList);
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
export class TerminalNode_MLTAG_TOKEN extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    ///    this.type = TerminalNodeEnumType.MLTAG;
  }
  type = TerminalMetaEnumType.word;
  meta: IWordTerminalMeta = IWordTerminalMetaInitializer();
}
export class TerminalNode_MLTAG_USD extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    ///    this.type = TerminalNodeEnumType.MLTAG;
  }
  type = TerminalMetaEnumType.currency;
  meta: ICurrencyTerminalMeta = ICurrencyTerminalMetaInitializer();
}
