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
  // ISectionOrderedListVariant,
  // ISectionOrderedListVariantInitializer,
  // ISectionUnorderedListVariant,
  // ISectionUnorderedListVariantInitializer,
  ISectionParagraphVariant,
  ISectionParagraphVariantInitializer,
  // ISentenceContent,
  // ITerminalContent,
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
import { SectionParseNode, ISectionNode } from "./parsesections";
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
    this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `current record is undefined`);
      assert(
        current.tagType === MarkdownTagType.PARAGRAPH,
        `expected ${MarkdownTagType.PARAGRAPH} at line ${current.lineNo}`
      );
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
        sentence.parse();
        this.meta.sentences.push(sentence);
      }
      assert(
        current.tagType === MarkdownTagType.PARAGRAPH_END,
        `expected ${MarkdownTagType.PARAGRAPH_END} to ${MarkdownTagType.PARAGRAPH}`
      );
      current = this.dataSource.nextRecord(); // move to next grouping
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
    label = "paragraph";
    // return super.serialize(
    //   format,
    //   label,
    //   prefix,
    //   colWidth0,
    //   colWidth1,
    //   colWidth2,
    //   colWidth3,
    //   colWidth4
    // );
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
        outputStr = `${prefix}${label}:\n`;
        for (let sentence of this.meta.sentences) {
          outputStr =
            outputStr +
            `${sentence.serialize(
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
