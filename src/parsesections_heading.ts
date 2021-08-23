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
import { IParseNode, ParseNodeSerializeFormatEnumType } from "./baseclasses";
import { MarkdownTagType, TaggedStringType } from "./dataadapter";
import {
  ISectionContent,
  ISectionHeadingVariant,
  ISectionHeadingVariantInitializer,
  SectionVariantEnumType
} from "./pageContentType";
import { IPageNode } from "./parsepages";
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
