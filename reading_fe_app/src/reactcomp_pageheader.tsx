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
import PrevPageIcon from "./button_back.png";
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
  const { isActive, toggleDialog } = useDialog();
  console.log(`<PageHeader>`);
  return (
    <header className="header-grid-container">
      <div className="header-grid-left">
        <HamburgerButton />
      </div>
      <div className="headertitle">{props.title}</div>
      <div className="header-grid-prevbutton">
        <PreviousPageButton />
      </div>
      <div className="header-grid-homebutton">
        <HomeButton />
      </div>
      <div className="header-grid-sitemapbutton">
        <SiteMapButton />
      </div>
      <div className="header-grid-settingbutton">
        <img
          className="icon"
          alt="settings"
          src={settingsIcon}
          title="go to settings"
          onClick={() => toggleDialog()}
        />
        <SettingsDialog isActive={isActive} hide={toggleDialog} />
      </div>
    </header>
  );
});
const HamburgerButton = () => {
  return (
    <img
      className="icon"
      alt="hamburger"
      src={hamburgerIcon}
      title="hamburger under construction"
    />
  );
};
const HomeButton = () => {
  const dispatch = useAppDispatch();
  const homePage = useContext(SettingsContext)!.settings.config.homePage;
  return (
    <img
      className="icon"
      alt="homePage"
      src={homePageIcon}
      title="go home"
      onClick={() => dispatch(Request.Page_load(`homepage_${homePage}`))}
    />
  );
};
const SiteMapButton = () => {
  const dispatch = useAppDispatch();
  return (
    <img
      className="icon"
      alt="sitemap"
      src={siteMapIcon}
      title="go to sitemap"
      onClick={() => dispatch(Request.Page_load("sitemap"))}
    />
  );
};
const PreviousPageButton = () => {
  const dispatch = useAppDispatch();
  // need to add conditional  logic to manage empty stack
  return (
    <img
      className="icon"
      alt="previous page"
      src={PrevPageIcon}
      title="go home"
      onClick={() => dispatch(Request.Page_pop())}
    />
  );
};
