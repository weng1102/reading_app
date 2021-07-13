/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_emailaddress.ts
 *
 * Create terminal email address objects from serialized input.
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
  endMarkupTag,
  isValidMarkupTag,
  // Tokenizer,
  // TokenType,
  // TokenLabelType,
  TokenListType,
  TokenLiteral,
  // Token,
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
  // IPhoneNumberTerminalMeta,
  // IPhoneNumberTerminalMetaInitializer,
  // IPunctuationTerminalMeta,
  // IPunctuationTerminalMetaInitializer,
  // IReferenceTerminalMeta,
  // ITimeTerminalMeta,
  // IWhitespaceTerminalMeta,
  IEmailAddressTerminalMeta,
  IEmailAddressTerminalMetaInitializer,
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
import {
  // AcronymMap,
  //  BaseClass,
  // CardinalNumberMap,
  // Logger,
  // MonthFromAbbreviationMap,
  // OrdinalNumberMap,
  SymbolPronunciationMap
  // UserContext
} from "./utilities";
// import {
//   IDataSource,
//   //  MarkdownSectionTagType,
//   BasicMarkdownSource,
//   RawMarkdownSource,
//   TaggedStringType
// } from "./dataadapter";
export class TerminalNode_MLTAG_EMAILADDRESS extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });

    //    this.type = TerminalNodeEnumType.MLTAG;
  }
  type = TerminalMetaEnumType.emailaddress;
  meta: IEmailAddressTerminalMeta = IEmailAddressTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    const emailSeparators = /(?=[.\-_@])|(?<=[.\-_@])/g;
    // should be updated to support ! # $ % & ' * +/ = ? ^ ` { | as needed.
    try {
      let startTag = tokenList[0].content;
      let endTag: string;
      assert(
        tokenList.length > 6,
        "Encountered too few tokens parsing email address"
      );
      assert(
        isValidMarkupTag(startTag),
        `invalid markup tag(s) parsing email address`
      );
      assert(
        startTag.toLowerCase === MarkupLabelType.EMAILADDRESS.toLowerCase,
        `invalid markup tag "${startTag}" parsing email address`
      );
      endTag = endMarkupTag(startTag);
      tokenList.shift(); // discard startTag

      //      let token = tokenList.shift()!;
      // NICE TO HAVE: split user and domain based on dot (and perhaps -, _) separators
      let token = tokenList.shift()!;
      for (
        ;
        token.content !== TokenLiteral.ATSIGN;
        token = tokenList.shift()!
      ) {
        let parts: string[] = token.content.split(emailSeparators); // look for _ + - as separators. If other valid characters are desired, the regex in the tokenizer
        parts.forEach(part => {
          this.meta.userName.push(
            ITerminalInfoInitializer(part, SymbolPronunciationMap.get(part))
          );
          this.content = this.content + part;
        });
      }

      // token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.ATSIGN,
        `expected "@" parsing email address`
      );
      this.meta.separator = ITerminalInfoInitializer(
        token.content,
        SymbolPronunciationMap.get(token.content)
      );
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      for (; token.content !== endTag; token = tokenList.shift()!) {
        let parts: string[] = token.content.split(emailSeparators);
        parts.forEach(part => {
          this.meta.domainName.push(
            ITerminalInfoInitializer(part, SymbolPronunciationMap.get(part))
          );
          this.content = this.content + part;
        });
      }
      tokenList.shift(); //discard engTag
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
        this.meta.userName.forEach(term => {
          outputStr =
            outputStr +
            `\n${" ".padEnd(colWidth0!)}${prefix}{${term.content}} ${
              term.altpronunciation
            }`;
        });
        outputStr =
          outputStr +
          `\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.separator.content
          }} ${this.meta.separator.altpronunciation}`;
        this.meta.domainName.forEach(term => {
          outputStr =
            outputStr +
            `\n${" ".padEnd(colWidth0!)}${prefix}{${term.content}} ${
              term.altpronunciation
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
        outputStr = super.serialize(ParseNodeSerializeFormatEnumType.UNITTEST);
        outputStr = outputStr + JSON.stringify(this);
        break;
      }
      default: {
      }
    }
    return outputStr;
  }
}
