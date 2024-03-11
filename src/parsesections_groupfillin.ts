/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_fillin_groups.ts
 *
 * Create grouping of section fillin objects from serialized input. this
 * object DOES NOT create an object itself but instead creates multiple
 * separate section fillins.
 *
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import {
  IsValidBooleanString,
  IsDefined,
  IsError,
  IsValidWholeNumberString,
  ValidateArgBoolean,
  ValidateArgWholeNumber,
  ValidateArgString,
  ValidateArg,
  ValidationArgMsg
} from "./utilities";
import {
  IDX_INITIALIZER,
  ParseNodeSerializeTabular,
  ParseNodeSerializeFormatEnumType,
  helpfulnessLevel
} from "./baseclasses";
import {
  MarkdownRecordType,
  MarkdownRecordTagType,
  TaggedStringType
} from "./dataadapter";
// import { SortOrderToLabel } from "./baseClasses";
import {
  SectionFillinPresetInfo,
  SectionFillinPresetMap,
  SectionFillinPresetLevel,
  SectionFillinPresetName,
  ISectionFillinVariant,
  // ISectionFillinItemInitializer,
  // ISectionFillinVariantInitializer,
  ISectionGroupFillinVariant,
  ISectionGroupFillinVariantInitializer,
  SectionVariantEnumType,
  SectionFillinLayoutType,
  // SectionFillinSortOrder,
  SectionFillinResponsesProgressionEnum
} from "./pageContentType";
import { GetSectionNode } from "./parsesectiondispatch";
import { IPageNode } from "./parsepages";
import { ISectionNode } from "./parsesections";
import { SectionParseNode_LIST } from "./parsesections";
import { SectionParseNode_FILLIN } from "./parsesections_fillin";
export class SectionParseNode_GROUPFILLIN extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating paragraph section");
  }
  type = SectionVariantEnumType.group_fillin;
  meta: ISectionGroupFillinVariant = ISectionGroupFillinVariantInitializer();
  parse() {
    const validateArgs = (argString: string, lineNo: number) => {
      /*
      This set of parameters are related to formatting section size
      [0]  prompts per section (to accommodate screen pagination and
           response grid/list size)
      [1]  user can override at render time
      [2]  section label assumes ordinal tag can be substituted for string
           template formatted string i.e., ${}
      [3]  randomize order at render time

        */
      let args: string[] = argString.split(",").map(arg => arg.trim());

      let argNum = 0;
      this.meta.promptsPerSubsection = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "max prompts per section",
        args[argNum],
        this.meta.promptsPerSubsection,
        argNum,
        lineNo,
        this.logger
      ) as number;

      argNum++;
      this.meta.subsectionLabel = ValidateArg(
        args[argNum] !== undefined &&
          args[argNum] !== null &&
          args[argNum].length >= 0,
        "subsection label",
        args[argNum],
        this.meta.subsectionLabel,
        argNum,
        lineNo,
        this.logger
      ) as string;
      this.logger.diagnostic(`Validated ${argNum} parameters`);

      argNum++;
      this.meta.randomize = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "randomize items",
        args[argNum],
        this.meta.randomize,
        argNum,
        lineNo,
        this.logger
      ) as boolean;
      this.logger.diagnostic(`Validated ${argNum} parameters`);
    };

    this.logger.diagnostic(`${this.constructor.name}`);
    //loop
    //create sectionNode_section_fillin
    //    return parseSubsection(offset: number, count: number)

    try {
      assert(this.dataSource !== undefined, `Undefined datasource encountered`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `Undefined record encountered`);

      assert(
        current.recordType === MarkdownRecordType.GROUPFILLIN,
        `expected "${MarkdownRecordTagType.GROUPFILLIN}" at line ${current.lineNo}`
      );
      validateArgs(current.content, current.lineNo);
      current = this.dataSource.nextRecord();
      assert(
        current.recordType === MarkdownRecordType.FILLIN,
        `expected "${MarkdownRecordTagType.FILLIN}" at line ${current.lineNo}`
      );

      // let subsectionCount: number = 1;
      let sectionNode: SectionParseNode_FILLIN;
      // let currentIdx: number;
      // let subsectionLabel: string
      //      let offset: number = 0;
      // let count: number = this.maxPromptsPerSubsection;
      //////////////////////////
      let subsectionOrdinal: number;
      for (
        subsectionOrdinal = 1;
        // current = this.dataSource.nextRecord()
        !this.dataSource.EOF() &&
        current.recordType !== MarkdownRecordType.GROUPFILLIN_END;
        current = this.dataSource.currentRecord(), subsectionOrdinal++ // update based on parse()
      ) {
        sectionNode = GetSectionNode(
          current.recordType,
          this
        ) as SectionParseNode_FILLIN;
        let subsectionOrdinal: number = this.meta.prompts.push(sectionNode);

        //        this.dataSource.setCurrentIdx(firstFillinSectionIdx);
        // console.log(
        //   `parseSubsection(${subsectionOrdinal},${this.meta.promptsPerSubsection})`
        // );
        sectionNode.parseSubsection(
          subsectionOrdinal,
          this.meta.promptsPerSubsection,
          `Part ${subsectionOrdinal}` // could be string teamplate
        );
        this.logger.diagnostic(
          `pushed section=${current.recordType} ${sectionNode.constructor.name} ${current.content}`
        );
        ///        this.dataSource.nextRecord(); // move to next grouping
      }
      assert(
        current.recordType === MarkdownRecordType.FILLIN_END,
        `expected "${MarkdownRecordTagType.FILLIN_END}" at line ${current.lineNo}`
      );
      current = this.dataSource.nextRecord(); // move to next grouping
      assert(
        current.recordType === MarkdownRecordType.GROUPFILLIN_END,
        `expected "${MarkdownRecordTagType.GROUPFILLIN_END}" at line ${current.lineNo}`
      );

      // //////////////////////////////
      //       {
      //         current.recordType !== MarkdownRecordType.FILLIN;
      //
      //         sectionNode = GetSectionNode(
      //           current.recordType,
      //           this
      //         ) as SectionParseNode_FILLIN;
      //         sectionNode.meta.subsectionOffset =
      //           (subsectionCount - 1) * this.meta.promptsPerSubsection;
      //         sectionNode.meta.subsectionCount = this.meta.promptsPerSubsection;
      //         sectionNode.meta.subsectionLabel = `Part ${subsectionCount}`;
      //         sectionNode.parse();
      //         //sectionNode.Subsection(offset, this.maxPromptsPerSubsection, subsectionLabel);
      //       }
      //       assert(
      //         current.recordType === MarkdownRecordType.FILLIN_END,
      //         `expected "${MarkdownRecordTagType.FILLIN_END}" at line ${current.lineNo}`
      //       );
      //       current = this.dataSource.nextRecord(); // move to next grouping
      //       assert(
      //         current.recordType === MarkdownRecordType.FILLINGROUP_END,
      //         `expected "${MarkdownRecordTagType.FILLINGROUP}" at line ${current.lineNo}`
      //       );
    } catch (e) {
      // should advance current record passed next FILLIN_END to continue
      // parsing in lieu of this error
      if (IsError(e)) {
        this.logger.error(e.message);
        for (
          let current = this.dataSource.nextRecord();
          !this.dataSource.EOF() &&
          current.recordType !== MarkdownRecordType.FILLIN_END;
          current = this.dataSource.nextRecord()
        ) {
          this.logger.diagnostic(
            `looking for ${MarkdownRecordType.FILLIN_END} at ${current.lineNo}`
          );
        }
        this.dataSource.nextRecord(); // skip FILLIN_END
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
        outputStr = `${super.serialize(
          format,
          label,
          prefix
        )}: promptsPerSubection=${
          this.meta.promptsPerSubsection
        }, subsectionLabel=${this.meta.subsectionLabel}`;
        for (const [i, prompt] of this.meta.prompts.entries()) {
          let sectionNode: ISectionNode = prompt as ISectionNode;
          outputStr = `${outputStr}${sectionNode.serialize(
            format,
            `prompts: (${prompt.type})`,
            prefix + (i < this.meta.prompts.length - 1 ? "| " : "  ")
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
