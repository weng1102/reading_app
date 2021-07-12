/**
 * terminals_dates.ts
 *
 * Definitions of terminal node classes
 *
 */
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
  TokenType,
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
  IDateTerminalMeta,
  IDateTerminalMetaInitializer,
  DateFormatEnumType,
  // IPhoneNumberTerminalMeta,
  // IPhoneNumberTerminalMetaInitializer,
  // IPunctuationTerminalMeta,
  // IPunctuationTerminalMetaInitializer,
  // IReferenceTerminalMeta,
  // ITimeTerminalMeta,
  // IWhitespaceTerminalMeta,
  // IEmailAddressTerminalMeta,
  // IEmailAddressTerminalMetaInitializer,
  ITerminalInfo,
  ITerminalInfoInitializer,
  IYearTerminalMeta,
  IYearTerminalMetaInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
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
  CardinalNumberMap,
  // Logger,
  MonthFromAbbreviationMap,
  OrdinalNumberMap
  // UserContext
} from "./utilities";
// import {
//   IDataSource,
//   //  MarkdownSectionTagType,
//   BasicMarkdownSource,
//   RawMarkdownSource,
//   TaggedStringType
// } from "./dataadapter";

export class TerminalNode_MLTAG_DATE extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });
  }
  type = TerminalMetaEnumType.date;
  meta: IDateTerminalMeta = IDateTerminalMetaInitializer();
  parseDay(token: Token): ITerminalInfo {
    let day: ITerminalInfo = ITerminalInfoInitializer();
    const postfix = "parsing day";
    assert(token !== undefined, `token undefined ${postfix}`);
    assert(token.type === TokenType.NUMBER, `expected number ${postfix}`);
    day.content = token.content;
    if (OrdinalNumberMap.has(token.content)) {
      day.altpronunciation = OrdinalNumberMap.get(token.content)!;
    }
    return day;
  }
  parseMonth(token: Token): ITerminalInfo {
    let month: ITerminalInfo = ITerminalInfoInitializer();
    const postfix = "parsing month";
    assert(token !== undefined, `token undefined ${postfix}`);
    assert(token.type === TokenType.WORD, `expected word ${postfix}`);
    month.content = token.content;
    assert(
      MonthFromAbbreviationMap.has(token.content.substr(0, 3).toLowerCase()),
      `${token.content.substr(0, 3)} is not valid month ${postfix}`
    );
    month.altpronunciation = MonthFromAbbreviationMap.get(
      token.content.slice(0, 3).toLowerCase()
    )!;
    return month;
  }
  parseYear(token: Token): IYearTerminalMeta {
    let year: IYearTerminalMeta = IYearTerminalMetaInitializer();
    const postfix = "parsing year";
    assert(token !== undefined, `token undefined ${postfix}`);
    assert(token.type === TokenType.NUMBER, `expected a number ${postfix}`);
    assert(token.length === 4, `expected four numerals ${postfix}`);
    year.century.content = token.content.substring(0, 2);
    year.withinCentury.content = token.content.substring(2, 4);
    if (year.century.content.substr(1, 1) === "0") {
      //special case: first decade of century cannot be thousand one (1001),
      // thousand two (2002)...or ten two. twenty two but should be either
      // one thousand one (2001), two thousand two (2002)...
      // OR ten O one, twenty O two
      year.century.altpronunciation = `(${CardinalNumberMap.get(
        year.century.content.slice(0, 1)
      )} thousand) | (${CardinalNumberMap.get(year.century.content)})`;
      year.withinCentury.altpronunciation = `(${CardinalNumberMap.get(
        year.withinCentury.content
      )})`;
    }
    return year;
  }
  parseWhitespace(token: Token): ITerminalInfo {
    let ws: ITerminalInfo = ITerminalInfoInitializer();
    const postfix = "parsing whitespace";
    assert(token !== undefined, `token undefined ${postfix}`);
    assert(
      token.type === TokenType.WHITESPACE,
      `expected whitespace not "${token.content}" ${postfix}`
    );
    ws.content = token.content;
    return ws;
  }
  //this.logger.diagnostic(`AbstractTerminalNode: outputStr=${outputStr}`);
  //    this.logger.diagnostic(`AbstractTerminalNode: outputStr1=${outputStr1}`);
}
export class TerminalNode_MLTAG_DATE1 extends TerminalNode_MLTAG_DATE
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    this.meta.format = DateFormatEnumType.date1;
  }
  parse(tokenList: TokenListType): number {
    //    let errorMsg: string = `Error parsing tokens for object ${this.constructor.name}`;
    //    let errorMsgPostFix: string = "";
    try {
      // this.logger.diagnosticMode = true;
      let startTag = tokenList[0].content;
      let token: Token;
      assert(tokenList.length > 6, "invalid number of tokens parsing date");
      assert(isValidMarkupTag(startTag), `invalid markup tag(s) parsing date`);
      assert(
        startTag.toLowerCase === MarkupLabelType.DATE1.toLowerCase,
        `invalid markup tag "${startTag}" parsing date`
      );
      tokenList.shift(); // discard startTag

      token = tokenList.shift()!;
      this.meta.day = this.parseDay(token);
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      this.meta.whitespace1 = this.parseWhitespace(token);
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      this.meta.month = this.parseMonth(token);
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      this.meta.whitespace2 = this.parseWhitespace(token);
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      this.meta.year = this.parseYear(token);
      this.content = this.content + token.content;
      tokenList.shift(); // discard endtag
    } catch (e) {
      this.logger.error(`${this.constructor.name}: ${e.message}`);
      throw e;
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
        outputStr =
          outputStr +
          `\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.day.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.punctuation1.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.whitespace1.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${this.meta.month.content}  ${
            this.meta.month.altpronunciation
          }
          }\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.whitespace2.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.year.century.content
          }${this.meta.year.withinCentury.content}}`;
        //      this.logger.diagnostic(`AbstractTerminalNode: outputStr=${outputStr}`);
        break;
      }
      case ParseNodeSerializeFormatEnumType.JSON: {
        outputStr = JSON.stringify(this);
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        Object.defineProperty(this, "id", { enumerable: false });
        outputStr = outputStr + JSON.stringify(this);
        //   INodeJsonUnitTestInitializer(
        //     -1,
        //     this.meta.day.content,
        //     TokenType.WORD,
        //     this.meta.day.altpronunciation
        //   )
        // ) +
        // JSON.stringify(
        //   INodeJsonUnitTestInitializer(
        //     -1,
        //     this.meta.whitespace1.content,
        //     TokenType.WHITESPACE
        //   )
        // ) +
        // JSON.stringify(
        //   INodeJsonUnitTestInitializer(
        //     -1,
        //     this.meta.month.content,
        //     TokenType.WORD,
        //     this.meta.month.altpronunciation
        //   )
        // ) +
        // JSON.stringify(
        //   INodeJsonUnitTestInitializer(
        //     -1,
        //     this.meta.whitespace2.content,
        //     TokenType.WHITESPACE
        //   )
        // ) +
        // JSON.stringify(
        //   INodeJsonUnitTestInitializer(
        //     -1,
        //     this.meta.year.century.content,
        //     TokenType.NUMBER,
        //     this.meta.year.century.altpronunciation
        //   )
        // ) +
        // JSON.stringify(
        //   INodeJsonUnitTestInitializer(
        //     -1,
        //     this.meta.year.withinCentury.content,
        //     TokenType.NUMBER,
        //     this.meta.year.withinCentury.altpronunciation
        //   )
        // );
        break;
      }
      default: {
      }
    }
    return outputStr;
  }
}
export class TerminalNode_MLTAG_DATE2 extends TerminalNode_MLTAG_DATE
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    this.meta.format = DateFormatEnumType.date2;
  }
  parse(tokenList: TokenListType): number {
    //      this.logger.diagnosticMode = true;
    try {
      let startTag = tokenList[0].content;
      let token: Token;
      assert(tokenList.length > 5, "invalid number of tokens parsing date");
      assert(isValidMarkupTag(startTag), `invalid markup tag(s) parsing date`);
      assert(
        startTag.toLowerCase() === MarkupLabelType.DATE2.toLowerCase(),
        `invalid markup tag "${startTag}" parsing date`
      );
      tokenList.shift(); // discard startTag

      token = tokenList.shift()!;
      this.meta.month = this.parseMonth(token);
      this.content = this.content + token.content;

      // optional punctuation for abbreviated month
      token = tokenList.shift()!;
      if (
        token !== undefined &&
        token.type === TokenType.PUNCTUATION &&
        token.content === TokenLiteral.DOT &&
        this.meta.month.content.length === 3 // will erroneously match "May."
      ) {
        this.meta.punctuation1.content = token.content;
        this.content = this.content + token.content;
        token = tokenList.shift()!;
      }
      this.meta.whitespace1 = this.parseWhitespace(token);
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      this.meta.day = this.parseDay(token);
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      if (
        token !== undefined &&
        token.type === TokenType.PUNCTUATION &&
        token.content === TokenLiteral.COMMA
      ) {
        this.meta.punctuation2.content = token.content;
        this.content = this.content + token.content;
        token = tokenList.shift()!;
      }
      if (token !== undefined && token.type === TokenType.WHITESPACE) {
        this.meta.whitespace2 = this.parseWhitespace(token);
        this.content = this.content + token.content;
        token = tokenList.shift()!;
      }
      this.meta.year = this.parseYear(token);
      this.content =
        this.content +
        this.meta.year.century.content +
        this.meta.year.withinCentury.content;
      tokenList.shift(); // discard endtag
    } catch (e) {
      this.logger.error(`${this.constructor.name}: ${e.message}`);
      throw e;
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
        if (prefix === undefined) prefix = "";
        if (label === undefined) label = "";
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
          `\n${" ".padEnd(colWidth0)}${prefix}{${this.meta.month.content}} ${
            this.meta.month.altpronunciation
          }\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.punctuation1.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.whitespace1.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.day.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.punctuation2.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.whitespace2.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.year.century.content
          }${this.meta.year.withinCentury.content}}`;
        //      this.logger.diagnostic(`AbstractTerminalNode: outputStr=${outputStr}`);
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
}
export class TerminalNode_MLTAG_DATE3 extends TerminalNode_MLTAG_DATE
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    this.meta.format = DateFormatEnumType.date3;
  }
  parse(tokenList: TokenListType): number {
    let errorMsg: string = `Error parsing tokens for object ${this.constructor.name}`;
    let errorMsgPostFix: string = "";
    //    let child: ITerminalNode;
    try {
      let startTag = tokenList[0].content;
      //      this.logger.diagnosticMode = true;
      let token: Token;

      assert(tokenList.length > 3, "invalid number of tokens parsing date");
      assert(isValidMarkupTag(startTag), `invalid markup tag(s) parsing date`);
      assert(
        startTag.toLowerCase === MarkupLabelType.DATE3.toLowerCase,
        `invalid markup tag "${startTag}" parsing date`
      );
      tokenList.shift()!; // discard startTag

      token = tokenList.shift()!;
      this.meta.month = this.parseMonth(token);
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      if (
        token !== undefined &&
        token.type === TokenType.PUNCTUATION &&
        token.content === TokenLiteral.DOT &&
        this.meta.month.content.length === 3 // will erroneously match "May."
      ) {
        this.meta.punctuation1.content = token.content;
        this.content = this.content + token.content;
        token = tokenList.shift()!;
      }
      this.meta.whitespace1 = this.parseWhitespace(token);
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      this.meta.day = this.parseDay(token);
      this.content = this.content + token.content;

      tokenList.shift(); // discard endtag
    } catch (e) {
      this.logger.error(`${e.message}; ${errorMsg} ${errorMsgPostFix}`);
      throw e;
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
        outputStr =
          outputStr +
          `\n${" ".padEnd(colWidth0)}${prefix}{${this.meta.month.content}  ${
            this.meta.month.altpronunciation
          }
          }}\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.punctuation1.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${
            this.meta.whitespace1.content
          }}\n${" ".padEnd(colWidth0)}${prefix}{${this.meta.day.content}`;
        //      this.logger.diagnostic(`AbstractTerminalNode: outputStr=${outputStr}`);
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
}
