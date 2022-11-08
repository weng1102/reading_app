/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
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
import speakInactiveIcon from "./img/button_speak.png";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useCallback, useEffect, useState, useContext } from "react";
import { CPageLists } from "./pageContext";
import {
  ISettingsContext,
  RecitationMode,
  SettingsContext
} from "./settingsContext";
import { Synthesizer } from "./reactcomp_speech";

export const ReciteButton = () => {
  let dispatch = useAppDispatch();
  const [recitationQueue, setRecitationQueue] = useState([""]);
  const [reciting, setReciting] = useState(false);
  const [recitingNow, setRecitingNow] = useState(false);
  const reciteRequested = useAppSelector(store => store.recite_requested);
  const currentTermIdx = useAppSelector(store => store.cursor_terminalIdx);
  let pageContext: CPageLists = useAppSelector(store => store.pageContext);
  // cannot use useContext(PageContext) because context is only scoped within
  // a page
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  const recitationMode: RecitationMode =
    settingsContext.settings.speech.recitationMode;
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
      switch (recitationMode) {
        case RecitationMode.wordOnly:
        case RecitationMode.wordNext:
          messageQueue.push(wordToRecite(currentTermIdx));
          break;
        case RecitationMode.entireSentence:
          messageQueue.push(
            sentenceToRecite(
              pageContext.terminalList[currentTermIdx].sentenceIdx
            )
          );
          break;
        case RecitationMode.uptoExclusive:
          messageQueue.push(
            sentenceToRecite(
              pageContext.terminalList[currentTermIdx].sentenceIdx,
              currentTermIdx - 1, // excluding current terminal
              "?" // not end of sentence
            )
          );
          break;
        case RecitationMode.uptoInclusive:
          messageQueue.push(
            sentenceToRecite(
              pageContext.terminalList[currentTermIdx].sentenceIdx,
              currentTermIdx, // including current terminal
              "?" // not end of sentence
            )
          );
          break;
        case RecitationMode.section:
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
      recitationMode,
      wordToRecite
    ]
  );
  const reciteWordRequested = useAppSelector(
    store => store.recite_word_requested
  );
  useEffect(() => {
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
    // if current word changes, then  stop reciting
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
    // need to chop up the message so cancel request can can be polled
    // especially for longer passages.
    // pop recitationQueue
    if (!reciting || recitationQueue.length === 0) {
      dispatch(Request.Recite_stop());
    } else {
      if (!recitingNow) {
        let sentence: string = recitationQueue.shift() as string;
        setRecitationQueue([...recitationQueue]);
        Synthesizer.volume = settingsContext.settings.speech.volume;
        Synthesizer.speak(sentence, setRecitingNow);
        if (recitationMode === RecitationMode.wordNext) {
          dispatch(Request.Cursor_gotoNextWord());
        }
      }
    }
  }, [
    dispatch,
    recitingNow,
    reciting,
    recitationQueue,
    recitationMode,
    settingsContext.settings.speech.volume
  ]);
  // if currently listening, stop and restart after reciting
  dispatch(Request.Recognition_stop);
  return (
    <>
      <img
        className="icon"
        alt="speak"
        src={
          window.speechSynthesis === null
            ? speakGhostedIcon
            : reciting
            ? speakActiveIcon
            : speakInactiveIcon
        }
        title="start/stop reciting"
        onClick={() => dispatch(Request.Recite_toggle())}
      />
    </>
  );
};
