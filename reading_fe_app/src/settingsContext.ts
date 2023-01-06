/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
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

export enum RecitationMode {
  wordOnly = "word only",
  wordNext = "word (then advance)",
  entireSentence = "entire sentence",
  uptoExclusive = "partial up to word (exclusive)",
  uptoInclusive = "partial up to word (inclusive)",
  section = "section, paragraph, etc."
}
export enum NotificationMode {
  sound = "sound",
  voice = "voice"
}
export interface ISettings {
  config: IConfigSettings;
  speech: ISpeechSettings;
  listen: IListenSettings;
}
export interface ISettingsContext {
  settings: ISettings;
  saveSettings: (setting: ISettings) => void;
}
export const SettingsInitializer = (
  config: IConfigSettings = ConfigSettingsInitializer(),
  speech: ISpeechSettings = SpeechSettingsInitializer(),
  listen: IListenSettings = ListenSettingsInitializer()
): ISettings => {
  return {
    config,
    speech,
    listen
  };
};
export interface IConfigSettings {
  homePage: string;
  distDir: string;
  firstName: string;
  lastName: string;
  showSitemap: boolean;
}
export interface ISpeechSettings {
  recitationMode: RecitationMode;
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
  showSitemap: boolean = false
): IConfigSettings {
  return {
    homePage,
    distDir,
    firstName,
    lastName,
    showSitemap
  };
}
export function SpeechSettingsInitializer(
  recitationMode: RecitationMode = RecitationMode.wordOnly,
  lang: string = "English",
  locale: string = "en-US",
  gender: string = "female",
  pitch: number = 0,
  rate: number = 0,
  volume: number = 0.5,
  selectedVoiceIndex: number = 0
): ISpeechSettings {
  return {
    recitationMode,
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
}
export function ListenSettingsInitializer(
  stopAtEndOfSentence: boolean = true,
  retries: number = 5,
  timeout: number = 20, // time out upon silence
  listeningInterval: number = 15, // msec between listening and matching
  notificationMode: NotificationMode = NotificationMode.voice,
  sentenceNotification: string = "new sentence",
  sectionNotification: string = "new section"
): IListenSettings {
  return {
    stopAtEndOfSentence,
    retries,
    timeout,
    listeningInterval,
    notificationMode,
    sentenceNotification,
    sectionNotification
  };
}
export const SettingsContext = React.createContext(
  null as ISettingsContext | null
);
