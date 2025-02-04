/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: parseterminals_inlinebutton.ts
 *
 * Create terminal inline button objects from serialized input.
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
  MarkupLabelType,
  tokenizeParameterList
} from "./tokenizer";
import {
  TerminalMetaEnumType,
  IInlineButtonTerminalMeta,
  IInlineButtonTerminalMetaInitializer,
  IInlineButtonItemInitializer,
  // ITerminalInfo,
  InlineButtonActionEnumType
  // RecitationScopeEnumType,
  // RecitationPlacementEnumType,
  // RecitationReferenceEnumType,
  // RecitationListeningEnumType
  // ITerminalInfoInitializer,
  // ITerminalListItemInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
import { ITerminalNode, TerminalNode_MLTAG_ } from "./parseterminals";
// import { GetTerminalNode } from "./parseterminaldispatch";
export class TerminalNode_MLTAG_INLINEBUTTON extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });
  }
  type = TerminalMetaEnumType.inlinebutton;
  meta: IInlineButtonTerminalMeta = IInlineButtonTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    try {
      let startTag = tokenList[0].content;
      let token: Token | undefined;
      assert(
        tokenList.length >= 3,
        "Expected at least 3 tokens parsing inline button token"
      );
      assert(
        isValidMarkupTag(startTag),
        `Expected valid markup tag but encountered "${startTag}" parsing inline button token`
      );
      assert(
        startTag.toLowerCase === MarkupLabelType.INLINEBUTTON.toLowerCase,
        `Expected markup tag ${MarkupLabelType.INLINEBUTTON.toLowerCase} but encountered "${startTag}" parsing inline button token`
      );
      tokenList.shift(); // discard startTag
      // Unlike the typical parsing approach, the button terminal is just
      // a list of parameters that have no child terminals associated with
      // them like most other terminals AND should be parsed from csv of:
      // <button>
      // [0]: { choice | complete | converse | cues | label | model | term }
      //{ words | sentence | section }
      //       -cursor {unchanged | AtEnd | AtBeginning }
      //       { -listening  | -notListening },
      // [2]: hints/label description,
      // [3] sortKey (proposed)
      // [3]: speech rate
      // [4]: voice index
      // [5]: css button attributes (override default),
      // </button>
      let buttonAction: InlineButtonActionEnumType =
        InlineButtonActionEnumType.label; //default
      let span: number = 1; // only for complete
      let subactionIdx = 0;
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
      let buttonTokens: string[] = tokenizeParameterList(buttonString);
      // console.log(`inline parse=${buttonTokens}`);
      // let buttonSubactions: string[] = buttonActions.split("-");
      let spanString: string;
      let label: string = "";
      if (buttonTokens[0] in InlineButtonActionEnumType) {
        buttonAction = buttonTokens[0] as InlineButtonActionEnumType;
      } else if (
        buttonTokens[0].startsWith(InlineButtonActionEnumType.completion)
      ) {
        spanString = buttonAction.slice(
          buttonAction.length - InlineButtonActionEnumType.completion.length
        );
        if (isNaN(+spanString)) {
          assert(isNaN(+spanString));
          span = 1;
          console.log(
            `Expected a number but encountered "${spanString}" while parsing inline button "span" at line ${token.lineNo}. Using default value=${span}.`
          );
          span = 1;
        } else {
          span = +spanString;
        }
      } else {
      }
      // just assume the defaults for everything
      // determine image based on parameters
      // let imageFile: string; // ReciteScopeEnumType.label (default image)
      // if (buttonScope === RecitationScopeEnumType.sentence) {
      //   if (position === RecitationReferenceEnumType.following) {
      //     imageFile = "button_speak_sentence_full_advance.png";
      //   } else {
      //     imageFile = "button_speak_sentence_full.png";
      //   }
      // } else if (buttonScope === RecitationScopeEnumType.words && span > 1) {
      //   imageFile = "button_speak_sentence_partial_inclusive_advance.png";
      // } else {
      //   imageFile = "button_speak.png";
      // }
      // console.log(`label=${buttonTokens[1]}`);
      // need to parse string contractions and numbers with commas
      // console.log(`label=${buttonTokens[1]}`);
      label = buttonTokens[1].trim();
      this.logger.diagnostic(`button label=${label}`);
      // let sortKey: string = buttonTokens[2] !== undefined ? buttonTokens[2].trim() : "";
      let cues: string =
        buttonTokens[2] !== undefined ? buttonTokens[2].trim() : "";
      let rate: number =
        buttonTokens[3] !== undefined && !isNaN(+buttonTokens[3])
          ? +buttonTokens[3]
          : 0;
      // buttonTokens[2] can also be sortkey for term

      let termIdx: number = this.userContext.terminals.lastIdx;
      let lastTermIdx: number = IDX_INITIALIZER;
      let sectionIdx: number = IDX_INITIALIZER;
      // This termIdx is a placeholder until buttons.parse() can set the actual termIdx to the start of the next sentence that has yet to be parsed. This
      // current value is required to determine the actual value when
      // buttons.parse() has access to ALL terminals (after this one).
      let toBeRecited: string = "";
      switch (buttonAction) {
        case InlineButtonActionEnumType.cues:
          toBeRecited = cues;
          break;
        default:
          toBeRecited = `label: ${label}`;
      }
      this.meta.buttonIdx =
        this.userContext.inlineButtons.push(
          IInlineButtonItemInitializer(
            undefined,
            termIdx,
            sectionIdx,
            lastTermIdx,
            buttonAction,
            span,
            label,
            cues,
            rate,
            undefined,
            undefined,
            undefined,
            toBeRecited
          )
        ) - 1;
      this.userContext.inlineButtons[
        this.meta.buttonIdx
      ].buttonIdx = this.meta.buttonIdx;
      this.content = label; // for rendering button grid only
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
        label = `inlineButton: ${this.meta.label}`;
        outputStr = super.serialize(format, label, prefix);
        prefix = prefix + "  ";
        outputStr +=
          super.serialize(format, `idx: ${this.meta.buttonIdx}`, prefix) +
          // super.serialize(format, `label: ${this.meta.label}`, prefix) +
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
