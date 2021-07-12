import { ITerminalNode } from "./parser";

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
  sections: ISectionContent[];
}
export const PageContentInitializer: IPageContent = {
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
export interface ISectionContent {
  id: number;
  name: string;
  description: string;
  firstTermIdx: number;
  //  sentences: ISentenceContent[];
  //  type: SectionVariantEnumType; // included in meta making initializer simplier
  meta: SectionVariantType;
}
export type SectionVariantType =
  | ISectionHeadingVariant
  | ISectionUnorderedListVariant
  | ISectionOrderedListVariant
  | ISectionParagraphVariant
  | ISectionFillinVariant
  | ISectionBlockquoteVariant
  | ISectionFillinList
  | ISectionPhotoEntry;

export enum SectionVariantEnumType {
  heading,
  subsection,
  unordered_list,
  ordered_list,
  paragraph,
  fillin,
  fillin_list,
  photo_entry,
  blockquote,
  unittest
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
  type: SectionVariantEnumType; // can have zero (when immediately followed by subsecion) or more sentences
  minColumns: number; // minimum number of columns for fillin table
}
export const ISectionFillinVariantInitializer: ISectionFillinVariant = {
  type: SectionVariantEnumType.fillin,
  minColumns: 0 // overrides name and description above
};
export interface ISectionHeadingVariant {
  type: SectionVariantEnumType; // can have zero (when immediately followed by subsecion) or more sentences
  title: string; // ISentenceContent where audible/recitable can be disabled at run time.
  recitable: boolean;
  audible: boolean;
  level: number;
}
export const ISectionHeadingVariantInitializer: ISectionHeadingVariant = {
  type: SectionVariantEnumType.heading,
  title: "", // overrides name and description above
  recitable: false,
  audible: false,
  level: 0
};
export interface ISectionBlockquoteVariant {
  citing: URL | null;
  sentences: ISentenceContent[];
  // may be handled as a flag on paragraphs, lists, etc. since the parsing is
  // identical to normal section parsing. The difference is in the <blockquote>
  // html tag emitted in frontend. For now, just parse the paragraph.
}
export const ISectionBlockquoteVariantInitializer: ISectionBlockquoteVariant = {
  citing: null,
  sentences: []
};
export interface ISectionUnorderedListVariant {
  type: SectionVariantEnumType;
  marker: UnorderedListMarkerEnumType; // overrides css but not user profile
}
export const ISectionUnorderedListVariantInitializer: ISectionUnorderedListVariant = {
  type: SectionVariantEnumType.unordered_list,
  marker: UnorderedListMarkerEnumType.disc // overrides css but not user profile
};
export interface ISectionOrderedListVariant {
  type: SectionVariantEnumType;
  startNumber: number;
  listType: OrderedListTypeEnumType; //  overrides css but not user profile
}
export const ISectionOrderedListVariantInitializer: ISectionOrderedListVariant = {
  type: SectionVariantEnumType.ordered_list,
  startNumber: 0,
  listType: OrderedListTypeEnumType.numerical //  overrides css but not user profile
};
export interface ISectionParagraphVariant {
  type: SectionVariantEnumType;
  sentences: ISentenceContent[];
  style: string; // overrides css but not user profile
}
export const ISectionParagraphVariantInitializer: ISectionParagraphVariant = {
  type: SectionVariantEnumType.paragraph,
  sentences: [],
  style: "" // overrides css but not user profile
};
export interface ISectionFillin {
  type: SectionVariantEnumType.fillin;
}
interface ISectionFillinList {
  type: SectionVariantEnumType.fillin_list;
}
interface ISectionPhotoEntry {
  type: SectionVariantEnumType.photo_entry;
  image: string; // path to img/filename
}
export interface ISentenceContent {
  id: number;
  content: string;
  firstTermIdx: number;
  terminals: ITerminalContent[];
}
export enum TerminalMetaEnumType {
  audibleword = 1,
  nonaudibleword, // cannot be heard or recited
  punctuation, // only interesting for end of sentence/page/chapter feedback
  reference, // can be heard but cannot be recited
  whitespace // delimiter or syntactic sugar
}
export interface ITerminalContent {
  id: number;
  content: string;
  type: TerminalMetaEnumType;
  meta: TerminalMetaType;
}
export type TerminalMetaType =
  | IAudibleWordTerminalMeta
  | INonaudibleWordTerminalMeta
  | IPunctuationTerminalMeta
  | IReferenceTerminalMeta // without regnition, with recitation
  | IWhitespaceTerminalMeta;

interface IWhitespaceTerminalMeta {
  //  type: TerminalMetaEnumType.whitespace;
  whitespaceType: string;
}
interface IPunctuationTerminalMeta {
  //  type: TerminalMetaEnumType.punctuation;
  punctuationType: string;
}
interface IReferenceTerminalMeta {
  //  type: TerminalMetaEnumType.reference;
  reference: string;
}
export interface INonaudibleWordTerminalMeta {
  //  type: TerminalMetaEnumType.nonaudibleword;
  content: string;
}
export const INonaudibleWordTerminalMetaInitializer: INonaudibleWordTerminalMeta = {
  content: ""
};
export interface IAudibleWordTerminalMeta {
  //  type: TerminalMetaEnumType.audibleword;
  id: number;
  wordIdx: number;
  nextWordIdx: number[];
  prevWordIdx: number[];
  altpronunciation: string;
  altrecognition: string;
  active: boolean;
  visited: boolean;
  children: ITerminalNode[]; // expand token e.g. Acronyms
}
export const IAudibleWordTerminalMetaInitializer = {
  //  type: TerminalMetaEnumType.audibleword,
  id: 0,
  wordIdx: 0,
  nextWordIdx: [],
  prevWordIdx: [],
  altpronunciation: "",
  altrecognition: "",
  active: false,
  visited: false,
  children: []
};
