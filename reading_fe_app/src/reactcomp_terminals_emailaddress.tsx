/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_terminal_emailaddress.tsx
 *
 * Defines React front end functional components.
 * renders emailaddress
 *
 * Version history:
 *
 **/
import React from "react";
// import "./App.css";
import { useAppSelector } from "./hooks";

import { ITerminalInfo, IEmailAddressTerminalMeta } from "./pageContentType";
import { TerminalNode, ITerminalPropsType } from "./reactcomp_terminals";

export const Terminal_Emailaddress = React.memo(
  (props: ITerminalPropsType): any => {
    const currentTerminalIdx = useAppSelector(
      store => store.cursor_terminalIdx
    ); // causes rerendering
    console.log(
      `<Terminal_Emailaddress active=${props.active} content=${props.terminal.content}/>`
    );
    let emailInfo: IEmailAddressTerminalMeta = props.terminal
      .meta as IEmailAddressTerminalMeta;
    return (
      <>
        {emailInfo.userName.map((part: ITerminalInfo, keyvalue: number) => (
          <TerminalNode
            key={keyvalue}
            class="email-userName-part"
            active={props.active && currentTerminalIdx === part.termIdx}
            terminalInfo={part}
          />
        ))}
        <TerminalNode
          class="email-separator"
          active={
            props.active && currentTerminalIdx === emailInfo.separator.termIdx
          }
          terminalInfo={emailInfo.separator}
        />
        {emailInfo.domainName.map((part: ITerminalInfo, keyvalue: number) => (
          <TerminalNode
            key={keyvalue}
            class="email-domainName-part"
            active={props.active && currentTerminalIdx === part.termIdx}
            terminalInfo={part}
          />
        ))}
      </>
    );
  }
);
