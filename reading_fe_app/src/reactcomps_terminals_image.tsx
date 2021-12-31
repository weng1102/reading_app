/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_terminal_image.tsx
 *
 * Defines React front end functional components.
 * renders US phone numbers
 *
 * Version history:
 *
 **/
import React from "react";
import { useAppSelector } from "./hooks";

import { ITerminalInfo, IImageTerminalMeta } from "./pageContentType";
import { TerminalNode, ITerminalPropsType } from "./reactcomps_terminals";

export const Terminal_Image = React.memo((props: ITerminalPropsType): any => {
  const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx); // causes rerendering
  console.log(
    `<Terminal_Image active=${props.active} content=${props.terminal.content}/>`
  );
  let imageInfo: IImageTerminalMeta = props.terminal.meta as IImageTerminalMeta;
  let path: string = `https://weng1102.github.io/reading_app/dist/img/${imageInfo.src}`;
  return (
    <>
      <img className="image" src={path} alt={imageInfo.label} />
    </>
  );
});
