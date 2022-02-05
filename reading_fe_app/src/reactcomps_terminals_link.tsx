/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
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
  ITerminalContent,
  ITerminalInfo,
  IImageTerminalMeta
} from "./pageContentType";
import { TerminalDispatcher } from "./reactcomps_terminals";
import { TerminalNode, ITerminalPropsType } from "./reactcomps_terminals";
import { ISettingsContext, SettingsContext } from "./settingsContext";
export const Terminal_Link = React.memo((props: ITerminalPropsType): any => {
  const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx); // causes rerendering
  let dispatch = useAppDispatch();
  let settingsContext: ISettingsContext = useContext(
    SettingsContext
  ) as ISettingsContext;
  let distDir = settingsContext.settings.config.distDir;
  console.log(
    `<Terminal_Link active=${props.active} content=${props.terminal.content}/>`
  );
  let linkInfo: ICurriculumLinkTerminalMeta = props.terminal
    .meta as ICurriculumLinkTerminalMeta;

  //  let path: string = `${distDir}/img/${linkInfo.src}`;
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
