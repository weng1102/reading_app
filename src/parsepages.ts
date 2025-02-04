/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
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
import {
  IsError,
  IsDefined,
  IsValidBooleanString,
  IsValidString,
  ValidateArgString,
  ValidateArg,
  ValidateArgBoolean,
  ValidationArgMsg
} from "./utilities";
import { Logger } from "./logger";
import { MarkdownRecordType, TaggedStringType } from "./dataadapter";
import { tokenizeParameterList } from "./tokenizer";
import {
  AutodNumberedHeadingEnumType,
  ISectionFillinItem,
  IHeadingListItem,
  ILinkListItem,
  IPageContent,
  IRangeItem,
  IInlineButtonItem,
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
  headingNumbering: string = "";
  version: string = PageContentVersion;
  pageFormatType = PageFormatEnumType.default;
  created: string = InitialDate;
  modified: string = InitialDate;
  transformed: string = InitialDate;
  showTags: boolean = false;
  columnCount: number = 0;
  firstTermIdx: number = IDX_INITIALIZER;
  lastTermIdx: number = IDX_INITIALIZER;
  sections: ISectionNode[] = []; //needs to be reflected in _data.sections[]
  terminalList: ITerminalListItem[] = [];
  headingList: IHeadingListItem[] = [];
  sectionList: ISectionListItem[] = [];
  sentenceList: ISentenceListItem[] = [];
  linkList: ILinkListItem[] = [];
  fillinList: ISectionFillinItem[] = [];
  inlineButtonList: IInlineButtonItem[] = [];
  constructor(parent?: PageParseNode | AppNode) {
    super(parent);
  }
  parse() {
    let current: TaggedStringType;
    const validateArgs = (argString: string, lineNo: number) => {
      /*
      [0]  response title
      [1]  page owner (consumer)
      [2]  page author (producer)
      [3]  date created
      [4]  category
      [5]  description
      [6]  numbering scheme
      */
      let args: string[] = tokenizeParameterList(argString).map(arg =>
        arg.trim()
      );
      let argNum: number = 0;
      this.title = ValidateArg(
        IsValidString(args[argNum]),
        "title",
        args[argNum],
        this.title,
        argNum,
        lineNo,
        this.logger
      ) as string;
      argNum++;
      this.owner = ValidateArg(
        IsValidString(args[argNum]),
        "owner",
        args[argNum],
        this.owner,
        argNum,
        lineNo,
        this.logger
      ) as string;
      argNum++;
      this.author = ValidateArg(
        IsValidString(args[argNum]),
        "author",
        args[argNum],
        this.author,
        argNum,
        lineNo,
        this.logger
      ) as string;

      argNum++;
      this.created = ValidateArg(
        !isNaN(Date.parse(args[argNum])),
        "created",
        args[argNum],
        this.created,
        argNum,
        lineNo,
        this.logger
      ) as string;
      argNum++;
      this.category = ValidateArg(
        IsValidString(args[argNum]),
        "category",
        args[argNum],
        this.category,
        argNum,
        lineNo,
        this.logger
      ) as string;
      argNum++;
      this.description = ValidateArg(
        IsValidString(args[argNum]),
        "description",
        args[argNum],
        this.description,
        argNum,
        lineNo,
        this.logger
      ) as string;
      argNum++;
      this.showTags = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show tags",
        args[argNum],
        this.showTags,
        argNum,
        lineNo,
        this.logger
      ) as boolean;
      argNum++;
      this.headingNumbering = ValidateArg(
        args[argNum] in AutodNumberedHeadingEnumType,
        "heading numbering",
        args[argNum],
        this.headingNumbering,
        argNum,
        lineNo,
        this.logger
      ) as AutodNumberedHeadingEnumType;
      this.logger.diagnostic(`Validated ${argNum} parameters`);
    };

    this.logger.diagnostic(`${this.constructor.name}`);
    this.created = new Date(Date.now()).toString();
    try {
      assert(this.dataSource !== undefined, `dataSource is undefined`);
      this.logger.diagnostic(`Parsing ${this.dataSource.fileName}`);
      for (
        current = this.dataSource.firstRecord();
        !this.dataSource.EOF();
        //        current = this.dataSource.nextRecord()
        current = this.dataSource.currentRecord()
      ) {
        if (current.recordType === MarkdownRecordType.PAGE) {
          validateArgs(current.content, current.lineNo);
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

      const lastTermIdx: number =
        this.terminalList.length > 0
          ? this.terminalList[this.terminalList.length - 1].termIdx
          : IDX_INITIALIZER;
      this.userContext.headings.parse(lastTermIdx);
      this.headingList = this.userContext.headings;

      this.userContext.sentences.parse();
      this.sentenceList = this.userContext.sentences;

      this.userContext.sections.parse();
      this.sectionList = this.userContext.sections;

      this.userContext.links.parse(
        this.headingList,
        this.sectionList,
        // this.sentenceList,
        this.terminalList
      );
      this.linkList = this.userContext.links;

      this.userContext.fillins.parse();
      this.fillinList = this.userContext.fillins;

      this.userContext.inlineButtons.parse(
        this.sectionList,
        this.sentenceList,
        this.terminalList
      );
      this.inlineButtonList = this.userContext.inlineButtons;

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
