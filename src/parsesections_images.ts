/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_images.ts
 *
 * Create section image entry objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import {
  IsDefined,
  IsError,
  IsValidBooleanString,
  IsValidWholeNumberString,
  IsValidWholeNumberPercentString,
  ValidateArgBoolean,
  ValidateArgWholeNumber,
  ValidateArgString,
  ValidateArg,
  IsValidString,
  ValidationArgMsg
} from "./utilities";
import {
  IDX_INITIALIZER,
  ParseNodeSerializeTabular,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import { MarkdownRecordType, TaggedStringType } from "./dataadapter";
import {
  ImageEntryOrientationEnumType,
  ISectionImageEntryVariantInitializer,
  ISectionImageEntryVariant,
  SectionVariantEnumType,
  TerminalMetaEnumType,
  IImageTerminalMeta
} from "./pageContentType";
import { GetSectionNode } from "./parsesectiondispatch";
// import { ITerminalNode } from "./parseterminals";
import { IPageNode } from "./parsepages";
import { ISectionNode } from "./parsesections";
import { SectionParseNode_LIST } from "./parsesections";
import { ISentenceNode, SentenceNode } from "./parsesentences";
export class SectionParseNode_IMAGEENTRY extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating paragraph section");
  }
  type = SectionVariantEnumType.image_entry;
  meta: ISectionImageEntryVariant = ISectionImageEntryVariantInitializer();
  parse() {
    const validateArgs = (argString: string, lineNo: number) => {
      /*
        [0]  response title
        [1]  orientation: image on left, image above
        [2]  percent portion of page for image
        [3]  separator format at top of image section (TBD)
        */
      let args: string[] = argString.split(",").map(arg => arg.trim());
      let argNum = 0;
      // consider try/catch
      this.meta.title = ValidateArg(
        IsValidString(args[argNum]),
        "title",
        args[argNum],
        this.meta.title,
        argNum,
        lineNo,
        this.logger
      ) as string;
      argNum++;
      this.meta.orientation = ValidateArg(
        IsDefined(args[argNum]) &&
          args[argNum] in ImageEntryOrientationEnumType,
        "orientation",
        args[argNum],
        this.meta.orientation,
        argNum,
        lineNo,
        this.logger
      ) as ImageEntryOrientationEnumType;
      argNum++;
      this.meta.percent = ValidateArg(
        IsValidWholeNumberPercentString(args[argNum]),
        "image orientation percent",
        args[argNum],
        this.meta.percent,
        argNum,
        lineNo,
        this.logger
      ) as string;
      argNum++;
      this.meta.separator = ValidateArg(
        IsValidString(args[argNum]),
        "separator",
        args[argNum],
        this.meta.separator,
        argNum,
        lineNo,
        this.logger
      ) as string;
    };
    //this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `Undefined datasource encountered`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `Undefined record encountered`);

      assert(
        current.recordType === MarkdownRecordType.IMAGEENTRY,
        `Expected "${MarkdownRecordType.IMAGEENTRY}" at line ${current.lineNo}`
      );
      validateArgs(current.content, current.lineNo);

      current = this.dataSource.nextRecord();
      assert(
        current.recordType === MarkdownRecordType.PARAGRAPH,
        `expected "${MarkdownRecordType.PARAGRAPH}" but encountered "${current.recordType}" at line ${current.lineNo}`
      );
      this.logger.diagnostic("Validated parameters");

      current = this.dataSource.nextRecord();
      assert(
        current.recordType === MarkdownRecordType.SENTENCE,
        `expected "${MarkdownRecordType.SENTENCE}" but encountered "${current.recordType}" at line ${current.lineNo}`
      );
      // find list of images
      this.firstTermIdx = this.userContext.terminals.lastIdx + 1;
      let sentence: ISentenceNode = new SentenceNode(this);
      sentence.parse();
      for (const terminal of sentence.terminals) {
        if (terminal.type === TerminalMetaEnumType.image) {
          (<IImageTerminalMeta>terminal.meta).className = "imageentry-image";
          this.meta.images.push(terminal);
        }
      }
      assert(
        this.meta.images.length > 0,
        `expected image declaration(s) immediately following "${MarkdownRecordType.IMAGEENTRY}" at line ${current.lineNo}`
      );
      current = this.dataSource.nextRecord();
      assert(
        current.recordType === MarkdownRecordType.PARAGRAPH_END,
        `expected "${MarkdownRecordType.PARAGRAPH_END}" to "${MarkdownRecordType.PARAGRAPH}" but encountered "${current.recordType}"  at line ${current.lineNo}`
      );
      for (
        current = this.dataSource.nextRecord();
        !this.dataSource.EOF() &&
        current.recordType !== MarkdownRecordType.IMAGEENTRY_END;
        current = this.dataSource.currentRecord() // update current modified in parse()
      ) {
        let sectionNode: ISectionNode = GetSectionNode(
          current.recordType,
          this
        );
        this.meta.captions.push(sectionNode);
        this.logger.diagnostic(
          `pushed section=${current.recordType} ${sectionNode.constructor.name} ${current.content}`
        );
        if (current.recordType === MarkdownRecordType.EMPTY) {
          this.logger.diagnostic(
            `encountered EMPTY section=${current.recordType} ${sectionNode.constructor.name} ${current.content} @ ${current.lineNo}`
          );
        }
        sectionNode.parse();
      }
      assert(
        current.recordType === MarkdownRecordType.IMAGEENTRY_END,
        `expected "${MarkdownRecordType.IMAGEENTRY_END}" at line ${current.lineNo}`
      );
      if (current.recordType === MarkdownRecordType.IMAGEENTRY_END) {
        this.lastTermIdx = this.userContext.terminals.lastIdx;
        this.dataSource.nextRecord(); // skip IMAGEENTRY_END
      }
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(e.message);
        for (
          let current = this.dataSource.nextRecord();
          !this.dataSource.EOF() &&
          current.recordType !== MarkdownRecordType.IMAGEENTRY_END;
          current = this.dataSource.nextRecord()
        ) {
          this.logger.diagnostic(
            `looking for ${MarkdownRecordType.IMAGEENTRY_END} at ${current.lineNo}`
          );
        }
        this.dataSource.nextRecord(); // skip IMAGEENTRY_END
      } else {
        throw e;
      }
    }
    return 0;
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    let outputStr: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        label += `: title="${this.meta.title}", orientation=${this.meta.orientation}, width=${this.meta.percent}`;
        outputStr = `${super.serialize(format, label, prefix)}`;
        outputStr = `${outputStr}${super.serialize(
          format,
          "images:",
          prefix + "| "
        )}`;
        for (const [i, image] of this.meta.images.entries()) {
          let imageNode: IImageTerminalMeta = image.meta as IImageTerminalMeta;
          outputStr = `${outputStr}${super.serialize(
            format,
            imageNode.src,
            prefix + "| " + (i < this.meta.images.length - 1 ? "| " : "  ")
          )}`;
        }
        for (const [i, section] of this.meta.captions.entries()) {
          let sectionNode: ISectionNode = section as ISectionNode;
          outputStr = `${outputStr}${sectionNode.serialize(
            format,
            `captions: (${section.type})`,
            prefix + (i < this.meta.captions.length - 1 ? "| " : "  ")
          )}`;
        }
        //     format,
        //     label,
        //     //            prefix + " ".padEnd(2)
        //     prefix + (i < this.meta.sentences.length - 1 ? "| " : "  ")
        //   )}`;
        // }
        //        outputStr = outputStr.slice(0, -1);
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        outputStr = super.serialize(
          format,
          ParseNodeSerializeTabular(
            this.constructor.name
            // `sentence count=${this.meta.sentences.length}`
          )
        );
        //        if (colWidth0 === undefined) colWidth0 = 2;
        // for (let sentence of this.meta.sentences) {
        //   let sentenceNode: ISentenceNode = <SentenceNode>sentence;
        //   outputStr =
        //     outputStr +
        //     sentenceNode.serialize(
        //       format,
        //       sentence.constructor.name,
        //       sentence.content
        //     );
        // }
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
