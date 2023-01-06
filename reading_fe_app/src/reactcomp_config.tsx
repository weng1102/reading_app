/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_speech.tsx
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
import { useState } from "react";
import {
  IConfigSettings
  // ISpeechSettings,
  // ISettingsContext,
  // RecitationMode,
  // SettingsContext
} from "./settingsContext";
interface IConfigSettingsProps {
  configSettings: IConfigSettings;
  setConfigSettings: (configSetting: IConfigSettings) => void;
  active: boolean;
}
export const ConfigSettings = (props: IConfigSettingsProps) => {
  const [, _setDistDir] = useState(props.configSettings.distDir);
  const setDistDir = (distDir: string) => {
    _setDistDir(distDir);
    props.setConfigSettings({
      ...props.configSettings,
      distDir: distDir
    });
  };
  const onDistDirChangeValue = (event: any) => {
    setDistDir(event.target.value);
  };
  const [, _setHomePage] = useState(props.configSettings.homePage);
  const setHomePage = (homePage: string) => {
    _setHomePage(homePage);
    props.setConfigSettings({
      ...props.configSettings,
      homePage: homePage
    });
  };
  const onHomePageChangeValue = (event: any) => {
    setHomePage(event.target.value);
  };
  const [, _setShowSitemap] = useState(props.configSettings.showSitemap);
  const setShowSitemap = (showSitemap: boolean) => {
    _setShowSitemap(showSitemap);
    props.setConfigSettings({
      ...props.configSettings,
      showSitemap: showSitemap
    });
  };
  const onShowSitemapChangeValue = (event: any) => {
    console.log(`showsitemap=${event.target.checked}`);
    setShowSitemap(event.target.checked);
  };

  let isLocked: boolean = true;
  if (props.active) {
    return (
      <>
        <div className="settings-grid-section-header">Personal</div>
        <div className="settings-grid-col2-label-control">
          <div className="settings-grid-col2-label">Homepage:</div>
          <input
            type="text"
            className="textbox-control"
            defaultValue={props.configSettings.homePage}
            readOnly={isLocked}
            onChange={onHomePageChangeValue}
          />
        </div>
        <div className="settings-grid-section-footer">Name of homepage</div>

        <div className="settings-grid-col2-label-control">
          <div className="settings-grid-col2-label">Curriculum subpath:</div>
          <input
            type="text"
            className="textbox-control"
            defaultValue={props.configSettings.distDir}
            readOnly={isLocked}
            onChange={onDistDirChangeValue}
          />
        </div>
        <div className="settings-grid-section-footer">
          Location of curriculum content
        </div>

        <div className="checkbox-container stopAtEOS-checkbox-container">
          <input
            onChange={onShowSitemapChangeValue}
            className="checkbox-control"
            type="checkbox"
            checked={props.configSettings.showSitemap}
          />
          <label>Show sitemap icon</label>
        </div>

        <div className="settings-grid-section-footer">
          Displays sitemap icon on page header
        </div>
      </>
    );
  } else {
    return <></>;
  }
};
