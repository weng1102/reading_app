/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
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
  ISectionParagraphVariant,
  ISectionListitemVariant,
  ISectionOrderedListVariant,
  ISectionUnorderedListVariant,
  ISectionOrderedListVariantInitializer,
  ISectionUnorderedListVariantInitializer,
  ISectionListitemVariantInitializer,
  AutodNumberedOrderedListTypeEnumType,
  SectionVariantEnumType,
  UnorderedListMarkerEnumType
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
      for (
        current = this.dataSource.currentRecord();
        !this.dataSource.EOF() &&
        current.recordType !== MarkdownRecordType.SECTION_END; //&& current.depth === previous.depth; //      current = this.dataSource.nextRecord()

      ) {
        switch (current.recordType) {
          case MarkdownRecordType.SECTION_ORDERED:
            let subsection = GetSectionNode(
              current.recordType,
              this
            ) as SectionParseNode_SECTION_ORDERED;
            this.items.push(subsection);
            this.logger.diagnostic(
              `pushed ordered list section ${current.content} at ${current.lineNo}`
            );
            subsection.parse();
            break;
          case MarkdownRecordType.SECTION_UNORDERED: {
            let subsection = GetSectionNode(
              current.recordType,
              this
            ) as SectionParseNode_SECTION_UNORDERED;
            // let meta: ISectionUnorderedListVariant = subsection.meta as ISectionUnorderedListVariant;
            this.items.push(subsection);
            this.logger.diagnostic(
              `pushed unordered list section ${current.content} at ${current.lineNo}`
            );
            subsection.parse();
            break;
          }
          case MarkdownRecordType.LISTITEM_ORDERED:
            let listItem = GetSectionNode(
              current.recordType,
              this
            ) as SectionParseNode_LISTITEM_ORDERED;
            this.items.push(listItem);
            this.logger.diagnostic(
              `pushed ordered list item ${current.content} at ${current.lineNo}`
            );
            listItem.parse();
            break;

          case MarkdownRecordType.LISTITEM_UNORDERED: {
            let listItem = GetSectionNode(
              current.recordType,
              this
            ) as SectionParseNode_LISTITEM_UNORDERED;
            this.items.push(listItem);
            this.logger.diagnostic(
              `pushed unordered list item ${current.content} at ${current.lineNo}`
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
      if (current.recordType === MarkdownRecordType.SECTION_END) {
        this.dataSource.nextRecord();
      }
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
  meta = ISectionOrderedListVariantInitializer();
  parse(): number {
    assert(this.dataSource !== undefined, `dataSource is undefined`);
    let current: TaggedStringType = this.dataSource.currentRecord();
    assert(current !== undefined, `current record is undefined`);
    assert(
      current.recordType === MarkdownRecordType.SECTION_ORDERED,
      `expected ${MarkdownRecordType.SECTION_ORDERED} at line ${current.lineNo}`
    );
    const alphaVal = (c: string) => c.toLowerCase().charCodeAt(0) - 97 + 1;
    const numberVal = (c: string) => (isNaN(parseInt(c)) ? 1 : parseInt(c));
    //
    // list (flat) 1.,2.,3. ^[0-9]+\.\s
    // numerical 1., 2.1,3.2.1 ^[0-9]\_[0-9]\.\s
    // alphabetical A., B. ^[AZ]\\.\s
    // alphaNumerical A., A1., A2.1.2 ^[A-Z]\.\s
    // outline I., A, 1., a. ^(IA1)\.\s
    // numericAlpha 1., 1a., 2b.1.1 ^(1a)\.\s
    // scenario A1. A.,A1,A1.1 ^[A-Z][1.9]\.\s
    // multiple choice 1. a,b,c, [1-9][az]\.
    const scenarioAutoNumberedPattern = new RegExp(/^[A-Z][1-9]\.$/);
    const multipleChoiceAutoNumberedPattern = new RegExp(/^[1-9][a-z]\.$/);
    const numberedListAutoNumberedPattern = new RegExp(/^[1-9]\.$/);
    const numericalHierarchyAutoNumberedPattern = new RegExp(/^[1-9]_[1-9]\.$/);
    const outlineHierarchyAutoNumberedPattern = new RegExp(/^[I][A-Z][1-9]\.$/);
    // super.parse();
    this.meta.depth = current.listDepth;
    // console.log(
    //   `SectionParseNode_SECTION_ORDERED: tag=${current.autoNumberedTag} content="${current.content}"`
    // );
    let tag: string = current.autoNumberedTag.trim();
    if (numberedListAutoNumberedPattern.test(tag)) {
      this.meta.orderedListType =
        AutodNumberedOrderedListTypeEnumType.numberedList;
      this.meta.startNumber = numberVal(tag[0]) - 1;
    } else if (multipleChoiceAutoNumberedPattern.test(tag)) {
      this.meta.orderedListType =
        AutodNumberedOrderedListTypeEnumType.multipleChoice;
      this.meta.startNumber = numberVal(tag[0]) - 1;
    } else if (scenarioAutoNumberedPattern.test(tag)) {
      this.meta.orderedListType = AutodNumberedOrderedListTypeEnumType.scenario;
      this.meta.startNumber = alphaVal(tag[0]) - 1;
    } else if (outlineHierarchyAutoNumberedPattern.test(tag)) {
      this.meta.orderedListType = AutodNumberedOrderedListTypeEnumType.outline;
    } else if (numericalHierarchyAutoNumberedPattern.test(tag)) {
      this.meta.orderedListType =
        AutodNumberedOrderedListTypeEnumType.numerical;
      this.meta.startNumber = numberVal(tag[0]) - 1;
    } else {
      this.logger.warning(
        `autonumbered tag= ${current.autoNumberedTag} is invalid, defaulting to numbered list`
      );
    }
    for (
      current = this.dataSource.nextRecord();
      !this.dataSource.EOF() &&
      current.recordType !== MarkdownRecordType.SECTION_END; //&& current.depth === previous.depth; //      current = this.dataSource.nextRecord()

    ) {
      assert(
        current.recordType === MarkdownRecordType.SECTION_ORDERED ||
          current.recordType === MarkdownRecordType.SECTION_UNORDERED ||
          current.recordType === MarkdownRecordType.LISTITEM_ORDERED,
        `expected ${MarkdownRecordType.SECTION_ORDERED}, ${MarkdownRecordType.SECTION_UNORDERED} or ${MarkdownRecordType.LISTITEM_ORDERED} at line ${current.lineNo}`
      );
      let subsection: SectionParseNode_SECTION_ORDERED = GetSectionNode(
        current.recordType,
        this
      ) as SectionParseNode_SECTION_ORDERED;
      // let subsection: SectionParseNode_SECTION_ORDERED = GetSectionNode(
      //   current.recordType,
      //   this
      // );
      // let meta: ISectionOrderedListVariant = subsection.meta as ISectionOrderedListVariant;
      // meta.orderedListType
      this.items.push(subsection);
      subsection.parse();
      current = this.dataSource.currentRecord(); // update current within
    }
    if (current.recordType === MarkdownRecordType.SECTION_END) {
      this.dataSource.nextRecord(); // move passed LISTITEM_END
    }
    return 0;
  }
  //   console.log(`SectionParseNode_SECTION_ORDERED::parse()`);
  //   return super.parse();
  //   // return 0;
  // }
}
export class SectionParseNode_SECTION_UNORDERED extends SectionParseNode_SECTION
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
  readonly type = SectionVariantEnumType.unordered_list;
  meta = ISectionUnorderedListVariantInitializer();
  parse(): number {
    let current: TaggedStringType = this.dataSource.currentRecord();
    assert(current !== undefined, `current record is undefined`);
    assert(
      current.recordType === MarkdownRecordType.SECTION_UNORDERED,
      `expected ${MarkdownRecordType.SECTION_UNORDERED} at line ${current.lineNo}`
    );
    this.meta.depth = current.listDepth;
    this.meta.marker = UnorderedListMarkerEnumType.disc;
    for (
      current = this.dataSource.nextRecord();
      !this.dataSource.EOF() &&
      current.recordType !== MarkdownRecordType.SECTION_END; //&& current.depth === previous.depth; //      current = this.dataSource.nextRecord()

    ) {
      assert(
        current.recordType === MarkdownRecordType.SECTION_ORDERED ||
          current.recordType === MarkdownRecordType.SECTION_UNORDERED ||
          current.recordType === MarkdownRecordType.LISTITEM_UNORDERED,
        `expected ${MarkdownRecordType.SECTION_ORDERED}, ${MarkdownRecordType.SECTION_UNORDERED} or ${MarkdownRecordType.LISTITEM_UNORDERED} at line ${current.lineNo}`
      );
      let subsection = GetSectionNode(current.recordType, this);
      this.items.push(subsection);
      subsection.parse();
      current = this.dataSource.currentRecord(); // update current within
    }
    if (current.recordType === MarkdownRecordType.SECTION_END) {
      this.dataSource.nextRecord(); // move passed SECTION_END
    }
    return 0;
  }
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
          current.recordType === MarkdownRecordType.LISTITEM_UNORDERED ||
          current.recordType === MarkdownRecordType.SECTION_ORDERED ||
          current.recordType === MarkdownRecordType.SECTION_UNORDERED ||
          `expected ${MarkdownRecordType.LISTITEM_ORDERED},  ${MarkdownRecordType.LISTITEM_UNORDERED}, ${MarkdownRecordType.SECTION_ORDERED}, or ${MarkdownRecordType.SECTION_UNORDERED} at line ${current.lineNo}`
      );
      for (
        current = this.dataSource.nextRecord();
        !this.dataSource.EOF() &&
        current.recordType !== MarkdownRecordType.LISTITEM_END; //      current = this.dataSource.nextRecord()

      ) {
        // assert(
        //   current.recordType === MarkdownRecordType.SECTION_ORDERED ||
        //     current.recordType === MarkdownRecordType.SECTION_UNORDERED ||
        //     current.recordType === MarkdownRecordType.PARAGRAPH ||
        //     `expected ${MarkdownRecordType.PARAGRAPH},  ${MarkdownRecordType.SECTION_ORDERED} or ${MarkdownRecordType.SECTION_UNORDERED} but encountered ${current.recordType}`
        // );

        switch (current.recordType) {
          case MarkdownRecordType.PARAGRAPH: {
            let paragraph: ISectionNode = GetSectionNode(
              current.recordType,
              this
            );
            (paragraph.meta as ISectionParagraphVariant).class = "no-wrap";
            this.items.push(paragraph);
            this.logger.diagnostic(
              `pushed paragraph ${current.content} at ${current.lineNo}`
            );
            paragraph.parse();
            break;
          }
          case MarkdownRecordType.SECTION_ORDERED:
          case MarkdownRecordType.LISTITEM_ORDERED:
          case MarkdownRecordType.LISTITEM_UNORDERED:
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
            assert(`expected ${MarkdownRecordType.PARAGRAPH},
              ${MarkdownRecordType.SECTION_ORDERED},
              ${MarkdownRecordType.SECTION_UNORDERED},
              ${MarkdownRecordType.PARAGRAPH},
              ${MarkdownRecordType.LISTITEM_ORDERED},
              ${MarkdownRecordType.LISTITEM_UNORDERED}`);
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
    //    this.meta.listType = ListTypeEnumType.numerical;
  }
}
export class SectionParseNode_LISTITEM_UNORDERED
  extends SectionParseNode_LISTITEM
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    // default but can be inferred from capture group TBD
    //    this.meta.listType = ListTypeEnumType.bulleted;
  }
}
