/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: parsesections_ibuttongrid.ts
 *
 * Create section of recitable buttons objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import {
  ParseNodeSerializeTabular,
  ParseNodeSerializeFormatEnumType
} from "./baseclasses";
import { MarkdownRecordType, TaggedStringType } from "./dataadapter";
import { tokenizeParameterList } from "./tokenizer";
import {
  IInlineButtonTerminalMeta,
  ISectionButtonGridVariant,
  ISectionButtonGridVariantInitializer,
  SectionVariantEnumType,
  TerminalMetaEnumType
} from "./pageContentType";
import { ITerminalNode } from "./parseterminals";
import { IPageNode } from "./parsepages";
import { ISectionNode } from "./parsesections";
import { SectionParseNode_GRID } from "./parsesections";
import { ISentenceNode, SentenceNode } from "./parsesentences";
import {
  IsError,
  IsValidBooleanString,
  IsValidString,
  IsValidWholeNumberString,
  ValidateArg
} from "./utilities";
export class SectionParseNode_BUTTONGRID extends SectionParseNode_GRID
  implements ISectionNode {
  constructor(parent: IPageNode | ISectionNode) {
    super(parent);
  }
  type = SectionVariantEnumType.button_grid;
  meta: ISectionButtonGridVariant = ISectionButtonGridVariantInitializer();
  parse() {
    this.logger.diagnostic(`${this.constructor.name}`);
    try {
      assert(this.dataSource !== undefined, `Undefined datasource encountered`);
      let current: TaggedStringType = this.dataSource.currentRecord();
      assert(current !== undefined, `Undefined record encountered`);

      assert(
        current.recordType === MarkdownRecordType.BUTTONGRID,
        `Expected "${MarkdownRecordType.BUTTONGRID}" at line ${current.lineNo}`
      );
      let args: string[] = tokenizeParameterList(current.content).map(arg =>
        arg.trim()
      );
      let argNum: number = 0;
      this.meta.description = ValidateArg(
        IsValidString(args[argNum]),
        "description",
        args[argNum],
        this.meta.description,
        argNum,
        current.lineNo,
        this.logger
      ) as string;
      argNum++;
      this.meta.columnCount = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "column count",
        args[argNum],
        this.meta.columnCount,
        argNum,
        current.lineNo,
        this.logger
      ) as number;
      argNum++;
      this.meta.minColumnWidth = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "minimum column width",
        args[argNum],
        this.meta.minColumnWidth,
        argNum,
        current.lineNo,
        this.logger
      ) as number;
      argNum++;
      this.meta.sorted = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "sorted",
        args[argNum],
        this.meta.sorted,
        argNum,
        current.lineNo,
        this.logger
      ) as boolean;
      argNum++;
      this.meta.groupedBy = ValidateArg(
        IsValidBooleanString(args[argNum]),
        "groupedBy",
        args[argNum],
        this.meta.groupedBy,
        argNum,
        current.lineNo,
        this.logger
      ) as boolean;
      argNum++;
      this.meta.rate = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "rate",
        args[argNum],
        this.meta.rate,
        argNum,
        current.lineNo,
        this.logger
      ) as number;
      // looking for a list of inlineButtons only; otherwise error
      for (
        current = this.dataSource.nextRecord();
        current.recordType !== MarkdownRecordType.BUTTONGRID_END;
        current = this.dataSource.nextRecord()
      ) {
        assert(
          current.recordType === MarkdownRecordType.PARAGRAPH,
          `Expected "${MarkdownRecordType.PARAGRAPH}" but encountered "${current.recordType}" at line ${current.lineNo}`
        );
        current = this.dataSource.nextRecord();
        assert(
          current.recordType === MarkdownRecordType.SENTENCE,
          `Expected "${MarkdownRecordType.SENTENCE}" but encountered "${current.recordType}" at line ${current.lineNo}`
        );
        let sentence: ISentenceNode = new SentenceNode(this);
        sentence.parse();
        // look for mutliple buttons per line
        sentence.terminals.forEach(terminal => {
          if (terminal.type === TerminalMetaEnumType.inlinebutton) {
            let inlineButton = terminal.meta as IInlineButtonTerminalMeta;
            terminal.content = inlineButton.label;
            this.meta.buttons.push(terminal);
          } else if (terminal.type === TerminalMetaEnumType.whitespace) {
            // akip valid separator
          } else {
            this.logger.warning(
              `Expected terminal meta type="${
                TerminalMetaEnumType[TerminalMetaEnumType.inlinebutton]
              }" but encountered "${
                TerminalMetaEnumType[terminal.type]
              }" at line ${
                current.lineNo
              } - Ignored but author should remove it from this ${
                SectionVariantEnumType.button_grid
              }.`
            );
          }
        });
        current = this.dataSource.nextRecord();
        assert(
          current.recordType === MarkdownRecordType.PARAGRAPH_END,
          `Expected "${MarkdownRecordType.PARAGRAPH}" but encountered "${current.recordType}" at line ${current.lineNo}`
        );
      }
      assert(
        current.recordType === MarkdownRecordType.BUTTONGRID_END,
        `Expected "${MarkdownRecordType.BUTTONGRID_END}" but encountered "${current.recordType}" at line ${current.lineNo}`
      );
      if (this.meta.sorted || this.meta.groupedBy) {
        // btw, manage grouped by feature at runtime
        let sortedButtons = [...this.meta.buttons];
        this.meta.buttons = sortedButtons.sort((left, right) => {
          if (left.content.toLowerCase() < right.content.toLowerCase()) {
            return -1;
          } else if (left.content.toLowerCase() > right.content.toLowerCase()) {
            return 1;
          } else {
            return 0;
          }
        });
        this.meta.buttons = [...sortedButtons];
      }
      this.dataSource.nextRecord(); // move to next grouping
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
        label += `: title="${this.meta.title}", sorted=${this.meta.sorted}, groupedBy=${this.meta.groupedBy}, width=${this.meta.buttonWidth}`;
        outputStr = `${super.serialize(format, label, prefix)}`;
        for (const [i, button] of this.meta.buttons.entries()) {
          label = `${button.type}`;
          let buttonX: ITerminalNode = button as ITerminalNode;
          outputStr = `${outputStr}${buttonX.serialize(
            format,
            undefined,
            prefix + (i < this.meta.buttons.length - 1 ? "| " : "  ")
          )}`;
        }
        ///////////
        // label = `button grid: ${this.description}`;
        // outputStr = super.serialize(format, label, prefix);
        // for (const [i, terminal] of this.meta.buttons.entries()) {
        //   label = `${terminal.type}`;
        //   outputStr = `${outputStr}${terminal.serialize(
        //     format,
        //     undefined,
        //     prefix + (i < this.meta.buttons.length - 1 ? "| " : "  ")
        //   )}`;
        // }

        ///////////
        // for (const button of this.meta.buttons) {
        //   if (button.type === TerminalMetaEnumType.inlinebutton) {
        //     const buttonMeta = button.meta as IInlineButtonTerminalMeta;
        //     outputStr = `${outputStr}${super.serialize(
        //       format,
        //       prefix +
        //         `+-button: ${buttonMeta.label} (buttonIdx=${buttonMeta.buttonIdx})`
        //     )}`;
        //   } else {
        //     outputStr = `${outputStr} Unexpected type encountered ${
        //       TerminalMetaEnumType[button.type]
        //     }`;
        //   }
        // }
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
