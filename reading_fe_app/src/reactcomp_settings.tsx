/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_settings.tsx
 *
 * Defines React front end functional components popup settings modal
 * page
 * - recitation mode: word only, up to word, entire sentence
 * - Speech synthesis settings: voice, rate, pitch, volume
 * - dictionaries: acronyms, pronunciation, recognition
 * - listening: timeouts, notifications (voice vs. sound effect)
 * - content: themes, fonts, css files, <pre> etc.
 * - performance: push interval
 *
 * use configContext object accessed via useContext similar to PageContext
 * to manage content and serialization
 *
 * treat this modal page as a form with ok and cancel buttons.
 *
 * Version history:
 *
 **/
import { useContext, useEffect, useState } from "react";
import { useAppDispatch } from "./hooks";
import { Request } from "./reducers";
import settingsIcon from "./settingicon.png";
import OkIcon from "./button_OK.png";
import OkIcon_ghosted from "./button_OK_ghosted.png";
import CancelIcon from "./button_cancel.png";
//import CancelIcon_ghosted from "./button_cancel_ghosted.png";
import { SpeechSettings } from "./reactcomp_speech";
import { ListenSettings } from "./reactcomp_listen";
import { IListenSettings, ISpeechSettings } from "./settingsContext";
import {
  ISettings,
  ISettingsContext,
  SettingsContext
} from "./settingsContext";
interface ISettingsDialogPropsType {
  isActive: boolean;
  hide: () => void;
}
export const SettingsDialog = (props: ISettingsDialogPropsType) => {
  let settingsContext: ISettingsContext = useContext(
    SettingsContext
  ) as ISettingsContext;

  const [speechSettings, _setSpeechSettings] = useState(
    settingsContext.settings.speech
  );
  const [listenSettings, _setListenSettings] = useState(
    settingsContext.settings.listen
  );
  //  const [initial, setInitial] = useState(true);
  const [modified, setModified] = useState(false);
  // clone setting context as potential new settings that can be
  // modified and committed to active/actual SettingContext
  // const [newSettings, setNewSettings] = useState(
  //   SettingsCloner(settingsContext)
  // );
  // useEffect(() => {
  //   if (modified) {
  //     console.log(`Settings changed`);
  //   }
  // }, [speechSettings, listenSettings]);
  const setSpeechSettings = (speechSettings: ISpeechSettings) => {
    _setSpeechSettings(speechSettings);
    // if (!initial) setModified(true); // skip initial value initializations
    // setInitial(false);
    setModified(true);
  };
  const setListenSettings = (listenSettings: IListenSettings) => {
    _setListenSettings(listenSettings);
    // if (!initial) setModified(true);
    // setInitial(false);
    setModified(true);
  };
  const clickOK = () => {
    if (modified) {
      props.hide();
      // let settings: ISettings = {
      //   speech: speechSettings,
      //   listen: listenSettings
      // };
      //      settingsContext.saveSettings(settings);
      settingsContext.saveSettings({
        speech: speechSettings,
        listen: listenSettings
      });
      setModified(false);
    }
    //    setInitial(true);
  };
  const clickCancel = () => {
    //    setInitial(true);
    console.log(
      `SettingDialog: speechSettings.recitationMode=${speechSettings.recitationMode}`
    );
    setModified(false);
    // setNewSettings(SettingsCloner(settingsContext));
    props.hide();
  };
  let OkIcons = modified ? OkIcon : OkIcon_ghosted;
  // could do deep compare between temp and current contexts
  if (!props.isActive) {
    return null;
  } else {
    return (
      <>
        <div className="settings-overlay" />
        <div className="settings-container">
          <div className="settings sliding1">
            <div className="settings-header">Settings</div>
            <div className="settings-grid-container">
              <SpeechSettings
                speechSettings={speechSettings}
                setSpeechSettings={setSpeechSettings}
              />
              <ListenSettings
                listenSettings={listenSettings}
                setListenSettings={setListenSettings}
              />
              <PersonalInfoSettings />
            </div>
            <div className="settings-footer">
              <div className="controlBar-container">
                <div className="footer-grid-OK" onClick={clickOK}>
                  <img className="icon" alt="OK" src={OkIcons} />
                </div>
                <div className="footer-grid-cancel" onClick={clickCancel}>
                  <img className="icon" alt="cancel" src={CancelIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};
export const PersonalInfoSettings = () => {
  return (
    <>
      personal info goes here
      <div className="settings-grid-section-item">First Name</div>
      <div className="settings-grid-section-item">Last Name</div>
    </>
  );
};
export const SettingsButton = () => {
  const dispatch = useAppDispatch();
  return (
    <>
      <img
        className="icon"
        alt="settings"
        src={settingsIcon}
        onClick={() => dispatch(Request.Settings_toggle())}
      />
    </>
  );
};
