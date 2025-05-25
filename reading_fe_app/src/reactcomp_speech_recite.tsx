/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_speech_speakbutton.tsx
 *
 * Defines React front end speak button functional component.
 *
 *
 *
 * Version history:
 *
 **/
import { Request } from "./reducers";
import speakGhostedIcon from "./img/button_speak_ghosted.png";
import speakActiveIcon from "./img/button_speak_activeRed.gif";
import speakInactiveIcon from "./img/button_recite.png";
import reciteWordInactiveIcon from "./img/button_recite.png";
import reciteWordAdvanceInactiveIcon from "./img/button_recite_advance.png";
import reciteSentenceInactiveIcon from "./img/button_recite_sentence.png";
import reciteSentenceAdvanceInactiveIcon from "./img/button_recite_sentence_advance.png";
import reciteSectionInactiveIcon from "./img/button_recite_section.png";
import reciteSectionAdvanceInactiveIcon from "./img/button_recite_section_advance.png";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useCallback, useEffect, useState, useContext } from "react";
import {
  RecitationScopeEnumType,
  RecitationReferenceEnumType,
  RecitationPlacementEnumType,
  RecitationListeningEnumType
} from "./pageContentType";
import { CPageLists } from "./pageContext";
import { ISettingsContext, SettingsContext } from "./settingsContext";
import { Synthesizer } from "./reactcomp_speech";
// this should be a method of a recite object where the parameters are passed
// to the constructor() and the resultant string and icon are instances/methods.
// The object will encapsulate the settingContext overrides/defaults
const InlineButtonString = (
  // returns string and corresponding button icon
  termIdx: number,
  scope: RecitationScopeEnumType,
  span: number,
  embeddedText: string // hint
): string => {
  const pageContext: CPageLists = useAppSelector(store => store.pageContext);
  let reciteStr = "";
  switch (scope) {
    // case RecitationScopeEnumType.label: {
    //   reciteStr = embeddedText;
    //   break;
    // }
    case RecitationScopeEnumType.words: {
      reciteStr = pageContext.terminalList[termIdx].content;
      break;
    }
    case RecitationScopeEnumType.sentence: {
      break;
    }
  }

  return reciteStr;
};
export const ReciteButtonIcon = (
  scope: RecitationScopeEnumType = RecitationScopeEnumType.words,
  reference: RecitationReferenceEnumType = RecitationReferenceEnumType.following,
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
      if (reference === RecitationReferenceEnumType.following) {
        imageFile = reciteSectionAdvanceInactiveIcon;
      } else {
        imageFile = reciteSectionInactiveIcon;
      }
      break;
    }
    case RecitationScopeEnumType.sentence: {
      if (reference === RecitationReferenceEnumType.following) {
        imageFile = reciteSentenceAdvanceInactiveIcon;
      } else {
        imageFile = reciteSentenceInactiveIcon;
      }
      break;
    }
    case RecitationScopeEnumType.words: {
      if (reference === RecitationReferenceEnumType.following) {
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
  const [recitationQueue, setRecitationQueue] = useState([""]);
  const [reciting, setReciting] = useState(false);
  const [recitingNow, setRecitingNow] = useState(false);
  const reciteRequested = useAppSelector(store => store.recite_requested);
  const currentTermIdx = useAppSelector(store => store.cursor_terminalIdx);
  const pageContext: CPageLists = useAppSelector(store => store.pageContext);
  // cannot use useContext(PageContext) because context is only scoped within
  // a page
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  const recitationScope: RecitationScopeEnumType =
    settingsContext.settings.speech.scope;
  const recitationPlacement: RecitationPlacementEnumType =
    settingsContext.settings.speech.placement;
  const wordToRecite = useCallback(
    (currentTermIdx: number): string => {
      return pageContext.terminalList[currentTermIdx].altpronunciation !== ""
        ? pageContext.terminalList[currentTermIdx].altpronunciation
        : pageContext.terminalList[currentTermIdx].content;
    },
    [pageContext.terminalList]
  );
  const somethingToRecite = useCallback(
    (currentTermIdx: number): string[] => {
      let messageQueue: string[] = [];
      // const wordToRecite = (currentTermIdx: number): string => {
      //   return pageContext.terminalList[currentTermIdx].altpronunciation !== ""
      //     ? pageContext.terminalList[currentTermIdx].altpronunciation
      //     : pageContext.terminalList[currentTermIdx].content;
      // };
      const sentenceToRecite = (
        sentenceIdx: number,
        lastTermIdxInSentence?: number,
        lastPunctuation?: string
      ): string => {
        let firstTermIdx: number =
          pageContext.sentenceList[sentenceIdx].firstTermIdx;
        let lastTermIdx: number;
        if (lastTermIdxInSentence === undefined) {
          lastTermIdx = pageContext.sentenceList[sentenceIdx].lastTermIdx;
          lastPunctuation =
            pageContext.sentenceList[sentenceIdx].lastPunctuation;
        } else {
          lastTermIdx = lastTermIdxInSentence;
        }
        let str: string = "";
        for (let idx = firstTermIdx; idx <= lastTermIdx; idx++) {
          str = str + " " + wordToRecite(idx);
        }
        //add punctuation for inflection
        str = str + (lastPunctuation === undefined ? "" : lastPunctuation);
        return str;
      };
      const sectionToRecite = (sectionIdx: number): string[] => {
        //find sentences in section. unfortunately, the sectionlist only has first and last terminal idxs and not sentences
        let strQ: string[] = [];
        // let firstTermIdx: number =
        //   pageContext.sectionList[sectionIdx].firstTermIdx;
        // let lastTermIdx: number = pageContext.sectionList[sectionIdx].lastTermIdx;
        // let firstSentenceIdx: number =
        //   pageContext.terminalList[firstTermIdx].sentenceIdx;
        // let lastSentenceIdx: number =
        //   pageContext.terminalList[lastTermIdx].sentenceIdx;
        let firstTermIdx: number =
          pageContext.sectionList[sectionIdx].firstTermIdx;
        let lastTermIdx: number =
          pageContext.sectionList[sectionIdx].lastTermIdx;
        let firstSentenceIdx: number =
          pageContext.terminalList[firstTermIdx].sentenceIdx;
        let lastSentenceIdx: number =
          pageContext.terminalList[lastTermIdx].sentenceIdx;
        for (
          let sentenceIdx = firstSentenceIdx;
          sentenceIdx <= lastSentenceIdx;
          sentenceIdx++
        ) {
          strQ.push(sentenceToRecite(sentenceIdx));
        }
        return strQ;
      };
      // given all the array accessing, should wrap in try/catch
      console.log(`reciteButton: currentTermIdx=${currentTermIdx}`);
      switch (recitationScope) {
        case RecitationScopeEnumType.words:
          messageQueue.push(wordToRecite(currentTermIdx));
          break;
        case RecitationScopeEnumType.sentence:
          messageQueue.push(
            sentenceToRecite(
              pageContext.terminalList[currentTermIdx].sentenceIdx
            )
          );
          break;
        case RecitationScopeEnumType.words:
          messageQueue.push(
            sentenceToRecite(
              pageContext.terminalList[currentTermIdx].sentenceIdx,
              currentTermIdx - 1, // excluding current terminal
              "?" // not end of sentence
            )
          );
          break;
        // case RecitationMode.uptoInclusive:
        //   messageQueue.push(
        //     sentenceToRecite(
        //       pageContext.terminalList[currentTermIdx].sentenceIdx,
        //       currentTermIdx, // including current terminal
        //       "?" // not end of sentence
        //     )
        //   );
        //   break;
        case RecitationScopeEnumType.section:
          console.log(`reciteButton: currentTermIdx=${currentTermIdx}`);
          messageQueue = [
            ...messageQueue,
            ...sectionToRecite(
              pageContext.terminalList[currentTermIdx].sectionIdx
            )
          ];
          break;
        default:
      }
      return messageQueue;
    },
    [
      pageContext.sectionList,
      pageContext.sentenceList,
      pageContext.terminalList,
      recitationScope,
      wordToRecite
    ]
  );
  const reciteWordRequested = useAppSelector(
    store => store.recite_word_requested
  );
  useEffect(() => {
    console.log(
      `useEffect[reciteWordRequested, currentTermIdx, recitingNow, reciting]`
    );
    if (reciteWordRequested) {
      Synthesizer.volume = settingsContext.settings.speech.volume;
      Synthesizer.speak(wordToRecite(currentTermIdx)); //synchronous
      dispatch(Request.Recited_currentWord());
    }
  }, [
    reciteWordRequested,
    currentTermIdx,
    dispatch,
    settingsContext.settings.speech.volume,
    somethingToRecite, //- wrap with useCallback
    recitingNow,
    reciting,
    wordToRecite
  ]);

  useEffect(() => {
    // if current word changes, then stop reciting
    console.log(`useEffect[currentTermIdx, reciting]`);
    if (reciting) {
      setReciting(false);
    }
  }, [currentTermIdx, reciting]);
  useEffect(() => {
    // if currently reciting, then update recitation queue
    if (reciting) {
      console.log(`useEffect[reciting]: ${currentTermIdx}`);
      setRecitationQueue(somethingToRecite(currentTermIdx));
    }
  }, [reciting, currentTermIdx, somethingToRecite]);
  useEffect(() => {
    // need to chop up the message into at least sentences so cancel
    // (reciting=false) request can can be processed especially for longer
    // passages.

    // Only two of the four possible states are relevant:
    // state change from requested to reciting and vice versa.
    if (reciteRequested && !reciting) {
      console.log(`useEffect[reciteRequest] ${currentTermIdx}`);
      setRecitationQueue(somethingToRecite(currentTermIdx));
      setReciting(true);
    } else if (!reciteRequested && reciting) {
      setReciting(false);
      setRecitationQueue([]);
    } else {
      // not reciting and not requested
    }
  }, [
    reciteRequested,
    reciting,
    currentTermIdx,
    somethingToRecite // - useCallback()
  ]);
  useEffect(() => {
    Synthesizer.volume = settingsContext.settings.speech.volume;
    Synthesizer.selectedVoiceIndex =
      settingsContext.settings.speech.selectedVoiceIndex;
  }, [
    settingsContext.settings.speech.selectedVoiceIndex,
    settingsContext.settings.speech.volume
  ]);

  useEffect(() => {
    // need to chop up the message so cancel request can can be polled
    // especially for longer passages.
    // pop recitationQueue
    const delayCancel = async (msec: number) => {
      await new Promise(resolve => setTimeout(resolve, msec));
      Synthesizer.cancel();
      console.log(`after ${msec} msecond delay`);
    };
    console.log(
      `useEffect[recite, recitationQ.length, reciteNow] ${currentTermIdx}`
    );
    console.log(`recitationQueue.length=${recitationQueue.length}`);
    console.log(recitationQueue);
    console.log(`reciting=${reciting}`);
    console.log(`recitingNow=${recitingNow}`);
    if (!reciting || recitationQueue.length === 0) {
      dispatch(Request.Recite_stop());
      console.log(`Recite_stop()`);
    } else {
      if (!recitingNow) {
        console.log(`before popped recitationQ`);
        console.log(recitationQueue);
        let sentence: string = recitationQueue.shift() as string;
        console.log(`before setRecitationQ`);
        console.log(recitationQueue);
        setRecitationQueue([...recitationQueue]);
        console.log(`after popped recitationQ`);
        console.log(recitationQueue);
        console.log(`start speak()`);
        Synthesizer.speak(sentence, setRecitingNow);
        console.log(`after speak()`);
        // delayCancel(250);
        // Synthesizer.cancel();
        if (recitationPlacement === RecitationPlacementEnumType.end) {
          if (recitationScope === RecitationScopeEnumType.words) {
            dispatch(Request.Cursor_gotoNextWord());
          } else if (recitationScope === RecitationScopeEnumType.sentence) {
            // goto beginning of next sentence
            // dispatch(Request.Cursor_gotoNextWord());
            console.log(`dispatch(Request.Cursor_gotoNextSentence()) END`);
          } else if (recitationScope === RecitationScopeEnumType.section) {
            // goto beginning of next section
            console.log(`dispatch(Request.Cursor_gotoNextSection()) END`);
          }
        } else if (
          recitationPlacement === RecitationPlacementEnumType.beginning
        ) {
          if (recitationScope === RecitationScopeEnumType.sentence) {
            console.log(
              `dispatch(Request.Cursor_gotoNextSentence()) BEGINNING`
            );
            // goto beginning of sentence
          } else if (recitationScope === RecitationScopeEnumType.section) {
            console.log(`dispatch(Request.Cursor_gotoNextSection()) BEGINNING`);
            // goto beginning of section
          } else {
            // do nothing
          }
        } else {
          // // unchanged = do nothing
        }
      }
    }
  }, [
    currentTermIdx,
    dispatch,
    recitationPlacement,
    recitingNow,
    reciting,
    recitationQueue,
    recitationScope,
    settingsContext.settings.speech.volume
  ]);
  // if currently listening, stop and restart after reciting
  // let reciteInactiveIcon: string = ReciteButtonIcon(
  //   settingsContext.settings.speech.scope,
  //   settingsContext.settings.speech.placement
  // );
  let reciteInactiveIcon: string = "";
  dispatch(Request.Recognition_stop);
  return (
    <>
      <img
        className="icon"
        alt="recite"
        src={
          window.speechSynthesis === null
            ? speakGhostedIcon
            : reciteRequested
            ? speakActiveIcon
            : reciteInactiveIcon
        }
        title="start/stop reciting"
        // onClick={() => dispatch(Request.Recite_toggle())}
      />
    </>
  );
};
