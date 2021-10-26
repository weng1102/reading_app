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
  DateFormatEnumType,
  IPageContent,
  IHeadingListItem,
  ISectionContent,
  ISentenceContent,
  ITerminalContent,
  ITerminalInfo,
  IAcronymTerminalMeta,
  IDateTerminalMeta,
  ISectionHeadingVariant,
  IWordTerminalMeta,
  TerminalMetaEnumType
} from "./pageContentType";
import { IPageContext, PageContext, PageContextInitializer } from "./termnodes";
import {
  TerminalNode,
  ITerminalPropsType,
  ITerminalNodePropsType
} from "./reactcomps_terminals";
// import { NavBar } from "./reactcomp_navbar";
// import { PageHeader } from "./reactcomp_pageheader";
// import { Settings } from "./reactcomp_settings";

export const Terminal_Date = React.memo((props: ITerminalPropsType): any => {
  //   const terminalRef = useSpanRef();
  //   useEffect(() => {
  //     console.log(`<Terminal Date> useEffect() active, expecting scrollToView()`);
  //     /* Consider multiple scrollIntoView modes:
  //       interparagraph/section: scroll to top of new sectionName
  //       intraparagraph: scroll lin-by-line until new section/paragraph
  //     */
  //     /*
  //     behavior (Optional) Defines the transition animation. One of auto or smooth. Defaults to auto.
  //     block (Optional) Defines vertical alignment. One of start, center, end, or nearest. Defaults to start.
  //     inline Optional Defines horizontal alignment. One of start, center, end, or nearest. Defaults to nearest.
  // */
  //     // this scrolling should be in a separate function called after any component renders?
  //     if (terminalRef.current != null) {
  //       let rect = terminalRef.current.getBoundingClientRect();
  //       if (rect.top < 200 || rect.bottom > window.innerHeight) {
  //         terminalRef.current.scrollIntoView({
  //           behavior: "smooth",
  //           block: "start",
  //           inline: "nearest"
  //         });
  //       }
  //     }
  //   }, [props.active]);
  const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx); // cause rerendering
  console.log(
    `<Terminal_date active=${props.active} content=${props.terminal.content}/>`
  );
  let dateInfo = props.terminal.meta as IDateTerminalMeta;
  switch (dateInfo.format) {
    case DateFormatEnumType.date1: {
      return (
        <>
          <TerminalNode
            class="date.day"
            active={currentTerminalIdx === dateInfo.day.termIdx}
            terminalInfo={dateInfo.day}
          />
          <TerminalNode
            class="whitespace"
            active={false}
            terminalInfo={dateInfo.whitespace1}
          />
          <TerminalNode
            class="date.month"
            active={currentTerminalIdx === dateInfo.month.termIdx}
            terminalInfo={dateInfo.month}
          />
          <TerminalNode
            class="whitespace"
            active={false}
            terminalInfo={dateInfo.whitespace2}
          />
          <TerminalNode
            class="date.year-century"
            active={currentTerminalIdx === dateInfo.year.century.termIdx}
            terminalInfo={dateInfo.year.century}
          />
          <TerminalNode
            class="date.within-century"
            active={currentTerminalIdx === dateInfo.year.withinCentury.termIdx}
            terminalInfo={dateInfo.year.withinCentury}
          />
        </>
      );
    }
    case DateFormatEnumType.date2: {
      return (
        <>
          <TerminalNode
            class="date.month"
            active={currentTerminalIdx === dateInfo.month.termIdx}
            terminalInfo={dateInfo.month}
          />
          <TerminalNode
            class="punctuation"
            active={false}
            terminalInfo={dateInfo.punctuation1}
          />
          <TerminalNode
            class="whitespace"
            active={false}
            terminalInfo={dateInfo.whitespace1}
          />
          <TerminalNode
            class="date.day"
            active={currentTerminalIdx === dateInfo.day.termIdx}
            terminalInfo={dateInfo.day}
          />
          <TerminalNode
            class="punctuation"
            active={false}
            terminalInfo={dateInfo.punctuation2}
          />
          <TerminalNode
            class="whitespace"
            active={false}
            terminalInfo={dateInfo.whitespace2}
          />
          <TerminalNode
            class="date.year-century"
            active={currentTerminalIdx === dateInfo.year.century.termIdx}
            terminalInfo={dateInfo.year.century}
          />
          <TerminalNode
            class="date.within-century"
            active={currentTerminalIdx === dateInfo.year.withinCentury.termIdx}
            terminalInfo={dateInfo.year.withinCentury}
          />
        </>
      );
    }
    case DateFormatEnumType.date3: {
      return (
        <>
          <TerminalNode
            class="date.month"
            active={currentTerminalIdx === dateInfo.month.termIdx}
            terminalInfo={dateInfo.month}
          />
          <TerminalNode
            class="punctuation"
            active={false}
            terminalInfo={dateInfo.punctuation1}
          />
          <TerminalNode
            class="whitespace"
            active={false}
            terminalInfo={dateInfo.whitespace1}
          />
          <TerminalNode
            class="date.day"
            active={currentTerminalIdx === dateInfo.day.termIdx}
            terminalInfo={dateInfo.day}
          />
        </>
      );
    }
    default:
      return <span>{props.terminal.content}</span>;
  }
});
