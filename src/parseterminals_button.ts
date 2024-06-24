/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: parseterminals_button.ts
 *
 * Create terminal recite button objects from serialized input.
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
  IReciteButtonTerminalMeta,
  IReciteButtonTerminalMetaInitializer,
  IReciteButtonItemInitializer,
  ITerminalInfo,
  ReciteScopeEnumType,
  ReciteCursorActionEnumType,
  ReciteListeningActionEnumType
  // ITerminalInfoInitializer,
  // ITerminalListItemInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
import { ITerminalNode, TerminalNode_MLTAG_ } from "./parseterminals";
import { GetTerminalNode } from "./parseterminaldispatch";
export class TerminalNode_MLTAG_RECITEBUTTON extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });
  }
  type = TerminalMetaEnumType.recitebutton;
  meta: IReciteButtonTerminalMeta = IReciteButtonTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    try {
      let startTag = tokenList[0].content;
      let token: Token | undefined;
      assert(
        tokenList.length >= 3,
        "Expected at least 3 tokens parsing recite button token"
      );
      assert(
        isValidMarkupTag(startTag),
        `Expected valid markup tag but encountered "${startTag}" parsing recite button token`
      );
      assert(
        startTag.toLowerCase === MarkupLabelType.RECITEBUTTON.toLowerCase,
        `Expected markup tag ${MarkupLabelType.RECITEBUTTON.toLowerCase} but encountered "${startTag}" parsing button token`
      );
      tokenList.shift(); // discard startTag
      // Unlike the typical parsing approach, the button terminal is just
      // a list of parameters that have no child terminals associated with
      // them like most other terminals AND should be parsed from csv of:
      // <button>
      // [0]: { { words | sentence | section }
      //       -cursor {unchanged | AtEnd | AtBeginning }
      //       { -listening  | -notListening },
      // [1]: label text,
      // [2]: hints/label description,
      // [3]: speech rate
      // [4]: css button attributes (override default),
      // </button>
      let buttonScope: ReciteScopeEnumType = ReciteScopeEnumType.sentence;
      let cursorAction: ReciteCursorActionEnumType =
        ReciteCursorActionEnumType.cursorUnchanged;
      let listeningAction: ReciteListeningActionEnumType =
        ReciteListeningActionEnumType.notListening;
      let span: number = 1;
      let buttonString: string = "";
      for (
        token = tokenList.shift()!;
        token !== undefined &&
        token.content !== endMarkupTag(startTag) &&
        tokenList.length > 0;
        token = tokenList.shift()!
      ) {
        buttonString += token.content;
      }
      // console.log(`buttonString=${buttonString}`);
      let buttonTokens: string[] = buttonString.split(",");
      let buttonAction: string = buttonTokens.length > 0 ? buttonTokens[0] : "";
      let buttonSubactions: string[] = buttonAction.split("-");
      if (buttonSubactions[0] in ReciteScopeEnumType) {
        buttonScope = buttonSubactions[0] as ReciteScopeEnumType;
      } else {
        for (let scope in ReciteScopeEnumType) {
          let spanString: string;
          if (buttonSubactions[0].startsWith(scope)) {
            spanString = buttonSubactions[0].slice(
              scope.length - buttonSubactions[0].length
            );
            buttonScope = scope as ReciteScopeEnumType;
            if (isNaN(+spanString)) {
              assert(isNaN(+spanString));
              span = 1;
              console.log(
                `Expected a number but encountered "${spanString}" while parsing recite button "span" at line ${token.lineNo}. Using default value=${span}.`
              );
              span = 1;
            } else {
              span = +spanString;
            }
            break;
          }
        }
      }
      if (buttonSubactions[1] in ReciteCursorActionEnumType) {
        cursorAction = buttonSubactions[1] as ReciteCursorActionEnumType;
      } else {
        console.log(
          `Invalid cursor action "${buttonSubactions[2]}" at line ${token.lineNo}. Using default value="${cursorAction}"`
        );
      }
      if (buttonSubactions[2] in ReciteListeningActionEnumType) {
        listeningAction = buttonSubactions[2] as ReciteListeningActionEnumType;
      } else {
        console.log(
          `Invalid listening action "${buttonSubactions[2]}" at line ${token.lineNo}. Using default value="${listeningAction}"`
        );
      }
      // determine image based on parameters
      let imageFile: string; // ReciteScopeEnumType.label (default image)
      if (buttonScope === ReciteScopeEnumType.sentence) {
        if (cursorAction === ReciteCursorActionEnumType.cursorAtEnd) {
          imageFile = "button_speak_sentence_full_advance.png";
        } else {
          imageFile = "button_speak_sentence_full.png";
        }
      } else if (buttonScope === ReciteScopeEnumType.word && span > 1) {
        imageFile = "button_speak_sentence_partial_inclusive_advance.png";
      } else {
        imageFile = "button_speak.png";
      }
      let label: string = buttonTokens[1].trim();
      let hint: string =
        buttonTokens[2] !== undefined ? buttonTokens[2].trim() : "";
      let rate: number =
        buttonTokens[3] !== undefined && !isNaN(+buttonTokens[3])
          ? +buttonTokens[3]
          : 1;
      let termIdx: number = this.userContext.terminals.lastIdx;
      // console.log(
      //   `* button scope=${buttonScope} span=${span} cursorAction=${cursorAction} listeningAction=${listeningAction} label=${label} hint=${hint} rate=${rate} termIdx=${termIdx}`
      // );
      // console.log(`${this.userContext.reciteButtons}`);
      this.meta.buttonIdx =
        this.userContext.reciteButtons.push(
          IReciteButtonItemInitializer(
            termIdx,
            buttonScope,
            cursorAction,
            listeningAction,
            span,
            label,
            hint,
            rate
          )
        ) - 1;
      this.meta.image = imageFile;
      this.meta.label = label; // render label
      token = tokenList.shift()!;
      // assert(
      //   token.content === TokenLiteral.RBRACKET,
      //   `Expected ${TokenLiteral.RBRACKET} but encountered "${token.content}" while parsing button token at line ${token.lineNo}`
      // );
    } catch (e) {
      console.log(`error=${e}`);
      // if (linkIdx === this.userContext.links.length - 1)
      //   // allocated at the top of routine
      //   this.userContext.links.pop();
      // this.logger.error(`${this.constructor.name}: ${(<Error>e).message}`);
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
        label = `[reciteButton]`;
        outputStr = super.serialize(format, label, prefix);
        prefix = prefix + "  ";
        outputStr +=
          super.serialize(format, `idx: ${this.meta.buttonIdx}`, prefix) +
          super.serialize(format, `label: ${this.meta.label}`, prefix) +
          super.serialize(format, `img: ${this.meta.image}`, prefix) +
          super.serialize(
            format,
            `attributes: ${this.meta.attributes}`,
            prefix
          );

        // outputStr += super.serialize(format, label, prefix);
        // for (const [i, terminal] of this.meta.label.entries()) {
        //   label = `{${terminal.content}}`;
        //   outputStr = `${outputStr}${(<ITerminalNode>terminal).serialize(
        //     format,
        //     label,
        //     prefix + (i < this.meta.label.length - 1 ? "| " : "  ")
        //   )}`;
        // }
        //
        // label = `destination:`;
        // outputStr += super.serialize(format, label, prefix);
        //
        // prefix = prefix + "| ";
        // let destination = `${this.meta.destination.linkIdxType.toString()}: ${
        //   this.meta.destination.page.length > 0
        //     ? this.meta.destination.page
        //     : "(current)"
        // }`;
        // outputStr += super.serialize(format, destination, prefix);
        // let destinationIdx: string = "";
        // let destinationType: string = this.meta.destination.linkIdxType.toString();
        // if (this.meta.destination.linkIdxType === LinkIdxDestinationType.page)
        //   destinationIdx = `headingIdx: ${
        //     this.meta.destination.headingIdx !== IDX_INITIALIZER
        //       ? this.meta.destination.headingIdx
        //       : "na"
        //   } sectionIdx: ${
        //     this.meta.destination.sectionIdx !== IDX_INITIALIZER
        //       ? this.meta.destination.sectionIdx
        //       : "na"
        //   } terminalIdx: ${
        //     this.meta.destination.terminalIdx !== IDX_INITIALIZER
        //       ? this.meta.destination.terminalIdx
        //       : "na"
        //   }`;
        // outputStr += super.serialize(format, destinationIdx, prefix);
        //
        // let linkIdx = `linkIdx: ${this.meta.linkIdx}`;
        // outputStr += super.serialize(format, linkIdx, prefix);
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
          )}${prefix}{${this.meta.label}}\n`;
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
