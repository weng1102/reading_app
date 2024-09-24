/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_terminal_inlinebutton.tsx
 *
 * Defines React front end functional components. renders inline buttons
 *
 * Version history:
 *
 **/
import React, { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { Request } from "./reducers";
import {
  IInlineButtonTerminalMeta,
  IInlineButtonItem,
  InlineButtonActionEnumType,
  IDX_INITIALIZER
  // RecitationScopeEnumType,
  // RecitationPlacementEnumType,
  // RecitationReferenceEnumType,
  // RecitationListeningEnumType
  //  ITerminalContent
} from "./pageContentType";
// import { Synthesizer } from "./reactcomp_speech";
import { SentenceToBeRecited, WordsToBeRecited } from "./reactcomp_recite";
// import { TerminalDispatcher } from "./reactcomp_terminals";
import { ITerminalPropsType } from "./reactcomp_terminals";
import { ISettingsContext, SettingsContext } from "./settingsContext";
import { CPageLists, PageContext } from "./pageContext";
import InlineButtonChoice from "./img/button_inline_choice.png";
import InlineButtonConverse from "./img/button_inline_converse.png";
import InlineButtonHint from "./img/button_inline_cues_color.png";
import InlineButtonLabel from "./img/button_inline_label.png";
import InlineButtonModel from "./img/button_inline_model.png";
import InlineButtonDefault from "./img/button_recite.png";
import BellShort from "./audio/bell_short.mp3";
import BuzzerShort from "./audio/buzzer_short.mp3";
// declare global {
// interface Window {
// AudioContext: typeof AudioContext;
// webkitAudioContext: typeof AudioContext;
// }
export const TerminalInlineButton = React.memo(
  (props: ITerminalPropsType): any => {
    const enum actionStateEnumType {
      start = "start",
      signalStart = "signalStart",
      signaling = "signaling",
      signalEnd = "signalEnd",
      signal = "signal",
      reciteStart = "reciteStart",
      reciting = "reciting",
      reciteEnd = "reciteEnd",
      gotoNextWord = "nextWord", // executes synchronously
      gotoNextSentence = "nextSentence", // executes synchronously
      listenStart = "listenStart",
      listening = "listening",
      listenEnd = "listenEnd",
      end = "end"
    }
    const dispatch = useAppDispatch();
    const audioPlay = async (src: string) => {
      const context = new AudioContext();
      const source = context.createBufferSource();
      // source.addEventListener("onended", onEndHandler);
      source.addEventListener("ended", event => {
        dispatch(Request.InlineButton_signaled());
        console.log(`signaled`);
      });
      const audioBuffer = await fetch(src)
        .then(res => res.arrayBuffer())
        .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start();
    };
    // subactions must be split when coordinating asynchronous start/end with
    // external components to avoid needless, inadvertant blocking.
    const buttonInfo: IInlineButtonTerminalMeta = props.terminal
      .meta as IInlineButtonTerminalMeta;
    const pageLists: CPageLists = useContext(PageContext)!;
    const buttonIdx = buttonInfo.buttonIdx;
    const buttonAction: InlineButtonActionEnumType =
      pageLists.inlineButtonList[buttonIdx].action;

    // let settingsContext: ISettingsContext = useContext(
    //   SettingsContext
    // ) as ISettingsContext;
    // const [currentAction, setCurrentAction] = useState(
    //   InlineButtonActionEnumType.none as InlineButtonActionEnumType
    // );
    const [nextActionState, setNextActionState] = useState(
      actionStateEnumType.end as actionStateEnumType
    );
    const clickedButtonIdx = useAppSelector(store => store.inlinebutton_idx);
    const moveRequested = useAppSelector(
      store => store.inlinebutton_move_requested
    );
    const listenRequested = useAppSelector(
      store => store.inlinebutton_listen_requested
    );
    const reciteRequested = useAppSelector(
      store => store.inlinebutton_recite_requested
    );
    const signalRequested = useAppSelector(
      store => store.inlinebutton_signal_requested
    );
    // correctSound.onended = () => {
    //   dispatch(Request.InlineButton_signaled());
    // };
    // incorrectSound.onended = () => {
    //   dispatch(Request.InlineButton_signaled());
    // };
    useEffect(() => {
      if (clickedButtonIdx === buttonIdx) {
        setNextActionState(actionStateEnumType.start);
      } else {
        setNextActionState(actionStateEnumType.end);
      }
    }, [clickedButtonIdx]);
    const choiceWorkflow = () => {
      switch (nextActionState) {
        case actionStateEnumType.start:
          // if (!signalRequested) {
          //   setNextActionState(actionStateEnumType.end);
          // } else {
          setNextActionState(actionStateEnumType.signalStart);
          // }
          break;
        case actionStateEnumType.signalStart:
          if (!signalRequested) {
            dispatch(Request.InlineButton_signal());
            if (buttonInfo.label.toLowerCase() === "correct") {
              audioPlay(BellShort);
            } else {
              audioPlay(BuzzerShort);
            }
            setNextActionState(actionStateEnumType.signaling);
          }
          break;
        case actionStateEnumType.signaling:
          if (!signalRequested) {
            setNextActionState(actionStateEnumType.signalEnd);
          }
          break;
        case actionStateEnumType.signalEnd:
          setNextActionState(actionStateEnumType.reciteStart);
          break;
        case actionStateEnumType.reciteStart:
          if (!reciteRequested) {
            const termIdx: number =
              pageLists.inlineButtonList[clickedButtonIdx].termIdx + 1;
            const sentenceIdx: number =
              pageLists.terminalList[termIdx].sentenceIdx;
            const strQ: string[] = SentenceToBeRecited(pageLists, sentenceIdx);

            dispatch(Request.InlineButton_recite(strQ));
            setNextActionState(actionStateEnumType.reciting);
          }
          break;
        case actionStateEnumType.reciting:
          if (!reciteRequested) {
            setNextActionState(actionStateEnumType.reciteEnd);
          }
          break;
        case actionStateEnumType.reciteEnd:
          setNextActionState(actionStateEnumType.end);
          break;
        case actionStateEnumType.end:
          dispatch(Request.InlineButton_clicked()); // reset clickedButtonIdx
          break;
        case actionStateEnumType.gotoNextWord:
          const termIdx = pageLists.inlineButtonList[clickedButtonIdx].termIdx;
          dispatch(Request.Cursor_gotoWordByIdx(termIdx));
          break;
        case actionStateEnumType.listenStart:
          dispatch(Request.InlineButton_listen());
          break;
        case actionStateEnumType.listenEnd:
          dispatch(Request.InlineButton_listened());
          break;
        case actionStateEnumType.end:
          break;
        default:
          console.log(
            `Unhandled action state encountered  ${buttonAction}:${nextActionState}`
          );
      }
    };
    const cuesWorkflow = () => {
      switch (nextActionState) {
        case actionStateEnumType.start:
          setNextActionState(actionStateEnumType.reciteStart);
          break;
        case actionStateEnumType.reciteStart:
          if (!reciteRequested) {
            const strQ: string[] = [
              pageLists.inlineButtonList[clickedButtonIdx].cues
            ];
            dispatch(Request.InlineButton_recite(strQ));
            setNextActionState(actionStateEnumType.reciting);
          }
          break;
        case actionStateEnumType.reciting:
          if (!reciteRequested) {
            setNextActionState(actionStateEnumType.reciteEnd);
          }
          break;
        case actionStateEnumType.reciteEnd:
          setNextActionState(actionStateEnumType.end);
          break;
        case actionStateEnumType.end:
          dispatch(Request.InlineButton_clicked()); // reset clickedButtonIdx
          break;
        default:
          console.log(
            `Unhandled action state encountered  ${buttonAction}:${nextActionState}`
          );
      }
    };
    const labelWorkflow = () => {
      console.log(`nextActionState=${nextActionState}`);
      switch (nextActionState) {
        case actionStateEnumType.start:
          setNextActionState(actionStateEnumType.reciteStart);
          break;
        case actionStateEnumType.reciteStart:
          if (!reciteRequested) {
            const strQ: string[] = [
              pageLists.inlineButtonList[clickedButtonIdx].label
            ]; //WordsToBeRecited(pageLists, termIdx, span);
            dispatch(Request.InlineButton_recite(strQ));
            setNextActionState(actionStateEnumType.reciting);
          }
          break;
        case actionStateEnumType.reciting:
          if (!reciteRequested) {
            setNextActionState(actionStateEnumType.reciteEnd);
          }
          break;
        case actionStateEnumType.reciteEnd:
          setNextActionState(actionStateEnumType.end);
          break;
        case actionStateEnumType.end:
          dispatch(Request.InlineButton_clicked()); // reset clickedButtonIdx
          break;
        default:
          console.log(
            `Unhandled action state encountered  ${buttonAction}:${nextActionState}`
          );
      }
    };
    useEffect(() => {
      if (clickedButtonIdx !== buttonIdx) return;
      switch (buttonAction) {
        case InlineButtonActionEnumType.choice:
          choiceWorkflow();
          break;
        case InlineButtonActionEnumType.completion:
          break;
        case InlineButtonActionEnumType.converse:
          break;
        case InlineButtonActionEnumType.cues:
          cuesWorkflow();
          break;
        case InlineButtonActionEnumType.label:
          labelWorkflow();
          break;
        case InlineButtonActionEnumType.model:
          break;
        case InlineButtonActionEnumType.none:
          break;
        case InlineButtonActionEnumType.term:
          labelWorkflow();
          break;
      }
    }, [
      nextActionState,
      // moveRequested,
      listenRequested,
      reciteRequested,
      signalRequested
    ]);
    interface IInlineButtonFormat {
      icon: string;
      showText: boolean;
    }
    const InlineButtonFormat = (
      action: InlineButtonActionEnumType
    ): IInlineButtonFormat => {
      // Basic recite button (three concentric right-facing convex arcs) stops
      // after reciting current word
      // With addition of
      // - plus sign appended denoting advance cursor beyond next word, sentence
      // - ellipses prepended denoting upto parital sentence/multiple-word scope
      // - ellipses prepended and dot appended denoting stop reciting at end of
      //   sentence
      switch (action) {
        case InlineButtonActionEnumType.choice:
          return {
            icon: InlineButtonChoice,
            showText: false
          };
        case InlineButtonActionEnumType.converse:
          return {
            icon: InlineButtonConverse,
            showText: true
          };
        case InlineButtonActionEnumType.cues:
          return { icon: InlineButtonHint, showText: false };
        case InlineButtonActionEnumType.label:
          return { icon: InlineButtonLabel, showText: true };
        case InlineButtonActionEnumType.model:
          return {
            icon: InlineButtonModel,
            showText: false
          };
        case InlineButtonActionEnumType.term:
          return { icon: "", showText: true };
        default:
          return { icon: InlineButtonDefault, showText: false };
      }
    };
    if (buttonIdx >= 0 && buttonIdx < pageLists.inlineButtonList.length) {
      let cssFormat: string;
      const buttonItem: IInlineButtonItem =
        pageLists.inlineButtonList[buttonIdx];
      // const buttonAction: InlineButtonActionEnumType = buttonItem.action;
      const { icon, showText } = InlineButtonFormat(buttonItem.action);
      const showIcon: boolean = icon.length > 0;
      let label: string = buttonItem.label;
      // const terminalBlockClass: string = "terminal-block";
      const onButtonClick = () => {
        if (nextActionState === actionStateEnumType.end) {
          dispatch(Request.InlineButton_click(buttonInfo.buttonIdx));
        }
      };
      label = "";
      if (showText) {
        label = buttonItem.label;
        if (showIcon) {
          cssFormat = "inlinebutton-labeledicon-container inlinebutton-format";
          return (
            <>
              <span className={cssFormat} onClick={onButtonClick}>
                <div className="inlinebutton-image">
                  <img className="icon inlinebutton-image-png" src={icon} />
                </div>
                <div className="inlinebutton-text">{label}</div>
              </span>
            </>
          );
        } else {
          cssFormat = "inlinebutton-labeled-container inlinebutton-format";
          return (
            <>
              <span className={cssFormat} onClick={onButtonClick}>
                <div className="inlinebutton-text">{label}</div>
              </span>
            </>
          );
        }
      } else {
        if (showIcon) {
          cssFormat = "inlinebutton-icon-container inlinebutton-format";
          return (
            <>
              <span className={cssFormat} onClick={onButtonClick}>
                <div className="inlinebutton-image">
                  <img className="icon inlinebutton-image-png" src={icon} />
                </div>
              </span>
            </>
          );
        } else {
          cssFormat = "inlinebutton-container inlinebutton-format"; // what is this? blank button?
          return <>/</>;
        }
      }
    }
  }
);
