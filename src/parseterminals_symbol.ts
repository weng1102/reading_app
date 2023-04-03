/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: parseterminals_symbol.ts
 *
 * Create terminal symbol objects from serialized input. Could not be
 * implemented as a TerminalNode_WORD because symbols must be tokenized
 * even though they are not separated by whitespace from previous token.
 * E.g., 15% should be "15", "%". Same with @, #, &, +, =, <, >,
 * the degree symbol. Perhaps Google Speech recognition and speech
 * synthesis can manage processing but internal application parsing Should
 * be explicit.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { IsError } from "./utilities";
import {
  ParseNodeSerializeColumnWidths,
  ParseNodeSerializeFormatEnumType,
  ParseNodeSerializeTabular
} from "./baseclasses";
import { TokenListType, Token } from "./tokenizer";
import {
  TerminalMetaEnumType,
  ISymbolTerminalMeta,
  //ITerminalInfo,
  ITerminalInfoInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
import { AbstractTerminalNode, ITerminalNode } from "./parseterminals";
import { AcronymMap } from "./utilities";
export class TerminalNode_ACRONYM extends AbstractTerminalNode
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });

    //    this.type = TerminalNodeEnumType.MLTAG;
  }
  type = TerminalMetaEnumType.symbol;
  meta: ISymbolTerminalMeta = ITerminalInfoInitializer();
  parse(tokenList: TokenListType): number {
    try {
      let token: Token = tokenList.shift()!;
      assert(token !== undefined, "too few tokens parsing acronym");
      assert(
        token.content === token.content.toUpperCase(),
        "expected all upper case letters parsing acronym"
      );
      let symbol: string = token.content;
      assert(symbol !== undefined, `expected a symbol but none found`);
      this.content = token.content;
      // let expansionList = expansionCsv.split(",");
      // let letter = [...token.content];
      // for (let pos = 0; pos < letter.length; pos++) {
      //   let idx =
      //     this.meta.letters.push(
      //       ITerminalInfoInitializer(
      //         letter[pos],
      //         expansionList[pos], //altpronunication
      //         expansionList[pos] //altrecognition
      //       )
      //     ) - 1;
      //   this.meta.letters[idx].termIdx = this.userContext.terminals.push(
      //     ITerminalListItemInitializer(this.meta.letters[idx])
      //   );
      //   this.firstTermIdx = this.meta.letters[0].termIdx;
      //   this.lastTermIdx = this.meta.letters[
      //     this.meta.letters.length - 1
      //   ].termIdx;
      // }
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
        if (label === undefined) label = "";
        if (prefix === undefined) prefix = "";
        //        prefix = " ".padEnd(colWidth0 !== undefined ? colWidth0 : 2) + prefix;
        outputStr = super.serialize(format, this.content, prefix);
        prefix = prefix + "| ";
        outputStr =
          outputStr +
          super.serialize(
            format,
            `{${this.content}}  ${this.meta.altrecognition}`,
            prefix
          );
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        if (label === undefined) label = "";
        if (prefix === undefined) prefix = "";
        //        prefix = " ".padEnd(colWidth0 !== undefined ? colWidth0 : 2) + prefix;
        outputStr =
          //    " ".padEnd(colWidth0) +
          `${prefix}{${this.content}}`.padEnd(
            ParseNodeSerializeColumnWidths[1]
          ) +
          `${this.constructor.name}`.padEnd(ParseNodeSerializeColumnWidths[1]);
        //        colWidth0 += 2;
        let termIdx: string =
          this.meta.termIdx !== 0 ? `termIdx=${this.meta.termIdx}` : "";
        (outputStr = outputStr + this.meta.content),
          this.meta.altpronunciation,
          termIdx;
        outputStr = `${outputStr}\n`;
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
