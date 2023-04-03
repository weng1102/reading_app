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
import { IsError } from "./utilities";
import {
  ParseNodeSerializeColumnWidths,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import {
  endMarkupTag,
  isValidMarkupTag,
  TokenListType,
  TokenLiteral,
  MarkupLabelType
} from "./tokenizer";
import {
  TerminalMetaEnumType,
  IEmailAddressTerminalMeta,
  IEmailAddressTerminalMetaInitializer,
  ITerminalListItemInitializer,
  ITerminalInfoInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
import { ITerminalNode, TerminalNode_MLTAG_ } from "./parseterminals";
import { SymbolPronunciationMap } from "./utilities";
export class TerminalNode_MLTAG_EMAILADDRESS extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
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
          let usernameIdx: number =
            this.meta.userName.push(
              ITerminalInfoInitializer(
                part,
                SymbolPronunciationMap.get(part),
                undefined,
                undefined,
                true,
                true,
                true
              )
            ) - 1;
          this.meta.userName[
            usernameIdx
          ].termIdx = this.userContext.terminals.push(
            ITerminalListItemInitializer(this.meta.userName[usernameIdx])
          );
          this.content = this.content + part;
        });
      }
      if (this.meta.userName.length > 0)
        this.firstTermIdx = this.meta.userName[0].termIdx;

      // token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.ATSIGN,
        `expected "@" parsing email address`
      );
      this.meta.separator = ITerminalInfoInitializer(
        token.content,
        SymbolPronunciationMap.get(token.content),
        undefined,
        undefined,
        true,
        true,
        true
      );
      this.meta.separator.termIdx = this.userContext.terminals.push(
        ITerminalListItemInitializer(this.meta.separator)
      );
      //      this.userContext.terminals.push(this.meta.userName);
      this.content = this.content + token.content;

      token = tokenList.shift()!;
      for (; token.content !== endTag; token = tokenList.shift()!) {
        let parts: string[] = token.content.split(emailSeparators);
        parts.forEach(part => {
          let domainIdx: number =
            this.meta.domainName.push(
              ITerminalInfoInitializer(
                part,
                SymbolPronunciationMap.get(part),
                undefined,
                undefined,
                true,
                true,
                true
              )
            ) - 1;
          this.meta.domainName[
            domainIdx
          ].termIdx = this.userContext.terminals.push(
            ITerminalListItemInitializer(this.meta.domainName[domainIdx])
          );
          this.content = this.content + part;
        });
      }
      if (this.meta.domainName.length > 0)
        this.lastTermIdx = this.meta.domainName[
          this.meta.domainName.length - 1
        ].termIdx;

      //      tokenList.shift(); //discard endTag
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(e.message);
      } else {
        throw e;
      }
    } finally {
      return tokenList.length;
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
        //        outputStr = super.serialize(format,
        outputStr = super.serialize(format, this.content, prefix);
        prefix = prefix + " ".padEnd(2);
        this.meta.userName.forEach(term => {
          outputStr =
            outputStr +
            super.serialize(
              format,
              `{${term.content}}  ${term.altpronunciation}`,
              prefix
            );
        });
        outputStr =
          outputStr +
          super.serialize(
            format,
            `{${this.meta.separator.content}} ${this.meta.separator.altpronunciation}`,
            prefix
          );
        this.meta.domainName.forEach(term => {
          outputStr =
            outputStr +
            super.serialize(
              format,
              `{${term.content}}  ${term.altpronunciation}`,
              prefix
            );
        });
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        if (label === undefined) label = "";
        if (prefix === undefined) prefix = "";
        let colWidth0 = 2;
        let colWidth1 = 15;
        let colWidth2 = 12;
        //        prefix = " ".padEnd(colWidth0 !== undefined ? colWidth0 : 2) + prefix;
        outputStr =
          //          " ".padEnd(colWidth0) +
          `${prefix}{${this.content}}`.padEnd(colWidth1) +
          `${this.constructor.name}`.padEnd(colWidth2);
        colWidth0 += 2;
        prefix = " ".padEnd(colWidth0 !== undefined ? colWidth0 : 2) + prefix;
        this.meta.userName.forEach(term => {
          outputStr =
            outputStr + `\n${prefix}{${term.content}} ${term.altpronunciation}`;
        });
        outputStr =
          outputStr +
          `\n${prefix}{${this.meta.separator.content}} ${this.meta.separator.altpronunciation}`;
        this.meta.domainName.forEach(term => {
          outputStr =
            outputStr + `\n${prefix}{${term.content}} ${term.altpronunciation}`;
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
