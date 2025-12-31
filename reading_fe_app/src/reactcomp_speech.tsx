/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
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
// import { CPageLists } from "./pageContext";
// import UserAgent from "user-agents";
import UAParser from "ua-parser-js";
// import { parse } from "useragent";
//import { parse } from "useragent";
import {
  RecitationScopeEnumType,
  RecitationPlacementEnumType,
  // RecitationReferenceEnumType,
  RecitationListeningEnumType,
  SentenceListItemEnumType
} from "./pageContentType";
import {
  ISpeechSettings,
  ISettingsContext,
  // RecitationMode,
  // RecitationListeningEnumType,
  // RecitationPositionEnumType,
  // RecitationScopeEnumType,
  SettingsContext
} from "./settingsContext";

class CSpeechSynthesizer {
  constructor() {
    this.utterance = new SpeechSynthesisUtterance();
    // const userAgent = new UserAgent();
    const parser = new UAParser();
    // console.log(parser.getResult());
    // parser.setUA(navigator.userAgent);
    // let os: string = parser.getOS();
    // console.log(`os=${os}`);
    let os: string = parser.getOS().name!;
    console.log(`os=${os}`);
    // console.log(`os=${parse(userAgent.toSt.os}`);
    // console.log(`userAgent.data.platform=${userAgent.data.platform}`);
    // console.log(
    //   `userAgent=${parser.setUA(navigator.userAgent).getResult().os}`
    // );
    // console.log(`userAgent=${navigator.userAgent}`);

    //// list available voices
    // window.speechSynthesis
    //   .getVoices()
    //   .map((voice: SpeechSynthesisVoice, key: any) => {
    //     console.log(`voice[${key}]=${voice.name}`);
    //   });
    if (os.indexOf("Mac") === 0) {
      // find samantha as default voice
      this.selectedVoiceIndex = 0; // samantha
    } else {
      this.selectedVoiceIndex = 2; // zira on windows
    }
  }
  utterance: SpeechSynthesisUtterance;
  voiceList: SpeechSynthesisVoice[] = [];
  selectedVoiceIndex: number;
  // who is this decault voice? differs from windows to osx
  cancel() {
    window.speechSynthesis.cancel();
  }
  get voices(): SpeechSynthesisVoice[] {
    return this.voiceList;
  }
  set voiceIndex(voiceIndex: number) {
    this.selectedVoiceIndex = voiceIndex;
  }
  setVoice(voice: string) {
    // translate voice.name into selectedVoiceIndex
    // window.speechSynthesis
    //   .getVoices()
    //   .map((voice: SpeechSynthesisVoice, key: any) => {
    //     console.log(`voice[${key}]=${voice.name}`);
    //   });
    //this.selectedVoiceIndex = selectedIndex;
  }
  set rate(rate: number) {
    this.utterance.rate = rate;
  }
  set volume(vol: number) {
    this.utterance.volume = vol;
  }
  // const onEndHandler = (setSpeakingCurrently: (toggle: boolean) => void) => { 
  //   window.speechSynthesis.cancel(); 
  //   console.log(`@@@ speak: onend @${(new Date().getTime().toString().slice(-5))}`);
  //   window.speechSynthesis.cancel(); 
  //   setSpeakingCurrently(false)
  // }
  speak(message: string, setSpeakingCurrently?: (toggle: boolean) => void) {
    if (setSpeakingCurrently !== undefined) {
      setSpeakingCurrently(true);
      this.utterance.onstart = () => {
        console.log(`@@@ speak: ${message} onstart @${(new Date().getTime().toString().slice(-5))}`);
      };
      this.utterance.onend = () => {
        window.speechSynthesis.cancel(); 
        console.log(`@@@ speak: ${message} onend @${(new Date().getTime().toString().slice(-5))}`);
        setSpeakingCurrently(false)
      };
      this.utterance.onerror = () => {
        window.speechSynthesis.cancel(); 
        console.log(`@@@ speak:  ${message} onerror @${(new Date().getTime().toString().slice(-5))}`); 
        setSpeakingCurrently(false);}
  
    }
    if (this.voiceList.length === 0) {
      this.voiceList = window.speechSynthesis.getVoices();
    }
    this.utterance.text = message;
    this.utterance.voice = this.voiceList[this.selectedVoiceIndex];
    console.log(`@@@ speak:  ${this.utterance.text} @${(new Date().getTime().toString().slice(-5))}`); 
    window.speechSynthesis.cancel(); 
    window.speechSynthesis.speak(this.utterance);
  }
}
export const Synthesizer: CSpeechSynthesizer = new CSpeechSynthesizer();

export const SpeechMonitor = () => {
  // internal state triggered by corresponding cursor transition state changes
  // but detached so their state can be announced and acknowledged without
  // altering the cursor transition state that may be used elsewhere
  const [announce_nextSentence, setAnnounce_nextSentence] = useState(false);
  const [announce_beginningOfPage, setAnnounce_beginningOfPage] = useState(
    false
  );
  const [announce_nextSection, setAnnounce_nextSection] = useState(false);
  const resetAnnounce_transitions = () => {
    setAnnounce_beginningOfPage(false);
    setAnnounce_nextSection(false);
    setAnnounce_nextSentence(false);
  };
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  Synthesizer.volume = settingsContext.settings.speech.volume;
  Synthesizer.rate = settingsContext.settings.speech.rate;
  // let pageContext: CPageLists = useAppSelector(store => store.pageContext);
  // cannot use useContext(PageContext) because context is only scoped within
  // a page
  // const test: boolean = useAppSelector(store => store.test);

  let message: string = "";
  // useEffect(() => {
  //   Synthesizer.voiceList = window.speechSynthesis.getVoices(); // loaded asynchronously
  //   // console.log(Synthesizer.voiceList);
  //   Synthesizer.paramObj.voice = Synthesizer.voiceList[this.selectedVoiceIndex]; // US woman
  // }, []);

  // const pageLoaded: boolean = useAppSelector(store => store.page_loaded);

  const beginningOfPage = useAppSelector(
    store => store.cursor_beginningOfPageReached
  );
  const nextSection = useAppSelector(
    store => store.cursor_nextSectionTransition
  );
  const nextSentence = useAppSelector(
    store => store.cursor_nextSentenceTransition
  );
  const sentenceListeningTransition: SentenceListItemEnumType = useAppSelector(
    store => store.sentence_type
  );
  const announcementEnabled = useAppSelector(store => store.recognition_announcementEnabled)
  // const sectionIdx = useAppSelector(store => store.cursor_sectionIdx);
  const useDefaultSentenceTransitions: boolean = useAppSelector(store => 
    store.sentence_useDefaultTransitions);
  useEffect(() => {
    // translate cursor transition to announcement. Using local state variables
    // so the can be reset independently of the reducer state variables using
    // resetAnnounce_transitions() above.

    // test 
      // console.log(`##transition=${nextSentence}, ${nextSection}`);
      setAnnounce_beginningOfPage(beginningOfPage);
      setAnnounce_nextSection(nextSection);
      setAnnounce_nextSentence(nextSentence && useDefaultSentenceTransitions);
  }, [beginningOfPage, nextSection, nextSentence, useDefaultSentenceTransitions]);

  useEffect(() => {
    // Listeningmessage dispatcher: Interprets the listening transition in the
    // context a sentence transition that may coincide with a section/paragraph
    // beginning or end of page transitions. An explicit listening transition
    // overrides announce messages.
    // console.log(
    //   `@@inside useEffect [${announce_beginningOfPage}, ${announce_nextSection}, ${announce_nextSentence}]`
    // );
    /*
    switch (sentenceListeningTransition) {
      case SentenceListItemEnumType.default:
        if (announce_beginningOfPage) {
          // message = ;
          Synthesizer.speak("beginning of page");
        } else if (announce_nextSection) {
          // console.log(`##section ${newSentenceTransition}`);
          let sectionType: string = pageContext.sectionList[sectionIdx].type;
          // message = ;
          Synthesizer.speak(
            `next ${sectionType === "undefined" ? "section" : sectionType}`
          );
        } else if (announce_nextSentence) {
          console.log(`##message newSentence`);
          // message = ;
          Synthesizer.speak("next sentence");
        } else {
          //
        }
        // Synthesizer.speak(message);
        break;
      case SentenceListItemEnumType.multipleChoiceQuestion:
        if (announce_nextSentence) {
          Synthesizer.speak("choose the correct option");
        }
        break;
      case SentenceListItemEnumType.multipleChoiceOption:
        if (announce_nextSentence) {
          Synthesizer.speak("choose the correct option");
        }
        break;
      case SentenceListItemEnumType.model:
        if (announce_nextSentence) {
          Synthesizer.speak("repeat the prompt");
        }
        break;
      default:
    }
    */
    resetAnnounce_transitions();
    // console.log(`###newSentence=${message}`);

    // if (announce_beginningOfPage) {
    //   console.log(`##beginning`);
    //   message = "beginning of page";
    //   Synthesizer.speak(message);
    // } else if (announce_newSection) {
    //   console.log(`##section ${newSentenceTransition}`);
    //   let sectionType: string = pageContext.sectionList[sectionIdx].type;
    //   message = `new ${sectionType === "undefined" ? "section" : sectionType}`;
    //   Synthesizer.speak(message);
    // } else if (announce_newSentence) {
    //   console.log(`##newSentence`);
    //   switch (newSentenceTransition) {
    //     case SentenceListItemEnumType.announce:
    //       message = "next sentence";
    //       break;
    //     case SentenceListItemEnumType.choose:
    //       message = "choose the correct option";
    //       break;
    //     case SentenceListItemEnumType.model:
    //       message = "repeat the prompt";
    //       break;
    //     default:
    //       message = "next sentence";
    //   }
    //   console.log(`###newSentence=${message}`);
    //   Synthesizer.speak(message);
    // } else {
    //   console.log(`##else`);
  }, [announce_beginningOfPage, announce_nextSection, announce_nextSentence]);

  const endOfPage = useAppSelector(store => store.cursor_endOfPageReached);
  useEffect(() => {
    if (announcementEnabled && endOfPage) {
      Synthesizer.speak("end of page");
    }
  }, [announcementEnabled, endOfPage]);

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
  const listening = useAppSelector(store => store.recognition_active);
  useEffect(() => {
    if (!announcementEnabled) {
      // say nothing
    }
    else if (listening) {
      Synthesizer.speak("listening");
    } else {
      Synthesizer.speak("not listening");
    }
  }, [listening, announcementEnabled]);
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
  const [recitationScope, _setRecitationScope] = useState(
    props.speechSettings.scope
  );
  const setRecitationScope = (recitationScope: RecitationScopeEnumType) => {
    _setRecitationScope(recitationScope);
    props.setSpeechSettings({
      ...props.speechSettings,
      scope: recitationScope
    });
  };
  const [recitationPlacement, _setRecitationPlacement] = useState(
    props.speechSettings.placement
  );
  const setRecitationPlacement = (
    recitationPlacement: RecitationPlacementEnumType
  ) => {
    _setRecitationPlacement(recitationPlacement);
    props.setSpeechSettings({
      ...props.speechSettings,
      placement: recitationPlacement
    });
  };
  const [recitationListening, _setRecitationListening] = useState(
    props.speechSettings.listening
  );
  const setRecitationListening = (
    recitationListening: RecitationListeningEnumType
  ) => {
    _setRecitationListening(recitationListening);
    props.setSpeechSettings({
      ...props.speechSettings,
      listening: recitationListening
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
  const [rate, _setRate] = useState(props.speechSettings.rate);
  const setRate = (rate: number) => {
    _setRate(rate);
    props.setSpeechSettings({
      ...props.speechSettings,
      rate: rate
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
        <RecitationOptions
          recitationScope={recitationScope}
          setRecitationScope={setRecitationScope}
          recitationPlacement={recitationPlacement}
          setRecitationPlacement={setRecitationPlacement}
          recitationListening={recitationListening}
          setRecitationListening={setRecitationListening}
        />
        <VoiceCharacteristics
          voiceIndex={voiceIndex}
          setVoiceIndex={setVoiceIndex}
          volume={volume}
          setVolume={setVolume}
          rate={rate}
          setRate={setRate}
        />
      </>
    );
  } else {
    return <></>;
  }
};
interface IVoiceCharacteristicsPropsType {
  voiceIndex: number;
  setVoiceIndex: (voiceIndex: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  rate: number;
  setRate: (rate: number) => void;
}
const VoiceCharacteristics = (props: IVoiceCharacteristicsPropsType) => {
  console.log(`voiceIdx=${props.voiceIndex}`);
  return (
    <>
      <div className="settings-grid-section-header">Voice Characteristics</div>
      <VoiceSelector
        voiceIndex={props.voiceIndex}
        setVoiceIndex={props.setVoiceIndex}
      />
      <VolumeSlider volume={props.volume} setVolume={props.setVolume} />
      <RateSlider rate={props.rate} setRate={props.setRate} />
      <VoiceTestButton
        voiceIndex={props.voiceIndex}
        setVoiceIndex={props.setVoiceIndex}
        volume={props.volume}
        setVolume={props.setVolume}
        rate={props.rate}
        setRate={props.setRate}
      />
    </>
  );
};
const VoiceTestButton = (props: IVoiceCharacteristicsPropsType) => {
  const testVoice = (event: any) => {
    let voice: string = window.speechSynthesis.getVoices()[props.voiceIndex]
      .name;
    console.log(`voice name=${voice}`);
    // create new synthezier object using temporary settings
    let temp: CSpeechSynthesizer = new CSpeechSynthesizer();
    temp.volume = props.volume;
    temp.rate = props.rate;
    temp.voiceIndex = props.voiceIndex;
    temp.speak(`You have selected ${voice}`);
  };
  return (
    <>
      <div className="settings-grid-section-item">
        <button onClick={testVoice} value="Test voice">
          Test Settings
        </button>
      </div>
    </>
  );
};
interface IRecitationOptionsProps {
  recitationScope: RecitationScopeEnumType;
  setRecitationScope: (recitationScope: RecitationScopeEnumType) => void;
  recitationPlacement: RecitationPlacementEnumType;
  setRecitationPlacement: (
    recitationPlacement: RecitationPlacementEnumType
  ) => void;
  recitationListening: RecitationListeningEnumType;
  setRecitationListening: (
    setRecitationListening: RecitationListeningEnumType
  ) => void;
}
export const RecitationOptions = (props: IRecitationOptionsProps) => {
  const onScopeChange = (event: any) => {
    console.log(`recitationScope onchange=${event.target.value}`);
    props.setRecitationScope(event.target.value);
  };
  const onPlacementChange = (event: any) => {
    console.log(`recitationPlacement onchange=${event.target.value}`);
    props.setRecitationPlacement(event.target.value);
  };
  const onListeningChange = (event: any) => {
    console.log(`recitationListening onchange=${event.target.value}`);
    props.setRecitationListening(event.target.value);
  };
  console.log(`recitationScope=${props.recitationScope}`);
  return (
    <>
      <div className="settings-grid-section-header">Recitation scope</div>
      <div
        className="recitation-radioButton settings-grid-section-item-recitation"
        onChange={onScopeChange}
      >
        <div className="settings-grid-section-item-recitation-control-group settings-radiobutton">
          <input
            type="radio"
            value={RecitationScopeEnumType.words}
            name="recitationScope"
            defaultChecked={
              props.recitationScope === RecitationScopeEnumType.words
            }
          />
          {RecitationScopeEnumType.words}
          <input
            type="radio"
            value={RecitationScopeEnumType.sentence}
            name="recitationScope"
            defaultChecked={
              props.recitationScope === RecitationScopeEnumType.sentence
            }
          />
          {RecitationScopeEnumType.sentence}
          <input
            type="radio"
            value={RecitationScopeEnumType.section}
            name="recitationScope"
            defaultChecked={
              props.recitationScope === RecitationScopeEnumType.section
            }
          />
          {RecitationScopeEnumType.section}
        </div>
        <div className="settings-grid-section-footer">
          Scope option determines how much of the current prose are recited when
          speak button is activated.
        </div>
      </div>
      <div className="settings-grid-section-header">
        Placement of cursor after reciting
      </div>
      <div
        className="recitation-radioButton settings-grid-section-item-recitation"
        onChange={onPlacementChange}
      >
        <div className="settings-grid-section-item-recitation-control-group settings-radiobutton">
          <input
            type="radio"
            value={RecitationPlacementEnumType.unchanged}
            name="recitationPlacement"
            defaultChecked={
              props.recitationPlacement ===
              RecitationPlacementEnumType.unchanged
            }
          />
          unchanged
          <input
            type="radio"
            value={RecitationPlacementEnumType.beginning}
            name="recitationPlacement"
            defaultChecked={
              props.recitationPlacement ===
              RecitationPlacementEnumType.unchanged
            }
          />
          at the beginning
          <input
            type="radio"
            value={RecitationPlacementEnumType.end}
            name="recitationPlacement"
            defaultChecked={
              props.recitationPlacement ===
              RecitationPlacementEnumType.unchanged
            }
          />
          at the end
        </div>
        <div className="settings-grid-section-footer">
          Placement option determines whether the current word position is
          unchanged, at the beginning or end of scope.
        </div>
      </div>
      <div className="settings-grid-section-header">
        Listening after recitation
      </div>
      <div
        className="recitation-radioButton settings-grid-section-item-recitation"
        onChange={onListeningChange}
      >
        <div className="settings-grid-section-item-recitation-control-group settings-radiobutton">
          <input
            type="radio"
            value={RecitationListeningEnumType.startListening}
            name="recitationListening"
            defaultChecked={
              props.recitationListening ===
              RecitationListeningEnumType.notListening
            }
          />
          start listening
          <input
            type="radio"
            value={RecitationListeningEnumType.notListening}
            name="recitationListening"
            defaultChecked={
              props.recitationListening ===
              RecitationListeningEnumType.notListening
            }
          />
          stop listening
        </div>
        <div className="settings-grid-section-footer">
          Listening option determines whether to start listening after
          recitation.
        </div>
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
    // console.log(`VoiceSelector: props.voiceIdx=${props.voiceIndex}`);
    // Synthesizer.setVoice(event.target.value, event.target.selectedIndex);
    props.setVoiceIndex(event.target.selectedIndex);
  };
  return (
    <>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Voice:</div>
        <select
          className="ddlb-voiceselect settings-grid-col2-control"
          onChange={onChangeValue}
          defaultValue={
            window.speechSynthesis.getVoices()[props.voiceIndex].name
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
interface IRateSliderProps {
  rate: number;
  setRate: (volume: number) => void;
}
export const RateSlider = (props: IRateSliderProps) => {
  const onChangeValue = (event: any) => {
    console.log(`onchange=${event.target.value}`);
    props.setRate(+event.target.value);
  };
  return (
    <>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Rate:</div>
        <div className="settings-grid-col2-control">
          <div className="slider-container rate-slider-container">
            <div className="slider-container-label-control"></div>
            <div className="slider-container-control">
              <input
                onChange={onChangeValue}
                className="slider-control"
                defaultValue={props.rate}
                type="range"
                min="0"
                max="2"
                step=".25"
              />
            </div>
            <div className="slider-container-label">
              <div className="ticklist" id="steplist">
                <span>very slow</span>
                <span>normal</span>
                <span>very fast</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
