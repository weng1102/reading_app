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
import {
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect
} from "react";

// is this really necessary if availablility is removed below
import {
  ITerminalContent,
  ITerminalInfo,
  IAcronymTerminalMeta,
  ICurrencyTerminalMeta,
  ImageEntryOrientationEnumType,
  IImageTerminalMeta,
  INumeralsTerminalMeta,
  IPassthruTagTerminalMeta,
  PartOfSpeechEnumType,
  SectionFillinResponsesProgressionEnum,
  TerminalMetaEnumType
} from "./pageContentType";
import { SectionFillinContext } from "./fillinContext";
import { TerminalDate } from "./reactcomp_terminals_dates";
import { TerminalFillin } from "./reactcomp_terminals_fillin";
import { TerminalFillinContext } from "./fillinContext";
import { TerminalEmailaddress } from "./reactcomp_terminals_emailaddress";
import { TerminalImageEntry } from "./reactcomp_terminals_image";
import { TerminalLink } from "./reactcomp_terminals_link";
import { TerminalPhoneNumber } from "./reactcomp_terminals_phonenumbers";
import { TerminalInlineButton } from "./reactcomp_terminals_inlinebutton";
import { ISettingsContext, SettingsContext } from "./settingsContext";
import { PageContext } from "./pageContext";

export interface ITerminalPropsType {
  active: boolean;
  terminal: ITerminalContent;
  terminalCssSubclass: string;
  tagged: boolean;
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
            key={props.terminal.id}
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
              key={props.terminal.termIdx}
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
              key={props.terminal.termIdx}
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
            key={props.terminal.termIdx}
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
            key={props.terminal.termIdx}
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
            key={props.terminal.termIdx}
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
            key={props.terminal.termIdx}
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
            key={props.terminal.termIdx}
            terminal={props.terminal}
            terminalCssSubclass={props.terminalCssSubclass}
            tagged={props.tagged}
          />
        );
      case TerminalMetaEnumType.image:
        //active should be false regardless
        // kludgy
        // const undefinedItem: () => void | undefined = undefined!;
        return (
          <TerminalImageEntry
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            key={props.terminal.termIdx}
            terminal={props.terminal}
            terminalCssSubclass={""}
            tagged={false}
            // onLoad={undefinedItem}
          />
        );
      case TerminalMetaEnumType.link:
        return (
          <TerminalLink
            active={
              currentTerminalIdx >= props.terminal.firstTermIdx &&
              currentTerminalIdx <= props.terminal.lastTermIdx
            }
            key={props.terminal.termIdx}
            terminal={props.terminal}
            terminalCssSubclass={""}
            tagged={false}
          />
        );
      case TerminalMetaEnumType.inlinebutton:
        return (
          <TerminalInlineButton
            active={false}
            key={props.terminal.termIdx}
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
            key={props.terminal.termIdx}
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
            key={props.terminal.termIdx}
            terminal={props.terminal}
            terminalCssSubclass={""}
            tagged={false}
          />
        );
      case TerminalMetaEnumType.punctuation:
        return (
          <TerminalWhitespace
            active={false}
            key={props.terminal.termIdx}
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
            key={props.terminal.termIdx}
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
  // const [boundingBoxBottom, setBoundingBoxBottom] = useState(0);
  // const [scrollIntoView, setScrollIntoView] = useState(false);
  // useEffect(() => {
  //   console.log(`<TerminalNode> scrollIntoView=${scrollIntoView}`);
  //   if (scrollIntoView) {
  //     if (terminalRef.current !== null) {
  //       let rect = terminalRef.current.getBoundingClientRect();
  //       console.log(`<TerminalNode> after scroll top=${rect.top}`);
  //       console.log(`<TerminalNode> after scroll y=${rect.y}`);
  //       // dispatch(Request.Page_autoScrolled(rect.top));
  //       setScrollIntoView(false);
  //     }
  //   }
  // }, [scrollIntoView]);
  useLayoutEffect(() => {
    /* Consider multiple scrollIntoView modes:
      interparagraph/section: scroll to top of new sectionName
      intraparagraph: scroll line-by-line until new section/paragraph
    */
    /*
    behavior (Optional) Defines the transition animation. One of auto or smooth. Defaults to auto.
    block (Optional) Defines vertical alignment. One of start, center, end, or nearest. Defaults to start.
    inline Optional Defines horizontal alignment. One of start, center, end, or nearest. Defaults to nearest.
*/
    if (props.active && terminalRef.current) {
      let rect = terminalRef.current.getBoundingClientRect();
      // top adjusted by header height
      // bottom adjusted by footer height
      if (rect.top < 50 || rect.bottom > window.innerHeight - 50) {
        // console.log(`@@@ reactcomp_terminalNode scrollIntoView`);
        // setBoundingBoxBottom(rect.bottom);
        // console.log(
        //   `<TerminalNode> before scroll top=${rect.top}, bottom=${rect.bottom}`
        // );
        // console.log(`terminal before scroll delta=${delta}`);
        //200 header height
        terminalRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
        // rect = terminalRef.current.getBoundingClientRect();
        // console.log(`<TerminalNode> after scroll y=${rect.y}`);
        // console.log(`<TerminalNode> after scroll top=${rect.top}`);
        // console.log(`<TerminalNode> after scroll bottom=${rect.bottom}`);
        // dispatch(Request.Page_autoScrolled(rect.top));
        // setScrollIntoView(true);
        // let rectAfterScroll = terminalRef.current.getBoundingClientRect();
        // // console.log(`after scroll delta=${delta + rect.top}`);
        // delta = rect.top - rectAfterScroll.top;
        // console.log(
        //   `terminal after scroll top=${rectAfterScroll.top}, bottom=${rectAfterScroll.bottom}`
        // );
        // console.log(`terminal after scroll delta=${delta}`);
      }
    }
  }, [props.active, terminalRef.current]);
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
    // console.log(
    //   `@@@@ <TerminalNode>  active=${props.active}, recitable=${props.terminalInfo.recitable}, content=${props.terminalInfo.content}`
    // );
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
