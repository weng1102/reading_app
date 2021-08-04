/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_heading.ts
 *
 * Create section heading objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import {
  // BaseClass,
  IParseNode,
  //  ParseNode,
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
  ISectionContent,
  // ISectionBlockquoteVariant,
  // ISectionBlockquoteVariantInitializer,
  // ISectionEmptyVariant,
  // ISectionEmptyVariantInitializer,
  // ISectionFillinVariant,
  // ISectionFillinVariantInitializer,
  ISectionHeadingVariant,
  ISectionHeadingVariantInitializer,
  // ISectionOrderedListVariant,
  // ISectionOrderedListVariantInitializer,
  // ISectionUnorderedListVariant,
  // ISectionUnorderedListVariantInitializer,
  // ISectionParagraphVariant,
  // ISectionParagraphVariantInitializer,
  // ISentenceContent,
  // ITerminalContent,
  // TerminalMetaType,
  // TerminalMetaEnumType,
  // OrderedListTypeEnumType,
  // PageFormatEnumType,
  SectionVariantEnumType
  //  SectionVariantType
  // UnorderedListMarkerEnumType,
  // IWordTerminalMeta,
  // IWordTerminalMetaInitializer
} from "./pageContentType";
import { IPageNode } from "./parsepages";
// import { ISentenceNode, SentenceNode } from "./parsesentences";
// import { SectionParseNode_PARAGRAPH } from "./parsesections_paragraph";
// type SectionNodeMarkdownClassType =
//   | typeof SectionParseNode_BLOCKQUOTE
//   | typeof SectionParseNode_HEADING
//   | typeof SectionParseNode_PARAGRAPH
//   | typeof SectionParseNode_LIST_ORDERED
//   | typeof SectionParseNode_LIST_UNORDERED
//   | typeof SectionParseNode_FILLIN
//   | typeof SectionParseNode_PHOTOENTRY;
//   LIST_UNORDERED = "LIST_UNORDERED",
//   LIST_ORDERED = "LIST_ORDERED",
//   COMMENT = "COMMENT",
//   BLOCKQUOTE = "BLOCKQUOTE",
//   PASSTHRUTAG = "PASSTHRUTAG",
//   PHOTOENTRY = "PHOTOENTRY",
//   FILLIN = "FILLIN",
//   PAGE = "PAGE",
//   SENTENCE = "SENTENCE",
//   UNKNOWN = "UNKNOWN" // should always be last
//
import { SectionParseNode } from "./parsesections";
export type ISectionNode = ISectionContent & IParseNode;
export class SectionParseNode_HEADING extends SectionParseNode
  implements ISectionNode {
  // can have zero (when immediately followed by subsecion) or more sentences
  // readonly type: SectionVariantEnumType = SectionVariantEnumType.heading;
  // protected title: string = `${this.name}: ${this.description}`; // otherwise defaults to  name: description above
  // protected recitable: boolean = false;
  // protected audible: boolean = false;
  // protected level: number = 0;
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
  readonly type = SectionVariantEnumType.heading;
  meta: ISectionHeadingVariant = ISectionHeadingVariantInitializer();
  parse() {
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(
        current.tagType === MarkdownTagType.HEADING,
        `expected ${MarkdownTagType.HEADING} at line ${current.lineNo}`
      );
      this.meta.title = current.content;
      this.meta.level = current.headingLevel;
      this.dataSource.nextRecord(); // position to next record
    } catch (e) {
      this.logger.error(e.message);
      if (this.logger.verboseMode) console.log(e.stack);
    } finally {
      return 1;
    }
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    label = `heading[id=${this.id}]: ${this.meta.title} (at level ${this.meta.level})`;
    let outputStr: string = super.serialize(format, label, prefix);
    //    outputStr = outputStr.slice(0, -1);
    return outputStr;
  }
}
