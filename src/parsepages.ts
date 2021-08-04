/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parsepages.ts
 *
 * Create page object from serialized input

 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { TaggedStringType } from "./dataadapter";
import { IPageContent, PageFormatEnumType } from "./pageContentType";
import {
  //  FileNode,
  ParseNode,
  IParseNode,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import { ISectionNode } from "./parsesections";
import { GetSectionNode } from "./parsesectiondispatch";
export interface PageContentMethods {
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
  constructor(parent?: PageParseNode) {
    super(parent);
  }
  parse() {
    this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      //assert(this.parent !== undefined, `parent is undefined`);
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      // assume datasource is a page (sections where depth=0), parse all direct children i.e., depth=0
      for (
        let current: TaggedStringType = this.dataSource.firstRecord();
        !this.dataSource.EOF();
        //        current = this.dataSource.nextRecord()
        current = this.dataSource.currentRecord()
      ) {
        let sectionNode: ISectionNode = GetSectionNode(current.tagType, this);
        this.sections.push(sectionNode);
        this.logger.diagnostic(
          `pushed section=${current.tagType} ${sectionNode.constructor.name} ${current.content}`
        );
        sectionNode.parse();
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
    prefix: string = ""
  ): string {
    let outputStr: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        // parent prefix determines this depth's prefix
        //        prefix = prefix + "+-";
        outputStr = super.serialize(format, label, prefix);
        for (let sectionNode of this.sections) {
          label = `${sectionNode.type}`;
          prefix = "  ";
          outputStr = `${outputStr}${sectionNode.serialize(
            format,
            label,
            prefix
          )}`;
        }
        // for (const [i, value] of this.sections.entries()) {
        //   label = `${value.type}`;
        //   prefix = i < this.sections.length - 1 ? prefix + "| " : "  ";
        //   outputStr = `${outputStr}${value.serialize(format, label, prefix)}`;
        // }
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        label = label === undefined ? `page` : label;
        outputStr = super.serialize(format, label);
        // prefix =
        //   prefix === undefined
        //     ? ""
        //     : " ".padEnd(colWidth0 !== undefined ? colWidth0 : 2) + prefix;
        // console.log(`page prefix ${prefix}`);
        if (this.sections.length > 0) {
          //          prefix = prefix
          outputStr = `${outputStr}\n`;
          for (let sectionNode of this.sections) {
            //            label = `${sectionNode.type}[id=${sectionNode.id}]:`;
            outputStr =
              outputStr + `${sectionNode.serialize(format, label, prefix)}\n`;
          }
          outputStr = outputStr.slice(0, -1);
        }
        break;
      }
      default: {
        outputStr = super.serialize();
        break;
      }
    }
    return outputStr;
  }
  transform(): number {
    return 0;
  }
}
