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
    // const workflowState = {
    //   start: "start",
    //   signalStart: "signalStart", // asynchronously
    //   signaling: "signaling",
    //   signalEnd: "signalEnd",
    //   signal: "signal",
    //   correctResponseStart: "correctResponseStart",
    //   correctResponse: "correctResponse",
    //   correctResponseEnd: "correctResponseEnd",
    //   promptStart: "promptStart",
    //   prompting: "prompting",
    //   promptEnd: "promptEnd",
    //   moveCursorEnd: "moveCursorEnd",
    //   idle: "idle",
    //   instructStart: "instructStart",
    //   instructing: "instructing",
    //   instructEnd: "instructEnd",
    //   reciteStart: "reciteStart", // asynchronously
    //   reciting: "reciting",
    //   reciteEnd: "reciteEnd",
    //   delayStart: "delayStart", // asynchronously
    //   delaying: "delaying",
    //   delayEnd: "delayEnd",
    //   showSentence: "showSentence",
    //   hideSentence: "hideSentence",
    //   gotoNextWord: "nextWord", // executes synchronously
    //   gotoNextSentence: "nextSentence", // executes synchronously
    //   nextSection: "nextSection",
    //   listenStart: "listenStart", // asynchronously
    //   listening: "listening",
    //   canceling: "canceling",
    //   cancelEnd: "cancelEnd",
    //   listenEnd: "listenEnd",
    //   nextAction: "nextAction", // action afterward
    //   repeatFirst: "repeatFirst", // 1st time through before repeating
    //   repeating: "repeating", // continue to repeat the same model
    //   repeatEnd: "repeatEnd", // after last repeat the same model
    //   gotoNextModel: "gotoNext", // position to but not start next
    //   startNextModel: "startNext", // start next model automatically
    //   end: "end"
    // } as const
    // type workflowStateType = typeof workflowState[keyof typeof workflowState];
    // specific component inline button identifier
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
    // const [workflowAction, setWorkflowAction] = useState(
    //   workflowState.idle as workflowStateType
    // );
    const [nextModelingButtonIdx, setNextModelingButtonIdx] = useState(
      IDX_INITIALIZER
    );  
    const [repetitionsRemaining, setRepetitionsRemaining] = useState(0);
    const activeButtonReclicks = useAppSelector(store => store.inlinebutton_reclicks);
    const activeButtonIdx = useAppSelector(store => store.inlinebutton_idx);
    const previouslyActiveButtonIdx = useAppSelector(store => store.inlinebutton_idx_prev);
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
    const dispatch = useAppDispatch();
    // const bell: HTMLAudioElement = useMemo(() =>  new Audio(BellShort),[]);
    // const buzzer: HTMLAudioElement = useMemo(() => new Audio(BuzzerShort),[]);

    const buttonProps: IInlineButtonTerminalMeta = props.terminal
      .meta as IInlineButtonTerminalMeta;
    const pageLists: CPageLists = useContext(PageContext)!;
    const settingsContext: ISettingsContext = useContext(SettingsContext)!;
    // useEffect(() => {
    //   console.log(`reactcomp_terminals_inlinebutton: listeningActive=${listeningActive}`)
    //   },
    //   [listeningActive]
    //   )
    ///// general button useEfect()s to launch and cancel button action state machine
    useEffect(() => {
      // console.log(`@@@ setIsActive=${activeButtonIdx}===${thisButtonIdx}?`);
      setIsActive(activeButtonIdx === thisButtonIdx)
    },[activeButtonIdx, thisButtonIdx])
    // useEffect(() => {
    //   console.log(`@@@ setIsActive=${isActive}`);
    // },[isActive])
  // Extract enum values to variables for useEffect dependency array
  // const actionStateEnumTypeStart = actionStateEnumType.start;
  // const actionStateEnumTypeIdle = actionStateEnumType.idle;

  useEffect(() => {
    // starts the state machine
    if (isActive){
      console.log(`@@@ setIsActive=${isActive}`);
      console.log(`start`)
      // if model continuation, skip to reciteStart
      setNextActionState(actionStateEnumType.start);
    } else {
      // Necessary to reset to idle state when button is not active so that 
      // the to start can be detected by the state machine.
      console.log(`idle`)
      setNextActionState(actionStateEnumType.idle);
    }
  }, [
    isActive, 
    actionStateEnumType.start,
    actionStateEnumType.idle,
  ]);
    // useEffect(() => {
    //   // Manage consecutive clicks of the same button
    //   // 1) cancel (default)
    //   // 2) hints, greater disclosure to be handled within the individual 
    //   //    state machine logic below (nice to have)
    //   //    e.g., if listening during modeling, then perhaps increase
    //   //    opacity on consecutive clicks.  
    //   // If each workflow requires a different behavior, consider refactoring
    //   // them into individual components instead of this generalized inline
    //   // button component
    //   if (previouslyActiveButtonIdx === thisButtonIdx) {
    //     console.log(`@@@ canceling previouslyActiveButtonIdx=${previouslyActiveButtonIdx} thisButtonIdx=${thisButtonIdx} nextActionState=${nextActionState} isActive=${isActive}`); 
    //   }
    //   if (previouslyActiveButtonIdx === thisButtonIdx && isActive 
    //     && buttonAction !== InlineButtonActionEnumType.label) {
    //       // && previouslyActiveButtonIdx !== IDX_INITIALIZER, necessary?
    //     if (nextActionState !== actionStateEnumType.canceling 
    //       && nextActionState !== actionStateEnumType.end
    //       && nextActionState !== actionStateEnumType.idle
    //       && previouslyActiveButtonIdx !== IDX_INITIALIZER
    //       && activeButtonReclicks > 0
    //     ) {
    //   // By default, cancel previously active button on the page and allow it
    //   // cleanup itself regardless of the current action state. This behavior
    //   // can be modified within the specific state machine
    //   console.log(`@@@ inlinebutton: canceling isActive=${isActive} thisButtonIdx=${thisButtonIdx} previouslyActiveButtonIdx=${previouslyActiveButtonIdx} nextActionState=${nextActionState}`);
    //     setNextActionState(actionStateEnumType.canceling);
    //     } 
    //   }
    // }, [
    //   actionStateEnumType.canceling,
    //   actionStateEnumType.end,
    //   actionStateEnumType.idle,
    //   // actionStateEnumType.listening,
    //   activeButtonReclicks,
    //   buttonAction,
    //   isActive,
    //   nextActionState,
    //   previouslyActiveButtonIdx,
    //   thisButtonIdx, 
    // ]);
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
    // console.log(`@@@ inlineButton: pageload only thisButtonIdx=${thisButtonIdx}`);
    dispatch(Request.InlineButton_canceled(thisButtonIdx))
  },[dispatch, thisButtonIdx])

  // requires beause each inline button is not aware of the actions of others
  // and therefore cannot react to them.
  // useEffect(() => {
  //   console.log(`@@@ nextActionState=${nextActionState}`);
  //   // cancel active choice inline button correct respone
  //   if (buttonAction === InlineButtonActionEnumType.choice && 
  //   choiceResponseSectionIdx !== currentSectionIdx) {
  //     // cancel the specific active choice inline button
  //   }
  //   },[buttonAction, nextActionState, choiceResponseSectionIdx, currentSectionIdx]);

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
        // setListeningStartedViaButton(false);
        setListeningActiveAlready(listeningActive);
        console.log(`@@@ start: listeningActive=${listeningActive}`);

        setNextActionState(actionStateEnumType.signalStart);
        break;
      case actionStateEnumType.signalStart:
        // if (!signalRequested) {
        //   dispatch(Request.InlineButton_signal());
        //   console.log(`inlinebutton=${buttonProps.label.toLowerCase()}`);
          // dispatch(Request.Action_signalStarting());
          if (buttonProps.label.toLowerCase() === "correct") {
            // audioPlay(BellShort);
            settingsContext.settings.config.bellTone.play();
            console.log(`@@@ mc signalStart correct: listeningActive=${listeningActive}`);
          setNextActionState(actionStateEnumType.signalEnd);
          } else {
            settingsContext.settings.config.buzzerTone.play()
            console.log(`@@@ mc signalStart incorrect: listeningActive=${listeningActive}`);
            setNextActionState(actionStateEnumType.canceling);
          }
        // }
        break;
      case actionStateEnumType.signaling:
        // if (!signalRequested) {
        //   setNextActionState(actionStateEnumType.signalEnd);
        // }
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
          pageLists.inlineButtonList[thisButtonIdx].termIdx;
        console.log(`inlinebutton_move: move to termIdx=${termIdx}`);
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
        // dispatch(Request.InlineButton_moved());
        // save listening active state to restore at the end. So if the app
        // was not already listening before the button push then then
        // listening will be stopped at the end of this button push action.
        if (!listeningActive) {
          dispatch(Request.Recognition_start_requested());
        } else {
        //   // Explicitly reset listening transcript even though
        //   // inlineButton_move should have caused a reset.
        }
        setNextActionState(actionStateEnumType.listening);
        break;
      case actionStateEnumType.listening:
        if (choiceResponseSectionIdx === currentSectionIdx) {
          // still on the same section/response
            console.log(`@@@ listening: listening to same section  ${choiceResponseSectionIdx}=${currentSectionIdx} listeningActive=${listeningActive} listeningRequested=${listeningRequested}`);
          if (listeningActive && !listeningRequested) {
            // cancel listening by user
            console.log(`@@@ listening: user cancel listening ${choiceResponseSectionIdx}=${currentSectionIdx} listeningActive=${listeningActive} listeningRequested=${listeningRequested}`);
            setNextActionState(actionStateEnumType.canceling);
          } else if  (!listeningActive && listeningRequested) {
            // wait for listening to start (could be part of else clause below)
            console.log(`@@@ listening: waiting for listening ${choiceResponseSectionIdx}=${currentSectionIdx} listeningActive=${listeningActive} listeningRequested=${listeningRequested}`);
          } else {
          // keep listening
            console.log(`@@@ listening: keep listening ${choiceResponseSectionIdx}=${currentSectionIdx} listeningActive=${listeningActive} listeningRequested=${listeningRequested}`);
          }
        } else {
            console.log(`@@@ listening: listening to different section  ${choiceResponseSectionIdx}=${currentSectionIdx} listeningActive=${listeningActive} listeningRequested=${listeningRequested}`);
          // different section encountered while listening OR
          // listening stopped OR cancelled
          if (listeningActive && listeningRequested) {
            // end of section transitioned while still listening implies end of
            //  user response
            console.log(`@@@ listening: section transition but still listening ${choiceResponseSectionIdx}=${currentSectionIdx} or listeningActive=${listeningActive} or listeningRequested=${listeningRequested}`);
            setNextActionState(actionStateEnumType.listenEnd);
          } else {
            console.log(`@@@ listening: canceling ${listeningActive}`);
            setNextActionState(actionStateEnumType.canceling);
          }
        }
        break;
      case actionStateEnumType.listenEnd:
        // reached the end of the response
        if (!listeningActiveAlready) {
          // dispatch(Request.InlineButton_listened());
          dispatch(Request.Recognition_stop_requested());
          // console.log(`@@@@ stop requested3`);
        }
        console.log(`@@@ listenEnd=${nextSection}`);
        setNextActionState(actionStateEnumType.nextSection);
        break;
      case actionStateEnumType.nextSection:
        console.log(`@@@ nextSection=${nextSection}`);
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
        console.log(`@@@ canceling listeningActive=${listeningActive}`);
        dispatch(Request.Recognition_stop_requested());
        dispatch(Request.InlineButton_canceled(thisButtonIdx)); // reset inlinebutton_idx*
        setNextActionState(actionStateEnumType.end);
        break;
      case actionStateEnumType.end:
        // dispatch(Request.InlineButton_clicked()); // reset clickedButtonIdx
        /// ay other clean up before idle state
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
      nextSection, 
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
          console.log(`@@@ labelWorkFlow: cancel`)
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
      console.log(`@@@ modelFlow: nextActionState=${nextActionState} thisButtonIdx=${thisButtonIdx} repetitionsRemaining=${repetitionsRemaining} listeningActive=${listeningActive} nextSentence=${nextSentenceTransition} endOfPageReached=${endOfPageReached}`);
      try {
        switch (nextActionState) {
          case actionStateEnumType.start:
            // let repetitions: number = pageLists.inlineButtonList[thisButtonIdx].repetitions;
            if (listeningActive) {
              // dispatch(Request.InlineButton_listened());
              dispatch(Request.Recognition_stop_requested());
              console.log(`@@@@ stop requested1`);
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
              console.log(`### modelFlow repeatFirst thisButtonIdx=${thisButtonIdx} set to ${pageLists.inlineButtonList[thisButtonIdx].repetitions}`);
              setRepetitionsRemaining(pageLists.inlineButtonList[thisButtonIdx].repetitions)
              setNextActionState(actionStateEnumType.promptStart);
            break;
          case actionStateEnumType.promptStart:
            termIdx = pageLists.inlineButtonList[thisButtonIdx].termIdx;
            dispatch(Request.Cursor_gotoWordByIdx(termIdx));
            console.log(`@@@ promptStart: termIdx=${termIdx}`)
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
            // console.log(`@@@ instructing1: recitingActive=${recitingActive}`)
            if (recitingRequested && recitingCompleted) {
              setNextActionState(actionStateEnumType.instructEnd);
                // console.log(`@@@ instructing2: completing recitingActive=${recitingActive}}`)
                // console.log(`@@@ inlineButton: completing @${(new Date().getTime().toString().slice(-5))}`);
            } else if (!recitingRequested && !recitingActive) {
              // console.log(`@@@ instructing4: canceling recitingRequested=${recitingRequested} recitingActive=${recitingActive} `)
            //   // dispatch(Request.InlineButton_canceled(thisButtonIdx));
              // dispatch(Request.Recite_stop());
              setNextActionState(actionStateEnumType.canceling);
            } else {
              console.log(`@@@ instructing3: waiting recitingActive=${recitingActive} `)
              // console.log(`@@@ inlineButton: waiting @${(new Date().getTime().toString().slice(-5))}`);
            }
            break;
          case actionStateEnumType.instructEnd:
            // console.log(`@@@ inlineButton: instructEnd @${(new Date().getTime().toString().slice(-5))}`);
            // dispatch(Request.Recite_ended()); // just in case?
            setNextActionState(actionStateEnumType.reciteStart);
            break;
          case actionStateEnumType.reciteStart:
              // dispatch(Request.Action_reciteStarting());
            // console.log(`@@@ reciteStart1: recitingActive=${recitingActive} thisButtonIdx=${thisButtonIdx}`)
            // console.log(`@@@ inlineButton: reciteStart @${(new Date().getTime().toString().slice(-5))}`);
            // if (!recitingActive) {
              termIdx = pageLists.inlineButtonList[thisButtonIdx].termIdx;
                // pageLists.inlineButtonList[thisButtonIdx].termIdx + 1; //skip passed buton term idx
              const sentenceIdx: number = pageLists.terminalList[termIdx].sentenceIdx;
              // console.log(`@@@ reciteStart: termIdx=${termIdx} sentenceIdx=${sentenceIdx} recitingCompleted=${recitingCompleted}`)
              dispatch(Request.Recite_start_sentence(sentenceIdx));
              setNextActionState(actionStateEnumType.reciting);
            break;
          case actionStateEnumType.reciting:
            // cannot user cancel?
            // strangely, recitingActive is assumed to be true after recite_start
            // wait until reciting is complete (inactive)
            // console.log(`@@@ reciting1: recitingActive=${recitingActive}  recitingCompleted=${recitingCompleted}`)
            // console.log(`@@@ inlineButton: reciting @${(new Date().getTime().toString().slice(-5))}`);
            if (recitingRequested && recitingCompleted) {
              // sleep(2, "after Recite_start_sentence completed")
              // console.log(`@@@ inlineButton: completing @${(new Date().getTime().toString().slice(-5))}`);
              // console.log(`@@@ reciting2: no longer reciting recitingActive=${recitingActive}  recitingCompleted=${recitingCompleted}`)
              setNextActionState(actionStateEnumType.reciteEnd);
            } else if (recitingRequested && !recitingCompleted && recitingActive) {
              // console.log(`@@@ reciting5: still reciting recitingActive=${recitingActive} `)
            } else if (!recitingRequested && !recitingActive) {
              // need to  check for both because there is a corner case where 
              // testing for just reciteActive prematurely terminates flow
              // console.log(`@@@ reciting4: canceling recitingActive=${recitingActive} `)
              setNextActionState(actionStateEnumType.canceling);
            } else {
              // console.log(`@@@ reciting3: still reciting recitingActive=${recitingActive}  recitingCompleted=${recitingCompleted}`)
              console.log(`@@@ inlineButton: still reciting @${(new Date().getTime().toString().slice(-5))}`);
            }
            // use recitingRequest to trigger user cancel
            break;
          case actionStateEnumType.reciteEnd:
            // console.log(`@@@ inlineButton: recitingEnd @${(new Date().getTime().toString().slice(-5))}`);
            // console.log(`@@@ reciteEnd: reciting recitingActive=${recitingActive}  recitingCompleted=${recitingCompleted}`)
            dispatch(Request.Recite_ended()); // reset requested
            setNextActionState(actionStateEnumType.hideSentence);          
            break;
          case actionStateEnumType.hideSentence:
            const opacity: number = (settingsContext ? settingsContext.settings.modeling.obscuredTextDegree: 1)
            // console.log(`@@@ inlineButton: hideSentence @${(new Date().getTime().toString().slice(-5))}`);
            dispatch(Request.Sentence_setOpacity(opacity));
            setNextActionState(actionStateEnumType.listenStart);
            break;
          case actionStateEnumType.listenStart:
            if (!listeningActive) {
              // console.log(`@@@ inlineButton: listenStart @${(new Date().getTime().toString().slice(-5))}`);
              // console.log(`@@@@@ listening: before start listeningActive=${listeningActive}`)
              // console.log(`@@@ listeningStart: request listening`);
              dispatch(Request.Recognition_start_requested());
              // console.log(`@@@@@ listening: after start listeningActive=${listeningActive}`)
              setNextActionState(actionStateEnumType.listening);
            }
            // console.log(`@@@@@ listening: end of start listeningActive=${listeningActive}`)
            break;
          case actionStateEnumType.listening:
            // console.log(`@@@@@ listening: still listening listeningActive=${listeningActive}`)
            // wait for EOS!
            // console.log(
            //   `@@@ listening: nextSentenceTransition=${nextSentenceTransition} listeningRequested=${listeningRequested}`
            // );
            // console.log(`@@@ listening: nextSent=${nextSentenceTransition} active=${listeningActive} endOfPageReached=${endOfPageReached}`);
            if (nextSentenceTransition) {
            // if repetitionsRemaining > 0) { ring the bell and reset the cursor 
            // to the beginning of the sentence and setNextActionState(actionStateEnumType.listening) 
            // OR should this action be handled by a different state e.g., repeating
            // 
            // } else { setNextActionState(actionStateEnumType.listenEnd)}
              // console.log(`@@@ listening: nextSentence transition active=${listeningActive}`);
              setNextActionState(actionStateEnumType.listenEnd);
            // } else if (endOfPageReached) {
            //   console.log(`@@@ listening: endOfPage active=${listeningActive}`);
            //   setNextActionState(actionStateEnumType.listenEnd);
            } else if (endOfPageReached) {
              // console.log(`@@@ listening: endOfPage active=${listeningActive}`);
              setNextActionState(actionStateEnumType.listenEnd);
            } else if (listeningActive && !listeningRequested) {
              // console.log(`@@@ listening: cancelled`);
              setNextActionState(actionStateEnumType.canceling);
              // console.log(`@@@ listening: not nextSentence`);
              // keep listening
            } else if (!listeningActive && listeningRequested) {
              console.log(`@@@ listening: waiting for listening to start active=${listeningActive}`);
            } else {
              console.log(`@@@ listening: keep listening active=${listeningActive}`);
            }
            break;
          case actionStateEnumType.listenEnd:
            dispatch(Request.Recognition_stop_requested());
            // console.log(`@@@@ stop requested2`);

            setNextActionState(actionStateEnumType.signalStart);
            break;
          case actionStateEnumType.signalStart:
            // audioPlay(BellShort);
            settingsContext.settings.config.bellTone.play();
            // playAudioBell();
            // console.log(`@@@ listening: signalStart`);
            // check settings.modelingSettings.continuationAction
            // }
            setNextActionState(actionStateEnumType.signalEnd);
            break;
          case actionStateEnumType.signalEnd:
            // This state set within audioPlay() completion event handler
            setNextActionState(actionStateEnumType.nextAction);  
            break;
          case actionStateEnumType.nextAction:
            if (repetitionsRemaining > 0) {
              dispatch(Request.Message_set(`${repetitionsRemaining} of ${pageLists.inlineButtonList[thisButtonIdx].repetitions} remaining`));
              setRepetitionsRemaining(repetitionsRemaining => repetitionsRemaining - 1); // at least one repetition
              setNextActionState(actionStateEnumType.repeating);
            } else if (repetitionsRemaining === 0) {
              dispatch(Request.Message_set(`${repetitionsRemaining} of ${pageLists.inlineButtonList[thisButtonIdx].repetitions} remaining`));
              setRepetitionsRemaining(repetitionsRemaining => repetitionsRemaining - 1); // at least one repetition
              setNextActionState(actionStateEnumType.repeatEnd);
            } else { 
              // no more model repetitions: basically repetitionsRemaining < 0
              setNextActionState(actionStateEnumType.end);

              // Check button-specific attribute that overrides settingsContext
              const thisButtonContinuationAction: ModelingContinuationEnum = 
                pageLists.inlineButtonList[thisButtonIdx].continuation
              const continuationAction: ModelingContinuationEnum = 
                thisButtonContinuationAction === ModelingContinuationEnum.unspecified? 
                settingsContext.settings.modeling.continuationAction: 
                thisButtonContinuationAction
              const nextButtonIdx: number =
                pageLists.inlineButtonList[thisButtonIdx].nextButtonIdx;
              // nextButtonIdx is button type specific, guaranteed to be the same type as current?
              if (continuationAction === ModelingContinuationEnum.nextWordAndStop) {
                console.log(`model: nextWordAndStop`)
                // default - allow normal cursor advancement logic to address this.
              } else if (nextButtonIdx < 0 || nextButtonIdx > pageLists.inlineButtonList.length) {
                // invalid next model/button because:
                if (endOfPageReached) {
                  console.log(
                    `modelFlow end of page reached thisButtonIdx=${thisButtonIdx}`
                  );
                  dispatch(Request.Message_set(`End of page reached`));
                } else {
                  console.log(`modelFlow unexpected out of range nextButtonIdx=${nextButtonIdx}`);
                }
              } else {
                // next model
                  const nextTermIdx: number = pageLists.inlineButtonList[nextButtonIdx].termIdx
                  dispatch(Request.Cursor_gotoWordByIdx(nextTermIdx)); 
                  if (continuationAction === ModelingContinuationEnum.nextModelAndStop) {
                    console.log(`model: nextModelAndStop`)
                    dispatch(Request.Recognition_stop_requested());
                  } else if ((continuationAction === ModelingContinuationEnum.nextModelAndContinue)) {
                    console.log(`model: nextModelAndContinue`)
                    // do nothing else
                  } else {
                    console.log(`model: continuation?`)
                  }
                  if (settingsContext.settings.modeling.continuationAction 
                    === ModelingContinuationEnum.nextModelAndContinue) {
                  // set next button to be activated in end state
                    setNextModelingButtonIdx(nextButtonIdx)
                  }

                }
              }
                  /*
              switch (continuationAction) {
                case ModelingContinuationEnum.nextWordAndStop:
                  // default - allow normal cursor advancement logic to address this.
                  break;
                case ModelingContinuationEnum.nextModelAndStop:
                case ModelingContinuationEnum.nextModelAndContinue:
                  // same as  nextWordAndStop iff next word and next model coincide
                  // console.log(`modelFlow goto nextButtonTermIdx=${nextButtonIdx}`);
                  console.log(`modelFlow continuationAction=${continuationAction} nextButtonIdx=${nextButtonIdx} endofPageReached=${endOfPageReached}`);
                  if (nextTermIdx >= 0) {
                    // console.log(`modelFlow goto nextTermIdx=${nextTermIdx}`);
                    dispatch(Request.Cursor_gotoWordByIdx(nextTermIdx)); // don't need completer
                    // console.log(
                    //   `modelFlow goto ${settingsContext.settings.modeling.continuationAction}`
                    // );
                  } else if (endOfPageReached) {
                    console.log(
                      `modelFlow end of page reached thisButtonIdx=${thisButtonIdx}`
                    );
                    dispatch(Request.Message_set(`End of page reached`));
                  } else {
                    console.log(
                      `modelFlow out of range nextTermIdx=${thisButtonIdx}`
                    );
                  }
                  if (settingsContext.settings.modeling.continuationAction 
                    === ModelingContinuationEnum.nextModelAndContinue) {
                  // set next button to be activated in end state
                      setNextModelingButtonIdx(nextButtonIdx)
                  }
                  break;
                default:
                  console.log(
                    `invalid continuationAction=${settingsContext.settings.modeling.continuationAction}`
                  );
                }
              }
                */
              break;
            case actionStateEnumType.repeating:
            // set to beginning of the model
            termIdx = pageLists.inlineButtonList[thisButtonIdx].termIdx;
            dispatch(Request.Cursor_gotoWordByIdx(termIdx));
            dispatch(Request.Message_set(`${repetitionsRemaining} of ${pageLists.inlineButtonList[thisButtonIdx].repetitions} remaining`));
            // console.log(`@@@ modelFlow repeating termIdx=${termIdx} repetitionsRemaining=${repetitionsRemaining} nextSentenceTransition=${nextSentenceTransition}`)
            // go to beginning of sentence for this button
            
            setNextActionState(actionStateEnumType.hideSentence);
            // setNextActionState(actionStateEnumType.listening); // continue listening or is that moot?
            break;
          case actionStateEnumType.repeatEnd:
            dispatch(Request.Sentence_enableTransitions());
            dispatch(Request.Sentence_resetOpacity());
            setNextActionState(actionStateEnumType.nextAction);
            break;

          case actionStateEnumType.end:
            // if (modelingStartRequested) dispatch(Request.Modeling_stop());
              // console.log(
              //   `modelFlow: end nextActionButtonIdx=${nextModelingButtonIdx} thisButtonIdx=${thisButtonIdx}`
              // )
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
            // console.log(`@@@@ stop requested4`);

            dispatch(Request.Sentence_resetOpacity());
            dispatch(Request.Recite_stop());
            dispatch(Request.Recite_start_passThru("canceled"));
            // console.log(`@@@ canceled: recite canceled`);

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
