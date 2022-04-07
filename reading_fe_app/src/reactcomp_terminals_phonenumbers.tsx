/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_terminal_emailaddress.tsx
 *
 * Defines React front end functional components.
 * renders US phone numbers
 *
 * Version history:
 *
 **/
import React from "react";
import { useAppSelector } from "./hooks";

import { ITerminalInfo, IPhoneNumberTerminalMeta } from "./pageContentType";
import { TerminalNode, ITerminalPropsType } from "./reactcomp_terminals";

export const Terminal_PhoneNumber = React.memo(
  (props: ITerminalPropsType): any => {
    const currentTerminalIdx = useAppSelector(
      store => store.cursor_terminalIdx
    ); // causes rerendering
    console.log(
      `<Terminal_PhoneNumber active=${props.active} content=${props.terminal.content}/>`
    );
    let phoneInfo: IPhoneNumberTerminalMeta = props.terminal
      .meta as IPhoneNumberTerminalMeta;
    return (
      <>
        <TerminalNode
          class="phonenumber-areacode"
          active={false}
          terminalInfo={phoneInfo.openBracket}
        />
        {phoneInfo.areaCode.map((part: ITerminalInfo, keyvalue: number) => (
          <TerminalNode
            key={keyvalue}
            class="phonenumber-areacode"
            active={props.active && currentTerminalIdx === part.termIdx}
            terminalInfo={part}
          />
        ))}
        <TerminalNode
          class="phonenumber-areacode"
          active={false}
          terminalInfo={phoneInfo.closeBracket}
        />
        <TerminalNode
          class="phonenumber-separator"
          active={false}
          terminalInfo={phoneInfo.separator1}
        />
        {phoneInfo.exchangeCode.map((part: ITerminalInfo, keyvalue: number) => (
          <TerminalNode
            key={keyvalue}
            class="phonenumber-exchange"
            active={props.active && currentTerminalIdx === part.termIdx}
            terminalInfo={part}
          />
        ))}
        <TerminalNode
          class="phonenumber-separator"
          active={false}
          terminalInfo={phoneInfo.separator2}
        />
        {phoneInfo.lineNumber.map((part: ITerminalInfo, keyvalue: number) => (
          <TerminalNode
            key={keyvalue}
            class="phonenumber-line"
            active={props.active && currentTerminalIdx === part.termIdx}
            terminalInfo={part}
          />
        ))}
      </>
    );
  }
);
