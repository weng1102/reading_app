/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: parsesectiondispatch.ts
 *
 * Map markdown type to section objects.
 *
 * Version history:
 *
 **/
import { MarkdownRecordType } from "./dataadapter";
//import { MarkdownRecordType, MarkdownSectionTagType } from "./dataadapter";
import { IPageNode } from "./parsepages";
import {
  ISectionNode,
  SectionParseNode_EMPTY,
  SectionParseNode_FILLIN,
  SectionParseNode_TBD
} from "./parsesections";
import { SectionParseNode_IMAGEENTRY } from "./parsesections_images";
import { SectionParseNode_PARAGRAPH } from "./parsesections_paragraph";
import {
  //  SectionParseNode_LIST_ITEMS,
  SectionParseNode_SECTION_ORDERED,
  SectionParseNode_SECTION_UNORDERED,
  SectionParseNode_LISTITEM_ORDERED,
  SectionParseNode_LISTITEM_UNORDERED
} from "./parsesections_listitem";
import { SectionParseNode_BLOCKQUOTE } from "./parsesections_blockquote";
import { SectionParseNode_HEADING } from "./parsesections_heading";

export function GetSectionNode(
  tagType: MarkdownRecordType,
  parent: ISectionNode | IPageNode
): ISectionNode {
  let sectionNode: ISectionNode;
  //  console.log(`dispatch: ${tagType}`);
  switch (tagType) {
    case MarkdownRecordType.HEADING: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType === MarkdownSectionTagType.HEADING}`
      // );
      sectionNode = new SectionParseNode_HEADING(parent);
      break;
    }
    case MarkdownRecordType.PARAGRAPH: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType === MarkdownRecordType.PARAGRAPH}`
      // );
      sectionNode = new SectionParseNode_PARAGRAPH(parent);
      break;
    }
    case MarkdownRecordType.SECTION_ORDERED: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType ===
      //     MarkdownRecordType.SECTION_ORDERED}`
      // );
      sectionNode = new SectionParseNode_SECTION_ORDERED(parent);
      break;
    }
    case MarkdownRecordType.SECTION_UNORDERED: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType ===
      //     MarkdownRecordType.SECTION_UNORDERED}`
      // );
      sectionNode = new SectionParseNode_SECTION_UNORDERED(parent);
      break;
    }
    case MarkdownRecordType.LISTITEM_ORDERED: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType ===
      //     MarkdownRecordType.SECTION_ORDERED}`
      // );
      sectionNode = new SectionParseNode_LISTITEM_ORDERED(parent);
      break;
    }
    case MarkdownRecordType.LISTITEM_UNORDERED: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType ===
      //     MarkdownRecordType.SECTION_UNORDERED}`
      // );
      sectionNode = new SectionParseNode_LISTITEM_UNORDERED(parent);
      break;
    }
    case MarkdownRecordType.FILLIN: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType === MarkdownRecordType.FILLIN}`
      // );
      sectionNode = new SectionParseNode_FILLIN(parent);
      break;
    }
    case MarkdownRecordType.IMAGEENTRY: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType === MarkdownRecordType.PHOTOENTRY}`
      // );
      sectionNode = new SectionParseNode_IMAGEENTRY(parent);
      break;
    }
    case MarkdownRecordType.BLOCKQUOTE: {
      sectionNode = new SectionParseNode_BLOCKQUOTE(parent);
      break;
    }
    case MarkdownRecordType.EMPTY: {
      sectionNode = new SectionParseNode_EMPTY(parent);
      break;
    }
    default: {
      sectionNode = new SectionParseNode_TBD(parent);
      sectionNode.name = tagType;
      break;
    }
  }
  return sectionNode;
}
