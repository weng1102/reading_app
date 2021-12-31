/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_images.ts
 *
 * Create section image entry objects from serialized input.
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
  ISectionImageEntryVariantInitializer,
  ISectionImageEntryVariant,
  ISectionParagraphVariant,
  ISectionParagraphVariantInitializer,
  ITerminalContent,
  SectionVariantEnumType,
  TerminalMetaEnumType
} from "./pageContentType";
import { GetSectionNode } from "./parsesectiondispatch";
import { ITerminalNode } from "./parseterminals";
import { IPageNode } from "./parsepages";
import { ISectionNode } from "./parsesections";
import { SectionParseNode_LIST } from "./parsesections";
import { ISentenceNode, SentenceNode } from "./parsesentences";
export class SectionParseNode_IMAGEENTRY extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating paragraph section");
  }
  type = SectionVariantEnumType.image_entry;
  meta: ISectionImageEntryVariant = ISectionImageEntryVariantInitializer();
  parse() {
    //this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `current record is undefined`);

      assert(
        current.tagType === MarkdownTagType.IMAGEENTRY,
        `expected ${MarkdownTagType.IMAGEENTRY} at line ${current.lineNo}`
      );
      current = this.dataSource.nextRecord();
      assert(
        current.tagType === MarkdownTagType.PARAGRAPH,
        `encountered ${current.tagType} expected ${MarkdownTagType.PARAGRAPH} at line ${current.lineNo}`
      );
      current = this.dataSource.nextRecord();
      assert(
        current.tagType === MarkdownTagType.SENTENCE,
        `encountered ${current.tagType} expected ${MarkdownTagType.SENTENCE} at line ${current.lineNo}`
      );
      // find list of images
      this.firstTermIdx = this.userContext.terminals.lastIdx + 1;
      let sentence: ISentenceNode = new SentenceNode(this);
      sentence.parse();
      for (const terminal of sentence.terminals) {
        if (terminal.type === TerminalMetaEnumType.image) {
          this.meta.images.push(terminal);
        }
      }
      assert(
        this.meta.images.length > 0,
        `expected image declaraction(s) immediately following ${MarkdownTagType.IMAGEENTRY} at line ${current.lineNo}`
      );
      current = this.dataSource.nextRecord();
      assert(
        current.tagType === MarkdownTagType.PARAGRAPH_END,
        `expected ${MarkdownTagType.PARAGRAPH_END} to ${MarkdownTagType.PARAGRAPH}`
      );
      //keep processing sections until imageentry_end
      for (
        current = this.dataSource.nextRecord();
        !this.dataSource.EOF() &&
        current.tagType !== MarkdownTagType.IMAGEENTRY_END;
        //        current = this.dataSource.nextRecord()
        current = this.dataSource.currentRecord()
      ) {
        let sectionNode: ISectionNode = GetSectionNode(current.tagType, this);
        this.meta.captions.push(sectionNode);
        this.logger.diagnostic(
          `pushed section=${current.tagType} ${sectionNode.constructor.name} ${current.content}`
        );
        sectionNode.parse();
        //        current = this.dataSource.currentRecord();
      }
      if (current.tagType === MarkdownTagType.IMAGEENTRY_END) {
        this.lastTermIdx = this.userContext.terminals.lastIdx;
        // this.id =
        //   this.userContext.sections.push(
        //     ISectionImageEntryInitializer(
        //       this.firstTermIdx,
        //       this.lastTermIdx,
        //       this.type.toString()
        //     )
        //   ) - 1;
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
        for (const [i, image] of this.meta.images.entries()) {
          outputStr = `${outputStr}${super.serialize(
            format,
            `image: ${image.content}`,
            prefix + (i < this.meta.images.length - 1 ? "| " : "  ")
          )}`;
        }
        for (const [i, section] of this.meta.captions.entries()) {
          let sectionNode: ISectionNode = section as ISectionNode;
          outputStr = `${outputStr}${sectionNode.serialize(
            format,
            `captions: (${section.type})`,
            prefix + (i < this.meta.captions.length - 1 ? "| " : "  ")
          )}`;
        }
        //     format,
        //     label,
        //     //            prefix + " ".padEnd(2)
        //     prefix + (i < this.meta.sentences.length - 1 ? "| " : "  ")
        //   )}`;
        // }
        //        outputStr = outputStr.slice(0, -1);
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        outputStr = super.serialize(
          format,
          ParseNodeSerializeTabular(
            this.constructor.name
            // `sentence count=${this.meta.sentences.length}`
          )
        );
        //        if (colWidth0 === undefined) colWidth0 = 2;
        // for (let sentence of this.meta.sentences) {
        //   let sentenceNode: ISentenceNode = <SentenceNode>sentence;
        //   outputStr =
        //     outputStr +
        //     sentenceNode.serialize(
        //       format,
        //       sentence.constructor.name,
        //       sentence.content
        //     );
        // }
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
