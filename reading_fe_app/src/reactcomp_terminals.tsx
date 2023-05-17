/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_terminals.tsx
 *
 * Defines React front end functional components for terminals.
 *
 * Terminals represent the group of words, punctuations, whitespace,
 * references, etc that can be rendered.
 * "Words" refer to terminals that where the current cursor can be active;
 * that terminals that are visible and recitable as opposed to punctuations,
 * whitespace and other syntactical sugar.
 *
 * Version history:
 *
 **/
import React from "react";
import CSS from "csstype";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector, useSpanRef } from "./hooks";
import { useContext, useEffect } from "react";

// is this really necessary if availablility is removed below
import {
  ITerminalContent,
  ITerminalInfo,
  IAcronymTerminalMeta,
  IImageTerminalMeta,
  INumeralsTerminalMeta,
  IPassthruTagTerminalMeta,
  TerminalMetaEnumType
} from "./pageContentType";
import { TerminalFillinContext } from "./fillinContext";
import { SectionFillinContext } from "./fillinContext";
import { TerminalDate } from "./reactcomp_terminals_dates";
import { TerminalEmailaddress } from "./reactcomp_terminals_emailaddress";
import { TerminalPhoneNumber } from "./reactcomp_terminals_phonenumbers";
import { TerminalImageEntry } from "./reactcomp_terminals_image";
import { TerminalLink } from "./reactcomp_terminals_link";
import { TerminalFillin } from "./reactcomp_terminals_fillin";
import { ISettingsContext, SettingsContext } from "./settingsContext";

export interface ITerminalPropsType {
  active: boolean;
  terminal: ITerminalContent;
}
export interface ITerminalInfoPropsType {
  active: boolean;
  terminalInfo: ITerminalInfo;
}
export const TerminalDispatcher = React.memo(
  (props: ITerminalPropsType): any => {
    const currentTerminalIdx = useAppSelector(
      store => store.cursor_terminalIdx
    );
    switch (props.terminal.type) {
      case TerminalMetaEnumType.acronym:
        return (
          <TerminalAcronym
            active={
              props.active &&
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
      case TerminalMetaEnumType.word:
      case TerminalMetaEnumType.numberwithcommas:
      case TerminalMetaEnumType.symbol:
        return (
          <TerminalWord
            active={
              props.active && currentTerminalIdx === props.terminal.firstTermIdx
            }
            terminal={props.terminal}
          />
        );
      case TerminalMetaEnumType.whitespace:
        return <TerminalWhitespace active={false} terminal={props.terminal} />;
      case TerminalMetaEnumType.currency:
        break;
      case TerminalMetaEnumType.date:
        return (
          <TerminalDate
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
      case TerminalMetaEnumType.emailaddress:
        return (
          <TerminalEmailaddress
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
      case TerminalMetaEnumType.fillin:
        return (
          <TerminalFillin
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
      case TerminalMetaEnumType.image:
        //active should be false regardless
        return (
          <TerminalImageEntry
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
      case TerminalMetaEnumType.link:
        return (
          <TerminalLink
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
      case TerminalMetaEnumType.numerals:
        return (
          <TerminalNumerals
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
        break;
      case TerminalMetaEnumType.phonenumber:
        return (
          <TerminalPhoneNumber
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
          />
        );
      case TerminalMetaEnumType.punctuation:
        return <TerminalWhitespace active={false} terminal={props.terminal} />;
      case TerminalMetaEnumType.tbd:
        break;
      case TerminalMetaEnumType.time:
        break;
      case TerminalMetaEnumType.token:
        break;
      case TerminalMetaEnumType.year:
        break;
      case TerminalMetaEnumType.passthruTag:
        return <TerminalPassthru active={false} terminal={props.terminal} />;
        break;
      default:
        return <>unknown terminal "{props.terminal.content}!"</>;
    }
  }
);
export const TerminalAcronym = React.memo((props: ITerminalPropsType): any => {
  //  console.log(`<Terminal_acronym> active=${props.active}`);
  // Rather not trigger dispatch via useSelector but necessary for all multiple
  // terminal words. Rerenders only when acronym is active theough
  const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx); // cause rerendering
  let acronym: IAcronymTerminalMeta = props.terminal
    .meta as IAcronymTerminalMeta;
  //  let active = props.active ? "active" : "";
  return (
    <>
      {acronym.letters.map((letter: ITerminalInfo, keyvalue: number) => (
        <TerminalNode
          key={keyvalue}
          class="acronym"
          active={props.active && currentTerminalIdx === letter.termIdx}
          terminalInfo={letter}
        />
      ))}
    </>
  ); // return
});
export const TerminalNumerals = React.memo((props: ITerminalPropsType): any => {
  const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx); // cause rerendering
  let number: INumeralsTerminalMeta = props.terminal
    .meta as INumeralsTerminalMeta;
  console.log(`numerals.length=${number.numerals.length}`);
  return (
    <>
      {number.numerals.map((numeral: ITerminalInfo, keyvalue: number) => (
        <TerminalNode
          key={keyvalue}
          class="numeral"
          active={props.active && currentTerminalIdx === numeral.termIdx}
          terminalInfo={numeral}
        />
      ))}
    </>
  ); // return
});
export const TerminalPassthru = React.memo((props: ITerminalPropsType): any => {
  let passthruInfo: IPassthruTagTerminalMeta = props.terminal
    .meta as IPassthruTagTerminalMeta;
  console.log(`unimplemented passthru=${passthruInfo.tag}`);
  return <></>;
});
export const TerminalWord = React.memo((props: ITerminalPropsType): any => {
  // console.log(
  //   `<TerminalWord active=${props.active} content=${props.terminal.content}/>`
  // );
  let wordInfo = props.terminal.meta as ITerminalInfo;
  return (
    <TerminalNode class="word" active={props.active} terminalInfo={wordInfo} />
  );
});
export const TerminalWhitespace = React.memo(
  (props: ITerminalPropsType): any => {
    // console.log(
    //   `<TerminalWhitespace props.active=${props.active} props.terminal=${props.terminal} content="${props.terminal.content}"/>`
    // );
    let terminalInfo = props.terminal.meta as ITerminalInfo;
    return (
      <TerminalNode
        class="whitespace"
        active={props.active}
        terminalInfo={terminalInfo}
      />
    );
  }
);
export interface ITerminalNodePropsType {
  class: string;
  active: boolean;
  terminalInfo: ITerminalInfo;
}
export const TerminalNode = React.memo((props: ITerminalNodePropsType): any => {
  let dispatch = useAppDispatch();
  //  const termRef = useSpanRef();
  const terminalRef = useSpanRef();
  const { terminalFillin, setTerminalFillin } = useContext(
    TerminalFillinContext
  );
  //const [attribute, setAttribute] = useState(false)
  const { sectionFillin, setSectionFillin } = useContext(SectionFillinContext);
  useEffect(() => {
    //    console.log(`<TerminalNode> useEffect() active, expecting scrollToView()`);
    /* Consider multiple scrollIntoView modes:
      interparagraph/section: scroll to top of new sectionName
      intraparagraph: scroll line-by-line until new section/paragraph
    */
    /*
    behavior (Optional) Defines the transition animation. One of auto or smooth. Defaults to auto.
    block (Optional) Defines vertical alignment. One of start, center, end, or nearest. Defaults to start.
    inline Optional Defines horizontal alignment. One of start, center, end, or nearest. Defaults to nearest.
*/
    if (props.active && terminalRef.current != null) {
      let rect = terminalRef.current.getBoundingClientRect();
      if (rect.top < 200 || rect.bottom > window.innerHeight) {
        //200 header height
        terminalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }
    }
  }, [props.active, terminalRef]);
  let hidden: string = "";
  // refactor the following
  if (
    terminalFillin.visible.length > 0 &&
    terminalFillin.visible.length - 1 <=
      props.terminalInfo.termIdx - terminalFillin.offsetIdx
  ) {
    let showResponseInPrompt: boolean =
      terminalFillin.visible[
        props.terminalInfo.termIdx - terminalFillin.offsetIdx
      ] || sectionFillin.currentHelpSetting.showResponsesInPrompts;
    hidden = !showResponseInPrompt ? ` fillin-prompts-terminal-hidden ` : "";
  }
  if (props.terminalInfo.recitable) {
    let attribute: string = `${
      props.terminalInfo.recitable ? "recitable-word" : ""
    } ${props.active ? "active" : ""} ${hidden}`;
    if (
      props.active &&
      props.terminalInfo.fillin.responseIdx >= 0 &&
      props.terminalInfo.fillin.sectionIdx >= 0
    ) {
      dispatch(Request.Fillin_setCurrent(props.terminalInfo.termIdx));
    }
    return (
      <span
        className={`${props.class} ${attribute}`}
        ref={terminalRef}
        onClick={() =>
          dispatch(Request.Cursor_gotoWordByIdx(props.terminalInfo.termIdx))
        }
      >
        {props.terminalInfo.content}
      </span>
    );
  } else if (props.class.length > 0) {
    return (
      <span className={`${props.class}`}>{props.terminalInfo.content}</span>
    );
  } else {
    return <span>{props.terminalInfo.content}</span>;
  }
});
export interface ITerminalImagePropsType {
  class: string;
  active: boolean;
  imageInfo: IImageTerminalMeta;
}
export const TerminalImage = React.memo(
  (props: ITerminalImagePropsType): any => {
    const dispatch = useAppDispatch();
    let settingsContext: ISettingsContext = useContext(
      SettingsContext
    ) as ISettingsContext;
    let distDir = settingsContext.settings.config.distDir;
    let path: string = `${distDir}/img/${props.imageInfo.src}`;
    console.log(`path=${path}`);
    let overlayImgSrc = `${distDir}/img/link_overlay.png`;
    console.log(`overlay=${overlayImgSrc}`);
    let overlayClass = `imageentry-image-link ${props.imageInfo.className}`;
    console.log(`overlayClass=${overlayClass}`);
    ///    let classNameWithOverlay = `${props.imageInfo.className} `;
    // imageInfo contains width/height that should not be used.
    console.log(
      `${props.imageInfo.src} image linkIdx=${props.imageInfo.linkIdx}`
    );
    if (props.imageInfo.linkIdx < 0) {
      return (
        <>
          <img
            className={props.imageInfo.className}
            src={path}
            alt={props.imageInfo.label}
          />
        </>
      );
    } else {
      return (
        <div className="image-link-overlay-container">
          <img
            className={props.imageInfo.className}
            src={path}
            alt={props.imageInfo.label}
            onClick={() =>
              dispatch(Request.Page_gotoLink(props.imageInfo.linkIdx))
            }
          />
          <img
            src={overlayImgSrc}
            className="image-link-overlay"
            onClick={() =>
              dispatch(Request.Page_gotoLink(props.imageInfo.linkIdx))
            }
          />
        </div>
      );
    }
  }
);
