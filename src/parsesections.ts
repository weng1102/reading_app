import { strict as assert } from "assert";
import {
  BaseClass,
  IParseNode,
  ParseNode,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import {
  // IDataSource,
  //  MarkdownSectionTagType,
  MarkdownTagType,
  // BasicMarkdownSource,
  // RawMarkdownSource,
  TaggedStringType
  //MarkdownEndTagType
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
  ISectionOrderedListVariant,
  ISectionOrderedListVariantInitializer,
  ISectionUnorderedListVariant,
  ISectionUnorderedListVariantInitializer,
  ISectionParagraphVariant,
  ISectionParagraphVariantInitializer,
  ISentenceContent,
  ITerminalContent,
  TerminalMetaType,
  TerminalMetaEnumType,
  OrderedListTypeEnumType,
  PageFormatEnumType,
  SectionVariantEnumType,
  SectionVariantType,
  UnorderedListMarkerEnumType,
  ISectionTbdVariant,
  ISectionTbdVariantInitializer,
  IWordTerminalMeta,
  IWordTerminalMetaInitializer
} from "./pageContentType";
import { IPageNode } from "./parsepages";
import { ISentenceNode, SentenceNode } from "./parsesentences";
import { SectionParseNode_PARAGRAPH } from "./parsesections_paragraph";
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
export type ISectionNode = ISectionContent & IParseNode;
// interface ISectionNode {
//   id: number;
//   name: string;
//   description: string;
//   firstTermIdx: number;
//   sentenceNodes: ISentenceContent[];
//   parse(): any; // any to avoid compilation error, should be removed
//   transform(): any;
//   serialize(): string; // any to avoid compilation error, should be removed
//   // all of the finer details are hidden from the interface and conveyed via the (variants of) SectionContentType
// }
//type ISectionNode = ISectionContent & IContentMethods;
// interface ISentenceMethods {
//   serializeColumnar(
//     prefix?: string,
//     col0?: number,
//     col1?: number,
//     col2?: number,
//     col3?: number
//   ): string;
//   serializeForUnitTest(): string;
// }
//
export abstract class SectionParseNode extends ParseNode
  implements ISectionContent {
  // based on SectionVariantEnumType
  readonly id: number = 0;
  name: string = "";
  description: string = "";
  firstTermIdx: number = 0;
  items: ISectionNode[] = [];
  type!: SectionVariantEnumType; // initialized in subclass
  meta!: SectionVariantType; // initialized in subclass
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
  // should use abstract to force implmenetation in derived classes
  parse() {
    return 0;
  }
  transform() {
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
        if (label === undefined) label = "section";
        if (prefix === undefined) prefix = "+-";
        if (colWidth0 === undefined) colWidth0 = 2;
        if (colWidth1 === undefined) colWidth1 = 15;
        if (colWidth2 === undefined) colWidth2 = 12;
        if (colWidth3 === undefined) colWidth3 = 25;
        if (colWidth4 === undefined) colWidth4 = 50;
        outputStr = `${prefix}${label}[${this.id}]: name:${this.name} type:${this.type}\n`;
        if (prefix === undefined) prefix = "+-";
        for (let subsectionNode of this.items) {
          outputStr =
            outputStr +
            `${subsectionNode.serialize(
              ParseNodeSerializeFormatEnumType.TABULAR,
              label,
              " ".padEnd(prefix.length) + prefix,
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
export abstract class SectionParseNode_LIST extends SectionParseNode
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating blockquote section");
  }
  //serialize code for subclasses removes multiple implementations
}
export class SectionParseNode_FILLIN extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating ordered fillin section");
  }
  readonly type = SectionVariantEnumType.fillin;
  meta: ISectionFillinVariant = ISectionFillinVariantInitializer();
}
export class SectionParseNode_PHOTOENTRY extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating ordered photoentry section");
  }
  readonly type = SectionVariantEnumType.photo_entry;
  meta = ISectionFillinVariantInitializer();
}
export class SectionParseNode_EMPTY extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
  readonly type: SectionVariantEnumType = SectionVariantEnumType.empty;
  meta: ISectionEmptyVariant = ISectionEmptyVariantInitializer();
  parse() {
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(
        current.tagType === MarkdownTagType.EMPTY,
        `expected ${MarkdownTagType.EMPTY} at line ${current.lineNo}`
      );
      //    console.log(`current.lineNo=${current.lineNo}`);
      for (
        current = this.dataSource.currentRecord();
        !this.dataSource.EOF() && current.tagType === MarkdownTagType.EMPTY;
        current = this.dataSource.nextRecord()
      ) {
        this.meta.count++;
      }
      if (!this.dataSource.EOF()) {
        this.dataSource.previousRecord();
      }
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
        label = "empty";
        if (prefix === undefined) prefix = "+-";
        if (colWidth0 === undefined) colWidth0 = 2;
        if (colWidth1 === undefined) colWidth1 = 15;
        if (colWidth2 === undefined) colWidth2 = 12;
        if (colWidth3 === undefined) colWidth3 = 25;
        if (colWidth4 === undefined) colWidth4 = 50;
        outputStr = `${prefix}${label}: ${this.meta.count} occurence${
          this.meta.count === 1 ? "" : "s"
        }`;
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        break;
      }
    }
    return outputStr;
  }
}
export class SectionParseNode_TBD extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //    console.log("creating tbd section");
  }
  readonly type: SectionVariantEnumType = SectionVariantEnumType.tbd;
  meta: ISectionTbdVariant = ISectionTbdVariantInitializer();
}
