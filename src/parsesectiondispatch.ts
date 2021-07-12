//import { strict as assert } from "assert";
import { MarkdownTagType } from "./dataadapter";
//import { MarkdownTagType, MarkdownSectionTagType } from "./dataadapter";
import { IPageNode } from "./parsepages";
import {
  ISectionNode,
  SectionParseNode_EMPTY,
  SectionParseNode_FILLIN,
  SectionParseNode_PHOTOENTRY,
  SectionParseNode_TBD
} from "./parsesections";
import { SectionParseNode_PARAGRAPH } from "./parsesections_paragraph";
import {
  //  SectionParseNode_LIST_ITEMS,
  SectionParseNode_LIST_ITEMS_ORDERED,
  SectionParseNode_LIST_ITEMS_UNORDERED
} from "./parsesections_list_item";
import { SectionParseNode_BLOCKQUOTE } from "./parsesections_blockquote";
import { SectionParseNode_HEADING } from "./parsesections_heading";

export function GetSectionNode(
  tagType: MarkdownTagType,
  parent: ISectionNode | IPageNode
): ISectionNode {
  let sectionNode: ISectionNode;
  //  console.log(`dispatch: ${tagType}`);
  switch (tagType) {
    case MarkdownTagType.HEADING: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType === MarkdownSectionTagType.HEADING}`
      // );
      sectionNode = new SectionParseNode_HEADING(parent);
      break;
    }
    case MarkdownTagType.PARAGRAPH: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType === MarkdownTagType.PARAGRAPH}`
      // );
      sectionNode = new SectionParseNode_PARAGRAPH(parent);
      break;
    }
    case MarkdownTagType.SECTION_ORDERED: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType ===
      //     MarkdownTagType.SECTION_ORDERED}`
      // );
      sectionNode = new SectionParseNode_LIST_ITEMS_ORDERED(parent);
      break;
    }
    case MarkdownTagType.SECTION_UNORDERED: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType ===
      //     MarkdownTagType.SECTION_UNORDERED}`
      // );
      sectionNode = new SectionParseNode_LIST_ITEMS_UNORDERED(parent);
      break;
    }
    case MarkdownTagType.FILLIN: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType === MarkdownTagType.FILLIN}`
      // );
      sectionNode = new SectionParseNode_FILLIN(parent);
      break;
    }
    case MarkdownTagType.PHOTOENTRY: {
      // console.log(
      //   `dispatch: ${tagType} ${tagType === MarkdownTagType.PHOTOENTRY}`
      // );
      sectionNode = new SectionParseNode_PHOTOENTRY(parent);
      break;
    }
    case MarkdownTagType.BLOCKQUOTE: {
      sectionNode = new SectionParseNode_BLOCKQUOTE(parent);
      break;
    }
    case MarkdownTagType.EMPTY: {
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
