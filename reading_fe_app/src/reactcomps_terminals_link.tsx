/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_terminal_link.tsx
 *
 * Defines React front end functional components.
 * renders links
 *
 * Version history:
 *
 **/
import React, { useContext } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { Request } from "./reducers";
import {
  ICurriculumLinkTerminalMeta,
  ITerminalContent
} from "./pageContentType";
import { TerminalDispatcher } from "./reactcomps_terminals";
import { ITerminalPropsType } from "./reactcomps_terminals";
export const Terminal_Link = React.memo((props: ITerminalPropsType): any => {
  // const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx); // causes rerendering
  console.log(
    `<Terminal_Link active=${props.active} content=${props.terminal.content}/>`
  );
  let linkInfo: ICurriculumLinkTerminalMeta = props.terminal
    .meta as ICurriculumLinkTerminalMeta;

  let linkClasses: string = "link-label" + linkInfo.className;
  return (
    <>
      <span className="link-label">
        {linkInfo.label.map((terminal: ITerminalContent, keyvalue: number) => (
          <TerminalDispatcher
            key={keyvalue}
            active={props.active}
            terminal={terminal}
          />
        ))}
      </span>
    </>
  );
});
<></>;
