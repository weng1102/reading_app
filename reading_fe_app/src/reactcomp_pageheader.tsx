/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_header.tsx
 *
 * Defines React front end functional components.
 *
 *
 * Version history:
 *
 **/ import React from "react";
import "./App.css";
// import mic_listening from "./mic1-xparent.gif";
// import mic_notlistening from "./mic1-inactive-xparent.gif";
// import mic_unavailable from "./mic1-ghosted.gif";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";

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
import { ListeningMonitor, ListenButton } from "./reactcomp_listening";
import { SpeechSynthesizer, ReadItButton } from "./reactcomp_speech";
//import data from "content";
//import ReactDOM from 'react-dom';
//var content = require("./content.json");
//var content = require("../../src/parsetest20210915.json");
//import content from "./content/3wordsentences.json";
//import content from "content/terminals.json";//var contentts = require("./content.ts");
//const SpeechRecogition interface IPageHeaderPropsType {
interface IPageHeaderPropsType {
  title: string;
}
export const PageHeader = React.memo((props: IPageHeaderPropsType) => {
  const floatLeft: React.CSSProperties = { float: "left" };
  console.log(`<PageHeader>`);
  return (
    <header className="header">
      <div className="headerleft" style={floatLeft}>
        <div className="listen" style={floatLeft}>
          <ListenButton />
        </div>
        <div className="headertitle" style={floatLeft}>
          {props.title}
        </div>
      </div>
      <div className="header-container-controls">
        <div className="speechSynthesizer">
          <SpeechSynthesizer />
        </div>
        <div className="shortcuts">
          <Shortcuts />
        </div>
        <div className="wordsheard">
          <WordsHeard />
        </div>
        <div className="wordcontrol">
          <WordControl />
        </div>
        <div className="readitbutton">
          <ReadItButton />
        </div>
        <div className="listeningMonitor">
          <ListeningMonitor />
        </div>
      </div>
    </header>
  );
});
//interface IShortcutsPropsType {}
const Shortcuts = () => {
  // handlechange
  return (
    <select className="ddlb-shortcuts">
      <option value="shortcuts...">Shortcuts...</option>
      <option value="the">the</option>
      <option value="quick">quick</option>
      <option value="3-Word Sentences">3-Word Sentences</option>
      <option value="fox">fox</option>
      <option value="jumped">jumped</option>
      <option value="the quick brown fox jumped">
        the quick brown fox jumped
      </option>
    </select>
  );
};
//interface IWordsHeardPropsType {}
const WordsHeard = () => {
  const readOnly = { readonly: "true" };
  return (
    <textarea
      className="wordsheard"
      readOnly
      value="I can't hear you? Are you there?"
    />
  );
};
//interface IWordControlPropsType {}
const WordControl = () => {
  let pageContext: IPageContext | null = useContext(PageContext);
  let lastTerminalIdx: number = pageContext!.terminalList.length - 1;
  return (
    <>
      <div className="wordNodeIdxvalue">
        <IdField name="LastWordIdx" id={lastTerminalIdx.toString()} />
      </div>
      <div className="wordNodeIdxvalue">
        <IdField
          name="Current"
          id={useAppSelector(store => store.cursor_terminalIdx).toString()}
        />
      </div>
      <div className="resetwordbutton">
        <ResetWordButton />
      </div>
      <div className="prevwordbutton">
        <PrevWordButton />
      </div>
      <div className="nextwordbutton">
        <NextWordButton />
      </div>
    </>
  );
};
interface IdFieldPropsType {
  name: string;
  id: string;
}
const IdField = (props: IdFieldPropsType) => {
  return (
    <>
      <span className="labelled-textarea">
        <label>{props.name}: </label>
        <textarea
          readOnly
          value={props.id}
          className="text"
          name={props.name}
          rows={1}
        />
      </span>
    </>
  );
};
interface ResetButtonPropsType {}
const ResetWordButton = () => {
  const dispatch = useAppDispatch();
  return (
    <button
      className="resetWordButton"
      onClick={() => dispatch(Request.Cursor_gotoFirstWord())}
    >
      Reset
    </button>
  );
};
//interface IPrevWordButtonPropsType {}
const PrevWordButton = () => {
  let dispatch = useAppDispatch();
  return (
    <button
      className="prevWordButton"
      onClick={() => dispatch(Request.Cursor_gotoPreviousWord())}
    >
      Prev
    </button>
  );
};
interface NextWordButtonPropsType {}
const NextWordButton = () => {
  let dispatch = useAppDispatch();
  return (
    <button
      className="nextWordButton"
      onClick={() => dispatch(Request.Cursor_gotoNextWord())}
    >
      Next
    </button>
  );
};
