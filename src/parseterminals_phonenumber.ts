/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_phonenumvwe.ts
 *
 * Create terminal phone number objects from serialized input.
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
  isValidMarkupTag,
  // Tokenizer,
  // TokenType,
  // TokenLabelType,
  TokenListType,
  TokenLiteral,
  Token,
  MarkupLabelType
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
  IPhoneNumberTerminalMeta,
  IPhoneNumberTerminalMetaInitializer,
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
  ITerminalNode,
  // ITerminalParseNode,
  TerminalNode_MLTAG_
  // TerminalNode_NUMBER,
  // TerminalNode_PUNCTUATION,
  // TerminalNode_WHITESPACE,
  // TerminalNode_WORD
} from "./parseterminals";
// import DictionaryType, {
//   PronunciationDictionary,
//   RecognitionDictionary
// } from "./dictionary";
// import {
// AcronymMap,
//  BaseClass,
//   CardinalNumberMap,
//   Logger,
//   MonthFromAbbreviationMap,
//   OrdinalNumberMap,
//   UserContext
// } from "./utilities";
// import {
//   IDataSource,
//   //  MarkdownSectionTagType,
//   BasicMarkdownSource,
//   RawMarkdownSource,
//   TaggedStringType
// } from "./dataadapter";
export class TerminalNode_MLTAG_PHONENUMBER extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });
  }
  type = TerminalMetaEnumType.phonenumber;
  meta: IPhoneNumberTerminalMeta = IPhoneNumberTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    try {
      // catch undefined runtime assertion
      let startTag = tokenList[0].content;
      //      this.logger.diagnosticMode = true;
      let token: Token | undefined;

      assert(
        tokenList.length > 6,
        "invalid number of tokens parsing phone number"
      );
      assert(
        isValidMarkupTag(startTag),
        `invalid markup tag(s) parsing phone number`
      );
      assert(
        startTag.toLowerCase === MarkupLabelType.PHONENUMBER.toLowerCase,
        `invalid markup tag "${startTag}" parsing phone number`
      );
      tokenList.shift(); // discard startTag

      // token = tokenList.shift()!;
      // this.content = this.content + token.content;
      // this.meta.countryCode ;
      // this.content = this.content + token.content;

      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.LPAREN,
        `invalid prefix open delimiter "${token.content}" parsing phone number`
      );
      this.meta.openBracket = token.content;
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      assert(
        token.length === 3,
        `invalid prefix length "${token.content}" parsing phone number`
      );
      [...token.content].forEach(digit => {
        this.meta.areaCode.push(ITerminalInfoInitializer(digit));
      });
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.RPAREN,
        `invalid prefix close delimiter "${token.content}" parsing phone number`
      );
      this.meta.closeBracket = token.content;
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      this.meta.separator1 = token.content;
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      [...token.content].forEach(digit => {
        this.meta.exchangeCode.push(ITerminalInfoInitializer(digit));
      });
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.DASH,
        `expected dash not "${token.content}" parsing phone number`
      );
      this.meta.separator2 = token.content;
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      [...token.content].forEach(digit => {
        this.meta.lineNumber.push(ITerminalInfoInitializer(digit));
      });
      this.content = this.content + token.content;

      token = tokenList.shift()!; // discarding </phonenumber>
    } catch (e) {
      this.logger.error(`${this.constructor.name}: ${e.message}`);
      throw e;
    }
    return tokenList.length;
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
        outputStr =
          outputStr +
          `\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.openBracket
          }}\n${" ".padEnd(colWidth0)}${prefix}{${this.meta.areaCode[0]
            .content +
            this.meta.areaCode[1].content +
            this.meta.areaCode[2].content}}\n${" ".padEnd(
            colWidth0
          )}${prefix}{${this.meta.closeBracket}}\n${" ".padEnd(
            colWidth0
          )}${prefix}{${this.meta.separator1}}\n${" ".padEnd(
            colWidth0
          )}${prefix}{${this.meta.exchangeCode[0].content +
            this.meta.exchangeCode[1].content +
            this.meta.exchangeCode[2].content}}\n${" ".padEnd(
            colWidth0
          )}${prefix}{${this.meta.separator2}}\n${" ".padEnd(
            colWidth0
          )}${prefix}{${this.meta.lineNumber[0].content +
            this.meta.lineNumber[1].content +
            this.meta.lineNumber[2].content +
            this.meta.lineNumber[3].content}}`;
        //      this.logger.diagnostic(`AbstractTerminalNode: outputStr=${outputStr}`);
        break;
      }
      case ParseNodeSerializeFormatEnumType.JSON: {
        outputStr = JSON.stringify(this);
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        outputStr = outputStr + JSON.stringify(this);
        break;
      }
      default: {
      }
    }
    return outputStr;
  }
}
