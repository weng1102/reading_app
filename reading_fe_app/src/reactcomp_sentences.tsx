/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
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

import { ISentenceContent, ITerminalContent } from "./pageContentType";
import { TerminalDispatcher } from "./reactcomp_terminals";

export interface ISentencePropsType {
  //  key: number;
  active: boolean;
  sentence: ISentenceContent;
}
export const Sentence = React.memo((props: ISentencePropsType) => {
  // const currentTerminalIdx: number = useAppSelector(
  //   store => store.cursor_terminalIdx
  // );
  // console.log(
  //   `<Sentence1 sentenceIdx=${props.sentence.id} active=${props.active}>`
  // );
  return (
    <>
      <span className="sentence">
        {props.sentence.terminals.map(
          (terminal: ITerminalContent, keyvalue: number) => (
            <TerminalDispatcher
              key={keyvalue}
              active={props.active}
              terminal={terminal}
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
