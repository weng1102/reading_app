/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
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
import { IFillinTerminalMeta, ITerminalContent } from "./pageContentType";
import { SectionFillinContext } from "./fillinContext";
import { useAppSelector } from "./hooks";
import { ITerminalFillinItem, TerminalFillinContext } from "./fillinContext";
import { TerminalDispatcher } from "./reactcomp_terminals";
import { ITerminalPropsType } from "./reactcomp_terminals";

export const TerminalFillin = React.memo((props: ITerminalPropsType): any => {
  const sectionFillinContext = useContext(SectionFillinContext);
  let visibleResetFill: boolean;
  if (sectionFillinContext.sectionFillin.showPrompts) {
    visibleResetFill = true;
  } else {
    visibleResetFill = false;
  }
  const [terminalFillin, setTerminalFillin] = useState<ITerminalFillinItem>({
    offsetIdx: props.terminal.firstTermIdx,
    visible: Array(
      props.terminal.lastTermIdx - props.terminal.firstTermIdx + 1
    ).fill(visibleResetFill)
  });
  let fillinInfo: IFillinTerminalMeta = props.terminal
    .meta as IFillinTerminalMeta;
  console.log(
    `<TerminalFillin active=${props.active} content=${props.terminal.content}/>`
  );
  const showTerminalIdx = useAppSelector(store => store.fillin_showTerminalIdx);
  let resetSectionFillinIdx = useAppSelector(
    store => store.fillin_resetSectionIdx
  );
  useEffect(() => {
    console.log(`TerminalFillin: showTerminalFillinIdx=${showTerminalIdx}`);
    let relativeIdx = showTerminalIdx - terminalFillin.offsetIdx;
    if (relativeIdx >= 0 && relativeIdx < terminalFillin.visible.length) {
      console.log(
        `TerminalFillin: showTerminalFillinIdx found ${showTerminalIdx}`
      );
      setTerminalFillin({
        ...terminalFillin,
        visible: { ...terminalFillin.visible, [relativeIdx]: true }
      });
    }
  }, [showTerminalIdx, terminalFillin]);
  useEffect(() => {
    if (
      sectionFillinContext.sectionFillin.loaded &&
      sectionFillinContext.sectionFillin.modified &&
      resetSectionFillinIdx === fillinInfo.sectionFillinIdx
    ) {
      console.log(
        `TerminalFillin: reset sectionFillinIdx=${resetSectionFillinIdx}`
      );
      setTerminalFillin({
        ...terminalFillin,
        visible: Array(
          props.terminal.lastTermIdx - props.terminal.firstTermIdx + 1
        ).fill(visibleResetFill)
      });
    }
  }, [
    resetSectionFillinIdx,
    terminalFillin,
    fillinInfo.sectionFillinIdx,
    props.terminal.firstTermIdx,
    props.terminal.lastTermIdx,
    sectionFillinContext.sectionFillin.loaded,
    sectionFillinContext.sectionFillin.modified,
    visibleResetFill
  ]);

  let attributes = `fillin-prompts-terminal `;
  return (
    <TerminalFillinContext.Provider
      value={{ terminalFillin, setTerminalFillin }}
    >
      <span className={attributes}>
        {fillinInfo.terminals.map(
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
