/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_acronym.ts
 *
 * Create terminal acronym objects from serialized input.
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
  IAcronymTerminalMeta,
  IAcronymTerminalMetaInitializer,
  ITerminalInfo,
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
  type = TerminalMetaEnumType.acronym;
  meta: IAcronymTerminalMeta = IAcronymTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    try {
      let token: Token = tokenList.shift()!;
      assert(token !== undefined, "too few tokens parsing acronym");
      assert(
        token.content === token.content.toUpperCase(),
        "expected all upper case letters parsing acronym"
      );
      let expansionCsv = AcronymMap.get(token.content);
      assert(expansionCsv !== undefined, `expected an acronym but none found`);
      this.content = token.content;
      let expansionList = expansionCsv.split(",");
      let letter = [...token.content];
      for (let pos = 0; pos < letter.length; pos++) {
        let idx =
          this.meta.letters.push(
            ITerminalInfoInitializer(
              letter[pos],
              expansionList[pos], //altpronunication
              expansionList[pos] //altrecognition
            )
          ) - 1;
        this.userContext.terminals.push(this.meta.letters[idx]);
      }
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
        this.meta.letters.forEach(letter => {
          outputStr =
            outputStr +
            super.serialize(
              format,
              `{${letter.content}}  ${letter.altrecognition}`,
              prefix
            );
        });
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
        this.meta.letters.forEach(letter => {
          let termIdx: string =
            letter.termIdx !== 0 ? `termIdx=${letter.termIdx}` : "";
          outputStr =
            outputStr +
            `\n${ParseNodeSerializeTabular(
              "letter",
              letter.content,
              letter.altpronunciation,
              termIdx
            )}`;
        });
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
