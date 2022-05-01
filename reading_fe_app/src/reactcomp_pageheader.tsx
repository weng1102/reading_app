/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_header.tsx
 *
 * Defines React front end functional components.
 *
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
import hamburgerIcon from "./img/Hamburger_icon.png";
import settingsIcon from "./img/settingicon.png";
import homePageIcon from "./img/button_homeicon.png";
import homePageGhostedIcon from "./img/button_home_ghosted.png";
import siteMapIcon from "./img/button_sitemap.png";
import previousPageIcon from "./img/button_back.png";
import previousPageGhostedIcon from "./img/button_back_ghosted.png";
import { SettingsDialog } from "./reactcomp_settings";

import { Request } from "./reducers";
import { useAppDispatch, useDialog, useAppSelector } from "./hooks";
import { useContext } from "react";

import { SettingsContext } from "./settingsContext";

interface IPageHeaderPropsType {
  title: string;
}
export const PageHeader = React.memo((props: IPageHeaderPropsType) => {
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
  let icon: string;
  const homePageEnabled: boolean = useAppSelector(
    store => store.page_home_enabled
  );
  if (homePageEnabled) {
    icon = homePageIcon;
  } else {
    icon = homePageGhostedIcon;
  }
  const onButtonClick = () => {
    if (homePageEnabled) dispatch(Request.Page_home());
  };
  return (
    <img
      className="icon"
      alt="homePage"
      src={icon}
      title="go home"
      onClick={onButtonClick}
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
  let icon: string;
  const previousPageEnabled: boolean = useAppSelector(
    store => store.page_previous_enabled
  );
  if (previousPageEnabled) {
    icon = previousPageIcon;
  } else {
    icon = previousPageGhostedIcon;
  }
  const onButtonClick = () => {
    if (previousPageEnabled) dispatch(Request.Page_pop());
  };
  return (
    <img
      className="icon"
      alt="previous page"
      src={icon}
      title="go to previous page"
      onClick={onButtonClick}
    />
  );
};
