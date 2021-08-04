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
  StringifyReplacerForParseTest(key: string, value: any) {
    return key === "id" ? undefined : value;
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    let outputStr: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        label = `sentence[${this.id}]: ${this.content}`;
        outputStr = super.serialize(format, label, prefix);
        //        prefix = " ".padEnd(2) + prefix;
        //        prefix = "| " + prefix;
        //        if (this.parent.sentences.length > 1)
        prefix = this.terminals.length > 0 ? prefix + "| " : "  ";
        for (let terminalNode of this.terminals) {
          outputStr =
            outputStr + terminalNode.serialize(format, undefined, prefix);
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        label = `sentence[${this.id}]: ${this.content}\n`;
        outputStr = super.serialize(format, label, prefix);
        prefix = " ".padEnd(2) + prefix;
        for (let terminalNode of this.terminals) {
          outputStr = outputStr + terminalNode.serialize(format, label, prefix);
        }
        outputStr = outputStr.slice(0, -1);
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
    try {
      assert(
        !(this.content === undefined && this.dataSource === undefined),
        `no content detected`
      );
      if (this.content.length === 0 && this.dataSource !== undefined) {
        this.content = this.dataSource.currentRecord().content;
      }
      this.logger.diagnostic(
        `${this.constructor.name} parsing "${this.content}"`
      );
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
