/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_terminals_fillin.tsx
 *
 * Defines React front end functional components.
 * renders links
 *
 * Version history:
 *
 **/
import React, { useContext, useEffect, useState } from "react";
import {
  IFillinTerminalMeta,
  ITerminalContent,
  SectionFillinHelpPresetLevel
} from "./pageContentType";
import { SectionFillinContext } from "./fillinContext";
import { useAppSelector } from "./hooks";
import {
  cloneTerminalFillin,
  ITerminalFillinItem,
  ITerminalFillinItemInitializer,
  TerminalFillinContext
} from "./fillinContext";
import { TerminalDispatcher } from "./reactcomp_terminals";
import { ITerminalPropsType } from "./reactcomp_terminals";

export const TerminalFillin = React.memo((props: ITerminalPropsType): any => {
  const sectionFillinContext = useContext(SectionFillinContext);
  const [previousPreset, setPreviousReset] = useState(
    sectionFillinContext.sectionFillin.helpPresetLevel ===
      SectionFillinHelpPresetLevel.inline
  );
  const visibleResetFill: boolean = false;
  const visibleSetFill: boolean = true;
  // if (
  //   sectionFillinContext.sectionFillin.currentHelpSetting.showResponsesInPrompts
  // ) {
  //   visibleResetFill = true;
  // } else {
  //   visibleResetFill = false;
  // }
  const [terminalFillin, setTerminalFillin] = useState(
    ITerminalFillinItemInitializer(
      props.terminal.firstTermIdx,
      new Array(
        props.terminal.lastTermIdx - props.terminal.firstTermIdx + 1
      ).fill(visibleResetFill)
    )
  );
  // console.log(`offsetIdx=${terminalFillin.offsetIdx}`);
  // terminalFillin.visible.forEach(el => console.log(`visible=${el}`));
  // let temp: ITerminalFillinItem;
  // temp = ITerminalFillinItemInitializer(
  //   props.terminal.firstTermIdx,
  //   Array(props.terminal.lastTermIdx - props.terminal.firstTermIdx + 1).fill(
  //     visibleResetFill
  //   )
  // );
  // temp = {
  //   offsetIdx: props.terminal.firstTermIdx,
  //   visible: Array(
  //     props.terminal.lastTermIdx - props.terminal.firstTermIdx + 1
  //   ).fill(visibleResetFill)
  // };
  // setTerminalFillin(temp);
  let fillinContent: IFillinTerminalMeta = props.terminal
    .meta as IFillinTerminalMeta;
  const showTerminalIdx = useAppSelector(store => store.fillin_showTerminalIdx);
  let resetSectionFillinIdx = useAppSelector(
    store => store.fillin_resetSectionIdx
  );
  useEffect(() => {
    // console.log(`TerminalFillin: showTerminalFillinIdx=${showTerminalIdx}`);
    let relativeIdx = showTerminalIdx - terminalFillin.offsetIdx;
    if (relativeIdx >= 0 && relativeIdx < terminalFillin.visible.length) {
      // console.log(
      //   `TerminalFillin2: showTerminalFillinIdx found showTerminalIdx=${showTerminalIdx}`
      // );
      setTerminalFillin({
        ...terminalFillin,
        visible: { ...terminalFillin.visible, [relativeIdx]: visibleSetFill }
      });
    }
  }, [showTerminalIdx, terminalFillin]);

  useEffect(() => {
    // console.log(
    //   `TerminalFillin3: reset sectionFillinIdx=${resetSectionFillinIdx}`
    // );
    if (
      sectionFillinContext.sectionFillin.loaded &&
      sectionFillinContext.sectionFillin.modified &&
      resetSectionFillinIdx === fillinContent.sectionFillinIdx
    ) {
      // console.log(
      //   `TerminalFillin3.1: reset sectionFillinIdx=${resetSectionFillinIdx}`
      // );
      setTerminalFillin({
        ...terminalFillin,
        visible: new Array(
          props.terminal.lastTermIdx - props.terminal.firstTermIdx + 1
        ).fill(visibleResetFill)
      });
    }
  }, [
    resetSectionFillinIdx,
    terminalFillin,
    // fillinContent.sectionFillinIdx,
    props.terminal.firstTermIdx,
    props.terminal.lastTermIdx,
    sectionFillinContext.sectionFillin.loaded,
    sectionFillinContext.sectionFillin.modified,
    sectionFillinContext.sectionFillin.currentHelpSetting
      .showResponsesInPrompts,
    visibleResetFill
  ]);
  // useEffect(() => {
  //   console.log(`TerminalFillin5: preset changes`);
  //   // should have a separate showAll flag for sectionFillin while keeping
  //   // track of the correct visible state
  //   if (
  //     sectionFillinContext.sectionFillin.helpPresetLevel ===
  //     SectionFillinHelpPresetLevel.inline
  //   ) {
  //     console.log(`TerminalFillin5: preset changes to inline`);
  //     // setTerminalFillin({
  //     //   ...terminalFillin,
  //     //   visible: new Array(
  //     //     props.terminal.lastTermIdx - props.terminal.firstTermIdx + 1
  //     //   ).fill(visibleResetFill)
  //     // });
  //   } else {
  //     console.log(`TerminalFillin5: preset changes to NOT inline`);
  //   }
  // }, [sectionFillinContext.sectionFillin.helpPresetLevel]);

  let attributes = `fillin-prompts-terminal `;
  return (
    <TerminalFillinContext.Provider
      value={{ terminalFillin, setTerminalFillin }}
    >
      <span className={attributes}>
        {fillinContent.terminals.map(
          (terminal: ITerminalContent, keyvalue: number) => (
            <TerminalDispatcher
              key={keyvalue}
              active={props.active}
              terminal={terminal}
            />
          )
        )}
      </span>
    </TerminalFillinContext.Provider>
  );
});
