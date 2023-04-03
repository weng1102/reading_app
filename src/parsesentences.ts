/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
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
import {
  ISentenceContent,
  ISentenceListItemInitializer,
  TerminalMetaEnumType
} from "./pageContentType";

export type ISentenceNode = ISentenceContent & IParseNode;
export abstract class AbstractSentenceNode extends ParseNode
  implements ISentenceNode {
  id: number = 0;
  content: string = "";
  firstTermIdx: number = IDX_INITIALIZER;
  lastTermIdx: number = IDX_INITIALIZER;
  terminals: ITerminalNode[] = [];
  lastPunctuation: string = "";
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
        for (const [i, terminal] of this.terminals.entries()) {
          label = `${terminal.type}`;
          outputStr = `${outputStr}${terminal.serialize(
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
        for (let terminal of this.terminals) {
          let terminalNode: ITerminalNode = <ITerminalNode>terminal;
          outputStr = outputStr + terminalNode.serialize(format);
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        let replacer: any = (key: string, value: any) => {
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
      let markedUpSentence: string = this.tokenizer.addMarkupTags(this.content);
      let tokenList: TokenListType = this.tokenizer.tokenize(markedUpSentence);
      this.firstTermIdx = this.userContext.terminals.lastIdx + 1; //nextIdx
      this.parseTokens(tokenList);
      this.lastTermIdx = this.userContext.terminals.lastIdx;
      // update all above terminals
      //      this.id = this.userContext.sentences.push( { firstTermIdx: this.firstTermIdx, lastTermIdx: this.lastTermIdx});
      // got each terminal and update sentence id
      this.id =
        this.userContext.sentences.push(
          ISentenceListItemInitializer(
            this.firstTermIdx,
            this.lastTermIdx,
            this.lastPunctuation
          )
        ) - 1;
      for (let idx = this.firstTermIdx; idx <= this.lastTermIdx; idx++) {
        this.userContext.terminals[idx].sentenceIdx = this.id;
      }
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
    // end of sentence. Look for trailing punctuation
    let found: boolean = false;
    if (tokens.length === 0) {
      //find last punctuation mark from the end of terminals
      for (let terminal of this.terminals.slice().reverse()) {
        found =
          terminal.type === TerminalMetaEnumType.punctuation &&
          terminal.content !== "'" &&
          terminal.content !== '"';
        if (found) {
          this.lastPunctuation = terminal.content;
          break;
        }
      }
      return 0;
    }
    try {
      let terminalNode: ITerminalNode | undefined;
      let token: Token = tokens[0]; // peek
      assert(token !== undefined, `undefined token detected`);

      terminalNode = GetTerminalNode(token, this);
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
