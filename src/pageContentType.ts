import { ITerminalNode } from "./parseterminals";
import { ISectionNode } from "./parsesections";
import { ISentenceNode } from "./parsesentences";

export enum PageFormatEnumType {
  default = 0
}
export interface IPageContent {
  id: number | undefined;
  name: string;
  description: string;
  owner: string;
  pageFormatType: PageFormatEnumType;
  created: Date;
  modified: Date;
  transformed: Date;
  firstTermIdx: number;
  lastTermIdx: number;
  sections: ISectionNode[];
}
export function PageContentInitializer(): IPageContent {
  return {
    id: 0,
    name: "",
    description: "",
    owner: "",
    pageFormatType: PageFormatEnumType.default,
    created: null!,
    modified: null!,
    transformed: null!,
    firstTermIdx: 0,
    lastTermIdx: 0,
    sections: []
  };
}
export interface ISectionContent {
  id: number;
  name: string;
  description: string;
  firstTermIdx: number;
  items: ISectionNode[];
  //  sentences: ISentenceContent[];
  //  type: SectionVariantEnumType; // included in meta making initializer simplier
  meta: SectionVariantType;
}
export type SectionVariantType =
  | ISectionEmptyVariant
  | ISectionHeadingVariant
  | ISectionItemListVariant
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
  itemlist = "itemlist",
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
export interface ISectionItemListVariant {
  depth: number;
  startNumber: number;
  listType: ListTypeEnumType;
}
export function ISectionItemListVariantInitializer(): ISectionItemListVariant {
  return {
    depth: 0,
    startNumber: 0,
    listType: ListTypeEnumType.tbd
  };
}
export interface ISectionUnorderedListVariant {
  items: ISectionNode[];
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
  items: ISectionNode[]; // list item (paragraph) or another deeper list
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
  //  sentences: ISentenceNode[];
  sentences: ISentenceNode[];
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
  // name: string;
  // description: string;
  content: string;
  firstTermIdx: number;
  terminals: ITerminalNode[];
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
  content: string;
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
}
export function ITerminalInfoInitializer(
  content?: string,
  altpronunciation?: string,
  altrecognition?: string
): ITerminalInfo {
  return {
    content: (content === undefined ? "" : content)!,
    termIdx: 0,
    nextTermIdx: [],
    prevTermIdx: [],
    altpronunciation: (altpronunciation === undefined ? "" : altpronunciation)!,
    altrecognition: (altrecognition === undefined ? "" : altrecognition)!,
    recitable: false,
    audible: false,
    visible: false
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
    punctuation1: ITerminalInfoInitializer(),
    whitespace1: ITerminalInfoInitializer(),
    day: ITerminalInfoInitializer(),
    punctuation2: ITerminalInfoInitializer(),
    whitespace2: ITerminalInfoInitializer(),
    year: IYearTerminalMetaInitializer() // e.g., {19,61}, {20,10}, {2000,1}
  };
}
export interface IPhoneNumberTerminalMeta {
  //(408) 267-6076 or 408.267.6076 or 408-267-6076
  countryCode: ITerminalInfo;
  openBracket: string;
  areaCode: ITerminalInfo[];
  closeBracket: string;
  separator1: string;
  exchangeCode: ITerminalInfo[];
  separator2: string;
  lineNumber: ITerminalInfo[];
}
export function IPhoneNumberTerminalMetaInitializer(): IPhoneNumberTerminalMeta {
  return {
    countryCode: ITerminalInfoInitializer(),
    openBracket: "(", // could be "."
    areaCode: [],
    closeBracket: ")", // could be "."
    separator1: "",
    exchangeCode: [],
    separator2: "-", // could be "."
    lineNumber: []
  };
}
export interface IPunctuationTerminalMeta {
  punctuationType: string;
}
export function IPunctuationTerminalMetaInitializer(): IPunctuationTerminalMeta {
  return {
    punctuationType: ""
  };
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
export interface IWhitespaceTerminalMeta {
  //  type: TerminalMetaEnumType.whitespace;
  whitespaceType: string;
}
export type IWordTerminalMeta = ITerminalInfo;
export function IWordTerminalMetaInitializer(
  content?: string,
  altPronunciation?: string,
  altRecognition?: string
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
