/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
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
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useState } from "react";
import { Page } from "./reactcomp_page";
import SpeechRecognition from "react-speech-recognition";
import {
  SettingsContext,
  ISettingsContext,
  SettingsInitializer
} from "./settingsContext";
export const ReadingApp = () => {
  const [_settings, _setSettings] = useState(SettingsInitializer());
  const settingsContext: ISettingsContext = {
    settings: _settings,
    saveSettings: _setSettings
  };
  // const restorePageRequested = useAppSelector(
  //   store => store.page_restore_requested
  // );
  let dispatch = useAppDispatch();
  dispatch(
    Request.Recognition_setAvailability(
      SpeechRecognition.browserSupportsSpeechRecognition()
    )
  );
  if (_settings.config.homePage.length === 0) {
    dispatch(Request.Page_load("sitemap"));
  } else {
    // } else if (!restorePageRequested) {
    dispatch(Request.Page_home());
  }
  return (
    <>
      <SettingsContext.Provider value={settingsContext}>
        <Page appName="Reading App" />
      </SettingsContext.Provider>
    </>
  );
};
