/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_main.tsx
 *
 * Defines React front end functional components.
 *
 * Terminals represent the group of words, punctuations, whitespace,
 * references, etc that can be rendered.
 * "Words" refer to terminals that where the current cursor can be active;
 * that terminals that are visible and recitable as opposed to punctuations,
 * whitespace and other syntactical sugar.
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
import { Request } from "./reducers";
import { useAppDispatch } from "./hooks";
import { useState } from "react";
import { Page } from "./reactcomps_page";
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
  let dispatch = useAppDispatch();
  dispatch(
    Request.Recognition_setAvailability(
      SpeechRecognition.browserSupportsSpeechRecognition()
    )
  );
  //  dispatch(Request.Page_load("links1"));
  dispatch(Request.Page_load("mystroke"));
  //dispatch(Request.Page_load("trailingblanks"));
  return (
    <>
      <SettingsContext.Provider value={settingsContext}>
        <Page appName="Reading App" />
      </SettingsContext.Provider>
    </>
  );
};
