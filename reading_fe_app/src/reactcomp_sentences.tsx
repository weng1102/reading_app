/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_sentences.tsx
 *
 * Defines React front end functional components.
 *
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
import { CPageLists, PageContext } from "./pageContext";
import {
  ISentenceContent,
  ITerminalContent,
  SentenceListItemEnumType
} from "./pageContentType";
import {
  IModelingSettings,
  ISettingsContext,
  // RecitationMode,
  // RecitationListeningEnumType,
  // RecitationPositionEnumType,
  // RecitationScopeEnumType,
  SettingsContext
} from "./settingsContext";
import { TerminalDispatcher } from "./reactcomp_terminals";
import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
export interface ISentencePropsType {
  //  key: number;
  active: boolean;
  sentence: ISentenceContent;
  recitable: boolean;
}
export const Sentence = React.memo((props: ISentencePropsType) => {
  // const currentTerminalIdx: number = useAppSelector(
  //   store => store.cursor_terminalIdx
  // );
  // console.log(
  //   `<Sentence sentenceIdx=${props.sentence.id} active=${props.active} content=${props.sentence.content}>`
  // );
  // const pageContext: CPageLists = useContext(PageContext)!;
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  const currentSentIdx: number = useAppSelector(
    store => store.cursor_sentenceIdx
  );
  const obscuredSentIdx: number = useAppSelector(
    store => store.sentence_idxObscured
  );
  let sentenceClasses: string = "";

  if (props.sentence.id === obscuredSentIdx) {
    console.log(
      `obscuredIndex=${settingsContext.settings.modeling.obscuredTextDegree}`
    );
    sentenceClasses = `sentence sentence-obscured-${settingsContext.settings.modeling.obscuredTextDegree}`;
    console.log(
      `obscuredIndex=${settingsContext.settings.modeling.obscuredTextDegree} sentenceClassess=${sentenceClasses}`
    );
  } else {
    sentenceClasses = "sentence";
  }
  return (
    <>
      <span className={sentenceClasses}>
        {props.sentence.terminals.map(
          (terminal: ITerminalContent, keyvalue: number) => (
            <TerminalDispatcher
              key={keyvalue}
              active={props.active}
              terminal={terminal}
              terminalCssSubclass={""}
              tagged={false}
            />
          )
        )}
      </span>
    </>
  );
});
export interface ISentenceFormatPropsType {
  listFormat: any;
  children: any;
}
// export const SentenceFormat = React.memo((props: ISentenceFormatPropsType) => {
//   console.log(`<SentenceFormat> ${props.listFormat}`);
//   switch (props.listFormat) {
//     case "ul" || "ol":
//       return <li>{props.children}</li>;
//     default:
//       return <>{props.children}</>;
//   }
// });
