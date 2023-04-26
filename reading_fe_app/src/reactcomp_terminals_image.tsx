/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_terminal_image.tsx
 *
 * Defines React front end functional components.
 * renders imageClasses including ImageEntryImages
 *
 * Version history:
 *
 **/
import React, { useContext } from "react";

import { IImageTerminalMeta } from "./pageContentType";
import { ITerminalPropsType, TerminalImage } from "./reactcomp_terminals";
import { ISettingsContext, SettingsContext } from "./settingsContext";

export const TerminalImageEntry = React.memo(
  (props: ITerminalPropsType): any => {
    // FUTURE:image link to internal curriculum page link. Need to
    // emit <a href with path/link to destination.
    let imageInfo: IImageTerminalMeta = props.terminal
      .meta as IImageTerminalMeta;
    return (
      <TerminalImage
        active={props.active}
        class={imageInfo.className}
        imageInfo={imageInfo}
      />
    );
  }
);
