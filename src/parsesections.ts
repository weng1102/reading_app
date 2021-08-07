/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsesections.ts
 *
 * Create various section objects from serialized input. As
 * each type of object becomes implemented, separate parsesections_*
 * files are created to keep the file size manageable.

 * Version history:
 *
 **/
import { strict as assert } from "assert";
import {
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
  //  IPageContent,
  ISectionContent,
  // ISectionBlockquoteVariant,
  // ISectionBlockquoteVariantInitializer,
  ISectionEmptyVariant,
  ISectionEmptyVariantInitializer,
  ISectionFillinVariant,
  ISectionFillinVariantInitializer,
  // ISectionHeadingVariant,
  // ISectionHeadingVariantInitializer,
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
  SectionVariantEnumType,
  SectionVariantType,
  // UnorderedListMarkerEnumType,
  ISectionTbdVariant,
  ISectionTbdVariantInitializer
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
  parse() {
    // default section parsing
    let current: TaggedStringType;
    current = this.dataSource.currentRecord();
    this.logger.diagnostic(
      `parsing ${current.content} of type ${current.tagType} at ${current.lineNo}`
    );
    this.dataSource.nextRecord();
    return 0;
  }
  transform() {
    return 0;
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    let outputStr: string = "";
    label =
      label === undefined
        ? `${this.type} w/ ${this.items.length} subsections`
        : label;
    outputStr = super.serialize(format, label, prefix);
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        //  prefix = this.items.length > 0 ? prefix + "| " : "  ";

        // for (let subsectionNode of this.items) {
        //   outputStr = `${outputStr}${subsectionNode.serialize(
        //     format,
        //     undefined,
        //     //            prefix + " ".padEnd(2)
        //     prefix
        //   )}`;
        // }
        for (const [i, value] of this.items.entries()) {
          label = `${value.type}`;
          outputStr = `${outputStr}${value.serialize(
            format,
            label,
            prefix + (i < this.items.length - 1 ? "| " : "  ")
          )}`;
        }

        //      outputStr = outputStr.slice(0, -1);
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        for (let subsectionNode of this.items) {
          label === undefined
            ? `subsection: ${subsectionNode.type} ${subsectionNode.name}`
            : label;
          outputStr =
            outputStr +
            `${subsectionNode.serialize(
              format,
              label,
              prefix + " ".padEnd(2)
            )}`;
        }
        break;
      }
      default: {
        outputStr = super.serialize(format);
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
      // // if (!this.dataSource.EOF()) {
      // //   this.dataSource.previousRecord();
      // }
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
    let outputStr: string = "";
    label = `empty: ${this.meta.count} occurence${
      this.meta.count === 1 ? "" : "s"
    }`;
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        outputStr = super.serialize(format, label, prefix);
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        outputStr = super.serialize(format, label, prefix);
        //        outputStr = outputStr.slice(0, -1);
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
export class SectionParseNode_TBD extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //    console.log("creating tbd section");
  }
  readonly type: SectionVariantEnumType = SectionVariantEnumType.tbd;
  meta: ISectionTbdVariant = ISectionTbdVariantInitializer();
}
