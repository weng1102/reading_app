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
  IWordTerminalMeta,
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
      // WORD, DATE, PHONENUMBER.
      let termIdx: number;
      for (
        token = tokenList[0];
        token !== undefined &&
        token.content !== endMarkupTag(MarkupLabelType.FILLIN) &&
        tokenList.length > 0;
        token = tokenList[0] //  peek
      ) {
        assert(token !== undefined, `undefined token detected`);
        let terminalNode: ITerminalNode = GetTerminalNode(token, this._parent);
        // SHOULD report whether terminal type is supported then unwind/move
        // to next valid terminal.
        if (terminalNode) {
          this.logger.diagnostic(
            `Created terminalNode type=${terminalNode.constructor.name} for "${token.content}"`
          );
          terminalNode.parse(tokenList);
          // even though the actual fill-in can be compound, the fillin list
          // need only contain the complete content for unparsed/unrecitable
          // response table display AMD calculating reference count when
          // grouping duplicates
          termIdx = this.meta.terminals.push(terminalNode);
          this.content += terminalNode.content;
          // [
          //   this.meta.sectionIdx,
          //   this.meta.responseIdx
          // ] = this.userContext.fillins.addResponse(this.content);
          let responseIdx: number;
          let fillinSectionIdx: number;
          [
            fillinSectionIdx,
            responseIdx
          ] = this.userContext.fillins.addResponse(this.content);
          (<ITerminalInfo>terminalNode.meta).fillin.responseIdx = responseIdx;
          this.meta.sectionFillinIdx = fillinSectionIdx;
          this.userContext.terminals[
            terminalNode.termIdx
          ].fillin.responseIdx = responseIdx;
          this.userContext.terminals[
            terminalNode.termIdx
          ].fillin.sectionIdx = fillinSectionIdx;
          // console.log(
          //   `Terminal_fillin: termIdx=${terminalNode.termIdx},  sectionIdx=${
          //     this.userContext.terminals[terminalNode.termIdx].fillin.sectionIdx
          //   }, responseIdx=${
          //     this.userContext.terminals[terminalNode.termIdx].fillin
          //       .responseIdx
          //   }`
          // );
          // if recitable then push into prompts
        }
      }
      assert(
        token.content === endMarkupTag(MarkupLabelType.FILLIN),
        `invalid markup close tag "${endMarkupTag(
          MarkupLabelType.FILLIN
        )}" parsing fillin`
      );
      if (this.meta.terminals.length > 0) {
        // loop through terminals and push recitable fillins into
        // prompts and set promptIdx = push() and update responseIdx
        this.firstTermIdx = this.meta.terminals[0].firstTermIdx;
        this.lastTermIdx = this.meta.terminals[
          this.meta.terminals.length - 1
        ].lastTermIdx;
        // lastTerminalIdx - firstTerminalIdx as visible offset
        // for (const [key, terminal] of Object(this.meta.terminals)) {
        //   if (terminal.recitable) // prompts.push(terminalIdx, responseIdx)
        // }
      }
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
        label = `fillin: section:${this.meta.sectionFillinIdx}`;
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
