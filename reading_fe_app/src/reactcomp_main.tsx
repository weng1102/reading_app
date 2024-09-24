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
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useState, useEffect } from "react";
import { Page } from "./reactcomp_page";
import SpeechRecognition from "react-speech-recognition";
import { LinkIdxDestinationType } from "./pageContentType";
import {
  SettingsContext,
  ISettingsContext,
  SettingsInitializer
} from "./settingsContext";
export const ReadingApp = React.memo(() => {
  // useEffect(() => {
  const [_settings, _setSettings] = useState(SettingsInitializer());
  const settingsContext: ISettingsContext = {
    settings: _settings,
    saveSettings: _setSettings
  };
  // }, []);
  let dispatch = useAppDispatch();
  dispatch(
    Request.Recognition_setAvailability(
      SpeechRecognition.browserSupportsSpeechRecognition()
    )
  );
  const queryParameters: any = new URLSearchParams(window.location.search);
  const pageName: string = queryParameters.get("page");

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
        <Page appName="Reading App" />
      </SettingsContext.Provider>
    </>
  );
});
