/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: PageContentType.ts
 *
 * Defines interface between markdown input and react front end
 *
 * Version history:
 *
 **/
export const IDX_INITIALIZER = -9999;
export const PageContentVersion = "20250718.1";
// 20250718 - Added more IInlineButtonItem fields// 20250109 - Added nextButtonIdx IInlineButtonItem
// 20250109 - Added nextButtonIdx IInlineButtonItem
// 20230916 - Modified inlineButtonItem.sectionIdx
// 20240821 - Added inlineButtonItem.nextTermIdx
// 20240817 - Added inlineButtonItem.endListIdx
// 20240807 - Added support for inlineButton and buttongrid
// 20240713 - Move and renamed enum const InlineButton* to
// 20240719 - Added position to IInlineButtonItem
//            Renamed RecitationPosition to RecitationPlacement and retasked
//            (cursor) position enum for relative position of prose to be
//            recited for inline button.
// 20240724 - Added InlineButtonActionEnumType in IInlineButtonItem
// 20241111 - Added sentence transition to SentenceListItem[]
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
  headingNumbering: string;
  showTags: boolean;
  columnCount: number;
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
  inlineButtonList: IInlineButtonItem[];
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
    headingNumbering: "",
    showTags: false,
    columnCount: 0,
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
    fillinList: [],
    inlineButtonList: []
  };
}
export interface ISectionContent {
  id: number;
  name: string;
  description: string;
  firstTermIdx: number;
  lastTermIdx: number;
  showTags: boolean;
  columnCount: number;
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
  | ISectionGroupFillinVariant
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
  group_fillin = "groupfillin",
  image_entry = "image_entry",
  button_grid = "buttongrid",
  blockquote = "blockquote",
  unittest = "unittest",
  empty = "empty",
  tbd = "tbd"
}
export enum AutodNumberedHeadingEnumType {
  none = "",
  list = "list", // flat numercal list
  numerical = "numerical",
  alphaNumerical = "alphaNumerical",
  outline = "outline",
  alphabetical = "alphabetical",
  numAlphabetical = "numericAlphabetical"
}
export enum AutodNumberedOrderedListTypeEnumType {
  none = "",
  numberedList = "list", // flat numercal list
  numerical = "numerical",
  alphaNumerical = "alphaNumerical",
  outline = "outline",
  alphabetical = "alphabetical",
  numAlphabetical = "numericAlphabetical",
  scenario = "scenario",
  multipleChoice = "multipleChoice"
}
export enum UnorderedListMarkerEnumType { // standard HTML
  disc, //default
  circle,
  square,
  none,
  custom
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
  tag: string;
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
    level: 0,
    tag: ""
  };
}
export interface ISectionButtonGridVariant {
  title: string;
  buttonWidth: number;
  description: string;
  columnCount: number;
  minColumnWidth: number;
  sorted: boolean;
  groupedBy: boolean;
  rate: number;
  buttons: ITerminalContent[];
}
export function ISectionButtonGridVariantInitializer(): ISectionButtonGridVariant {
  return {
    title: "",
    buttonWidth: 0,
    description: "",
    columnCount: 0,
    minColumnWidth: 11, // %vw
    sorted: false,
    groupedBy: false,
    rate: 1,
    buttons: []
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
}
export function ISectionListitemVariantInitializer(): ISectionListitemVariant {
  return {
    depth: 0
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
    marker: UnorderedListMarkerEnumType.disc
  };
}
export interface ISectionOrderedListVariant {
  items: ISectionContent[]; // list item (paragraph) or another deeper list
  ///  items: ISectionNode[]; // list item (paragraph) or another deeper list
  depth: number;
  startNumber: number;
  orderedListType: AutodNumberedOrderedListTypeEnumType;
}
export function ISectionOrderedListVariantInitializer(): ISectionOrderedListVariant {
  return {
    items: [], // list item (paragraph) or another deeper list
    depth: 0,
    startNumber: 0,
    orderedListType: AutodNumberedOrderedListTypeEnumType.numberedList //  overrides css but not user profile
  };
}
export interface ISectionParagraphVariant {
  sentences: ISentenceContent[];
  //sentences: ISentenceNode[];
  listItem: boolean;
  style: string; // overrides css but not user profile
  class: string;
}
export function ISectionParagraphVariantInitializer(): ISectionParagraphVariant {
  return {
    sentences: [],
    listItem: false,
    style: "", // overrides css but not user profile
    class: "p"
  };
}
// key = valid response; distractor = invalid key/alternatives
//
// pickList(OfSingleKeys): Each prompt has a corresponding key/valid responsekey.
// Responses from multiple prompts are combined into a single pick list.
// Alternatives are ignored.
//
// multipleChoice: Each prompt has a corresponding key/valid response along
// with one or more incorrect distractors/alternatives. Alternatives are
// invallid.
//
// familyFeud aka multipleChoiceMultipleKeys: Each prompt has multiple
// corresponding keys/valid responses defined as the fillin responses and
// alternatives. Alternatives are valid.
export enum SectionFillinType {
  pickList = "pickList",
  multipleChoice = "multipleChoice",
  familyFeud = "familyFeud"
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
export enum SectionFillinResponsesProgressionEnum {
  hidden = "hidden",
  random = "randomly",
  alphabetical = "alphabetically",
  inorder = "in order",
  inline = "inline"
}
export enum SectionFillinPresetName {
  // indexes ISectionFillinHelpPresets below
  override = "override",
  hidden = "hidden",
  gridRandom = "gridRandom",
  gridAlpha = "gridAlpha",
  gridInOrder = "gridInOrder",
  inline = "inline",
  multipleChoice = "multipleChoice"
}
export enum SectionFillinPresetLevel {
  override = -1,
  hidden,
  gridRandom,
  gridAlpha,
  gridInOrder,
  multipleChoice,
  inline
}
export const SectionFillinPresetMap = {
  [SectionFillinPresetName.override]: SectionFillinPresetLevel.override,
  [SectionFillinPresetName.hidden]: SectionFillinPresetLevel.hidden,
  [SectionFillinPresetName.gridRandom]: SectionFillinPresetLevel.gridRandom,
  [SectionFillinPresetName.gridAlpha]: SectionFillinPresetLevel.gridAlpha,
  [SectionFillinPresetName.gridInOrder]: SectionFillinPresetLevel.gridInOrder,
  [SectionFillinPresetName.multipleChoice]:
    SectionFillinPresetLevel.multipleChoice,
  [SectionFillinPresetName.inline]: SectionFillinPresetLevel.inline
};
interface IPresetLevelSetting {
  level: SectionFillinPresetLevel;
  setting: ISectionFillinSettings;
}
type SectionFillinPresetInfoType = Record<
  SectionFillinPresetLevel,
  IPresetLevelSetting
>;
export const SectionFillinPresetInfo = {
  [SectionFillinPresetLevel.override]: ISectionFillinSettingsInitializer(),
  [SectionFillinPresetLevel.hidden]: {
    // default
    description: "Responses not displayed",
    showResponsesInPrompts: false,
    layout: SectionFillinLayoutType.hidden,
    responsesLabel: "",
    promptsLabel: "Recite the following prompts and fill in the blanks:",
    // igonore parameters below
    progressionOrder: SectionFillinResponsesProgressionEnum.inorder,
    gridColumns: 6,
    groupByTags: false,
    showResponseTags: false,
    showPromptTags: false,
    unique: true,
    showAlternatives: false,
    responsesLayout: SectionFillinPositionType.above,
    showReferenceCount: true,
    helpfulness: 0
  },
  [SectionFillinPresetLevel.gridRandom]: {
    description: "Responses displayed as grid in random order",
    responsesLabel: "Responses displayed as grid randomly:",
    promptsLabel: "Recite the following prompts and fill in the blanks:",
    layout: SectionFillinLayoutType.grid,
    progressionOrder: SectionFillinResponsesProgressionEnum.random,
    gridColumns: 6,
    // igonore parameters below
    showResponsesInPrompts: false,
    groupByTags: false,
    showResponseTags: false,
    showPromptTags: false,
    unique: true,
    showAlternatives: false,
    responsesLayout: SectionFillinPositionType.above,
    showReferenceCount: true,
    helpfulness: 0
  },
  [SectionFillinPresetLevel.gridAlpha]: {
    description: "Responses displayed as grid in alphabetical order",
    responsesLabel: "Responses displayed as grid alphabetically:",
    promptsLabel: "Recite the following prompts and fill in the blanks:",
    layout: SectionFillinLayoutType.grid,
    gridColumns: 6,
    progressionOrder: SectionFillinResponsesProgressionEnum.alphabetical,
    showResponsesInPrompts: false,
    groupByTags: false,
    showResponseTags: false,
    showPromptTags: false,
    unique: true,
    showAlternatives: false,
    responsesLayout: SectionFillinPositionType.above,
    showReferenceCount: true,
    helpfulness: 0
  },
  [SectionFillinPresetLevel.gridInOrder]: {
    description: "Responses displayed as grid in order",
    responsesLabel: "Responses displayed as grid in order:",
    promptsLabel: "Recite the following prompts and fill in the blanks:",
    layout: SectionFillinLayoutType.grid,
    gridColumns: 6,
    progressionOrder: SectionFillinResponsesProgressionEnum.inorder,
    showResponsesInPrompts: false,
    groupByTags: false,
    showResponseTags: false,
    showPromptTags: false,
    unique: true,
    showAlternatives: false,
    responsesLayout: SectionFillinPositionType.above,
    showReferenceCount: true,
    helpfulness: 0
  },
  [SectionFillinPresetLevel.inline]: {
    description: "Responses displayed inline",
    showResponsesInPrompts: true,
    responsesLabel: "Responses already filled in:",
    promptsLabel:
      "Recite the following prompts including the underlined words:",
    layout: SectionFillinLayoutType.hidden,
    gridColumns: 0,
    progressionOrder: SectionFillinResponsesProgressionEnum.inorder,
    groupByTags: false,
    showResponseTags: false,
    showPromptTags: false,
    unique: true,
    showAlternatives: false,
    responsesLayout: SectionFillinPositionType.above,
    showReferenceCount: true,
    helpfulness: 0
  }
};
export interface ISectionFillinSettings {
  description: string;
  responsesLabel: string;
  promptsLabel: string;
  layout: SectionFillinLayoutType;
  showProgression: boolean;
  progressionOrder: SectionFillinResponsesProgressionEnum;
  gridColumns: number;
  showResponsesInPrompts: boolean;
  responsesLayout: SectionFillinPositionType;
  showAlternatives: boolean;
  groupByTags: boolean;
  showResponseTags: boolean; //same as groupCategory?
  showPromptTags: boolean;
  unique: boolean; // identical words grouped as single response entry
  showReferenceCount: boolean;
  helpfulness: number; // most hints to least hints
}
export function ISectionFillinSettingsInitializer(
  description: string = "",
  promptsLabel: string = "",
  responsesLabel: string = "",
  layout = SectionFillinLayoutType.grid
): ISectionFillinSettings {
  return {
    description: description,
    responsesLabel: responsesLabel,
    promptsLabel: promptsLabel,
    layout: layout,
    showProgression: true,
    progressionOrder: SectionFillinResponsesProgressionEnum.inorder,
    gridColumns: 6,
    showResponseTags: false,
    showPromptTags: false,
    groupByTags: false,
    showResponsesInPrompts: false,
    responsesLayout: SectionFillinPositionType.above,
    showAlternatives: false,
    unique: false, // identical words grouped as single response entry
    showReferenceCount: false,
    helpfulness: -1
  };
}
export interface ISectionGroupFillinVariant {
  promptsPerSubsection: number;
  subsectionLabel: string;
  randomize: boolean;
  prompts: ISectionContent[];
}
export function ISectionGroupFillinVariantInitializer(
  promptsPerSubsection: number = 0,
  subsectionLabel: string = "",
  randomize: boolean = false,
  prompts: ISectionContent[] = []
): ISectionGroupFillinVariant {
  return {
    promptsPerSubsection: promptsPerSubsection,
    subsectionLabel: subsectionLabel,
    randomize: randomize,
    prompts: prompts
  };
}
export interface ISectionFillinVariant {
  sectionFillinIdx: number; // reference state structure in pageList.fillinList
  presetLevel: SectionFillinPresetLevel;
  authorSetting: ISectionFillinSettings;
  allowReset: boolean;
  maxPromptsPerSection: number;
  promptColumns: number;
  showPresets: boolean;
  prompts: ISectionContent[];
  subsectionOrdinal: number;
  subsectionInterval: number;
  subsectionLabel: string;
}
export function ISectionFillinVariantInitializer(
  sectionFillinIdx: number = IDX_INITIALIZER,
  promptsLabel: string = "",
  responsesLabel: string = "",
  layout = SectionFillinLayoutType.grid
): ISectionFillinVariant {
  return {
    sectionFillinIdx: sectionFillinIdx,
    presetLevel: SectionFillinPresetLevel.override,
    authorSetting: ISectionFillinSettingsInitializer(
      "no description",
      promptsLabel,
      responsesLabel,
      layout
    ),
    allowReset: false,
    maxPromptsPerSection: 0,
    promptColumns: 1,
    showPresets: false,
    prompts: [],
    subsectionOrdinal: -1,
    subsectionInterval: 0,
    subsectionLabel: ""
  };
}
export type ISectionFillinPresets = ISectionFillinSettings[];
export function ISectionFillinPresetsInitializer(): ISectionFillinPresets {
  return [
    {
      // default
      description: "no responses displayed",
      showResponsesInPrompts: false,
      layout: SectionFillinLayoutType.hidden,
      responsesLabel: "",
      promptsLabel: "Fillin the following blanks:",
      // igonore parameters below
      showProgression: true,
      progressionOrder: SectionFillinResponsesProgressionEnum.inorder,
      gridColumns: 6,
      showResponseTags: false,
      showPromptTags: false,
      groupByTags: false,
      responsesLayout: SectionFillinPositionType.above,
      showAlternatives: false,
      unique: true,
      showReferenceCount: true,
      helpfulness: 0
    },
    {
      description: "responses displayed as grid in random order",
      responsesLabel: "",
      promptsLabel: "",
      layout: SectionFillinLayoutType.grid,
      showProgression: true,
      progressionOrder: SectionFillinResponsesProgressionEnum.inorder,
      gridColumns: 6,
      // igonore parameters below
      showResponsesInPrompts: false,
      groupByTags: false,
      responsesLayout: SectionFillinPositionType.above,
      showAlternatives: false,
      showResponseTags: false,
      showPromptTags: false,
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
      showProgression: true,
      progressionOrder: SectionFillinResponsesProgressionEnum.inorder,
      showResponsesInPrompts: false,
      groupByTags: false,
      responsesLayout: SectionFillinPositionType.above,
      showAlternatives: false,
      showResponseTags: false,
      showPromptTags: false,
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
      showProgression: true,
      progressionOrder: SectionFillinResponsesProgressionEnum.inorder,
      showResponsesInPrompts: false,
      groupByTags: false,
      responsesLayout: SectionFillinPositionType.above,
      showAlternatives: false,
      showResponseTags: false,
      showPromptTags: false,
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
      showProgression: true,
      progressionOrder: SectionFillinResponsesProgressionEnum.inorder,
      groupByTags: false,
      responsesLayout: SectionFillinPositionType.above,
      showAlternatives: false,
      showResponseTags: false,
      showPromptTags: false,
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
  frameFormat: string;
  separator: string;
  images: ITerminalContent[]; // path to img/filenames
  captions: ISectionContent[];
}
export function ISectionImageEntryVariantInitializer(): ISectionImageEntryVariant {
  return {
    title: "",
    orientation: ImageEntryOrientationEnumType.left,
    percent: "33%",
    frameFormat: "rounded-box box-shadow",
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
  inlinebutton,
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
export enum PartOfSpeechEnumType { // ordered by frequency
  noun = "noun",
  helpingVerb = "helping verb",
  verb = "verb",
  adjective = "adjective",
  adverb = "adverb",
  preposition = "preposition",
  pronoun = "pronoun",
  conjunction = "conjunction",
  article = "article",
  interjection = "interjection",
  numeral = "numeral",
  subject = "subject",
  object = "object",
  directObject = "direct object",
  objectIndirect = "indirect object",
  untagged = "untagged"
}
interface PartOfSpeechItemType {
  name: PartOfSpeechEnumType;
  pattern: RegExp;
  abbreviation: string;
  description: string;
}
export type PartOfSpeechDictionaryType = Record<
  PartOfSpeechEnumType,
  PartOfSpeechItemType
>;
export const PartOfSpeechDictionary = {
  [PartOfSpeechEnumType.noun]: {
    name: PartOfSpeechEnumType.noun,
    abbreviation: "n.",
    description: "identifies a person, a class of people, places or things",
    pattern: /(^[Nn].*)/
  },
  [PartOfSpeechEnumType.helpingVerb]: {
    name: "helping verb",
    abbreviation: "hv.",
    description: "verb that helps main verb",
    pattern: /(^[Hh]elp.*)/
  },
  [PartOfSpeechEnumType.verb]: {
    name: "verb",
    abbreviation: "v.",
    description: "conveys action, occurence, state of being",
    pattern: /(^[Vv].*)/
    // distinction between linking (copular) and helping (auxliary) verbs?
  },
  [PartOfSpeechEnumType.adjective]: {
    name: "adjective",
    abbreviation: "adj.",
    description: "modifies noun or pronoun",
    pattern: /(^[Aa]dj.*)/
  },
  [PartOfSpeechEnumType.adverb]: {
    name: "adverb",
    abbreviation: "adv.",
    description: "modifies adjective, verb or another adverb",
    pattern: /(^[Aa]dv.*)/
  },
  [PartOfSpeechEnumType.preposition]: {
    name: "preposition",
    abbreviation: "prep.",
    description: "relates objects spatially or temporally",
    pattern: /(^[Pp]re.*)/
  },
  [PartOfSpeechEnumType.pronoun]: {
    name: "pronoun",
    abbreviation: "pron.",
    description: "substitutes for a noun",
    pattern: /(^[Pp]ro.*)/
  },
  [PartOfSpeechEnumType.conjunction]: {
    name: "conjunction",
    abbreviation: "conj.",
    description: "conjunction",
    pattern: /(^[Cc].*)/
  },
  [PartOfSpeechEnumType.article]: {
    name: "article",
    abbreviation: "art.",
    description: "describes (in)definiteness or limits quantity of noun(s)",
    pattern: /(^[Aa]r.*)/
  },
  [PartOfSpeechEnumType.interjection]: {
    name: "interjection",
    abbreviation: "interj.",
    description: "expresses feeling or emotion",
    pattern: /(^[Ii]nt.*)/
  },
  [PartOfSpeechEnumType.numeral]: {
    name: "numeral/number",
    abbreviation: "num.",
    description: "numeral",
    pattern: /(^[Nn]u.*)/
  },
  [PartOfSpeechEnumType.subject]: {
    name: "subject",
    abbreviation: "subj.",
    description: "describes subject of sentence",
    pattern: /(^[Ss]u.*)/
  },
  [PartOfSpeechEnumType.object]: {
    name: "object",
    abbreviation: "obj.",
    description: "describes object of sentence",
    pattern: /(^[Oo]b.*)/
  },
  [PartOfSpeechEnumType.directObject]: {
    name: "direct object",
    abbreviation: "DO",
    description: "describes object affected by verb",
    pattern: /(^[Dd]ir.*)/
  },
  [PartOfSpeechEnumType.objectIndirect]: {
    name: "indirect object",
    abbreviation: "IO",
    description: "describes object affected by transitive verb",
    pattern: /(^[Ii]nd.*)/
  },
  [PartOfSpeechEnumType.untagged]: {
    name: "untagged",
    abbreviation: "untagged",
    description: "to be tagged",
    pattern: /^$/
  }
};
export enum VnestEnumType { // ordered by frequency
  who = "who",
  what = "what",
  where = "where",
  when = "when",
  why = "why",
  how = "how",
  untagged = "untagged"
}
export interface ITerminalCues {
  partOfSpeech: PartOfSpeechEnumType;
  definition: string;
  image: string;
  alternatives: string[];
}
export function ITerminalCuesInitializer(
  partOfSpeech: PartOfSpeechEnumType = PartOfSpeechEnumType.untagged,
  definition: string = "",
  image: string = "",
  alternatives: string[] = []
): ITerminalCues {
  return {
    partOfSpeech,
    definition,
    image,
    alternatives
  };
}
export interface ITerminalContent {
  id: number;
  termIdx: number;
  firstTermIdx: number;
  lastTermIdx: number;
  content: string; // not necessary
  cueList: string;
  cues: ITerminalCues;
  type: TerminalMetaEnumType;
  meta: TerminalMetaType;
}
export type TerminalMetaType =
  | IAcronymTerminalMeta
  | IInlineButtonTerminalMeta
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
function IFillinResponseInitializer(): IFillinResponse {
  return {
    sectionIdx: IDX_INITIALIZER,
    responseIdx: IDX_INITIALIZER
  };
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
  heading: boolean;
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
  heading: boolean = false,
  audible: boolean = true,
  linkable: boolean = false,
  visible: boolean = true,
  visited: boolean = false,
  numberAsNumerals: boolean = false,
  linkIdx: number = IDX_INITIALIZER,
  hintsIdx: number = IDX_INITIALIZER,
  fillin: IFillinResponse = IFillinResponseInitializer(),
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
    heading: heading,
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
export interface IInlineButtonTerminalMeta {
  buttonIdx: number;
  label: string;
  // image: string;
  // sortKey: string;
  attributes: string;
}
export function IInlineButtonTerminalMetaInitializer(): IInlineButtonTerminalMeta {
  return {
    buttonIdx: IDX_INITIALIZER,
    label: "Recite",
    // image: "button_speak.png",
    // sortKey: "",
    attributes: ""
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
  overlay: string;
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
    overlay: "",
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
  terminalInfo: ITerminalInfo = ITerminalInfoInitializer(),
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
  firstTermIdx: number; // either first word of section title OR first word in section body
  lastTermIdx: number;
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
//   //  type: SectionVariantEnumType | string = SectionVariantEnumType.untagged
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
export enum SentenceListItemEnumType {
  default = "default",
  multipleChoiceOption = "mcoption",
  fillin = "fillin",
  multipleChoiceQuestion = "mcquestion",
  model = "model"
}
export interface ISentenceListItem extends IRangeItem {
  lastPunctuation: string;
  type: SentenceListItemEnumType;
}
export function ISentenceListItemInitializer(
  firstTermIdx: number = IDX_INITIALIZER,
  lastTermIdx: number = IDX_INITIALIZER,
  lastPunctuation: string = ".",
  type: SentenceListItemEnumType = SentenceListItemEnumType.default
): ISentenceListItem {
  return {
    firstTermIdx,
    lastTermIdx,
    lastPunctuation,
    type
  };
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
export enum InlineButtonActionEnumType {
  choice = "choice", // recites correct/incorrect
  completion = "completion", //recite up to then listen
  converse = "converse", // diaglog of sentence pairs
  cues = "cues", // embedded text
  label = "label", // label with icon
  model = "model", // recite then listen for the same words/sentence
  none = "none", // do nothing
  script = "script", // recite script
  term = "term" // label with no icon
}
export enum ModelingScopeEnumType {
  word = "word", // modeling current word 
  sentence = "sentence", // modeling current sentence (default)
  inlineButton = "inlineButton" // modeling sentence associated with button idx
}
export enum RecitationScopeEnumType {
  // preceding and succeeding sentence fragments can be described with negative 
  // and positive spans
  default = "words",
  words = "words",
  sentence = "sentence",
  section = "section",
  passThru = "passThru",
}
// strictly for inlineButton words, sentence, section only based on currentTerm
export enum RecitationReferenceEnumType {
  preceding = "preceding",
  following = "following"
}
export enum RecitationPlacementEnumType {
  unchanged = "cursorUnchanged", // (default) cursor unchanged
  end = "cursorAtEnd", // after prose in scope
  beginning = "cursorAtBeginning" // before prose in scope
}
export enum RecitationListeningEnumType {
  startListening = "startListening",
  startEndListening = "start then end listening",
  notListening = "notListening"
}
// export enum InlineButtonScopeEnumType {
//   label = "label", // label provided
//   word = "word", // next words up to count
//   hint = "hint", // hint in parameter list
//   sentence = "sentence" // next sentence
// }
// export enum InlineButtonCursorActionEnumType {
//   cursorUnchanged = "cursorUnchanged", // (default) cursor unchanged
//   cursorAtEnd = "cursorAtEnd", // after prose in scope
//   cursorAtBeginning = "cursorAtBeginning" // before prose in scope
// }
// export enum InlineButtonListeningActionEnumType {
//   startListening = "startListening",
//   notListening = "notListening"
// }
export interface IInlineButtonItem {
  buttonIdx: number;
  termIdx: number;
  sectionIdx: number;
  lastTermIdx: number;
  action: InlineButtonActionEnumType;
  span: number;
  label: string;
  cues: string; // should be string[]
  rate: number; // otherwise default to page, app settings
  voiceIndex: number;
  nextTermIdx: number;
  nextButtonIdx: number;
  toBeRecited: string;
  continuation: number; // continuation of modeling
  repetitions: number;
  obscurityIndex: number
}
export function IInlineButtonItemInitializer(
  buttonIdx = IDX_INITIALIZER,
  termIdx = IDX_INITIALIZER,
  sectionIdx = IDX_INITIALIZER,
  lastTermIdx = IDX_INITIALIZER,
  action = InlineButtonActionEnumType.label,
  span = 0,
  label = "",
  cues = "",
  rate = 1,
  voiceIndex = 0,
  nextTermIdx = IDX_INITIALIZER,
  nextButtonIdx = IDX_INITIALIZER,
  toBeRecited = "",
  continuation = 0,
  repetitions = 0,
  obscurityIndex = 0
): IInlineButtonItem {
  return {
    buttonIdx,
    termIdx,
    sectionIdx,
    lastTermIdx,
    action,
    span,
    label,
    cues,
    rate,
    voiceIndex,
    nextTermIdx,
    nextButtonIdx,
    toBeRecited,
    continuation,
    repetitions,
    obscurityIndex
  };
}
// export interface IFillinItem {
//   content: string; // for display in response list
//   referenceCount: number;
// }
export interface IFillinResponseItem {
  content: string; // for display in response list
  tag: string;
  alternatives: string[];
  referenceCount: number;
}
export function IFillinResponseItemInitializer(
  content: string,
  tag: string,
  alternatives: string[],
  referenceCount: number
): IFillinResponseItem {
  return {
    content: content,
    tag: tag,
    alternatives: alternatives,
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
  showPresets: boolean;
  presetLevel: SectionFillinPresetLevel;
  authorSetting: ISectionFillinSettings;
  currentSetting: ISectionFillinSettings;
  allowReset: boolean;
  promptColumns: number;
  alternatives: string[];
  tags: string[];
  responses: IFillinResponseItem[]; // index into section response context
  loaded: boolean;
  modified: boolean; // supports reset
}
export function ISectionFillinItemInitializer(
  idx: number = IDX_INITIALIZER,
  showPresets: boolean = false,
  presetLevel: SectionFillinPresetLevel = SectionFillinPresetLevel.override,
  authorSetting: ISectionFillinSettings = ISectionFillinSettingsInitializer(),
  currentSetting: ISectionFillinSettings = ISectionFillinSettingsInitializer(),
  allowReset: boolean = true,
  promptColumns: number = 1,
  alternatives: string[] = [],
  tags: string[] = [],
  responses: IFillinResponseItem[] = [],
  //  prompts: IFillinPromptItem[] = [],
  loaded: boolean = false,
  modified: boolean = false
): ISectionFillinItem {
  return {
    idx,
    showPresets,
    presetLevel,
    authorSetting,
    currentSetting,
    allowReset,
    promptColumns,
    alternatives,
    tags,
    responses,
    loaded,
    modified
  };
}
export enum PageRequestItemType {
  unknown = 0,
  home = 1,
  pop = 2,
  link = 3,
  urlParameter = 4,
  intrapage = 5
}
export interface IPageRequestItem {
  page: string;
  currentTermIdx: number;
}
export function PageRequestItemInitializer(
  page: string = "",
  currentIdx: number = 0
): IPageRequestItem {
  return { page: page, currentTermIdx: currentIdx };
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
