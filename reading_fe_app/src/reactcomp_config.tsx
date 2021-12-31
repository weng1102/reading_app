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
  IConfigSettings,
  ISpeechSettings,
  ISettingsContext,
  RecitationMode,
  SettingsContext
} from "./settingsContext";
interface IConfigSettingsProps {
  configSettings: IConfigSettings;
  setConfigSettings: (configSetting: IConfigSettings) => void;
}
export const ConfigSettings = (props: IConfigSettingsProps) => {
  const [distDir, _setDistDir] = useState(props.configSettings.distDir);
  const setDistDir = (distDir: string) => {
    _setDistDir(distDir);
    props.setConfigSettings({
      ...props.configSettings,
      distDir: distDir
    });
  };
  const onChangeValue = (event: any) => {
    setDistDir(event.target.value);
  };
  let isLocked: boolean = true;
  return (
    <>
      <div className="settings-section-header">Personalization</div>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Curriculum subpath:</div>
        <input
          type="text"
          className="textbox-control"
          defaultValue={props.configSettings.distDir}
          readOnly={isLocked}
          onChange={onChangeValue}
        />
      </div>
      <div className="settings-grid-section-footer">
        Location of curriculum content
      </div>
      <div>User Info tbd</div>
    </>
  );
};
