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
import { IsError } from "./utilities";
import { ParseNodeSerializeTabular } from "./baseclasses";
import {
  IParseNode,
  ParseNode,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import { MarkdownTagType, TaggedStringType } from "./dataadapter";
import {
  ISectionContent,
  ISectionEmptyVariant,
  ISectionEmptyVariantInitializer,
  ISectionFillinVariant,
  ISectionFillinVariantInitializer,
  SectionVariantEnumType,
  SectionVariantType,
  ISectionTbdVariant,
  ISectionTbdVariantInitializer
} from "./pageContentType";
import { IPageNode } from "./parsepages";
export type ISectionNode = ISectionContent & IParseNode;
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
        for (const [i, value] of this.items.entries()) {
          label = `${value.type}`;
          outputStr = `${outputStr}${value.serialize(
            format,
            label,
            prefix + (i < this.items.length - 1 ? "| " : "  ")
          )}`;
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        let items: ISectionNode[] = [];
        let data = JSON.parse(JSON.stringify(this));
        outputStr = prefix === undefined ? "" : prefix;
        for (let [key, value] of Object.entries(data)) {
          if (key === "items") {
            outputStr = `${outputStr} item[${key.length}],`;
            items.push(<ISectionNode>value); // save for the end of list
          } else {
            let strval = `${value}`;
            if (strval.length > 0) {
              outputStr = `${outputStr} ${key}=${strval},`;
            }
          }
        }

        ///
        for (const [i, item] of this.items.entries()) {
          prefix = `${prefix}:items[${i}]`;
          outputStr = `${outputStr}\n${item.serialize(format, "", prefix)}`;
        }
        //
        // label === undefined
        //   ? `subsection: ${subsectionNode.type} ${subsectionNode.name}`
        //   : label;
        // outputStr =
        //   outputStr +
        //   `${items.serialize(
        //     format,
        //     ParseNodeSerializeTabular(
        //       "subsection",
        //       subsectionNode.type,
        //       subsectionNode.name
        //     )
        //   )}`;
        // }
        break;
      }
      default: {
        outputStr = super.serialize(format);
        break;
      }
    }
    return outputStr;
  }
  transform() {
    let terminalIdx: number = 0;
    super.transform();
    for (let item of this.items) {
      terminalIdx = item.transform();
    }
    return terminalIdx;
  }
}
export abstract class SectionParseNode_LIST extends SectionParseNode
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
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
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(e.message);
      } else {
        throw e;
      }
      //  if (this.logger.verboseMode) console.log(e.stack);
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
        outputStr = super.serialize(
          format,
          ParseNodeSerializeTabular(label),
          prefix
        );
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
