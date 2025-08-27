/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_main.tsx
 *
 * App Wrapper for setting context
 *
 * Version history:
 *
 **/
// import React from "react";
import "./App.css";
// import React from "react"
import React from "react";
// import { useContext } from "react";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useState, useEffect } from "react";
import { Page } from "./reactcomp_page";
import SpeechRecognition from "react-speech-recognition";
import { LinkIdxDestinationType } from "./pageContentType";
import {
  SettingsContext,
  ISettingsContext,
  SettingsInitializer,
  // INotificationSettings
} from "./settingsContext";
// import BellShort from "./audio/bell_short.mp3";
// import BuzzerShort from "./audio/buzzer_short.mp3";
// import { AppAudioContext,getAppAudioContext } from "./audioContext";
// import { loadSoundFileIntoAudioBuffer1 } from "./rtutilities";
export const ReadingApp = React.memo(() => {
  const [_settings, _setSettings] = useState(SettingsInitializer());
  const settingsContext: ISettingsContext = {
    settings: _settings,
    saveSettings: _setSettings
  };
  // const appAudioContext = getAppAudioContext(); //cannot access context yet
  // const [positiveAudioBuffer,setPositiveAudioBuffer] = useState(null as AudioBuffer | null);
  // const [negativeAudioBuffer,setNegativeAudioBuffer] = useState(null as AudioBuffer | null);
  let dispatch = useAppDispatch();
  dispatch(
    Request.Recognition_setAvailability(
      SpeechRecognition.browserSupportsSpeechRecognition()
    )
  );
  const queryParameters: any = new URLSearchParams(window.location.search);
  const pageName: string = queryParameters.get("page");

  //   const loadSoundFileIntoAudioBufferLocal = async (audioContext: AudioContext, src: string): 
  //   Promise<AudioBuffer> => {
  //   try {
  //     // const context = new AudioContext();
  //     // const source: AudioBufferSourceNode = context.createBufferSource();
  //     const response = await fetch(src)
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch sound file: ${response.status}`);
  //     } 
  //     const arrayBuffer = await response.arrayBuffer();
  //     // const audioContext = new AudioContext();
  //     const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  //     return audioBuffer;
  //     // source.buffer = audioBuffer;
  //     // source.connect(context.destination);
  //   } catch(error) {
  //     console.log(`@@@ Error loading sound file: ${src} - ${error}`);
  //     throw error;
  //   }
  // }
  // useEffect(() => {
  //   const xxx = require("./audio/bell_short.mp3");
  //   console.log(`@@@ bell short is ${xxx.data}`);
  // }, []);
  // useEffect(() => {
  //   if (!appAudioContext) return;
  //   // setAppAudioContext(getAppAudioContext())
  //   let positiveSoundFile: string = settingsContext.settings.notification.positiveSoundFile;
  //   positiveSoundFile = BellShort;
  //   console.log(`@@@ positiveSoundFile=${positiveSoundFile}`);
  //   let negativeSoundFile: string = settingsContext.settings.notification.negativeSoundFile
  //   negativeSoundFile = BuzzerShort;
  //   console.log(`@@@ negativeSoundFile=${negativeSoundFile}`);
  //   // preload sound files
  //   if (positiveSoundFile.length > 0) {
  //     console.log(`@@@ loading positive buffer`)
  //     //create and load audio buffer
  //     loadSoundFileIntoAudioBuffer1(appAudioContext!, positiveSoundFile)
  //     .then(buffer => {
  //       if (buffer) {
  //         setPositiveAudioBuffer(buffer);
  //         console.log(`@@@ loaded buffer buffer.length=${buffer.length}`) 
  //       // newSettingsContext.notification.positiveAudioBuffer = positiveAudioBuffer;
  //       } else {
  //         console.log(`@@@ could not loading positive buffer`)
  //       }
  //       // newSettingsContext.notification.positiveAudioBuffer = buffer
  //     })
  //     .catch(error => {
  //       console.log(`@@@ error loading sound file: ${positiveSoundFile} ${error.message}`)
  //     });
  //   }
  //   if (negativeSoundFile.length > 0) {
  //     console.log(`@@@ loading negative buffer`)
  //     loadSoundFileIntoAudioBuffer1(appAudioContext!, negativeSoundFile).then(buffer => {
  //       if (buffer) { 
  //         console.log(`@@@ loaded buffer buffer.length=${buffer.length}`);
  //         setNegativeAudioBuffer(buffer);
  //       // newSettingsContext.notification.negativeAudioBuffer = buffer
  //       } else {
  //         console.log(`@@@ could not loading negative buffer`)
  //       }
  //     })
  //     .catch(error => {
  //       console.log(`@@@ error loading sound file: ${negativeSoundFile} ${error.message}`);
  //     });
  //   } 
    // if (positiveAudioBuffer!) {
    //   console.log(`@@@ positiveAudioBuffer.length=${positiveAudioBuffer.length}`);
    // } else {
    //   console.log(`@@@ positiveAudioBuffer still null`);
    // }
    // if (negativeAudioBuffer!) {
    //   console.log(`@@@ negativeAudioBuffer.length=${negativeAudioBuffer.length}`);
    // } else {
    //   console.log(`@@@ negativeAudioBuffer still null`);
    // }
          // settingsContext.saveSettings({..._settings, notification: {...notification, positiveAudioBuffer: audioBuffer}}); 
  // }, [appAudioContext, settingsContext.settings.notification.negativeSoundFile, settingsContext.settings.notification.positiveSoundFile]);
  // useEffect(() => {
  //   console.log(`@@@ updating settings context with audio buffers`);
  //   let newSettingsContext = {..._settings }; 
  //   if (positiveAudioBuffer && positiveAudioBuffer.length > 0)
  //   console.log(`@@@ positive audio buffer loaded`);
  //   if (negativeAudioBuffer && negativeAudioBuffer.length > 0)
  //   console.log(`@@@ negative audio buffer loaded`);
  //   newSettingsContext.notification.positiveAudioBuffer = positiveAudioBuffer;
  //   newSettingsContext.notification.negativeAudioBuffer = negativeAudioBuffer;
  // //   _setSettings(newSettingsContext => ({...newSettingsContext, notification: {...newSettingsContext.notification, positiveAudioBuffer: positiveAudioBuffer, negativeAudioBuffer: negativeAudioBuffer}}));
  // },[positiveAudioBuffer, negativeAudioBuffer, _settings])

  if (_settings.config.homePage.length === 0) {
    dispatch(Request.Page_load("sitemap"));
  } else if (pageName) {
    const headingId: number = +queryParameters.get("headingid");
    // heading id is NOT implemented. Look at reducer for reason. The ids
    // to be stored in reducer are only valid initially.
    dispatch(
      Request.Page_load(pageName, LinkIdxDestinationType.heading, headingId)
    );
    /// reset url?
    // let href = new URL(window.location.href);
    // href.search = "";
    //    window.history.replaceState(null, "New Page Title", "/https://weng1102");
  } else {
    // } else if (!restoreRequested) {
    dispatch(Request.Page_home());
  }
  return (
    <>
      <SettingsContext.Provider value={settingsContext}>
        {/* <AppAudioContext.Provider value={appAudioContext}> */}
        <Page appName="Reading App" />
        {/* </AppAudioContext.Provider> */}
      </SettingsContext.Provider>
    </>
  );
});
