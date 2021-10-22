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
import path from "path";
import glob from "glob";
//import { readFileSync } from "fs";
// import mic_listening from "./mic1-xparent.gif";
// import mic_notlistening from "./mic1-inactive-xparent.gif";
// import mic_unavailable from "./mic1-ghosted.gif";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector, useSpanRef, useDivRef } from "./hooks";
import { useEffect, useState, useContext, useRef } from "react";

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
  ISectionHeadingVariant,
  IWordTerminalMeta,
  TerminalMetaEnumType,
  SectionVariantEnumType,
  ISectionParagraphVariant
} from "./pageContentType";
import { IPageContext, PageContext, PageContextInitializer } from "./termnodes";
import { NavBar } from "./reactcomp_navbar";
import { PageHeader } from "./reactcomp_pageheader";
import { Settings } from "./reactcomp_settings";

const SectionType = {
  ORDEREDLIST: "ol",
  UNORDEREDLIST: "ul",
  PARAGRAPH: "none"
};
let url: string =
  "https://weng1102.github.io/reading_app/dist/terminals_dates.json";

export const ReadingApp = () => {
  const [error, setError] = useState(null);
  const [jsonContent, setJsonContent] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false); // is this necessary if jsonContent is used as a dependency fo useEffect()
  let dispatch = useAppDispatch();
  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(
        data => {
          setJsonContent(data);
          setIsLoaded(true);
        },
        error => {
          setError(error);
        }
      );
  }, [url]);

  dispatch(
    Request.Recognition_setAvailability(
      SpeechRecognition.browserSupportsSpeechRecognition()
    )
  );
  if (error) {
    let error1 = error as Error;
    return (
      <div className="loadingAnnouncement">
        Error while loading: {error1.message}
      </div>
    );
  } else if (!isLoaded) {
    return <div className="loadingAnnouncement">loading...</div>;
  } else {
    let content: IPageContent = jsonContent! as IPageContent;
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
    );
  }
};
interface IPagePropsType {
  content: IPageContent;
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
      <PageHeader title={props.content.title} />
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
interface ISectionPropsType {
  //  key: number;
  //  keyvalue: number;
  active: boolean;
  section: ISectionContent;
}
export const SectionDispatcher = React.memo((props: ISectionPropsType) => {
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
    case SectionVariantEnumType.heading:
      return <Section_heading active={props.active} section={props.section} />;
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
  let br = ""; // or <p> or empty based on configuration
  // console.log(`<Section_Empty>`);
  return <>{br}</>;
};
interface ISectionInactivePropsType1 {
  section: ISectionContent;
}
// interface ISectionPropsType1 {
//   //  key: number;
//   active: boolean;
//   section: ISectionContent;
// }
interface ISectionParagraphPropsType {
  //  key: number;
  active: boolean;
  paragraph: ISectionContent;
}
export const Section_paragraph = React.memo((props: ISectionPropsType): any => {
  console.log(`<Section_Paragraph active=${props.active}>`);
  const currentSentenceIdx: number = useAppSelector(
    store => store.cursor_sentenceIdx
  );
  //  if (props.paragraph.type === SectionVariantEnumType.paragraph) {
  let paragraph: ISectionParagraphVariant = props.section
    .meta as ISectionParagraphVariant;
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
});
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
  active: boolean;
  sectionIdx: number;
  headingLevel: number;
  title: string;
}
const SectionHeading = React.memo(() => {
  return <></>;
});
interface IHeadingTagPropsType {
  headingLevel: number;
}
const Section_heading = React.memo((props: ISectionPropsType) => {
  const headingRef = useDivRef();
  const sectionIdx = props.section.id;
  let meta = props.section.meta as ISectionHeadingVariant;
  const headingLevels = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
  const validHeadingLevel =
    meta.level > 0 && meta.level < headingLevels.length - 1 ? meta.level : 0;
  const HeadingTag = headingLevels[
    validHeadingLevel
  ] as keyof JSX.IntrinsicElements;
  return (
    <div
      className="section-heading"
      id={sectionIdx.toString()}
      ref={headingRef}
    >
      <HeadingTag>{meta.title}</HeadingTag>
    </div>
  );
  ///////////////    React.createElement(HeadingTag, null, meta.title);
  //      <HeadingTag headingLevel={props.headingLevel}>
  // <HeadingTag>
  //   <a id={props.sectionId.toString()}>{props.sectionName}</a>
  // </HeadingTag>
  //  );
  // } else {
  //   return (
  //     <HeadingTag1>
  //       {props.sectionName}
  //     </HeadingTag1>
});
interface ISectionPropsTypeDeprecated {
  active: boolean;
  sectionObj: any;
  listFormat: any;
}
let Section = React.memo((props: ISectionPropsTypeDeprecated) => {
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
      <SectionHeading />

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
    // rerendering of TerminalDispatcher but NOT actual screen update. Could keep an active/inactive array for all words
    // on page in state but array are immutable and thus even a single element change requires a copy of entire array
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
  //  const termRef = useSpanRef();
  const terminalRef = useSpanRef();
  useEffect(() => {
    console.log(`<Terminal Word> useEffect() active, expecting scrollToView()`);
    /* Consider multiple scrollIntoView modes:
      interparagraph/section: scroll to top of new sectionName
      intraparagraph: scroll lin-by-line until new section/paragraph
    */
    /*
    behavior (Optional) Defines the transition animation. One of auto or smooth. Defaults to auto.
    block (Optional) Defines vertical alignment. One of start, center, end, or nearest. Defaults to start.
    inline Optional Defines horizontal alignment. One of start, center, end, or nearest. Defaults to nearest.
*/
    if (terminalRef.current != null) {
      let rect = terminalRef.current.getBoundingClientRect();
      if (rect.top < 200 || rect.bottom > window.innerHeight) {
        terminalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }
    }
  }, [props.active]);
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
        className={`${recitableWordClass} ${props.active ? "active" : ""}`}
        ref={terminalRef}
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
    `<Terminal_whitespace props.terminal=${props.terminal} content="${props.terminal.content}"/>`
  );
  //  return <span>{props.terminal.content}</span>;
  return <span className="whitespace">{props.terminal.content}</span>;
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
