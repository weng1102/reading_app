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

      assert(
        tokenList.length >= 10,
        "Expected at least 10 tokens parsing image token"
      );
      assert(
        isValidMarkupTag(startTag),
        `Expected valid markup tag but ecnountered "${startTag}" parsing image token`
      );
      assert(
        startTag.toLowerCase === MarkupLabelType.IMAGE.toLowerCase,
        `Expected markup tag ${MarkupLabelType.IMAGE.toLowerCase} but encountered "${startTag}" parsing image token`
      );
      tokenList.shift(); // discard startTag

      // token = tokenList.shift()!;
      // this.content = this.content + token.content;
      // this.meta.countryCode ;
      // this.content = this.content + token.content;

      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.EXCLAMATION,
        `Expected "${TokenLiteral.EXCLAMATION}" but encountered "${token.content}" while parsing image token`
      );
      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.LBRACKET,
        `Expected "${TokenLiteral.LBRACKET}" but encountered "${token.content}" while parsing image token`
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
        `Expected ${TokenLiteral.RBRACKET} but encountered "${token.content}" while parsing image token`
      );
      this.meta.label = label;
      this.content = label;
      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.LPAREN,
        `Expected "${TokenLiteral.LPAREN} but encountered "${token.content}" while parsing image token`
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
        `Expected right parenthesis but encountered "${token.content}" while parsing image`
      );
      let chunks: string[] = src.split(",").map(chunk => chunk.trim());
      if (chunks[0] !== undefined && chunks[0].length > 0)
        this.meta.src = chunks[0];
      if (chunks[1] !== undefined && chunks[0].length > 0)
        this.meta.width = +chunks[1]; // no units; assumed px
      if (chunks[2] !== undefined && chunks[0].length > 0)
        this.meta.height = +chunks[2]; // no units; assumed px
      if (chunks[3] !== undefined && chunks[0].length > 0)
        this.meta.attributes = chunks[3];

      token = tokenList.shift()!;
      assert(
        token.content === endMarkupTag(startTag),
        `Expected closing tag "${endMarkupTag(
          startTag
        )}" while parsing image token`
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
