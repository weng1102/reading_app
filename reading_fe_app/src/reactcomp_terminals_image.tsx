/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_terminal_image.tsx
 *
 * Defines React front end functional components.
 * renders imageClasses
 *
 * Version history:
 *
 **/
import React, { useContext } from "react";
import { useAppSelector } from "./hooks";

import { ITerminalInfo, IImageTerminalMeta } from "./pageContentType";
import { TerminalNode, ITerminalPropsType } from "./reactcomps_terminals";
import { ISettingsContext, SettingsContext } from "./settingsContext";
export const Terminal_Image = React.memo((props: ITerminalPropsType): any => {
  const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx); // causes rerendering
  let settingsContext: ISettingsContext = useContext(
    SettingsContext
  ) as ISettingsContext;
  let distDir = settingsContext.settings.config.distDir;
  let imageInfo: IImageTerminalMeta = props.terminal.meta as IImageTerminalMeta;
  let path: string = `${distDir}/img/${imageInfo.src}`;
  let imageClasses: string = "imageentry-image " + imageInfo.className;
  return (
    <>
      <img className={imageClasses} src={path} alt={imageInfo.label} />
    </>
  );
});
