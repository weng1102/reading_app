/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_footer.tsx
 *
 * Defines React front end functional components.
 *
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
// import mic_listening from "./mic1-xparent.gif";
// import mic_notlistening from "./mic1-inactive-xparent.gif";
// import mic_unavailable from "./mic1-ghosted.gif";
import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { Request } from "./reducers";
import { CPageContext } from "./pageContext";
import { SpeechMonitor } from "./reactcomp_speech";
import { SpeakButton } from "./reactcomp_speech_speakbutton";
import { ListenButton, ListeningMonitor } from "./reactcomp_listen";
import speakIcon from "./button_speak.png";
import speakGhostedIcon from "./button_speak_ghosted.png";
import nextwordIcon from "./button_nextword.png";
import prevwordIcon from "./button_prevword.png";
import prevsentenceIcon from "./button_prevsentence.png";
import nextsentenceIcon from "./button_nextsentence.png";
import nextwordGhostedIcon from "./button_nextword_ghosted.png";
import prevwordGhostedIcon from "./button_prevword_ghosted.png";
import prevsentenceGhostedIcon from "./button_prevsentence_ghosted.png";
import nextsentenceGhostedIcon from "./button_nextsentence_ghosted.png";
// import mic_unavailable from "./mic1-ghosted.gif";

// is this really necessary if availablility is removed below
// import SpeechRecognition, {
//   useSpeechRecognition
// } from "react-speech-recognition";
// import {
//   IPageContent,
//   IHeadingListItem,
//   ISectionContent,
//   ISentenceContent,
//   ITerminalContent,
//   ITerminalInfo,
//   IAcronymTerminalMeta,
//   IWordTerminalMeta,
//   TerminalMetaEnumType,
//   SectionVariantEnumType,
//   ISectionParagraphVariant
// } from "./pageContentType";
import { PageContext } from "./pageContext";
//import { ListeningMonitor } from "./reactcomp_listen";
//import { SpeechSynthesizer, ReadItButton } from "./reactcomp_speech";
//import data from "content";
//import ReactDOM from 'react-dom';
//var content = require("./content.json");
//var content = require("../../src/parsetest20210915.json");
//import content from "./content/3wordsentences.json";
//import content from "content/terminals.json";//var contentts = require("./content.ts");
//const SpeechRecogition interface IPageHeaderPropsType {
interface IPageFooterPropsType {
  title: string;
}
export const PageFooter = React.memo(() => {
  // retrieve pageContext
  console.log(`<PageFooter>`);
  return (
    <footer className="footer-flex-container">
      <div className="controlBar-container">
        <div className="footer-grid-listen">
          <ListenButton />
        </div>
        <div className="footer-grid-speak">
          <SpeakButton />
        </div>
        <div className="footer-grid-prevSentence">
          <PreviousSentenceButton />
        </div>
        <div className="footer-grid-prevWord">
          <PreviousWordButton />
        </div>
        <div className="footer-grid-nextWord">
          <NextWordButton />
        </div>
        <div className="footer-grid-nextSentence">
          <NextSentenceButton />
        </div>
      </div>
      <div className="footer-statusBar">
        <StatusBar
          message={`status: Expecting to hear "forteenth" The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog.`}
        />
        <SpeechMonitor />
        <ListeningMonitor />
      </div>
    </footer>
  );
});
export const PreviousSentenceButton = () => {
  let dispatch = useAppDispatch();
  let icon: string;
  let active: boolean;
  if (useAppSelector(store => store.cursor_sentenceIdx) === 0) {
    icon = prevsentenceGhostedIcon;
    active = false;
  } else {
    icon = prevsentenceIcon;
    active = true;
  }
  const onButtonClick = () => {
    if (active) dispatch(Request.Cursor_gotoPreviousSentence());
  };
  return (
    <>
      <img
        className="icon"
        alt="previous sentence"
        src={icon}
        onClick={onButtonClick}
      />
    </>
  );
};
export const PreviousWordButton = () => {
  let dispatch = useAppDispatch();
  let icon: string;
  let active: boolean;
  if (useAppSelector(store => store.cursor_terminalIdx) === 0) {
    icon = prevwordGhostedIcon;
    active = false;
  } else {
    icon = prevwordIcon;
    active = true;
  }
  const onButtonClick = () => {
    if (active) dispatch(Request.Cursor_gotoPreviousWord());
  };
  return (
    <>
      <img
        className="icon"
        alt="previous word"
        src={icon}
        onClick={() => onButtonClick()}
      />
    </>
  );
};
export const NextWordButton = () => {
  let dispatch = useAppDispatch();
  let icon: string;
  let active: boolean;
  if (
    useAppSelector(store => store.cursor_terminalIdx) ===
    useAppSelector(store => store.pageContext.terminalList).length - 1
  ) {
    icon = nextwordGhostedIcon;
    active = false;
  } else {
    icon = nextwordIcon;
    active = true;
  }
  const onButtonClick = () => {
    if (active) dispatch(Request.Cursor_gotoNextWord());
  };
  return (
    <>
      <img
        className="icon"
        alt="next word"
        src={icon}
        onClick={() => onButtonClick()}
      />
    </>
  );
};
export const NextSentenceButton = () => {
  let dispatch = useAppDispatch();
  let icon: string;
  let active: boolean;
  if (
    useAppSelector(store => store.cursor_sentenceIdx) ===
    useAppSelector(store => store.pageContext.sentenceList).length - 1
  ) {
    icon = nextsentenceGhostedIcon;
    active = false;
  } else {
    icon = nextsentenceIcon;
    active = true;
  }
  const onButtonClick = () => {
    if (active) dispatch(Request.Cursor_gotoNextSentence());
  };
  return (
    <>
      <img
        className="icon"
        alt="next sentence"
        src={icon}
        onClick={() => onButtonClick()}
      />
    </>
  );
};
interface StatusBarPropsType {
  message: string;
}
export const StatusBar = (props: StatusBarPropsType) => {
  return <>{props.message}</>;
};
