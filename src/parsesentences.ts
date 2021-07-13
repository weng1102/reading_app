/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesentences.ts
 *
 * Create sentence objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
// import { AcronymMap } from "./utilities";
import { Token, Tokenizer, TokenListType } from "./tokenizer";
import {
  IParseNode,
  ParseNode,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
// import { MarkdownTagType, TaggedStringType } from "./dataadapter";
import { ISectionNode } from "./parsesections";
import { ITerminalNode } from "./parseterminals";
import {
  GetTerminalNode
  // TerminalNodeClassMap,
  // TerminalNodeMarkupClassMap
} from "./parseterminaldispatch";
import {
  // IPageContent,
  // ISectionContent,
  // ISectionBlockquoteVariant,
  // ISectionBlockquoteVariantInitializer,
  // ISectionFillinVariant,
  // ISectionFillinVariantInitializer,
  // ISectionHeadingVariant,
  // ISectionHeadingVariantInitializer,
  // ISectionOrderedListVariant,
  // ISectionOrderedListVariantInitializer,
  // ISectionUnorderedListVariant,
  // ISectionUnorderedListVariantInitializer,
  // ISectionParagraphVariant,
  // ISectionParagraphVariantInitializer,
  ISentenceContent
  // ITerminalContent,
  // TerminalMetaType,
  // TerminalMetaEnumType,
  // OrderedListTypeEnumType,
  // PageFormatEnumType,
  // SectionVariantEnumType,
  // SectionVariantType,
  // UnorderedListMarkerEnumType,
  // IWordTerminalMeta,
  // IWordTerminalMetaInitializer
} from "./pageContentType";

export type ISentenceNode = ISentenceContent & IParseNode;
abstract class AbstractSentenceNode extends ParseNode implements ISentenceNode {
  id: number = 0;
  content: string = "";
  firstTermIdx: number = 0;
  terminals: ITerminalNode[] = [];
  constructor(parent: ISectionNode | null) {
    super(parent);
  }
  //protected set content(content: string) {}
  parse() {
    return 0;
  }
  transform() {
    return 0;
  }
  // serializeForUnitTest(): string {
  //   let output: string = "";
  //   //let terminalNode: ITerminalNode;
  //   this.terminals.forEach(terminalNode => {
  //     output =
  //       output +
  //       terminalNode.serialize(ParseNodeSerializeFormatEnumType.UNITTEST);
  //   });
  //   return output;
  // }
  StringifyReplacerForParseTest(key: string, value) {
    return key === "id" ? undefined : value;
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string,
    colWidth0?: number,
    colWidth1?: number,
    colWidth2?: number,
    colWidth3?: number,
    colWidth4?: number
  ): string {
    let outputStr: string = "";
    //    this.logger.diagnostic(`AbstractSentenceNode.serialize: ${this.content}`);
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        label = "sentence";
        if (label === undefined) label = "";
        if (prefix === undefined) prefix = "+-";
        if (colWidth0 === undefined) colWidth0 = 2;
        if (colWidth1 === undefined) colWidth1 = 15;
        if (colWidth2 === undefined) colWidth2 = 12;
        if (colWidth3 === undefined) colWidth3 = 25;
        if (colWidth4 === undefined) colWidth4 = 50;
        //    console.log(`AbstractSentenceNode`);
        outputStr = `${prefix}${label}[${this.id}]: ${this.content}\n`;
        //        console.log(`terminalnodes.length=${this.terminals.length}`);
        // for (let i: number = 0; i < this.terminals.length; i++) {
        //   console.log(`terminal=${this.terminals[i].content}`);
        // }
        for (let terminalNode of this.terminals) {
          outputStr =
            outputStr +
            `${terminalNode.serialize(
              ParseNodeSerializeFormatEnumType.TABULAR,
              label,
              " ".padEnd(colWidth0) + prefix,
              colWidth0,
              colWidth1,
              colWidth2,
              colWidth3,
              colWidth4
            )}\n`;
        }
        outputStr = outputStr.slice(0, -1);
        //      outputStr = outputStr.slice(0, -1);
        //        console.log(outputStr);
        //        console.log(`AbstractSentenceNode(${format}): ${outputStr}`);
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST:
        {
          outputStr = JSON.stringify(this, this.StringifyReplacerForParseTest);
        }
        break;
    }
    return outputStr;
  }
  unitTest(actual: string, expected: string): boolean {
    return actual === expected;
  }
}
export class SentenceNode extends AbstractSentenceNode
  implements ISentenceNode {
  protected tokenizer: Tokenizer = new Tokenizer(this);
  constructor(parent: ISectionNode | null, content?: string) {
    super(parent);
    if (content !== undefined) this.content = content; // not readonly inside class
    Object.defineProperty(this, "tokenizer", { enumerable: false });
    Object.defineProperty(this, "userContext", { enumerable: false });
  }
  parse() {
    this.logger.diagnostic(
      `${this.constructor.name} parsing "${this.content}"`
    );
    try {
      assert(
        !(this.content === undefined && this.dataSource === undefined),
        `no content detected`
      );
      if (this.content.length === 0 && this.dataSource !== undefined) {
        this.content = this.dataSource.currentRecord().content;
      }
      // console.log(`this.dataSource.length()=${this.dataSource.length()}`);
      // console.log(
      //   `this.dataSource.currentIdx()=${this.dataSource.currentIdx()}`
      // );
      // console.log(`this.content=${this.content}`);
      // assert(this.content !== undefined, `this.content is undefined`);
      let markedUpSentence: string = this.tokenizer.insertMarkupTags(
        this.content
      );
      let tokenList: TokenListType = this.tokenizer.tokenize(markedUpSentence);
      this.parseTokens(tokenList);
    } catch (e) {
      this.logger.error(e.message);
      // forward record to next SECTION_END
    } finally {
      return this.terminals.length;
    }
  }
  parseTokens(tokens: TokenListType) {
    if (tokens.length === 0) return 0;
    //    this.logger.diagnostic(`token.name=$(token.content}`);
    try {
      let terminalNode: ITerminalNode | undefined;
      let token: Token = tokens[0]; // peek
      assert(token !== undefined, `undefined token detected`);

      terminalNode = GetTerminalNode(token, this); // encapsulating the following

      if (terminalNode) {
        this.logger.diagnostic(
          `Created terminalNode type=${terminalNode.constructor.name} for "${token.content}"`
        );
        terminalNode.parse(tokens); //TokenListType
        this.terminals.push(terminalNode);
      } else {
        this.logger.error(
          `Encountered unhandled token type=${token.type} for token "${token.content}"`
        );
      }
      this.parseTokens(tokens);
    } catch (e) {
      this.logger.error(`Unexpected error: ${e.message}`);
      console.log(e.stack);
    } finally {
      return tokens.length;
    }
  }
}
