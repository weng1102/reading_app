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
        this.meta.sentences.push(sentence);
        sentence.parse();
        current = this.dataSource.currentRecord(); // update current within this scope
      }
      assert(
        current.tagType === MarkdownTagType.PARAGRAPH_END,
        `expected ${MarkdownTagType.PARAGRAPH_END} to ${MarkdownTagType.PARAGRAPH}`
      );
      if (current.tagType === MarkdownTagType.PARAGRAPH_END)
        this.dataSource.nextRecord(); // move to next grouping
    } catch (e) {
      this.logger.error(e.message);
      this.dataSource.nextRecord(); // move to next grouping
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
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        outputStr = `${super.serialize(format, label, prefix)}`;
        for (let sentence of this.meta.sentences) {
          outputStr = `${outputStr}${sentence.serialize(
            format,
            label,
            //            prefix + " ".padEnd(2)
            prefix + "| "
          )}`;
        }
        //        outputStr = outputStr.slice(0, -1);
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        // prefix =
        //   prefix === undefined
        //     ? ""
        //     : " ".padEnd(colWidth0 !== undefined ? colWidth0 : 2) + prefix;
        //        label = "paragraph";
        outputStr = super.serialize(format, label, prefix) + "\n";
        //        if (colWidth0 === undefined) colWidth0 = 2;
        for (let sentence of this.meta.sentences) {
          outputStr =
            outputStr +
            `${sentence.serialize(format, label, " ".padEnd(2) + prefix)}\n`;
        }
        outputStr = outputStr.slice(0, -1);
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
