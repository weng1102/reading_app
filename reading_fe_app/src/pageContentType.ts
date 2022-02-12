/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: PageContentType.ts
 *
 * Defines interface between markdown input and react front end
 *
 * Version history:
 *
 **/
export const IDX_INITIALIZER = -9999;
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
  headingList: IHeadingListItem[];
  sectionList: ISectionListItem[];
  sentenceList: ISentenceListItem[];
  linkList: ILinkListItem[];
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
    sentenceList: [],
    linkList: []
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
  | ISectionImageEntryVariant;

export enum SectionVariantEnumType {
  heading = "heading",
  subsection = "subsection",
  listitem = "listitem",
  unordered_list = "unordered_list",
  ordered_list = "ordered_list",
  paragraph = "paragraph",
  fillin = "fillin",
  fillin_list = "fillin_list",
  image_entry = "image_entry",
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
  separator: string;
  recitable: boolean;
  audible: boolean;
  level: number;
}
export function ISectionHeadingVariantInitializer(): ISectionHeadingVariant {
  return {
    title: "", // overrides name and description above
    separator: "",
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

export interface ISectionFillinListVariant {}
export function ISectionFillinListVariantInitializer() {}

export enum ImageEntryLayoutEnumType {
  left = "left", // default, image to the left of caption
  above = "above" // image above caption
}
export interface ISectionImageEntryVariant {
  title: string;
  layout: ImageEntryLayoutEnumType;
  percent: string;
  separator: string;
  images: ITerminalContent[]; // path to img/filenames
  captions: ISectionContent[];
}
export function ISectionImageEntryVariantInitializer() {
  return {
    title: "",
    layout: ImageEntryLayoutEnumType.left,
    percent: "33%",
    separator: "",
    images: [],
    captions: []
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
  lastPunctuation: string;
  //  terminals: ITerminalNode[];
}
export enum TerminalMetaEnumType {
  acronym,
  currency,
  date,
  emailaddress,
  image,
  link,
  numberwithcommas,
  phonenumber,
  punctuation,
  symbol,
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
  firstTermIdx: number;
  lastTermIdx: number;
  content: string; // not necessary
  type: TerminalMetaEnumType;
  meta: TerminalMetaType;
}
export type TerminalMetaType =
  | IAcronymTerminalMeta
  | ICurrencyTerminalMeta
  | IDateTerminalMeta
  | IEmailAddressTerminalMeta
  | IImageTerminalMeta
  | ICurriculumLinkTerminalMeta
  | IPhoneNumberTerminalMeta
  | IPunctuationTerminalMeta
  | IReferenceTerminalMeta
  | ISymbolTerminalMeta
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
  linkable: boolean;
  visible: boolean;
  fillin: boolean;
  visited: boolean;
  linkIdx: number;
  hintsIdx: number;
  //cues: string[] includes terminal type word, day, month, year, number, area code,...
}
export function ITerminalInfoInitializer(
  content: string = "",
  altpronunciation: string = "",
  altrecognition: string = "",
  recitable: boolean = true,
  audible: boolean = true,
  linkable: boolean = false,
  visible: boolean = true,
  fillin: boolean = false,
  visited: boolean = false,
  linkIdx: number = IDX_INITIALIZER,
  hintsIdx: number = IDX_INITIALIZER
  //cues
): ITerminalInfo {
  return {
    content: (content === undefined ? "" : content)!,
    termIdx: IDX_INITIALIZER,
    nextTermIdx: [],
    prevTermIdx: [],
    altpronunciation:
      altpronunciation === undefined || altpronunciation === null
        ? ""
        : altpronunciation,
    altrecognition:
      altrecognition === undefined || altrecognition === null // could use  altrecognition || ''
        ? ""
        : altrecognition,
    recitable: recitable, // selectable
    audible: audible,
    linkable: linkable,
    visible: visible,
    fillin: fillin,
    visited: visited,
    linkIdx: linkIdx,
    hintsIdx: hintsIdx
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
      undefined, // accept default content
      undefined, // accept default altpro
      undefined, // accept default altreg
      false, // not recitable
      false, // not audible
      undefined, // accept default linkable
      undefined, // accept default visible
      undefined, // accept default fillin
      undefined // accept default visited
    ),
    whitespace1: ITerminalInfoInitializer(
      undefined, // accept default content
      undefined, // accept default altpro
      undefined, // accept default altreg
      false, // not recitable
      false, // not audible
      undefined, // accept default linkable
      undefined, // accept default visible
      undefined, // accept default fillin
      undefined // accept default visited
    ),
    day: ITerminalInfoInitializer(),
    punctuation2: ITerminalInfoInitializer(
      undefined, // accept default content
      undefined, // accept default altpro
      undefined, // accept default altreg
      true, // recitable
      true, //audible
      undefined, // accept default linkable
      undefined, // accept default visible
      undefined, // accept default fillin
      undefined // accept default visited
    ),
    whitespace2: ITerminalInfoInitializer(
      undefined, // accept default content
      undefined, // accept default altpro
      undefined, // accept default altreg
      false, // not recitable
      false, // not audible
      undefined, // accept default linkable
      undefined, // accept default visible
      undefined, // accept default fillin
      undefined // accept default visited
    ),
    year: IYearTerminalMetaInitializer() // e.g., {19,61}, {20,10}, {2000,1}
  };
}
export interface IImageTerminalMeta {
  src: string;
  label: string;
  width: number;
  height: number;
  attributes: string;
  className: string;
  style: string; // most specific style
}
export function IImageTerminalMetaInitializer(): IImageTerminalMeta {
  return {
    src: "",
    label: "",
    width: 0,
    height: 0,
    attributes: "",
    className: "",
    style: "" // most specific style
  };
}
interface ILinkDestination {
  page: string;
  directory: string; // if omitted, current dist/ directory
  sectionIdx: number;
  terminalIdx: number;
}
function ILinkDestinationInitializer() {
  return {
    page: "",
    directory: "",
    sectionIdx: IDX_INITIALIZER,
    terminalIdx: IDX_INITIALIZER
  };
}
export interface ICurriculumLinkTerminalMeta {
  label: ITerminalContent[];
  destination: ILinkDestination;
  className: string;
  style: string; // most specific style
  linkIdx: number;
}
export function ICurriculumLinkTerminalMetaInitializer(): ICurriculumLinkTerminalMeta {
  return {
    label: [],
    destination: ILinkDestinationInitializer(),
    className: "",
    style: "", // most specific style
    linkIdx: IDX_INITIALIZER
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
      undefined, // accept default content
      undefined, // accept default altpro
      undefined, // accept default altreg
      false, // not recitable
      false, // not audible
      undefined, // accept default linkable
      undefined, // accept default visible
      undefined, // accept default fillin
      undefined // accept default visited
    ),
    areaCode: [],
    closeBracket: ITerminalInfoInitializer(
      undefined, // accept default content
      undefined, // accept default altpro
      undefined, // accept default altreg
      false, // not recitable
      false, // not audible
      undefined, // accept default linkable
      undefined, // accept default visible
      undefined, // accept default fillin
      undefined // accept default visited
    ), // could be "."
    separator1: ITerminalInfoInitializer(
      undefined, // accept default content
      undefined, // accept default altpro
      undefined, // accept default altreg
      false, // not recitable
      false, // not audible
      undefined, // accept default linkable
      undefined, // accept default visible
      undefined, // accept default fillin
      undefined // accept default visited
    ),
    exchangeCode: [],
    separator2: ITerminalInfoInitializer(
      undefined, // accept default content
      undefined, // accept default altpro
      undefined, // accept default altreg
      false, // not recitable
      false, // not audible
      undefined, // accept default linkable
      undefined, // accept default visible
      undefined, // accept default fillin
      undefined // accept default visited
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
    undefined, // accept default altpro
    undefined, // accept default altreg
    false, // not recitable
    false, // not audible
    undefined, // accept default linkable
    undefined, // accept default visible
    undefined, // accept default fillin
    undefined // accept default visited
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
    undefined, // accept default altpro
    undefined, // accept default altreg
    false, // not recitable
    false, // not audible
    undefined, // accept default linkable
    undefined, // accept default visible
    undefined, // accept default fillin
    undefined // accept default visited
  );
}
export type ISymbolTerminalMeta = ITerminalInfo;
export function ISymbolTerminalMetaInitializer(
  content?: string,
  altPronunciation: string = "",
  altRecognition: string = ""
): ITerminalInfo {
  return ITerminalInfoInitializer(content, altPronunciation, altRecognition);
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
  terminalCountPriorToHeading: number; // number of terminals immediately preceding this section heading
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
  type: SectionVariantEnumType | string;
}
export function ISectionListItemInitializer(
  firstTermIdx: number = IDX_INITIALIZER,
  lastTermIdx: number = IDX_INITIALIZER,
  type: string = SectionVariantEnumType.tbd
): ISectionListItem {
  type = type.toString();
  return { firstTermIdx, lastTermIdx, type };
}
export interface ISentenceListItem extends IRangeItem {
  lastPunctuation: string;
}
export function ISentenceListItemInitializer(
  firstTermIdx: number = IDX_INITIALIZER,
  lastTermIdx: number = IDX_INITIALIZER,
  lastPunctuation: string = "."
): ISentenceListItem {
  return { firstTermIdx, lastTermIdx, lastPunctuation };
}
export interface ILinkListItem {
  label: string;
  destination: ILinkDestination;
  valid: boolean;
}

export function ILinkListItemInitializer(
  label: string = "",
  destination: ILinkDestination = {
    page: "",
    directory: "",
    sectionIdx: IDX_INITIALIZER,
    terminalIdx: IDX_INITIALIZER
  },
  valid = false
): ILinkListItem {
  return { label, destination, valid };
}
