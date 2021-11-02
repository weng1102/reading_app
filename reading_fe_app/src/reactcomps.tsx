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
import { useEffect, useState, useContext } from "react";

// is this really necessary if availablility is removed below
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

import {
  IPageContent,
  ISectionContent,
  ISentenceContent,
  ITerminalContent,
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
import { TerminalDispatcher } from "./reactcomps_terminals";
import { SectionDispatcher, ISectionPropsType } from "./reactcomps_sections";

// const SectionType = {
//   ORDEREDLIST: "ol",
//   UNORDEREDLIST: "ul",
//   PARAGRAPH: "none"
// };
let urlFileRequested: string;
urlFileRequested = ".json";
urlFileRequested = "terminals_phonenumbers.json";
urlFileRequested = "lists.json";
let urlRequested: string =
  "https://weng1102.github.io/reading_app/dist/" + urlFileRequested;

export const ReadingApp = () => {
  const [responseError, setResponseError] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [jsonContent, setJsonContent] = useState<IPageContent | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false); // is this necessary if jsonContent is used as a dependency fo useEffect()
  let dispatch = useAppDispatch();

  function fetchRequest<IPageContent>(url: string) {
    fetch(url)
      .then(
        response => {
          return response.json();
        },
        error => {
          setResponseError(error);
        }
      )
      .then(
        data => {
          setJsonContent(data);
          setIsLoaded(true);
        },
        error => {
          setParseError(error);
        }
      ); // should consider capturing parser error
  }
  useEffect(() => {
    fetchRequest(urlRequested);
  }, [urlRequested]);
  dispatch(
    Request.Recognition_setAvailability(
      SpeechRecognition.browserSupportsSpeechRecognition()
    )
  );
  if (responseError) {
    console.log(
      `Response Error encountered while loading "${urlFileRequested}": ${responseError}`
    );
    return (
      <div className="loadingAnnouncement">
        Error encountered while loading "{urlFileRequested}": {responseError}
      </div>
    );
  } else if (parseError) {
    return (
      <div className="loadingAnnouncement">
        Error encountered while parsing "{urlFileRequested}": {parseError}
      </div>
    );
  } else if (jsonContent === null) {
    return (
      <div className="loadingAnnouncement">
        Warning while loading {urlFileRequested}: no properly formatted content
        provided
      </div>
    );
  } else if (!isLoaded) {
    return (
      <div className="loadingAnnouncement">Loading {jsonContent.title}...</div>
    );
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
            active={currentSectionIdx === section.id}
            section={section}
          />
        ) // =>
      )}
    </div>
  ); // return
});
