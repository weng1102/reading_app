/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
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
// export enum RecitationScopeEnumType {
//   words = "word",
//   sentence = "sentence",
//   section = "section",
//   label = "label",
//   embedded = "embedded"
// }
// export enum RecitationPositionEnumType {
//   unchanged = "unchanged", // (default) cursor unchanged
//   end = "atEnd", // after prose in scope
//   beginning = "atBeginning" // before prose in scope
// }
// export enum RecitationListeningEnumType {
//   startListening = "startListening",
//   notListening = "notListening"
// }
export enum NotificationMode {
  sound = "sound",
  voice = "voice"
}
export interface ISettings {
  config: IConfigSettings;
  speech: ISpeechSettings;
  listen: IListenSettings;
  // fillin: ISectionFillinSettings;
}
export interface ISettingsContext {
  settings: ISettings;
  saveSettings: (setting: ISettings) => void;
}
export const SettingsInitializer = (
  config: IConfigSettings = ConfigSettingsInitializer(),
  speech: ISpeechSettings = SpeechSettingsInitializer(),
  listen: IListenSettings = ListenSettingsInitializer()
  // fillin: ISectionFillinSettings = ISectionFillinSettingsInitializer()
): ISettings => {
  // console.log(`retrieve voice and index`);
  return {
    config,
    speech,
    listen
    // fillin
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

//distDir: string = "https://weng1102.github.io/reading_app/dist/",
//
export function ConfigSettingsInitializer(
  homePage: string = "ronlyn",
  distDir: string = "https://weng1102.github.io/reading-companion/",
  firstName: string = "Ronlyn",
  lastName: string = "Goo",
  showSitemap: boolean = false,
  navbarWidth: number = 300,
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
export function SpeechSettingsInitializer(
  scope: RecitationScopeEnumType = RecitationScopeEnumType.sentence,
  placement: RecitationPlacementEnumType = RecitationPlacementEnumType.unchanged,
  listening: RecitationListeningEnumType = RecitationListeningEnumType.notListening,
  lang: string = "English",
  locale: string = "en-US",
  gender: string = "female",
  pitch: number = 0,
  rate: number = 1,
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
export const SettingsContext = React.createContext(
  null as ISettingsContext | null
);
