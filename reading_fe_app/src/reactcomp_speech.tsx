import React from "react";
import "./App.css";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";
import { IPageContext, PageContext } from "./termnodes";

export const SpeechSynthesizer = () => {
  const dispatch = useAppDispatch();
  const SpeechSynthesizer = new SpeechSynthesisUtterance();
  let pageContext: IPageContext = useContext(PageContext)!;
  const newSentence = useAppSelector(
    store => store.cursor_newSentenceTransition
  );
  const newSection = useAppSelector(store => store.cursor_newSectionTransition);
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
  useEffect(
    () => {
      if (newSection) {
        message = "new section";
        console.log(`speaking "${message}"`);
        SpeechSynthesizer.text = message;
        window.speechSynthesis.speak(SpeechSynthesizer);
        dispatch(Request.Cursor_acknowledgeTransition());
      } else {
        console.log(`NOT speaking ${message}"`);
      }
      if (newSentence) {
        message = "new sentence";
        console.log(`speaking "${message}"`);
        SpeechSynthesizer.text = message;
        window.speechSynthesis.speak(SpeechSynthesizer);
        dispatch(Request.Cursor_acknowledgeTransition());
      } else {
        console.log(`NOT speaking ${message}"`);
      }
    },
    [newSection, newSentence] // to recite just the words
  );
  useEffect(
    () => {
      if (listening) {
        message = "listening";
      } else {
        message = "not listening";
      }
      console.log(`speaking "${message}"`);
      SpeechSynthesizer.text = message;
      window.speechSynthesis.speak(SpeechSynthesizer);
    },
    [listening] // to recite just the words
  );
  return <div>{message}</div>;
};
export function speak(message: string) {
  let speechSynthesizer = new SpeechSynthesisUtterance();
  speechSynthesizer.text = message;
  window.speechSynthesis.speak(speechSynthesizer);
}
export const ReadItButton = () => {
  const pageContext: IPageContext = useContext(PageContext)!;
  const termIdx = useAppSelector(store => store.cursor_terminalIdx);
  let message = pageContext.terminalList[termIdx].content;
  let wordOnly = true;
  let entireSentence = false;
  let uptoWord = false;
  if (wordOnly) {
  }
  //  const listening = useAppSelector(store => store.listen_active);
  console.log(`readitbutton`);
  //const dispatch = useAppDispatch();
  return (
    <button className="readIt Button" onClick={() => speak(message)}>
      <img className="readButtonImg" alt="read it" />
    </button>
  );
};
