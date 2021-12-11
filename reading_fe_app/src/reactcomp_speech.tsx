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
//import "./App.css";
import { Request } from "./reducers";
//import readitImg from "./readit.png";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";
import { CPageContext, PageContext } from "./pageContext";
import speakIcon from "./button_speak.png";
import speakGhostedIcon from "./button_speak_ghosted.png";
import {
  ISpeechSettings,
  ISettingsContext,
  RecitationMode,
  SettingsContext
} from "./settingsContext";
// this entire Synthezier object is a kludge until the settings object can be
// implemented that reflects a <ronlyn>_configig.json permanent store. See
// reactcomps_settings.tsx for further info.
// export function SpeechSettingsInitializer(
//   recitationMode: RecitationMode = RecitationMode.wordOnly,
//   lang: string = "en-US",
//   pitch: number = 0,
//   rate: number = 0,
//   volume: number = 0.5,
//   selectedVoiceIndex: number = 0
// ): ISpeechSettings {
//   return {
//     recitationMode,
//     lang,
//     pitch,
//     rate,
//     volume,
//     selectedVoiceIndex
//   };
// }

// interface ISpeechSettingsProps {
//   speechSettings: CSpeechSettings;
// }
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
  speak(message: string) {
    if (this.voiceList.length === 0) {
      this.voiceList = window.speechSynthesis.getVoices();
    }
    this.paramObj.text = message;
    this.paramObj.voice = this.voiceList[this.selectedVoiceIndex];
    window.speechSynthesis.speak(this.paramObj);
  }
}
const Synthesizer: CSpeechSynthesizer = new CSpeechSynthesizer();

export const SpeechMonitor = () => {
  const dispatch = useAppDispatch();
  let pageContext: CPageContext = useContext(PageContext)!;
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
  let message: string = "";
  //  const message = useAppSelector(store => store.announce_message);
  // useEffect(
  //   () => {
  //     console.log(`speaking ${message}`);
  //     SpeechSynthesizer.text = message;
  //     window.speechSynthesis.speak(SpeechSynthesizer);
  //     dispatch(Request.Speech_acknowledged());
  //   },
  //   [message] // to recite just the words
  // );
  useEffect(() => {
    Synthesizer.voiceList = window.speechSynthesis.getVoices(); // loaded asynchronously
    Synthesizer.paramObj.voice = Synthesizer.voiceList[2]; // US woman
  }, [window.speechSynthesis.onvoiceschanged]);
  useEffect(
    () => {
      if (newSection) {
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
      } else if (beginningOfPage) {
        message = `beginning of page`;
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
export function speak(message: string) {
  Synthesizer.speak(message);
}
// interface VoiceSelectPropsType {
//   synthesizer: CSpeechSynthesizer;
// }
/*
export const VoiceSelect = (props: IVoiceSelectorProps) => {
  const [selectedOption, setSelectdOption] = useState("");
  const [voicesAvailable, setVoicesAvailable] = useState(false);
  useEffect(() => {
    setVoicesAvailable(true); // force rerender of component
  }, [window.speechSynthesis.onvoiceschanged]);
  //  let voices: SpeechSynthesisVoice[] = Synthesizer.voices;
  return (
    <>
      <div className="settings-grid-section-header">Voice Selection</div>
      <div className="settings-subheader">Voice</div>
      <select
        className="ddlb-voiceselect"
        defaultValue={props.voice.name}
        //      onChange={evt => setSelectdOption(evt.target.value)}
        onChange={evt =>
          Synthesizer.setVoice(evt.target.value, evt.target.selectedIndex)
        }
      >
        {window.speechSynthesis
          .getVoices()
          .map((voice: SpeechSynthesisVoice, key: any) => (
            <option id={key} key={voice.voiceURI}>
              {voice.name}
            </option>
          ))}
      </select>
    </>
  );
};
*/
export const SpeakButton = () => {
  let message: string = "";
  let icon: string =
    window.speechSynthesis === null ? speakGhostedIcon : speakIcon;
  const pageContext: CPageContext = useContext(PageContext)!;
  const wordToSay = (termIdx: number): string => {
    return pageContext.terminalList[termIdx].altpronunciation !== ""
      ? pageContext.terminalList[termIdx].altpronunciation
      : pageContext.terminalList[termIdx].content;
  };
  // const sentenceToSay = (
  //   firstTermIdx: number,
  //   lastTermIdx: number,
  //   lastPunctuation: string
  // ): string => {
  //   let str: string = "";
  //   for (let idx = firstTermIdx; idx <= lastTermIdx; idx++) {
  //     str = str + " " + wordToSay(idx);
  //   }
  //   //add punctuation for inflection
  //   str = str + lastPunctuation;
  //   return str;
  // };
  const sentenceToSay = (
    sentenceIdx: number,
    lastTermIdxInSentence?: number,
    lastPunctuation?: string
  ): string => {
    firstTermIdx = pageContext.sentenceList[sentenceIdx].firstTermIdx;
    if (lastTermIdxInSentence === undefined) {
      lastTermIdx = pageContext.sentenceList[sentenceIdx].lastTermIdx;
      lastPunctuation = pageContext.sentenceList[sentenceIdx].lastPunctuation;
    } else {
      lastTermIdx = lastTermIdxInSentence;
    }
    let str: string = "";
    for (let idx = firstTermIdx; idx <= lastTermIdx; idx++) {
      str = str + " " + wordToSay(idx);
    }
    //add punctuation for inflection
    str = str + (lastPunctuation === undefined ? "" : lastPunctuation);
    return str;
  };
  const sectionToSay = (sectionIdx: number): string => {
    //find sentences in section. unfortunately, the sectionlist only has first and last terminal idxs and not sentences
    let str: string = "";
    let firstTermIdx: number = pageContext.sectionList[sectionIdx].firstTermIdx;
    let lastTermIdx: number = pageContext.sectionList[sectionIdx].lastTermIdx;
    let firstSentenceIdx: number =
      pageContext.terminalList[firstTermIdx].sentenceIdx;
    let lastSentenceIdx: number =
      pageContext.terminalList[lastTermIdx].sentenceIdx;
    for (
      let sentenceIdx = firstSentenceIdx;
      sentenceIdx <= lastSentenceIdx;
      sentenceIdx++
    ) {
      str = str + sentenceToSay(sentenceIdx);
    }
    return str;
  };
  // should move all this message assembly code somewhere outside of react so
  // that code executed iff the button is activated and not when setting
  // state//changes: all code here should be activated by event handler.
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  const termIdx = useAppSelector(store => store.cursor_terminalIdx);
  const recitationMode: RecitationMode =
    settingsContext.settings.speech.recitationMode;
  let firstTermIdx, lastTermIdx: number;
  // given all the array accessing, should wrap in try/catch
  switch (recitationMode) {
    case RecitationMode.wordOnly:
      message = wordToSay(termIdx);
      break;
    case RecitationMode.entireSentence:
      message = sentenceToSay(pageContext.terminalList[termIdx].sentenceIdx);
      break;
    case RecitationMode.uptoExclusive:
      message = sentenceToSay(
        pageContext.terminalList[termIdx].sentenceIdx,
        termIdx - 1, // excluding current terminal
        "?" // not end of sentence
      );
      break;
    case RecitationMode.uptoInclusive:
      message = sentenceToSay(
        pageContext.terminalList[termIdx].sentenceIdx,
        termIdx, // including current terminal
        "?" // not end of sentence
      );
      break;
    case RecitationMode.section:
      message = sectionToSay(pageContext.terminalList[termIdx].sectionIdx);
      break;
    default:
  }
  console.log(`message=${message}`);
  return (
    <>
      <img
        className="icon"
        alt="speak"
        src={icon}
        onClick={() => Synthesizer.speak(message)}
      />
    </>
  );
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
/*
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
          <input
            onChange={onChangeValue}
            className="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.10"
            list="steplist"
          />
          <datalist id="steplist">
            <option value="0.0" label="min"></option>
            <option>0.10</option>
            <option>0.20</option>
            <option>0.30</option>
            <option>0.40</option>
            <option>0.50</option>
            <option>0.60</option>
            <option>0.70</option>
            <option>0.80</option>
            <option>0.90</option>
            <option value="1.0" label="min"></option>
            <option>1.00</option>
          </datalist>
        </div>
      </div>
    </>
  );
};
*/
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
