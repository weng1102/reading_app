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
import fontUpIcon from "./img/button_fontadj_up1.png";
import fontDownIcon from "./img/button_fontadj_down1.png";
import fontDownGhostedIcon from "./img/button_fontadj_down1_ghosted.png";
import spacingUpIcon from "./img/button_spacingadj_wider.png";
import spacingDownIcon from "./img/button_spacingadj_narrower.png";
import spacingDownGhostedIcon from "./img/button_spacingadj_narrower_ghosted.png";
import settingsIcon from "./img/settingicon.png";
import homePageIcon from "./img/button_homeicon.png";
import homePageGhostedIcon from "./img/button_home_ghosted.png";
import siteMapIcon from "./img/button_sitemap1.png";
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
      <div className="header-grid-hamburger">
        <HamburgerButton />
      </div>
      <div className="headertitle">{props.title}</div>
      <div className="header-grid-sitemapbutton">
        <SiteMapButton />
      </div>
      <div className="header-grid-prevbutton">
        <PreviousPageButton />
      </div>
      <div className="header-grid-homebutton">
        <HomeButton />
      </div>
      <div className="header-grid-spacingbutton">
        <SpacingAdjustButton />
      </div>
      <div className="header-grid-fontbutton">
        <FontAdjustButton />
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
  const showSitemap: boolean = useContext(SettingsContext)!.settings.config
    .showSitemap;
  // retrieve setting context to check if showSitemap is enabled otherwise
  if (showSitemap) {
    return (
      <img
        className="icon"
        alt="sitemap"
        src={siteMapIcon}
        title="go to sitemap"
        onClick={() => dispatch(Request.Page_load("sitemap"))}
      />
    );
  } else {
    return <></>;
  }
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
const SpacingAdjustButton = () => {
  return (
    <>
      <div className="header-grid-spacingbutton">
        <div className="header-grid-spacingupbutton">
          <SpacingAdjustUpButton />
        </div>
        <div className="header-grid-spacingdownbutton">
          <SpacingAdjustDownButton />
        </div>
      </div>
    </>
  );
};
const SpacingAdjustUpButton = () => {
  const dispatch = useAppDispatch();
  const spacingDownEnabled: boolean = useAppSelector(
    store => store.page_spacingDown_enabled
  );
  const onButtonClick = () => {
    dispatch(
      Request.Page_spacingDownEnabled(changeSpacingSize(spacingQuantum))
    );
  };
  return (
    <img
      className="icon"
      alt="spacing adjust up"
      title="adjust spacing up"
      src={spacingUpIcon}
      onClick={onButtonClick}
    />
  );
};
const SpacingAdjustDownButton = () => {
  const dispatch = useAppDispatch();
  const spacingDownEnabled: boolean = useAppSelector(
    store => store.page_spacingDown_enabled
  );
  const onButtonClick = () => {
    dispatch(
      Request.Page_spacingDownEnabled(changeSpacingSize(-spacingQuantum))
    );
    //    if (previousPageEnabled) dispatch(Request.Page_pop());
  };
  let spacingIcon: string = spacingDownIcon;
  if (spacingDownEnabled) {
    spacingIcon = spacingDownIcon;
  } else {
    spacingIcon = spacingDownGhostedIcon;
  }
  return (
    <img
      className="icon"
      alt="spacing adjust down"
      title="adjust spacing down"
      src={spacingIcon}
      onClick={onButtonClick}
    />
  );
};
const FontAdjustButton = () => {
  return (
    <>
      <div className="header-grid-fontbutton">
        <div className="header-grid-fontupbutton">
          <FontAdjustUpButton />
        </div>
        <div className="header-grid-fontdownbutton">
          <FontAdjustDownButton />
        </div>
      </div>
    </>
  );
};
const changeFontSize = (quantum: number): boolean => {
  let adjusted: boolean = false;
  const main = document.querySelector("main");
  let style = getComputedStyle(main!);
  if (main !== null && style !== null) {
    // increment and round to next whole number pixel
    let fontSize: number = parseFloat(style.fontSize.split("px")[0]);
    if (fontSize + quantum >= 10) {
      main.style.fontSize = `${fontSize + quantum}px`;
      adjusted = true;
    } else {
    }
    // assumes px unit
  }
  return adjusted;
};
let spacingQuantum: number = 0.2; //px
const changeSpacingSize = (quantum: number): boolean => {
  let adjusted: boolean = false;
  const main = document.querySelector("main");
  let style = getComputedStyle(main!);
  if (main !== null && style !== null) {
    // spacing should be relative to font size
    let spacingSize: number = parseFloat(style.lineHeight); // returns px
    let fontSize: number = parseFloat(style.fontSize);
    console.log(`line-height=${spacingSize}`);
    if (spacingSize / fontSize + quantum >= 1.5) {
      // should store initial line-height defined in css main.line-height
      // defined as 150%
      console.log(`new line-height=${spacingSize / fontSize + quantum}`);
      main.style.lineHeight = `${spacingSize / fontSize + quantum}em`;
      adjusted = true;
    } else {
      adjusted = false;
    }
    // assumes px unit
  }
  return adjusted;
};
const fontQuantum: number = 2;
const FontAdjustUpButton = () => {
  const dispatch = useAppDispatch();
  const onButtonClick = () => {
    dispatch(Request.Page_fontDownEnabled(changeFontSize(fontQuantum)));
  };
  return (
    <img
      className="icon"
      alt="font adjust up"
      title="adjust font up"
      src={fontUpIcon}
      onClick={onButtonClick}
    />
  );
};
const FontAdjustDownButton = () => {
  const dispatch = useAppDispatch();
  const fontDownEnabled: boolean = useAppSelector(
    store => store.page_fontDown_enabled
  );
  let fontIcon: string = fontDownIcon;
  if (fontDownEnabled) {
    fontIcon = fontDownIcon;
  } else {
    fontIcon = fontDownGhostedIcon;
  }
  const onButtonClick = () => {
    if (fontDownEnabled)
      dispatch(Request.Page_fontDownEnabled(changeFontSize(-fontQuantum)));
  };
  return (
    <img
      className="icon"
      alt="font adjust down"
      title="adjust font down"
      src={fontIcon}
      onClick={onButtonClick}
    />
  );
};
