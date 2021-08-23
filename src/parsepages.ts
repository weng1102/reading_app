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
  ParseNodeSerializeColumnPad,
  ParseNodeSerializeTabular,
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
      assert(this.dataSource !== undefined, `dataSource is undefined`);
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
        outputStr = super.serialize(format, label, prefix);
        prefix = prefix + "  ";
        for (const [i, section] of this.sections.entries()) {
          label = `${section.type}`;
          outputStr = `${outputStr}${section.serialize(
            format,
            label,
            prefix + (i < this.sections.length - 1 ? "| " : "  ")
          )}`;
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        let replacer: any = (key, value) => {
          // if we get a function, give us the code for that function
          switch (key) {
            case "id":
            case "firstTermIdx":
            //            case "nextTermIdx":
            //            case "prevTermIdx":
            case "recitable":
            case "audible":
            case "visible":
              return undefined;
            default:
              return value;
          }
        };
        //        console.log(JSON.stringify(this, null, 2));
        // console.log(JSON.stringify(this, null, 2));
        //        let sections: ISectionNode[] = [];
        // outputStr = JSON.parse(
        //   JSON.stringify(this, this.stringifyReplacerForTabular)
        // );
        outputStr = JSON.stringify(this, replacer, 2);
        //console.log(JSON.parse(JSON.stringify(this)));
        // outputStr = "page:";
        // for (let [key, value] of Object.entries(data)) {
        //   if (key === "sections") {
        //     outputStr = `${outputStr} section[${key.length}],`;
        //     //            sections = <ISectionNode[]>value; // save for the end of list
        //   } else {
        //     let strval = `${value}`;
        //     if (strval.length > 0) {
        //       outputStr = `${outputStr} ${key}=${strval},`;
        //     }
        //   }
        // }
        // outputStr = outputStr.slice(0, -1);
        // for (const [i, section] of sections.entries()) {
        //   prefix = `page:section[${i}]`;
        //   outputStr = `${outputStr}\n${section.serialize(format, "", prefix)}`;
        // }
        // outputStr = super.serialize(
        //   format,
        //   ParseNodeSerializeTabular(this.constructor.name)
        // );
        // if (this.sections.length > 0) {
        //   outputStr = `\n${outputStr}`;
        //   for (let sectionNode of this.sections) {
        //     outputStr = `${outputStr}${sectionNode.serialize(
        //       format,
        //       ParseNodeSerializeTabular(sectionNode.constructor.name)
        //     )}`;
        //     // outputStr = `${outputStr}\n${ParseNodeSerializeTabular(
        //     //   "section",
        //     //   sectionNode.constructor.name
        //     // )}`;
        //   }
        // }
        break;
      }
      case ParseNodeSerializeFormatEnumType.JSON: {
        outputStr = JSON.stringify(this, null, 2);
        // console.log(
        //   JSON.stringify(
        //     this,
        //     [
        //       "sections",
        //       "items",
        //       "sentences",
        //       "content",
        //       "terminals",
        //       "meta",
        //       //"sections.items.sentences.meta.terminals.meta.letters",
        //       "letters",
        //       "termIdx"
        //     ],
        //     2
        //   )
        // );
        // console.log(JSON.parse(JSON.stringify(this, ["termIdx"])));
        break;
      }
      default: {
        outputStr = super.serialize();
        break;
      }
    }
    return outputStr;
  }
  stringifyReplacerForTabular(key: string, value: any) {
    // only include fields relevant otherwise ignore
    switch (key) {
      case "id":
      case "firstTermIdx":
      case "nextTermIdx":
      case "prevTermIdx":
      case "recitable":
      case "audible":
      case "visible":
        return undefined;
      default:
        return value;
    }
  }
  transform(): number {
    //     super.transform();
    //     for (let section of this.sections) {
    // /      terminalIdx = section.transform();
    //     }
    //     return terminalIdx;
    return 0;
  }
}
