/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_image.ts
 *
 * Create terminalimage objects from serialized input.
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
  endMarkupTag,
  isValidMarkupTag,
  TokenListType,
  TokenLiteral,
  Token,
  MarkupLabelType
} from "./tokenizer";
import {
  TerminalMetaEnumType,
  IImageTerminalMeta,
  IImageTerminalMetaInitializer
  // ITerminalInfoInitializer,
  // ITerminalListItemInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
import { ITerminalNode, TerminalNode_MLTAG_ } from "./parseterminals";
export class TerminalNode_MLTAG_IMAGE extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });
  }
  type = TerminalMetaEnumType.image;
  meta: IImageTerminalMeta = IImageTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    try {
      // catch undefined runtime assertion
      let startTag = tokenList[0].content;
      //      this.logger.diagnosticMode = true;
      let token: Token | undefined;

      assert(tokenList.length >= 10, "invalid number of tokens parsing image");
      assert(isValidMarkupTag(startTag), `invalid markup tag(s) parsing image`);
      assert(
        startTag.toLowerCase === MarkupLabelType.IMAGE.toLowerCase,
        `invalid markup tag "${startTag}" parsing image`
      );
      tokenList.shift(); // discard startTag

      // token = tokenList.shift()!;
      // this.content = this.content + token.content;
      // this.meta.countryCode ;
      // this.content = this.content + token.content;

      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.EXCLAMATION,
        `expected exclamation but encountered "${token.content}" while parsing image`
      );
      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.LBRACKET,
        `expected left bracket but encountered "${token.content}" while parsing image`
      );
      let label: string = "";
      for (
        token = tokenList.shift()!;
        token !== undefined && token.content !== TokenLiteral.RBRACKET;
        token = tokenList.shift()!
      ) {
        label += token.content;
      }
      assert(
        token.content === TokenLiteral.RBRACKET,
        `expected right bracket but encountered "${token.content}" while parsing image`
      );
      this.meta.label = label;
      this.content = label;
      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.LPAREN,
        `expected left parenthesis but encountered "${token.content}" while parsing image`
      );
      let src: string = "";
      for (
        token = tokenList.shift()!;
        token !== undefined && token.content !== TokenLiteral.RPAREN;
        token = tokenList.shift()!
      ) {
        src += token.content;
      }
      assert(
        token.content === TokenLiteral.RPAREN,
        `expected right parenthesis but encountered "${token.content}" while parsing image`
      );
      let chunks: string[] = src.split(",");
      console.log(`image src=${chunks}`);
      if (chunks[0] !== undefined) this.meta.src = chunks[0];
      if (chunks[1] !== undefined) this.meta.width = +chunks[1];
      if (chunks[2] !== undefined) this.meta.height = +chunks[2];
      if (chunks[3] !== undefined) this.meta.attributes = chunks[3].trim();

      token = tokenList.shift()!;
      assert(
        token.content === endMarkupTag(startTag),
        `expected closing  tag </image> while parsing image`
      );
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
        outputStr +=
          super.serialize(format, `{${this.meta.label}}`, prefix) +
          super.serialize(format, `{${this.meta.src}}`, prefix);

        if (this.meta.width > 0)
          outputStr += super.serialize(format, `{${this.meta.width}}`, prefix);
        if (this.meta.height > 0)
          outputStr += super.serialize(format, `{${this.meta.height}}`, prefix);
        if (this.meta.attributes.length > 0)
          outputStr += super.serialize(
            format,
            `{${this.meta.attributes}}`,
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
          `\n${" ".padEnd(2)}${prefix}{${this.meta.label}}\n${" ".padEnd(
            2
          )}${prefix}{${this.meta.src}}\n`;
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
