/** Copyright (C) 2020 - 2025 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_recite1.tsx
 *
 *  Supersedes reactcomp_recite.tsx
 *
 * Defines React recitation behavior initiated by and reflected in the front
 * end recite button and the API-based inlineButton functional component buttons.
 * The majority of the functionality of the aformentioned components overlap
 * AND the cancel button for the latter is also controlled by the toggling of 
 * recite button.
 *
 * Sequence of event:
 * 1) REQUEST
 *    1a) ReciteButton clicked (component state reciteButtonActivated) OR
 *    1b) api start (reducer state state.recite_requested)
 *    isReciteRequested=true triggers validation.
 *
 * 2) VALIDATE PARAMETERS
 *    When requested, recitation parameters from button or API are validated 
 *    and generalized so that queuing logic can be shared..
 *    isReciteValidated=true triggers queuing recitation. 
 * 
 * 3) POPULATE RECITATION LIST 
 *    When validated, recitation list is populated with  string of words, 
 *    sentences or sections to be recitedbased on requested scope:
 *    words, sentence, section based on scope and position: current terminal 
 *    idx, api specified word idx, sentence idx or section idx. 
 *
 * 4) SYNTHESIZE RECITATION LIST
 *    When populated, speaking is initiated as reflected by isReciteInProgress.
 *    Since this action does not block (executes asynchronously), its 
 *    completion can be detected when isReciteInProgress is set to false. This
 *    action can be asynchronously cancelled by the user clicking the recite 
 *    button that immediately cancels speaking and resets isReciteInProgress.
 * 
 * 5) CLEANUP
 *    When reciting is completed or cancelled, the state variables are reset.
 * 
 *    Changes the ReciteButtonIcon to active and recite button icon change.
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
// import reciteLabelInactiveIcon from "./img/button_recite.png";
// import reciteHintInactiveIcon from "./img/button_cues_color.png";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";
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
): string => {
  let words: string = "";
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
  return words;
};
export const SentenceToBeRecited = (
  pageLists: CPageLists,
  sentenceIdx: number,
  lastTermIdxInSentence?: number, // recite partial sentences
  lastPunctuation?: string
): string => {
  let sentence: string = "";
  let firstTermIdx: number = pageLists.sentenceList[sentenceIdx].firstTermIdx;
  let lastTermIdx: number;
  if (lastTermIdxInSentence === undefined) {
    lastTermIdx = pageLists.sentenceList[sentenceIdx].lastTermIdx;
    lastPunctuation = pageLists.sentenceList[sentenceIdx].lastPunctuation;
  } else {
    lastTermIdx = lastTermIdxInSentence;
  }
  sentence = ` ${
    WordsToBeRecited(pageLists, firstTermIdx, lastTermIdx - firstTermIdx)
  }${lastPunctuation}`;
  return sentence;
};
export const SectionToBeRecited = (
  pageLists: CPageLists,
  sectionIdx: number
): string => {
  //find sentences in section. unfortunately, the sectionlist only has first and last terminal idxs and not sentences
  let section: string = "";
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
    section = section.concat(SentenceToBeRecited(pageLists, sentenceIdx));
  }
  return section;
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
export const ReciteButton1 = () => {
  let dispatch = useAppDispatch();
  const [isReciteButtonRequested, setIsReciteButtonRequested] = useState(false); // user
  // const [isReciteRequested, setIsReciteRequested] = useState(false); // button
  // const [isReciteQueued, setIsReciteQueued] = useState(false); // button and api
  const [isReciteButtonCancelRequested, setIsReciteButtonCancelRequested] = useState(false); // user vs api
  const [isReciteActivated, setIsReciteActivated] = useState(false); // requesting reciting
  const [isReciteInProgress, setIsReciteInProgress] = useState(false); // actively reciting
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  //should be a structure that is updated at once
  // const [recitationScope, setRecitationScope] = useState(
  //   settingsContext.settings.speech.scope
  // );
  // const [recitationStartIdx, setRecitationStartIdx] = useState(IDX_INITIALIZER);
  // const [recitationSpan, setRecitationSpan] = useState(0);
  // const isReciteButtonOn = (): boolean => { return isReciteInProgress}
  const currentTermIdx = useAppSelector(store => store.cursor_terminalIdx);
  const pageLists: CPageLists = useContext(PageContext)!;
//   const inlineButton_recite_toBeRecited: string[] = useAppSelector(
//     store => store.inlinebutton_recite_toBeRecited
//   );
  // const [recitationQueue, setRecitationQueue] = useState([] as string[]);
  // const [recitationQueueHead, setRecitationQueueHead] = useState(0);

  const isReciteApiRequested = useAppSelector(store=>store.recite_requested);
  const reciteApiWordIdx: number = useAppSelector(
    store=>store.recite_requested_wordIdx);
  const reciteApiSpan: number = useAppSelector(
    store=>store.recite_requested_span);
  const reciteApiSentenceIdx: number = useAppSelector(
    store=>store.recite_requested_sentenceIdx);
  const reciteApiSectionIdx: number = useAppSelector(
    store=>store.recite_requested_sectionIdx);
  const reciteApiPassThru: string = useAppSelector(
    store => store.recite_requested_passthru);
//   const inlineButtonRequested = useAppSelector(
//     store => store.inlinebutton_recite_requested
//   );
 const reciteApiScope: RecitationScopeEnumType = useAppSelector(
    store => store.recite_requested_scope
  );
//   const reciteApiPassThru: string[] = useAppSelector(
//     store => store.recite_requested_passthru
//   );  
useEffect(() => {
  // This is just precautionary to ensure that recitation is stopped and the
  // state reset because the reciteButton component does not unmount with each 
  // new page loaded since it exists in the page footer and not the content 
  // page.
  // dispatch(Request.Recite_stop());
})
useEffect(() => {
  if (isReciteActivated && isReciteInProgress && isReciteButtonCancelRequested) {
    console.log(`user cancel recitation`);
    Synthesizer.cancel();
    dispatch(Request.Recite_stop()); // reset state
    setIsReciteActivated(false)
    setIsReciteButtonCancelRequested(false)
    // setIsReciteButtonCancelRequested(false)
    // setIsReciteButtonRequested(false)
  }
},[
  dispatch, 
  isReciteInProgress, 
  isReciteActivated, 
  // isReciteButtonRequested,
  isReciteButtonCancelRequested
])
useEffect(() => {
  // console.log(`@@Recite: isReciteButtonRequested=${isReciteButtonRequested} reciteActivated=${isReciteActivated} isRecitingInProgress=${isReciteInProgress} isReciteApiRequested=${isReciteApiRequested}`);
  let recitationScope: RecitationScopeEnumType = settingsContext.settings.speech.scope;
  let recitationStartIdx: number = currentTermIdx;
  let recitationSpan : number = 0;
  let recitationPassThru: string= "";
  let recitationList: string = ""; // can contain multiple sentences
  let isReciteParametersValidated: boolean = false;
  // let isReciteContentQueued = false;
  if (!pageLists || isReciteInProgress) return
  // VALIDATE PARAMETERS
  if (!isReciteActivated && isReciteButtonRequested) {
    switch(recitationScope) {
      case RecitationScopeEnumType.words:
        // accept default values above
        isReciteParametersValidated = true;
        break;
      case RecitationScopeEnumType.sentence:
        recitationStartIdx = pageLists.terminalList[currentTermIdx].sentenceIdx;
        isReciteParametersValidated = true;
        break;
      case RecitationScopeEnumType.section:
        recitationStartIdx = pageLists.terminalList[currentTermIdx].sectionIdx;
        isReciteParametersValidated = true;
        break;
      case RecitationScopeEnumType.passThru:
        break;
    default:
        console.log(`Unsupported scope=${recitationScope} - 
          using default values`);
      }
    console.log(`recitationScope=${recitationScope} sentenceIdx=${pageLists.terminalList[currentTermIdx].sentenceIdx}`);
  } else if (isReciteApiRequested) {
      recitationScope = reciteApiScope
      recitationSpan = reciteApiSpan;
      recitationStartIdx = currentTermIdx;
    switch (reciteApiScope) {
      case RecitationScopeEnumType.words:
        if (reciteApiWordIdx >= 0 
          && reciteApiWordIdx < pageLists.terminalList.length) {
          recitationStartIdx = reciteApiWordIdx;
          isReciteParametersValidated = true;
        }
        break;
      case RecitationScopeEnumType.sentence:
        if (reciteApiSentenceIdx >= 0
          && reciteApiSentenceIdx < pageLists.sentenceList.length) {
          recitationStartIdx = reciteApiSentenceIdx
          isReciteParametersValidated = true;
        } else if (currentTermIdx >= 0 && currentTermIdx < pageLists.terminalList.length) {
            recitationStartIdx = pageLists.terminalList[currentTermIdx].sentenceIdx;
        } else {
          isReciteParametersValidated = false;
          recitationStartIdx = IDX_INITIALIZER
          console.log(`@@Recite: invalid sentenceIdx?=${reciteApiSentenceIdx} using default value`);
        }
        break;
      case RecitationScopeEnumType.section:
        if (reciteApiSectionIdx >= 0
          && reciteApiSectionIdx < pageLists.sectionList.length) {
          recitationStartIdx = reciteApiSectionIdx;
          isReciteParametersValidated = true;
       } else if (currentTermIdx >= 0 && currentTermIdx < pageLists.terminalList.length) {
          recitationStartIdx = pageLists.terminalList[currentTermIdx].sectionIdx;
      } else {
          isReciteParametersValidated = false;
          console.log(`@@Recite: invalid sectionIdx?=${reciteApiSentenceIdx} using default value`);
          recitationStartIdx = IDX_INITIALIZER
        }
        break;
      case RecitationScopeEnumType.passThru:
        recitationPassThru = reciteApiPassThru
        isReciteParametersValidated = true;
        break;
      default:
        isReciteParametersValidated = false;
        console.log(`Unsupported scope=${reciteApiScope} using default values`);
    }
  } else {
    // do nothing
      console.log(`do nothing isReciteActivated=${isReciteActivated} isReciteInProgress=${isReciteInProgress} isReciteButtonRequested=${isReciteButtonRequested} isReciteApiRequested=${isReciteApiRequested}`);
    isReciteParametersValidated = false;
  }
  // POPULATE RECITATION LIST
  if (!isReciteActivated && isReciteParametersValidated) {
    // console.log(`@@Recite: validated isReciteActivated=${isReciteActivated} recitationScope=${recitationScope} recitationStartIdx=${recitationStartIdx} recitationSpan=${recitationSpan} reciteApiPassThru=${reciteApiPassThru}`);
    switch (recitationScope) {
      case RecitationScopeEnumType.words:
        if (recitationSpan === 0) {
          recitationList = WordsToBeRecited(pageLists, recitationStartIdx);
        } else {
          recitationList =
            SentenceToBeRecited(
              pageLists,
              pageLists.terminalList[recitationStartIdx].sentenceIdx
              // currentTermIdx - 1, // excluding current terminal
              // "?" // not end of sentence
          //   )
          );
        }
        break;
      case RecitationScopeEnumType.sentence:
        recitationList = SentenceToBeRecited(
        pageLists,
        recitationStartIdx
        );
        break;
      case RecitationScopeEnumType.section:
        recitationList = SectionToBeRecited(
          pageLists,
          recitationStartIdx
        )
        break;
      case RecitationScopeEnumType.passThru:
        recitationList = recitationPassThru;
        break;
      default:
    }
  } else {
    recitationList = ""
  }
  // SYNTHESIZE RECITATION LIST
  if (!isReciteActivated && recitationList.length > 0) {
    console.log(`@@Recite: synthesizing=${recitationList} at ${(new Date()).getTime()}`)
    // resets it asynchronously when speaking is completed
    console.log(`@@@ recite: synthesizing @${(new Date().getTime().toString().slice(-5))}`);
    setIsReciteActivated(true);
    dispatch(Request.Recite_active())
  //   console.log(`@@@@@ reciting1: isReciteActivated=${isReciteActivated}
  // recitationList.length=${recitationList.length}, 
  // recitationList=${recitationList},
  // isReciteInProgress=${isReciteInProgress} ,
  // isReciteButtonRequested=${isReciteButtonRequested},
  // isReciteApiRequested=${isReciteApiRequested},
  // currentTermIdx=${currentTermIdx},
  // isReciteActivated=${isReciteActivated},
  // isReciteButtonRequested=${isReciteButtonRequested},
  // isReciteApiRequested=${isReciteApiRequested},
  // isReciteInProgress=${isReciteInProgress},
  // reciteApiPassThru=${reciteApiPassThru},
  // reciteApiScope=${reciteApiScope},
  // reciteApiSectionIdx=${reciteApiSectionIdx},
  // reciteApiSentenceIdx=${reciteApiSentenceIdx},
  // reciteApiSpan=${reciteApiSpan},
  // reciteApiWordIdx=${reciteApiWordIdx},
  // settingsContext.settings.speech.scope=${settingsContext.settings.speech.scope}`);
  // console.log(`@@@ recite: speaking @${(new Date().getTime().toString().slice(-5))}`);
  Synthesizer.speak(recitationList, setIsReciteInProgress);
    // console.log(`@@@@@ reciting active`);
  }
},[
  currentTermIdx,
  dispatch,
  isReciteActivated,
  isReciteButtonRequested,
  isReciteApiRequested,
  isReciteInProgress,
  pageLists,
  reciteApiPassThru,
  reciteApiScope,
  reciteApiSectionIdx,
  reciteApiSentenceIdx,
  reciteApiSpan,reciteApiWordIdx,
  settingsContext.settings.speech.scope
])
  // useEffect(() => {  
  //   if (isReciteInProgress) {
  //     console.log(`@@@@@ set reciting active`);
  //     dispatch(Request.Recite_active());
  //   } else {
  //     dispatch(Request.Recite_inactive());
  //     console.log(`@@@@@ set reciting inactive`);
  //   } 
  // },[dispatch, isReciteInProgress])
  // CLEANUP
  useEffect(() => {   
  //   console.log(`@@@ recite: completed? @${(new Date().getTime().toString().slice(-5))}`);
  //   console.log(`@@@@@ reciting2: isReciteActivated=${isReciteActivated},
  // isReciteInProgress=${isReciteInProgress},
  // isReciteButtonRequested=${isReciteButtonRequested},
  // isReciteApiRequested=${isReciteApiRequested},
  // currentTermIdx=${currentTermIdx},
  // isReciteActivated=${isReciteActivated},
  // isReciteButtonRequested=${isReciteButtonRequested},
  // isReciteApiRequested=${isReciteApiRequested},
  // isReciteInProgress=${isReciteInProgress},
  // reciteApiPassThru=${reciteApiPassThru},
  // reciteApiScope=${reciteApiScope},
  // reciteApiSectionIdx=${reciteApiSectionIdx},
  // reciteApiSentenceIdx=${reciteApiSentenceIdx},
  // reciteApiSpan=${reciteApiSpan},
  // reciteApiWordIdx=${reciteApiWordIdx},
  // settingsContext.settings.speech.scope=${settingsContext.settings.speech.scope} at ${(new Date().getTime().toString().slice(-5))}`);
    if (isReciteActivated && !isReciteInProgress) {
      // Synthesizer.cancel();
      // Still activated but reciting is no longer in progress
      console.log(`@@@ recite: completed @${(new Date().getTime().toString().slice(-5))}`);
      dispatch(Request.Recite_completed())  // successful reciting
        // dispatch(Request.Recite_ended()) // reset api requested state
      if (isReciteApiRequested) {
        // reset api requested state
        // dispatch(Request.Recite_ended()) // reset api requested state
        console.log(`@@@@@ reciting isReciteApiRequested=true`);
        // console.log(`++++reciting clean up: isReciteApiRequested=false`);
      }
      // console.log(`++++reciting clean up: recitingInProgress=false`);
      setIsReciteActivated(false)
      setIsReciteButtonCancelRequested(false);
      setIsReciteButtonRequested(false)
    //   dispatch(Request.Recite_inactive()); // communicate to other components
    } else if (!isReciteActivated && !isReciteInProgress) {
      console.log(`@@@ recite: inactive @${(new Date().getTime().toString().slice(-5))}  isReciteButtonRequested=${isReciteButtonRequested} isReciteButtonCancelRequested=${isReciteButtonCancelRequested}`);
    } else if (!isReciteActivated && isReciteInProgress) {
      console.log(`@@@ recite: invalid/canceling end state @${(new Date().getTime().toString().slice(-5))} isReciteButtonRequested=${isReciteButtonRequested} isReciteButtonCancelRequested=${isReciteButtonCancelRequested}`);

    } else {
      console.log(`@@@ recite: still not completed @${(new Date().getTime().toString().slice(-5))}`);
      console.log(`@@@@@ isReciteActivated=${isReciteActivated} isReciteInProgress=${isReciteInProgress} isReciteApiRequested=${isReciteApiRequested}`); 
    }
  },[
    dispatch,
    isReciteActivated,
    isReciteApiRequested,
    isReciteInProgress, 
    currentTermIdx,
    isReciteButtonRequested,
    reciteApiPassThru,
    reciteApiScope,
    reciteApiSectionIdx,
    reciteApiSentenceIdx,
    reciteApiSpan,
    reciteApiWordIdx,
    settingsContext.settings.speech.scope
  ])
  let reciteInactiveIcon: string = ReciteButtonIcon(
    settingsContext.settings.speech.scope,
    RecitationReferenceEnumType.following, // or not
    settingsContext.settings.speech.placement
  );
  dispatch(Request.Recognition_stop);
  const reciteButtonClicked = () => {
    setIsReciteButtonRequested(!isReciteActivated);
    if (isReciteActivated) setIsReciteButtonCancelRequested(true);
  };
  // console.log(`@@@@@ clicked: isReciteButtonRequested=${isReciteButtonRequested} reciteActivated=${isReciteActivated} isRecitingInProgress=${isReciteInProgress} isReciteApiRequested=${isReciteApiRequested}`);

  return (
    <>
      <img
        className="icon"
        alt="recite"
        src={
          window.speechSynthesis === null
            ? speakGhostedIcon
            : isReciteInProgress
            ? speakActiveIcon
            : reciteInactiveIcon
        }
        title="start/stop reciting"
        onClick={reciteButtonClicked}
      />
    </>
  );
};