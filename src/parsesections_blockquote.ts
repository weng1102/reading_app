/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_blockquote.ts
 *
 * Create section blockquote objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { IsError } from "./utilities";
import { ParseNodeSerializeFormatEnumType } from "./baseclasses";
import { MarkdownTagType, TaggedStringType } from "./dataadapter";
import {
  ISectionBlockquoteVariant,
  ISectionBlockquoteVariantInitializer,
  SectionVariantEnumType
} from "./pageContentType";
import { IPageNode } from "./parsepages";
// import { ISentenceNode, SentenceNode } from "./parsesentences";
import { ISectionNode, SectionParseNode_LIST } from "./parsesections";
import { SectionParseNode_PARAGRAPH } from "./parsesections_paragraph";
export class SectionParseNode_BLOCKQUOTE extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating blockquote section");
  }
  readonly type = SectionVariantEnumType.blockquote;
  meta: ISectionBlockquoteVariant = ISectionBlockquoteVariantInitializer();
  parse() {
    //    this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(
        current !== undefined,
        `current record is undefined at buffer index ${this.dataSource.currentIdx()}`
      );
      assert(
        current.tagType === MarkdownTagType.BLOCKQUOTE,
        `expected ${MarkdownTagType.BLOCKQUOTE}  at line ${current.lineNo}`
      );
      for (
        current = this.dataSource.nextRecord();
        !this.dataSource.EOF() &&
        current.tagType !== MarkdownTagType.SECTION_END; // end of blockquote
      ) {
        assert(
          current.tagType === MarkdownTagType.PARAGRAPH,
          `expected ${MarkdownTagType.PARAGRAPH} at line ${current.lineNo}`
        );
        let paragraph: ISectionNode = new SectionParseNode_PARAGRAPH(this);
        paragraph.parse();
        this.items.push(paragraph);
        current = this.dataSource.currentRecord()
      }
      assert(
        current.tagType === MarkdownTagType.SECTION_END,
        `expected ${MarkdownTagType.SECTION_END} to ${MarkdownTagType.BLOCKQUOTE}`
      );
      current = this.dataSource.nextRecord(); // move passed SECTION_END

    } catch (e) {
      // forward record to next SECTION_END
      if (IsError(e)) {
        this.logger.error(e.message);
        if (this.logger.verboseMode) console.log(e.stack);
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
    label = "blockquote";
    return super.serialize(format, label, prefix);
  }
  transform() {
    return 0;
  }
}