/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: parsepages.ts
 *
 * Create page object from serialized input

 * Version history:
 *
 **/
const INITIALDATE = "9/21/2015 17:03";
const InitialDate = new Date(INITIALDATE).toString();
import { strict as assert } from "assert";
import { IsError, IsDefined } from "./utilities";
import { Logger } from "./logger";
import { MarkdownRecordType, TaggedStringType } from "./dataadapter";
import {
  ISectionFillinItem,
  IHeadingListItem,
  ILinkListItem,
  IPageContent,
  IRangeItem,
  ISentenceListItem,
  ISectionListItem,
  ITerminalInfo,
  ITerminalListItem,
  PageContentInitializer,
  PageContentVersion,
  PageFormatEnumType
} from "./pageContentType";
import util from "util";
import {
  //  FileNode,
  ParseNode,
  IDX_INITIALIZER,
  IParseNode,
  ParseNodeSerializeColumnPad,
  ParseNodeSerializeTabular,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import { AppNode } from "./parseapp";
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
  title: string = "";
  filename: string = "";
  description: string = "";
  owner: string = "anonymous";
  author: string = "anonymous";
  category: string = "Miscellaneous";
  version: string = PageContentVersion;
  pageFormatType = PageFormatEnumType.default;
  created: string = InitialDate;
  modified: string = InitialDate;
  transformed: string = InitialDate;
  firstTermIdx: number = IDX_INITIALIZER;
  lastTermIdx: number = IDX_INITIALIZER;
  sections: ISectionNode[] = []; //needs to be reflected in _data.sections[]
  terminalList: ITerminalListItem[] = [];
  headingList: IHeadingListItem[] = [];
  sectionList: ISectionListItem[] = [];
  sentenceList: ISentenceListItem[] = [];
  linkList: ILinkListItem[] = [];
  fillinList: ISectionFillinItem[] = [];
  constructor(parent?: PageParseNode | AppNode) {
    super(parent);
  }
  parse() {
    //this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    this.created = new Date(Date.now()).toString();
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      for (
        let current: TaggedStringType = this.dataSource.firstRecord();
        !this.dataSource.EOF();
        //        current = this.dataSource.nextRecord()
        current = this.dataSource.currentRecord()
      ) {
        if (current.recordType === MarkdownRecordType.PAGE) {
          let attributes: string[] = current.content.split(",");
          if (IsDefined(attributes[0])) this.title = attributes[0].trim();
          if (IsDefined(attributes[1])) this.owner = attributes[1].trim();
          if (IsDefined(attributes[2])) this.author = attributes[2].trim();
          if (
            IsDefined(attributes[3]) &&
            !isNaN(Date.parse(attributes[3].trim()))
          )
            this.created = attributes[3].trim();
          if (IsDefined(attributes[4])) this.category = attributes[4].trim();
          if (IsDefined(attributes[5])) this.description = attributes[5].trim();
          current = this.dataSource.nextRecord();
        } else {
          let sectionNode: ISectionNode = GetSectionNode(
            current.recordType,
            this
          );
          this.sections.push(sectionNode);
          this.logger.diagnostic(
            `pushed section=${current.recordType} ${sectionNode.constructor.name} ${current.content}`
          );
          sectionNode.parse();
        }
      }
      // transfer termIdx from userContext to pages
      this.userContext.terminals.parse();
      this.terminalList = this.userContext.terminals;

      this.userContext.headings.parse();
      this.headingList = this.userContext.headings;

      this.userContext.sentences.parse();
      this.sentenceList = this.userContext.sentences;

      this.userContext.sections.parse();
      this.sectionList = this.userContext.sections;

      this.userContext.links.parse();
      this.linkList = this.userContext.links;

      this.userContext.fillins.parse();
      this.fillinList = this.userContext.fillins;

      this.modified = new Date(Date.now()).toString();
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(e.message);
      } else {
        throw e;
      }
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
          let sectionNode: ISectionNode = <ISectionNode>section;
          outputStr = `${outputStr}${sectionNode.serialize(
            format,
            label,
            prefix + (i < this.sections.length - 1 ? "| " : "  ")
          )}`;
        }
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        let replacer: any = (key: string, value: any) => {
          // if we get a function, give us the code for that function
          switch (key) {
            // case "id":
            // case "firstTermIdx":
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
        // check altrecogition field for non stringify
        // console.log(`checking terminalList.altrecognition values`);
        // this.terminalList.forEach(terminal => {
        //   console.log(
        //     `terminalList[${terminal.termIdx}] contains ${terminal.altrecognition}`
        //   );
        //   if (terminal.altrecognition === undefined) {
        //     console.log(`- terminalList[${terminal.termIdx}] is undefined`);
        //   } else if (terminal.altrecognition === null) {
        //     console.log(`- terminalList[${terminal.termIdx}] is null`);
        //   } else if (terminal.altrecognition.length === 0) {
        //     console.log(`- terminalList[${terminal.termIdx}] is empty`);
        //   } else {
        //     console.log(
        //       `terminalList[${terminal.termIdx}] of length=${terminal.altrecognition.length}`
        //     );
        //   }
        // });
        outputStr = JSON.stringify(this, null, 2);
        // let tempstr = util.inspect(this);
        // console.log(tempstr);
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
      // case "id":
      // case "firstTermIdx":
      // case "nextTermIdx":
      // case "prevTermIdx":
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
    this.transformed = new Date(Date.now()).toString();
    return 0;
  }
}
