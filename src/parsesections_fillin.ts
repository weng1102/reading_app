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
  SectionFillinLayoutType,
  SectionFillinSortOrder,
  sortOrderToLabel,
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
      /*
      [0]  response title
      [1]  response label such as instructions
      [2]  layout { grid | bulleted list | csv }
      [3]  grid column as number (only with layout=grid)
      [4]  sort order { a[lphabetical] | i[nsertOrder] (default) | r[andom] }
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
      try {
        let args: string[] = current.content.split(",").map(arg => arg.trim());
        if (IsDefined(args[0])) this.meta.responsesLabel = args[0].trim();
        if (IsDefined(args[1])) this.meta.promptsLabel = args[1].trim();
        if (IsDefined(args[2]) && args[2] in SectionFillinLayoutType) {
          this.meta.layout = args[2] as SectionFillinLayoutType;
        }
        this.meta.gridColumns = SetArgWholeNumber(
          args[3],
          this.meta.gridColumns
        );
        let sortOrder: string = args[4].trim();
        switch (sortOrder[0]) {
          case SectionFillinSortOrder.alphabetical.toString()[0]:
            this.meta.sortOrder = SectionFillinSortOrder.alphabetical;
            break;
          case SectionFillinSortOrder.random.toString()[0]:
            this.meta.sortOrder = SectionFillinSortOrder.random;
            break;
          default:
            this.meta.sortOrder = SectionFillinSortOrder.insert;
            break;
        }
        this.meta.unique = SetArgBoolean(args[5], this.meta.unique);
        this.meta.showReferenceCount = SetArgBoolean(
          args[6],
          this.meta.showReferenceCount
        );
        this.meta.groupByCategory = SetArgBoolean(
          args[7],
          this.meta.groupByCategory
        );
        this.meta.allowReset = SetArgBoolean(args[8], this.meta.allowReset);
        this.meta.showResponseHints = SetArgBoolean(
          args[9],
          this.meta.showResponseHints
        );
        this.meta.showPromptHints = SetArgBoolean(
          args[10],
          this.meta.showPromptHints
        );
        this.meta.allowUserFormatting = SetArgBoolean(
          args[11],
          this.meta.allowUserFormatting
        );
        this.meta.promptColumns = SetArgWholeNumber(
          args[12],
          this.meta.promptColumns
        );
        this.meta.showPrompts = SetArgBoolean(args[13], this.meta.showPrompts);
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
