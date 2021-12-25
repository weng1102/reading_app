/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_phonenumber.ts
 *
 * Create terminal phone number objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { IsError } from "./utilities";
import {
  ParseNodeSerializeFormatEnumType,
  ParseNodeSerializeColumnWidths
} from "./baseclasses";
import {
  isValidMarkupTag,
  TokenListType,
  TokenLiteral,
  Token,
  MarkupLabelType
} from "./tokenizer";
import {
  TerminalMetaEnumType,
  IPhoneNumberTerminalMeta,
  IPhoneNumberTerminalMetaInitializer,
  ITerminalInfoInitializer,
  ITerminalListItemInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
import { ITerminalNode, TerminalNode_MLTAG_ } from "./parseterminals";
export class TerminalNode_MLTAG_PHONENUMBER extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
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
      this.meta.openBracket.content = token.content;
      this.content = this.content + token.content;
      //      this.meta.openBracket.termIdx = this.userContext.terminals.push(ITerminalListItemInitializer(this.meta.openBracket));

      token = tokenList.shift()!;
      assert(
        token.length === 3,
        `invalid prefix length "${token.content}" parsing phone number`
      );
      [...token.content].forEach(digit => {
        let idx = this.meta.areaCode.push(ITerminalInfoInitializer(digit)) - 1;
        this.meta.areaCode[idx].termIdx = this.userContext.terminals.push(
          ITerminalListItemInitializer(this.meta.areaCode[idx])
        );
      });
      if (this.meta.areaCode.length > 0)
        this.firstTermIdx = this.meta.areaCode[0].termIdx;

      this.content = this.content + token.content;

      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.RPAREN,
        `invalid prefix close delimiter "${token.content}" parsing phone number`
      );
      this.meta.closeBracket.content = token.content;
      this.content = this.content + token.content;
      //      this.meta.closeBracket.termIdx = this.userContext.terminals.push(ITerminalListItemInitializer(this.meta.closeBracket));

      token = tokenList.shift()!;
      this.meta.separator1.content = token.content;
      //      this.meta.separator1.termIdx = this.userContext.terminals.push(ITerminalListItemInitializer(this.meta.separator1));
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      [...token.content].forEach(digit => {
        let idx =
          this.meta.exchangeCode.push(ITerminalInfoInitializer(digit)) - 1;
        this.meta.exchangeCode[idx].termIdx = this.userContext.terminals.push(
          ITerminalListItemInitializer(this.meta.exchangeCode[idx])
        );
      });
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.DASH,
        `expected dash not "${token.content}" parsing phone number`
      );
      this.meta.separator2.content = token.content;
      //      this.meta.separator2.termIdx = this.userContext.terminals.push(ITerminalListItemInitializer(this.meta.separator2));
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      [...token.content].forEach(digit => {
        let idx =
          this.meta.lineNumber.push(ITerminalInfoInitializer(digit)) - 1;
        this.meta.lineNumber[idx].termIdx = this.userContext.terminals.push(
          ITerminalListItemInitializer(this.meta.lineNumber[idx])
        );
      });
      if (this.meta.lineNumber.length > 0)
        this.lastTermIdx = this.meta.lineNumber[
          this.meta.lineNumber.length - 1
        ].termIdx;

      this.content = this.content + token.content;

      token = tokenList.shift()!; // discard </phonenumber> endtag
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(`${this.constructor.name}: ${e.message}`);
      } else {
        throw e;
      }

      throw e;
    }
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
        if (prefix === undefined) prefix = "";
        outputStr = super.serialize(format, this.content, prefix);

        prefix = prefix + "| ";
        outputStr =
          outputStr +
          super.serialize(
            format,
            `{${this.meta.openBracket.content}}`,
            prefix
          ) +
          super.serialize(
            format,
            `{${this.meta.areaCode[0].content}${this.meta.areaCode[1].content}${this.meta.areaCode[2].content}}`,
            prefix
          ) +
          super.serialize(
            format,
            `{${this.meta.closeBracket.content}}`,
            prefix
          ) +
          super.serialize(format, `{${this.meta.separator1.content}}`, prefix) +
          super.serialize(
            format,
            `{${this.meta.exchangeCode[0].content}${this.meta.exchangeCode[1].content}${this.meta.exchangeCode[2].content}}`,
            prefix
          ) +
          super.serialize(format, `{${this.meta.separator2.content}}`, prefix) +
          super.serialize(
            format,
            `{${this.meta.lineNumber[0].content}${this.meta.lineNumber[1].content}${this.meta.lineNumber[2].content}${this.meta.lineNumber[3].content}}`,
            prefix
          );
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        if (label === undefined) label = "";
        if (prefix === undefined) prefix = "";
        outputStr =
          //          " ".padEnd(colWidth0) +
          `${prefix}{${this.content}}`.padEnd(
            ParseNodeSerializeColumnWidths[1]
          ) +
          `${this.constructor.name}`.padEnd(ParseNodeSerializeColumnWidths[2]);
        //        colWidth0 += 2;
        outputStr =
          outputStr +
          `\n${" ".padEnd(2)}${prefix}{${this.meta.openBracket}}\n${" ".padEnd(
            2
          )}${prefix}{${this.meta.areaCode[0].content +
            this.meta.areaCode[1].content +
            this.meta.areaCode[2].content}}\n${" ".padEnd(2)}${prefix}{${
            this.meta.closeBracket
          }}\n${" ".padEnd(2)}${prefix}{${this.meta.separator1}}\n${" ".padEnd(
            2
          )}${prefix}{${this.meta.exchangeCode[0].content +
            this.meta.exchangeCode[1].content +
            this.meta.exchangeCode[2].content}}\n${" ".padEnd(2)}${prefix}{${
            this.meta.separator2
          }}\n${" ".padEnd(2)}${prefix}{${this.meta.lineNumber[0].content +
            this.meta.lineNumber[1].content +
            this.meta.lineNumber[2].content +
            this.meta.lineNumber[3].content}}\n`;
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
