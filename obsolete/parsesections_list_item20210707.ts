import { strict as assert } from "assert";
import {
  BaseClass,
  IParseNode,
  ParseNode,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import {
  // IDataSource,
  MarkdownSectionTagType,
  MarkdownRecordType,
  // BasicMarkdownSource,
  // RawMarkdownSource,
  TaggedStringType,
  MarkdownEndTagType
} from "./dataadapter";
import {
  IPageContent,
  ISectionContent,
  ISectionBlockquoteVariant,
  ISectionBlockquoteVariantInitializer,
  ISectionEmptyVariant,
  ISectionEmptyVariantInitializer,
  ISectionFillinVariant,
  ISectionFillinVariantInitializer,
  ISectionHeadingVariant,
  ISectionHeadingVariantInitializer,
  ISectionItemListVariant,
  ISectionItemListVariantInitializer,
  ISectionOrderedListVariant,
  ISectionOrderedListVariantInitializer,
  ISectionUnorderedListVariant,
  ISectionUnorderedListVariantInitializer,
  ISectionParagraphVariant,
  ISectionParagraphVariantInitializer,
  ISentenceContent,
  ITerminalContent,
  ListTypeEnumType,
  TerminalMetaType,
  TerminalMetaEnumType,
  OrderedListTypeEnumType,
  PageFormatEnumType,
  SectionVariantEnumType,
  SectionVariantType,
  UnorderedListMarkerEnumType,
  IWordTerminalMeta,
  IWordTerminalMetaInitializer
} from "./pageContentType";
import { IPageNode } from "./parsepages";
import { ISentenceNode, SentenceNode } from "./parsesentences";
import {
  SectionParseNode,
  ISectionNode,
  SectionParseNode_LIST
} from "./parsesections";
import { SectionParseNode_PARAGRAPH } from "./parsesections_paragraph";

export class SectionParseNode_LIST_ITEMS extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating ordered list section");
  }
  readonly type = SectionVariantEnumType.itemlist;
  meta: ISectionItemListVariant = ISectionItemListVariantInitializer();
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
    try {
      this.logger.diagnostic(
        `${this.constructor.name} at depth=${this.meta.depth}`
      );
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `current record is undefined`);
      assert(
        current.tagType === MarkdownRecordType.SECTION_ORDERED ||
          current.tagType === MarkdownRecordType.SECTION_UNORDERED,
        `expected ${MarkdownRecordType.SECTION_ORDERED} or ${MarkdownRecordType.SECTION_UNORDERED} at line ${current.lineNo}`
      );
      // if (current.tagType === MarkdownRecordType.SECTION_UNORDERED) {
      //   this.meta.listType = ListTypeEnumType.bulleted;
      // } else {
      //   this.meta.listType = ListTypeEnumType.numerical;
      // }
      // for each record expect either listItem or deeper subsection (i.e., ordered or unordered)
      // or corresponding section end, otherwise error.
      let previous: TaggedStringType = current;
      let depth = current.depth;
      this.logger.diagnostic(
        `exiting1 list_unorder() via ${current.tagType} depth=${current.depth}`
      );
      current = this.dataSource.nextRecord();
      this.logger.diagnostic(
        `exiting2 list_unorder() via ${current.tagType} depth=${current.depth}`
      );
      current = this.dataSource.previousRecord();
      assert(
        current.tagType === MarkdownRecordType.SECTION_END,
        `expected ${MarkdownRecordType.SECTION_END} but encountered ${current.tagType}
       at line ${current.lineNo}`
      );
      current = this.dataSource.nextRecord();
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
export class SectionParseNode_LIST_ORDERED extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating ordered list section");
  }
  readonly type = SectionVariantEnumType.ordered_list;
  meta: ISectionOrderedListVariant = ISectionOrderedListVariantInitializer();
  parse() {
    this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `current record is undefined`);
      assert(
        current.tagType === MarkdownRecordType.SECTION_UNORDERED,
        `expected ${MarkdownRecordType.SECTION_UNORDERED} at line ${current.lineNo}`
      );
      // for each record expect either listItem or deeper subsection (i.e., ordered or unordered)
      // or corresponding section end, otherwise error.
      let previous: TaggedStringType = current;
      current = this.dataSource.nextRecord();
      assert(
        current.tagType === MarkdownRecordType.LISTITEM_UNORDERED ||
          (current.tagType === MarkdownRecordType.SECTION_UNORDERED &&
            current.depth === previous.depth + 1) ||
          (current.tagType === MarkdownRecordType.SECTION_ORDERED &&
            current.depth === previous.depth + 1) ||
          (current.tagType === MarkdownRecordType.SECTION_END &&
            current.depth === previous.depth),
        `unexpected ${current.tagType} at line ${current.lineNo}`
      );
      for (
        ;
        !this.dataSource.EOF() &&
        current.tagType !== MarkdownRecordType.SECTION_END;
        current = this.dataSource.nextRecord()
      ) {
        this.logger.diagnostic(`switch(): ${current.tagType}`);
        switch (current.tagType) {
          case MarkdownRecordType.LISTITEM_UNORDERED: {
            current = this.dataSource.nextRecord();
            assert(
              current.tagType === MarkdownRecordType.PARAGRAPH,
              `expected ${MarkdownRecordType.PARAGRAPH} but encountered ${current.tagType}
             at line ${current.lineNo}`
            );
            let paragraph = new SectionParseNode_PARAGRAPH(this);
            paragraph.parse();
            this.meta.items.push(paragraph);
            current = this.dataSource.nextRecord();
            assert(
              current.tagType === MarkdownRecordType.LISTITEM_END,
              `expected ${MarkdownRecordType.LISTITEM_END} but encountered ${current.tagType}
             at line ${current.lineNo}`
            );
            break;
          }
          case MarkdownRecordType.SECTION_ORDERED: {
            assert(
              current.depth === previous.depth + 1,
              `expected depth of ${previous.depth + 1} encountered depth of ${
                current.depth
              }`
            );
            let section = new SectionParseNode_LIST_ORDERED(this);
            section.parse();
            this.meta.items.push(section);
            current = this.dataSource.nextRecord();
            // assert(
            //   current.tagType === MarkdownRecordType.SECTION_END,
            //   `expected ${MarkdownRecordType.LISTITEM_END} but encountered ${current.tagType}
            //    at line ${current.lineNo}`
            // );
            break;
          }
          case MarkdownRecordType.SECTION_UNORDERED: {
            assert(
              current.depth === previous.depth + 1,
              `expected depth of ${previous.depth + 1} encountered depth of ${
                current.depth
              }`
            );
            let section = new SectionParseNode_LIST_UNORDERED(this);
            section.parse();
            this.items.push(section);
            current = this.dataSource.nextRecord();
            break;
          }
          default:
            assert(
              //            current.tagType === MarkdownRecordType.SECTION_END,
              `expected ${MarkdownRecordType.SECTION_END} but encountered ${current.tagType}
           at line ${current.lineNo}`
            );
            break;
        }
        assert(
          current.tagType === MarkdownRecordType.SECTION_END,
          `expected ${MarkdownRecordType.SECTION_END} but encountered ${current.tagType}
         at line ${current.lineNo}`
        );
        current = this.dataSource.nextRecord();
      }
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
        if (label === undefined) label = "";
        if (prefix === undefined) prefix = "+-";
        if (colWidth0 === undefined) colWidth0 = 2;
        if (colWidth1 === undefined) colWidth1 = 15;
        if (colWidth2 === undefined) colWidth2 = 12;
        if (colWidth3 === undefined) colWidth3 = 25;
        if (colWidth4 === undefined) colWidth4 = 50;
        outputStr = `${prefix}list (ordered):\n`;
        for (let item of this.meta.items) {
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
export class SectionParseNode_LIST_UNORDERED extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
  readonly type = SectionVariantEnumType.unordered_list;
  meta: ISectionUnorderedListVariant = ISectionUnorderedListVariantInitializer();
  parse() {
    // parses a single depth and is innvoked recursively to parse successively deeper
    this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `current record is undefined`);
      assert(
        current.tagType === MarkdownRecordType.SECTION_UNORDERED,
        `expected ${MarkdownRecordType.SECTION_UNORDERED} at line ${current.lineNo}`
      );
      this.logger.diagnostic(
        `${this.constructor.name} at depth=${this.meta.depth}`
      );
      // for each record expect either listItem or deeper subsection (i.e., ordered or unordered)
      // or corresponding section end, otherwise error.
      let previous: TaggedStringType = current;
      current = this.dataSource.nextRecord();
      assert(
        current.tagType === MarkdownRecordType.LISTITEM_UNORDERED ||
          (current.tagType === MarkdownRecordType.SECTION_UNORDERED &&
            current.depth === previous.depth + 1) ||
          (current.tagType === MarkdownRecordType.SECTION_ORDERED &&
            current.depth === previous.depth + 1) ||
          (current.tagType === MarkdownRecordType.SECTION_END &&
            current.depth === previous.depth),
        `unexpected ${current.tagType} at line ${current.lineNo}`
      );
      for (
        ;
        !this.dataSource.EOF() &&
        current.tagType !== MarkdownRecordType.SECTION_END; //&& current.depth === previous.depth;
        current = this.dataSource.nextRecord()
      ) {
        this.logger.diagnostic(`switch(): ${current.tagType}`);
        switch (current.tagType) {
          case MarkdownRecordType.LISTITEM_UNORDERED: {
            current = this.dataSource.nextRecord();
            assert(
              current.tagType === MarkdownRecordType.PARAGRAPH,
              `expected ${MarkdownRecordType.PARAGRAPH} but encountered ${current.tagType}
             at line ${current.lineNo}`
            );
            let paragraph = new SectionParseNode_PARAGRAPH(this);
            paragraph.parse();
            this.items.push(paragraph);
            current = this.dataSource.nextRecord();
            this.logger.diagnostic(`after paragraph: ${current.tagType}`);
            assert(
              current.tagType === MarkdownRecordType.LISTITEM_END,
              `expected ${MarkdownRecordType.LISTITEM_END} but encountered ${current.tagType}
             at line ${current.lineNo}`
            );
            //  current = this.dataSource.nextRecord();
            //  this.logger.diagnostic(`after listItem: ${current.tagType}`);
            break;
          }
          case MarkdownRecordType.SECTION_ORDERED: {
            assert(
              current.depth === previous.depth + 1,
              `expected depth of ${previous.depth + 1} encountered depth of ${
                current.depth
              }`
            );
            let section = new SectionParseNode_LIST_ORDERED(this);
            section.parse();
            this.items.push(section);
            current = this.dataSource.nextRecord();
            // assert(
            //   current.tagType === MarkdownRecordType.SECTION_END,
            //   `expected ${MarkdownRecordType.LISTITEM_END} but encountered ${current.tagType}
            //    at line ${current.lineNo}`
            // );
            break;
          }
          case MarkdownRecordType.SECTION_UNORDERED: {
            assert(
              current.depth === previous.depth + 1,
              `expected depth of ${previous.depth + 1} encountered depth of ${
                current.depth
              }`
            );
            let section = new SectionParseNode_LIST_UNORDERED(this);
            section.parse();
            this.items.push(section);
            current = this.dataSource.nextRecord();
            break;
          }
          default:
            assert(
              //            current.tagType === MarkdownRecordType.SECTION_END,
              `expected ${MarkdownRecordType.SECTION_END} but encountered ${current.tagType}
           at line ${current.lineNo}`
            );
            break;
        }
        this.logger.diagnostic(
          `next iteration with tagType=${current.tagType} depth=${current.depth} at lineNo=${current.lineNo}`
        );
      }
      this.logger.diagnostic(
        `exiting1 list_unorder() via ${current.tagType} depth=${current.depth}`
      );
      current = this.dataSource.nextRecord();
      this.logger.diagnostic(
        `exiting2 list_unorder() via ${current.tagType} depth=${current.depth}`
      );
      current = this.dataSource.previousRecord();
      assert(
        current.tagType === MarkdownRecordType.SECTION_END,
        `expected ${MarkdownRecordType.SECTION_END} but encountered ${current.tagType}
       at line ${current.lineNo}`
      );
      current = this.dataSource.nextRecord();
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
        if (label === undefined) label = "";
        if (prefix === undefined) prefix = "+-";
        if (colWidth0 === undefined) colWidth0 = 2;
        if (colWidth1 === undefined) colWidth1 = 15;
        if (colWidth2 === undefined) colWidth2 = 12;
        if (colWidth3 === undefined) colWidth3 = 25;
        if (colWidth4 === undefined) colWidth4 = 50;
        outputStr = `${prefix}list (unordered):\n`;
        for (let item of this.meta.items) {
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
