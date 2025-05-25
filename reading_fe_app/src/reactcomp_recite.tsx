/** Copyright (C) 2020 - 2025 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_recite.tsx
 *
 *  Supersedes reactcomp_speech_speakbutton.tsx
 *
 * Sequence of events:
 * 1) reciteButtonActive
 *    - if true, then set reciteButtonStartRequested=true iff reciteRequested==false
 *      and reciteButtonCancelRequested=false, otherwise ignore
 *    - else, set reciteCancelRequested=true iff reciteRequested==true and
 *      reciteButtonStartRequested==false, otherwise ignore
 * 
 * 2a) reciteButtonStartRequested, reciteApiStartRequested
 *    - if true, then set reciteNow=true iff reciteNow==false
 *    - else, set reciteNow=false iff reciteNow==true
 * 
 * 2b) reciteButtonCancelRequested, reciteApiCancelRequested
 *    - if true, then set reciteStarted=false iff reciteNow==true
 *    - else, set reciteNow=false iff reciteNow==true
 *
 * 3) reciteNow
 *   - if true, push recitationQueue entry/entries
 *   - else , clear entire recitationQueue 
 * 
 * 4) recitationQueue
 *   - if not empty, set reciteInProgress=true, pop entry and speak
 *   - else set reciteNow=false
 * 
 * 5) reciteInProgress (belt and suspenders in that an empty recitationQueue)
 *    also signals end of recitation
 *   - if true, then do nothing until Synthesizer onend() event resets
 *   - else, if recitationQueue is empty, set reciteNow=false
 * 
 * Open issues: 
 * 1) Should cancel request dispose of the item at the front of queue
 * or empty the queue entirely? 
 * 2) Should the recitation queue accomodate (multiple) entries from 
 * mutiple requests. Currently, the only multiple entries are from
 * a single request with multiple sentences i.e., sections. Specifically,
 * for modeling flow, the directions and the model sentences are separate
 * and processed separately but could be queued together.
 * For now, leave them separate for simplicity
 * ********************************************************************
 * Defines React recitation behavior initiated by front end recite button
 * and programmatic Request.Recite_start() API call.
 * 
 * To share logic, reciteButtonStartRequested and reciteStartRequested trigger
 * reciting via reciteRequested state variable.
 * 
 * 
 * The recite button is a toggle control that initiates action via 
 * reciteButtonToggled boolean state variable. When it transitions to true 
 * reciteButtonStartRequested is set to true iff reciteRequested is already
 * true.
 *  and when it transitions back to
 * false, reciting cancel requested is set to true iff recite requested is 
 * already true. Otherwise transition is ignored.  and reciteRequested is true, then reciteRequested
 * reciteRequested is false, then reciteRequested is set to true. When it
 * transitions back to false (reciting cancel requested) and  with reciteButtonStartRequested
 * is set (either true or false)
 * when (true) not already recited and cancels recitation when (false) and
 * recited is already requested. This toggle sets reciteStartRequested or
 * reciteCancelRequested state variables, respectively.
 * 
 * 
 * In summary,
 * - if reciteButtonRequested=true (reciting) and reciteRequested=false
 *   then initiate recitation 
 * - if reciteButtonRequested=false (no reciting) and reciteRequested=true
 *   then terminate recitation reciteRequested=false
 * - if reciteButtonRequested=true (reciting) and reciteRequested=true
 *   then keep reciting   
 * - if reciteButtonRequested=false (no reciting) and reciteRequested=false
 *   then stay quiet reciteRequested=false
 * Similarly, 
 * - if reciteStartRequested=true (triggered by Recite_start()) 
 *   and reciteRequested=false then initiate recitation reciteRequested=true
 * - if reciteStartRequested=false (triggered by Recite_stop()) 
 *   and reciteRequested=true then terminate recitation reciteRequested=false
 * 
 * Sequence of event:
 * 1) original recitation request (true)
 *    1a) ReciteButton clicked (component state reciteButtonRequested)
 *    1b) Recite_start() called programmatically (component state 
 *       reciteStartRequested)
 *    Either will set reciteRequested state variable to true iff 
 *    reciteRequested is false
 *    To retain all context, the *reciteRequested values are not reset until
 *    recitation has terminated. This is especially important with a user
 *    cancel request.
 * 
 * 2) reciteRequested (true)
 *    changes the ReciteButtonIcon to active and generates the reciation queue
 *    of words, sentence, section based on scope et al. settings above.
 *    reciteRequest should be reset at this point to allow subsuquent recite 
 *    requests (canceling) to be processed.
 * 
 * 3) recitationQueue (value changes)
 *    Recitation request is decomposed into a list of sentences so the speech
 *    synthesis can produce smoother and more natural prose than synthesizing
 *    individual words. The end of sentence puncuation is also essential. 
 *    The sentence queue vs a single string of mutliple sentences allows the 
 *    current sentence to be highlighted in the future.
 *
 *    After each sentence is popped, if an asynchronous user cancel request via
 *    a subsequent recitation request (true) that stops synthesis immediately,
 *    the component logic can reset the component state for the next recitation
 *    request mmediately.
 *    After speaking is initiated, recitingInProgress indicates whether actual
 *    speech synthesis is ongoing and completed asynchronously based
 *    asynchronous event from Synthesizer onend(). Detecting the actual
 *    completion allows the timely reset of reciteRequested (along with
 *    reciteButton.)
 *
 *
 *
 * Version history:
 *
 **/
import { Request, IDX_INITIALIZER } from "./reducers";
import speakGhostedIcon from "./img/button_speak_ghosted.png";
import speakActiveIcon from "./img/button_speak_activeRed.gif";
import speakInactiveIcon from "./img/button_recite.png";
import reciteWordInactiveIcon from "./img/button_recite.png";
import reciteWordAdvanceInactiveIcon from "./img/button_recite_advance.png";
import reciteSentenceInactiveIcon from "./img/button_recite_sentence.png";
import reciteSentenceAdvanceInactiveIcon from "./img/button_recite_sentence_advance.png";
import reciteSectionInactiveIcon from "./img/button_recite_section.png";
import reciteSectionAdvanceInactiveIcon from "./img/button_recite_section_advance.png";
import reciteLabelInactiveIcon from "./img/button_recite.png";
import reciteHintInactiveIcon from "./img/button_cues_color.png";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useCallback, useEffect, useState, useContext } from "react";
import {
  RecitationScopeEnumType,
  RecitationReferenceEnumType,
  RecitationPlacementEnumType,
  RecitationListeningEnumType
} from "./pageContentType";
import { CPageLists, PageContext } from "./pageContext";
import { ISettingsContext, SettingsContext } from "./settingsContext";
import { Synthesizer } from "./reactcomp_speech";
// this should be a method of a recite object where the parameters are passed
// to the constructor() and the resultant string and icon are instances/methods.
// The object will encapsulate the settingContext overrides/defaults
export const WordsToBeRecited = (
  pageLists: CPageLists,
  termIdx: number,
  span: number = 0
): string[] => {
  let words: string = "";
  let strQ: string[] = [];
  // words from termIdx to termIdx + span (or end of sentence, whichever)
  // comes first
  let minLastIdx: number = Math.min(
    span + termIdx,
    pageLists.sentenceList[pageLists.terminalList[termIdx].sentenceIdx]
      .lastTermIdx
  );
  for (let idx = termIdx; idx <= minLastIdx; idx++) {
    words += ` ${
      pageLists.terminalList[idx].altpronunciation !== ""
        ? pageLists.terminalList[idx].altpronunciation
        : pageLists.terminalList[idx].content
    }`;
  }
  // add punctuation iff idx === lastTermIdx
  if (
    minLastIdx ===
    pageLists.sentenceList[pageLists.terminalList[termIdx].sentenceIdx]
      .lastTermIdx
  )
    words +=
      pageLists.sentenceList[pageLists.terminalList[termIdx].sentenceIdx]
        .lastPunctuation;
  strQ.push(words);
  return strQ;
};
export const SentenceToBeRecited = (
  pageLists: CPageLists,
  sentenceIdx: number,
  lastTermIdxInSentence?: number,
  lastPunctuation?: string
): string[] => {
  let strQ: string[] = [];
  let firstTermIdx: number = pageLists.sentenceList[sentenceIdx].firstTermIdx;
  let lastTermIdx: number;
  if (lastTermIdxInSentence === undefined) {
    lastTermIdx = pageLists.sentenceList[sentenceIdx].lastTermIdx;
    lastPunctuation = pageLists.sentenceList[sentenceIdx].lastPunctuation;
  } else {
    lastTermIdx = lastTermIdxInSentence;
  }
  let str: string = "";
  str = ` ${
    WordsToBeRecited(pageLists, firstTermIdx, lastTermIdx - firstTermIdx)[0]
  }${lastPunctuation}`;
  strQ.push(str);
  return strQ;
};
export const SectionToBeRecited = (
  pageLists: CPageLists,
  sectionIdx: number
): string[] => {
  //find sentences in section. unfortunately, the sectionlist only has first and last terminal idxs and not sentences
  let strQ: string[] = [];
  let firstTermIdx: number = pageLists.sectionList[sectionIdx].firstTermIdx;
  let lastTermIdx: number = pageLists.sectionList[sectionIdx].lastTermIdx;
  let firstSentenceIdx: number =
    pageLists.terminalList[firstTermIdx].sentenceIdx;
  let lastSentenceIdx: number = pageLists.terminalList[lastTermIdx].sentenceIdx;
  for (
    let sentenceIdx = firstSentenceIdx;
    sentenceIdx <= lastSentenceIdx;
    sentenceIdx++
  ) {
    strQ = strQ.concat(SentenceToBeRecited(pageLists, sentenceIdx));
  }
  return strQ;
};
export const ReciteButtonIcon = (
  scope: RecitationScopeEnumType = RecitationScopeEnumType.words,
  reference: RecitationReferenceEnumType = RecitationReferenceEnumType.following,
  placement: RecitationPlacementEnumType = RecitationPlacementEnumType.unchanged,
  listening: RecitationListeningEnumType = RecitationListeningEnumType.notListening,
  span: number = 1
): string => {
  // Basic recite button (three concentric right-facing convex arcs) stops
  // after reciting current word
  // With addition of
  // - plus sign appended denoting advance cursor beyond next word, sentence
  // - ellipses prepended denoting upto parital sentence/multiple-word scope
  // - ellipses prepended and dot appended denoting stop reciting at end of
  //   sentence
  //
  let imageFile: string; // ReciteScopeEnumType.label (default image)
  switch (scope) {
    case RecitationScopeEnumType.section: {
      if (placement === RecitationPlacementEnumType.end) {
        imageFile = reciteSectionAdvanceInactiveIcon;
      } else {
        imageFile = reciteSectionInactiveIcon;
      }
      break;
    }
    case RecitationScopeEnumType.sentence: {
      if (placement === RecitationPlacementEnumType.end) {
        imageFile = reciteSentenceAdvanceInactiveIcon;
      } else {
        imageFile = reciteSentenceInactiveIcon;
      }
      break;
    }
    case RecitationScopeEnumType.words: {
      if (placement === RecitationPlacementEnumType.end) {
        imageFile = reciteWordAdvanceInactiveIcon;
        imageFile = speakInactiveIcon;
      } else {
        // imageFile = "button_recite_word.png";
        imageFile = reciteWordInactiveIcon;
        imageFile = speakInactiveIcon;
      }
      break;
    }
    default: {
      imageFile = reciteWordInactiveIcon;
    }
  }
  return imageFile;
};
// export const ReciteSomething = (something: number, rate: number) => {};
export const ReciteButton = () => {
  const dispatch = useAppDispatch();
  // const [reciteActivated, setReciteActivated] = useState(false);
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  //should be a structure that is updated at once
  const [recitationScope, setRecitationScope] = useState(
    settingsContext.settings.speech.scope
  );
  const [recitationQueue, setRecitationQueue] = useState([] as string[]);
  const [recitationStartIdx, setRecitationStartIdx] = useState(IDX_INITIALIZER);
  const [recitationSpan, setRecitationSpan] = useState(0);
  const [recitationPassThru, setRecitationPassThru] = useState([] as string[]);
  // const [reciteButtonToggled, setReciteButtonToggled] = useState(false); // recite button request
  const [reciteButtonActive, setReciteButtonActive] = useState(false); // recite button request
  // const [reciteButtonStartRequested, setReciteButtonStartRequested] = useState(false);
  // const [reciteButtonCancelRequested, setReciteButtonCancelRequested] = useState(false); 
  // const [reciteApiStartRequested, setReciteApiStartRequested] = useState(false);
  // const [reciteApiCancelRequested, setReciteApiCancelRequested] = useState(false); 
  // const [reciteNow, setReciteNow] = useState(false); // actual recite state
  const [reciteActive, setReciteActive] = useState(false); // recite statefrom button or API
  // const [reciteComplete, setReciteComplete] = useState(false); // Synthesizer onend callback

  // state for reciteRequestDetected
  const [recitingInProgress, setRecitingInProgress] = useState(false); // Synthesizer onend callback
  // const [reciteButtonRequested, setReciteButtonRequested] = useState(false); // recite button click
  // const [reciteRequested, setReciteRequested] = useState(false);
  const reciteApiActive = useAppSelector(store=>store.recite_requested); // recite API state request
  const reciteApiSpan: number = useAppSelector(
    store=>store.recite_requested_span);
    
  const reciteApiSectionIdx: number = useAppSelector(
    store=>store.recite_requested_sectionIdx);
  const reciteApiSentenceIdx: number = useAppSelector(
    store=>store.recite_requested_sentenceIdx);
  const reciteApiPassThru: string = useAppSelector(
    store => store.recite_requested_passthru);
  const reciteApiWordIdx: number = useAppSelector(
    store=>store.recite_requested_wordIdx);
  const reciteApiScope: RecitationScopeEnumType = useAppSelector(
    store => store.recite_requested_scope
  );
  // const recite: RecitationScopeEnumType = useAppSelector(
  //   store => store.recite_requested_scope
  // );
  const currentTermIdx = useAppSelector(store => store.cursor_terminalIdx);
  const pageLists: CPageLists = useContext(PageContext)!;
  // recite requests that do not originate from Recite_start() and not this recite button
  // const reciteStartRequested = useAppSelector(
  //   store => store.recite_requested
  // );
  // const reciteApiToggled = useAppSelector(
  //   store => store.recite_requested
  // );
  // Generalizes recite requests from recite button and programmatically into
  // recitationScope, recitationStartIdx, recitationSpan, 
  // recitationPassThru that are subsequently translated into recitationQueue
  // useEffect(() => {
  //     console.log(`Recitebutton: reciteButtonRequested=${reciteButtonRequested}`);   
  // }, [reciteButtonRequested]);

  // translate reciteButtonActive and reciteApiActive into reciteActive. These 
  // are separate useEffect() to eliminate the additional state variable and 
  // logic required to detect which of the (i.e., control or API) state 
  // variables actually changed. 
  useEffect(() => {
    Synthesizer.volume = settingsContext.settings.speech.volume;
    Synthesizer.selectedVoiceIndex =
      settingsContext.settings.speech.selectedVoiceIndex;
  }, [
    settingsContext.settings.speech.selectedVoiceIndex,
    settingsContext.settings.speech.volume
  ]);
  useEffect(() => {
    setRecitationScope(settingsContext.settings.speech.scope);
  },[settingsContext.settings.speech.scope])
  useEffect(() => {
    console.log(`Recite(): currentTermIdx=${currentTermIdx}`);
    setRecitationStartIdx(currentTermIdx)
  },[currentTermIdx])
  // useEffect(() => {
  //   if (reciteButtonActive || reciteApiActive) {
  //     setRecitationScope(settingsContext.settings.speech.scope);
  //   } else if (!reciteButtonActive && !reciteApiActive) {
  //     setReciteActive(false) 
  //   } else {
  //   // do nothing
  //   }
  // },[reciteButtonActive, reciteApiActive])
  // useEffect(() => {
  //   setReciteActive(reciteApiActive)
  // },[reciteApiActive])
  /////////////////////////////
  // recite button toggled true
  useEffect(() => {
    if (!reciteActive) {
    }
  },[reciteActive]
)
  useEffect(() => {
    if (!reciteActive && reciteButtonActive) {
    console.log(`Recite(): reciteButton activated1`)
    setReciteActive(true)
    } else if (reciteActive && !reciteButtonActive) {
    console.log(`Recite(): recite deactivated1`)
    setReciteActive(false)
      console.log(`Recite(): speak deactivated############`)
      Synthesizer.cancel()
  }
  },[reciteActive, reciteButtonActive])
  useEffect(() => {
    if (reciteActive && !reciteButtonActive)
    console.log(`Recite(): reciteButton activated2`)  
  },[reciteActive, reciteButtonActive])
  useEffect(() => {
    if (reciteActive && !reciteButtonActive)
    console.log(`Recite(): recite deactivated2`)
      console.log(`Recite(): speak deactivated############`)
      Synthesizer.cancel()
  },[reciteActive, reciteButtonActive])
  useEffect(() => {
    console.log(`Recite(): reciteButtonActive=
      ${reciteButtonActive},
      currentTermIdx=${currentTermIdx},
      settingsContext.settings.speech.scope=${settingsContext.settings.speech.scope},
      `);
    if (pageLists) {
      if (reciteActive && reciteButtonActive) {
        // setReciteActive(true)
        console.log(`Recite(): 1 #2 reciteActive to true`);

        setRecitationScope(settingsContext.settings.speech.scope);
        switch(recitationScope) {
        case RecitationScopeEnumType.words:
          setRecitationStartIdx(currentTermIdx); 
          break;
        case RecitationScopeEnumType.sentence:
          setRecitationStartIdx(pageLists.terminalList[currentTermIdx].sentenceIdx);
          break;
        case RecitationScopeEnumType.section:
          setRecitationStartIdx(pageLists.terminalList[currentTermIdx].sectionIdx);
          break;
        default:
          console.log(`Invalid RecitationScope encountered=${recitationScope} 
            defaulting to words`);
            setRecitationScope(RecitationScopeEnumType.words)
            setRecitationStartIdx(currentTermIdx); 
        }
        // Allow subsequent useEffect() interpret and fill the recitation queue
        // console.log(`reciteActive: currentTermIdx=${currentTermIdx}`);
        // setRecitationSpan(0);
    //   } else if (!reciteButtonActive && reciteActive) {
    //     // button cancels recite request 
    //     setReciteActive(false);
    //     console.log(`Recite(): 1 #1 reciteActive to false`)
    //     console.log(`Recite(): CANCEL BUTTON REQUESTED: reciteButtonActive=${reciteButtonActive}`);
    // } else if (reciteButtonActive && reciteActive) {
    //   // do nothing because already active
    //     console.log(`Recite(): Keep doing whatever`);
    // } else {
    //   // do nothing because already active
    //     console.log(`Recite(): Keep doing nothing`);
    }
  }
  },[
    reciteActive, 
    reciteButtonActive,
    recitationScope,
    currentTermIdx, 
    settingsContext.settings.speech.scope,
    pageLists
    ])
  ///////////////////////////
  // recite_start api called
  useEffect(() => {
    console.log(`Recite(): reciteApiActive=${reciteApiActive}
      currentTermIdx=${currentTermIdx},
      reciteApiScope=${reciteApiScope},
      reciteApiPassThru=${reciteApiPassThru},
      settingsContext.settings.speech.scope=${settingsContext.settings.speech.scope},
      `);
    if (!reciteActive && reciteApiActive) {
      setReciteActive(true)
      console.log(`Recite(): 1 #1 reciteActive to true`);
    // update state variables needed to update recitationQueue
    // need to handle passThru case
      setRecitationScope(reciteApiScope)
      switch (reciteApiScope) {
        case RecitationScopeEnumType.words:
          if (reciteApiWordIdx >= 0)
            setRecitationStartIdx(reciteApiWordIdx)
          else 
            setRecitationStartIdx(currentTermIdx)
          setRecitationSpan(reciteApiSpan)
          break;
        case RecitationScopeEnumType.sentence:
          setRecitationStartIdx(reciteApiSentenceIdx)
          break;
        case RecitationScopeEnumType.section:
          setRecitationStartIdx(reciteApiSectionIdx)
          break;
        case RecitationScopeEnumType.passThru:
          setRecitationPassThru([reciteApiPassThru])
          break;
        default:
          console.log(`unsupported scope=${reciteApiScope} defaulting to settings`);
          setRecitationScope(settingsContext.settings.speech.scope);
          console.log(`scope=${reciteApiScope}`);
      } 
    } else if (reciteActive && !reciteApiActive) {
      // programmatically cancels recite request
              console.log(`Recite(): 1 #2 reciteActive to false`)

      setReciteActive(false);
    } else {
      // do nothing because already inactive
    }
  },[
    reciteActive,
    reciteApiActive, 
    currentTermIdx, 
    reciteApiScope, 
    reciteApiSpan,
    reciteApiWordIdx,
    reciteApiSentenceIdx,
    reciteApiSectionIdx,
    reciteApiPassThru, // resetting to [] mutates state
    recitationPassThru,
    settingsContext.settings.speech.scope,
    dispatch
  ])
  //////////////////////////////
  // recite active false
useEffect(() =>{
  if (reciteActive && !reciteButtonActive && !reciteApiActive) {
    console.log(`Recite(): recite canceled`);
    // reciteButtonActive and reciteApiActive cannot be both true 
    // So if both are false, and reciteActive is true then one of them just 
    // turned false
    Synthesizer.cancel(); // cancel asynchronous
    // setRecitingInProgress(false); // Synthesizer.speak() onerror() should set this
    // dispatch(Request.Recite_stop());
    setReciteButtonActive(false);
            console.log(`Recite(): 1 #1 reciteButtonActive to false`);
    dispatch(Request.Recite_ended()); //  setReciteApiActive(false) indirectly
    setReciteActive(false)
            console.log(`Recite(): 1 #3 reciteActive to false`)

  }
},[
  reciteActive, 
  reciteButtonActive, 
  reciteApiActive, 
  dispatch
])
  ///////////////////////
  // Fill recitationQueue
  useEffect(() => {
  // filling of recitationQueue and emptying of the queue are independent
  // (separate useEffects) to avoid read/write collisions. However, the
  // current logic overwrites the queue with the new request instead of 
  // appending to the queue. This design decision simplifies the
  // logic by avoiding the need to manage the queue i.e., excluding
  // queue changes from shift vs dependencies actually reflect additions
  // to the queue.
  let validTerminalList: boolean = false
  if (!pageLists || !reciteActive || pageLists.terminalList.length === 0)
    return // pageLists not available yet but was included in dependency list
  else
      validTerminalList = pageLists.terminalList.length > 0

    console.log(`Recite(): filling recitationQueue`);
  switch (recitationScope) {
    case RecitationScopeEnumType.words:
      if (!validTerminalList || recitationStartIdx < 0) break;
      if (recitationSpan === 0) {
        // refactor without strQ when fully debugged
        const strQ: string[] = WordsToBeRecited(pageLists, recitationStartIdx);
        console.log(`Recite(): word=${strQ[0]}`);
        setRecitationQueue([...strQ]);
      } else {
        setRecitationQueue(
          SentenceToBeRecited(
            pageLists, recitationStartIdx
            // pageLists.terminalList[recitationStartIdx].sentenceIdx,
            // pageLists.terminalList[recitationStartIdx].sentenceIdx,
            // recitationStartIdx - 1, // excluding current terminal
            // "?" // not end of sentence
          )
        );
      }
      // console.log(`recitationQueue=${recitationQueue}`);
      break;
    case RecitationScopeEnumType.sentence:
      if (!validTerminalList || recitationStartIdx < 0) break;
      let sentenceList: string[] = SentenceToBeRecited(
          pageLists,
          recitationStartIdx
          // pageLists.terminalList[recitationStartIdx].sentenceIdx
        );
      console.log(`Recite(): sentence=${sentenceList[0]}`);
      setRecitationQueue(sentenceList); 
      // console.log(`recitationQueue.length=${recitationQueue.length}`);
      break;
    case RecitationScopeEnumType.section:
      if (!validTerminalList || recitationStartIdx < 0) break;
      // console.log(`reciteButton: currentTermIdx=${recitationStartIdx}`);
      setRecitationQueue(
        SectionToBeRecited(
          pageLists,
          recitationStartIdx
        )
      );
      break;
    case RecitationScopeEnumType.passThru:
      console.log(`Recite(): recitationPassThru=${recitationPassThru[0]}`)
      setRecitationQueue(recitationPassThru);
      break;
    default:
    }
}, [reciteActive, 
  recitationPassThru,
  recitationScope, 
  recitationStartIdx, 
  recitationSpan, 
  reciteApiPassThru, 
  currentTermIdx, 
  pageLists
  ])
    /////////////////////////
    // Consume recitationQueue
  useEffect(() => {
    console.log(`Recite(): consuming recitationQueue reciteActive=${reciteActive} recitingInProgress=${recitingInProgress} recitationQueue.length=${recitationQueue.length}`);
    let sentence: string;
    if (recitingInProgress) {
      // Actively reciting -- do nothing else until 
      // synthesizer onend() event resets recitingInProgress
      console.log(`Recite(): activated and reciting in progress`);
    } else if (recitationQueue.length > 0) { 
      // recitation queue still has entries and not currently reciting
      // ELSE condition where recitingInProgress or not
      // user activated and not currently reciting and something to recite
      sentence = recitationQueue.shift()!;
      console.log(`Recite(): recite: sentence=${sentence}`);
      setRecitingInProgress(true);
      console.log(`Recite(): recite starting: sentence=${sentence} recitationQueue.length=${recitationQueue.length}`);
      dispatch(Request.Recite_active()); // communicate to other components
      console.log(`Recite(): recite speaking: sentence=${sentence} recitationQueue.length=${recitationQueue.length}`);
      Synthesizer.speak(sentence, setRecitingInProgress);
      setRecitationQueue([...recitationQueue]);
      console.log(`Recite(): recited: sentence=${sentence} recitationQueue.length=${recitationQueue.length} recitingInProgress=${recitingInProgress}`);
    // } else if (!recitingInProgress) { // same as else given 2nd condition above
    //   // Still active but reciting is no longer in progress and recitation queue
    //   // is empty
    //   console.log(`++++recitation Queue is empty and reciting not in progress`);
    //   setReciteActive(false);
    //   console.log(`++++1`);
    //   dispatch(Request.Recite_inactive()); // communicate to other components
      // dispatch(Request.Recite_ended()); // communicate to other components    
    } else {
      console.log(`Recite(): nothing left`);
    } 
    // if (reciteActive && !recitingInProgress) {
    //   setReciteActive(false);
    //   console.log(`Recite(): 1`);
    //   dispatch(Request.Recite_inactive()); // communicate to other components
    // }
  }, [ reciteActive, recitationQueue, recitationQueue.length, recitingInProgress, dispatch]);
  useEffect(()=> {
    console.log(`Recite(): 1**************************************`)
    console.log(`Recite(): 1recitingInProgress changed to ${recitingInProgress}`)
  }, [recitingInProgress])
  useEffect(()=> {
    console.log(`Recite(): 1*************************************`)
    console.log(`Recite(): 1reciteActive changed to ${reciteActive}`)
  }, [reciteActive])
  useEffect(()=> {
    console.log(`Recite(): 1reciteActive=${reciteActive} recitingInProgress=${recitingInProgress}`)
  }, [reciteActive, recitingInProgress])
  useEffect(()=> {
    if (recitingInProgress) {
      dispatch(Request.Recite_active())
      console.log(`Recite(): 2`);
      console.log(`Recite(): recitingInProgress`)
    } else {
      dispatch(Request.Recite_inactive())
      setReciteActive(false);
              console.log(`Recite(): 2 #4`)

      console.log(`Recite(): 3`);
      console.log(`Recite(): not recitingInProgress`)
    }
  }, [recitingInProgress, dispatch])
  /////////////////////////
  // Terminate and cleanup
  useEffect(() => {
    // const sleep = async (ms: number) => {
    //   console.log(`++++waiting for ${ms}ms`)
    //   await new Promise((resolve) => setTimeout(resolve, ms));
    // }

    if (reciteActive && !recitingInProgress) {
      console.log(`Recite(): 4`);
      console.log(`Recite(): reciting clean up: recitingInProgress=false`);
      // sleep(5000);
      setReciteActive(false)
              console.log(`Recite(): 2 #5`)

      setReciteButtonActive(false)
                  console.log(`Recite(): 1 #2 reciteButtonActive to false`);

      dispatch(Request.Recite_inactive()); // communicate to other components
      dispatch(Request.Recite_ended())
    }
  },[
    reciteActive,
    recitingInProgress, 
    reciteApiActive, 
    reciteButtonActive, 
    dispatch
  ])
  useEffect(() => {
    if (!reciteActive) {
      console.log(`Recite(): reciteActive is false`);
      // console.log(`recitingActive is ${reciting}`);
    setReciteButtonActive(false)
    }
  },[reciteActive])
/****
  useEffect(() => { 
    if (!reciteActive)
        Synthesizer.cancel(); // cancel asynchronous
        setRecitingInProgress(false); // Synthesizer.speak() onend() should set this
        dispatch(Request.Recite_stop());
  },[reciteActive])
    useEffect(() => {
    if (recitationQueue.length === 0) {
            console.log(`queue is empty`);
          setReciteRequested(false);
        setReciteButtonRequested(false);
        Synthesizer.cancel(); // cancel asynchronous
        setRecitingInProgress(false); // Synthesizer.speak() onend() should set this
        dispatch(Request.Recite_stop());
    }
    },[dispatch, recitationQueue, reciteActive, recitingInProgress])
    useEffect(() => {
    },[reciteActive])
    if (recitationQueue.length === 0) {
            console.log(`queue is empty`);
          setReciteRequested(false);
        setReciteButtonRequested(false);
        Synthesizer.cancel(); // cancel asynchronous
        setRecitingInProgress(false); // Synthesizer.speak() onend() should set this
        dispatch(Request.Recite_stop());

//   useEffect(() => {
//     if (!reciteActive && (reciteButtonActive || reciteApiActive)) {
//       setReciteActive(true);
//     } else {
//       setReciteActive(false);
//     }
// },[reciteActive, reciteButtonActive, reciteApiActive])

  // translate API start and stop requests
  // useEffect(() => {
  //   // surrogate for reciteStartRequested
  //   if (!reciteNow && reciteStartRequested) setReciteApiStartRequested(reciteStartRequested) {

  //   }
  // },[reciteNow, reciteStartRequested])

  useEffect(() => {
    // surrogate for reciteCancelRequested
    if (reciteNow && !reciteStartRequested)
     setReciteApiStartRequested(false);
  },[reciteNow, reciteStartRequested])
  
  useEffect(() => {
    if (reciteButtonToggled && !reciteButtonStartRequested) {
        setReciteButtonStartRequested(true);
        setReciteButtonCancelRequested(false);
        console.log(`1ReciteButtonToggled=${reciteButtonToggled}, reciteButtonStartRequested=${reciteButtonStartRequested},reciteButtonCancelRequested=${reciteButtonCancelRequested}`);
    } else if (!reciteButtonToggled && reciteButtonStartRequested) {
        setReciteButtonStartRequested(false);
        setReciteButtonCancelRequested(true);
        console.log(`2ReciteButtonToggled=${reciteButtonToggled}, reciteButtonStartRequested=${reciteButtonStartRequested},reciteButtonCancelRequested=${reciteButtonCancelRequested}`);
    } else {
        console.log(`3ReciteButtonToggled=${reciteButtonToggled}, reciteButtonStartRequested=${reciteButtonStartRequested},reciteButtonCancelRequested=${reciteButtonCancelRequested}`);
      // current state - no change in recite button state
    }
    }, [reciteButtonToggled, reciteButtonStartRequested, reciteButtonCancelRequested]);
  useEffect(() => {
    if (reciteApiToggled && !reciteApiStartRequested) {
        setReciteApiStartRequested(true);
        setReciteApiCancelRequested(false);
        console.log(`1ReciteApiToggled=${reciteApiToggled}, reciteApiStartRequested=${reciteApiStartRequested},reciteApiCancelRequested=${reciteApiCancelRequested}`);
    } else if (!reciteApiToggled && reciteApiStartRequested) {
        setReciteApiStartRequested(false);
        setReciteApiCancelRequested(true);
        console.log(`2ReciteApiToggled=${reciteApiToggled}, reciteApiStartRequested=${reciteApiStartRequested},reciteApiCancelRequested=${reciteApiCancelRequested}`);
    } else {
        console.log(`3ReciteApiToggled=${reciteApiToggled}, reciteApiStartRequested=${reciteApiStartRequested},reciteApiCancelRequested=${reciteApiCancelRequested}`);
      // current state - no change in recite API state
    }
    }, [reciteApiToggled, reciteApiStartRequested, reciteApiCancelRequested]);
    
    useEffect(() => {
      if (!reciteNow && (reciteButtonStartRequested || reciteApiStartRequested)) {
        console.log(`reciteNow=${reciteNow}`);
        setReciteNow(true)
      }
    },[reciteNow, reciteButtonStartRequested, reciteApiStartRequested])

    useEffect(() => {
      if (reciteNow && (reciteButtonStartRequested || reciteApiStartRequested)) {
        console.log(`reciteNow=${reciteNow}`);
        setReciteNow(true)
      }
    },[reciteNow, reciteButtonStartRequested, reciteApiStartRequested])

  // generic recite request logic below based on reciteNow state variable 
  useEffect(() => {
    if (reciteNow) {
      setRecitationScope(reciteApiScope)
      setRecitationStartIdx(currentTermIdx); // don't care
      setRecitationSpan(0);
    }
  }, [reciteNow, currentTermIdx, reciteApiScope]);

    useEffect(() => {
    if (reciteButtonRequested && !reciteRequested && !recitingInProgress) 
      console.log(`Recite: recite button clicked`);
    else if (!reciteButtonRequested && (reciteRequested || recitingInProgress))
      console.log(`Recite: cancel recite button clicked`);
    else 
      console.log(`something besides reciteButtonRequested triggered ${currentTermIdx}, 
    ${reciteButtonRequested}, ${reciteRequested},${recitingInProgress}`);


    if (reciteButtonRequested) {
      console.log(`Recite: recite button clicked reciteButtonRequested=${reciteButtonRequested}`);
      if (!reciteRequested || !recitingInProgress) {
        console.log(`Recite: recite request reciteButtonRequested=${reciteButtonRequested}`);
        setRecitationScope(settingsContext.settings.speech.scope);
        setRecitationStartIdx(currentTermIdx);
        setRecitationSpan(0);
        // setReciteButtonRequested(false);
        setReciteRequested(true);
        console.log(`Recite: recite request currentTermIdx=${currentTermIdx}`);
      }
      else {
        // recite button requested recite requested AND reciting in progress: continue reciting

        // already reciting so this should not happen unless some other 
        // dependency triggers: likely currentTermIdx and not scope
        // console.log(`Recite: 1recite cancel request reciteButtonRequested=${reciteButtonRequested}`);
        // console.log(`Recite: 2recite button while already in progress - canceling}`)
        // setReciteRequested(false);
        // setRecitingInProgress(false);
        // Synthesizer.cancel(); // cancel asynchronous
        // // setRecitationQueue([]);
        // dispatch(Request.Recite_stop());
      }
    } else {
      if (reciteRequested || recitingInProgress) {
        // recite button not requested: cancel recitation iff recite requested or reciting in progress
        console.log(`Recite: recite cancel request reciteButtonRequested=${reciteButtonRequested} recitingInProgress=${recitingInProgress}`);
        console.log(`Recite: 1recite cancel request reciteButtonRequested=${reciteButtonRequested}`);
        console.log(`Recite: 2recite button while already in progress - canceling}`)
        setReciteRequested(false);
        // setRecitingInProgress(false);
        // Synthesizer.cancel(); // cancel asynchronous
        setRecitationQueue([]);
        dispatch(Request.Recite_stop());
      }
    }
  }, [currentTermIdx, dispatch, reciteRequested, reciteButtonRequested, recitingInProgress, 
    settingsContext.settings.speech.scope]);
  // useEffect(() => {
  //   if (reciteRequested && recitingInProgress) {
  //       // recite button while reciting in progress => cancel recitation
  //       console.log(`Recite: recite button while already in progress - canceling}`)
  //       setReciteRequested(false);
  //       Synthesizer.cancel(); // cancel asynchronous
  //       setRecitingInProgress(false);
  //       setRecitationQueue([]);
  //       dispatch(Request.Recite_stop());
  //   }
  // }, [reciteButtonRequested, reciteRequested, recitingInProgress]);
  useEffect(() => {
      if (reciteButtonRequested && recitingInProgress) {
        console.log(`Recite: recite button and in progress: ${reciteButtonRequested} ${recitingInProgress}`)
      }
  }, [reciteButtonRequested,recitingInProgress]);

  useEffect(() => {
    if (reciteStartRequested) {
      console.log(`Recite: process API request`);
      setRecitationScope(reciteApiScope)
      setRecitationStartIdx(currentTermIdx); // don't care
      setRecitationSpan(0);
      setReciteRequested(true);
    }
  }, [reciteStartRequested, currentTermIdx, reciteApiScope, recitingInProgress]);
  // useEffect(() => {
  //   console.log(
  //     `@@@ reciteStartRequested=${reciteStartRequested} strq.length=${recitePassthru.length}`);
  //   if (reciteStartRequested && recitePassthru.length > 0) {
  //     setRecitationScope(RecitationScopeEnumType.passThru);
  //     setRecitationQueue(recitePassthru);
  //     setReciteRequested(true);
  //     // dispatch(Request.Recite_stop())
  //   } else {
  //     // ignore - only passthru supported for indirect recite requests
  //   }
  // }, [reciteStartRequested, recitePassthru]);
  useEffect(() => {
    Synthesizer.volume = settingsContext.settings.speech.volume;
    Synthesizer.selectedVoiceIndex =
      settingsContext.settings.speech.selectedVoiceIndex;
  }, [
    settingsContext.settings.speech.selectedVoiceIndex,
    settingsContext.settings.speech.volume
  ]);
  // Translates reciteStartRequested and reciteButtonRequested into recitation 
  // queue based on recitationScope
  useEffect(() => {
    console.log(`reciteRequested=${reciteRequested}`);
    // scope defaults to setting unless inlinebutton
    // console.log(`reciteButton: currentTermIdx=${currentTermIdx}`);
    console.log(
      `reciteRequested:recitationScope=${recitationScope}, termIdx=${recitationStartIdx}`
    );
    if (reciteRequested) {
      const validTerminalList = pageLists.terminalList.length > 0;
      switch (recitationScope) {
        case RecitationScopeEnumType.words:
          if (!validTerminalList) break;
          if (recitationSpan === 0) {
            const strQ: string[] = WordsToBeRecited(pageLists, recitationStartIdx);
            console.log(`word=${strQ[0]}`);
            setRecitationQueue(strQ);
          } else {
            setRecitationQueue(
              SentenceToBeRecited(
                pageLists,
                pageLists.terminalList[recitationStartIdx].sentenceIdx,
                currentTermIdx - 1, // excluding current terminal
                "?" // not end of sentence
              )
            );
          }
          console.log(`recitationQueue=${recitationQueue}`);
          break;
        case RecitationScopeEnumType.sentence:
          if (!validTerminalList) break;
          let sentenceList: string[] = SentenceToBeRecited(
            pageLists,
            pageLists.terminalList[recitationStartIdx].sentenceIdx
          );
          console.log(`sentence=${sentenceList[0]}`);
          setRecitationQueue(sentenceList); 
          console.log(`recitationQueue.length=${recitationQueue.length}`);
          break;
        case RecitationScopeEnumType.section:
          if (!validTerminalList) break;
          console.log(`reciteButton: currentTermIdx=${recitationStartIdx}`);
          setRecitationQueue(
            SectionToBeRecited(
              pageLists,
              pageLists.terminalList[recitationStartIdx].sectionIdx
            )
          );
          break;
        case RecitationScopeEnumType.passThru:
          setRecitationQueue(reciteStartRequestedPassthru);
          break;
        default:
      }
    }
  }, [reciteRequested, recitationQueue, recitationScope, currentTermIdx, 
    reciteStartRequestedPassthru,recitationStartIdx,recitationSpan,pageLists]);
  // useEffect(() => {

  // Reciting until recitationQueue is empty
  useEffect(() => {
    let sentence: string;
    if (recitationQueue.length === 0) {
      console.log(`queue is empty`);
    } else if (recitingInProgress) {
      // Activated but not actively reciting -- do nothing else until 
      // synthesizer onend() event resets recitingInProgress
      console.log(`activated and reciting in progress`);
    } else if (recitationQueue.length > 0) {
      // user activated and not currently reciting and something to recite
      sentence = recitationQueue.shift()!;
      console.log(`recite: sentence=${sentence}`);
      setRecitingInProgress(true);
      Synthesizer.speak(sentence, setRecitingInProgress);
      dispatch(Request.Recite_started()); // communicate to other components
      setRecitationQueue([...recitationQueue]);
      console.log(`recited: sentence=${sentence} recitationQueue.length=${recitationQueue.length}`);
    } else if (!recitingInProgress) {
      // Still active but reciting is no longer in progress and recitation queue
      // is empty
      console.log(`recitation Queue is empty but reciting in progress`);
      setReciteRequested(false);
      dispatch(Request.Recite_ended()); // communicate to other components    
    } else {
      console.log(`recitation unknown state reached`);

    }
  }, [dispatch, recitationQueue, recitingInProgress]);
    useEffect(() => {
    if (recitationQueue.length === 0 && reciteRequested) {
            console.log(`queue is empty`);
          setReciteRequested(false);
        setReciteButtonRequested(false);
        Synthesizer.cancel(); // cancel asynchronous
        setRecitingInProgress(false); // Synthesizer.speak() onend() should set this
        dispatch(Request.Recite_stop());
    }
    },[dispatch, recitationQueue, reciteRequested, recitingInProgress])
useEffect(() => {
  console.log(`useEffect(): recitingInProgress=${recitingInProgress}, reciteRequested=${reciteRequested}`);
}, [recitingInProgress]);
// //   /////////////////
// //   // end reciting
//   useEffect(() => {
//     if (!recitingInProgress && recitationQueue.length ===0) {
//       console.log(`recitation Queue is empty but reciting in progress`);
//       setReciteRequested(false);
//       dispatch(Request.Recite_stop())
//     }
// }, [recitationQueue, recitingInProgress]);
  // if currently listening, stop and restart after reciting

  // given all the array accessing, should wrap in try/catch
  // ,
  //     [
  //       pageContext.sectionList,
  //       pageContext.sentenceList,
  //       pageContext.terminalList,
  //       recitationScope,
  //       wordToRecite
  //     ]
  //   );
  ***/
  let reciteInactiveIcon: string = ReciteButtonIcon(
    settingsContext.settings.speech.scope,
    RecitationReferenceEnumType.following, // or not
    settingsContext.settings.speech.placement
  );
  dispatch(Request.Recognition_stop);
  const reciteClicked = () => {
    // setReciteButtonRequested(!reciteButtonRequested);
    // setReciteButtonToggled(!reciteButtonToggled)
    // setReciteButtonRequested(!reciteButtonActive)
    // Use reciteActive so that when (reciteApiActive===true &&
    // reciteButtonActvie===false) can be canceled along with
    // reciteButtonActive===true && don't care)
    setReciteButtonActive(!reciteActive)
                console.log(`Recite(): 1 #3 reciteButtonActive to false`);

  };
  // console.log(`Recite(): reciteButtonClicked reciteButtonActive=${reciteButtonActive} reciteRequested=${reciteRequested} recitingInProgress=${recitingInProgress}`);
  console.log(`Recite(): buttonClicked:  reciteButtonActive=${reciteButtonActive} reciteApiActive=${reciteApiActive} reciteActive=${reciteActive} recitingInProgress=${recitingInProgress}`);
  return (
    <>
      <img
        className="icon"
        alt="recite"
        src={
          window.speechSynthesis === null
            ? speakGhostedIcon
            : (recitingInProgress)
            ? speakActiveIcon
            : reciteInactiveIcon
        }
        title="start/stop reciting"
        onClick={reciteClicked}
      />
    </>
  );
};
