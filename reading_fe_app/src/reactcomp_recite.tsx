/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_recite.tsx
 *
 *  Supersedes reactcomp_speech_speakbutton.tsx
 *
 * Defines React recitation behavior initiated by and reflected in the front
 * end recite and inlineButton functional component buttons.
 * The majority of the functionality of the aformentioned components overlap
 * AND the active/cancel button for the latter is the toggling of the former.
 *
 * Sequence of event:
 * 1) recitation request (true)
 *   1a) ReciteButton clicked (component state reciteButtonRequested)
 *   1b) InlineButton clicked (reducer state variable inlinebutton_idx)
 *     Respective useEffects() are responsible for setting the scope, position,
 *     listening and then set reciteActivated that initiates the common logic
 *     for recitation.
 * 2) reciteActivated (true)
 *    changes the ReciteButtonIcon to active and generates the reciation queue
 *    of words, sentence, section based on scope et al. settings above.
 * 3) recitationQueue (value changes)
 *    Recitation request is decomposed into a list of sentences so the speech
 *    synthesis can be smoother and more natural than synthesizing individual
 *    words. The end of sentence puncuation is also essential. The sentence
 *    queue vs a single string of mutliple sentences allows the current
 *    sentence to be highlighted in the future.
 *
 *    After each sentence is popped, if an asynchronous user cancel request via
 *    a subsequent recitation request (true) that stops synthesis immediately,
 *    the component logic can reset the component state for the next recitation
 *    request mmediately.
 *    After speaking is initiated, recitingInProgress indicates whether actual
 *    speech synthesis is ongoing and completed asynchronously based
 *    asynchronous event from Synthesizer onend(). Detecting the actual
 *    completion allows the timely reset of reciteActivated (along with
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
  let dispatch = useAppDispatch();
  const [recitationQueue, setRecitationQueue] = useState([] as string[]);
  const [reciteActivated, setReciteActivated] = useState(false);
  const [recitingInProgress, setRecitingInProgress] = useState(false); // currently actively reciting
  const [reciteButtonRequested, setReciteButtonRequested] = useState(false); // button
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  //should be a structure that is updated at once
  const [recitationScope, setRecitationScope] = useState(
    settingsContext.settings.speech.scope
  );
  const [recitationStartIdx, setRecitationStartIdx] = useState(IDX_INITIALIZER);
  const [recitationSpan, setRecitationSpan] = useState(0);

  const currentTermIdx = useAppSelector(store => store.cursor_terminalIdx);
  const pageLists: CPageLists = useContext(PageContext)!;
  const inlineButton_recite_toBeRecited: string[] = useAppSelector(
    store => store.inlinebutton_recite_toBeRecited
  );
  const inlineButtonRequested = useAppSelector(
    store => store.inlinebutton_recite_requested
  );
  useEffect(() => {
    if (reciteButtonRequested) {
      if (reciteActivated) {
        // already activated => cancel request
        setReciteActivated(false);
        Synthesizer.cancel(); // cancel asynchronous
        setRecitingInProgress(false);
        setRecitationQueue([]);
        dispatch(Request.Recite_stop());
        // what to do with the recitationQueue state
      } else {
        setRecitationScope(settingsContext.settings.speech.scope);
        setRecitationStartIdx(currentTermIdx);
        setRecitationSpan(0);
        // setRecitationReference(RecitationReferenceEnumType.following);
        setReciteActivated(true);
      }
      setReciteButtonRequested(false);
    } else {
      // ignore
    }
  }, [reciteButtonRequested, reciteActivated]);
  useEffect(() => {
    console.log(
      `inlineButtonRequested=${inlineButtonRequested}, toBeRecited=${inlineButton_recite_toBeRecited}`
    );
    if (inlineButtonRequested && inlineButton_recite_toBeRecited.length > 0) {
      setRecitationScope(RecitationScopeEnumType.passThru);
      setReciteActivated(true);
    }
  }, [inlineButtonRequested]);
  useEffect(() => {
    Synthesizer.volume = settingsContext.settings.speech.volume;
    Synthesizer.selectedVoiceIndex =
      settingsContext.settings.speech.selectedVoiceIndex;
  }, [
    settingsContext.settings.speech.selectedVoiceIndex,
    settingsContext.settings.speech.volume
  ]);
  useEffect(() => {
    // console.log(`reciteActivated=${reciteActivated}`);
    // scope defaults to setting unless inlinebutton
    // console.log(`reciteButton: currentTermIdx=${currentTermIdx}`);
    console.log(
      `reciteActivated:recitationScope=${recitationScope}, termIdx=${recitationStartIdx}`
    );
    if (!reciteActivated) {
      // Synthesizer.cancel();
      // setRecitationQueue([]);
    } else {
      const validTerminalList = pageLists.terminalList.length > 0;
      switch (recitationScope) {
        case RecitationScopeEnumType.words:
          if (!validTerminalList) break;
          if (recitationSpan === 0) {
            setRecitationQueue(WordsToBeRecited(pageLists, recitationStartIdx));
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
          setRecitationQueue(inlineButton_recite_toBeRecited);
          break;
        default:
      }
    }
  }, [reciteActivated]);
  useEffect(() => {
    let sentence: string;
    if (!reciteActivated) {
      console.log(`not activated`);
      // do nothing
    } else if (recitingInProgress) {
      // Activated but not actively reciting -- do nothing else
      console.log(`activated and reciting in progress`);
    } else if (recitationQueue.length > 0) {
      // user activated and not currently reciting and something to recite
      sentence = recitationQueue.shift()!;
      console.log(`recite: sentence=${sentence}`);
      setRecitingInProgress(true);
      Synthesizer.speak(sentence, setRecitingInProgress);
      setRecitationQueue([...recitationQueue]);
      console.log(`recited: recitationQueue.length=${recitationQueue.length}`);
    } else {
      // reciteActivated && recitationQueue.length === 0) {
      // Activated but recitationQueue is empty so deactivate
      // console.log(`reciteActivated=${reciteActivated}`);
      // console.log(`recitingInProgress=${recitingInProgress}`);
      // console.log(`recitationQueue.length=${recitationQueue.length}`);
      // console.log(`recitationQueue=${recitationQueue}`);
      dispatch(Request.InlineButton_recited());
      setReciteActivated(false);
    }
  }, [recitationQueue, recitingInProgress]);
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
  let reciteInactiveIcon: string = ReciteButtonIcon(
    settingsContext.settings.speech.scope,
    RecitationReferenceEnumType.following, // or not
    settingsContext.settings.speech.placement
  );
  dispatch(Request.Recognition_stop);
  const reciteClicked = () => {
    setReciteButtonRequested(!reciteButtonRequested);
  };
  return (
    <>
      <img
        className="icon"
        alt="recite"
        src={
          window.speechSynthesis === null
            ? speakGhostedIcon
            : reciteActivated
            ? speakActiveIcon
            : reciteInactiveIcon
        }
        title="start/stop reciting"
        onClick={reciteClicked}
      />
    </>
  );
};
