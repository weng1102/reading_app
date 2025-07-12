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
import { tokenizeParameterList } from "./tokenizer";
// import { SortOrderToLabel } from "./baseClasses";
import {
  SectionFillinPresetInfo,
  SectionFillinPresetMap,
  SectionFillinPresetLevel,
  SectionFillinPresetName,
  ISectionFillinVariant,
  ISectionFillinVariantInitializer,
  ISectionFillinItemInitializer,
  SectionVariantEnumType,
  SectionFillinLayoutType,
  // SectionFillinSortOrder,
  SectionFillinResponsesProgressionEnum
} from "./pageContentType";
import { GetSectionNode } from "./parsesectiondispatch";
import { IPageNode } from "./parsepages";
import { ISectionNode } from "./parsesections";
import { SectionParseNode_LIST } from "./parsesections";
export class SectionParseNode_FILLIN extends SectionParseNode_LIST
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
    //  console.log("creating paragraph section");
  }
  type = SectionVariantEnumType.fillin;
  meta: ISectionFillinVariant = ISectionFillinVariantInitializer();
  subsectionOrdinal: number = 0;
  subsectionInterval: number = 0;
  subsectionLabel: string = "";
  parseSubsection(
    subsectionOrdinal: number = 0,
    subsectionInterval: number = 0,
    subsectionLabel: string = ""
  ): number {
    // sets instance variables then calls parse() below
    this.meta.subsectionOrdinal = subsectionOrdinal;
    this.meta.subsectionInterval = subsectionInterval;
    this.meta.subsectionLabel = subsectionLabel;
    console.log(`parseSubsection(${subsectionOrdinal},${subsectionInterval})`);
    return this.parse();
  }
  parse() {
    const validateArgs = (argString: string, lineNo: number) => {
      /*
      This set of parameters are related to formatting section size
      [0]  preset index in application config help levels from
           FillinHelpPresetLevel. FillinHelpPresetLevel.override allows
           author to specify custom ISectionFillinHelpSetting in fillin
           header.
      [1]  show help preset
      This set of parameters are related to formatting help settings
      [2]  prompts columns
      [3]  allow reset of responses

      This set of parameters are author definition of help setting
      [4]  responses label
      [5]  prompts label such as instructions
      [6]  layout { grid | bulleted list | csv }
           trailing must include extraneous answers e.g., yes vs no.
      [7]  response grid columns as number (only with layout=grid)
      [8]  sort order { a[lphabetical] | i[nsertOrder] (default) | r[andom] }
      [9]  unique only: boolean, remove duplicate responses and refCount++
      [10] showReferenceCount: boolean, shows in responses iff <> 1
      [11] groupByTags: boolean, groups responses by category e.g., verbs
      [12] showResponseTags: boolean, show hints within responses
      [13] showPromptTags: boolean, show hints within prompts
      [14] showResponsesInPrompts: boolean, show responses initially filled
           in)
      [15] helpfulness level?
        */
      let args: string[] = tokenizeParameterList(argString).map(arg =>
        arg.trim()
      );

      let argNum = 0;
      let argLevel: SectionFillinPresetLevel;
      if (args[argNum] in SectionFillinPresetName) {
        argLevel =
          SectionFillinPresetMap[<SectionFillinPresetName>args[argNum]];
      } else if (args[argNum] in SectionFillinPresetLevel) {
        argLevel = +args[argNum] as SectionFillinPresetLevel;
      } else {
        argLevel = this.meta.presetLevel;
      }
      this.meta.presetLevel = ValidateArg(
        argLevel in SectionFillinPresetLevel,
        // +args[argNum] >= SectionFillinHelpPresetLevel.least &&
        //   +args[argNum] <= SectionFillinHelpPresetLevel.most,
        "preset level",
        argLevel.toString(),
        this.meta.presetLevel,
        argNum,
        lineNo,
        this.logger
      ) as SectionFillinPresetLevel;

      argNum++;
      this.meta.showPresets = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show help presets",
        args[argNum],
        this.meta.showPresets,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.promptColumns = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "prompt columns",
        args[argNum],
        this.meta.promptColumns,
        argNum,
        lineNo,
        this.logger
      ) as number;

      // consider try/catch
      // argNum++;
      // this.meta.gridColumns = ValidateArg(
      //   IsValidWholeNumberString(args[argNum]),
      //   "grid columns",
      //   args[argNum],
      //   this.meta.gridColumns,
      //   argNum,
      //   lineNo,
      //   this.logger
      // ) as number;

      argNum++;
      this.meta.allowReset = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "allow reset",
        args[argNum],
        this.meta.allowReset,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.authorSetting.responsesLabel = ValidateArg(
        args[argNum].length >= 0,
        "responses label",
        args[argNum],
        this.meta.authorSetting.responsesLabel,
        argNum,
        lineNo,
        this.logger
      ) as string;

      argNum++;
      this.meta.authorSetting.promptsLabel = ValidateArg(
        args[argNum].length >= 0,
        "prompts label",
        args[argNum],
        this.meta.authorSetting.promptsLabel,
        argNum,
        lineNo,
        this.logger
      ) as string;

      argNum++;
      this.meta.authorSetting.layout = ValidateArg(
        args[argNum] in SectionFillinLayoutType,
        "layout",
        args[argNum],
        this.meta.authorSetting.layout,
        argNum,
        lineNo,
        this.logger
      ) as SectionFillinLayoutType;

      argNum++;
      this.meta.authorSetting.gridColumns = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "grid columns",
        args[argNum],
        this.meta.authorSetting.gridColumns,
        argNum,
        lineNo,
        this.logger
      ) as number;

      argNum++;
      this.meta.authorSetting.progressionOrder = ValidateArg(
        args[argNum] in SectionFillinResponsesProgressionEnum,
        "sort order",
        args[argNum],
        this.meta.authorSetting.progressionOrder,
        argNum,
        lineNo,
        this.logger
      ) as SectionFillinResponsesProgressionEnum;

      argNum++;
      this.meta.authorSetting.unique = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "unique",
        args[argNum],
        this.meta.authorSetting.unique,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.authorSetting.showReferenceCount = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show reference count",
        args[argNum],
        this.meta.authorSetting.showReferenceCount,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.authorSetting.groupByTags = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "group by category",
        args[argNum],
        this.meta.authorSetting.groupByTags,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      // argNum++;
      // this.meta.allowReset = ValidateArg(
      //   IsValidBooleanString(args[argNum]),
      //   "allow reset",
      //   args[argNum],
      //   this.meta.allowReset,
      //   argNum,
      //   lineNo,
      //   this.logger
      // ) as boolean;

      argNum++;
      this.meta.authorSetting.showResponseTags = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show response hints",
        args[argNum],
        this.meta.authorSetting.showResponseTags,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.authorSetting.showPromptTags = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show prompt hints",
        args[argNum],
        this.meta.authorSetting.showPromptTags,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.authorSetting.showResponsesInPrompts = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show responses in prompts",
        args[argNum],
        this.meta.authorSetting.showResponsesInPrompts,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      this.logger.diagnostic(`Validated ${argNum} parameters`);

      argNum++;
      this.meta.authorSetting.helpfulness = helpfulnessLevel(
        this.meta.authorSetting
      );
    };
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(
        this.subsectionInterval !== undefined,
        `Undefined datasource encountered`
      );
      assert(this.dataSource !== undefined, `Undefined datasource encountered`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `Undefined record encountered`);

      // if subsection specified then ignore assertion
      assert(
        current.recordType === MarkdownRecordType.FILLIN,
        `expected "${MarkdownRecordTagType.FILLIN}" at line ${current.lineNo}`
      );
      validateArgs(current.content, current.lineNo);
      this.meta.sectionFillinIdx =
        this.userContext.fillins.push(
          ISectionFillinItemInitializer(
            IDX_INITIALIZER,
            this.meta.showPresets,
            this.meta.presetLevel,
            this.meta.authorSetting,
            this.meta.authorSetting,
            this.meta.allowReset,
            this.meta.promptColumns
            // this.meta.showPrompts
          )
        ) - 1;

      // The following calculation assumes that section fillins are ALWAYS
      // contained within a single record. That is, the dataSource maps
      // directly with the subsection interval.
      // const subsectionOffsetIdx: number =
      //   this.subsectionInterval * (this.subsectionOrdinal - 1) +
      //   this.dataSource.currentIdx();
      // const subsectionEndIdx: number =
      //   this.subsectionInterval > 0
      //     ? subsectionOffsetIdx + this.subsectionInterval
      //     : Number.MAX_VALUE;
      // console.log(`currentIdx=${this.dataSource.currentIdx()}`);
      // console.log(`subsectionOffsetIdx=${subsectionOffsetIdx}`);
      // console.log(`subsectionEndIdx=${subsectionEndIdx}`);
      // let subsectionIdx: number;
      for (
        current = this.dataSource.nextRecord();
        // subsectionIdx = this.dataSource.currentIdx();
        !this.dataSource.EOF() &&
        current.recordType !== MarkdownRecordType.FILLIN_END;
        current = this.dataSource.currentRecord() //, subsectionIdx++ // update based on parse()
      ) {
        // console.log(`subsectionIdx=${subsectionIdx}: ${current.content}`);
        let sectionNode: SectionParseNode_FILLIN = GetSectionNode(
          current.recordType,
          this
        ) as SectionParseNode_FILLIN;
        let sectionIdx: number = this.meta.prompts.push(sectionNode);
        sectionNode.meta.subsectionOrdinal = sectionIdx;
        this.logger.diagnostic(
          `pushed section=${current.recordType} ${sectionNode.constructor.name} ${current.content}`
        );
        // console.log(`sectionMode.type=${sectionNode.type}`);
        sectionNode.parse();
      }
      assert(
        current.recordType === MarkdownRecordType.FILLIN_END,
        `expected "${MarkdownRecordTagType.FILLIN_END}" at line ${current.lineNo}`
      );
      if (current.recordType === MarkdownRecordType.FILLIN_END) {
        this.lastTermIdx = this.userContext.terminals.lastIdx;
        this.dataSource.nextRecord(); // move to next grouping
      }
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
        outputStr = `${super.serialize(format, label, prefix)}: promptColumns=${
          this.meta.promptColumns
        }, authorHelpPreset=${this.meta.presetLevel}, ${
          this.meta.showPresets ? "showHelpPresets" : ""
        }, promptColumns=${this.meta.promptColumns}, ${
          this.meta.allowReset ? "allowReset" : ""
        }, response:"${this.meta.authorSetting.responsesLabel}", prompt: ${
          this.meta.authorSetting.promptsLabel
        }, ${this.meta.authorSetting.layout}, gridColumns=${
          this.meta.authorSetting.gridColumns
        }, ${this.meta.authorSetting.progressionOrder.toString()}, ${
          this.meta.authorSetting.unique ? "unique" : ""
        },${
          this.meta.authorSetting.showReferenceCount ? "showReferenceCount" : ""
        }, ${this.meta.authorSetting.groupByTags ? "groupByTags" : ""}, ${
          this.meta.authorSetting.showResponseTags ? "showResponseTags" : ""
        }, ${
          this.meta.authorSetting.showPromptTags ? "showPromptTags" : ""
        },  promptColumns=${this.meta.promptColumns}, ${
          this.meta.authorSetting.showPromptTags ? "showPromptTags" : ""
        }, priority=${this.meta.authorSetting.helpfulness}, ${
          this.meta.authorSetting.showResponsesInPrompts
            ? "showResponsesInPrompts"
            : ""
        }, sectionFillinIdx=${this.meta.sectionFillinIdx}, subsectionOrdinal=${
          this.meta.subsectionOrdinal
        }`;
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
            `${prompt.type} (of prompts)`,
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
