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
import readitImg from "./readit.png";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";
import { IPageContext, PageContext } from "./termnodes";

// this entire Synthezier object is a kludge until the settings object can be
// implemented that reflects a <ronlyn>_configig.json permanent store. see
// reactcomps_settings.tsx for further info.
class SpeechSynthesizing {
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
const Synthesizer: SpeechSynthesizing = new SpeechSynthesizing();

export const SpeechSynthesizer = () => {
  const dispatch = useAppDispatch();
  let pageContext: IPageContext = useContext(PageContext)!;
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
interface VoiceSelectPropsType {
  synthesizer: SpeechSynthesizing;
}
export const VoiceSelect = () => {
  const [selectedOption, setSelectdOption] = useState("");
  const [voicesAvailable, setVoicesAvailable] = useState(false);
  useEffect(() => {
    setVoicesAvailable(true); // force rerender of component
  }, [window.speechSynthesis.onvoiceschanged]);
  //  let voices: SpeechSynthesisVoice[] = Synthesizer.voices;
  return (
    <select
      className="ddlb-voiceselect"
      value={selectedOption}
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
  );
};
export const ReadItButton = () => {
  const pageContext: IPageContext = useContext(PageContext)!;
  const termIdx = useAppSelector(store => store.cursor_terminalIdx);
  let message =
    pageContext.terminalList[termIdx].altpronunciation !== ""
      ? pageContext.terminalList[termIdx].altpronunciation
      : pageContext.terminalList[termIdx].content;
  let wordOnly = true;
  let entireSentence = false;
  let uptoWord = false;
  if (wordOnly) {
  }
  return (
    <button className="readme" onClick={() => speak(message)}>
      <img className="readButtonImg" src={readitImg} alt="read it" />
    </button>
  );
};
