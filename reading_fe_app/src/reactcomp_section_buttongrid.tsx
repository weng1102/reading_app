/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_section_buttongrid.tsx
 *
 * Defines React front end functional components to support button grid feature.
 *
 * - static presentation data is stored in props
 * - presentation formatting data stored in local state
 *    e.g., show/hide reset, show/hide help control
 * - dynamic presentation data is stored in context e.g., responses in
 *   prompts visible
 *
 *
 * Version history:
 *
 **/
import React from "react";
// import { Request } from "./reducers";
// import { useEffect } from "react";
//import "./App.css";
import {
  IInlineButtonTerminalMeta,
  ITerminalContent,
  // ISectionFillinVariant,
  ISectionButtonGridVariant
} from "./pageContentType";
import { TerminalInlineButton } from "./reactcomp_terminals_inlinebutton";
// import { CPageLists, PageContext } from "./pageContext";
import { SectionDispatcher, ISectionPropsType } from "./reactcomp_sections";

export const SectionButtonGrid = React.memo((props: ISectionPropsType): any => {
  let buttonGrid: ISectionButtonGridVariant = props.section
    .meta as ISectionButtonGridVariant;
  const groupedByButtons = (buttons: ITerminalContent[]) => {
    const groupedByMap = new Map();
    buttons.forEach(button =>
      !groupedByMap.has(button.content[0].toLowerCase())
        ? groupedByMap.set(button.content[0].toLowerCase(), [button])
        : groupedByMap.get(button.content[0].toLowerCase()).push(button)
    );
    return Array.from(groupedByMap);
  };
  // let groupIndex: number = 0;
  if (buttonGrid.groupedBy) {
    return (
      <div>
        {groupedByButtons(buttonGrid.buttons).map(
          ([key, buttons], keyValueGrouped) => {
            return (
              <div key={keyValueGrouped}>
                <div className="buttongrid-groupedby-subheading">
                  {key.toUpperCase()}
                </div>
                <div
                  className="buttongrid"
                  style={{
                    gridTemplateColumns: `repeat(${buttonGrid.columnCount}, 1fr)`
                  }}
                >
                  {buttons.map((button: ITerminalContent, keyValue: number) => (
                    <TerminalInlineButton
                      key={keyValue}
                      tagged={false}
                      active={false}
                      terminalCssSubclass={
                        (button.meta as IInlineButtonTerminalMeta).attributes
                      }
                      terminal={button}
                    />
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>
    );
  } else {
    //    let css: string = "";
    return (
      <>
        <div
          className="buttongrid"
          style={{
            gridTemplateColumns: `repeat(${buttonGrid.columnCount}, 1fr)`
          }}
        >
          {buttonGrid.buttons.map((button, keyValue: number) => (
            <TerminalInlineButton
              key={keyValue}
              tagged={false}
              active={false}
              terminalCssSubclass={
                (button.meta as IInlineButtonTerminalMeta).attributes
              }
              terminal={button}
            />
          ))}
        </div>
      </>
    );
  }
});
