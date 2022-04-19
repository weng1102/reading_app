/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_terminals.tsx
 *
 * Defines React front end functional components for terminals.
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
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector, useSpanRef } from "./hooks";
import { useEffect } from "react";

// is this really necessary if availablility is removed below
import {
  ITerminalContent,
  ITerminalInfo,
  IAcronymTerminalMeta,
  TerminalMetaEnumType
} from "./pageContentType";

import { Terminal_Date } from "./reactcomp_terminals_dates";
import { Terminal_Emailaddress } from "./reactcomp_terminals_emailaddress";
import { Terminal_PhoneNumber } from "./reactcomp_terminals_phonenumbers";
import { Terminal_Image } from "./reactcomp_terminals_image";
import { Terminal_Link } from "./reactcomp_terminals_link";

export interface ITerminalPropsType {
  active: boolean;
  terminal: ITerminalContent;
}
export interface ITerminalInfoPropsType {
  active: boolean;
  terminalInfo: ITerminalInfo;
}
export const TerminalDispatcher = React.memo(
  (props: ITerminalPropsType): any => {
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
            active={
              props.active &&
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
        break;
      case TerminalMetaEnumType.word:
      case TerminalMetaEnumType.symbol:
        return (
          <Terminal_Word
            active={
              props.active && currentTerminalIdx === props.terminal.firstTermIdx
            }
            terminal={props.terminal}
          />
        );
        break;
      case TerminalMetaEnumType.whitespace:
        return <Terminal_Whitespace active={false} terminal={props.terminal} />;
        break;
      case TerminalMetaEnumType.currency:
        break;
      case TerminalMetaEnumType.date:
        return (
          <Terminal_Date
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
        break;
      case TerminalMetaEnumType.emailaddress:
        return (
          <Terminal_Emailaddress
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
        break;
      case TerminalMetaEnumType.image:
        //active should be false regardless
        return (
          <Terminal_Image
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
        break;
      case TerminalMetaEnumType.link:
        return (
          <Terminal_Link
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
        break;
      case TerminalMetaEnumType.numberwithcommas:
        break;
      case TerminalMetaEnumType.phonenumber:
        return (
          <Terminal_PhoneNumber
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
        break;
      case TerminalMetaEnumType.punctuation:
        return <Terminal_Whitespace active={false} terminal={props.terminal} />;
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
        return <>unknown terminal "{props.terminal.content}"</>;
        break;
    }
  }
);
export const Terminal_Acronym = React.memo((props: ITerminalPropsType): any => {
  //  console.log(`<Terminal_acronym> active=${props.active}`);
  // Rather not trigger dispatch via useSelector but necessary for all multiple terminal words
  // Rerenders only when acronym is active theough
  const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx); // cause rerendering
  let acronym: IAcronymTerminalMeta = props.terminal
    .meta as IAcronymTerminalMeta;
  //  let active = props.active ? "active" : "";
  return (
    <>
      {acronym.letters.map((letter: ITerminalInfo, keyvalue: number) => (
        <TerminalNode
          key={keyvalue}
          class="acronym"
          active={props.active && currentTerminalIdx === letter.termIdx}
          terminalInfo={letter}
        />
      ))}
    </>
  ); // return
});
export const Terminal_Word = React.memo((props: ITerminalPropsType): any => {
  // console.log(
  //   `<Terminal_word active=${props.active} content=${props.terminal.content}/>`
  // );
  let wordInfo = props.terminal.meta as ITerminalInfo;
  return (
    <TerminalNode class="word" active={props.active} terminalInfo={wordInfo} />
  );
});
export const Terminal_Whitespace = React.memo(
  (props: ITerminalPropsType): any => {
    // console.log(
    //   `<Terminal_whitespace props.active=${props.active} props.terminal=${props.terminal} content="${props.terminal.content}"/>`
    // );
    let terminalInfo = props.terminal.meta as ITerminalInfo;
    return (
      <TerminalNode
        class="whitespace"
        active={props.active}
        terminalInfo={terminalInfo}
      />
    );
  }
);
export interface ITerminalNodePropsType {
  class: string;
  active: boolean;
  terminalInfo: ITerminalInfo;
}
export const TerminalNode = React.memo((props: ITerminalNodePropsType): any => {
  let dispatch = useAppDispatch();
  //  const termRef = useSpanRef();
  const terminalRef = useSpanRef();
  useEffect(() => {
    //    console.log(`<TerminalNode> useEffect() active, expecting scrollToView()`);
    /* Consider multiple scrollIntoView modes:
      interparagraph/section: scroll to top of new sectionName
      intraparagraph: scroll line-by-line until new section/paragraph
    */
    /*
    behavior (Optional) Defines the transition animation. One of auto or smooth. Defaults to auto.
    block (Optional) Defines vertical alignment. One of start, center, end, or nearest. Defaults to start.
    inline Optional Defines horizontal alignment. One of start, center, end, or nearest. Defaults to nearest.
*/
    if (props.active && terminalRef.current != null) {
      let rect = terminalRef.current.getBoundingClientRect();
      if (rect.top < 200 || rect.bottom > window.innerHeight) {
        //200 header height
        terminalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }
    }
  }, [props.active]);
  // refactor the following
  if (props.terminalInfo.recitable) {
    let attribute: string = `${
      props.terminalInfo.recitable ? "recitable-word" : ""
    } ${props.active ? "active" : ""}`;
    return (
      <span
        className={`${props.class} ${attribute}`}
        ref={terminalRef}
        onClick={() =>
          dispatch(Request.Cursor_gotoWordByIdx(props.terminalInfo.termIdx))
        }
      >
        {props.terminalInfo.content}
      </span>
    );
  } else if (props.class.length > 0) {
    return (
      <span className={`${props.class}`}>{props.terminalInfo.content}</span>
    );
  } else {
    return <span>{props.terminalInfo.content}</span>;
  }
});
