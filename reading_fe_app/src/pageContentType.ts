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
export const PageContentVersion = "20230423.1";
export enum PageFormatEnumType {
  default = 0
}
export interface IPageContent {
  id: number | undefined;
  title: string;
  filename: string;
  description: string;
  owner: string;
  author: string;
  category: string;
  version: string;
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
  fillinList: ISectionFillinItem[];
}
export function PageContentInitializer(): IPageContent {
  return {
    id: 0,
    title: "",
    filename: "",
    description: "",
    owner: "",
    author: "anonymous",
    category: "Miscellaneous",
    version: PageContentVersion,
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
    linkList: [],
    fillinList: []
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
  | ISectionImageEntryVariant
  | ISectionButtonGridVariant
  | ISectionTbdVariant;

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
  button_grid = "buttongrid",
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
// export interface ISectionHeadingVariant1 {
//   title: string; // ISentenceContent where audible/recitable can be disabled at run time.
//
//   separator: string;
//   recitable: boolean;
//   audible: boolean;
//   level: number;
// }
export interface ISectionHeadingVariant {
  heading: ISentenceContent;
  level: number;
}
// export function ISectionHeadingVariantInitializer1(): ISectionHeadingVariant1 {
//   return {
//     title: "", // overrides name and description above
//     separator: "",
//     recitable: false,
//     audible: false,
//     level: 0
//   };
// }
export function ISectionHeadingVariantInitializer(): ISectionHeadingVariant {
  return {
    heading: {
      id: IDX_INITIALIZER,
      content: "",
      firstTermIdx: IDX_INITIALIZER,
      lastTermIdx: IDX_INITIALIZER,
      terminals: [],
      lastPunctuation: ""
    }, // overrides name and description above
    level: 0
  };
}
export interface ISectionButtonGridVariant {
  title: string;
  buttonWidth: number;
  description: string;
  columnCount: number;
  minColumnWidth: number;
  buttonText: string[];
}
export function ISectionButtonGridVariantInitializer(): ISectionButtonGridVariant {
  return {
    title: "",
    buttonWidth: 0,
    description: "",
    columnCount: 0,
    minColumnWidth: 50,
    buttonText: []
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
export enum SectionFillinLayoutType {
  grid = "grid",
  list = "list",
  csv = "csv",
  hidden = "hidden"
}
export enum SectionFillinPositionType {
  above = "above",
  left = "left",
  right = "right",
  below = "below"
}
export enum SectionFillinSortOrder {
  insert = "insert",
  alphabetical = "alphabetical",
  random = "random"
}
export enum SectionFillinHelpPresetName {
  // indexes ISectionFillinHelpPresets below
  override = "override",
  hidden = "hidden",
  gridRandom = "gridRandom",
  gridAlpha = "gridAlpha",
  gridInOrder = "gridInOrder",
  inline = "inline"
}
export enum SectionFillinHelpPresetLevel {
  override = -1,
  hidden,
  gridRandom,
  gridAlpha,
  gridInOrder,
  inline
}
export const SectionFillinHelpPresetMap = {
  [SectionFillinHelpPresetName.override]: SectionFillinHelpPresetLevel.override,
  [SectionFillinHelpPresetName.hidden]: SectionFillinHelpPresetLevel.hidden,
  [SectionFillinHelpPresetName.gridRandom]:
    SectionFillinHelpPresetLevel.gridRandom,
  [SectionFillinHelpPresetName.gridAlpha]:
    SectionFillinHelpPresetLevel.gridAlpha,
  [SectionFillinHelpPresetName.gridInOrder]:
    SectionFillinHelpPresetLevel.gridInOrder,
  [SectionFillinHelpPresetName.inline]: SectionFillinHelpPresetLevel.inline
};
interface IHelpLevelSetting {
  level: SectionFillinHelpPresetLevel;
  helpSetting: ISectionFillinHelpSetting;
}
type SectionFillinHelpPresetInfoType = Record<
  SectionFillinHelpPresetLevel,
  IHelpLevelSetting
>;
export const SectionFillinHelpPresetInfo = {
  [SectionFillinHelpPresetLevel.override]: ISectionFillinHelpSettingInitializer(),
  [SectionFillinHelpPresetLevel.hidden]: {
    // default
    description: "Responses not displayed",
    showResponsesInPrompts: false,
    layout: SectionFillinLayoutType.hidden,
    responsesLabel: "",
    promptsLabel: "Recite the following prompts and fill in the blanks:",
    // igonore parameters below
    sortOrder: SectionFillinSortOrder.insert,
    gridColumns: 6,
    groupByCategory: false,
    showResponseHints: false,
    showPromptHints: false,
    unique: true,
    showReferenceCount: true,
    helpfulness: 0
  },
  [SectionFillinHelpPresetLevel.gridRandom]: {
    description: "Responses displayed as grid in random order",
    responsesLabel: "Responses displayed as grid randomly:",
    promptsLabel: "Recite the following prompts and fill in the blanks:",
    layout: SectionFillinLayoutType.grid,
    sortOrder: SectionFillinSortOrder.random,
    gridColumns: 6,
    // igonore parameters below
    showResponsesInPrompts: false,
    groupByCategory: false,
    showResponseHints: false,
    showPromptHints: false,
    unique: true,
    showReferenceCount: true,
    helpfulness: 0
  },
  [SectionFillinHelpPresetLevel.gridAlpha]: {
    description: "Responses displayed as grid in alphabetical order",
    responsesLabel: "Responses displayed as grid alphabetically:",
    promptsLabel: "Recite the following prompts and fill in the blanks:",
    layout: SectionFillinLayoutType.grid,
    gridColumns: 6,
    sortOrder: SectionFillinSortOrder.alphabetical,
    showResponsesInPrompts: false,
    groupByCategory: false,
    showResponseHints: false,
    showPromptHints: false,
    unique: true,
    showReferenceCount: true,
    helpfulness: 0
  },
  [SectionFillinHelpPresetLevel.gridInOrder]: {
    description: "Responses displayed as grid in order",
    responsesLabel: "Responses displayed as grid in order:",
    promptsLabel: "Recite the following prompts and fill in the blanks:",
    layout: SectionFillinLayoutType.grid,
    gridColumns: 6,
    sortOrder: SectionFillinSortOrder.insert,
    showResponsesInPrompts: false,
    groupByCategory: false,
    showResponseHints: false,
    showPromptHints: false,
    unique: true,
    showReferenceCount: true,
    helpfulness: 0
  },
  [SectionFillinHelpPresetLevel.inline]: {
    description: "Responses displayed inline",
    showResponsesInPrompts: true,
    responsesLabel: "Responses already filled in:",
    promptsLabel:
      "Recite the following prompts including the underlined words:",
    layout: SectionFillinLayoutType.hidden,
    gridColumns: 0,
    sortOrder: SectionFillinSortOrder.insert,
    groupByCategory: false,
    showResponseHints: false,
    showPromptHints: false,
    unique: true,
    showReferenceCount: true,
    helpfulness: 0
  }
};
export interface ISectionFillinHelpSetting {
  description: string;
  responsesLabel: string;
  promptsLabel: string;
  layout: SectionFillinLayoutType;
  sortOrder: SectionFillinSortOrder;
  gridColumns: number;
  showResponsesInPrompts: boolean;
  groupByCategory: boolean;
  showResponseHints: boolean; //same as groupCategory?
  showPromptHints: boolean;
  unique: boolean; // identical words grouped as single response entry
  showReferenceCount: boolean;
  helpfulness: number; // most hints to least hints
}
export function ISectionFillinHelpSettingInitializer(
  description: string = "",
  promptsLabel: string = "",
  responsesLabel: string = "",
  layout = SectionFillinLayoutType.grid
): ISectionFillinHelpSetting {
  return {
    description: description,
    responsesLabel: responsesLabel,
    promptsLabel: promptsLabel,
    layout: layout,
    sortOrder: SectionFillinSortOrder.insert,
    gridColumns: 6,
    showResponseHints: false,
    showPromptHints: false,
    groupByCategory: false,
    showResponsesInPrompts: false,
    unique: true, // identical words grouped as single response entry
    showReferenceCount: true,
    helpfulness: -1
  };
}
export interface ISectionFillinVariant {
  sectionFillinIdx: number; // reference state structure in pageList.fillinList
  helpPresetLevel: SectionFillinHelpPresetLevel;
  authorHelpSetting: ISectionFillinHelpSetting;
  allowReset: boolean;
  promptColumns: number;
  showHelpPresets: boolean;
  prompts: ISectionContent[];
}
export function ISectionFillinVariantInitializer(
  sectionFillinIdx: number = IDX_INITIALIZER,
  promptsLabel: string = "",
  responsesLabel: string = "",
  layout = SectionFillinLayoutType.grid
): ISectionFillinVariant {
  return {
    sectionFillinIdx: sectionFillinIdx,
    helpPresetLevel: SectionFillinHelpPresetLevel.override,
    authorHelpSetting: ISectionFillinHelpSettingInitializer(
      "no description",
      promptsLabel,
      responsesLabel,
      layout
    ),
    allowReset: false,
    promptColumns: 1,
    showHelpPresets: false,
    prompts: []
  };
}
export type ISectionFillinHelpPresets = ISectionFillinHelpSetting[];
export function ISectionFillinHelpPresetsInitializer(): ISectionFillinHelpPresets {
  return [
    {
      // default
      description: "no responses displayed",
      showResponsesInPrompts: false,
      layout: SectionFillinLayoutType.hidden,
      responsesLabel: "",
      promptsLabel: "Fillin the following blanks:",
      // igonore parameters below
      sortOrder: SectionFillinSortOrder.insert,
      gridColumns: 6,
      groupByCategory: false,
      showResponseHints: false,
      showPromptHints: false,
      unique: true,
      showReferenceCount: true,
      helpfulness: 0
    },
    {
      description: "responses displayed as grid in random order",
      responsesLabel: "",
      promptsLabel: "",
      layout: SectionFillinLayoutType.grid,
      sortOrder: SectionFillinSortOrder.insert,
      gridColumns: 6,
      // igonore parameters below
      showResponsesInPrompts: false,
      groupByCategory: false,
      showResponseHints: false,
      showPromptHints: false,
      unique: true,
      showReferenceCount: true,
      helpfulness: 0
    },
    {
      description: "responses displayed as grid in alphabetical order",
      responsesLabel: "",
      promptsLabel: "",
      layout: SectionFillinLayoutType.grid,
      gridColumns: 6,
      sortOrder: SectionFillinSortOrder.insert,
      showResponsesInPrompts: false,
      groupByCategory: false,
      showResponseHints: false,
      showPromptHints: false,
      unique: true,
      showReferenceCount: true,
      helpfulness: 0
    },
    {
      description: "responses displayed as grid in order",
      responsesLabel: "",
      promptsLabel: "",
      layout: SectionFillinLayoutType.grid,
      gridColumns: 6,
      sortOrder: SectionFillinSortOrder.insert,
      showResponsesInPrompts: false,
      groupByCategory: false,
      showResponseHints: false,
      showPromptHints: false,
      unique: true,
      showReferenceCount: true,
      helpfulness: 0
    },
    {
      description: "responses displayed inline",
      showResponsesInPrompts: true,
      responsesLabel: "Responses (already filled in):",
      promptsLabel:
        "Recite the following prompts including the underlined words:",
      layout: SectionFillinLayoutType.hidden,
      gridColumns: 0,
      sortOrder: SectionFillinSortOrder.insert,
      groupByCategory: false,
      showResponseHints: false,
      showPromptHints: false,
      unique: true,
      showReferenceCount: true,
      helpfulness: 0
    }
  ];
}
export enum ImageEntryOrientationEnumType {
  left = "left", // default, image to the left of caption
  above = "above" // image above caption
}
export interface ISectionImageEntryVariant {
  title: string;
  orientation: ImageEntryOrientationEnumType;
  percent: string;
  separator: string;
  images: ITerminalContent[]; // path to img/filenames
  captions: ISectionContent[];
}
export function ISectionImageEntryVariantInitializer(): ISectionImageEntryVariant {
  return {
    title: "",
    orientation: ImageEntryOrientationEnumType.left,
    percent: "33%",
    separator: "",
    images: [],
    captions: []
  };
}
export interface ISectionTbdVariant {
  context: string; // message in a bottle
}
export function ISectionTbdVariantInitializer(): ISectionTbdVariant {
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
export function ISentenceContentInitializer(): ISentenceContent {
  return {
    id: IDX_INITIALIZER,
    content: "",
    firstTermIdx: IDX_INITIALIZER,
    lastTermIdx: IDX_INITIALIZER,
    terminals: [],
    lastPunctuation: ""
  };
}
export enum TerminalMetaEnumType {
  acronym,
  currency,
  date,
  emailaddress,
  fillin,
  image,
  link,
  numberwithcommas,
  numerals,
  passthruTag,
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
enum PartOfSpeechEnumType {
  "noun",
  "verb",
  "pronoun",
  "preposition",
  "adverb",
  "advective",
  "interjection",
  "article",
  "conjunction",
  "numeral"
}
export interface ITerminalCues {
  partOfSpeech: PartOfSpeechEnumType;
  definition: string;
  image: string;
}
export interface ITerminalContent {
  id: number;
  termIdx: number;
  firstTermIdx: number;
  lastTermIdx: number;
  content: string; // not necessary
  cueList: string;
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
  | IFillinTerminalMeta
  | INumeralsTerminalMeta
  | IPassthruTagTerminalMeta
  | IPhoneNumberTerminalMeta
  | IPunctuationTerminalMeta
  | IReferenceTerminalMeta
  | ISymbolTerminalMeta
  | ITimeTerminalMeta
  | IWhitespaceTerminalMeta
  | IWordTerminalMeta
  | IYearTerminalMeta;

interface IFillinResponse {
  sectionIdx: number;
  responseIdx: number;
}
export interface ITerminalInfo {
  content: string;
  termIdx: number;
  nextTermIdx: number[];
  prevTermIdx: number[];
  cues: string[];
  altpronunciation: string;
  altrecognition: string;
  recitable: boolean;
  audible: boolean;
  linkable: boolean;
  visible: boolean;
  visited: boolean;
  numberAsNumerals: boolean;
  linkIdx: number;
  hintsIdx: number;
  fillin: IFillinResponse;
  bold: boolean;
  italics: boolean;
  markupTag: boolean;
  //cues: string[] includes terminal type word, day, month, year, number, area code,...
}
export function ITerminalInfoInitializer(
  content: string = "",
  altpronunciation: string = "",
  altrecognition: string = "",
  cues: string[] = [],
  recitable: boolean = true,
  audible: boolean = true,
  linkable: boolean = false,
  visible: boolean = true,
  visited: boolean = false,
  numberAsNumerals: boolean = false,
  linkIdx: number = IDX_INITIALIZER,
  hintsIdx: number = IDX_INITIALIZER,
  fillin: IFillinResponse = {
    sectionIdx: IDX_INITIALIZER,
    responseIdx: IDX_INITIALIZER
  },
  bold = false,
  italics = false,
  markupTag = false
): ITerminalInfo {
  return {
    content: (content === undefined ? "" : content)!,
    cues: cues,
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
    visited: visited,
    numberAsNumerals: numberAsNumerals,
    linkIdx: linkIdx,
    hintsIdx: hintsIdx,
    fillin: fillin, // sectionFillin specific
    bold: bold,
    italics: italics,
    markupTag: markupTag
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
      undefined, // accept default cues
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
      undefined, // accept default cues
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
      undefined, // accept default cues
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
      undefined, // accept default cues
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
export interface IFillinTerminalMeta {
  terminals: ITerminalContent[];
  sectionFillinIdx: number;
  //  responseIdx: number;
}
export function IFillinTerminalMetaInitializer(
  terminals: ITerminalContent[] = [],
  sectionFillinIdx = IDX_INITIALIZER
  //  responseIdx = IDX_INITIALIZER
): IFillinTerminalMeta {
  return {
    terminals,
    sectionFillinIdx
    // responseIdx
  };
}
export interface INumeralsTerminalMeta {
  numerals: ITerminalInfo[];
}
export interface IPassthruTagTerminalMeta {
  tag: string;
}
export function IPassthruTagTerminalMetaTerminalMetaInitializer(): IPassthruTagTerminalMeta {
  return {
    tag: ""
  };
}
export interface IImageTerminalMeta {
  src: string;
  label: string;
  width: number;
  height: number;
  attributes: string;
  destination: ILinkDestination;
  linkIdx: number;
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
    destination: ILinkDestinationInitializer(),
    linkIdx: IDX_INITIALIZER,
    className: "",
    style: "" // most specific style
  };
}
export enum LinkIdxDestinationType {
  page = "page",
  heading = "heading",
  section = "section",
  terminal = "terminal"
}
interface ILinkDestination {
  page: string;
  directory: string; // if omitted, current dist/ directory
  linkIdxType: LinkIdxDestinationType;
  headingIdx: number;
  sectionIdx: number;
  terminalIdx: number;
}
function ILinkDestinationInitializer() {
  return {
    page: "",
    directory: "",
    linkIdxType: LinkIdxDestinationType.page,
    headingIdx: IDX_INITIALIZER,
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
    linkIdx: IDX_INITIALIZER // linkList idx
  };
}
export function INumeralsTerminalMetaInitializer(): INumeralsTerminalMeta {
  return {
    numerals: []
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
      undefined, // accept default cues
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
      undefined, // accept default cues
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
      undefined, // accept default cues
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
      undefined, // accept default cues
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
    undefined, // accept default cues
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
    undefined, // accept default cues
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
  destination: ILinkDestination = ILinkDestinationInitializer(),
  valid = false
): ILinkListItem {
  return { label, destination, valid };
}
// export interface IFillinItem {
//   content: string; // for display in response list
//   referenceCount: number;
// }
export interface IFillinResponseItem {
  content: string; // for display in response list
  category: string;
  referenceCount: number;
}
export function IFillinResponseItemInitializer(
  content: string,
  category: string,
  referenceCount: number
): IFillinResponseItem {
  return {
    content: content,
    category: category,
    referenceCount: referenceCount
  };
}
export type IFillinResponses = IFillinResponseItem[];
export function IFillinResponsesInitializer(): IFillinResponses {
  return [];
}
export interface IFillinPromptItem {
  visible: boolean;
  responseIdx: number; // index into section response context
}
export interface ISectionFillinItem {
  idx: number;
  showHelpPresets: boolean;
  helpPresetLevel: SectionFillinHelpPresetLevel;
  authorHelpSetting: ISectionFillinHelpSetting;
  currentHelpSetting: ISectionFillinHelpSetting;
  allowReset: boolean;
  promptColumns: number;
  responses: IFillinResponseItem[]; // index into section response context
  loaded: boolean;
  modified: boolean; // supports reset
}
export function ISectionFillinItemInitializer(
  idx: number = IDX_INITIALIZER,
  showHelpPresets: boolean = false,
  helpPresetLevel: SectionFillinHelpPresetLevel = SectionFillinHelpPresetLevel.override,
  authorHelpSetting: ISectionFillinHelpSetting = ISectionFillinHelpSettingInitializer(),
  currentHelpSetting: ISectionFillinHelpSetting = ISectionFillinHelpSettingInitializer(),
  allowReset: boolean = true,
  promptColumns: number = 1,
  responses: IFillinResponseItem[] = [],
  //  prompts: IFillinPromptItem[] = [],
  loaded: boolean = false,
  modified: boolean = false
): ISectionFillinItem {
  return {
    idx,
    showHelpPresets,
    helpPresetLevel,
    authorHelpSetting,
    currentHelpSetting,
    allowReset,
    promptColumns,
    responses,
    loaded,
    modified
  };
}
// export interface ISectionFillinList {
//   groupDuplicates: boolean;
//   sortOrder: boolean; // sort alphabetically
//   fillinList: IFillinItem[];
// }
// export function ISectionFillinListInitializer(
//   groupDuplicates: boolean = true,
//   sortOrder: boolean = true, // sort alphabetically
//   fillinList: IFillinItem[] = []
// ): ISectionFillinList {
//   return {
//     groupDuplicates,
//     sortOrder,
//     fillinList
//   };
// }
// export const sortOrderToLabel = (sortOrder: SectionFillinSortOrder): string => {
//   switch (sortOrder) {
//     case SectionFillinSortOrder.alphabetical:
//       return "alphabetical order";
//     case SectionFillinSortOrder.random:
//       return "random order";
//     default:
//       return "insert order (default)";
//   }
// };
