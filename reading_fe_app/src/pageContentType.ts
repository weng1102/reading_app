/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: PageContentType.ts
 *
 * Defines interface between markdown input and react front end
 *
 * Version history:
 *
 **/
// import { ITerminalNode } from "./parseterminals";
// import { ISectionNode } from "./parsesections";
// import { ISentenceNode } from "./parsesentences";
const IDX_INITIALIZER = -9999;
export enum PageFormatEnumType {
  default = 0
}
export interface IPageContent {
  id: number | undefined;
  title: string;
  filename: string;
  description: string;
  owner: string;
  pageFormatType: PageFormatEnumType;
  created: string;
  modified: string;
  transformed: string;
  firstTermIdx: number;
  lastTermIdx: number;
  sections: ISectionContent[];
  terminalList: ITerminalListItem[];
  headingList: IHeadingListItem[]; // first terminal of each section for Navbar
  sectionList: ISectionListItem[]; // maps section index to first and last Terminal index
  sentenceList: ISentenceListItem[]; // maps sentence index to first and last Terminal index
  //  sentenceList: ITerminalInfo[] // first terminal of each sentence
}
export function PageContentInitializer(): IPageContent {
  return {
    id: 0,
    title: "",
    filename: "",
    description: "",
    owner: "",
    pageFormatType: PageFormatEnumType.default,
    created: null!,
    modified: null!,
    transformed: null!,
    firstTermIdx: 0,
    lastTermIdx: 0,
    sections: [],
    terminalList: [],
    headingList: [],
    sectionList: [],
    sentenceList: []
  };
}
export interface ISectionContent {
  id: number;
  name: string;
  description: string;
  firstTermIdx: number;
  lastTermIdx: number;
  items: ISectionContent[];
  type: SectionVariantEnumType; // included in meta making initializer simplier
  meta: SectionVariantType;
}
export type SectionVariantType =
  | ISectionEmptyVariant
  | ISectionHeadingVariant
  | ISectionListitemVariant
  | ISectionUnorderedListVariant
  | ISectionOrderedListVariant
  | ISectionParagraphVariant
  | ISectionFillinVariant
  | ISectionBlockquoteVariant
  | ISectionFillinListVariant
  | ISectionPhotoEntryVariant;

export enum SectionVariantEnumType {
  heading = "heading",
  subsection = "subsection",
  listitem = "listitem",
  unordered_list = "unordered_list",
  ordered_list = "ordered_list",
  paragraph = "paragraph",
  fillin = "fillin",
  fillin_list = "fillin_list",
  photo_entry = "photo_entry",
  blockquote = "blockquote",
  unittest = "unittest",
  empty = "empty",
  tbd = "tbd"
}
export enum ListTypeEnumType {
  bulleted,
  numerical,
  alphabetical_uppercase,
  alphabetical_lowercase,
  roman_uppercase,
  roman_lowercase,
  tbd
}
export enum OrderedListTypeEnumType { // standard HTML
  numerical,
  alphabetical_uppercase,
  alphabetical_lowercase,
  roman_uppercase,
  roman_lowercase
}
export enum UnorderedListMarkerEnumType { // standard HTML
  disc,
  circle,
  square,
  none,
  other
}
export interface ISectionFillinVariant {
  minColumns: number; // minimum number of columns for fillin table
}
export function ISectionFillinVariantInitializer(): ISectionFillinVariant {
  return {
    minColumns: 0 // overrides name and description above
  };
}
export interface ISectionHeadingVariant {
  title: string; // ISentenceContent where audible/recitable can be disabled at run time.
  recitable: boolean;
  audible: boolean;
  level: number;
}
export function ISectionHeadingVariantInitializer(): ISectionHeadingVariant {
  return {
    title: "", // overrides name and description above
    recitable: false,
    audible: false,
    level: 0
  };
}
export interface ISectionBlockquoteVariant {
  paragraphs: [];
  citing: URL | null;
  // may be handled as a flag on paragraphs, lists, etc. since the parsing is
  // identical to normal section parsing. The difference is in the <blockquote>
  // html tag emitted in frontend. For now, just parse the paragraph.
}
export function ISectionBlockquoteVariantInitializer(): ISectionBlockquoteVariant {
  return {
    paragraphs: [],
    citing: null
  };
}
export interface ISectionEmptyVariant {
  count: number; // overrides css but not user profile
}
export function ISectionEmptyVariantInitializer() {
  return {
    count: 0
  };
}
export interface ISectionListitemVariant {
  depth: number;
  startNumber: number;
  listType: ListTypeEnumType;
}
export function ISectionListitemVariantInitializer(): ISectionListitemVariant {
  return {
    depth: 0,
    startNumber: 0,
    listType: ListTypeEnumType.tbd
  };
}
export interface ISectionUnorderedListVariant {
  items: ISectionContent[];
  //  items: ISectionNode[];
  depth: number;
  marker: UnorderedListMarkerEnumType; // overrides css but not user profile
}
export function ISectionUnorderedListVariantInitializer(): ISectionUnorderedListVariant {
  return {
    items: [],
    depth: 0,
    marker: UnorderedListMarkerEnumType.disc // overrides css but not user profile
  };
}
export interface ISectionOrderedListVariant {
  items: ISectionContent[]; // list item (paragraph) or another deeper list
  ///  items: ISectionNode[]; // list item (paragraph) or another deeper list
  depth: number;
  startNumber: number;
  listType: OrderedListTypeEnumType; //  overrides css but not user profile
}
export function ISectionOrderedListVariantInitializer(): ISectionOrderedListVariant {
  return {
    items: [], // list item (paragraph) or another deeper list
    depth: 0,
    startNumber: 0,
    listType: OrderedListTypeEnumType.numerical //  overrides css but not user profile
  };
}
export interface ISectionParagraphVariant {
  sentences: ISentenceContent[];
  //sentences: ISentenceNode[];
  style: string; // overrides css but not user profile
}
export function ISectionParagraphVariantInitializer(): ISectionParagraphVariant {
  return {
    sentences: [],
    style: "" // overrides css but not user profile
  };
}
export interface ISectionFillinVariant {}
export function ISectionFillinBariantInitializer() {}

interface ISectionFillinListVariant {}
export function ISectionFillinListVariantInitializer() {}

interface ISectionPhotoEntryVariant {
  image: string; // path to img/filename
}
export function ISectionPhotoEntryVariantInitializer() {
  return {
    image: ""
  };
}
export interface ISectionTbdVariant {
  context: string; // message in a bottle
}
export function ISectionTbdVariantInitializer() {
  return {
    context: ""
  };
}
export interface ISentenceContent {
  id: number;
  content: string;
  firstTermIdx: number;
  lastTermIdx: number;
  terminals: ITerminalContent[];
  //  terminals: ITerminalNode[];
}
export enum TerminalMetaEnumType {
  acronym,
  currency,
  date,
  emailaddress,
  numberwithcommas,
  phonenumber,
  punctuation,
  tbd,
  time,
  token,
  whitespace,
  word,
  year
}
export interface ITerminalContent {
  id: number;
  termIdx: number;
  content: string; // not necessary
  firstTermIdx: number;
  lastTermIdx: number;
  type: TerminalMetaEnumType;
  meta: TerminalMetaType;
}
export type TerminalMetaType =
  | IAcronymTerminalMeta
  | ICurrencyTerminalMeta
  | IDateTerminalMeta
  | IEmailAddressTerminalMeta
  | IPhoneNumberTerminalMeta
  | IPunctuationTerminalMeta
  | IReferenceTerminalMeta
  | ITimeTerminalMeta
  | IWhitespaceTerminalMeta
  | IWordTerminalMeta
  | IYearTerminalMeta;

export interface ITerminalInfo {
  content: string;
  termIdx: number;
  nextTermIdx: number[];
  prevTermIdx: number[];
  altpronunciation: string;
  altrecognition: string;
  recitable: boolean;
  audible: boolean;
  visible: boolean;
  fillin: boolean;
  visited: boolean;
  //cues: string[] includes terminal type word, day, month, year, number, area code,...
}
export function ITerminalInfoInitializer(
  content: string = "",
  altpronunciation: string = "",
  altrecognition: string = "",
  recitable: boolean = true,
  audible: boolean = true,
  visible: boolean = true,
  fillin: boolean = false,
  visited: boolean = false

  //cues
): ITerminalInfo {
  return {
    content: (content === undefined ? "" : content)!,
    termIdx: IDX_INITIALIZER,
    nextTermIdx: [],
    prevTermIdx: [],
    altpronunciation: (altpronunciation === undefined ? "" : altpronunciation)!,
    altrecognition: (altrecognition === undefined ? "" : altrecognition)!,
    recitable: recitable, // selectable
    audible: audible,
    visible: visible,
    fillin: fillin,
    visited: visited
  };
}
export interface IAcronymTerminalMeta {
  letters: ITerminalInfo[];
}
export function IAcronymTerminalMetaInitializer(): IAcronymTerminalMeta {
  return {
    letters: []
  };
}
export interface ICurrencyTerminalMeta {
  currency: ITerminalInfo;
  amount: ITerminalInfo;
}
export function ICurrencyTerminalMetaInitializer(): ICurrencyTerminalMeta {
  return {
    currency: ITerminalInfoInitializer(),
    amount: ITerminalInfoInitializer()
  };
}
export const enum DateFormatEnumType {
  date1, // DD MMM YYYY
  date2, // MMM[.]? DD, YYYY
  date3, // MMM[.]? DD
  unknown
}
export interface IDateTerminalMeta {
  format: DateFormatEnumType;
  month: ITerminalInfo;
  punctuation1: ITerminalInfo;
  whitespace1: ITerminalInfo;
  day: ITerminalInfo;
  punctuation2: ITerminalInfo;
  whitespace2: ITerminalInfo;
  year: IYearTerminalMeta; // e.g., {19,61}, {20,10}, {2000,1}
}
export interface IYearTerminalMeta {
  century: ITerminalInfo; // e.g., {19,61}, {20,10}, {2000,1}
  withinCentury: ITerminalInfo;
}
export function IYearTerminalMetaInitializer(): IYearTerminalMeta {
  return {
    century: ITerminalInfoInitializer(),
    withinCentury: ITerminalInfoInitializer()
  };
}
//export const IYearTerminalMetaInitializer: IYearTerminalMeta = xxxxx; //{
//  century: ITerminalInfoInitializer, // less 1
//  withinCentury: ITerminalInfoInitializer
//};
export function IDateTerminalMetaInitializer(): IDateTerminalMeta {
  return {
    format: DateFormatEnumType.unknown,
    month: ITerminalInfoInitializer(),
    punctuation1: ITerminalInfoInitializer(
      undefined,
      undefined,
      undefined,
      false,
      false,
      true,
      false
    ),
    whitespace1: ITerminalInfoInitializer(
      undefined,
      undefined,
      undefined,
      false,
      false,
      true,
      false
    ),
    day: ITerminalInfoInitializer(),
    punctuation2: ITerminalInfoInitializer(
      undefined,
      undefined,
      undefined,
      false,
      false,
      true,
      false
    ),
    whitespace2: ITerminalInfoInitializer(
      undefined,
      undefined,
      undefined,
      false,
      false,
      true,
      false
    ),
    year: IYearTerminalMetaInitializer() // e.g., {19,61}, {20,10}, {2000,1}
  };
}
export interface IPhoneNumberTerminalMeta {
  //(408) 267-6076 or 408.267.6076 or 408-267-6076
  countryCode: ITerminalInfo;
  openBracket: ITerminalInfo; //ITerminalInfo;
  areaCode: ITerminalInfo[];
  closeBracket: ITerminalInfo; //ITerminalInfo;
  separator1: ITerminalInfo; //ITerminalInfo;
  exchangeCode: ITerminalInfo[];
  separator2: ITerminalInfo; //ITerminalInfo;
  lineNumber: ITerminalInfo[];
}
export function IPhoneNumberTerminalMetaInitializer(): IPhoneNumberTerminalMeta {
  return {
    countryCode: ITerminalInfoInitializer(),
    openBracket: ITerminalInfoInitializer(
      undefined,
      undefined,
      undefined,
      false,
      false,
      true,
      false
    ),
    areaCode: [],
    closeBracket: ITerminalInfoInitializer(
      undefined,
      undefined,
      undefined,
      false,
      false,
      true,
      false
    ), // could be "."
    separator1: ITerminalInfoInitializer(
      undefined,
      undefined,
      undefined,
      false,
      false,
      true,
      false
    ),
    exchangeCode: [],
    separator2: ITerminalInfoInitializer(
      undefined,
      undefined,
      undefined,
      false,
      false,
      true,
      false
    ), // could be "."
    lineNumber: []
  };
}
export type IPunctuationTerminalMeta = ITerminalInfo;
export function IPunctuationTerminalMetaInitializer(
  content?: string
): ITerminalInfo {
  return ITerminalInfoInitializer(
    content,
    undefined,
    undefined,
    false,
    false,
    true,
    false
  );
}
export interface IReferenceTerminalMeta {
  //  type: TerminalMetaEnumType.reference;
  reference: string;
  url: URL; //URL
}
export interface ITimeTerminalMeta {
  hour: string;
  minute: string;
}
export type IWhitespaceTerminalMeta = ITerminalInfo;
export function IWhitespaceTerminalMetaInitializer(
  content?: string
): ITerminalInfo {
  return ITerminalInfoInitializer(
    content,
    undefined,
    undefined,
    false,
    false,
    true,
    false
  );
}
export type IWordTerminalMeta = ITerminalInfo;
export function IWordTerminalMetaInitializer(
  content?: string,
  altPronunciation: string = "",
  altRecognition: string = ""
): ITerminalInfo {
  return ITerminalInfoInitializer(content, altPronunciation, altRecognition);
}
export interface IEmailAddressTerminalMeta {
  userName: ITerminalInfo[]; //wen.eng, wen_eng
  separator: ITerminalInfo;
  domainName: ITerminalInfo[]; // maps.google.com
  // separator2: ITerminalInfo;
  // domain: ITerminalInfo; // .com | .edu
}
export function IEmailAddressTerminalMetaInitializer(): IEmailAddressTerminalMeta {
  return {
    userName: [], //wen.eng, wen_eng
    separator: ITerminalInfoInitializer(),
    domainName: [] // maps.google
  };
}
export interface ITerminalListItem extends ITerminalInfo {
  sentenceIdx: number;
  sectionIdx: number;
}
export function ITerminalListItemInitializer(
  terminalInfo: ITerminalInfo,
  sentIdx: number = 0,
  sectIdx: number = 0
): ITerminalListItem {
  const retval: ITerminalListItem = {
    ...terminalInfo,
    sentenceIdx: sentIdx,
    sectionIdx: sectIdx
  };
  return retval;
}
// content: string;
// termIdx: number;
// nextTermIdx: number[];
// prevTermIdx: number[];
// altpronunciation: string;
// altrecognition: string;
// recitable: boolean;
// audible: boolean;
// visible: boolean;
// fillin: boolean;
// visited: boolean;
//
// export function ITerminalListItemInitializer(
//   info: ITerminalInfo,
//   sentenceIdx: number,
//   sectionIdx: number
// ): ITerminalListItem {
//   return ({
//     info = ITerminalInfoInitializer();
//     sentenceIdx = 0,
//     sectionIdx = 0
//   })
// }
export interface IHeadingListItem {
  headingLevel: number;
  title: string;
  termIdx: number; // either first word of section title OR first word in section body
  terminalCountPriorToHeading: number; // numbrt og terminals immediately preceding this section heading
}
export interface IRangeItem {
  firstTermIdx: number;
  lastTermIdx: number;
}
// export interface ISectionListItem extends IRangeItem {
//   //  type: SectionVariantEnumType | string;
// }
// export function ISectionListItemInitializer(
//   firstTermIdx: number = -1,
//   lastTermIdx: number = -1
//   //  type: SectionVariantEnumType | string = SectionVariantEnumType.tbd
// ): ISectionListItem {
//   return { firstTermIdx, lastTermIdx };
// }
export interface ISectionListItem extends IRangeItem {
  type: string;
}
export function ISectionListItemInitializer(
  firstTermIdx: number = -1,
  lastTermIdx: number = -1,
  type: string = SectionVariantEnumType.tbd.toString()
): ISectionListItem {
  type = type.toString();
  return { firstTermIdx, lastTermIdx, type };
}
export type ISentenceListItem = IRangeItem;
export function ISentenceListItemInitializer(
  firstTermIdx: number = -1,
  lastTermIdx: number = -1
): ISentenceListItem {
  return { firstTermIdx, lastTermIdx };
}
