/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_list_items.ts
 *
 * Create section list items objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { IsError } from "./utilities";
import { MarkdownRecordType, TaggedStringType } from "./dataadapter";
import {
  ISectionListitemVariant,
  ISectionListitemVariantInitializer,
  ListTypeEnumType,
  SectionVariantEnumType
} from "./pageContentType";
import { IPageNode } from "./parsepages";
import { ISectionNode, SectionParseNode_LIST } from "./parsesections";
import { GetSectionNode } from "./parsesectiondispatch";

abstract class SectionParseNode_SECTION extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating ordered list section");
  }
  meta = ISectionListitemVariantInitializer();
  parse(): number {
    //this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `current record is undefined`);
      assert(
        current.recordType === MarkdownRecordType.SECTION_ORDERED ||
          current.recordType === MarkdownRecordType.SECTION_UNORDERED,
        `expected ${MarkdownRecordType.SECTION_ORDERED} or ${MarkdownRecordType.SECTION_UNORDERED} at line ${current.lineNo}`
      );
      this.meta.depth = current.depth;
      current = this.dataSource.nextRecord();
      for (
        current = this.dataSource.currentRecord();
        !this.dataSource.EOF() &&
        current.recordType !== MarkdownRecordType.SECTION_END; //&& current.depth === previous.depth; //      current = this.dataSource.nextRecord()

      ) {
        switch (current.recordType) {
          case MarkdownRecordType.SECTION_ORDERED:
          case MarkdownRecordType.SECTION_UNORDERED: {
            let subsection = GetSectionNode(current.recordType, this);
            this.items.push(subsection);
            this.logger.diagnostic(
              `pushed list section ${current.content} at ${current.lineNo}`
            );
            subsection.parse();
            break;
          }
          case MarkdownRecordType.LISTITEM_ORDERED:
          case MarkdownRecordType.LISTITEM_UNORDERED: {
            let listItem = GetSectionNode(current.recordType, this);
            this.items.push(listItem);
            this.logger.diagnostic(
              `pushed list item ${current.content} at ${current.lineNo}`
            );
            listItem.parse();
            break;
          }
          default: {
            assert(`unexpected markdown tag ${current.recordType} encountered`);
          }
        }
        current = this.dataSource.currentRecord(); // update current within this scope
      }
      assert(
        current.recordType === MarkdownRecordType.SECTION_END,
        `expected ${MarkdownRecordType.SECTION_END} at line ${current.lineNo}`
      );
      if (current.recordType === MarkdownRecordType.SECTION_END)
        this.dataSource.nextRecord();
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(e.message);
      } else {
        throw e;
      }
    } finally {
      return 0;
    }
  }
}
export class SectionParseNode_SECTION_ORDERED extends SectionParseNode_SECTION
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating ordered list section");
  }
  readonly type = SectionVariantEnumType.ordered_list;
  meta = ISectionListitemVariantInitializer();
}
export class SectionParseNode_SECTION_UNORDERED extends SectionParseNode_SECTION
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
  readonly type = SectionVariantEnumType.unordered_list;
  meta = ISectionListitemVariantInitializer();
}
abstract class SectionParseNode_LISTITEM extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
  readonly type = SectionVariantEnumType.listitem;
  meta: ISectionListitemVariant = ISectionListitemVariantInitializer();
  parse() {
    //this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `current record is undefined`);
      assert(
        current.recordType === MarkdownRecordType.LISTITEM_ORDERED ||
          current.recordType === MarkdownRecordType.LISTITEM_UNORDERED,
        `expected ${MarkdownRecordType.LISTITEM_ORDERED} or ${MarkdownRecordType.LISTITEM_UNORDERED} at line ${current.lineNo}`
      );
      for (
        current = this.dataSource.nextRecord();
        !this.dataSource.EOF() &&
        current.recordType !== MarkdownRecordType.LISTITEM_END; //      current = this.dataSource.nextRecord()

      ) {
        assert(
          current.recordType === MarkdownRecordType.SECTION_ORDERED ||
            current.recordType === MarkdownRecordType.SECTION_UNORDERED ||
            current.recordType === MarkdownRecordType.PARAGRAPH ||
            `expected ${MarkdownRecordType.PARAGRAPH},  ${MarkdownRecordType.SECTION_ORDERED} or ${MarkdownRecordType.SECTION_UNORDERED} but encountered ${current.recordType}`
        );

        switch (current.recordType) {
          case MarkdownRecordType.PARAGRAPH: {
            let paragraph: ISectionNode = GetSectionNode(
              current.recordType,
              this
            );
            this.items.push(paragraph);
            this.logger.diagnostic(
              `pushed paragraph ${current.content} at ${current.lineNo}`
            );
            paragraph.parse();
            break;
          }
          case MarkdownRecordType.SECTION_ORDERED:
          case MarkdownRecordType.SECTION_UNORDERED: {
            let section: ISectionNode = GetSectionNode(
              current.recordType,
              this
            );
            this.items.push(section);
            this.logger.diagnostic(
              `pushed list subsection ${current.content} at ${current.lineNo}`
            );
            section.parse();
            break;
          }
          default: {
            assert(`unexpected markdown tag ${current.recordType} encountered`);
          }
        }
        current = this.dataSource.currentRecord(); // update current within this scope
      }
      if (current.recordType === MarkdownRecordType.LISTITEM_END) {
        this.dataSource.nextRecord(); // move passed LISTITEM_END
      }
    } catch (e) {
    } finally {
      return 0;
    }
  }
}
export class SectionParseNode_LISTITEM_ORDERED extends SectionParseNode_LISTITEM
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    // default but can be inferred from capture group TBD
    this.meta.listType = ListTypeEnumType.numerical;
  }
}
export class SectionParseNode_LISTITEM_UNORDERED
  extends SectionParseNode_LISTITEM
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    // default but can be inferred from capture group TBD
    this.meta.listType = ListTypeEnumType.bulleted;
  }
}
