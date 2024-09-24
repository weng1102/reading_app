/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: parseterminals_image.ts
 *
 * Create terminalimage objects from serialized input.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import {
  IsError,
  IsDefined,
  FileExists,
  IsValidWholeNumberString,
  ValidateArg
} from "./utilities";
import {
  ParseNodeSerializeFormatEnumType,
  ParseNodeSerializeColumnWidths
} from "./baseclasses";
import {
  endMarkupTag,
  isValidMarkupTag,
  tokenizeParameterList,
  TokenListType,
  TokenLiteral,
  Token,
  TokenType,
  MarkupLabelType
} from "./tokenizer";
import {
  TerminalMetaEnumType,
  IImageTerminalMeta,
  IImageTerminalMetaInitializer,
  ILinkListItemInitializer,
  LinkIdxDestinationType
  // ITerminalInfoInitializer,
  // ITerminalListItemInitializer
} from "./pageContentType";
import { ISentenceNode } from "./parsesentences";
import { ITerminalNode, TerminalNode_MLTAG_ } from "./parseterminals";
export class TerminalNode_MLTAG_IMAGE extends TerminalNode_MLTAG_
  implements ITerminalNode {
  constructor(parent: ISentenceNode) {
    super(parent);
    Object.defineProperty(this, "userContext", { enumerable: false });
  }
  type = TerminalMetaEnumType.image;
  meta: IImageTerminalMeta = IImageTerminalMetaInitializer();
  parse(tokenList: TokenListType): number {
    const dir: string = `reading-companion\\`;
    const imgDir: string = `${dir}img\\`;
    const isValidImageFile = (fileName: string, lineNo: number): boolean => {
      if (FileExists(`${imgDir}${fileName}`)) {
      } else {
        this.logger.warning(
          `Image file ${this.meta.overlay} specified at line ${lineNo} does not exist (yet?)`
        );
      }
      return true; // alsways true since image may yet exist
    };
    const isValidImageOverlay = (fileName: string, lineNo: number): boolean => {
      if (FileExists(`${imgDir}${fileName}`)) {
        if (fileName.split(".").pop() === "png") {
          this.logger.warning(
            `Image overlay file ${this.meta.overlay} should be .png at line ${lineNo}`
          );
        }
      } else {
        this.logger.warning(
          `Image file ${this.meta.overlay} specified at line ${lineNo} does not exist (yet?)`
        );
      }
      return true;
    };
    try {
      // catch undefined runtime assertion
      let startTag = tokenList[0].content;
      //      this.logger.diagnosticMode = true;
      let token: Token | undefined = tokenList[0];

      assert(
        tokenList.length >= 10,
        `Expected at least 10 tokens parsing image token at line ${token.lineNo}`
      );
      assert(
        isValidMarkupTag(startTag),
        `Expected valid markup tag but ecnountered "${startTag}" parsing image token at line ${token.lineNo}`
      );
      assert(
        startTag.toLowerCase === MarkupLabelType.IMAGE.toLowerCase,
        `Expected markup tag ${MarkupLabelType.IMAGE.toLowerCase} but encountered "${startTag}" parsing image token at line ${token.lineNo}`
      );
      tokenList.shift(); // discard startTag
      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.EXCLAMATION,
        `Expected "${TokenLiteral.EXCLAMATION}" but encountered "${token.content}" while parsing image token at line ${token.lineNo}`
      );
      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.LBRACKET,
        `Expected "${TokenLiteral.LBRACKET}" but encountered "${token.content}" while parsing image token at line ${token.lineNo}`
      );
      let label: string = "";
      for (
        token = tokenList.shift()!;
        token !== undefined && token.content !== TokenLiteral.RBRACKET;
        token = tokenList.shift()!
      ) {
        label += token.content;
      }
      assert(
        token.content === TokenLiteral.RBRACKET,
        `Expected ${TokenLiteral.RBRACKET} but encountered "${token.content}" while parsing image token at line ${token.lineNo}`
      );
      this.meta.label = label;
      this.content = label;
      token = tokenList.shift()!;
      assert(
        token.content === TokenLiteral.LPAREN,
        `Expected "${TokenLiteral.LPAREN} but encountered "${token.content}" while parsing image token at line ${token.lineNo}`
      );
      let src: string = "";
      for (
        token = tokenList.shift()!;
        token !== undefined && token.content !== TokenLiteral.RPAREN;
        token = tokenList.shift()!
      ) {
        src += token.content;
      }
      assert(
        token.content === TokenLiteral.RPAREN,
        `Expected right parenthesis but encountered "${token.content}" while parsing image at line ${token.lineNo}`
      );
      let args: string[] = tokenizeParameterList(src);
      // let chunks: string[] = tokenizeParameterList(src);

      let argNum: number = 0;
      this.meta.src = ValidateArg(
        isValidImageFile(args[argNum], token.lineNo),
        "image",
        args[argNum],
        this.meta.src,
        argNum,
        token.lineNo,
        this.logger
      ) as string;

      argNum++;
      this.meta.overlay = ValidateArg(
        isValidImageOverlay(args[argNum], token.lineNo),
        "image overlay",
        args[argNum],
        this.meta.overlay,
        argNum,
        token.lineNo,
        this.logger
      ) as string;

      argNum++;
      this.meta.width = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "width",
        args[argNum],
        this.meta.width,
        argNum,
        token.lineNo,
        this.logger
      ) as number;

      argNum++;
      this.meta.height = ValidateArg(
        IsValidWholeNumberString(args[argNum]),
        "height",
        args[argNum],
        this.meta.height,
        argNum,
        token.lineNo,
        this.logger
      ) as number;

      argNum++;
      this.meta.attributes = ValidateArg(
        IsDefined(args[argNum]),
        "attribute",
        args[argNum],
        this.meta.attributes,
        argNum,
        token.lineNo,
        this.logger
      ) as string;

      argNum++;
      this.meta.destination.page = ValidateArg(
        IsDefined(args[argNum]),
        "destination page",
        args[argNum],
        this.meta.destination.page,
        argNum,
        token.lineNo,
        this.logger
      ) as string;

      argNum++;
      this.meta.attributes = ValidateArg(
        IsDefined(args[argNum]) && args[argNum] in LinkIdxDestinationType,
        "link destination type",
        args[argNum],
        this.meta.destination.linkIdxType,
        argNum,
        token.lineNo,
        this.logger
      ) as string;

      argNum++;
      if (IsValidWholeNumberString(args[argNum])) {
        let idx = +args[argNum];
        switch (this.meta.destination.linkIdxType) {
          case LinkIdxDestinationType.page:
            // do nothing
            break;
          case LinkIdxDestinationType.heading:
            this.meta.destination.headingIdx = idx;
            break;
          case LinkIdxDestinationType.section:
            this.meta.destination.sectionIdx = idx;
            break;
          case LinkIdxDestinationType.terminal:
            this.meta.destination.terminalIdx = idx;
            break;
        }
      }
      /*
        if (IsDefined(args[argNum])) this.meta.attributes = args[argNum]);
        if (IsDefined(chunks[4])) this.meta.attributes = chunks[4];
      // optional link may be included. Need to explicitly specify a
      // valid linkIdxType.
      //
      if (IsDefined(chunks[5])) this.meta.destination.page = chunks[5].trim();
      if (IsDefined(chunks[6]) && chunks[6] in LinkIdxDestinationType) {
        this.meta.destination.linkIdxType = chunks[6] as LinkIdxDestinationType;

      if (IsDefined(chunks[2])) this.meta.width = +chunks[2]; // no units;
      assert(
        Number(chunks[2]) !== NaN,
        `Expected a numeric width but encountered "${chunks[2]}" while parsing image link at line ${token.lineNo}`
      );
      if (IsDefined(chunks[3])) this.meta.height = +chunks[3]; // no units; assumed px
      assert(
        Number(chunks[3]) !== NaN,
        `Expected a numeric height but encountered "${chunks[3]}" while parsing image link at line ${token.lineNo}`
      );
      if (IsDefined(chunks[4])) this.meta.attributes = chunks[4];
      // optional link may be included. Need to explicitly specify a
      // valid linkIdxType.
      //
      if (IsDefined(chunks[5])) this.meta.destination.page = chunks[5].trim();
      if (IsDefined(chunks[6]) && chunks[6] in LinkIdxDestinationType) {
        this.meta.destination.linkIdxType = chunks[6] as LinkIdxDestinationType;
        // console.log(
        //   `image link found for ${this.meta.label} src= ${this.meta.src}`
        // );


        if (IsDefined(chunks[7]) && Number(chunks[7]) !== NaN) {
          let idx: number = +chunks[7];
          if (
            this.meta.destination.linkIdxType === LinkIdxDestinationType.page
          ) {
            // do nothing
          } else if (
            this.meta.destination.linkIdxType === LinkIdxDestinationType.heading
          ) {
            // idx is a headingIdx
            this.meta.destination.headingIdx = idx;
          } else if (
            this.meta.destination.linkIdxType === LinkIdxDestinationType.section
          ) {
            this.meta.destination.sectionIdx = idx;
          } else if (
            this.meta.destination.linkIdxType ===
            LinkIdxDestinationType.terminal
          ) {
            this.meta.destination.terminalIdx = idx;
          } else {
          }
        }
*/
      this.meta.linkIdx =
        this.userContext.links.push(
          ILinkListItemInitializer(
            this.meta.label,
            {
              page: this.meta.destination.page,
              directory: dir,
              linkIdxType: this.meta.destination.linkIdxType,
              headingIdx: this.meta.destination.headingIdx,
              sectionIdx: this.meta.destination.sectionIdx,
              terminalIdx: this.meta.destination.terminalIdx
            },
            false // set after linklist parse validates the link info
          )
        ) - 1;
      // }
      token = tokenList.shift()!;
      assert(
        token.content === endMarkupTag(startTag),
        `Expected closing tag "${endMarkupTag(
          startTag
        )}" while parsing image token at line ${token.lineNo}`
      );
    } catch (e) {
      if (IsError(e)) {
        this.logger.error(`${this.constructor.name}: ${e.message}`);
      } else {
        throw e;
      }

      throw e;
    }
    return tokenList.length;
  }
  serialize(
    format?: ParseNodeSerializeFormatEnumType,
    label?: string,
    prefix?: string
  ): string {
    /// serialize only the non-meta fields. Subclasses Should
    /// call this via super.serialize(...).
    let outputStr: string = "";
    //  this.logger.diagnostic(`AbstractTerminalNode: ${this.content}`);
    //    let outputStr1: string = "";
    switch (format) {
      case ParseNodeSerializeFormatEnumType.TREEVIEW: {
        if (prefix === undefined) prefix = "";
        outputStr = super.serialize(format, this.content, prefix);

        prefix = prefix + "| ";
        outputStr +=
          super.serialize(format, `{${this.meta.label}}`, prefix) +
          super.serialize(format, `{${this.meta.src}}`, prefix) +
          super.serialize(format, `{${this.meta.overlay}}`, prefix);

        if (this.meta.width > 0)
          outputStr += super.serialize(
            format,
            `{${this.meta.width}}px x `,
            prefix
          );
        if (this.meta.height > 0)
          outputStr += super.serialize(
            format,
            `{${this.meta.height}px}`,
            prefix
          );
        if (this.meta.attributes.length > 0)
          outputStr += super.serialize(
            format,
            `{${this.meta.attributes}}`,
            prefix
          );
        break;
      }
      case ParseNodeSerializeFormatEnumType.TABULAR: {
        if (label === undefined) label = "";
        if (prefix === undefined) prefix = "";
        outputStr =
          //          " ".padEnd(colWidth0) +
          `${prefix}{${this.content}}`.padEnd(
            ParseNodeSerializeColumnWidths[1]
          ) +
          `${this.constructor.name}`.padEnd(ParseNodeSerializeColumnWidths[2]);
        //        colWidth0 += 2;
        outputStr =
          outputStr +
          `\n${" ".padEnd(2)}${prefix}{${this.meta.label}}\n${" ".padEnd(
            2
          )}${prefix}{${this.meta.src}}\n`;
        break;
      }
      case ParseNodeSerializeFormatEnumType.JSON: {
        outputStr = JSON.stringify(this);
        break;
      }
      case ParseNodeSerializeFormatEnumType.UNITTEST: {
        outputStr = outputStr + JSON.stringify(this);
        break;
      }
      default: {
      }
    }
    return outputStr;
  }
}
