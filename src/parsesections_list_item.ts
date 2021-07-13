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
  MarkdownTagType,
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
      !this.dataSource.EOF() && current.tagType !== MarkdownTagType.SECTION_END; //&& current.depth === previous.depth; //      current = this.dataSource.nextRecord()

    ) {
      switch (current.tagType) {
        case MarkdownTagType.SECTION_ORDERED:
        case MarkdownTagType.SECTION_UNORDERED: {
          if (current.depth > depth) {
            // deeper SECTION
            let section = GetSectionNode(current.tagType, this);
            this.items.push(section);
            this.logger.diagnostic(
              `pushed section ${current.content} at ${current.lineNo}`
            );
            section.parse();
            current = this.dataSource.currentRecord();
            assert(
              current.tagType === MarkdownTagType.SECTION_END ||
                current.tagType === MarkdownTagType.LISTITEM_ORDERED ||
                current.tagType === MarkdownTagType.LISTITEM_UNORDERED,
              `expected ${MarkdownTagType.SECTION_END}, ${current.tagType ===
                MarkdownTagType.LISTITEM_ORDERED} or ${current.tagType ===
                MarkdownTagType.LISTITEM_UNORDERED} but encountered ${
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
        case MarkdownTagType.LISTITEM_UNORDERED:
        case MarkdownTagType.LISTITEM_ORDERED: {
          assert(
            current.depth === depth,
            `expected depth=${depth} but encountered depth=${current.depth}} at line ${current.lineNo}`
          );
          current = this.dataSource.nextRecord();
          assert(
            current.tagType === MarkdownTagType.PARAGRAPH,
            `expected ${MarkdownTagType.PARAGRAPH} but encountered ${current.tagType}
            at line ${current.lineNo}`
          );
          let paragraph = GetSectionNode(current.tagType, this);
          this.items.push(paragraph);
          this.logger.diagnostic(
            `pushed paragraph ${current.content} at ${current.lineNo}`
          );
          paragraph.parse();
          current = this.dataSource.currentRecord();
          assert(
            current.tagType === MarkdownTagType.LISTITEM_END,
            `expected ${MarkdownTagType.LISTITEM_END} but encountered ${current.tagType}
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
    if (current.tagType === MarkdownTagType.SECTION_END)
      this.dataSource.nextRecord();
  }
  parse() {
    // parses a single depth and is innvoked recursively to parse successively deeper
    this.logger.diagnosticMode = true;
    this.logger.diagnostic(
      `${this.constructor.name} ${
        this.meta.listType === ListTypeEnumType.bulleted
          ? "UNORDERED"
          : "ORDERED"
      }`
    );
    let current = this.dataSource.currentRecord();
    assert(
      current.tagType === MarkdownTagType.SECTION_ORDERED ||
        current.tagType === MarkdownTagType.SECTION_UNORDERED,
      `expected ${MarkdownTagType.SECTION_ORDERED} or ${MarkdownTagType.SECTION_UNORDERED} but encountered ${current.tagType}
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
    prefix?: string,
    colWidth0?: number,
    colWidth1?: number,
    colWidth2?: number,
    colWidth3?: number,
    colWidth4?: number
  ): string {
    let outputStr: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.JSON: {
        outputStr = JSON.stringify(this);
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        label = "list";
        if (label === undefined) label = "";
        if (prefix === undefined) prefix = "+-";
        if (colWidth0 === undefined) colWidth0 = 2;
        if (colWidth1 === undefined) colWidth1 = 15;
        if (colWidth2 === undefined) colWidth2 = 12;
        if (colWidth3 === undefined) colWidth3 = 25;
        if (colWidth4 === undefined) colWidth4 = 50;
        outputStr = `${prefix}${label} (${
          this.meta.listType === ListTypeEnumType.bulleted
            ? "unordered"
            : "ordered"
        }):\n`;
        for (let item of this.items) {
          outputStr =
            outputStr +
            `${item.serialize(
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
