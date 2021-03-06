/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_acronym.ts
 *
 * Create terminal acronym objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import {
  // BaseClass,
  // IParseNode,
  // ParseNode,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import {
  // endMarkupTag,
  // isValidMarkupTag,
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
  // ITerminalContent,
  // TerminalMetaType,
  TerminalMetaEnumType,
  // OrderedListTypeEnumType,
  // PageFormatEnumType,
  // SectionVariantEnumType,
  // SectionVariantType,
  // UnorderedListMarkerEnumType,
  // IWordTerminalMeta,
  // IWordTerminalMetaInitializer,
  // ICurrencyTerminalMeta,
  // ICurrencyTerminalMetaInitializer,
  // IDateTerminalMeta,
  // IDateTerminalMetaInitializer,
  // DateFormatEnumType,
  IAcronymTerminalMeta,
  IAcronymTerminalMetaInitializer,
  // IPunctuationTerminalMeta,
  // IPunctuationTerminalMetaInitializer,
  // IReferenceTerminalMeta,
  // ITimeTerminalMeta,
  // IWhitespaceTerminalMeta,
  // IEmailAddressTerminalMeta,
  // IEmailAddressTerminalMetaInitializer,
  // ITerminalInfo,
  ITerminalInfoInitializer
  // IYearTerminalMeta
} from "./pageContentType";
import {
  AbstractTerminalNode,
  ITerminalNode
  // ITerminalParseNode,
  // TerminalNode_NUMBER,
  // TerminalNode_PUNCTUATION,
  // TerminalNode_WHITESPACE,
  // TerminalNode_WORD
} from "./parseterminals";
// import DictionaryType, {
//   PronunciationDictionary,
//   RecognitionDictionary
// } from "./dictionary";
import {
  AcronymMap
  //  BaseClass,
  // CardinalNumberMap,
  // Logger,
  // MonthFromAbbreviationMap,
  // OrdinalNumberMap,
  // UserContext
} from "./utilities";
// import {
//   IDataSource,
//   //  MarkdownSectionTagType,
//   BasicMarkdownSource,
//   RawMarkdownSource,
//   TaggedStringType
// } from "./dataadapter";
export class TerminalNode_ACRONYM extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });

    //    this.type = TerminalNodeEnumType.MLTAG;
  }
  type = TerminalMetaEnumType.acronym;
  meta: IAcronymTerminalMeta = IAcronymTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    try {
      let token: Token = tokenList.shift()!;
      assert(token !== undefined, "too few tokens parsing acronym");
      assert(
        token.content === token.content.toUpperCase(),
        "expected all upper case letters parsing acronym"
      );
      let expansionCsv = AcronymMap.get(token.content);
      assert(expansionCsv !== undefined, `expected an acronym but none found`);
      this.content = token.content;
      let expansionList = expansionCsv.split(",");
      let letter = [...token.content];
      for (let pos = 0; pos < letter.length; pos++) {
        this.meta.letters.push(
          ITerminalInfoInitializer(
            letter[pos],
            expansionList[pos],
            expansionList[pos]
          )
        );
      }
    } catch (e) {
      this.logger.error(`${e.message} `);
    } finally {
      return tokenList.length;
    }
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string,
    colWidth0?: number,
    colWidth1?: number,
    colWidth2?: number,
    colWidth3?: number,
    colWidth4?: number
  ): string {
    /// serialize only the non-meta fields. Subclasses Should
    /// call this via super.serialize(...).
    let outputStr: string = "";
    //  this.logger.diagnostic(`AbstractTerminalNode: ${this.content}`);
    //    let outputStr1: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        if (label === undefined) label = "";
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
        colWidth0 += 2;
        this.meta.letters.forEach(letter => {
          outputStr =
            outputStr +
            `\n${" ".padEnd(colWidth0!)}${prefix}{${letter.content}} ${
              letter.altrecognition
            }`;
        });
        break;
      }
      case ParseNodeSerializeFormatEnumType.JSON: {
        outputStr = JSON.stringify(this);
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        Object.defineProperty(this, "id", { enumerable: false });
        outputStr = JSON.stringify(this);
        break;
      }
      default: {
      }
    }
    return outputStr;
  }
}
