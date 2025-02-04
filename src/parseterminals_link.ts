/** Copyright (C) 2020 - 2025 Wen Eng - All Rights Reserved
 *
 * File name: parsetermminals_link.ts
 *
 * Create terminal link objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { IsError, IsDefined } from "./utilities";
import {
  IDX_INITIALIZER,
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
  ICurriculumLinkTerminalMeta,
  ICurriculumLinkTerminalMetaInitializer,
  ILinkListItem,
  ILinkListItemInitializer,
  ITerminalInfo,
  LinkIdxDestinationType
  // ITerminalInfoInitializer,
  // ITerminalListItemInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
import { ITerminalNode, TerminalNode_MLTAG_ } from "./parseterminals";
import { GetTerminalNode } from "./parseterminaldispatch";
export class TerminalNode_MLTAG_LINK extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });
  }
  type = TerminalMetaEnumType.link;
  meta: ICurriculumLinkTerminalMeta = ICurriculumLinkTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    let linkIdx: number = IDX_INITIALIZER;
    try {
      let linkIdx: number = IDX_INITIALIZER;
      let startTag = tokenList[0].content;
      let token: Token | undefined;

      assert(
        tokenList.length >= 8,
        "Expected at least 8 tokens parsing link token"
      );
      assert(
        isValidMarkupTag(startTag),
        `Expected valid markup tag but encountered "${startTag}" parsing link token`
      );
      assert(
        startTag.toLowerCase === MarkupLabelType.LINK.toLowerCase,
        `Expected markup tag ${MarkupLabelType.LINK.toLowerCase} but encountered "${startTag}" parsing link token`
      );
      tokenList.shift(); // discard startTag
      token = tokenList.shift()!; // discards LBRACKET
      assert(
        token.content === TokenLiteral.LBRACKET,
        `Expected "${TokenLiteral.LBRACKET}" but encountered "${token.content}" while parsing link token at line ${token.lineNo}`
      );
      let label: string = "";
      linkIdx = this.userContext.links.push(ILinkListItemInitializer()) - 1;
      for (
        token = tokenList[0];
        token !== undefined &&
        token.content !== TokenLiteral.RBRACKET &&
        tokenList.length > 0;
        token = tokenList[0] //  peek0
      ) {
        // console.log(`...${token.content}, ${token.type}`);
        assert(token !== undefined, `undefined token detected`);
        let terminalNode: ITerminalNode = GetTerminalNode(token, this._parent);
        if (terminalNode) {
          this.logger.diagnostic(
            `Created terminalNode type=${terminalNode.constructor.name} for "${token.content}"`
          );
          terminalNode.parse(tokenList); // responsible for advancing tokenlist
          // console.log(
          //   `link content=${terminalNode.content}, type=${this.type},  first=${terminalNode.firstTermIdx},last=${terminalNode.lastTermIdx}`
          // );
          // assumed added in parse() above
          // console.log(
          //   `first/last1=${terminalNode.firstTermIdx} ${terminalNode.lastTermIdx}`
          // );
          if (
            terminalNode.firstTermIdx !== IDX_INITIALIZER &&
            terminalNode.lastTermIdx !== IDX_INITIALIZER
          ) {
            for (
              let idx = terminalNode.firstTermIdx;
              idx <= terminalNode.lastTermIdx;
              idx++
            ) {
              this.userContext.terminals[idx].linkIdx = linkIdx;
            }
          }
          label += terminalNode.content;
          //  this.userContext.terminals[terminalNode.termIdx].linkable = true;
          this.meta.label.push(terminalNode);
        } else {
          this.logger.error(
            `Encountered unhandled token type=${token.type} for token "${token.content}" at line ${token.lineNo}`
          );
        }
      }
      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.RBRACKET,
        `Expected ${TokenLiteral.RBRACKET} but encountered "${token.content}" while parsing link token at line ${token.lineNo}`
      );
      this.content = label;
      if (this.meta.label.length > 0) {
        // Scan forward for first valid termIdx and backward for last
        // valid termIdx to ignore non-words bracketing
        for (
          let i: number = 0, found: boolean = false;
          !found && i < this.meta.label.length;
          i++
        ) {
          if (this.meta.label[i].termIdx >= 0) {
            found = true;
            this.firstTermIdx = this.meta.label[i].termIdx;
          }
        }
        for (
          let i: number = this.meta.label.length - 1, found: boolean = false;
          !found && i >= 0;
          i--
        ) {
          if (this.meta.label[i].termIdx >= 0) {
            found = true;
            this.lastTermIdx = this.meta.label[i].termIdx;
          }
        }
        // this.firstTermIdx = this.meta.label[0].termIdx;
        // this.lastTermIdx = this.meta.label[this.meta.label.length - 1].termIdx;
      }
      // console.log(
      //   `${label} first/last2=${this.firstTermIdx}/${this.lastTermIdx}`
      // );
      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.LPAREN,
        `Expected "${TokenLiteral.LPAREN} but encountered "${token.content}" while parsing link token at line ${token.lineNo}`
      );
      //      token = tokenList.shift()!;
      let destination: string = "";
      for (
        token = tokenList.shift()!;
        token !== undefined &&
        token.content !== TokenLiteral.RPAREN &&
        tokenList.length > 0;
        token = tokenList.shift()!
      ) {
        destination += token.content;
        // console.log(`token:${token.content}`);
        // console.log(`running destination:${destination}`);
        // to be consistent, destination should have a parse that at least
        // advances the tokenList queue and NOT using for-loop step
      }
      let chunks: string[] = destination.split(",").map(chunk => chunk.trim());
      this.meta.destination.page = chunks[0];
      if (IsDefined(chunks[1]) && chunks[1] in LinkIdxDestinationType) {
        this.meta.destination.linkIdxType = chunks[1] as LinkIdxDestinationType;
      } else {
        assert(
          IsDefined(chunks[1]) && chunks[1] in LinkIdxDestinationType,
          `Expected link type but encountered "${chunks[1]}" while parsing link destination type at line ${token.lineNo}`
        );
      }
      if (IsDefined(chunks[2]) && Number(chunks[2]) !== NaN) {
        let idx: number = +chunks[2];
        if (this.meta.destination.linkIdxType === LinkIdxDestinationType.page) {
          // do nothing
        } else if (
          this.meta.destination.linkIdxType === LinkIdxDestinationType.heading
        ) {
          // idx is a headingIdx
          this.meta.destination.headingIdx = idx;
        } else if (
          this.meta.destination.linkIdxType === LinkIdxDestinationType.section
        ) {
          this.meta.destination.sectionIdx = idx;
        } else if (
          this.meta.destination.linkIdxType === LinkIdxDestinationType.terminal
        ) {
          this.meta.destination.terminalIdx = idx;
        } else {
        }
      } else {
        assert(
          Number(chunks[2]) !== NaN,
          `Expected a numeric but encountered "${chunks[2]}" while parsing link destination index at line ${token.lineNo}`
        );
      }
      let directory: string = `dist\\`;
      this.userContext.links[linkIdx] = ILinkListItemInitializer(
        label,
        {
          page: this.meta.destination.page,
          directory: directory,
          linkIdxType: this.meta.destination.linkIdxType,
          headingIdx: this.meta.destination.headingIdx,
          sectionIdx: this.meta.destination.sectionIdx,
          terminalIdx: this.meta.destination.terminalIdx
        },
        false
      );
      // defer page validation. What about linking within current page?
      //   this.meta.destination.page = chunks[0];
      // }
      // if (IsDefined(chunks[1])) {
      //   assert(
      //     Number(chunks[1]) !== NaN,
      //     `Expected a numeric but encountered "${chunks[1]}" while parsing link destination section index`
      //   );
      //   this.meta.destination.idx = +chunks[1].trim(); // no units;       )
      // } else {
      //   this.meta.destination.sectionIdx = 0;
      // }
      // if (IsDefined(chunks[2])) {
      //   assert(
      //     Number(chunks[2].trim()) !== NaN,
      //     `Expected a numeric value but encountered "${chunks[2]}" while parsing link destination terminal index`
      //   );
      //   this.meta.destination.terminalIdx = +chunks[2].trim(); // no units;
      // } else {
      //   this.meta.destination.terminalIdx = 0;
      // }
      //      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.RPAREN,
        `Expected right parenthesis but encountered "${token.content}" while parsing link at line ${token.lineNo}`
      );
      token = tokenList.shift()!;
      assert(
        token.content === endMarkupTag(startTag),
        `Expected closing tag "${endMarkupTag(
          startTag
        )}" while parsing link token at line ${token.lineNo}`
      );
      this.meta.linkIdx = linkIdx;
      this.userContext.links[linkIdx] = ILinkListItemInitializer(
        label,
        this.meta.destination
      );
    } catch (e) {
      if (linkIdx === this.userContext.links.length - 1)
        // allocated at the top of routine
        this.userContext.links.pop();
      this.logger.error(`${this.constructor.name}: ${(<Error>e).message}`);
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
        if (prefix === undefined) prefix = "";
        label = `link: ${this.content}`;
        outputStr = super.serialize(format, label, prefix);
        label = `label: ${this.content}`;
        prefix = prefix + "| ";
        outputStr += super.serialize(format, label, prefix);
        for (const [i, terminal] of this.meta.label.entries()) {
          label = `{${terminal.content}}`;
          outputStr = `${outputStr}${(<ITerminalNode>terminal).serialize(
            format,
            label,
            prefix + (i < this.meta.label.length - 1 ? "| " : "  ")
          )}`;
        }

        label = `destination:`;
        outputStr += super.serialize(format, label, prefix);

        prefix = prefix + "| ";
        let destination = `${this.meta.destination.linkIdxType.toString()}: ${
          this.meta.destination.page.length > 0
            ? this.meta.destination.page
            : "(current)"
        }`;
        outputStr += super.serialize(format, destination, prefix);
        let destinationIdx: string = "";
        let destinationType: string = this.meta.destination.linkIdxType.toString();
        if (this.meta.destination.linkIdxType === LinkIdxDestinationType.page)
          destinationIdx = `headingIdx: ${
            this.meta.destination.headingIdx !== IDX_INITIALIZER
              ? this.meta.destination.headingIdx
              : "na"
          } sectionIdx: ${
            this.meta.destination.sectionIdx !== IDX_INITIALIZER
              ? this.meta.destination.sectionIdx
              : "na"
          } terminalIdx: ${
            this.meta.destination.terminalIdx !== IDX_INITIALIZER
              ? this.meta.destination.terminalIdx
              : "na"
          }`;
        outputStr += super.serialize(format, destinationIdx, prefix);

        let linkIdx = `linkIdx: ${this.meta.linkIdx}`;
        outputStr += super.serialize(format, linkIdx, prefix);
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
          )}${prefix}{${this.meta.destination}}\n`;
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
