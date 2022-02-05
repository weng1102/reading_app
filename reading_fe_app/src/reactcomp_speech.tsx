/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
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
//import "./App.css";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";
import { CPageLists, PageContext } from "./pageContext";
import {
  ISpeechSettings,
  ISettingsContext,
  RecitationMode,
  SettingsContext
} from "./settingsContext";
class CSpeechSynthesizer {
  constructor() {
    this.paramObj = new SpeechSynthesisUtterance();
  }
  paramObj: SpeechSynthesisUtterance;
  voiceList: SpeechSynthesisVoice[] = [];
  selectedVoiceIndex: number = 2;
  get voices(): SpeechSynthesisVoice[] {
    return this.voiceList;
  }
  setVoice(voice: string, selectedIndex: number) {
    console.log(`voice=${voice}`);
    //    this.paramObj.voice = this.voiceList[voice];
  }
  set volume(vol: number) {
    this.paramObj.volume = vol;
  }
  speak(message: string, setSpeakingNow?: (toggle: boolean) => void) {
    if (setSpeakingNow !== undefined) {
      this.paramObj.onend = () => setSpeakingNow(false);
    }
    if (this.voiceList.length === 0) {
      this.voiceList = window.speechSynthesis.getVoices();
    }
    this.paramObj.text = message;
    this.paramObj.voice = this.voiceList[this.selectedVoiceIndex];
    if (setSpeakingNow !== undefined) setSpeakingNow(true);
    window.speechSynthesis.speak(this.paramObj);
  }
}
export const Synthesizer: CSpeechSynthesizer = new CSpeechSynthesizer();

export const SpeechMonitor = () => {
  const dispatch = useAppDispatch();
  let pageContext: CPageLists = useAppSelector(store => store.pageContext);
  // cannot use useContext(PageContext) because context is only scoped within
  // a page
  const newSentence = useAppSelector(
    store => store.cursor_newSentenceTransition
  );
  const newSection = useAppSelector(store => store.cursor_newSectionTransition);
  const sectionIdx = useAppSelector(store => store.cursor_sectionIdx);
  const beginningOfPage = useAppSelector(
    store => store.cursor_beginningOfPageReached
  );
  const endOfPage = useAppSelector(store => store.cursor_endOfPageReached);
  const listening = useAppSelector(store => store.listen_active);
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  let message: string = "";
  useEffect(() => {
    Synthesizer.voiceList = window.speechSynthesis.getVoices(); // loaded asynchronously
    Synthesizer.paramObj.voice = Synthesizer.voiceList[2]; // US woman
  }, [window.speechSynthesis.onvoiceschanged]);
  useEffect(
    () => {
      Synthesizer.volume = settingsContext.settings.speech.volume;
      if (beginningOfPage) {
        message = `beginning of page`;
        Synthesizer.speak(message);
        dispatch(Request.Cursor_acknowledgeTransition());
      } else if (newSection) {
        console.log(`speaking sectionIdx=${sectionIdx}`);
        let sectionType: string = pageContext.sectionList[sectionIdx].type;
        message = `new ${
          sectionType === "undefined" ? "section" : sectionType
        }`;
        console.log(`speaking "${message}"`);
        Synthesizer.speak(message);
        dispatch(Request.Cursor_acknowledgeTransition());
      } else if (newSentence) {
        message = "new sentence";
        console.log(`speaking "${message}"`);
        Synthesizer.speak(message);
        dispatch(Request.Cursor_acknowledgeTransition());
      } else if (endOfPage) {
        message = `end of page`;
        Synthesizer.speak(message);
        dispatch(Request.Cursor_acknowledgeTransition());
      } else {
        console.log(`NOT speaking ${message}"`);
      }
    },
    [sectionIdx, newSentence, beginningOfPage, endOfPage] // to recite just the words
  );
  useEffect(
    () => {
      if (listening) {
        message = "listening";
      } else {
        message = "not listening";
      }
      console.log(`speaking "${message}"`);
      Synthesizer.speak(message);
    },
    [listening] // to recite just the words
  );
  return <div>{message}</div>;
};
interface ISpeechSettingsProps {
  speechSettings: ISpeechSettings;
  setSpeechSettings: (speechSetting: ISpeechSettings) => void;
}
export const SpeechSettings = (props: ISpeechSettingsProps) => {
  const [recitationMode, _setRecitationMode] = useState(
    props.speechSettings.recitationMode
  );
  const setRecitationMode = (recitationMode: RecitationMode) => {
    _setRecitationMode(recitationMode);
    props.setSpeechSettings({
      ...props.speechSettings,
      recitationMode: recitationMode
    });
  };
  const [voiceIndex, _setVoiceIndex] = useState(
    props.speechSettings.selectedVoiceIndex
  );
  const setVoiceIndex = (voiceIndex: number) => {
    _setVoiceIndex(voiceIndex);
    props.setSpeechSettings({
      ...props.speechSettings,
      selectedVoiceIndex: voiceIndex
    });
  };
  const [volume, _setVolume] = useState(props.speechSettings.volume);
  const setVolume = (volume: number) => {
    _setVolume(volume);
    props.setSpeechSettings({
      ...props.speechSettings,
      volume: volume
    });
  };
  return (
    <>
      <div className="settings-section-header">Speech</div>
      <RecitationModeRadioButton
        recitationMode={recitationMode}
        setRecitationMode={setRecitationMode}
      />
      <VoiceSelector voiceIndex={voiceIndex} setVoiceIndex={setVoiceIndex} />
      <VolumeSlider volume={volume} setVolume={setVolume} />
    </>
  );
};
interface IRecitationModeRadioButtonProps {
  recitationMode: RecitationMode;
  setRecitationMode: (recitationMode: RecitationMode) => void;
}
export const RecitationModeRadioButton = (
  props: IRecitationModeRadioButtonProps
) => {
  const onChangeValue = (event: any) => {
    console.log(`recitationMode onchange=${event.target.value}`);
    props.setRecitationMode(event.target.value);
  };
  return (
    <>
      <div className="settings-grid-section-header">Recitation mode</div>
      <div
        className="recitation-radioButton settings-grid-section-item-recitation"
        onChange={onChangeValue}
      >
        <div className="settings-grid-section-item-recitation-control-group">
          <input
            type="radio"
            value={RecitationMode.wordOnly}
            name="recitationMode"
            defaultChecked={props.recitationMode === RecitationMode.wordOnly}
          />
          {RecitationMode.wordOnly}
        </div>
        <div className="settings-grid-section-item-recitation-control-group">
          <input
            type="radio"
            id="2"
            value={RecitationMode.entireSentence}
            name="recitationMode"
            defaultChecked={
              props.recitationMode === RecitationMode.entireSentence
            }
          />
          {RecitationMode.entireSentence}
          <input
            type="radio"
            value={RecitationMode.uptoExclusive}
            name="recitationMode"
            defaultChecked={
              props.recitationMode === RecitationMode.uptoExclusive
            }
          />
          {RecitationMode.uptoExclusive}
          <input
            type="radio"
            value={RecitationMode.uptoInclusive}
            name="recitationMode"
            defaultChecked={
              props.recitationMode === RecitationMode.uptoInclusive
            }
          />
          {RecitationMode.uptoInclusive}
        </div>
        <div className="settings-grid-section-item-recitation-control-group">
          <input
            type="radio"
            value={RecitationMode.section}
            name="recitationMode"
            defaultChecked={props.recitationMode === RecitationMode.section}
          />
          {RecitationMode.section}
        </div>
      </div>
      <div className="settings-grid-section-footer">
        Recitation mode determines how prose are recited when speak button is
        activated. The "partial" (sentence) options determine whether the
        current word is included or excluded in the recitation of the current
        sentence.
      </div>
    </>
  );
};
interface IVoiceSelectorProps {
  voiceIndex: number;
  setVoiceIndex: (voice: number) => void;
}
const VoiceSelector = (props: IVoiceSelectorProps) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [voicesAvailable, setVoicesAvailable] = useState(false);
  useEffect(() => {
    setVoicesAvailable(true); // force rerender of component
  }, [window.speechSynthesis.onvoiceschanged]);
  //  let voices: SpeechSynthesisVoice[] = Synthesizer.voices;
  const onChangeValue = (event: any) => {
    console.log(`onchange=${event.target.value}`);
    Synthesizer.setVoice(event.target.value, event.target.selectedIndex);
    props.setVoiceIndex(event.target.selectedIndex);
  };
  return (
    <>
      <div className="settings-grid-section-header">Voice Selection</div>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Voice:</div>
        <select
          className="ddlb-voiceselect settings-grid-col2-control"
          defaultValue={props.voiceIndex}
          onChange={onChangeValue}
        >
          {window.speechSynthesis
            .getVoices()
            .map((voice: SpeechSynthesisVoice, key: any) => (
              <option id={key} key={voice.voiceURI}>
                {voice.name}
              </option>
            ))}
        </select>
      </div>
    </>
  );
};
interface IVolumeSliderProps {
  volume: number;
  setVolume: (volume: number) => void;
}
export const VolumeSlider = (props: IVolumeSliderProps) => {
  const onChangeValue = (event: any) => {
    console.log(`onchange=${event.target.value}`);
    props.setVolume(+event.target.value);
  };
  return (
    <>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Volume:</div>
        <div className="settings-grid-col2-control">
          <div className="slider-container volume-slider-container">
            <div className="slider-container-label-control"></div>
            <div className="slider-container-control">
              <input
                onChange={onChangeValue}
                className="slider-control"
                defaultValue={props.volume}
                type="range"
                min="0"
                max="1"
                step="0.1"
              />
            </div>
            <div className="slider-container-label">
              <div className="ticklist" id="steplist">
                <span>min</span>
                <span>0.1</span>
                <span>0.2</span>
                <span>0.3</span>
                <span>0.4</span>
                <span>0.5</span>
                <span>0.6</span>
                <span>0.7</span>
                <span>0.8</span>
                <span>0.9</span>
                <span>max</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export const RateSlider = () => {
  return (
    <>
      <div className="settings-subheader">Rate</div>
      rate slider
    </>
  );
};
export const PitchSlider = () => {
  return (
    <>
      <div className="settings-subheader">Rate</div>
      pitch slider
    </>
  );
};
