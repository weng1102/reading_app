/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
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
import { useAppDispatch, useAppSelector } from "./hooks";
import { useContext } from "react";
import { CPageLists, PageContext } from "./pageContext";
//import { ISettingsContext, SettingsContext } from "./settingsContext";
import { Request } from "./reducers";
import { SpeechMonitor } from "./reactcomp_speech";
import { SpeakButton } from "./reactcomp_speech_speakbutton";
import { ListenButton, ListeningMonitor } from "./reactcomp_listen";
import nextwordIcon from "./button_nextword.png";
import prevwordIcon from "./button_prevword.png";
import prevsentenceIcon from "./button_prevsentence.png";
import nextsentenceIcon from "./button_nextsentence.png";
import nextwordGhostedIcon from "./button_nextword_ghosted.png";
import prevwordGhostedIcon from "./button_prevword_ghosted.png";
import prevsentenceGhostedIcon from "./button_prevsentence_ghosted.png";
import nextsentenceGhostedIcon from "./button_nextsentence_ghosted.png";
import gotoLinkIcon from "./button_link.png";
import gotoLinkGhostedIcon from "./button_link_ghosted.png";

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
        <div className="footer-grid-prevWord">
          <PreviousWordButton />
        </div>
        <div className="footer-grid-nextWord">
          <NextWordButton />
        </div>
        <div className="footer-grid-prevSentence">
          <PreviousSentenceButton />
        </div>
        <div className="footer-grid-nextSentence">
          <NextSentenceButton />
        </div>
        <div className="footer-grid-link">
          <LinkButton />
        </div>
      </div>
      <div className="footer-statusBar">
        <StatusBar />
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
  let pageContext: CPageLists = useContext(PageContext)!;
  let icon: string;
  let active: boolean;
  if (
    useAppSelector(store => store.cursor_terminalIdx) ===
    pageContext.terminalList.length - 1
    //    useAppSelector(store => store.pageContext.terminalList).length - 1
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
  let pageContext: CPageLists = useContext(PageContext)!;
  let icon: string;
  let active: boolean;
  console.log(
    `last sentence Idx: ${pageContext.sentenceList.length} via context`
  );
  console.log(
    `last sentence Idx: ${useAppSelector(
      store => store.cursor_sentenceIdx
    )} via reducer`
  );
  if (
    useAppSelector(store => store.cursor_sentenceIdx) ===
    pageContext.sentenceList.length - 1
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
export const LinkButton = () => {
  let dispatch = useAppDispatch();
  let pageContext: CPageLists = useContext(PageContext)!;
  let icon: string;
  let active: boolean;
  let termIdx = useAppSelector(store => store.cursor_terminalIdx);
  active = pageContext.terminalList[termIdx].linkIdx >= 0;
  if (active) {
    icon = gotoLinkIcon;
  } else {
    icon = gotoLinkGhostedIcon;
  }
  const onButtonClick = () => {
    if (active) dispatch(Request.Page_gotoLink());
  };
  return (
    <>
      <img
        className="icon"
        alt="goto link"
        src={icon}
        onClick={() => onButtonClick()}
      />
    </>
  );
};
interface StatusBarPropsType {}
export const StatusBar = () => {
  return (
    <>
      <div className="footer-statusBar-message-application">
        {useAppSelector(store => store.message_application)}
      </div>
      <div className="footer-statusBar-message-listening">
        <ListeningMonitor />
      </div>
      <div className="footer-statusBar-message-state">
        {useAppSelector(store => store.message_state)}
        <SpeechMonitor />
      </div>
    </>
  );
};
