/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_speech.tsx
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
import { useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";
import { CPageLists } from "./pageContext";
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
  speak(message: string, setSpeakingCurrently?: (toggle: boolean) => void) {
    if (setSpeakingCurrently !== undefined) {
      this.paramObj.onend = () => setSpeakingCurrently(false);
    }
    if (this.voiceList.length === 0) {
      this.voiceList = window.speechSynthesis.getVoices();
    }
    this.paramObj.text = message;
    this.paramObj.voice = this.voiceList[this.selectedVoiceIndex];
    if (setSpeakingCurrently !== undefined) setSpeakingCurrently(true);
    window.speechSynthesis.speak(this.paramObj);
  }
}
export const Synthesizer: CSpeechSynthesizer = new CSpeechSynthesizer();

export const SpeechMonitor = () => {
  // internal state triggered by corresponding cursor transition state changes
  // but detached so their state can be announced and acknowledged without
  // altering the cursor transition state that may be used elsewhere
  const [announce_newSentence, setAnnounce_newSentence] = useState(false);
  const [announce_beginningOfPage, setAnnounce_beginningOfPage] = useState(
    false
  );
  const [announce_newSection, setAnnounce_newSection] = useState(false);
  const resetAnnounce_transitions = () => {
    setAnnounce_beginningOfPage(false);
    setAnnounce_newSection(false);
    setAnnounce_newSentence(false);
  };
  let settingsContext: ISettingsContext = useContext(SettingsContext)!;
  Synthesizer.volume = settingsContext.settings.speech.volume;
  let pageContext: CPageLists = useAppSelector(store => store.pageContext);
  // cannot use useContext(PageContext) because context is only scoped within
  // a page
  // const test: boolean = useAppSelector(store => store.test);

  let message: string = "";
  useEffect(() => {
    Synthesizer.voiceList = window.speechSynthesis.getVoices(); // loaded asynchronously
    Synthesizer.paramObj.voice = Synthesizer.voiceList[2]; // US woman
  }, []);

  // const pageLoaded: boolean = useAppSelector(store => store.page_loaded);

  const beginningOfPage = useAppSelector(
    store => store.cursor_beginningOfPageReached
  );
  const newSection = useAppSelector(store => store.cursor_newSectionTransition);
  const newSentence = useAppSelector(
    store => store.cursor_newSentenceTransition
  );
  const sectionIdx = useAppSelector(store => store.cursor_sectionIdx);

  useEffect(() => {
    setAnnounce_beginningOfPage(beginningOfPage);
    setAnnounce_newSection(newSection);
    setAnnounce_newSentence(newSentence);
  }, [beginningOfPage, newSection, newSentence]);

  useEffect(() => {
    let message: string = "";
    if (announce_beginningOfPage) {
      message = "beginning of page";
      Synthesizer.speak(message);
    } else if (announce_newSection) {
      let sectionType: string = pageContext.sectionList[sectionIdx].type;
      message = `new ${sectionType === "undefined" ? "section" : sectionType}`;
      Synthesizer.speak(message);
    } else if (announce_newSentence) {
      message = "new sentence";
      Synthesizer.speak(message);
    }
    resetAnnounce_transitions();
  }, [
    announce_beginningOfPage,
    announce_newSection,
    announce_newSentence,
    pageContext.sectionList,
    sectionIdx
  ]);

  const endOfPage = useAppSelector(store => store.cursor_endOfPageReached);
  useEffect(() => {
    if (endOfPage) {
      Synthesizer.speak("end of page");
    }
  }, [endOfPage]);

  const announcement = useAppSelector(store => store.announce_message);
  useEffect(
    () => {
      if (announcement !== "") {
        Synthesizer.speak(announcement);
      } else {
        console.log(`NOT speaking ${message}"`);
      }
    },
    [announcement, message] // to recite just the words
  );
  const listening = useAppSelector(store => store.listen_active);
  useEffect(() => {
    if (listening) {
      Synthesizer.speak("listening");
    } else {
      Synthesizer.speak("not listening");
    }
  }, [listening]);
  if (message.length > 0) message = `SPEECH: ${message}`;
  return <div>{message}</div>;
};
// Speech Settings
interface ISpeechSettingsProps {
  speechSettings: ISpeechSettings;
  setSpeechSettings: (speechSetting: ISpeechSettings) => void;
  active: boolean;
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
  if (props.active) {
    return (
      <>
        <RecitationModeRadioButton
          recitationMode={recitationMode}
          setRecitationMode={setRecitationMode}
        />
        <VoiceSelector voiceIndex={voiceIndex} setVoiceIndex={setVoiceIndex} />
        <VolumeSlider volume={volume} setVolume={setVolume} />
      </>
    );
  } else {
    return <></>;
  }
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
          <input
            type="radio"
            value={RecitationMode.wordNext}
            name="recitationMode"
            defaultChecked={props.recitationMode === RecitationMode.wordNext}
          />
          {RecitationMode.wordNext}
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
  const [, setVoicesAvailable] = useState(false);
  useEffect(() => {
    setVoicesAvailable(true); // force rerender of component
  }, []);
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
