/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_footer.tsx
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
import { ReciteButton1 } from "./reactcomp_recite1";
//import { SpeakButton } from "./reactcomp_speech_speakbutton";
import { ListenButton, ListeningMonitor } from "./reactcomp_listen";
import nextwordIcon from "./img/button_nextword.png";
import prevwordIcon from "./img/button_prevword.png";
import prevsentenceIcon from "./img/button_prevsentence.png";
import nextsentenceIcon from "./img/button_nextsentence.png";
import nextwordGhostedIcon from "./img/button_nextword_ghosted.png";
import prevwordGhostedIcon from "./img/button_prevword_ghosted.png";
import prevsentenceGhostedIcon from "./img/button_prevsentence_ghosted.png";
import nextsentenceGhostedIcon from "./img/button_nextsentence_ghosted.png";
// import { ModelingButtonIcon } from "./img/button_inline_model.png";
// import ModelButton from "./img/button_inline_model.png";
// import ModelButtonGhosted from "./img/button_inline_model_ghosted.png";
// import ModelButtonActive from "./img/button_inline_model_active.gif";

// import { ModelingButton } from "./reactcomp_terminals_inlinebutton";
import gotoLinkIcon from "./img/button_link.png";
import gotoLinkGhostedIcon from "./img/button_link_ghosted.png";
interface IPageFooterPropsType {
  message: string;
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
        <div className="footer-grid-recite">
          <ReciteButton1 />
        </div>
        {/* <div className="footer-grid-model">
          <ModelingButton />
        </div> */}
        <div className="footer-grid-link">
          <LinkButton />
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
        title="Go to previous sentence"
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
        title="Go to previous word"
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
  let terminalIdx = useAppSelector(store => store.cursor_terminalIdx);
  if (
    pageContext === null ||
    terminalIdx === pageContext.terminalList.length - 1
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
        title="Go to next word"
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
  // console.log(
  //   `last sentence Idx: ${pageContext.sentenceList.length} via context`
  // );
  console.log(
    `last sentence Idx: ${useAppSelector(
      store => store.cursor_sentenceIdx
    )} via reducer`
  );
  let sentenceIdx = useAppSelector(store => store.cursor_sentenceIdx);
  if (
    pageContext === null ||
    sentenceIdx === pageContext.sentenceList.length - 1
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
        title="Go to next sentence"
        onClick={() => onButtonClick()}
      />
    </>
  );
};
export const LinkButton = () => {
  let dispatch = useAppDispatch();
  let pageContext: CPageLists = useContext(PageContext)!;
  let icon: string;
  let active: boolean = false;
  let termIdx = useAppSelector(store => store.cursor_terminalIdx);
  if (
    pageContext !== null &&
    termIdx >= 0 &&
    termIdx < pageContext.terminalList.length
  ) {
    active = pageContext.terminalList[termIdx].linkIdx >= 0;
  }
  if (active) {
    icon = gotoLinkIcon;
  } else {
    icon = gotoLinkGhostedIcon;
  }
  const onButtonClick = () => {
    if (active) {
      dispatch(Request.Page_gotoLink());
      // must provide page and id because pageList.linkList is outside the
      // scope of sessionContext. Should provide new page, new currentIdx and
      // current idx to update soon-to-be previousPage OR session.pagePush could
    }
  };
  return (
    <>
      <img
        className="icon"
        alt="goto link"
        src={icon}
        title="go to hypertext link"
        onClick={() => onButtonClick()}
      />
    </>
  );
};
export const StatusBar = () => {
  return (
    <>
      <div className="footer-statusBar-message-application">
        {`${useAppSelector(store => store.message_application)}`}
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
// export const ModelingButton = () => {
//   useEffect(() => {
//     modelWorkFlow();
//   },[])
//   let dispatch = useAppDispatch();
//   let icon: string;
//   let active: boolean;
//   if (useAppSelector(store => store.cursor_sentenceIdx) === 0) {
//     icon = modelingButtonGhostedIcon;
//     // dispatch(Request.Modeling_toggle());
//     active = false;
//   } else {
//     icon = modelingButtonIcon;
//     active = true;
//   }

//   return (
//     <>
//       <img
//         className="icon"
//         alt="model sentence"
//         src={icon}
//         title="model sentence"
//         // onClick={}
//       />
//     </>
//   );}
