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
import React from "react";
import {
  ICurriculumLinkTerminalMeta,
  ITerminalContent
} from "./pageContentType";
import { TerminalDispatcher } from "./reactcomp_terminals";
import { ITerminalPropsType } from "./reactcomp_terminals";
export const TerminalLink = React.memo((props: ITerminalPropsType): any => {
  // const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx); // causes rerendering
  // console.log(
  //   `<TerminalLink active=${props.active} content=${props.terminal.content}/>`
  // );
  let linkInfo: ICurriculumLinkTerminalMeta = props.terminal
    .meta as ICurriculumLinkTerminalMeta;

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
