/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: parseterminaldispatch.ts
 *
 * Map markup type to terminal objects.
 *
 * Version history:
 *
 **/
import { strict as assert } from "assert";
import { AcronymMap } from "./utilities";
import { MarkupLabelType, TokenType, Token } from "./tokenizer";
import { ISentenceNode } from "./parsesentences";
import {
  ITerminalNode,
  TerminalNode_WORD,
  TerminalNode_NUMBER,
  TerminalNode_SYMBOL,
  TerminalNode_PUNCTUATION,
  TerminalNode_MLTAG,
  TerminalNode_MLTAG_CONTRACTION,
  TerminalNode_MLTAG_END,
  TerminalNode_MLTAG_SELFCLOSING,
  TerminalNode_MLTAG_NUMERALS,
  TerminalNode_MLTAG_NUMBER_WITHCOMMAS,
  TerminalNode_TBD,
  TerminalNode_MLTAG_TIME,
  TerminalNode_MLTAG_TOKEN,
  TerminalNode_MLTAG_USD,
  TerminalNode_WHITESPACE,
  TerminalNode_PASSTHRUTAG
} from "./parseterminals";
import { TerminalNode_MLTAG_FILLIN } from "./parseterminals_fillin";
import { TerminalNode_ACRONYM } from "./parseterminals_acronym";
import {
  TerminalNode_MLTAG_DATE1,
  TerminalNode_MLTAG_DATE2,
  TerminalNode_MLTAG_DATE3
} from "./parseterminals_dates";
import { TerminalNode_MLTAG_PHONENUMBER } from "./parseterminals_phonenumber";
import { TerminalNode_MLTAG_IMAGE } from "./parseterminals_image";
import { TerminalNode_MLTAG_LINK } from "./parseterminals_link";
import { TerminalNode_MLTAG_EMAILADDRESS } from "./parseterminals_emailaddress";
export function GetTerminalNode(
  token: Token,
  parent: ISentenceNode
): ITerminalNode {
  let termNode = new TerminalNode_TBD(parent);
  switch (token.type) {
    case TokenType.MLTAG: {
      switch (token.content.toLowerCase()) {
        case MarkupLabelType.EMAILADDRESS: {
          termNode = new TerminalNode_MLTAG_EMAILADDRESS(parent);
          break;
        }
        case MarkupLabelType.PHONENUMBER: {
          termNode = new TerminalNode_MLTAG_PHONENUMBER(parent);
          break;
        }
        case MarkupLabelType.TIME: {
          termNode = new TerminalNode_MLTAG_TIME(parent);
          break;
        }
        case MarkupLabelType.DATE1: {
          termNode = new TerminalNode_MLTAG_DATE1(parent);
          break;
        }
        case MarkupLabelType.DATE2: {
          termNode = new TerminalNode_MLTAG_DATE2(parent);
          break;
        }
        case MarkupLabelType.DATE3: {
          termNode = new TerminalNode_MLTAG_DATE3(parent);
          break;
        }
        case MarkupLabelType.FILLIN: {
          termNode = new TerminalNode_MLTAG_FILLIN(parent);
          break;
        }
        case MarkupLabelType.EM: {
          termNode = new TerminalNode_PASSTHRUTAG(parent);
          break;
        }
        case MarkupLabelType.STRONG: {
          termNode = new TerminalNode_PASSTHRUTAG(parent);
          break;
        }
        case MarkupLabelType.CONTRACTION: {
          termNode = new TerminalNode_MLTAG_CONTRACTION(parent);
          break;
        }
        case MarkupLabelType.IMAGE: {
          termNode = new TerminalNode_MLTAG_IMAGE(parent);
          break;
        }
        case MarkupLabelType.LINK: {
          termNode = new TerminalNode_MLTAG_LINK(parent);
          break;
        }
        case MarkupLabelType.NUMERALS: {
          termNode = new TerminalNode_MLTAG_NUMERALS(parent);
          break;
        }
        case MarkupLabelType.NUMBER_WITHCOMMAS: {
          termNode = new TerminalNode_MLTAG_NUMBER_WITHCOMMAS(parent);
          break;
        }
        case MarkupLabelType.TOKEN: {
          termNode = new TerminalNode_MLTAG_TOKEN(parent);
          break;
        }
        case MarkupLabelType.USD: {
          termNode = new TerminalNode_MLTAG_USD(parent);
          break;
        }
        default: {
          termNode = new TerminalNode_TBD(parent);
          assert(`Encountered undefined token type=${token.content}`);
          break;
        }
      }
      break;
    }
    case TokenType.MLTAG_END: {
      switch (token.content.toLowerCase()) {
        case MarkupLabelType.EM_CLOSE: {
          termNode = new TerminalNode_PASSTHRUTAG(parent);
          break;
        }
        case MarkupLabelType.STRONG_CLOSE: {
          termNode = new TerminalNode_PASSTHRUTAG(parent);
          break;
        }
        case MarkupLabelType.CUELIST_CLOSE: {
          termNode = new TerminalNode_PASSTHRUTAG(parent);
          break;
        }
        default:
          console.log(`invalid MLTAG_END ${token.content.toLowerCase()}`);
      }
      break;
    }
    case TokenType.WORD: {
      if (
        token.content === token.content.toUpperCase() &&
        AcronymMap.has(token.content.toUpperCase())
      ) {
        termNode = new TerminalNode_ACRONYM(parent);
      } else {
        termNode = new TerminalNode_WORD(parent);
      }
      break;
    }
    case TokenType.SYMBOL: {
      termNode = new TerminalNode_SYMBOL(parent);
      break;
    }
    case TokenType.PUNCTUATION: {
      termNode = new TerminalNode_PUNCTUATION(parent);
      break;
    }
    // case TokenType.MLTAG: {
    //   termNode = new TerminalNode_MLTAG(parent);
    //   break;
    // }
    // case TokenType.MLTAG_END: {
    //   termNode = new TerminalNode_MLTAG_END(parent);
    //   break;
    // }
    case TokenType.MLTAG_SELFCLOSING: {
      termNode = new TerminalNode_MLTAG_SELFCLOSING(parent);
      break;
    }
    case TokenType.WHITESPACE: {
      termNode = new TerminalNode_WHITESPACE(parent);
      break;
    }
    case TokenType.NUMBER: {
      termNode = new TerminalNode_NUMBER(parent);
      break;
    }
    default: {
      assert(token !== undefined, `undefined token type ${token.type}`);
      break;
    }
  }
  return termNode;
}
