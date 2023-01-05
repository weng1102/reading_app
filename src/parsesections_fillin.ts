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
  SectionVariantEnumType,
  SectionFillinLayoutType,
  SectionFillinSortOrder,
  sortOrderToLabel
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
        [0]  responses label
        [1]  prompts label such as instructions
        [2]  layout { grid | bulleted list | csv }
        [3]  grid column as number (only with layout=grid)
        [4]  sort order { a[lphabetical] | i[nsertOrder] (default) | r[andom] [c[sv]]}
        [5]  unique only: boolean, remove duplicate responses and refCount++
        [6]  showReferenceCount: boolean, shows in responses iff <> 1
        [7]  groupByCategory: boolean, groups responses by category e.g., verbs
        [8]  allowReset: boolean, allows user to reset responses already spoken
        [9]  showResponseHints: boolean, show hints within responses
        [10] showPromptHints: boolean,show hints within prompts
        [11] allowFormatting: boolean, allow user to change format
        [12] number of columns when displaying prompts
        [13] showPrompts: boolean, show prompt initially filled in)
        */
      let args: string[] = argString.split(",").map(arg => arg.trim());
      let argNum = 0;
      // consider try/catch
      this.meta.responsesLabel = ValidateArg(
        args[argNum].length > 0,
        "responses label",
        args[argNum],
        this.meta.responsesLabel,
        argNum,
        lineNo,
        this.logger
      ) as string;

      argNum++;
      this.meta.promptsLabel = ValidateArg(
        args[argNum].length > 0,
        "prompts label",
        args[argNum],
        this.meta.promptsLabel,
        argNum,
        lineNo,
        this.logger
      ) as string;

      argNum++;
      this.meta.layout = ValidateArg(
        args[argNum] in SectionFillinLayoutType,
        "layout",
        args[argNum],
        this.meta.layout,
        argNum,
        lineNo,
        this.logger
      ) as SectionFillinLayoutType;

      argNum++;
      this.meta.gridColumns = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "grid columns",
        args[argNum],
        this.meta.gridColumns,
        argNum,
        lineNo,
        this.logger
      ) as number;

      argNum++;
      this.meta.sortOrder = ValidateArg(
        args[argNum] in SectionFillinSortOrder,
        "sort order",
        args[argNum],
        this.meta.sortOrder,
        argNum,
        lineNo,
        this.logger
      ) as SectionFillinSortOrder;

      argNum++;
      this.meta.unique = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "unique",
        args[argNum],
        this.meta.unique,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.showReferenceCount = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show reference count",
        args[argNum],
        this.meta.showReferenceCount,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.groupByCategory = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "group by category",
        args[argNum],
        this.meta.groupByCategory,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

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
      this.meta.showResponseHints = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show response hints",
        args[argNum],
        this.meta.showResponseHints,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.showPromptHints = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show prompt hints",
        args[argNum],
        this.meta.showPromptHints,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      argNum++;
      this.meta.allowUserFormatting = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "allow user formatting",
        args[argNum],
        this.meta.allowUserFormatting,
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

      argNum++;
      this.meta.showPrompts = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "show prompts",
        args[argNum],
        this.meta.showPrompts,
        argNum,
        lineNo,
        this.logger
      ) as boolean;

      this.logger.diagnostic(`Validated ${argNum} parameters`);
    };
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
      validateArgs(current.content, current.lineNo);
      this.meta.sectionFillinIdx =
        this.userContext.fillins.push(
          ISectionFillinItemInitializer(
            IDX_INITIALIZER,
            this.meta.layout,
            this.meta.gridColumns,
            this.meta.sortOrder,
            this.meta.unique,
            this.meta.showReferenceCount,
            this.meta.groupByCategory,
            this.meta.allowReset,
            this.meta.showResponseHints,
            this.meta.allowUserFormatting,
            this.meta.promptColumns,
            this.meta.showPrompts
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
        outputStr = `${super.serialize(format, label, prefix)}:response:"${
          this.meta.responsesLabel
        }", prompt:"${this.meta.promptsLabel}",  sectionFillinIdx=${
          this.meta.sectionFillinIdx
        }, ${this.meta.layout}, ${sortOrderToLabel(
          this.meta.sortOrder
        )}, gridColumns=${this.meta.gridColumns}, ${
          this.meta.unique ? "unique" : ""
        },${this.meta.showReferenceCount ? "showReferenceCount" : ""}, ${
          this.meta.showResponseHints ? "showResponseHints" : ""
        }, ${this.meta.groupByCategory ? "groupByCategory" : ""}, ${
          this.meta.showResponseHints ? "showResponseHints" : ""
        }, ${this.meta.showPromptHints ? "showPromptHints" : ""}, ${
          this.meta.allowReset ? "allowReset" : ""
        }, ${
          this.meta.allowUserFormatting ? "allowUserFormatting" : ""
        }, promptColumns=${this.meta.promptColumns}, ${
          this.meta.showPrompts ? "showPrompts" : ""
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
