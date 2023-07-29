/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
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
  const terminalBlockClass: string = "terminal-block";
  let terminalTag: string = "link";
  let terminalBlockSubclass: string = `${terminalBlockClass}-${terminalTag}`;
  let terminalCssSubclass: string = "fillin-prompts-terminal";
  return (
    <>
      <div className={terminalBlockClass}>
        <div className={terminalBlockSubclass}>
          {linkInfo.label.map(
            (terminal: ITerminalContent, keyvalue: number) => (
              <TerminalDispatcher
                key={keyvalue}
                active={props.active}
                terminal={terminal}
                terminalCssSubclass={terminalCssSubclass}
                tagged={true}
              />
            )
          )}
        </div>
        {terminalTag.length > 0 && (
          <div className="terminal-block-tag">{terminalTag}</div>
        )}
      </div>
    </>
  );
});
