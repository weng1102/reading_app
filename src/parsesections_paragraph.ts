/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_paragraph.ts
 *
 * Create section paragraph objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { IsError } from "./utilities";
import {
  IDX_INITIALIZER,
  ParseNodeSerializeTabular,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import { MarkdownTagType, TaggedStringType } from "./dataadapter";
import {
  ISectionListItemInitializer,
  ISectionParagraphVariant,
  ISectionParagraphVariantInitializer,
  SectionVariantEnumType
} from "./pageContentType";
import { IPageNode } from "./parsepages";
import { ISectionNode } from "./parsesections";
import { SectionParseNode_LIST } from "./parsesections";
import { ISentenceNode, SentenceNode } from "./parsesentences";
export class SectionParseNode_PARAGRAPH extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating paragraph section");
  }
  type = SectionVariantEnumType.paragraph;
  meta: ISectionParagraphVariant = ISectionParagraphVariantInitializer();
  parse() {
    //this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `current record is undefined`);
      assert(
        current.tagType === MarkdownTagType.PARAGRAPH,
        `expected ${MarkdownTagType.PARAGRAPH} at line ${current.lineNo}`
      );
      this.firstTermIdx = this.userContext.terminals.lastIdx + 1;
      for (
        current = this.dataSource.nextRecord();
        !this.dataSource.EOF() &&
        current.tagType !== MarkdownTagType.PARAGRAPH_END;
        current = this.dataSource.nextRecord()
      ) {
        assert(
          current.tagType === MarkdownTagType.SENTENCE,
          `encountered ${current.tagType} expected ${MarkdownTagType.SENTENCE} at line ${current.lineNo}`
        );
        let sentence: ISentenceNode = new SentenceNode(this);
        this.meta.sentences.push(sentence);
        sentence.parse();
        current = this.dataSource.currentRecord(); // update current within this scope
      }
      assert(
        current.tagType === MarkdownTagType.PARAGRAPH_END,
        `expected ${MarkdownTagType.PARAGRAPH_END} to ${MarkdownTagType.PARAGRAPH}`
      );
      if (current.tagType === MarkdownTagType.PARAGRAPH_END) {
        this.lastTermIdx = this.userContext.terminals.lastIdx;
        this.id =
          this.userContext.sections.push(
            ISectionListItemInitializer(
              this.firstTermIdx,
              this.lastTermIdx,
              this.type.toString()
            )
          ) - 1;
        for (let idx = this.firstTermIdx; idx <= this.lastTermIdx; idx++) {
          this.userContext.terminals[idx].sectionIdx = this.id;
        }
        this.dataSource.nextRecord(); // move to next grouping
      }
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(e.message);
      } else {
        throw e;
      }
    }
    return 0;
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    let outputStr: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        outputStr = `${super.serialize(format, label, prefix)}`;
        ///        for (let sentence of this.meta.sentences) {
        for (const [i, sentence] of this.meta.sentences.entries()) {
          let sentenceNode: ISentenceNode = <SentenceNode>sentence;
          outputStr = `${outputStr}${sentenceNode.serialize(
            format,
            label,
            //            prefix + " ".padEnd(2)
            prefix + (i < this.meta.sentences.length - 1 ? "| " : "  ")
          )}`;
        }
        //        outputStr = outputStr.slice(0, -1);
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        outputStr = super.serialize(
          format,
          ParseNodeSerializeTabular(
            this.constructor.name,
            `sentence count=${this.meta.sentences.length}`
          )
        );
        //        if (colWidth0 === undefined) colWidth0 = 2;
        for (let sentence of this.meta.sentences) {
          let sentenceNode: ISentenceNode = <SentenceNode>sentence;
          outputStr =
            outputStr +
            sentenceNode.serialize(
              format,
              sentence.constructor.name,
              sentence.content
            );
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        break;
      }
      case ParseNodeSerializeFormatEnumType.JSON:
      default: {
        outputStr = JSON.stringify(this);
        break;
      }
    }
    return outputStr;
  }
}
