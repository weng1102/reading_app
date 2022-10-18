/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
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
import { endMarkupTag } from "./tokenizer";
import {
  IDX_INITIALIZER,
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
  ITerminalInfo,
  ITerminalInfoInitializer,
  IFillinTerminalMeta,
  IFillinTerminalMetaInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
import { ITerminalNode, TerminalNode_MLTAG_ } from "./parseterminals";
import { GetTerminalNode } from "./parseterminaldispatch";
export class TerminalNode_MLTAG_FILLIN extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });
  }
  type = TerminalMetaEnumType.fillin;
  meta: IFillinTerminalMeta = IFillinTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    try {
      // catch undefined runtime assertion
      let startTag = tokenList[0].content;
      //      this.logger.diagnosticMode = true;
      let token: Token | undefined;

      assert(tokenList.length > 2, "invalid number of tokens parsing fillin");
      assert(
        isValidMarkupTag(startTag),
        `invalid markup tag(s) parsing fillin`
      );
      assert(
        startTag === MarkupLabelType.FILLIN,
        `invalid markup open tag "${startTag}" parsing fillin`
      );
      token = tokenList.shift()!;
      // Although coded to scan for multiple tokens, only a single token is
      // acceptable at this point until a reason for multiple token fillins
      // is identified instead of using multiple consecutive single-token
      // fillins.
      // Use ITerminalContent so that multiple token types can be parsed e.g.,
      // WORD, DATE
      for (
        token = tokenList[0];
        token !== undefined &&
        token.content !== endMarkupTag(MarkupLabelType.FILLIN) &&
        tokenList.length > 0;
        token = tokenList[0] //  peek
      ) {
        assert(token !== undefined, `undefined token detected`);
        let terminalNode: ITerminalNode = GetTerminalNode(token, this._parent);
        if (terminalNode) {
          this.logger.diagnostic(
            `Created terminalNode type=${terminalNode.constructor.name} for "${token.content}"`
          );
          terminalNode.parse(tokenList); // responsible for advancing tokenlist
          // assumed added in parse() above
          this.meta.terminals.push(terminalNode);
          this.content += terminalNode.content;
          //  this.userContext.terminals[terminalNode.termIdx].linkable = true;
          this.content = terminalNode.content;
        }
      }
      assert(
        token.content === endMarkupTag(MarkupLabelType.FILLIN),
        `invalid markup close tag "${endMarkupTag(
          MarkupLabelType.FILLIN
        )}" parsing fillin`
      );
      token = tokenList.shift()!; // discard </fillin> endtag
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
        label = `<fillin>`;
        outputStr = super.serialize(format, label, prefix);
        for (const [i, terminal] of this.meta.terminals.entries()) {
          label = `${terminal.type}`;
          outputStr = `${outputStr}${(<ITerminalNode>terminal).serialize(
            format,
            undefined,
            prefix + (i < this.meta.terminals.length - 1 ? "| " : "  ")
          )}`;
        }
        // if (this.cueList.length > 0)
        //   outputStr = `${outputStr}${super.serialize(
        //     format,
        //     this.cueList,
        //     prefix + "  "
        //   )}`;
        // outputStr = `${outputStr}${super.serialize(
        //   format,
        //   this.cueList + "hi",
        //   prefix + "  "
        //   //            prefix + (i < this.meta.phrase.length - 1 ? "| " : "  ")
        // )}`;

        // for (let cue of this.meta.cues) {
        //   outputStr = `${outputStr}${super.serialize(
        //     format,
        //     cue,
        //     prefix + "  "
        //     //            prefix + (i < this.meta.phrase.length - 1 ? "| " : "  ")
        //   )}`;
        // }
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
          outputStr + `\n${" ".padEnd(2)}${prefix}{${this.content}}\n`;
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