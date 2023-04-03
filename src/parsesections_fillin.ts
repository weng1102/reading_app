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
import { SortOrderToLabel } from "./baseClasses";
import {
  SectionFillinHelpPresetInfo,
  SectionFillinHelpPresetMap,
  SectionFillinHelpPresetLevel,
  SectionFillinHelpPresetName,
  ISectionFillinVariant,
  ISectionFillinVariantInitializer,
  ISectionFillinItemInitializer,
  SectionVariantEnumType,
  SectionFillinLayoutType,
  SectionFillinSortOrder
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
  parse() {
    const validateArgs = (argString: string, lineNo: number) => {
      /*
        [0]  preset index in application config help levels from
             FillinHelpPresetLevel. FillinHelpPresetLevel.override allows
             author to specify custom ISectionFillinHelpSetting in fillin
             header.
        [1]  show help presets with initial setting defined above.

        The next set of parameters are related to formatting help settings
        [2]  prompts columns
        [3]  allowReset

        The next set of parameters are author definition of help setting
        [4]  responses label
        [5]  prompts label such as instructions
        [6]  layout { grid | bulleted list | csv }
             trailing must include extraneous answers e.g., yes vs no.
        [7]  response grid columns as number (only with layout=grid)
        [8]  sort order { a[lphabetical] | i[nsertOrder] (default) | r[andom] }
        [9] unique only: boolean, remove duplicate responses and refCount++
        [10] showReferenceCount: boolean, shows in responses iff <> 1
        [11] groupByCategory: boolean, groups responses by category e.g., verbs
        [12]  showResponseHints: boolean, show hints within responses
        [13] showPromptHints: boolean, show hints within prompts
        [14] showResponsesInPrompts: boolean, show responwses initially filled
             in)
        */
      let args: string[] = argString.split(",").map(arg => arg.trim());
      let argNum = 0;
      // consider try/catch
      let argLevel: SectionFillinHelpPresetLevel;
      if (args[argNum] in SectionFillinHelpPresetName) {
        argLevel =
          SectionFillinHelpPresetMap[<SectionFillinHelpPresetName>args[argNum]];
      } else if (args[argNum] in SectionFillinHelpPresetLevel) {
        argLevel = +args[argNum] as SectionFillinHelpPresetLevel;
      } else {
        argLevel = this.meta.helpPresetLevel;
      }
      this.meta.helpPresetLevel = ValidateArg(
        argLevel in SectionFillinHelpPresetLevel,
        // +args[argNum] >= SectionFillinHelpPresetLevel.least &&
        //   +args[argNum] <= SectionFillinHelpPresetLevel.most,
        "preset level",
        argLevel.toString(),
        this.meta.helpPresetLevel,
        argNum,
        lineNo,
        this.logger
      ) as SectionFillinHelpPresetLevel;

      argNum++;
      this.meta.showHelpPresets = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show help presets",
        args[argNum],
        this.meta.showHelpPresets,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

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
      this.meta.promptColumns = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "prompt columns",
        args[argNum],
        this.meta.promptColumns,
        argNum,
        lineNo,
        this.logger
      ) as number;

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
      this.meta.authorHelpSetting.responsesLabel = ValidateArg(
        args[argNum].length > 0,
        "responses label",
        args[argNum],
        this.meta.authorHelpSetting.responsesLabel,
        argNum,
        lineNo,
        this.logger
      ) as string;

      argNum++;
      this.meta.authorHelpSetting.promptsLabel = ValidateArg(
        args[argNum].length > 0,
        "prompts label",
        args[argNum],
        this.meta.authorHelpSetting.promptsLabel,
        argNum,
        lineNo,
        this.logger
      ) as string;

      argNum++;
      this.meta.authorHelpSetting.layout = ValidateArg(
        args[argNum] in SectionFillinLayoutType,
        "layout",
        args[argNum],
        this.meta.authorHelpSetting.layout,
        argNum,
        lineNo,
        this.logger
      ) as SectionFillinLayoutType;

      argNum++;
      this.meta.authorHelpSetting.gridColumns = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "grid columns",
        args[argNum],
        this.meta.authorHelpSetting.gridColumns,
        argNum,
        lineNo,
        this.logger
      ) as number;

      argNum++;
      this.meta.authorHelpSetting.sortOrder = ValidateArg(
        args[argNum] in SectionFillinSortOrder,
        "sort order",
        args[argNum],
        this.meta.authorHelpSetting.sortOrder,
        argNum,
        lineNo,
        this.logger
      ) as SectionFillinSortOrder;

      argNum++;
      this.meta.authorHelpSetting.unique = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "unique",
        args[argNum],
        this.meta.authorHelpSetting.unique,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.authorHelpSetting.showReferenceCount = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show reference count",
        args[argNum],
        this.meta.authorHelpSetting.showReferenceCount,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.authorHelpSetting.groupByCategory = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "group by category",
        args[argNum],
        this.meta.authorHelpSetting.groupByCategory,
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
      this.meta.authorHelpSetting.showResponseHints = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show response hints",
        args[argNum],
        this.meta.authorHelpSetting.showResponseHints,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.authorHelpSetting.showPromptHints = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show prompt hints",
        args[argNum],
        this.meta.authorHelpSetting.showPromptHints,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.authorHelpSetting.showResponsesInPrompts = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show responses in prompts",
        args[argNum],
        this.meta.authorHelpSetting.showResponsesInPrompts,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      this.logger.diagnostic(`Validated ${argNum} parameters`);

      argNum++;
      this.meta.authorHelpSetting.helpfulness = helpfulnessLevel(
        this.meta.authorHelpSetting
      );
    };
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `Undefined datasource encountered`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `Undefined record encountered`);

      assert(
        current.recordType === MarkdownRecordType.FILLIN,
        `expected "${MarkdownRecordTagType.FILLIN}" at line ${current.lineNo}`
      );
      validateArgs(current.content, current.lineNo);
      this.meta.sectionFillinIdx =
        this.userContext.fillins.push(
          ISectionFillinItemInitializer(
            IDX_INITIALIZER,
            this.meta.showHelpPresets,
            this.meta.helpPresetLevel,
            this.meta.authorHelpSetting,
            this.meta.authorHelpSetting,
            this.meta.allowReset,
            this.meta.promptColumns
            // this.meta.showPrompts
          )
        ) - 1;
      for (
        current = this.dataSource.nextRecord();
        !this.dataSource.EOF() &&
        current.recordType !== MarkdownRecordType.FILLIN_END;
        current = this.dataSource.currentRecord() // update based on parse()
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
        outputStr = `${super.serialize(
          format,
          label,
          prefix
        )}: authorHelpPreset=${this.meta.helpPresetLevel}, ${
          this.meta.showHelpPresets ? "showHelpPresets" : ""
        }, promptColumns=${this.meta.promptColumns}, ${
          this.meta.allowReset ? "allowReset" : ""
        }, response:"${this.meta.authorHelpSetting.responsesLabel}", prompt:"${
          this.meta.authorHelpSetting.promptsLabel
        }", ${this.meta.authorHelpSetting.layout}, gridColumns=${
          this.meta.authorHelpSetting.gridColumns
        }, ${SortOrderToLabel(this.meta.authorHelpSetting.sortOrder)}, ${
          this.meta.authorHelpSetting.unique ? "unique" : ""
        },${
          this.meta.authorHelpSetting.showReferenceCount
            ? "showReferenceCount"
            : ""
        }, ${
          this.meta.authorHelpSetting.groupByCategory ? "groupByCategory" : ""
        }, ${
          this.meta.authorHelpSetting.showResponseHints
            ? "showResponseHints"
            : ""
        }, ${
          this.meta.authorHelpSetting.showPromptHints ? "showPromptHints" : ""
        },  promptColumns=${this.meta.promptColumns}, ${
          this.meta.authorHelpSetting.showPromptHints ? "showPromptHints" : ""
        }, priority=${this.meta.authorHelpSetting.helpfulness}, ${
          this.meta.authorHelpSetting.showResponsesInPrompts
            ? "showResponsesInPrompts"
            : ""
        }, sectionFillinIdx=${this.meta.sectionFillinIdx}, `;
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
