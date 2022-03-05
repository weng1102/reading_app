/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_header.tsx
 *
 * Defines React front end functional components.
 *
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
import hamburgerIcon from "./Hamburger_icon.png";
import settingsIcon from "./settingicon.png";
import homePageIcon from "./button_homeicon.png";
import siteMapIcon from "./button_sitemap.png";
import { SettingsDialog, SettingsButton } from "./reactcomp_settings";

// import mic_listening from "./mic1-xparent.gif";
// import mic_notlistening from "./mic1-inactive-xparent.gif";
// import mic_unavailable from "./mic1-ghosted.gif";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector, useDialog } from "./hooks";
import { useEffect, useState, useContext } from "react";

// is this really necessary if availablility is removed below
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import {
  IPageContent,
  IHeadingListItem,
  ISectionContent,
  ISentenceContent,
  ITerminalContent,
  ITerminalInfo,
  IAcronymTerminalMeta,
  IWordTerminalMeta,
  TerminalMetaEnumType,
  SectionVariantEnumType,
  ISectionParagraphVariant
} from "./pageContentType";

import { ISettingsContext, SettingsContext } from "./settingsContext";

interface IPageHeaderPropsType {
  title: string;
}
export const PageHeader = React.memo((props: IPageHeaderPropsType) => {
  const dispatch = useAppDispatch();
  const { isActive, toggle } = useDialog();
  const homePage = useContext(SettingsContext)!.settings.config.homePage;
  console.log(`<PageHeader>`);
  return (
    <header className="header-grid-container">
      <div className="header-grid-left">
        <img className="icon" alt="hamburger" src={hamburgerIcon} />
      </div>
      <div className="headertitle">{props.title}</div>
      <div className="header-grid-homebutton">
        <img
          className="icon"
          alt="homePage"
          src={homePageIcon}
          onClick={() => dispatch(Request.Page_load(`homepage_${homePage}`))}
        />
      </div>
      <div className="header-grid-sitemapbutton">
        <img
          className="icon"
          alt="sitemap"
          src={siteMapIcon}
          onClick={() => dispatch(Request.Page_load("sitemap"))}
        />
      </div>
      <div className="header-grid-settingbutton">
        <img
          className="icon"
          alt="settings"
          src={settingsIcon}
          onClick={() => toggle()}
        />
        <SettingsDialog isActive={isActive} hide={toggle} />
      </div>
    </header>
  );
});
