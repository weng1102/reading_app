/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps.tsx
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
import React from "react";
import "./App.css";
// import mic_listening from "./mic1-xparent.gif";
// import mic_notlistening from "./mic1-inactive-xparent.gif";
// import mic_unavailable from "./mic1-ghosted.gif";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";
import { ReadItButton } from "./reactcomp_speech";

// is this really necessary if availablility is removed below
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

import {
  IPageContent,
  IHeadingListItem,
  ISectionContent,
  ISentenceContent,
  ITerminalContent,
  ITerminalInfo,
  IAcronymTerminalMeta,
  IWordTerminalMeta,
  TerminalMetaEnumType,
  SectionVariantEnumType,
  ISectionParagraphVariant
} from "./pageContentType";
import { IPageContext, PageContext, PageContextInitializer } from "./termnodes";
import { NavBar } from "./reactcomp_navbar";
import { PageHeader } from "./reactcomp_pageheader";
import { ListeningMonitor, ListenButton } from "./reactcomp_listening";
import { SpeechSynthesizer } from "./reactcomp_speech";
//import data from "content";
//import ReactDOM from 'react-dom';
//var content = require("./content.json");
//var content = require("../../src/parsetest20210915.json");
import content from "./content/3wordsentences.json";
//import content from "content/terminals.json";//var contentts = require("./content.ts");
//const SpeechRecogition = new SpeechRecogition();

const SectionType = {
  ORDEREDLIST: "ol",
  UNORDEREDLIST: "ul",
  PARAGRAPH: "none"
};
//const speechRecognition = new SpeechRecognition();
// SpeechRecognition.continuous = true;
// SpeechRecognition.interimResults = true;
// SpeechRecognition.lang = "en-US";

////INSTEAD use SpeechRecognition.startListening(for the above parameters)
export const ReadingApp = () => {
  let dispatch = useAppDispatch();
  //  let terminalNodes: any = useContext(TerminalNodes);

  // if (terminalNodes === null) {
  //   terminalNodes = new CTerminalNodes(
  //     content.terminalList,
  //     content.headingList,
  //     content.sectionList,
  //     content.sentenceList);
  // }
  //dispatch(WordNodeActions.setWordNodes(terminalNodes));
  dispatch(
    Request.Recognition_setAvailability(
      SpeechRecognition.browserSupportsSpeechRecognition()
    )
  );
  //  console.log(`contentts=${contentts.name}`);
  // console.log(`page name=${contentts.name}`);
  // console.log(`section name=${contentts.sections[0].name}`);
  return (
    <PageContext.Provider
      value={PageContextInitializer(
        content.terminalList,
        content.headingList,
        content.sectionList,
        content.sentenceList
      )}
    >
      <Page content={content} />
    </PageContext.Provider>
    // create page state in redux
    // <TerminalNodes.Provider value={terminalNodes}>
    //   <Page content={content} />
    // </TerminalNodes.Provider>
  );
};
interface IPagePropsType {
  content: any;
}
export const Page = React.memo((props: IPagePropsType) => {
  //give access to page context to reducers
  let pageContext: IPageContext = useContext(PageContext)!;
  let dispatch = useAppDispatch();
  dispatch(Request.Page_setContext(pageContext)); // required for all pageContext changes
  dispatch(Request.Cursor_gotoFirstSection());
  return (
    // create page state in redux
    <>
      <PageHeader title={props.content.name} />
      <NavBar headings={props.content.headingList} />
      <Content content={props.content} />
    </>
  );
});
//PageHeader = React.memo(PageHeader);

interface IContentPropsType {
  content: IPageContent;
}
export const Content = React.memo((props: IContentPropsType): any => {
  console.log(`<Content>`);
  //let Content = (props: ContentPropsType) => {
  // Callback when section changes (via navbar)
  // page>section(chapter|paragraph)+>sentences>sentence>words>word
  //let pageid = useSelector(store => store.currentWorld.pageid);

  //need a props with number of words on page to size array
  // should set word to the first wordNodeIdx in the section
  //  let section = useSelector(store.WordSeqReducer.sectionId);
  //mapStateToProps()
  //  const [wordNodes, setWordNodes] = useContext(WordNodes);
  //  let currentWordSeq = useSelector(store => store.CursorActionReducer.wordNodeIdx);
  //  console.log(`<Content> currentWordSeq=${currentWordSeq}`);

  //  let currentSectionId = useContext(WordNodes).props(currentWordSeq).sectionId;

  // SAVE THIS FOR FUTURE labelling active section feature
  const currentSectionIdx: number = useAppSelector(
    store => store.cursor_sectionIdx
  );
  return (
    <div className="content-container">
      {props.content.sections.map(
        (section: ISectionContent, keyvalue: number) => (
          <SectionDispatcher
            key={keyvalue}
            //            keyvalue={keyvalue}
            active={currentSectionIdx === section.id}
            section={section}
          />
        ) // =>
      )}
    </div>
  ); // return
});
//Content = React.memo(Content);
interface ISectionFormatPropsType {
  listFormat: string;
  children: any;
}
interface ISectionPropsType1 {
  //  key: number;
  //  keyvalue: number;
  active: boolean;
  section: ISectionContent;
}
export const SectionDispatcher = React.memo((props: ISectionPropsType1) => {
  // console.log(`<SectionDispatcher type=${props.section.type}`);
  switch (props.section.type) {
    case SectionVariantEnumType.empty:
      return (
        <Section_empty
          //          key={props.key}
          //          active={props.active}
          section={props.section}
        />
      );
    case SectionVariantEnumType.paragraph:
      return (
        <Section_paragraph
          //          keyvalue={props.keyvalue}
          active={props.active}
          section={props.section}
        />
      );
    case SectionVariantEnumType.tbd:
      return (
        <div className="section-tbd">
          rendering unknown format for section type={props.section.type}
        </div>
      );
    case SectionVariantEnumType.subsection:
    case SectionVariantEnumType.listitem:
      return <li>list item</li>;
    case SectionVariantEnumType.unordered_list:
    case SectionVariantEnumType.ordered_list:
    case SectionVariantEnumType.fillin:
    case SectionVariantEnumType.fillin_list:
    case SectionVariantEnumType.photo_entry:
    case SectionVariantEnumType.blockquote:
    case SectionVariantEnumType.unittest:
    default:
      return (
        <div className="section-unsupported">
          rendering unsupported for section type={props.section.type}
        </div>
      );
  } //switch
});
export const Section_empty = (props: ISectionInactivePropsType1) => {
  let br = "<br>"; // or <p> or empty based on configuration
  // console.log(`<Section_Empty>`);
  return <>{br}</>;
};
interface ISectionInactivePropsType1 {
  section: ISectionContent;
}
interface ISectionPropsType1 {
  //  key: number;
  active: boolean;
  section: ISectionContent;
}
interface ISectionParagraphPropsType {
  //  key: number;
  active: boolean;
  paragraph: ISectionContent;
}
export const Section_paragraph = React.memo(
  (props: ISectionPropsType1): any => {
    console.log(`<Section_Paragraph active=${props.active}>`);
    const currentSentenceIdx: number = useAppSelector(
      store => store.cursor_sentenceIdx
    );
    //  if (props.paragraph.type === SectionVariantEnumType.paragraph) {
    let paragraph: ISectionParagraphVariant = props.section
      .meta as ISectionParagraphVariant;
    // console.log(
    //   `<Section_Paragraph> has ${paragraph.sentences.length} sentences`
    // );
    return (
      <>
        <p>
          {paragraph.sentences.map(
            (sentence: ISentenceContent, keyvalue: number) => (
              <Sentence1
                key={keyvalue}
                active={currentSentenceIdx === sentence.id}
                sentence={sentence}
              />
            )
          )}
        </p>
      </>
    );
  }
);
interface ISentencePropsType1 {
  //  key: number;
  active: boolean;
  sentence: ISentenceContent;
}
export const Sentence1 = React.memo((props: ISentencePropsType1) => {
  // const currentTerminalIdx: number = useAppSelector(
  //   store => store.cursor_terminalIdx
  // );
  console.log(
    `<Sentence1 sentenceIdx=${props.sentence.id} active=${props.active}>`
  );
  return (
    <>
      <span className="sentence">
        {props.sentence.terminals.map(
          (terminal: ITerminalContent, keyvalue: number) => (
            <TerminalDispatcher key={keyvalue} terminal={terminal} />
          )
        )}
      </span>
    </>
  );
});

export const SectionFormat = React.memo((props: ISectionFormatPropsType) => {
  console.log(`<SectionFormat>`);
  switch (props.listFormat) {
    case "ul":
      return <ul>{props.children}</ul>;
    case "ol":
      return <ol>{props.children}</ol>;
    default:
      return <>{props.children}</>;
  }
});
//SectionFormat = React.memo(SectionFormat);
interface ISectionHeadingPropsType {
  headingLevel: number;
  anchorId: any;
  sectionId: number;
  sectionName: string;
}
// const HeadingTag1 = (props: IHeadingTagPropsType) => {
// const headingLevels = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
// const validHeadingLevel =
//   props.level > 0 && props.level < headingLevels.length - 1
//     ? props.level
//     : 0;
//    return (React.createElement(headingLevels[validHeadingLevel], null, props.sectionName));
// }
// const HeadingTag = (props: IHeadingTagPropsType) => {
//   const headingLevels = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
//   const validHeadingLevel =
//     props.level > 0 && props.level < headingLevels.length - 1
//       ? props.level
//       : 0;
//   return (<>{headingLevels[validHeadingLevel]}</>);
// }
const SectionHeading = React.memo((props: ISectionHeadingPropsType) => {
  interface IHeadingTagPropsType {
    level: number;
    sectionId: number;
    sectionName: string;
  }
  const HeadingTag = (props: IHeadingTagPropsType) => {
    const headingLevels = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
    const validHeadingLevel =
      props.level > 0 && props.level < headingLevels.length - 1
        ? props.level
        : 0;
    //        return (React.createElement(headingLevels[validHeadingLevel], null, props.sectionName));
    return React.createElement(
      headingLevels[validHeadingLevel],
      null,
      props.sectionName
    );
  };
  //  const HeadingTag =(props: HeadingTagPropsType) => headingLevels[validHeadingLevel];
  //  if (props.anchorId !== "undefined") {
  // const headingLevels = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
  // // const HeadingTag1 = (props: IHeadingTagPropsType) => {
  // // //const headingLevels = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
  // const validHeadingLevel = props.headingLevel > 0 && props.headingLevel < headingLevels.length - 1
  //     ? props.headingLevel
  //     : 0;
  //   let headingLevel = headingLevels[validHeadingLevel];
  //   return (React.createElement(headingLevel, null, props.sectionName));
  // const HeadingTag2 = (
  //   <HeadingTag
  // )
  // const HeadingTag = (props:any) => { headingLevels[
  //   props.headingLevel > 0 && props.headingLevel < headingLevels.length - 1
  //     ? props.headingLevel
  //     : 0];
  //   }
  return (
    //      <HeadingTag headingLevel={props.headingLevel}>
    <HeadingTag
      level={props.headingLevel}
      sectionId={props.sectionId}
      sectionName={props.sectionName}
    />
    // <HeadingTag>
    //   <a id={props.sectionId.toString()}>{props.sectionName}</a>
    // </HeadingTag>
    //  );
    // } else {
    //   return (
    //     <HeadingTag1>
    //       {props.sectionName}
    //     </HeadingTag1>
  );
});
interface ISectionPropsType {
  active: boolean;
  sectionObj: any;
  listFormat: any;
}
let Section = React.memo((props: ISectionPropsType) => {
  console.log(
    `<Section> props.active=${props.active} props.listFormat=${props.listFormat} props.sectionObj=${props.sectionObj}`
  );
  ////
  // should be written to handle nested (recursive) sections using a props.level
  let level = 1; // reminder to keep track of depth of headings
  const currentSentenceId = useAppSelector(store => store.cursor_sentenceIdx);
  console.log(`<Section> currentSentenceId=${currentSentenceId}`);
  return (
    <>
      <SectionHeading
        headingLevel={1}
        sectionId={props.sectionObj.id}
        sectionName={props.sectionObj.name}
        anchorId={props.sectionObj.id}
      />

      <SectionFormat listFormat={props.listFormat}>
        {props.sectionObj.sentences.map((sentenceObj: any, keyvalue: any) => (
          <Sentence
            key={props.sectionObj.id * 1000 + keyvalue}
            active={props.active && sentenceObj.id === currentSentenceId}
            listFormat={props.listFormat}
            sentenceObj={sentenceObj}
          />
        ))}
      </SectionFormat>
    </>
  );
});
//Section = React.memo(Section);
interface ISentenceFormatPropsType {
  listFormat: any;
  children: any;
}
let SentenceFormat = React.memo((props: ISentenceFormatPropsType) => {
  console.log(`<SentenceFormat> ${props.listFormat}`);
  switch (props.listFormat) {
    case "ul" || "ol":
      return <li>{props.children}</li>;
    default:
      return <>{props.children}</>;
  }
});
//SentenceFormat = React.memo(SentenceFormat);
interface ISentencePropsType {
  active: boolean;
  listFormat: any;
  sentenceObj: any;
  wordObj?: any;
}
export const Sentence = React.memo((props: ISentencePropsType) => {
  return <></>;
}); //replaced deprecated code below
//   console.log(
//     `<Sentence> props.active=${props.active} props.listFormat=${props.listFormat} props.sentenceObj=${props.sentenceObj}`
//   );
//   const currentWordNodeIdx = useAppSelector(store => store.cursor_terminalIdx); // cause rerendering of all sentences
//   return (
//     <SentenceFormat listFormat={props.listFormat}>
//       <span className={`audible-sentence ${props.active ? "active" : ""}`}>
//         {props.sentenceObj.words.map((wordObj: any, keyvalue: any) => (
//           <Word
//             key={props.sentenceObj.id * 1000 + keyvalue}
//             active={props.active && wordObj.wordNodeIdx === currentWordNodeIdx}
//             wordObj={wordObj}
//           />
//         ))}
//       </span>
//     </SentenceFormat>
//   );
// });
//Sentence = React.memo(Sentence);
interface IWordPropsType {
  active: boolean;
  wordObj: any;
  visited?: boolean;
}
interface ITerminalPropsType {
  active: boolean;
  terminal: ITerminalContent;
}
interface ITerminalInactivePropsType {
  //  key: number;
  //  active: boolean;
  terminal: ITerminalContent;
  //  visited?: boolean;
}
interface ITerminalDispatcherPropsType {
  //  keyvalue: number;
  terminal: ITerminalContent;
  //  visited?: boolean;
}
let TerminalDispatcher = React.memo(
  (props: ITerminalDispatcherPropsType): any => {
    const currentTerminalIdx = useAppSelector(
      store => store.cursor_terminalIdx
    );
    //*********
    //RERENDERING ISSUE
    // useSelector(currentTerminalIdx) that changes EVERYTIME word advances thus triggers
    // rerendering of TerminalDispatcher but NOT actual screen update.
    // cause rerendering of all sentences
    // console.log(
    //   `<TerminalDispatcher content=${props.terminal.content} />` // props.active=${props.active} props.terminal=${props.terminal} />`
    // );
    // for all terminals made of multiple TerminalInfo blocks, active must identify the specific terminalList
    // So even if the the component renders the entire compound terminal, active can only be set for a single
    // terminal
    //
    //
    // Explore using props.children in dispatcher to tranparently dispatch without triggering rerender via useSelector
    //
    // *********
    switch (props.terminal.type) {
      case TerminalMetaEnumType.acronym:
        return (
          <Terminal_Acronym
            //          active={true} //currentTerminalNodeIdx===props.terminal.termIdx}
            //            key={props.keyvalue}
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
        break;
      case TerminalMetaEnumType.word:
        let meta = props.terminal.meta as IWordTerminalMeta;
        let active = currentTerminalIdx === meta.termIdx;
        ///      active = currentTermIdx === meta.termIdx;
        return <Terminal_Word active={active} terminal={props.terminal} />;
        break;
      case TerminalMetaEnumType.whitespace:
        return <Terminal_Whitespace active={false} terminal={props.terminal} />;
        break;
      case TerminalMetaEnumType.currency:
        break;
      case TerminalMetaEnumType.date:
        break;
      case TerminalMetaEnumType.emailaddress:
        break;
      case TerminalMetaEnumType.numberwithcommas:
        break;
      case TerminalMetaEnumType.phonenumber:
        break;
      case TerminalMetaEnumType.punctuation:
        return (
          <Terminal_Whitespace
            //        active={active}
            //            key={props.keyvalue}
            active={false}
            terminal={props.terminal}
          />
        );
        break;
      case TerminalMetaEnumType.tbd:
        break;
      case TerminalMetaEnumType.time:
        break;
      case TerminalMetaEnumType.token:
        break;
      case TerminalMetaEnumType.year:
        break;
      default:
        return <>unknown terminal {props.terminal.content}</>;
        break;
    }
  }
);
let Terminal_Acronym = React.memo((props: ITerminalPropsType): any => {
  console.log(`<Terminal_acronym> active=${props.active}`);
  // Rather not trigger dispatch via useSelector but necessary for all multiple terminal words
  // Rerenders only when acronym is active theough
  const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx); // cause rerendering of all sentences
  let dispatch = useAppDispatch();
  let acronym: IAcronymTerminalMeta = props.terminal
    .meta as IAcronymTerminalMeta;
  //  let active = props.active ? "active" : "";
  return (
    <>
      {acronym.letters.map((letter: ITerminalInfo, keyvalue: number) => (
        <span
          key={keyvalue}
          className={`${letter.recitable ? "recitable-word" : "word"} ${
            props.active && currentTerminalIdx === letter.termIdx
              ? "active"
              : ""
          }`}
          onClick={() => dispatch(Request.Cursor_gotoWordByIdx(letter.termIdx))}
        >
          {letter.content}
        </span>
      ))}
    </>
  ); // return
});
let Terminal_Word = React.memo((props: ITerminalPropsType): any => {
  let dispatch = useAppDispatch();
  // const currentTerminalIdx = useAppSelector(
  //   store => store.CursorActionReducer.terminalIdx
  // ); // cause rerendering of all sentences
  // let currentTerminalIdx = 0;
  console.log(
    `<Terminal_word active=${props.active} content=${props.terminal.content}/>`
  );
  let termInfo = props.terminal.meta as ITerminalInfo;
  let recitableWordClass = termInfo.recitable ? "recitable-word" : "word";
  if (termInfo.audible) {
    return (
      <span
        className={`${recitableWordClass} ${
          //          currentTerminalIdx === termInfo.termIdx ? "active" : ""
          props.active ? "active" : ""
        }`}
        onClick={() => dispatch(Request.Cursor_gotoWordByIdx(termInfo.termIdx))}
      >
        {props.terminal.content}
      </span>
    );
  } else {
    return <span>{props.terminal.content}</span>;
  }
});
let Terminal_Whitespace = React.memo((props: ITerminalPropsType): any => {
  console.log(
    `<Terminal_whitespace props.terminal=${props.terminal} content=${props.terminal.content}/>`
  );
  return <span>{props.terminal.content}</span>;
});
// let Word = React.memo((props: IWordPropsType) => {
//   console.log(
//     `<Word> props.active=${props.active} props.wordObj=${props.wordObj}`
//   );
//   console.log(`<Word> word=${props.wordObj.word}`);
//   if (Number.isInteger(props.wordObj.wordNodeIdx)) {
//     // call wordNode.validWordNodeIndx
//     return (
//       <AudibleWord
//         key={props.wordObj.wordNodeIdx}
//         active={props.active}
//         wordObj={props.wordObj}
//         visited={false}
//         //        visited={visited}
//       />
//     );
//   } else {
//     return (
//       <Whitespace key={props.wordObj.wordNodeIdx} wordObj={props.wordObj} />
//     );
//   }
// });
// //Word = React.memo(Word);
// interface IWhitespacePropsType {
//   wordObj: any;
// }
// export const Whitespace = React.memo((props: IWhitespacePropsType) => {
//   console.log(`<Whitespace> rendering whitespace/punctuations`);
//   return (
//     <>
//       <span>{props.wordObj.word}</span>
//     </>
//   );
// });
//Whitespace = React.memo(Whitespace);
// interface IAudiblePropsType {
//   active: boolean;
//   visited: boolean;
//   wordObj: any;
// }
// export const AudibleWord = React.memo((props: IAudiblePropsType) => {
//   console.log(
//     `<AudibleWord> props.active=${props.active} props.wordObj=${props.wordObj} props.visited`
//   );
//   let dispatch = useAppDispatch();
//   let active = props.active ? "active" : "";
//   return (
//     <>
//       <span
//         key={props.wordObj.wordNodeIdx}
//         className={`audible-word ${active} ${props.visited}`}
//         onClick={() =>
//           dispatch(Request.Cursor_gotoWordByIdx(props.wordObj.wordNodeIdx))
//         }
//       >
//         {props.wordObj.word}
//       </span>
//     </>
//   );
// });
