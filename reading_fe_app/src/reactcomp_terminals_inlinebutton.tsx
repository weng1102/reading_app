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
import {
  ISettingsContext,
  ModelingContinuationEnum,
  SettingsContext
} from "./settingsContext";
import { CPageLists, PageContext } from "./pageContext";
import InlineButtonChoice from "./img/button_inline_choice.png";
import InlineButtonConverse from "./img/button_inline_converse.png";
import InlineButtonHint from "./img/button_inline_cues_color.png";
import InlineButtonLabel from "./img/button_inline_label.png";
import InlineButtonModel from "./img/button_inline_model.png";
import InlineButtonModelRecite from "./img/button_inline_model_recite.png";
import InlineButtonModelListen from "./img/button_inline_model_listen.png";
import InlineButtonDefault from "./img/button_recite.png";
import BellShort from "./audio/bell_short.mp3";
import BuzzerShort from "./audio/buzzer_short.mp3";
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
      promptStart = "promptStart",
      prompting = "prompting",
      promptEnd = "promptEnd",
      moveCursorEnd = "moveCursorEnd",
      instructStart = "instructStart",
      instructing = "instructing",
      instructEnd = "instructEnd",
      reciteStart = "reciteStart", // asynchronously
      reciting = "reciting",
      reciteEnd = "reciteEnd",
      delayStart = "delayStart", // asynchronously
      delaying = "delaying",
      delayEnd = "delayEnd",
      showSentence = "showSentence",
      hideSentence = "hideSentence",
      gotoNextWord = "nextWord", // executes synchronously
      gotoNextSentence = "nextSentence", // executes synchronously
      nextSection = "nextSection",
      listenStart = "listenStart", // asynchronously
      listening = "listening",
      listenEnd = "listenEnd",
      nextAction = "nextAction", // action afterward
      gotoNextModel = "gotoNext", // position to but not start next
      startNextModel = "startNext", // start next model automatically
      end = "end",
      deferredStart = "deferredStart" // auto start deferred action after end
    }
    const [buttonIdx, setButtonIdx] = useState(IDX_INITIALIZER);
    const [buttonAction, setButtonAction] = useState(
      InlineButtonActionEnumType.none
    );
    const [listeningStartedViaButton, setListeningStartedViaButton] = useState(
      false
    );
    const [choiceResponseSectionIdx, setChoiceResponseSectionIdx] = useState(
      IDX_INITIALIZER
    );
    const [listeningActiveAlready, setListeningActiveAlready] = useState(false);
    const [nextActionState, setNextActionState] = useState(
      actionStateEnumType.end as actionStateEnumType
    );
    const [deferredClickedButtonIdx, setDeferredClickedButtonIdx] = useState(
      IDX_INITIALIZER
    );
    const clickedButtonIdx = useAppSelector(store => store.inlinebutton_idx);
    const moveRequested = useAppSelector(
      store => store.inlinebutton_move_requested
    );
    const listeningRequested = useAppSelector(
      store => store.inlinebutton_listen_requested
    );
    const nextSentenceTransition = useAppSelector(
      store => store.cursor_nextSentenceTransition
    );
    const nextSection = useAppSelector(
      store => store.cursor_nextSectionTransition
    );
    // const endOfPage = useAppSelector(store => store.cursor_endOfPageReached);
    const currentSectionIdx = useAppSelector(store => store.cursor_sectionIdx);
    const listeningActive = useAppSelector(store => store.listen_active);
    const recitingActive = useAppSelector(store => store.reciting);
    const reciteRequested = useAppSelector(
      store => store.inlinebutton_recite_requested
    );
    const signalRequested = useAppSelector(
      store => store.inlinebutton_signal_requested
    );
    // const obscuredSentenceIdx = useAppSelector(
    //   store => store.sentence_idxObscured
    // );
    // const stopAtEndOfSentence: boolean = true;
    const dispatch = useAppDispatch();
    const audioPlay = async (src: string) => {
      const context = new AudioContext();
      const source = context.createBufferSource();
      source.addEventListener("ended", event => {
        dispatch(Request.InlineButton_signaled());
        // console.log(`signaled`);
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
    const buttonProps: IInlineButtonTerminalMeta = props.terminal
      .meta as IInlineButtonTerminalMeta;
    const pageLists: CPageLists = useContext(PageContext)!;
    const settingsContext: ISettingsContext = useContext(SettingsContext)!;

    useEffect(() => {
      if (clickedButtonIdx === buttonIdx) {
        console.log(`@@@ clickedButtonIdx=${clickedButtonIdx}`);
        setNextActionState(actionStateEnumType.start);
      } else {
        setNextActionState(actionStateEnumType.end);
      }
    }, [clickedButtonIdx, buttonIdx]);
    useEffect(() => {
      // simulates onButtonClicked() below
      if (
        nextActionState === actionStateEnumType.deferredStart &&
        deferredClickedButtonIdx >= 0
      ) {
        dispatch(Request.InlineButton_click(deferredClickedButtonIdx));
        setDeferredClickedButtonIdx(IDX_INITIALIZER);
        setNextActionState(actionStateEnumType.start);
      } else {
        console.log(
          `invalid deferredClickedButtonIdx=${deferredClickedButtonIdx}`
        );
      }
    }, [deferredClickedButtonIdx, buttonAction, nextActionState]);
    useEffect(() => {
      if (buttonAction === InlineButtonActionEnumType.choice)
        setChoiceResponseSectionIdx(currentSectionIdx);
    }, [nextSection, currentSectionIdx]);

    useEffect(() => {
      // console.log(`@@@ inlineButton_listen ${clickedButtonIdx} ${buttonIdx}`);
      if (clickedButtonIdx !== buttonIdx) return;
      console.log(
        `@@@ Recognition_start ${listeningRequested} ${listeningActive} ${listeningActiveAlready}`
      );
      if (listeningRequested && !listeningActive) {
        dispatch(Request.Recognition_start());
      } else if (
        listeningActive &&
        !listeningRequested &&
        !listeningActiveAlready
      ) {
        dispatch(Request.Recognition_stop());
      }
    }, [
      listeningRequested,
      listeningActive,
      listeningActiveAlready,
      clickedButtonIdx,
      buttonIdx
    ]);
    const choiceWorkflow = () => {
      // The inline buttons should not change the flow of the prose. This
      // includes the incorrect buttons that only signal the negative. However,
      // when a correct button is clicked, it sounds a positive signal, moves
      // the cursor to the beginning of that option and starts listening for
      // for the user to start reciting the option. When complete, the cursor
      // jumps to the next section/question. If the app will return the
      // the listening state to that prior to the button being clicked.
      console.log(`@@@ nextActionState=${nextActionState}`);
      switch (nextActionState) {
        case actionStateEnumType.start:
          // setListeningStartedViaButton(false);
          setListeningActiveAlready(listeningActive);
          // console.log(`@@@ start: listeningActive=${listeningActive}`);

          setNextActionState(actionStateEnumType.signalStart);
          break;
        case actionStateEnumType.signalStart:
          if (!signalRequested) {
            dispatch(Request.InlineButton_signal());
            console.log(`inlinebutton=${buttonProps.label.toLowerCase()}`);
            if (buttonProps.label.toLowerCase() === "correct") {
              audioPlay(BellShort);
            } else {
              audioPlay(BuzzerShort);
            }
            setNextActionState(actionStateEnumType.signalEnd);
          }
          break;
        case actionStateEnumType.signaling:
          if (!signalRequested) {
            setNextActionState(actionStateEnumType.signalEnd);
          }
          break;
        case actionStateEnumType.signalEnd:
          if (buttonProps.label.toLowerCase() === "correct") {
            setNextActionState(actionStateEnumType.correctResponseStart);
            // setNextActionState(actionStateEnumType.gotoNextWord);
          } else {
            setNextActionState(actionStateEnumType.end);
          }
          break;
        case actionStateEnumType.correctResponseStart:
          const termIdx: number =
            pageLists.inlineButtonList[clickedButtonIdx].termIdx;
          console.log(`inlinebutton_move: move to termIdx=${termIdx}`);
          dispatch(Request.InlineButton_move(termIdx));
          setNextActionState(actionStateEnumType.correctResponse);
          break;
        case actionStateEnumType.correctResponse:
          if (moveRequested) {
            dispatch(Request.InlineButton_moved());
            setNextActionState(actionStateEnumType.correctResponseEnd);
          }
          break;
        case actionStateEnumType.correctResponseEnd:
          setNextActionState(actionStateEnumType.listenStart);
          // }
          break;
        case actionStateEnumType.listenStart:
          // dispatch(Request.InlineButton_moved());
          // save listening active state to restore at the end. So if the app
          // was not already listening before the button push then then
          // listening will be stopped at the end of this button push action.
          if (!listeningActive) {
            //            dispatch(Request.Recognition_start());
            dispatch(Request.InlineButton_listen());
          } else {
            // Explicitly reset listening transcript even though
            // inlineButton_move should have caused a reset.
          }
          setNextActionState(actionStateEnumType.listening);
          break;
        case actionStateEnumType.listening:
          if (choiceResponseSectionIdx !== currentSectionIdx) {
            setNextActionState(actionStateEnumType.listenEnd);
          } else if (!listeningActive) {
            setNextActionState(actionStateEnumType.end);
          } else {
            // keep listening
          }
          break;
        case actionStateEnumType.listenEnd:
          // reached the end of the response
          if (!listeningActiveAlready) {
            dispatch(Request.Recognition_start());
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
      // console.log(`@@@ nextActionState=${nextActionState}`);
      console.log(`@@@ nextActionState=${nextActionState}`);
      switch (nextActionState) {
        case actionStateEnumType.start:
          if (listeningActive) {
            // dispatch(Request.InlineButton_listened());
            dispatch(Request.Recognition_stop());
            // do not keep listening after button click
            setListeningActiveAlready(false);
          }
          setNextActionState(actionStateEnumType.promptStart);
          break;
        case actionStateEnumType.promptStart:
          const termIdx: number =
            pageLists.inlineButtonList[clickedButtonIdx].termIdx;
          dispatch(Request.InlineButton_move(termIdx));
          setNextActionState(actionStateEnumType.prompting);
          break;
        case actionStateEnumType.prompting:
          if (moveRequested) {
            dispatch(Request.InlineButton_moved());
            dispatch(Request.Sentence_acknowledgeTransition());
          }
          setNextActionState(actionStateEnumType.promptEnd);
          break;
        case actionStateEnumType.promptEnd:
          setNextActionState(actionStateEnumType.instructStart);
          break;
        case actionStateEnumType.instructStart:
          if (!reciteRequested) {
            if (settingsContext) {
              const directions: string =
                settingsContext.settings.modeling.directions;
              const strQ: string[] = [directions];
              dispatch(Request.InlineButton_recite(strQ));
            }
            setNextActionState(actionStateEnumType.instructing);
          }
          break;
        case actionStateEnumType.instructing:
          // cannot cancel instruction
          if (!reciteRequested) {
            setNextActionState(actionStateEnumType.instructEnd);
          }
          break;
        case actionStateEnumType.instructEnd:
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
          // cannot user cancel
          if (!reciteRequested) {
            setNextActionState(actionStateEnumType.reciteEnd);
          }
          break;
        case actionStateEnumType.reciteEnd:
          setNextActionState(actionStateEnumType.hideSentence);
          break;
        case actionStateEnumType.hideSentence:
          dispatch(Request.Sentence_setOpacity(0.5));
          setNextActionState(actionStateEnumType.listenStart);
          break;
        case actionStateEnumType.listenStart:
          if (!listeningActive) {
            // console.log(`@@@ listeningStart: request listening`);
            dispatch(Request.InlineButton_listen());
            setNextActionState(actionStateEnumType.listening);
          }
          break;
        case actionStateEnumType.listening:
          // wait for EOS!
          // console.log(
          //   `@@@ listening: nextSentenceTransition=${nextSentenceTransition} listeningRequested=${listeningRequested}`
          // );
          if (nextSentenceTransition) {
            // console.log(`@@@ listening: nextSentence`);
            dispatch(Request.InlineButton_listened());
            setNextActionState(actionStateEnumType.listenEnd);
          } else if (!listeningRequested) {
            // console.log(`@@@ listening: cancelled`);
            setNextActionState(actionStateEnumType.end);
            // console.log(`@@@ listening: not nextSentence`);
            // keep listening
          } else {
          }
          break;
        case actionStateEnumType.listenEnd:
          // reached the end of the response
          // console.log(`@@@ listenEnd: not nextSentence`);
          // dispatch(Request.Recognition_stop());
          setNextActionState(actionStateEnumType.signalStart);
          break;
        case actionStateEnumType.signalStart:
          // position to first word of model
          if (!signalRequested) {
            dispatch(Request.InlineButton_signal());
            audioPlay(BellShort);
            // check settings.modelingSettings.continuationAction
          }
          setNextActionState(actionStateEnumType.nextAction);

          break;
        case actionStateEnumType.nextAction:
          console.log(
            `modelFlow nextAction=${settingsContext.settings.modeling.continuationAction}`
          );
          const nextButtonIdx: number =
            pageLists.inlineButtonList[clickedButtonIdx].nextButtonIdx;
          switch (settingsContext.settings.modeling.continuationAction) {
            case ModelingContinuationEnum.nextWordAndStop:
              // default - allow normal cursor advancement logic to address this.
              break;
            case ModelingContinuationEnum.nextModelAndContinue:
              console.log(
                `modelFlow continue to next nextButtonIdx=${nextButtonIdx}, current=${clickedButtonIdx}`
              );
              setDeferredClickedButtonIdx(nextButtonIdx);
              setNextActionState(actionStateEnumType.end);
              break;
            case ModelingContinuationEnum.nextModelAndStop:
              console.log(`modelFlow goto nextButtonTermIdx=${nextButtonIdx}`);
              const nextTermIdx: number =
                pageLists.inlineButtonList[nextButtonIdx].termIdx;
              if (
                nextTermIdx >= 0 &&
                nextTermIdx < pageLists.terminalList.length
              ) {
                // console.log(`modelFlow goto nextTermIdx=${nextTermIdx}`);

                dispatch(Request.Cursor_gotoWordByIdx(nextTermIdx));
                setNextActionState(actionStateEnumType.end);
                // console.log(
                //   `modelFlow goto ${settingsContext.settings.modeling.continuationAction}`
                // );
              } else {
                console.log(
                  `modelFlow out of range nextTermIdx=${clickedButtonIdx}`
                );
              }
              break;
            default:
              console.log(
                `invalid continuationAction=${settingsContext.settings.modeling.continuationAction}`
              );
              break;
          }
          break;
        case actionStateEnumType.end:
          dispatch(Request.InlineButton_clicked()); // reset clickedButtonIdx
          if (
            deferredClickedButtonIdx >= 0 &&
            deferredClickedButtonIdx < pageLists.inlineButtonList.length
          ) {
            setNextActionState(actionStateEnumType.deferredStart);
          } else {
            console.log(
              `modelFlow: deferredClickedButtonIdx is out of range deferredClickedButtonIdx=${deferredClickedButtonIdx}`
            );
          }
          break;
        default:
          console.log(
            `modelFlow: Unhandled action state encountered  ${buttonAction}:${nextActionState}`
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
          modelWorkFlow();
          break;
        case InlineButtonActionEnumType.none:
          break;
        case InlineButtonActionEnumType.term:
          labelWorkflow();
          break;
      }
    }, [
      buttonAction,
      nextActionState,
      currentSectionIdx,
      moveRequested,
      listeningActive,
      listeningStartedViaButton,
      reciteRequested,
      signalRequested,
      choiceResponseSectionIdx,
      deferredClickedButtonIdx
      // clickedButtonIdx
    ]);
    interface IInlineButtonIcon {
      icon: string;
      showText: boolean;
      roundIcon: boolean;
    }
    const InlineButtonIcon = (
      action: InlineButtonActionEnumType,
      state: actionStateEnumType = actionStateEnumType.end
    ): IInlineButtonIcon => {
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
            showText: false,
            roundIcon: true
          };
        case InlineButtonActionEnumType.converse:
          return {
            icon: InlineButtonConverse,
            showText: true,
            roundIcon: false
          };
        case InlineButtonActionEnumType.cues:
          return {
            icon: InlineButtonHint,
            showText: false,
            roundIcon: true
          };
        case InlineButtonActionEnumType.label:
          return {
            icon: InlineButtonLabel,
            showText: true,
            roundIcon: false
          };
        case InlineButtonActionEnumType.model:
          let retVal: IInlineButtonIcon;
          switch (nextActionState) {
            case actionStateEnumType.reciteStart:
            case actionStateEnumType.reciting:
            case actionStateEnumType.reciteEnd:
              retVal = {
                icon: InlineButtonModelRecite,
                showText: false,
                roundIcon: true
              };
              break;
            case actionStateEnumType.listenStart:
            case actionStateEnumType.listening:
            case actionStateEnumType.listenEnd:
              retVal = {
                icon: InlineButtonModelListen,
                showText: false,
                roundIcon: true
              };
              break;
            default:
              retVal = {
                icon: InlineButtonModel,
                showText: false,
                roundIcon: true
              };
              break;
          }
          return retVal;
          break;
        case InlineButtonActionEnumType.term:
          return {
            icon: "",
            showText: true,
            roundIcon: false
          };
        default:
          return {
            icon: InlineButtonDefault,
            showText: false,
            roundIcon: false
          };
      }
    };
    // initialize state variables that identify inline button
    useEffect(() => {
      if (
        buttonIdx < 0 &&
        buttonProps.buttonIdx >= 0 &&
        buttonProps.buttonIdx < pageLists.inlineButtonList.length
      ) {
        setButtonIdx(buttonProps.buttonIdx);
        setButtonAction(
          pageLists.inlineButtonList[buttonProps.buttonIdx].action
        );
      }
    }, [buttonProps.buttonIdx, buttonIdx]);

    if (buttonIdx >= 0 && buttonIdx < pageLists.inlineButtonList.length) {
      let cssFormat: string;
      const buttonListItem: IInlineButtonItem =
        pageLists.inlineButtonList[buttonIdx];
      const { icon, showText } = InlineButtonIcon(buttonListItem.action);
      const showIcon: boolean = icon.length > 0;
      let label: string = buttonListItem.label;

      const onButtonClick = () => {
        if (nextActionState === actionStateEnumType.end) {
          setListeningActiveAlready(listeningActive);
          dispatch(Request.InlineButton_click(buttonProps.buttonIdx));
        } else if (
          nextActionState === actionStateEnumType.reciting ||
          nextActionState === actionStateEnumType.listening
        ) {
          // reset cancelled state
          setNextActionState(actionStateEnumType.end);
        }
      };
      label = "";
      if (showText) {
        label = buttonListItem.label;
        if (showIcon) {
          cssFormat = "inlinebutton-labeledicon-container inlinebutton-format";
          return (
            <>
              <span className={cssFormat} onClick={onButtonClick}>
                <div className="inlinebutton-image">
                  <img className="icon inlinebutton-image-png" src={icon} />
                </div>
                <div className="inlinebutton-text">{label}</div>
                <span className="inlinebutton-format-spacing-post"></span>
              </span>
            </>
          );
        } else {
          cssFormat = "inlinebutton-labeled-container inlinebutton-format b";
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
          cssFormat =
            "inlinebutton-icon-container inlinebutton-format iniinebutton-format-round";
          // cssFormat = "inlinebutton-icon-container inlinebutton-image";

          return (
            <>
              <span onClick={onButtonClick}>
                <div className={cssFormat}>
                  <img className="icon inlinebutton-image-png" src={icon} />
                </div>
                <span className="inlinebutton-format-spacing-post"></span>
              </span>
            </>
          );
        } else {
          cssFormat = "inlinebutton-container inlinebutton-format d"; // what is this? blank button?
          return <></>;
        }
      }
    } else {
      return <>what?</>;
    }
  }
);
