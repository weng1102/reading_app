/** Copyright (C) 2020 - 2025 Wen Eng - All Rights Reserved
 *
 * File name: settingsContext.ts
 *
 * Defines setting values for import and export
 * When the user wants to change the settings, clone the context and
 * use that to temporarily store the interim context values. Use object
 * composition of subobjects that map setting sections by implementing
 * value/setValue pairs.
 *
 * For instance, .speech and .listen, etc. class instances each with an
 * instance name and setter.
 *
 * Version history:
 *
 **/
import React from "react";
import { Synthesizer } from "./reactcomp_speech";
import {
  ISectionFillinSettings,
  ISectionFillinPresets,
  ISectionFillinSettingsInitializer,
  ISectionFillinPresetsInitializer,
  SectionFillinLayoutType,
  SectionFillinSortOrder
} from "./pageContentType";
import {
  RecitationScopeEnumType,
  RecitationPlacementEnumType,
  RecitationListeningEnumType
} from "./pageContentType";
export enum RecitationMode {
  wordOnly = "word only",
  wordNext = "word (then advance)",
  uptoExclusive = "partial up to word (exclusive)",
  uptoInclusive = "partial up to word (inclusive)",
  entireSentence = "entire sentence",
  entireSentenceNext = "entire sentence (then advance)",
  section = "section, paragraph, etc.",
  sectionNext = "section, paragraph, etc. (then advance)"
}
export enum RecitationMode1 {
  words = "word sequence",
  sentence = "entire sentence",
  section = "section, paragraph, etc.",
  embedded = "embedded label or hint from inline button"
}
export enum NotificationMode {
  sound = "sound",
  voice = "voice"
}
export interface ISettings {
  config: IConfigSettings;
  speech: ISpeechSettings;
  listen: IListenSettings;
  modeling: IModelingSettings;
  fillin: IFillinSettings;
}
export interface ISettingsContext {
  settings: ISettings;
  saveSettings: (setting: ISettings) => void;
}
export const SettingsInitializer = (
  config: IConfigSettings = ConfigSettingsInitializer(),
  speech: ISpeechSettings = SpeechSettingsInitializer(),
  listen: IListenSettings = ListenSettingsInitializer(),
  modeling: IModelingSettings = ModelingSettingsInitializer(),
  fillin: IFillinSettings = IFillinSettingsInitializer()
): ISettings => {
  // console.log(`retrieve voice and index`);
  return {
    config,
    speech,
    listen,
    modeling,
    fillin
  };
};
export interface IConfigSettings {
  homePage: string;
  distDir: string;
  firstName: string;
  lastName: string;
  showSitemap: boolean;
  navbarWidth: number;
  fontSizeAdjustment: number; // in px
  lineSpacingAdjustment: number; // in px
  fillinPresets: ISectionFillinPresets;
}
export function ConfigSettingsInitializer(
  homePage: string = "ronlyn",
  distDir: string = "https://weng1102.github.io/reading-companion/",
  firstName: string = "Ronlyn",
  lastName: string = "Goo",
  showSitemap: boolean = false,
  navbarWidth: number = 25,
  fontSizeAdjustment: number = 0,
  lineSpacingAdjustment: number = 0,
  fillinPresets: ISectionFillinPresets = ISectionFillinPresetsInitializer()
): IConfigSettings {
  return {
    homePage,
    distDir,
    firstName,
    lastName,
    showSitemap,
    navbarWidth,
    fontSizeAdjustment,
    lineSpacingAdjustment,
    fillinPresets
  };
}
export interface ISpeechSettings {
  scope: RecitationScopeEnumType;
  placement: RecitationPlacementEnumType;
  listening: RecitationListeningEnumType;
  lang: string;
  locale: string;
  gender: string;
  pitch: number;
  rate: number;
  volume: number;
  selectedVoiceIndex: number;
}
export function SpeechSettingsInitializer(
  scope: RecitationScopeEnumType = RecitationScopeEnumType.words,
  placement: RecitationPlacementEnumType = RecitationPlacementEnumType.unchanged,
  listening: RecitationListeningEnumType = RecitationListeningEnumType.notListening,
  lang: string = "English",
  locale: string = "en-US",
  gender: string = "female",
  pitch: number = 0,
  rate: number = 0.75,
  volume: number = 0.5,
  selectedVoiceIndex: number = Synthesizer.selectedVoiceIndex // ms female voice
  // os: string = "windows"
): ISpeechSettings {
  return {
    scope,
    placement,
    listening,
    lang,
    locale,
    gender,
    pitch,
    rate,
    volume,
    selectedVoiceIndex
  };
}
export interface IListenSettings {
  stopAtEndOfSentence: boolean;
  retries: number;
  timeout: number; // time out upon silence
  listeningInterval: number; // msec between listening and matching
  notificationMode: NotificationMode;
  sentenceNotification: string;
  sectionNotification: string;
  excludeHeadings: boolean;
}
export function ListenSettingsInitializer(
  stopAtEndOfSentence: boolean = true,
  retries: number = 5,
  timeout: number = 20, // time out upon silence
  listeningInterval: number = 15, // msec between listening and matching
  notificationMode: NotificationMode = NotificationMode.voice,
  sentenceNotification: string = "new sentence",
  sectionNotification: string = "new section",
  excludeHeadings: boolean = true
): IListenSettings {
  return {
    stopAtEndOfSentence,
    retries,
    timeout,
    listeningInterval,
    notificationMode,
    sentenceNotification,
    sectionNotification,
    excludeHeadings
  };
}
export const enum ObscuredTextDegreeEnum {
  // defines the degree to which prompt/response is obscured
  min = 0,
  unobscured = 0,
  barely = 1,
  partially = 2,
  default = 5,
  mostly = 7,
  invisible = 9,
  totallyObscured = 9,
  max = 9
}
export const enum ObscuredTextTimingEnum {
  // defines when prompt/response is first obscured
  min = 0,
  never = 0,
  afterActivation = 1,
  beforePrompting = 2,
  afterPrompting = 3,
  default = 3,
  afterRecognition = 4,
  always = 5,
  max = 5
}
export const enum ModelingContinuationEnum {
  // defines when prompt/response is first obscured
  min = 0,
  default = 2,
  nextWordAndStop = 0,
  nextModelAndStop = 1,
  nextModelAndContinue = 2,
  max = 2
}
export interface IModelingSettings {
  obscuredTextTiming: ObscuredTextTimingEnum;
  obscuredTextDegree: ObscuredTextDegreeEnum;
  directions: string;
  continuationAction: ModelingContinuationEnum;
  continueToNextModel: boolean;
}
export function ModelingSettingsInitializer(): IModelingSettings {
  return {
    obscuredTextDegree: ObscuredTextDegreeEnum.default, // not obscured
    directions: "repeat the following aloud",
    obscuredTextTiming: ObscuredTextTimingEnum.default, //
    continuationAction: ModelingContinuationEnum.default,
    continueToNextModel: false
  };
}
export enum FillinResponsesProgressionEnum {
  hidden = "hidden",
  random = "randomly",
  alphabetical = "alphabetically",
  inorder = "in order",
  inline = "inline"
}
export enum FillinLayoutType {
  grid = "grid",
  list = "list",
  csv = "csv",
  hidden = "hidden"
}
export enum FillinPositionType {
  above = "above",
  left = "left",
  right = "right",
  below = "below"
}
export interface IFillinSettings {
  description: string;
  responsesLabel: string;
  promptsLabel: string;
  layout: FillinLayoutType;
  showProgression: boolean;
  progressionOrder: FillinResponsesProgressionEnum;
  gridColumns: number;
  showResponsesInPrompts: boolean;
  responsesLayout: FillinPositionType;
  showAlternatives: boolean;
  groupByTags: boolean;
  showResponseTags: boolean; //same as groupCategory?
  showPromptTags: boolean;
  unique: boolean; // identical words grouped as single response entry
  showReferenceCount: boolean;
}
export function IFillinSettingsInitializer(
  description: string = "",
  promptsLabel: string = "",
  responsesLabel: string = "",
  layout = FillinLayoutType.grid
): IFillinSettings {
  return {
    description: description,
    responsesLabel: responsesLabel,
    promptsLabel: promptsLabel,
    layout: layout,
    showProgression: true,
    progressionOrder: FillinResponsesProgressionEnum.inorder,
    gridColumns: 6,
    showResponseTags: false,
    showPromptTags: false,
    groupByTags: false,
    showResponsesInPrompts: false,
    responsesLayout: FillinPositionType.above,
    showAlternatives: false,
    unique: false, // identical words grouped as single response entry
    showReferenceCount: false
  };
}
export const SettingsContext = React.createContext(
  null as ISettingsContext | null
);
