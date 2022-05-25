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
import {
  // BaseClass,
  // IParseNode,
  // ParseNode,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import {
  // IDataSource,
  //  MarkdownSectionTagType,
  MarkdownRecordType,
  // BasicMarkdownSource,
  // RawMarkdownSource,
  TaggedStringType
  //  MarkdownEndTagType
} from "./dataadapter";
import {
  // IPageContent,
  // ISectionContent,
  // ISectionBlockquoteVariant,
  // ISectionBlockquoteVariantInitializer,
  // ISectionEmptyVariant,
  // ISectionEmptyVariantInitializer,
  // ISectionFillinVariant,
  // ISectionFillinVariantInitializer,
  // ISectionHeadingVariant,
  // ISectionHeadingVariantInitializer,
  ISectionItemListVariant,
  ISectionItemListVariantInitializer,
  // ISectionOrderedListVariant,
  // ISectionOrderedListVariantInitializer,
  // ISectionUnorderedListVariant,
  // ISectionUnorderedListVariantInitializer,
  // ISectionParagraphVariant,
  // ISectionParagraphVariantInitializer,
  // ISentenceContent,
  // ITerminalContent,
  ListTypeEnumType,
  // TerminalMetaType,
  // TerminalMetaEnumType,
  // OrderedListTypeEnumType,
  // PageFormatEnumType,
  SectionVariantEnumType
  // SectionVariantType,
  // UnorderedListMarkerEnumType,
  // IWordTerminalMeta,
  // IWordTerminalMetaInitializer
} from "./pageContentType";
import { IPageNode } from "./parsepages";
// import { ISentenceNode, SentenceNode } from "./parsesentences";
import {
  // SectionParseNode,
  ISectionNode,
  SectionParseNode_LIST
} from "./parsesections";
// import { SectionParseNode_PARAGRAPH } from "./parsesections_paragraph";
import { GetSectionNode } from "./parsesectiondispatch";

export class SectionParseNode_LIST_ITEMS extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating ordered list section");
  }
  readonly type = SectionVariantEnumType.itemlist;
  meta: ISectionItemListVariant = ISectionItemListVariantInitializer();
  private parseDepth(depth: number) {
    let current: TaggedStringType = this.dataSource.currentRecord();
    this.logger.diagnostic(
      `calling parseDepth(${depth}) at line ${current.lineNo}`
    );
    for (
      current = this.dataSource.currentRecord();
      !this.dataSource.EOF() && current.tagType !== MarkdownRecordType.SECTION_END; //&& current.depth === previous.depth; //      current = this.dataSource.nextRecord()

    ) {
      switch (current.tagType) {
        case MarkdownRecordType.SECTION_ORDERED:
        case MarkdownRecordType.SECTION_UNORDERED: {
          if (current.depth > depth) {
            // deeper SECTION
            let section = GetSectionNode(current.tagType, this);
            this.items.push(section);
            this.logger.diagnostic(
              `pushed section ${current.content} at ${current.lineNo}`
            );
            section.parse();
            // SECTION record defines depth. LISTITEM* defines the actual list items
            // When SECTION is encountered, depth increases. When SECTION_END is
            // encountered the depth of next record decreases
            current = this.dataSource.currentRecord();
            assert(
              current.tagType === MarkdownRecordType.SECTION_END ||
                current.tagType === MarkdownRecordType.LISTITEM_ORDERED ||
                current.tagType === MarkdownRecordType.LISTITEM_UNORDERED,
              `expected ${MarkdownRecordType.SECTION_END}, ${current.tagType ===
                MarkdownRecordType.LISTITEM_ORDERED} or ${current.tagType ===
                MarkdownRecordType.LISTITEM_UNORDERED} but encountered ${
                current.tagType
              } at line ${current.lineNo}`
            );
            // assert(
            //   current.depth === depth,
            //   `expected current depth=${current.depth} but encountered ${depth}`
            // );
            //            current = this.dataSource.nextRecord();
          } else if (current.depth === depth) {
            // current SECTION, goto next record
            current = this.dataSource.nextRecord();
          } else {
            assert(
              `expected ${current.tagType} with depth ${current.depth} greater than or equal to ${depth} at line ${current.lineNo}`
            );
          }
          break;
        }
        case MarkdownRecordType.LISTITEM_UNORDERED:
        case MarkdownRecordType.LISTITEM_ORDERED: {
          assert(
            current.depth === depth,
            `expected depth=${depth} but encountered depth=${current.depth}} at line ${current.lineNo}`
          );
          let listItem = GetSectionNode(current.tagType, this);
          this.items.push(listItem);
          current = this.dataSource.nextRecord();
          assert(
            current.tagType === MarkdownRecordType.PARAGRAPH,
            `expected ${MarkdownRecordType.PARAGRAPH} but encountered ${current.tagType}
            at line ${current.lineNo}`
          );
          let paragraph = GetSectionNode(current.tagType, this);
          //          this.items.push(paragraph);
          listItem.items.push(paragraph);
          this.logger.diagnostic(
            `pushed paragraph ${current.content} at ${current.lineNo}`
          );
          paragraph.parse();
          current = this.dataSource.currentRecord();
          assert(
            current.tagType === MarkdownRecordType.LISTITEM_END,
            `expected ${MarkdownRecordType.LISTITEM_END} but encountered ${current.tagType}
           at line ${current.lineNo}`
          );
          current = this.dataSource.nextRecord(); // move passed LISTITEM_END to either LISTITEM or SECTION
          break;
        }
        default: {
          assert(
            `unexpected type encountered ${current.tagType} at line ${current.lineNo}`
          );
          break;
        }
      }
    }
    if (current.tagType === MarkdownRecordType.SECTION_END)
      this.dataSource.nextRecord();
  }
  parse() {
    // parses a single depth and is innvoked recursively to parse successively deeper
    //this.logger.diagnosticMode = true;
    this.logger.diagnostic(
      `${this.constructor.name} ${
        this.meta.listType === ListTypeEnumType.bulleted
          ? "UNORDERED"
          : "ORDERED"
      }`
    );
    let current = this.dataSource.currentRecord();
    assert(
      current.tagType === MarkdownRecordType.SECTION_ORDERED ||
        current.tagType === MarkdownRecordType.SECTION_UNORDERED,
      `expected ${MarkdownRecordType.SECTION_ORDERED} or ${MarkdownRecordType.SECTION_UNORDERED} but encountered ${current.tagType}
     at line ${current.lineNo}`
    );
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      this.parseDepth(this.dataSource.currentRecord().depth);
    } catch (e) {
      this.logger.error(e.message);
      // forward record to next SECTION_END
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
      case ParseNodeSerializeFormatEnumType.JSON: {
        outputStr = JSON.stringify(this);
        break;
      }
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        label = `list (${
          this.meta.listType === ListTypeEnumType.bulleted
            ? "unordered"
            : "ordered"
        })`;
        outputStr = super.serialize(format, label, prefix);
        prefix = " ".padEnd(2) + prefix;
        for (let item of this.items) {
          label = `${item.name} list item (${item.type})`;
          outputStr = outputStr + item.serialize(format, label, prefix);
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        label = `list (${
          this.meta.listType === ListTypeEnumType.bulleted
            ? "unordered"
            : "ordered"
        })`;
        outputStr = super.serialize(format, label, prefix);
        prefix = " ".padEnd(2) + prefix;
        for (let item of this.items) {
          outputStr = outputStr + `${item.serialize(format, label, prefix)}\n`;
        }
        outputStr = outputStr.slice(0, -1);
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        break;
      }
    }
    return outputStr;
  }
}
export class SectionParseNode_LIST_ITEMS_ORDERED
  extends SectionParseNode_LIST_ITEMS
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    this.meta.listType = ListTypeEnumType.numerical;
    //  console.log("creating ordered list section");
  }
}
export class SectionParseNode_LIST_ITEMS_UNORDERED
  extends SectionParseNode_LIST_ITEMS
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    this.meta.listType = ListTypeEnumType.bulleted;
    //  console.log("creating ordered list section");
  }
}
