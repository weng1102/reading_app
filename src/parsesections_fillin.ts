/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_fillin.ts
 *
 * Create section fillin objects from serialized input. Allows grouping of
 * fillin response table at top of each section of fillins
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import {
  IsDefined,
  IsError,
  SetArgBoolean,
  SetArgWholeNumber
} from "./utilities";
import {
  IDX_INITIALIZER,
  ParseNodeSerializeTabular,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import {
  MarkdownRecordType,
  MarkdownRecordTagType,
  TaggedStringType
} from "./dataadapter";
import {
  ISectionFillinVariant,
  ISectionFillinVariantInitializer,
  ISectionFillinItemInitializer,
  ITerminalContent,
  ITerminalInfoInitializer,
  IFillinTerminalMeta,
  SectionVariantEnumType,
  SectionFillinFormatType,
  TerminalMetaEnumType
} from "./pageContentType";
import { GetSectionNode } from "./parsesectiondispatch";
import { ITerminalNode } from "./parseterminals";
import { IPageNode } from "./parsepages";
import { ISectionNode } from "./parsesections";
import { SectionParseNode_LIST } from "./parsesections";
import { ISentenceNode, SentenceNode } from "./parsesentences";
export class SectionParseNode_FILLIN extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating paragraph section");
  }
  type = SectionVariantEnumType.fillin;
  meta: ISectionFillinVariant = ISectionFillinVariantInitializer();
  parse() {
    //this.logger.diagnosticMode = true;
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `Undefined datasource encountered`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `Undefined record encountered`);

      assert(
        current.recordType === MarkdownRecordType.FILLIN,
        `Expected "${MarkdownRecordTagType.FILLIN}" at line ${current.lineNo}`
      );
      // See sectionFillinVariant
      try {
        let args: string[] = current.content.split(",").map(arg => arg.trim());
        if (IsDefined(args[0])) this.meta.title = args[0].trim();
        if (IsDefined(args[1])) this.meta.label = args[1].trim();
        if (IsDefined(args[2]) && args[2] in SectionFillinFormatType) {
          this.meta.format = args[2] as SectionFillinFormatType;
        }
        this.meta.allowUserFormatting = SetArgBoolean(
          args[3],
          this.meta.allowUserFormatting
        );
        this.meta.sortOrder = SetArgBoolean(args[4], this.meta.sortOrder);
        this.meta.groupDuplicates = SetArgBoolean(
          args[5],
          this.meta.groupDuplicates
        );
        this.meta.gridColumns = SetArgWholeNumber(
          args[6],
          this.meta.gridColumns
        );
        this.meta.showCategoryHint = SetArgBoolean(
          args[7],
          this.meta.showCategoryHint
        );
        this.meta.includeCategory = SetArgBoolean(
          args[8],
          this.meta.includeCategory
        );
        this.meta.allowReset = SetArgBoolean(args[9], this.meta.allowReset);
        this.meta.showReferenceCount = SetArgBoolean(
          args[10],
          this.meta.showReferenceCount
        );

        this.meta.sectionFillinIdx =
          this.userContext.fillins.push(
            ISectionFillinItemInitializer(
              IDX_INITIALIZER,
              this.meta.format,
              this.meta.allowUserFormatting,
              this.meta.groupDuplicates,
              this.meta.sortOrder,
              this.meta.gridColumns,
              this.meta.allowReset,
              this.meta.showReferenceCount
            )
          ) - 1;
        for (
          current = this.dataSource.nextRecord();
          !this.dataSource.EOF() &&
          current.recordType !== MarkdownRecordType.FILLIN_END;
          current = this.dataSource.currentRecord()
        ) {
          let sectionNode: ISectionNode = GetSectionNode(
            current.recordType,
            this
          );
          this.meta.prompts.push(sectionNode);
          this.logger.diagnostic(
            `pushed section=${current.recordType} ${sectionNode.constructor.name} ${current.content}`
          );
          sectionNode.parse();
          //        current = this.dataSource.currentRecord();

          if (current.recordType === MarkdownRecordType.PARAGRAPH_END) {
            //////////
            // Presumably, PARAGRAPH created sectionList entry already
            //////////
            // this.lastTermIdx = this.userContext.terminals.lastIdx;
            // this.id =
            //   this.userContext.sections.
            //     )
            //   ) - 1;
            // for (let idx = this.firstTermIdx; idx <= this.lastTermIdx; idx++) {
            //   this.userContext.terminals[idx].sectionIdx = this.id;
            // }
            this.dataSource.nextRecord(); // move to next grouping
          }
        }
        if (current.recordType === MarkdownRecordType.FILLIN_END) {
          this.lastTermIdx = this.userContext.terminals.lastIdx;
          // added when addItem was called in parse_terminal_fillin
          ////    this.meta.sectionFillinIdx = this.userContext.fillins.length - 1;
          //     ISectionFillinItemInitializer(this.meta.groupDuplicates, true, [])
          //   ) - 1;

          // this.id =
          //   this.userContext.sections.push(
          //     ISectionImageEntryInitializer(
          //       this.firstTermIdx,
          //       this.lastTermIdx,
          //       this.type.toString()
          //     )
          //   ) - 1;
          ////        for (let idx = this.firstTermIdx; idx <= this.lastTermIdx; idx++) {
          ////          this.userContext.terminals[idx].sectionIdx = this.id;
          ////        }
          this.dataSource.nextRecord(); // move to next grouping
        }
        ///////////////////
        // get sectionFillinIdx AND the fillinTermIdx within the sectionFillin
      } catch (e) {
        this.logger.warning((e as Error).message);
      }
      this.dataSource.nextRecord(); // move to next grouping
      // }
    } catch (e) {
      this.dataSource.nextRecord(); // move to next grouping
      if (IsError(e)) {
        this.logger.error(e.message);
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
        outputStr = `${super.serialize(format, label, prefix)}: "${
          this.meta.title
        }", "${this.meta.label}", sectionFillinIdx=${
          this.meta.sectionFillinIdx
        }, format=${this.meta.format}, sort=${this.meta.sortOrder}, groupDups=${
          this.meta.groupDuplicates
        }, showHints=${this.meta.showCategoryHint}, gridColumns=${
          this.meta.gridColumns
        }, allowReset=${this.meta.allowReset}`;
        // if (
        //   this.meta.sectionFillinIdx >= 0 &&
        //   this.userContext.fillins[this.meta.sectionFillinIdx] !== undefined
        // ) {
        //   let fillinList: IFillinItem[] = this.userContext.fillins[
        //     this.meta.sectionFillinIdx
        //   ].fillinList;
        for (const [i, prompt] of this.meta.prompts.entries()) {
          let sectionNode: ISectionNode = prompt as ISectionNode;
          outputStr = `${outputStr}${sectionNode.serialize(
            format,
            `prompts: (${prompt.type})`,
            prefix + "| " + (i < this.meta.prompts.length - 1 ? "| " : "  ")
          )}`;
        }
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
