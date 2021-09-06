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
import { IsError } from "./utilities";
// import { AcronymMap } from "./utilities";
import { Token, Tokenizer, TokenListType } from "./tokenizer";
import {
  IDX_INITIALIZER,
  IParseNode,
  ParseNode,
  ParseNodeSerializeTabular,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import { ISectionNode } from "./parsesections";
import { ITerminalNode } from "./parseterminals";
import { GetTerminalNode } from "./parseterminaldispatch";
import { ISentenceContent, ITerminalContent } from "./pageContentType";

export type ISentenceNode = ISentenceContent & IParseNode;
abstract class AbstractSentenceNode extends ParseNode implements ISentenceNode {
  id: number = 0;
  content: string = "";
  firstTermIdx: number = IDX_INITIALIZER;
  lastTermIdx: number = IDX_INITIALIZER;
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
  stringifyReplacerForParseTest(key: string, value: any) {
    // only include fields relevant otherwise ignore
    switch (key) {
      case "id":
      case "termIdx":
      case "firstTermIdx":
      case "nextTermIdx":
      case "prevTermIdx":
      case "recitable":
      case "audible":
      case "visible":
        return undefined;
      default:
        return value;
    }
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    let outputStr: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        label = `sentence: ${this.content}`;
        outputStr = super.serialize(format, label, prefix);
        for (const [i, value] of this.terminals.entries()) {
          label = `${value.type}`;
          outputStr = `${outputStr}${value.serialize(
            format,
            undefined,
            prefix + (i < this.terminals.length - 1 ? "| " : "  ")
          )}`;
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        label = ParseNodeSerializeTabular(this.constructor.name, this.content);
        outputStr = super.serialize(format, label, prefix);
        for (let terminalNode of this.terminals) {
          outputStr = outputStr + terminalNode.serialize(format);
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        let replacer: any = (key, value) => {
          // if we get a function, give us the code for that function
          switch (key) {
            case "id":
            case "termIdx":
            case "firstTermIdx":
            case "nextTermIdx":
            case "prevTermIdx":
            case "lastTermIdx":
            case "recitable":
            case "audible":
            case "visible":
            case "fillin":
              return undefined;
            default:
              return value;
          }
        };
        outputStr = JSON.stringify(this, replacer);
        // for (let terminalNode of this.terminals) {
        //   outputStr =
        //     outputStr + terminalNode.whiteList(format, label, prefix);
        // }

        // outputStr = JSON.stringify(this, [
        //   "content",
        //   "type",
        //   "terminals",
        //   "altpronunciation",
        //   "altrecognition",
        //   "meta",
        //   "day",
        //   "month",
        //   "year",
        //   "century",
        //   "withinCentury",
        //   "letters"
        // ]);
        break;
      }
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
      let markedUpSentence: string = this.tokenizer.insertMarkupTags(
        this.content
      );
      let tokenList: TokenListType = this.tokenizer.tokenize(markedUpSentence);
      this.parseTokens(tokenList);
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(e.message);
      } else {
        throw e;
      }
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
      if (IsError(e)) {
        this.logger.error(`Unexpected error: ${e.message}`);
        console.log(e.stack);
      } else {
        throw e;
      }
    } finally {
      return tokens.length;
    }
  }
}
