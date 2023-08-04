/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_heading.ts
 *
 * Create section heading objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { IsError } from "./utilities";
import {
  IDX_INITIALIZER,
  IParseNode,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import { MarkdownRecordType, TaggedStringType } from "./dataadapter";
import {
  ISectionContent,
  ISectionHeadingVariant,
  ISectionHeadingVariantInitializer,
  SectionVariantEnumType
} from "./pageContentType";
import { IPageNode } from "./parsepages";
import { SectionParseNode } from "./parsesections";
import { ISentenceNode, SentenceNode } from "./parsesentences";
export type ISectionNode = ISectionContent & IParseNode;
export class SectionParseNode_HEADING extends SectionParseNode
  implements ISectionNode {
  // can have zero (when immediately followed by subsecion) or more sentences
  // readonly type: SectionVariantEnumType = SectionVariantEnumType.heading;
  // protected title: string = `${this.name}: ${this.description}`; // otherwise defaults to  name: description above
  // protected recitable: boolean = false;
  // protected audible: boolean = false;
  // protected level: number = 0;
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
  readonly type = SectionVariantEnumType.heading;
  meta: ISectionHeadingVariant = ISectionHeadingVariantInitializer();
  //  meta: ISectionHeadingVariant1 = ISectionHeadingVariantInitializer1();
  parse() {
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(
        current.recordType === MarkdownRecordType.HEADING,
        `expected ${MarkdownRecordType.HEADING} at line ${current.lineNo}`
      );
      let firstTermIdx: number = this.userContext.terminals.lastIdx + 1;
      let sentence: ISentenceNode = new SentenceNode(this);
      sentence.parse();

      // should be last index in the section not just the title.
      // HeadingArray.parse will make adjustment
      let lastTermIdx = this.userContext.terminals.lastIdx;

      this.meta.heading = sentence;
      this.meta.level = current.headingLevel;
      this.meta.heading.firstTermIdx = firstTermIdx;

      this.userContext.headings.push({
        headingLevel: current.headingLevel,
        title: current.content,
        firstTermIdx: firstTermIdx,
        lastTermIdx: lastTermIdx,
        terminalCountPriorToHeading: IDX_INITIALIZER
      });
      for (let idx = firstTermIdx; idx <= lastTermIdx; idx++) {
        this.userContext.terminals[idx].heading = true;
      }
      this.dataSource.nextRecord(); // position to next record
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(e.message);
        if (this.logger.verboseMode) console.log(e.stack);
      } else {
        throw e;
      }
    } finally {
      return 1;
    }
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    let sentenceNode: ISentenceNode = <SentenceNode>this.meta.heading;
    label = `heading id=${sentenceNode.id} (at level ${this.meta.level})`;
    prefix += "  ";
    let outputStr: string = `${super.serialize(
      format,
      label,
      prefix
    )}${sentenceNode.serialize(format, "", prefix + "  ")}`;
    return outputStr;
  }
}
