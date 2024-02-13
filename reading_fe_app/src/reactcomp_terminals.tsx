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
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector, useSpanRef } from "./hooks";
import { useContext, useEffect } from "react";

// is this really necessary if availablility is removed below
import {
  ITerminalContent,
  ITerminalInfo,
  IAcronymTerminalMeta,
  ICurrencyTerminalMeta,
  IImageTerminalMeta,
  INumeralsTerminalMeta,
  IPassthruTagTerminalMeta,
  PartOfSpeechEnumType,
  SectionFillinResponsesProgressionEnum,
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
import { PageContext } from "./pageContext";

export interface ITerminalPropsType {
  active: boolean;
  terminal: ITerminalContent;
  terminalCssSubclass: string;
  tagged: boolean;
  // terminalTag: {
  //   style: string
  //   label: string,
  // }
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
            terminalCssSubclass={""}
            tagged={false}
          />
        );
      case TerminalMetaEnumType.word:
      case TerminalMetaEnumType.numberwithcommas:
      case TerminalMetaEnumType.symbol:
        if (
          !props.tagged &&
          props.terminal.cues !== undefined &&
          props.terminal.cues.partOfSpeech.length > 0
        ) {
          return (
            <TerminalWord
              active={
                props.active &&
                currentTerminalIdx === props.terminal.firstTermIdx
              }
              terminal={props.terminal}
              terminalCssSubclass={props.terminalCssSubclass}
              tagged={props.tagged}
            />
          );
        } else {
          return (
            <TerminalWord
              active={
                props.active &&
                currentTerminalIdx === props.terminal.firstTermIdx
              }
              terminal={props.terminal}
              terminalCssSubclass={""}
              tagged={false}
            />
          );
        }
      case TerminalMetaEnumType.whitespace:
        return (
          <TerminalWhitespace
            active={false}
            terminal={props.terminal}
            terminalCssSubclass={""}
            tagged={false}
          />
        );
      case TerminalMetaEnumType.currency:
        return (
          <TerminalCurrency
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
            terminalCssSubclass={""}
            tagged={false}
          />
        );
      case TerminalMetaEnumType.date:
        return (
          <TerminalDate
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
            terminalCssSubclass={""}
            tagged={false}
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
            terminalCssSubclass={""}
            tagged={false}
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
            terminalCssSubclass={props.terminalCssSubclass}
            tagged={props.tagged}
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
            terminalCssSubclass={""}
            tagged={false}
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
            terminalCssSubclass={""}
            tagged={false}
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
            terminalCssSubclass={""}
            tagged={false}
          />
        );
      case TerminalMetaEnumType.phonenumber:
        return (
          <TerminalPhoneNumber
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            terminal={props.terminal}
            terminalCssSubclass={""}
            tagged={false}
          />
        );
      case TerminalMetaEnumType.punctuation:
        return (
          <TerminalWhitespace
            active={false}
            terminal={props.terminal}
            terminalCssSubclass={""}
            tagged={false}
          />
        );
      case TerminalMetaEnumType.tbd:
        break;
      case TerminalMetaEnumType.time:
        break;
      case TerminalMetaEnumType.token:
        break;
      case TerminalMetaEnumType.year:
        break;
      case TerminalMetaEnumType.passthruTag:
        return (
          <TerminalPassthru
            active={false}
            terminal={props.terminal}
            terminalCssSubclass={""}
            tagged={false}
          />
        );
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
export const TerminalCurrency = React.memo((props: ITerminalPropsType): any => {
  let termInfo: ICurrencyTerminalMeta = props.terminal
    .meta as ICurrencyTerminalMeta;
  console.log(
    `amount=${termInfo.amount.content} currency=${termInfo.currency.content}`
  );
  return (
    <TerminalNode
      active={props.active}
      class="currency"
      terminalInfo={termInfo.amount}
    />
  );
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
  const pageContext = useContext(PageContext);
  const fillinContext = useContext(SectionFillinContext);
  let tag: string = "";
  // show tag priority
  // 1) valid tag
  // 2) show tags inherited
  // 3) explicit fillin tag
  // 4) page tag
  if (
    props.terminal.cues !== undefined &&
    props.terminal.cues.partOfSpeech !== undefined &&
    props.terminal.cues.partOfSpeech !== PartOfSpeechEnumType.untagged
  ) {
    // valid tag
    if (props.tagged) {
      // show tag based on inherited
      tag = props.terminal.cues.partOfSpeech;
    } else if (fillinContext !== null && fillinContext.sectionFillin.idx >= 0) {
      if (fillinContext.sectionFillin.currentSetting.showPromptTags) {
        tag = props.terminal.cues.partOfSpeech;
      } else {
        // if !showPromptTag is explicit overrides page tag
      }
      // show tag based on  fillin
    } else if (
      pageContext !== null &&
      pageContext.showTags !== null &&
      pageContext.showTags
    ) {
      // show tag based on page
      console.log(`page tag=true`);
      tag = props.terminal.cues.partOfSpeech;
    } else {
      // do not show tag
    }
  } else {
  }
  let defaultTag: string = `word`;
  let terminalStyle: string = `terminal-block-word`;
  // console.log(`<TerminalWord> ${props.terminal.content}`);
  if (tag.length > 0) {
    return (
      <>
        <div className="terminal-block">
          <div className={props.terminalCssSubclass}>
            <TerminalNode
              class="word"
              active={props.active}
              terminalInfo={wordInfo}
            />
          </div>
          {tag.length > 0 && <div className="terminal-block-tag">{tag}</div>}
        </div>
      </>
    );
  } else {
    // no terminalTagging
    // console.log(
    //   `<<TerminalWord>> ${props.terminal.content}, ${showTerminalTag},  ${terminalTaggedAlready}, ${useDefaultTag}, ${partOfSpeechCueValid}, tag="${props.tagged}"`
    // );
    return (
      <TerminalNode
        class="word"
        active={props.active}
        terminalInfo={wordInfo}
      />
    );
    // } else if (showTerminalTag) {
    //   if (props.terminal.content === "meatballs") {
    //     console.log(
    //       `${props.terminal.content}.pos=${props.terminal.cues.partOfSpeech} ${unknownPartOfSpeechCue}`
    //     );
    //     return (
    //       <>
    //         <div className="terminal-block">
    //           <div className={terminalStyle}>
    //             <TerminalNode
    //               class="word"
    //               active={props.active}
    //               terminalInfo={wordInfo}
    //             />
    //           </div>
    //           <div className="terminal-block-tag">{props.terminalTag}</div>
    //         </div>
    //       </>
    //     );
    // // } else {
    // //   console.log(`<TerminalWord> ${props.terminal.content} (not meatballs)`);
    // // }
    // // terminalTag =
    // //   props.terminal.cues !== undefined ? props.terminal.cues.partOfSpeech : "";
    // console.log(`<<TerminalWord> ${props.terminal.content}`);
    //
    // let terminalTag: string =
    //   props.terminal.cues !== undefined &&
    //   props.terminal.cues.partOfSpeech !== undefined &&
    //   props.terminal.cues.partOfSpeech.length > 0
    //     ? props.terminal.cues.partOfSpeech
    //     : "";
    // //        let terminalStyle: string = `terminal-block-${props.terminalTag}`;
    // // let label: string = `${props.}`
    // return (
    //   <>
    //     <div className="terminal-block">
    //       <div className={terminalStyle}>
    //         <TerminalNode
    //           class="word"
    //           active={props.active}
    //           terminalInfo={wordInfo}
    //         />
    //       </div>
    //       <div className="terminal-block-terminalTag">{terminalTag}</div>
    //     </div>
    //   </>
    // );
  }
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
  // console.log(
  //   `${props.terminalInfo.content}: hidden0=${hidden}\ntermIdx=${props.terminalInfo.termIdx}\n terminalFillin.visible.length=${terminalFillin.visible.length}\noffsetIdx=${terminalFillin.offsetIdx} `
  // );
  if (
    terminalFillin.visible.length > 0 &&
    terminalFillin.visible.length - 1 <=
      props.terminalInfo.termIdx - terminalFillin.offsetIdx
  ) {
    // console.log(`inside ${props.terminalInfo.content}\n`);
    let showResponseInPrompt: boolean =
      terminalFillin.visible[
        props.terminalInfo.termIdx - terminalFillin.offsetIdx
      ] ||
      sectionFillin.currentSetting.showResponsesInPrompts ||
      sectionFillin.currentSetting.progressionOrder ===
        SectionFillinResponsesProgressionEnum.inline;
    hidden = !showResponseInPrompt
      ? `fillin-prompts-terminal-hidden showResponsesInPrompts=${sectionFillin.currentSetting.showResponsesInPrompts} showResponseInPrompt=${sectionFillin.currentSetting.showResponsesInPrompts}`
      : "";
  }
  // console.log(`${props.terminalInfo.content}: hidden1=${hidden} `);
  if (props.terminalInfo.recitable) {
    let attributes: string = `${
      props.terminalInfo.fillin.responseIdx >= 0
        ? " fillin-prompts-terminal "
        : ""
    } ${props.terminalInfo.recitable ? "recitable-word " : ""} ${
      props.active ? "active" : ""
    } ${hidden}`;
    // console.log(`attributes=${attributes}\n`);
    // console.log(`${props.terminalInfo.content}: hidden2=${hidden} `);
    if (
      props.active &&
      props.terminalInfo.fillin.responseIdx >= 0 &&
      props.terminalInfo.fillin.sectionIdx >= 0
    ) {
      dispatch(Request.Fillin_setCurrent(props.terminalInfo.termIdx));
    }
    // console.log(`${props.terminalInfo.content}: hidden3=${hidden} `);
    return (
      <span
        className={`${props.class} ${attributes}`}
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
    let overlayImgSrc = `${distDir}/img/link_overlay_white.png`;
    let overlayClass = `imageentry-image-link ${props.imageInfo.className}`;
    let hasDimensions = props.imageInfo.width > 0 && props.imageInfo.height > 0;
    let hasLink = props.imageInfo.linkIdx >= 0;
    let classNameString = `${props.imageInfo.className}`;
    let fileType: string | undefined = props.imageInfo.src.split(".").pop();
    if (fileType !== undefined && fileType.toLowerCase() === "png") {
      classNameString = `${props.imageInfo.className}-png`;
    } else {
      classNameString = props.imageInfo.className;
    }
    console.log(` src=${props.imageInfo.src}`);

    if (hasLink) {
      console.log(
        `hasLink width=${props.imageInfo.width},height=${props.imageInfo.height}`
      );
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
    } else if (hasDimensions) {
      console.log(
        `hasDim width=${props.imageInfo.width},height=${props.imageInfo.height}`
      );
      return (
        <>
          <img
            className={classNameString}
            src={path}
            alt={props.imageInfo.label}
            width={props.imageInfo.width.toString()}
            height={props.imageInfo.height.toString()}
          />
        </>
      );
    } else {
      console.log(
        `neither width=${props.imageInfo.width},height=${props.imageInfo.height}`
      );
      return (
        <>
          <img
            className={classNameString}
            src={path}
            alt={props.imageInfo.label}
          />
        </>
      );
    }
  }
);
