/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_dates.tsx
 *
 * Defines React front end functional components for date terminals.
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
import { useAppSelector } from "./hooks";
import { DateFormatEnumType, IDateTerminalMeta } from "./pageContentType";
import { TerminalNode, ITerminalPropsType } from "./reactcomp_terminals";

export const Terminal_Date = React.memo((props: ITerminalPropsType): any => {
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
