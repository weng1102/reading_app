/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_terminal_recitebutton.tsx
 *
 * Defines React front end functional components.
 * renders links
 *
 * Version history:
 *
 **/
import React, { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { Request } from "./reducers";
import {
  IReciteButtonTerminalMeta
  //  ITerminalContent
} from "./pageContentType";
import { TerminalDispatcher } from "./reactcomp_terminals";
import { ITerminalPropsType } from "./reactcomp_terminals";
import { ISettingsContext, SettingsContext } from "./settingsContext";
export const TerminalReciteButton = React.memo(
  (props: ITerminalPropsType): any => {
    let buttonInfo: IReciteButtonTerminalMeta = props.terminal
      .meta as IReciteButtonTerminalMeta;
    let settingsContext: ISettingsContext = useContext(
      SettingsContext
    ) as ISettingsContext;
    const dispatch = useAppDispatch();
    const buttonIdx = useAppSelector(store => store.inlinebutton_idx);
    useEffect(() => {
      console.log(`buttonIdx: ${buttonIdx}`);
      dispatch(Request.Message_set(`buttonIdx: ${buttonIdx}`));
    }, [buttonIdx]);

    let distDir = settingsContext.settings.config.distDir;
    let imgSpec: string = `${distDir}/img/${buttonInfo.image}`;
    const terminalBlockClass: string = "terminal-block";
    const onButtonClick = () => {
      dispatch(Request.InlineButton_clicked(buttonInfo.buttonIdx));
    };
    return (
      <>
        <span className="recite-button-container" onClick={onButtonClick}>
          <div className="recite-button-image">
            <img className="icon" src={imgSpec} />
          </div>
          <div className="recite-button-text">{buttonInfo.label}</div>
        </span>
      </>
    );
  }
);
