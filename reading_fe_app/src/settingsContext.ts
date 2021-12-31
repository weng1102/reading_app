/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: settingContext.ts
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
import { useState } from "react";
// import { ISpeechSettings } from "./reactcomp_speech";
// import //  CListenSettings,
//  IListenSettings,
//ListenSettingsInitializer
// "./reactcomp_listen";

export enum RecitationMode {
  wordOnly = "word only",
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
export interface IConfigSettings {
  distDir: string;
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
  distDir: string;
  firstName: string;
  lastName: string;
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
export function ConfigSettingsInitializer(
  distDir: string = "https://weng1102.github.io/reading_app/dist/",
  firstName: string = "Ronlyn",
  lastName: string = "Goo"
): IConfigSettings {
  return {
    distDir,
    firstName,
    lastName
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
  timeout: number; // time out upon silence
  listeningInterval: number; // msec between listening and matching
  notificationMode: NotificationMode;
  sentenceNotification: string;
  sectionNotification: string;
}
export function ListenSettingsInitializer(
  stopAtEndOfSentence: boolean = true,
  timeout: number = 20, // time out upon silence
  listeningInterval: number = 20, // msec between listening and matching
  notificationMode: NotificationMode = NotificationMode.voice,
  sentenceNotification: string = "new sentence",
  sectionNotification: string = "new section"
): IListenSettings {
  return {
    stopAtEndOfSentence,
    timeout,
    listeningInterval,
    notificationMode,
    sentenceNotification,
    sectionNotification
  };
}
export const SettingsContext = React.createContext(
  <ISettingsContext | null>null
);

//export ISpeechSettings = SpeechSettingsInitializer();
//export var ListenSettings: IListenSettings = ListenSettingsInitializer();
// export class CSpeechSettings {
//   constructor(speech?: CSpeechSettings) {
//     if (speech === undefined) {
//       this.recitationMode = RecitationMode.wordOnly;
//       this.lang = "English";
//       this.locale = "en-US";
//       this.gender = "female";
//       this.pitch = 0;
//       this.rate = 0;
//       this.volume = 0.5;
//       this.selectedVoiceIndex = 0;
//     } else {
//       this.recitationMode = speech.recitationMode;
//       this.lang = speech.lang;
//       this.locale = speech.locale;
//       this.gender = speech.gender;
//       this.pitch = speech.pitch;
//       this.rate = speech.rate;
//       this.volume = speech.volume;
//       this.selectedVoiceIndex = speech.selectedVoiceIndex;
//     }
//   }
//   modified: boolean = false;
//   recitationMode: RecitationMode;
//   lang: string;
//   locale: string;
//   gender: string;
//   pitch: number;
//   rate: number;
//   voice: SpeechSynthesisVoice = {
//     default: false,
//     lang: "",
//     localService: false,
//     name: "",
//     voiceURI: ""
//   };
//   volume: number;
//   selectedVoiceIndex: number;
//   //  voices:
//   getVoices() {
//    SpeechSynthesis.getVoices();
//SpeechSynthesisVoice
// }
//   setRecitationMode1(recitationMode: RecitationMode) {
//     console.log(`recitationMode=${recitationMode}`);
//     this.recitationMode = recitationMode;
//     this.modified = true;
//   }
//   setLang(lang: string) {
//     this.lang = lang;
//     this.modified = true;
//   }
//   setPitch(pitch: number) {
//     this.pitch = pitch;
//     this.modified = true;
//   }
//   setRate(rate: number) {
//     this.rate = rate;
//     this.modified = true;
//   }
//   setVoice(voice: SpeechSynthesisVoice) {
//     this.voice = voice;
//     this.modified = true;
//   }
//
//   setVolume(volume: number) {
//     this.volume = volume;
//     this.modified = true;
//   }
//   setSelectedVoiceIndex(index: number) {
//     this.selectedVoiceIndex = index;
//     this.modified = true;
//   }
// }
// export class CListenSettings {
//   constructor(listen?: CListenSettings) {
//     if (listen === undefined) {
//       this.stopAtEndOfSentence = true;
//       this.timeout = 20; // time out upon silence
//       this.listeningInterval = 20; // msec between listening and matching
//       this.notificationMode = NotificationMode.voice;
//       this.sentenceNotification = "new sentence";
//       this.sectionNotification = "new section";
//     } else {
//       this.stopAtEndOfSentence = listen.stopAtEndOfSentence;
//       this.timeout = listen.timeout; // time out upon silence
//       this.listeningInterval = listen.listeningInterval; // msec between listening and matching
//       this.notificationMode = listen.notificationMode;
//       this.sentenceNotification = listen.sentenceNotification;
//       this.sectionNotification = listen.sectionNotification;
//     }
//   }
//   stopAtEndOfSentence: boolean = true;
//   modified: boolean = false;
//   timeout: number; // time out upon silence
//   listeningInterval: number; // msec between listening and matching
//   notificationMode: NotificationMode;
//   sentenceNotification: string;
//   sectionNotification: string;
// setTimeout(timeout: number) {
//   this.timeout = timeout;
//   this.modified = true;
// }
// setListeningInterval(interval: number) {
//   this.listeningInterval = interval;
//   this.modified = true;
// } // msec between listening and matching
// setNotificationMode(notificationMode: NotificationMode) {
//   this.notificationMode = notificationMode;
//   this.modified = true;
// }
// setSentenceNotification(sentenceNotification: string) {
//   this.sentenceNotification = sentenceNotification;
//   this.modified = true;
// }
// setSectionNotification(sectionNotification: string) {
//   this.sectionNotification = sectionNotification;
//   this.modified = true;
// }
// }
// export interface IListenSettings {
//   stopAtEndOfSentence: boolean;
//   timeout: number; // time out upon silence
//   listeningInterval: number; // msec between listening and matching
//   notificationMode: NotificationMode;
//   sentenceNotification: string;
//   sectionNotification: string;
// }
//
// export function ListenSettingsInitializer(
//   timeout: number = 20, // time out upon silence
//   listeningInterval: number = 20, // msec between listening and matching
//   notificationType: NotificationType = NotificationType.voice,
//   sentenceNotification: string = "new sentence",
//   sectionNotification: string = "new section"
// ): IListenSettings {
//   return {
//     timeout, // time out upon silence
//     listeningInterval, // msec between listening and matching
//     notificationType,
//     sentenceNotification,
//     sectionNotification
//   };
// }
// export class CSettingsContext {
//   speech: CSpeechSettings;
//   listen: CListenSettings;
//   constructor(speech?: CSpeechSettings, listen?: CListenSettings) {
//     this.speech = new CSpeechSettings(speech);
//     this.listen = new CListenSettings(listen);
//   }
//   save(newSettings: CSettingsContext) {
//     this.speech = newSettings.speech;
//     this.listen = newSettings.listen;
//   }
//   get modified() {
//     return this.speech.modified || this.listen.modified;
//   }
// setListenSettings(listenSettings: IListenSettings) {
//   this.listen = listenSettings;
// }
// setSpeechSettings(speechSettings: ISpeechSettings) {
//   this.speech = speechSettings;
// }
