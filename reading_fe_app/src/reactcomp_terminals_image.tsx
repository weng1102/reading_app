/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
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

import { IImageTerminalMeta } from "./pageContentType";
import { ITerminalPropsType } from "./reactcomp_terminals";
import { ISettingsContext, SettingsContext } from "./settingsContext";
export const Terminal_Image = React.memo((props: ITerminalPropsType): any => {
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
