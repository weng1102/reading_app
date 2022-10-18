/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_ibuttongrid.ts
 *
 * Create section of recitable buttons objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { IsError, IsDefined } from "./utilities";
import {
  IDX_INITIALIZER,
  ParseNodeSerializeTabular,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import { MarkdownRecordType, TaggedStringType } from "./dataadapter";
import {
  ImageEntryLayoutEnumType,
  ISectionImageEntryVariantInitializer,
  ISectionImageEntryVariant,
  ISectionParagraphVariant,
  ISectionButtonGridVariant,
  ISectionParagraphVariantInitializer,
  ISectionButtonGridVariantInitializer,
  ITerminalContent,
  SectionVariantEnumType,
  TerminalMetaEnumType,
  IImageTerminalMeta
} from "./pageContentType";
import { GetSectionNode } from "./parsesectiondispatch";
import { ITerminalNode } from "./parseterminals";
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
  type = SectionVariantEnumType.button_grid;
  meta: ISectionButtonGridVariant = ISectionButtonGridVariantInitializer();
  parse() {
    //this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `Undefined datasource encountered`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `Undefined record encountered`);

      assert(
        current.recordType === MarkdownRecordType.BUTTONGRID,
        `Expected "${MarkdownRecordType.BUTTONGRID}" at line ${current.lineNo}`
      );
      let args: string[] = current.content.split(",").map(arg => arg.trim());
      if (IsDefined(args[0])) this.meta.description = args[0];
      if (IsDefined(args[1])) {
        assert(
          !isNaN(+args[1]),
          `Invalid column count "${args[1]}" encountered, expected a number at line ${current.lineNo}`
        );
        this.meta.columnCount = +args[1];
      }
      if (IsDefined(args[2])) {
        assert(
          !isNaN(+args[2]),
          `Invalid minimum column width "${args[2]}" encountered, expected a number at line ${current.lineNo}`
        );
        this.meta.minColumnWidth = +args[2];
      }
      current = this.dataSource.nextRecord();
      assert(
        current.recordType === MarkdownRecordType.PARAGRAPH,
        `Expected "${MarkdownRecordType.PARAGRAPH}" but encountered "${current.recordType}" at line ${current.lineNo}`
      );
      current = this.dataSource.nextRecord();
      assert(
        current.recordType === MarkdownRecordType.SENTENCE,
        `Expected "${MarkdownRecordType.SENTENCE}" but encountered "${current.recordType}" at line ${current.lineNo}`
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
        `Expected image declaraction(s) immediately following "${MarkdownRecordType.IMAGEENTRY}" at line ${current.lineNo}`
      );
      current = this.dataSource.nextRecord();
      assert(
        current.recordType === MarkdownRecordType.PARAGRAPH_END,
        `Expected "${MarkdownRecordType.PARAGRAPH_END}" to "${MarkdownRecordType.PARAGRAPH}" but encountered "${current.recordType}"  at line ${current.lineNo}`
      );
      //keep processing sections until imageentry_end
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
        this.meta.buttonText.push("hi there");
        this.logger.diagnostic(
          `pushed section=${current.recordType} ${sectionNode.constructor.name} ${current.content}`
        );
        sectionNode.parse();
        //        current = this.dataSource.currentRecord();
      }
      if (current.recordType === MarkdownRecordType.IMAGEENTRY_END) {
        this.lastTermIdx = this.userContext.terminals.lastIdx;
        // this.id =
        //   this.userContext.sections.push(
        //     ISectionImageEntryInitializer(
        //       this.firstTermIdx,
        //       this.lastTermIdx,
        //       this.type.toString()
        //     )
        //   ) - 1;
        for (let idx = this.firstTermIdx; idx <= this.lastTermIdx; idx++) {
          this.userContext.terminals[idx].sectionIdx = this.id;
        }
        this.dataSource.nextRecord(); // move to next grouping
      }
    } catch (e) {
      this.dataSource.nextRecord(); // move to next grouping
      if (IsError(e)) {
        this.logger.error(e.message);
      } else {
        throw e;
      }
    } finally {
      return 0;
    }
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    let outputStr: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        label += `: title="${this.meta.title}", layout=${this.meta.layout}, width=${this.meta.percent}`;
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
