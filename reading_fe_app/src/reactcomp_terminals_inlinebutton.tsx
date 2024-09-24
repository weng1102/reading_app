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
      signalStart = "signalStart", // asynchronously
      signaling = "signaling",
      signalEnd = "signalEnd",
      signal = "signal",
      correctResponseStart = "correctResponseStart",
      correctResponse = "correctResponse",
      correctResponseEnd = "correctResponseEnd",
      // incorrect = "incorrect",
      reciteStart = "reciteStart", // asynchronously
      reciting = "reciting",
      reciteEnd = "reciteEnd",
      delayStart = "delaytart", // asynchronously
      delaying = "delaying",
      delayEnd = "delayEnd",
      resetSentence = "showSentence",
      ghostSentence = "ghostSentence",
      unghostWord = "unghostWord",
      gotoNextWord = "nextWord", // executes synchronously
      gotoNextSentence = "nextSentence", // executes synchronously
      nextSection = "nextSection",
      listenStart = "listenStart", // asynchronously
      listening = "listening",
      listenEnd = "listenEnd",
      end = "end"
    }
    const [listeningStartedViaButton, setListeningStartedViaButton] = useState(
      false
    );
    const [choiceResponseSectionIdx, setChoiceResponseSectionIdx] = useState(
      IDX_INITIALIZER
    );
    // const stopAtEndOfSentence: boolean = true;
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
    const thisButtonIdx = buttonInfo.buttonIdx;
    let buttonAction: InlineButtonActionEnumType =
      thisButtonIdx >= 0 && thisButtonIdx < pageLists.inlineButtonList.length
        ? pageLists.inlineButtonList[thisButtonIdx].action
        : InlineButtonActionEnumType.none;

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
    const listeningRequested = useAppSelector(
      store => store.inlinebutton_listen_requested
    );
    // const newSentence = useAppSelector(
    //   store => store.cursor_newSentenceTransition
    // );
    const newSection = useAppSelector(
      store => store.cursor_newSectionTransition
    );
    const currentSectionIdx = useAppSelector(store => store.cursor_sectionIdx);
    const listeningAlready = useAppSelector(store => store.listen_active);
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
      if (buttonAction === InlineButtonActionEnumType.choice)
        setChoiceResponseSectionIdx(currentSectionIdx);
    }, [newSection, currentSectionIdx]);
    useEffect(() => {
      if (clickedButtonIdx === thisButtonIdx) {
        setNextActionState(actionStateEnumType.start);
      } else {
        setNextActionState(actionStateEnumType.end);
      }
    }, [clickedButtonIdx]);
    // useEffect(() => {
    //   if (moveRequested) {
    //     const termIdx: number =
    //       pageLists.inlineButtonList[clickedButtonIdx].termIdx;
    //     dispatch(Request.Cursor_gotoWordByIdx(termIdx));
    //     console.log(`moving`);
    //   } else {
    //   }
    // }, [moveRequested, clickedButtonIdx]);
    useEffect(() => {
      if (listeningRequested) {
        dispatch(Request.Recognition_start());
      } else {
        dispatch(Request.Recognition_stop());
      }
    }, [listeningRequested]);
    const choiceWorkflow = () => {
      console.log(`@@@ nextActionState=${nextActionState}`);
      switch (nextActionState) {
        case actionStateEnumType.start:
          setListeningStartedViaButton(false);
          setNextActionState(actionStateEnumType.signalStart);
          break;
        case actionStateEnumType.signalStart:
          if (!signalRequested) {
            dispatch(Request.InlineButton_signal());
            console.log(`inlinebutton=${buttonInfo.label.toLowerCase()}`);
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
          if (buttonInfo.label.toLowerCase() === "correct") {
            setNextActionState(actionStateEnumType.correctResponseStart);
            // setNextActionState(actionStateEnumType.gotoNextWord);
          } else {
            setNextActionState(actionStateEnumType.end);
          }
          break;
        case actionStateEnumType.correctResponseStart:
          const termIdx: number =
            pageLists.inlineButtonList[clickedButtonIdx].termIdx;
          dispatch(Request.InlineButton_move());
          dispatch(Request.Cursor_gotoWordByIdx(termIdx));
          setNextActionState(actionStateEnumType.correctResponse);
          break;
        case actionStateEnumType.correctResponse:
          if (moveRequested) {
            setNextActionState(actionStateEnumType.correctResponseEnd);
            dispatch(Request.InlineButton_moved());
          }
          break;
        case actionStateEnumType.correctResponseEnd:
          setNextActionState(actionStateEnumType.listenStart);
          // }
          break;
        case actionStateEnumType.listenStart:
          // dispatch(Request.InlineButton_moved());
          if (listeningAlready) {
            // do nothing
          } else {
            // not already listening from before
            setListeningStartedViaButton(true);
            dispatch(Request.Recognition_start());
          }
          setNextActionState(actionStateEnumType.listening);
          break;
        case actionStateEnumType.listening:
          if (choiceResponseSectionIdx !== currentSectionIdx) {
            setNextActionState(actionStateEnumType.listenEnd);
          } else {
            // keep listening
          }
          break;
        case actionStateEnumType.listenEnd:
          if (listeningStartedViaButton) {
            dispatch(Request.Recognition_stop());
            setListeningStartedViaButton(false);
          }
          setNextActionState(actionStateEnumType.nextSection);
          break;
        case actionStateEnumType.nextSection:
          const nextSectionTermIdx =
            pageLists.inlineButtonList[clickedButtonIdx].nextTermIdx;
          if (
            nextSectionTermIdx >= 0 &&
            nextSectionTermIdx < pageLists.terminalList.length
          ) {
            // If this is the end of stentence and cursor_stopAtEOS = true
            //
            dispatch(Request.Cursor_gotoWordByIdx(nextSectionTermIdx));
          } else {
            console.log(
              `invalid nextTermIdx=${nextSectionTermIdx} encountered in ${InlineButtonActionEnumType.choice}`
            );
          }
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
    const modelWorkFlow = () => {
      console.log(`nextActionState=${nextActionState}`);
      switch (nextActionState) {
        case actionStateEnumType.start:
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
        case actionStateEnumType.ghostSentence:
          setNextActionState(actionStateEnumType.end);
          break;
        case actionStateEnumType.unghostWord:

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
      if (clickedButtonIdx !== thisButtonIdx) return;
      let buttonAction: InlineButtonActionEnumType =
        thisButtonIdx >= 0 && thisButtonIdx < pageLists.inlineButtonList.length
          ? pageLists.inlineButtonList[thisButtonIdx].action
          : InlineButtonActionEnumType.none;
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
          modelWorkFlow();
          break;
        case InlineButtonActionEnumType.none:
          break;
        case InlineButtonActionEnumType.term:
          labelWorkflow();
          break;
      }
    }, [
      nextActionState,
      currentSectionIdx,
      moveRequested,
      listeningAlready,
      listeningStartedViaButton,
      reciteRequested,
      signalRequested,
      choiceResponseSectionIdx
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
    if (
      thisButtonIdx >= 0 &&
      thisButtonIdx < pageLists.inlineButtonList.length
    ) {
      let cssFormat: string;
      const buttonItem: IInlineButtonItem =
        pageLists.inlineButtonList[thisButtonIdx];
      // const buttonAction: InlineButtonActionEnumType = buttonItem.action;
      // const { icon, showText } = InlineButtonFormat(buttonItem.action);
      // const showIcon: boolean = icon.length > 0;
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
          // return <>1..</>;
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
          // cssFormat = "inlinebutton-icon-container inlinebutton-image";

          return (
            <>
              <span onClick={onButtonClick}>
                <div className={cssFormat}>
                  <img className="icon inlinebutton-image-png" src={icon} />
                </div>
              </span>
            </>
          );
        } else {
          cssFormat = "inlinebutton-container inlinebutton-format"; // what is this? blank button?
          return <></>;
        }
      }
    } else {
      return <>what?</>;
    }
  }
);
