/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_settings.tsx
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
import { useContext, useState } from "react";
import { useAppDispatch } from "./hooks";
import { Request } from "./reducers";
import settingsIcon from "./img/settingicon.png";
import OkIcon from "./img/button_OK.png";
import OkIcon_ghosted from "./img/button_OK_ghosted.png";
import CancelIcon from "./img/button_cancel.png";
import { ConfigSettings } from "./reactcomp_config";
import { SpeechSettings } from "./reactcomp_speech";
import { ListenSettings } from "./reactcomp_listen";
import {
  IConfigSettings,
  IListenSettings,
  ISpeechSettings
} from "./settingsContext";
import { ISettingsContext, SettingsContext } from "./settingsContext";
interface ISettingsDialogPropsType {
  isActive: boolean;
  hide: () => void;
}
export const SettingsDialog = (props: ISettingsDialogPropsType) => {
  let settingsContext: ISettingsContext = useContext(
    SettingsContext
  ) as ISettingsContext;

  const [configSettings, _setConfigSettings] = useState(
    settingsContext.settings.config
  );
  const [speechSettings, _setSpeechSettings] = useState(
    settingsContext.settings.speech
  );
  const [listenSettings, _setListenSettings] = useState(
    settingsContext.settings.listen
  );
  //  const [initial, setInitial] = useState(true);
  const [modified, setModified] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
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
  const setConfigSettings = (configSettings: IConfigSettings) => {
    _setConfigSettings(configSettings);
    // if (!initial) setModified(true); // skip initial value initializations
    // setInitial(false);
    setModified(true);
  };
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
        config: configSettings,
        speech: speechSettings,
        listen: listenSettings
      });
      setModified(false);
      dispatch(Request.Page_restore()); // could be in useDialog
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
    //    dispatch(Request.Test_set());
  };
  let OkIcons = modified ? OkIcon : OkIcon_ghosted;
  let dispatch = useAppDispatch();
  // could do deep compare between temp and current contexts
  if (!props.isActive) {
    return null;
  } else {
    dispatch(Request.Recognition_stop());
    return (
      <>
        <div className="settings-overlay" />
        <div className="settings-container">
          <div className="settings sliding1">
            <div className="settings-header">Settings</div>
            <TabControlButtons
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabControlMarkers activeTab={activeTab} />
            <div className="settings-grid-container">
              <SpeechSettings
                speechSettings={speechSettings}
                setSpeechSettings={setSpeechSettings}
                active={activeTab === 1}
              />
              <ListenSettings
                listenSettings={listenSettings}
                setListenSettings={setListenSettings}
                active={activeTab === 2}
              />
              <ConfigSettings
                configSettings={configSettings}
                setConfigSettings={setConfigSettings}
                active={activeTab === 3}
              />
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
interface ITabControlButtonsProps {
  activeTab: number;
  setActiveTab: (clickTab: number) => void;
}
export const TabControlButtons = (props: ITabControlButtonsProps) => {
  return (
    <>
      <div className="settings-tabControl-grid">
        <div
          className="settings-tabControl-tab1"
          onClick={() => props.setActiveTab(1)}
        >
          Speaking
        </div>
        <div
          className="settings-tabControl-tab2"
          onClick={() => props.setActiveTab(2)}
        >
          Listening
        </div>
        <div
          className="settings-tabControl-tab3"
          onClick={() => props.setActiveTab(3)}
        >
          Identifying
        </div>
      </div>
    </>
  );
};
interface TabControlMarkersProps {
  activeTab: number;
}
export const TabControlMarkers = (props: TabControlMarkersProps) => {
  const markersInactive: string[] = ["", "", "", "", ""];
  let tabMarkers: string[] = markersInactive;
  tabMarkers = markersInactive;
  if (props.activeTab > 0 && props.activeTab < tabMarkers.length)
    tabMarkers[props.activeTab] = "active";
  return (
    <>
      <div className="settings-tabControl-markers-grid">
        <div className={`settings-tabControl-marker1 ${tabMarkers[1]}`}></div>
        <div className={`settings-tabControl-marker2 ${tabMarkers[2]}`}></div>
        <div className={`settings-tabControl-marker3 ${tabMarkers[3]}`}></div>
      </div>
    </>
  );
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
