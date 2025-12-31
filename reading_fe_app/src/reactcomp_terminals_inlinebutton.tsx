/** Copyright (C) 2020 - 2025 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_terminal_inlinebutton.tsx
 *
 * Defines React front end functional components. renders inline buttons
 * 
 * The various inline button operations correspond to state machines that 
 * manage the sequence of actions (e.g., listening, reciting) taken while 
 * executing. And even though mutliple buttons may be presented on a page, only
 * a single button can be active on the loaded page regardless of the type of
 * inline button. The invocation of a new inline button automatically cancels 
 * the operation of the prior one.
 * 
 * After the inline button operation is started, the state machine can only be 
 * terminated when:
 * 1) never i.e., upon completion of the action
 * 2) reclick i.e., clicked again
 * 3) another inline button is clicked. 
 * In the last case, the corresponding state machines will be reset. This 
 * reset action of one button by the clicking of another button requires
 * inter-component communication (via reducer). The reducer will 
 * initiate the operation of the latest clicked button and initiate the
 * reset of the previous button. The respective components are responsible
 * for their own behavior.
 *
 * These states will encapsulate lower-level asynchronous 
 * state transitions e.g., Recognition_start, user button clicks
 * encapsulated within the useEffect() that manage these state changes
 *
 * Version history:
 *
 **/
import React, { useCallback, useContext, useMemo, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { Request } from "./reducers";
// import { AppAudioContext } from "./audioContext";
// import { loadSoundFileIntoAudioBuffer, loadSoundFileIntoAudioBuffer1 } from "./rtutilities";
import {
  IInlineButtonTerminalMeta,
  IInlineButtonItem,
  InlineButtonActionEnumType,
  IDX_INITIALIZER,
} from "./pageContentType";
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
// import InlineButtonModelGhosted from "./img/button_inline_model_ghosted.png";
import InlineButtonDefault from "./img/button_recite.png";
import InlineButtonModelActive from "./img/button_inline_model_active.gif";
import InlineButtonModel from "./img/button_inline_model.png";
import { act } from "react-dom/test-utils";
import { store } from "./store";

// import BellShort from "./audio/bell_short.mp3";
// import BuzzerShort from "./audio/buzzer_short.mp3";
// import { error } from "console";
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
    idle = "idle",
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
    canceling = "canceling",
    cancelEnd = "cancelEnd",
    listenEnd = "listenEnd",
    nextAction = "nextAction", // action afterward
    repeatFirst = "repeatFirst", // 1st time through before repeating
    repeating = "repeating", // continue to repeat the same model
    repeatEnd = "repeatEnd", // after last repeat the same model
    gotoNextModel = "gotoNext", // position to but not start next
    startNextModel = "startNext", // start next model automatically
    end = "end",
  }
  const [thisButtonIdx, setThisButtonIdx] = useState(IDX_INITIALIZER as number); 
  const [isActive, setIsActive] = useState(false as boolean);
  const [buttonAction, setButtonAction] = useState(
    InlineButtonActionEnumType.none as InlineButtonActionEnumType
  );
  const [choiceResponseSectionIdx, setChoiceResponseSectionIdx] = useState(
    IDX_INITIALIZER as number
  );
  // save current listening state to restore at the end.
  const [listeningActiveAlready, setListeningActiveAlready] = useState(false as boolean);
  const [nextActionState, setNextActionState] = useState(
    actionStateEnumType.idle as actionStateEnumType
  );
  const [nextModelingButtonIdx, setNextModelingButtonIdx] = useState(
    IDX_INITIALIZER
  );  
  const [repetitionsRemaining, setRepetitionsRemaining] = useState(0);
  const activeButtonIdx = useAppSelector(store => store.inlinebutton_idx);
  const nextSentenceTransition = useAppSelector(
    store => store.cursor_nextSentenceTransition
  );
  const nextSection = useAppSelector(
    store => store.cursor_nextSectionTransition
  );
  const currentSectionIdx = useAppSelector(store => store.cursor_sectionIdx);
  const listeningRequested: boolean = useAppSelector(store => store.recognition_requested);
  const listeningActive: boolean = useAppSelector(store => store.recognition_active);
  const recitingActive: boolean = useAppSelector(store => store.reciting);
  const recitingRequested: boolean = useAppSelector(store => store.recite_requested);
  const recitingCompleted: boolean = useAppSelector(store => store.recite_completed);
  const autoClicked: boolean = useAppSelector(store=>store.inlinebutton_autoadvance);
  const endOfPageReached: boolean = useAppSelector(
      store => store.cursor_endOfPageReached
    );
  const reclicks: number = useAppSelector(store => store.inlinebutton_reclicks);
  const dispatch = useAppDispatch();
  const buttonProps: IInlineButtonTerminalMeta = props.terminal
    .meta as IInlineButtonTerminalMeta;
  const pageLists: CPageLists = useContext(PageContext)!;
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  useEffect(() => {
    setIsActive(activeButtonIdx === thisButtonIdx)
  },[activeButtonIdx, thisButtonIdx])
  useEffect(() => {
    // starts the state machine
    if (isActive){
      console.log(`@@@ setIsActive=${isActive}`);
      console.log(`start`)
      // if model continuation, skip to reciteStart
      if (reclicks === 0) {
      setNextActionState(actionStateEnumType.start);
      } else {
        console.log(`@@@ inlineButton: user canceling with reclicks=${reclicks}`);
        dispatch(Request.Message_set(`user canceling with reclick`));
        setNextActionState(actionStateEnumType.canceling);
      }
    } else {
      // Necessary to reset to idle state when button is not active so that 
      // the to start can be detected by the state machine.
      console.log(`idle`)
      setNextActionState(actionStateEnumType.idle);
    }
  }, [
    isActive, 
    reclicks,
    actionStateEnumType.start,
    actionStateEnumType.idle,
  ]);
    useEffect(() => {
    // Remember next section after proper multiple choice response
    if (isActive && buttonAction === InlineButtonActionEnumType.choice && nextSection) {
      console.log(`@@@ choice: nextSection=${nextSection}`);
      setChoiceResponseSectionIdx(currentSectionIdx);
    }
  }, [
    isActive,
    buttonAction,
    nextSection, 
    currentSectionIdx
  ]);
  useEffect(() => {
    // reset the autoadvance at page load
    dispatch(Request.InlineButton_canceled(thisButtonIdx))
  },[dispatch, thisButtonIdx])
  useEffect(() => {
    console.log(`@@@ inlineButton: repetitionsRemaining=${repetitionsRemaining}`)
  },[repetitionsRemaining])
  const choiceWorkflow = useCallback(() => {
    // The inline buttons should not change the flow of the prose. This
    // includes the incorrect buttons that only signal the negative. However,
    // when a correct button is clicked, it sounds a positive signal, moves
    // the cursor to the beginning of that option and starts listening for
    // for the user to start reciting the option. When complete, the cursor
    // jumps to the next section/question. If the app will return the
    // the listening state to that prior to the button being clicked.

    // If the section has changed then cancel everything

    switch (nextActionState) {
      case actionStateEnumType.start:
        setListeningActiveAlready(listeningActive);
        setNextActionState(actionStateEnumType.signalStart);
        break;
      case actionStateEnumType.signalStart:
        if (buttonProps.label.toLowerCase() === "correct") {
          settingsContext.settings.config.bellTone.play();
        setNextActionState(actionStateEnumType.signalEnd);
        } else {
          settingsContext.settings.config.buzzerTone.play()
          setNextActionState(actionStateEnumType.canceling);
        }
        break;
      case actionStateEnumType.signaling:

        break;
      case actionStateEnumType.signalEnd:
        if (buttonProps.label.toLowerCase() === "correct") {
          setNextActionState(actionStateEnumType.correctResponseStart);
        } else {
          setNextActionState(actionStateEnumType.end);
        }
        break;
      case actionStateEnumType.correctResponseStart:
        const termIdx: number =
          pageLists.inlineButtonList[thisButtonIdx].termIdx;
        dispatch(Request.Cursor_gotoWordByIdx(termIdx));
        setNextActionState(actionStateEnumType.correctResponse);
        break;
      case actionStateEnumType.correctResponse:
          setNextActionState(actionStateEnumType.correctResponseEnd);
        break;
      case actionStateEnumType.correctResponseEnd:
        setNextActionState(actionStateEnumType.listenStart);
        // }
        break;
      case actionStateEnumType.listenStart:
        if (!listeningActive) {
          dispatch(Request.Recognition_start_requested());
        } else {
          // Explicitly reset listening transcript even though
          // inlineButton_move should have caused a reset.
        }
        setNextActionState(actionStateEnumType.listening);
        break;
      case actionStateEnumType.listening:
        if (choiceResponseSectionIdx === currentSectionIdx) {
          // still on the same section/response
          if (listeningActive && !listeningRequested) {
            // cancel listening by user
            setNextActionState(actionStateEnumType.canceling);
          } else if  (!listeningActive && listeningRequested) {
            // wait for listening to start (could be part of else clause below)
          } else {
          // keep listening
          }
        } else {
          // different section encountered while listening OR
          // listening stopped OR cancelled
          if (listeningActive && listeningRequested) {
            // end of section transitioned while still listening implies end of
            //  user response
            setNextActionState(actionStateEnumType.listenEnd);
          } else {
            setNextActionState(actionStateEnumType.canceling);
          }
        }
        break;
      case actionStateEnumType.listenEnd:
        // reached the end of the response
        if (!listeningActiveAlready) {
          dispatch(Request.Recognition_stop_requested());
        }
        setNextActionState(actionStateEnumType.nextSection);
        break;
      case actionStateEnumType.nextSection:
        const nextSectionTermIdx =
          pageLists.inlineButtonList[thisButtonIdx].nextTermIdx;
        if (
          nextSectionTermIdx >= 0 &&
          nextSectionTermIdx < pageLists.terminalList.length
        ) {
          // If this is the end of sentence and cursor_stopAtEOS = true
          //
          dispatch(Request.Cursor_gotoWordByIdx(nextSectionTermIdx));
        } else if (endOfPageReached) {
            // corner case where the correct choice is the last sentence on the page
            // do nothing - end of page reached
          console.log(
            `endOfPageReached=${endOfPageReached} - no cursor movement`
          );
        } else {
          console.log(
            `invalid nextTermIdx=${nextSectionTermIdx} encountered in ${InlineButtonActionEnumType.choice} but assumed to be last section`
          );
        }
        setNextActionState(actionStateEnumType.end);
        break;
      case actionStateEnumType.canceling:
        dispatch(Request.Recognition_stop_requested());
        dispatch(Request.InlineButton_canceled(thisButtonIdx)); // reset inlinebutton_idx*
        setNextActionState(actionStateEnumType.end);
        break;
      case actionStateEnumType.end:
        // reset clickedButtonIdx
        // ay other clean up before idle state
        setNextActionState(actionStateEnumType.idle);
        break;
      default:
        console.log(
          `Unhandled action state encountered  ${buttonAction}:${nextActionState}`
        );
      }
    },[
      actionStateEnumType.canceling, 
      actionStateEnumType.correctResponse, 
      actionStateEnumType.correctResponseEnd, 
      actionStateEnumType.correctResponseStart, 
      actionStateEnumType.end, 
      actionStateEnumType.idle, 
      actionStateEnumType.listenEnd, 
      actionStateEnumType.listenStart, 
      actionStateEnumType.listening, 
      actionStateEnumType.nextSection, 
      actionStateEnumType.signalEnd, 
      actionStateEnumType.signalStart, 
      actionStateEnumType.signaling, 
      actionStateEnumType.start,
      settingsContext.settings.config.bellTone,
      settingsContext.settings.config.buzzerTone,
      buttonAction, 
      buttonProps.label, 
      choiceResponseSectionIdx, 
      currentSectionIdx, 
      dispatch, 
      endOfPageReached,
      listeningActive, 
      listeningActiveAlready, 
      listeningRequested,
      nextActionState, 
      pageLists.inlineButtonList, 
      pageLists.terminalList.length, 
      thisButtonIdx
    ]);
    const cuesWorkflow = useCallback(() => {
      switch (nextActionState) {
        case actionStateEnumType.start:
          setNextActionState(actionStateEnumType.reciteStart);
          break;
        case actionStateEnumType.reciteStart:
          // if (!reciteRequested) {
            const str: string = 
              pageLists.inlineButtonList[thisButtonIdx].cues;
            dispatch(Request.Recite_start_passThru(str));
            setNextActionState(actionStateEnumType.reciting);
          // }
          break;
        case actionStateEnumType.reciting:
          if (!recitingActive) {
            setNextActionState(actionStateEnumType.reciteEnd);
           }
          break;
        case actionStateEnumType.reciteEnd:
          setNextActionState(actionStateEnumType.end);
          break;
        case actionStateEnumType.end:
          // dispatch(Request.InlineButton_clicked()); // reset clickedButtonIdx
          setNextActionState(actionStateEnumType.idle);
          break;
        case actionStateEnumType.idle:
          break;
        default:
          console.log(
            `Unhandled action state encountered  ${buttonAction}:${nextActionState}`
          );
      }
    },[
      actionStateEnumType.end, 
      actionStateEnumType.idle, 
      actionStateEnumType.reciteEnd, 
      actionStateEnumType.reciteStart, 
      actionStateEnumType.reciting, 
      actionStateEnumType.start, 
      buttonAction, 
      dispatch,
      nextActionState, 
      pageLists.inlineButtonList,
      recitingActive,
      thisButtonIdx
    ]);
    const labelWorkflow = useCallback(() => {
      switch (nextActionState) {
        case actionStateEnumType.start:
          setNextActionState(actionStateEnumType.reciteStart);
          break;
        case actionStateEnumType.reciteStart:
          // if (!recitingActive) { // don't check - allow strq to be queued
            const str: string = 
              pageLists.inlineButtonList[thisButtonIdx].label;
            dispatch(Request.Recite_start_passThru(str));
            setNextActionState(actionStateEnumType.reciting);
          // }
          break;
        case actionStateEnumType.reciting:
          if (!recitingActive) {
            setNextActionState(actionStateEnumType.reciteEnd);
          }
          break;
        case actionStateEnumType.reciteEnd:
          setNextActionState(actionStateEnumType.end);
          break;
        case actionStateEnumType.end:
          dispatch(Request.InlineButton_canceled(thisButtonIdx));
          setNextActionState(actionStateEnumType.idle);
          break;
        case actionStateEnumType.canceling:
          dispatch(Request.InlineButton_canceled(thisButtonIdx));
          setNextActionState(actionStateEnumType.end);
          break;
        case actionStateEnumType.idle:
          break;
        default:
          console.log(
            `Unhandled action state encountered  ${buttonAction}:${nextActionState}`
          );
      }
    },[
      actionStateEnumType.canceling,
      actionStateEnumType.end, 
      actionStateEnumType.idle, 
      actionStateEnumType.reciteEnd, 
      actionStateEnumType.reciteStart, 
      actionStateEnumType.reciting, 
      actionStateEnumType.start,
      buttonAction, 
      thisButtonIdx,
      nextActionState,
      pageLists.inlineButtonList, 
      recitingActive, 
      dispatch,
  ]);
    const modelWorkFlow = useCallback((termIdx: number = -9999) => {
      try {
        switch (nextActionState) {
          case actionStateEnumType.start:
            // let repetitions: number = pageLists.inlineButtonList[thisButtonIdx].repetitions;
            if (listeningActive) {
              // dispatch(Request.InlineButton_listened());
              dispatch(Request.Recognition_stop_requested());
              // do not keep listening after button click
              setListeningActiveAlready(false);
            }
            if (pageLists.inlineButtonList[thisButtonIdx].repetitions > 0) {
              setNextActionState(actionStateEnumType.repeatFirst);
            } else {
              setNextActionState(actionStateEnumType.promptStart);
            }
            break;
          case actionStateEnumType.repeatFirst:
              dispatch(Request.Sentence_disableTransitions());
              dispatch(Request.Message_set(`Expect to repeat ${pageLists.inlineButtonList[thisButtonIdx].repetitions} times`));
              setRepetitionsRemaining(pageLists.inlineButtonList[thisButtonIdx].repetitions)
              setNextActionState(actionStateEnumType.promptStart);
            break;
          case actionStateEnumType.promptStart:
            termIdx = pageLists.inlineButtonList[thisButtonIdx].termIdx;
            dispatch(Request.Cursor_gotoWordByIdx(termIdx));
            setNextActionState(actionStateEnumType.prompting);
            break;
          case actionStateEnumType.prompting:
            // acknowledge the transition from gotoWord above
            dispatch(Request.Sentence_acknowledgeTransition());
            setNextActionState(actionStateEnumType.promptEnd);
            break;
          case actionStateEnumType.promptEnd:
            setNextActionState(actionStateEnumType.instructStart);
            break;
          case actionStateEnumType.instructStart:
            if (settingsContext.settings.modeling.continuationAction 
              === ModelingContinuationEnum.nextModelAndContinue
              && autoClicked) {
                // skip instructions on subsequent auto advance modeling buttons
                // but how do you determine whether this is the initial button click?
            // if (!recitingActive) {
              setNextActionState(actionStateEnumType.reciteStart);
            } else {
              const directions: string = (settingsContext ? settingsContext.settings.modeling.directions: "")
              dispatch(Request.Recite_start_passThru(directions));
              console.log(`instructStart: recitingActive=${recitingActive} `);
              // }
              setNextActionState(actionStateEnumType.instructing);
            }
            // }
            break;
          case actionStateEnumType.instructing:
            // cannot cancel instruction
            // wait until reciting is complete (inactive)
            if (recitingRequested && recitingCompleted) {
              setNextActionState(actionStateEnumType.instructEnd);
            } else if (!recitingRequested && !recitingActive) {
              setNextActionState(actionStateEnumType.canceling);
            } else {
              // still instructing
            }
            break;
          case actionStateEnumType.instructEnd:
            setNextActionState(actionStateEnumType.reciteStart);
            break;
          case actionStateEnumType.reciteStart:
              termIdx = pageLists.inlineButtonList[thisButtonIdx].termIdx;
                // pageLists.inlineButtonList[thisButtonIdx].termIdx + 1; //skip passed buton term idx
              const sentenceIdx: number = pageLists.terminalList[termIdx].sentenceIdx;
              dispatch(Request.Recite_start_sentence(sentenceIdx));
              setNextActionState(actionStateEnumType.reciting);
            break;
          case actionStateEnumType.reciting:
            // cannot user cancel?
            // strangely, recitingActive is assumed to be true after recite_start
            // wait until reciting is complete (inactive)
            if (recitingRequested && recitingCompleted) {
              setNextActionState(actionStateEnumType.reciteEnd);
            } else if (recitingRequested && !recitingCompleted && recitingActive) {
            } else if (!recitingRequested && !recitingActive) {
              // need to  check for both because there is a corner case where 
              // testing for just reciteActive prematurely terminates flow
              setNextActionState(actionStateEnumType.canceling);
            } else {
              console.log(`@@@ inlineButton: still reciting? But reached unexpected state`);
            }
            // use recitingRequest to trigger user cancel
            break;
          case actionStateEnumType.reciteEnd:
            dispatch(Request.Recite_ended()); // reset requested
            setNextActionState(actionStateEnumType.hideSentence);          
            break;
          case actionStateEnumType.hideSentence:
            const opacity: number = (settingsContext ? settingsContext.settings.modeling.obscuredTextDegree: 1)
            dispatch(Request.Sentence_setOpacity(opacity));
            setNextActionState(actionStateEnumType.listenStart);
            break;
          case actionStateEnumType.listenStart:
            if (!listeningActive) {
              dispatch(Request.Recognition_start_requested());
              setNextActionState(actionStateEnumType.listening);
            }
            break;
          case actionStateEnumType.listening:
            if (nextSentenceTransition) {
              setNextActionState(actionStateEnumType.listenEnd);
            } else if (endOfPageReached) {
              setNextActionState(actionStateEnumType.listenEnd);
            } else if (listeningActive && !listeningRequested) {
              setNextActionState(actionStateEnumType.canceling);
              // keep listening
            } else if (!listeningActive && listeningRequested) {
              console.log(`@@@ listening: waiting for listening to start active=${listeningActive}`);
            } else {
              console.log(`@@@ listening: keep listening active=${listeningActive}`);
            }
            break;
          case actionStateEnumType.listenEnd:
            dispatch(Request.Recognition_stop_requested());
            setNextActionState(actionStateEnumType.signalStart);
            break;
          case actionStateEnumType.signalStart:
            settingsContext.settings.config.bellTone.play();
            setNextActionState(actionStateEnumType.signalEnd);
            break;
          case actionStateEnumType.signalEnd:
            // This state set within audioPlay() completion event handler
            setNextActionState(actionStateEnumType.nextAction);  
            break;
          case actionStateEnumType.nextAction:
            const repetitionsRequested:number = pageLists.inlineButtonList[thisButtonIdx].repetitions;
            if (repetitionsRemaining > 0) {
              dispatch(Request.Message_set(`${repetitionsRemaining} of ${repetitionsRequested} remaining`));
              setRepetitionsRemaining(repetitionsRemaining => repetitionsRemaining - 1); // at least one repetition
              setNextActionState(actionStateEnumType.repeating);
            } else if (repetitionsRemaining === 0) {
              dispatch(Request.Message_set(`${repetitionsRemaining} of ${repetitionsRequested} remaining`));
              setRepetitionsRemaining(repetitionsRemaining => repetitionsRemaining - 1); // at least one repetition
              setNextActionState(actionStateEnumType.repeatEnd);
            } else { 
              // no more model repetitions: basically repetitionsRemaining < 0
              setNextActionState(actionStateEnumType.end);
              // Check button-specific attribute that overrides settingsContext
              const continuationAction: ModelingContinuationEnum = 
                pageLists.inlineButtonList[thisButtonIdx].continuation
              // const continuationAction: ModelingContinuationEnum = 
              //   thisButtonContinuationAction === ModelingContinuationEnum.unspecified? 
              //   settingsContext.settings.modeling.continuationAction: 
              //   thisButtonContinuationAction
              const nextButtonIdx: number =
                pageLists.inlineButtonList[thisButtonIdx].nextButtonIdx;
              // nextButtonIdx is button type specific, guaranteed to be the same type as current?
              if (continuationAction === ModelingContinuationEnum.nextWordAndStop) {
                console.log(`modelFlow: nextWordAndStop`)
                // default - allow normal cursor advancement logic to address this.
              } else if (continuationAction === ModelingContinuationEnum.unspecified && 
                repetitionsRequested > 0) {
                  // stop after model with repetitions for clarity
                console.log(`modelFlow: unspecified with repetitions: no continuation`)
              } else if (nextButtonIdx < 0 || nextButtonIdx > pageLists.inlineButtonList.length) {
                // next model/button out of bounds
                if (endOfPageReached) {
                  dispatch(Request.Message_set(`End of page reached`));
                } else {
                  // 
                  console.log(`modelFlow: unexpected out of range nextButtonIdx=${nextButtonIdx}`);
                }
              } else {
                // next model continuation
                  const nextTermIdx: number = pageLists.inlineButtonList[nextButtonIdx].termIdx
                  dispatch(Request.Cursor_gotoWordByIdx(nextTermIdx)); 
                  if (continuationAction === ModelingContinuationEnum.nextModelAndStop) {
                    console.log(`modelFlow: nextModelAndStop`)
                    dispatch(Request.Recognition_stop_requested());
                  } else if (continuationAction === ModelingContinuationEnum.nextModelAndContinue  
                    && settingsContext.settings.modeling.continuationAction) {
                    setNextModelingButtonIdx(nextButtonIdx)
                    console.log(`modelFlow: nextModelAndContinue`)
                    // do nothing else
                  } else {
                    console.log(`modelFlow: continuation?`)
                  }
                  if (settingsContext.settings.modeling.continuationAction 
                    === ModelingContinuationEnum.nextModelAndContinue) {
                  // set next button to be activated in end state
                    setNextModelingButtonIdx(nextButtonIdx)
                  }
                }
              }
            break;
          case actionStateEnumType.repeating:
            // set to beginning of the model
            termIdx = pageLists.inlineButtonList[thisButtonIdx].termIdx;
            dispatch(Request.Cursor_gotoWordByIdx(termIdx));
            dispatch(Request.Message_set(`${repetitionsRemaining} of ${pageLists.inlineButtonList[thisButtonIdx].repetitions} remaining`));
            // go to beginning of sentence for this button
            
            setNextActionState(actionStateEnumType.hideSentence);
            break;
          case actionStateEnumType.repeatEnd:
            dispatch(Request.Sentence_enableTransitions());
            dispatch(Request.Sentence_resetOpacity());
            setNextActionState(actionStateEnumType.nextAction);
            break;
          case actionStateEnumType.end:
            if (
              nextModelingButtonIdx >= 0 &&
              nextModelingButtonIdx < pageLists.inlineButtonList.length &&
              nextModelingButtonIdx !== thisButtonIdx
            ) {
              // allows this end state to cleanup before going to next model 
              // state that sends request to next modeling inline button
              // component corresponding to nextModelingButtonIdx: not this one.
              // console.log(
              //   `modelFlow: nextActionButtonIdx=${nextModelingButtonIdx}`
              // );
              // auto advance needs to be communicated to the next button whose
              // state resides in a different inline button component. Hence,
              // dispatch the request to the next button component.
              dispatch(Request.InlineButton_autoadvance(nextModelingButtonIdx))
              // dispatch(Request.Modeling_start_button(nextModelingButtonIdx))
              setNextModelingButtonIdx(IDX_INITIALIZER)
              // setNextActionState(actionStateEnumType.gotoNextModel) // not actual FSM state: only used by useEffect
            //   // no must be delivered to differnet component of same type
            //   // setNextActionState(actionStateEnumType.deferredStart); 
            // } else {
            //   console.log(
            //     `modelFlow: nextActionButtonIdx is invalid nextActionButtonIdx=${nextModelingButtonIdx}`
            //   );
            }
            setNextActionState(actionStateEnumType.idle); 
            break;
          case actionStateEnumType.canceling:
            if (pageLists.inlineButtonList[thisButtonIdx].repetitions > 0 
              && repetitionsRemaining > 0) setRepetitionsRemaining(0)
            dispatch(Request.Recognition_stop_requested());
            dispatch(Request.Sentence_resetOpacity());
            dispatch(Request.Recite_stop());
            dispatch(Request.Recite_start_passThru("canceled"));
            dispatch(Request.InlineButton_canceled(thisButtonIdx)); // reset inlinebutton_idx*
            setNextActionState(actionStateEnumType.end);
            break;
          default:
            console.log(
              `modelFlow: Unhandled action state encountered  ${buttonAction}:${nextActionState}`
            );
        }
      }
      catch(error: any) {
        console.log(`Unexpected exception in modelWorkFlow="${error.message}"`);
      }
    },[
      // playAudioBell,
      autoClicked,
      // settingsContext.settings.config.bellTone,
      buttonAction,
      dispatch,
      endOfPageReached,
      listeningActive,
      listeningRequested,
      repetitionsRemaining,
      nextActionState,
      nextModelingButtonIdx,
      nextSentenceTransition,
      recitingActive,
      recitingRequested,
      recitingCompleted,
      // reclicks,
      thisButtonIdx,
      pageLists.inlineButtonList,
      pageLists.terminalList,
      settingsContext,
actionStateEnumType.canceling,actionStateEnumType.end,actionStateEnumType.hideSentence,actionStateEnumType.idle,
actionStateEnumType.instructEnd,actionStateEnumType.instructStart,
actionStateEnumType.instructing, actionStateEnumType.listenEnd,actionStateEnumType.listenStart,
actionStateEnumType.listening,actionStateEnumType.nextAction,
actionStateEnumType.promptEnd,actionStateEnumType.promptStart,actionStateEnumType.prompting,
actionStateEnumType.reciteEnd, actionStateEnumType.reciteStart, actionStateEnumType.reciting, 
actionStateEnumType.repeatFirst, actionStateEnumType.repeating, actionStateEnumType.repeatEnd,
actionStateEnumType.signalEnd, actionStateEnumType.signalStart,actionStateEnumType.start
    ]);
    useEffect(() => {
      if (isActive) {
        console.log(`@@@ buttonAction=${buttonAction}`)
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
          case InlineButtonActionEnumType.term:
          case InlineButtonActionEnumType.label:
            labelWorkflow();
            break;
          case InlineButtonActionEnumType.model:
            modelWorkFlow();
            break;
          default:
          case InlineButtonActionEnumType.none:
            break;
        }
    }
      if (nextActionState === actionStateEnumType.end) {
        console.log(`@@@ end: setIsActive=${isActive}`)
        setIsActive(false)
      }
    }, [
      choiceWorkflow,
      cuesWorkflow,
      labelWorkflow,
      modelWorkFlow,
      dispatch,
      buttonAction,
      nextActionState,
      isActive,
      actionStateEnumType.end,
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
            case actionStateEnumType.instructStart:
            case actionStateEnumType.instructing:
            case actionStateEnumType.instructEnd:
            case actionStateEnumType.signalEnd:  
            case actionStateEnumType.signalStart:
            case actionStateEnumType.signaling:
            case actionStateEnumType.reciteStart:
            case actionStateEnumType.reciting:
            case actionStateEnumType.reciteEnd:
            case actionStateEnumType.listenStart:
            case actionStateEnumType.listening:
            case actionStateEnumType.listenEnd:
                  retVal = {
                icon: InlineButtonModelActive,
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
    if (
        thisButtonIdx === IDX_INITIALIZER && // uninitialized component
        buttonProps.buttonIdx >= 0 &&
        buttonProps.buttonIdx < pageLists.inlineButtonList.length
      ) {
        setThisButtonIdx(buttonProps.buttonIdx);
        setButtonAction(
          pageLists.inlineButtonList[buttonProps.buttonIdx].action
        );
      }
    if (thisButtonIdx >= 0 && thisButtonIdx < pageLists.inlineButtonList.length) {
      let cssFormat: string;
      const buttonListItem: IInlineButtonItem =
        pageLists.inlineButtonList[thisButtonIdx];
      const { icon, showText } = InlineButtonIcon(buttonListItem.action);
      const showIcon: boolean = icon.length > 0;
      const imgAlt: string = buttonListItem.action;
      let label: string = buttonListItem.label;
      const onButtonClick = () => {
        dispatch(Request.InlineButton_clicked(thisButtonIdx));
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
                  <img className="icon inlinebutton-image-png" alt={imgAlt} src={icon} />
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
                  <img className="icon inlinebutton-image-png"  alt={imgAlt} src={icon} />
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
    } else if (thisButtonIdx ===IDX_INITIALIZER) {
      return <></>
    } else {
      return <>Unknown button index encountered {thisButtonIdx}.</>;
    }
  }
);
