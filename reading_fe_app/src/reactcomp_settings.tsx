/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
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
// import { ModelingSettings } from "./react";
import { ISectionFillinItem } from "./pageContentType";
import {
  IConfigSettings,
  IListenSettings,
  ISpeechSettings,
  IModelingSettings,
  IFillinSettings,
  // ModelingObscuredTextActivation
  // ModelingObscuredActivationOptions,
  // MaxObscuredTextActivation,
  // MaxObscuredText,
  ObscuredTextDegreeEnum,
  ObscuredTextTimingEnum,
  ModelingContinuationEnum
  // // ModelingOpacity,
  // ModelingObscuredTextActivationOptions,
  // ModelingObscuredTextOptions,
  // ModelingContinuationOptions
} from "./settingsContext";
import { SectionFillinContext } from "./fillinContext";
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
  const [modelingSettings, _setModelingSettings] = useState(
    settingsContext.settings.modeling
  );
  const [fillinSettings, _setFillinSettings] = useState(
    settingsContext.settings.fillin
  );
  //  const [initial, setInitial] = useState(true);
  const [modified, setModified] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const setConfigSettings = (configSettings: IConfigSettings) => {
    _setConfigSettings(configSettings);
    setModified(true);
  };
  const setSpeechSettings = (speechSettings: ISpeechSettings) => {
    _setSpeechSettings(speechSettings);
    setModified(true);
  };
  const setListenSettings = (listenSettings: IListenSettings) => {
    _setListenSettings(listenSettings);
    setModified(true);
  };
  const setModelingSettings = (modelingSettings: IModelingSettings) => {
    _setModelingSettings(modelingSettings);
    setModified(true);
  };
  const setFillinSettings = (fillinSettings: IFillinSettings) => {
    _setFillinSettings(fillinSettings);
    setModified(true);
  };
  const clickOK = () => {
    if (modified) {
      props.hide();
      settingsContext.saveSettings({
        config: configSettings,
        speech: speechSettings,
        listen: listenSettings,
        modeling: modelingSettings,
        fillin: fillinSettings
      });
      setModified(false);
      dispatch(Request.Page_restore()); // could be in useDialog
    }
  };
  const clickCancel = () => {
    console.log(
      `SettingDialog: speechSettings.recitationScope=${speechSettings.scope}`
    );
    setModified(false);
    props.hide();
  };
  let OkIcons = modified ? OkIcon : OkIcon_ghosted;
  let dispatch = useAppDispatch();
  if (!props.isActive) {
    return null;
  } else {
    dispatch(Request.Recognition_stop());
    return (
      <>
        <div className="settings-overlay" />
        <div className="settings-container">
          <div className="settings sliding1">
            <div className="settings-header">
              <div className="header-title">Settings</div>
              <div className="header-grid-OK" onClick={clickOK}>
                <img className="icon" alt="OK" src={OkIcons} />
              </div>
              <div className="header-grid-cancel" onClick={clickCancel}>
                <img className="icon" alt="cancel" src={CancelIcon} />
              </div>
            </div>
            <TabControlButtons
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabControlMarkers activeTab={activeTab} />
            <div className="settings-grid-container">
              <SpeechSettings
                speechSettings={speechSettings}
                setSpeechSettings={setSpeechSettings}
                active={activeTab === 0}
              />
              <ListenSettings
                listenSettings={listenSettings}
                setListenSettings={setListenSettings}
                active={activeTab === 1}
              />
              <ModelingSettings
                modelingSettings={modelingSettings}
                setModelingSettings={setModelingSettings}
                active={activeTab === 2}
              />
              <FillinSettings
                fillinSettings={fillinSettings}
                setFillinSettings={setFillinSettings}
                active={activeTab === 3}
              />
              <ConfigSettings
                configSettings={configSettings}
                setConfigSettings={setConfigSettings}
                active={activeTab === 4}
              />
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
          className="settings-tabControl-tab0"
          onClick={() => props.setActiveTab(0)}
        >
          Reciting
        </div>
        <div
          className="settings-tabControl-tab1"
          onClick={() => props.setActiveTab(1)}
        >
          Listening
        </div>
        <div
          className="settings-tabControl-tab2"
          onClick={() => props.setActiveTab(2)}
        >
          Modeling
        </div>
        <div
          className="settings-tabControl-tab3"
          onClick={() => props.setActiveTab(3)}
        >
          Fill-ins
        </div>
        <div
          className="settings-tabControl-tab4"
          onClick={() => props.setActiveTab(4)}
        >
          Configuring
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
  if (props.activeTab >= 0 && props.activeTab < tabMarkers.length)
    tabMarkers[props.activeTab] = "active";
  return (
    <>
      <div className="settings-tabControl-markers-grid">
        <div className={`settings-tabControl-marker0 ${tabMarkers[0]}`}></div>
        <div className={`settings-tabControl-marker1 ${tabMarkers[1]}`}></div>
        <div className={`settings-tabControl-marker2 ${tabMarkers[2]}`}></div>
        <div className={`settings-tabControl-marker3 ${tabMarkers[3]}`}></div>
        <div className={`settings-tabControl-marker4 ${tabMarkers[4]}`}></div>
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
export interface IModelingSettingsProps {
  modelingSettings: IModelingSettings;
  setModelingSettings: (modelingSetting: IModelingSettings) => void;
  active: boolean;
}
export const ModelingSettings = (props: IModelingSettingsProps) => {
  const [directions, _setDirections] = useState(
    props.modelingSettings.directions
  );
  const setDirections = (directions: string) => {
    _setDirections(directions);
    props.setModelingSettings({
      ...props.modelingSettings,
      directions: directions
    });
  };
  const [obscuredTextDegree, _setObscuredTextDegree] = useState(
    props.modelingSettings.obscuredTextDegree
  );
  const setObscuredTextDegree = (index: number) => {
    if (
      index >= ObscuredTextDegreeEnum.min &&
      index <= ObscuredTextDegreeEnum.max
    ) {
      _setObscuredTextDegree(index);
      props.setModelingSettings({
        ...props.modelingSettings,
        obscuredTextDegree: index
      });
    }
  };
  const [obscuredTextTiming, _setObscuredTextTiming] = useState(
    props.modelingSettings.obscuredTextTiming
  );
  const setObscuredTextTiming = (index: number) => {
    if (
      index >= ObscuredTextTimingEnum.min &&
      index <= ObscuredTextTimingEnum.max
    ) {
      _setObscuredTextTiming(index);
      props.setModelingSettings({
        ...props.modelingSettings,
        obscuredTextTiming: index
      });
    }
  };
  const [continuationAction, _setContinuationAction] = useState(
    props.modelingSettings.continuationAction
  );
  const setContinuationAction = (index: number) => {
    if (
      continuationAction >= ModelingContinuationEnum.min &&
      continuationAction <= ModelingContinuationEnum.max
    ) {
      _setContinuationAction(index);
      props.setModelingSettings({
        ...props.modelingSettings,
        continuationAction: index
      });
    }
  };
  if (props.active) {
    // <ObscuredTextDegree/> and <ObscuredTextTiming/> should be combinded
    // into  <ObscuredText/>
    return (
      <>
        <Directions directions={directions} setDirections={setDirections} />
        <div className="settings-grid-section-header">Model text obscuring</div>
        <ObscuredTextDegree
          obscuredText={obscuredTextDegree}
          setObscuredTextDegree={setObscuredTextDegree}
        />
        <ObscuredTextTiming
          obscuredTextTiming={obscuredTextTiming}
          setObscuredTextTiming={setObscuredTextTiming}
        />
        <div className="settings-grid-section-footer">
          The <u>degree</u> of model text obscuring defines how much the model
          text is obscured. The <u>timing</u> of model text obscuring defines
          when the model text is first obscured within the modeling flow:
          activation (clicking the button), prompt (reciting the model),
          recognition (listening for model).
        </div>
        <ContinuationAction
          continuationAction={continuationAction}
          setContinuationAction={setContinuationAction}
        />
      </>
    );
  } else {
    return <></>;
  }
};
interface DirectionsProps {
  directions: string;
  setDirections: (text: string) => void;
}
const Directions = (props: DirectionsProps) => {
  const onChangeValue = (event: any) => {
    let text: string = event.target.value;
    props.setDirections(text);
  };
  return (
    <>
      <div className="settings-grid-section-header">Directions</div>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Text:</div>
        <input
          type="text"
          value={props.directions}
          onChange={onChangeValue}
          placeholder="Enter text here"
        />
      </div>
      <div className="settings-grid-section-footer">
        The text defines the directions to be recited when the model is
        initially activated. If this is blank, then no directions are recited.
      </div>
    </>
  );
};
interface ObscuredTextDegreeProps {
  obscuredText: number;
  setObscuredTextDegree: (obscuredText: ObscuredTextDegreeEnum) => void;
}
const ObscuredTextDegree = (props: ObscuredTextDegreeProps) => {
  // const stepRange: number = 1 / (ObscuredTextDegreeEnum.max - ObscuredTextDegreeEnum.min);
  // const stepInterval: number = 1 / (stepRange - 1);
  const onChangeValue = (event: any) => {
    let index: number = +event.target.value;
    if (
      index >= ObscuredTextDegreeEnum.min &&
      index <= ObscuredTextDegreeEnum.max
    ) {
      props.setObscuredTextDegree(index);
    } else {
      props.setObscuredTextDegree(ObscuredTextDegreeEnum.default);
    }
  };
  let sentenceClasses: string = `sentence setting-obscured-text-example sentence-obscured-${props.obscuredText}`;
  return (
    <>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Degree:</div>
        <div className={sentenceClasses}>The quick brown fox</div>
        <div className="settings-grid-col2-control">
          <div className="slider-container opacity-slider-container">
            <div className="slider-container-label-control"></div>
            <div className="slider-container-control">
              <input
                onChange={onChangeValue}
                className="slider-control"
                // defaultValue={}
                type="range"
                min={ObscuredTextDegreeEnum.min}
                max={ObscuredTextDegreeEnum.max}
                step={1}
                list="steplist"
                defaultValue={props.obscuredText}
              />
              <div className="slider-container-label">
                <datalist className="ticklist" id="steplist">
                  <span>none</span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span>max</span>
                </datalist>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
interface ObscuredTextTimingProps {
  obscuredTextTiming: ObscuredTextTimingEnum;
  setObscuredTextTiming: (obscuredTextTiming: ObscuredTextTimingEnum) => void;
}
const ObscuredTextTiming = (props: ObscuredTextTimingProps) => {
  const enumRange: number =
    ObscuredTextTimingEnum.max - ObscuredTextTimingEnum.min;
  const onChangeValue = (event: any) => {
    let index: number = +event.target.value;
    if (
      index >= ObscuredTextTimingEnum.min &&
      index <= ObscuredTextTimingEnum.max
    ) {
      props.setObscuredTextTiming(index);
    } else {
      props.setObscuredTextTiming(ObscuredTextTimingEnum.default);
    }
  };
  return (
    <>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Timing:</div>
        <div className="settings-grid-col2-control">
          <div className="settings-radiobutton">
            The model text is obscured:
          </div>
          <label className="settings-radiobutton">
            <input
              type="radio"
              value={ObscuredTextTimingEnum.always}
              name="Obscured Activation"
              onChange={onChangeValue}
              defaultChecked={
                props.obscuredTextTiming === ObscuredTextTimingEnum.always
              }
            />
            before activation (always)
          </label>
          <label className="settings-radiobutton">
            <input
              type="radio"
              value={ObscuredTextTimingEnum.afterActivation}
              name="Obscured Activation"
              onChange={onChangeValue}
              defaultChecked={
                props.obscuredTextTiming ===
                ObscuredTextTimingEnum.afterActivation
              }
            />
            after activation but before prompting
          </label>
          <label className="settings-radiobutton">
            <input
              type="radio"
              value={ObscuredTextTimingEnum.afterPrompting}
              name="Obscured Activation"
              onChange={onChangeValue}
              defaultChecked={
                props.obscuredTextTiming ===
                ObscuredTextTimingEnum.afterPrompting
              }
            />
            after prompting but before recognition
          </label>
          <label className="settings-radiobutton">
            <input
              type="radio"
              value={ObscuredTextTimingEnum.afterRecognition}
              name="Obscured Activation"
              onChange={onChangeValue}
              defaultChecked={
                props.obscuredTextTiming ===
                ObscuredTextTimingEnum.afterRecognition
              }
            />
            after recognition
          </label>
          <label className="settings-radiobutton">
            <input
              type="radio"
              value={ObscuredTextTimingEnum.never}
              name="Obscured Activation"
              onChange={onChangeValue}
              defaultChecked={
                props.obscuredTextTiming === ObscuredTextTimingEnum.never
              }
            />
            never
          </label>
        </div>
      </div>
    </>
  );
};
interface ContinuationActionProps {
  continuationAction: ModelingContinuationEnum;
  setContinuationAction: (continuationOption: ModelingContinuationEnum) => void;
}
const ContinuationAction = (props: ContinuationActionProps) => {
  const onChangeValue = (event: any) => {
    let index: number = +event.target.value;
    if (
      index >= ModelingContinuationEnum.min &&
      index <= ModelingContinuationEnum.max
    ) {
      props.setContinuationAction(index);
      console.log(`ContinuationAction index=${index}`);
    } else {
      console.log(`ContinuationAction is out of range index=${index}`);
      // props.setContinuationAction(ModelingContinuationEnum.nextWordAndStop);
    }
  };
  return (
    <>
      <div className="settings-grid-section-header">Continuation behavior</div>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label"></div>
        <div className="settings-grid-col2-control">
          <div className="settings-radiobutton">
            Upon successful completion of model, the cursor goes to the:
          </div>
          <label className="settings-radiobutton">
            <input
              type="radio"
              value={ModelingContinuationEnum.nextWordAndStop}
              name="Continuation Action"
              onChange={onChangeValue}
              defaultChecked={
                props.continuationAction ===
                ModelingContinuationEnum.nextWordAndStop
              }
            />
            next word and modeling terminates
          </label>
          <label className="settings-radiobutton">
            <input
              type="radio"
              value={ModelingContinuationEnum.nextModelAndStop}
              name="Continuation Action"
              onChange={onChangeValue}
              defaultChecked={
                props.continuationAction ===
                ModelingContinuationEnum.nextModelAndStop
              }
            />
            next model but modeling terminates
          </label>
          <label className="settings-radiobutton">
            <input
              type="radio"
              value={ModelingContinuationEnum.nextModelAndContinue}
              name="Continuation Action"
              onChange={onChangeValue}
              defaultChecked={
                props.continuationAction ===
                ModelingContinuationEnum.nextModelAndContinue
              }
            />
            next model and modeling continues
          </label>
        </div>
      </div>
      <div className="settings-grid-section-footer">
        Continuation behavior defines the behavior after the successful
        completion of the current model.
      </div>
    </>
  );
};
export interface IFillinSettingsProps {
  fillinSettings: IFillinSettings;
  setFillinSettings: (fillinSetting: IFillinSettings) => void;
  active: boolean;
}
export const FillinSettings = (props: IFillinSettingsProps) => {
  if (props.active) {
    return (
      <>
        <div className="settings-grid-section-header">section header</div>
        <div className="settings-grid-section-item">item</div>
      </>
    );
  } else {
    return <></>;
  }
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
