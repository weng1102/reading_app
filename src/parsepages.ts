import { strict as assert } from "assert";
import { TaggedStringType } from "./dataadapter";
import { IPageContent, PageFormatEnumType } from "./pageContentType";
import {
  FileNode,
  ParseNode,
  IParseNode,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import { ISectionNode } from "./parsesections";
import { GetSectionNode } from "./parsesectiondispatch";
interface PageContentMethods {
  parse(): number; // any to avoid compilation error, should be removed
  transform(): number;
  //  serialize(): string; // any to avoid compilation error, should be removed
}
export type IPageNode = IPageContent & IParseNode;
export class PageParseNode extends ParseNode implements IPageContent {
  //  _data: PageContentType = InitialPageContentType;
  id: number = 0;
  name: string = "";
  description: string = "";
  owner: string = "";
  pageFormatType = PageFormatEnumType.default;
  created!: Date;
  modified!: Date;
  transformed!: Date;
  firstTermIdx: number = -1;
  lastTermIdx: number = -1;
  sections: ISectionNode[] = []; //needs to be reflected in _data.sections[]
  constructor(parent) {
    super(parent);
  }
  parse() {
    this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.parent !== undefined, `parent is undefined`);
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      let current: TaggedStringType;
      // assume datasource is a page (sections where depth=0), parse all direct children i.e., depth=0
      for (
        let current: TaggedStringType = this.dataSource.firstRecord();
        !this.dataSource.EOF();
        current = this.dataSource.nextRecord()
      ) {
        let sectionNode: ISectionNode = GetSectionNode(current.tagType, this);
        this.sections.push(sectionNode);
        sectionNode.parse();
        current = this.dataSource.currentRecord();
      }
    } catch (e) {
      this.logger.error(e.message);
    } finally {
      return this.sections.length;
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
        label = "page";
        if (label === undefined) label = "";
        if (prefix === undefined) prefix = "+-";
        if (colWidth0 === undefined) colWidth0 = 2;
        if (colWidth1 === undefined) colWidth1 = 15;
        if (colWidth2 === undefined) colWidth2 = 12;
        if (colWidth3 === undefined) colWidth3 = 25;
        if (colWidth4 === undefined) colWidth4 = 50;
        outputStr = `${label}[${this.id}]: ${this.name}\n`;
        if (prefix === undefined) prefix = "+-";
        label = "section";
        for (let sectionNode of this.sections) {
          outputStr =
            outputStr +
            `${sectionNode.serialize(
              ParseNodeSerializeFormatEnumType.TABULAR,
              label,
              prefix,
              colWidth0,
              colWidth1,
              colWidth2,
              colWidth3,
              colWidth4
            )}\n`;
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        break;
      }
    }
    return outputStr;
  }
  transform(): number {
    return 0;
  }
}
