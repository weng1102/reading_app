/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_speech_speakbutton.tsx
 *
 * Defines React front end speak button functional component.
 *
 *
 *
 * Version history:
 *
 **/
import { Request } from "./reducers";
import speakGhostedIcon from "./button_speak_ghosted.png";
import speakActiveIcon from "./button_speak_activeRed.gif";
import speakInactiveIcon from "./button_speak.png";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";
import { CPageContext, PageContext } from "./pageContext";
import {
  ISettingsContext,
  RecitationMode,
  SettingsContext
} from "./settingsContext";
import { Synthesizer } from "./reactcomp_speech";

export const SpeakButton = () => {
  let dispatch = useAppDispatch();
  const [recitationQueue, setRecitationQueue] = useState([""]);
  const [reciting, setReciting] = useState(false);
  const [speakingNow, setSpeakingNow] = useState(false);
  const reciteRequested = useAppSelector(store => store.recite_requested); // from recite_toggle
  const termIdx = useAppSelector(store => store.cursor_terminalIdx);
  const pageContext: CPageContext = useContext(PageContext)!;
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  const recitationMode: RecitationMode =
    settingsContext.settings.speech.recitationMode;

  useEffect(() => {
    // stop speaking when termIdx changes
    if (reciting) {
      setReciting(false);
    }
  }, [termIdx]);
  useEffect(() => {
    if (reciting) {
      setRecitationQueue(somethingToRecite());
    }
  }, [reciting]);
  useEffect(() => {
    // need to chop up the message into at least sentences so cancel
    // (reciting=false) request can can be processed especially for longer
    // passages.

    // Only two of the four possible states are relevant:
    // state change from requested to reciting and vice versa.
    if (reciteRequested && !reciting) {
      setRecitationQueue(somethingToRecite());
      setReciting(true);
    } else if (!reciteRequested && reciting) {
      setReciting(false);
      setRecitationQueue([]);
    } else {
      // not reciting and not requested
    }
  }, [reciteRequested]);
  useEffect(() => {
    // need to chop up the message so cancel request can can be polled
    // especially for longer passages.
    // pop recitationQueue
    if (!reciting || recitationQueue.length === 0) {
      dispatch(Request.Recite_stop());
    } else {
      if (!speakingNow) {
        let sentence: string = recitationQueue.shift() as string;
        setRecitationQueue([...recitationQueue]);
        Synthesizer.volume = settingsContext.settings.speech.volume;
        Synthesizer.speak(sentence, setSpeakingNow);
      }
    }
  }, [speakingNow, recitationQueue]);
  const somethingToRecite = (): string[] => {
    let messageQueue: string[] = [];
    const wordToRecite = (termIdx: number): string => {
      return pageContext.terminalList[termIdx].altpronunciation !== ""
        ? pageContext.terminalList[termIdx].altpronunciation
        : pageContext.terminalList[termIdx].content;
    };
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
        lastPunctuation = pageContext.sentenceList[sentenceIdx].lastPunctuation;
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
      let firstTermIdx: number =
        pageContext.sectionList[sectionIdx].firstTermIdx;
      let lastTermIdx: number = pageContext.sectionList[sectionIdx].lastTermIdx;
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
    switch (recitationMode) {
      case RecitationMode.wordOnly:
        messageQueue.push(wordToRecite(termIdx));
        break;
      case RecitationMode.entireSentence:
        messageQueue.push(
          sentenceToRecite(pageContext.terminalList[termIdx].sentenceIdx)
        );
        break;
      case RecitationMode.uptoExclusive:
        messageQueue.push(
          sentenceToRecite(
            pageContext.terminalList[termIdx].sentenceIdx,
            termIdx - 1, // excluding current terminal
            "?" // not end of sentence
          )
        );
        break;
      case RecitationMode.uptoInclusive:
        messageQueue.push(
          sentenceToRecite(
            pageContext.terminalList[termIdx].sentenceIdx,
            termIdx, // including current terminal
            "?" // not end of sentence
          )
        );
        break;
      case RecitationMode.section:
        messageQueue = [
          ...messageQueue,
          ...sectionToRecite(pageContext.terminalList[termIdx].sectionIdx)
        ];
        break;
      default:
    }
    return messageQueue;
  }; //somethingToRecite
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
        onClick={() => dispatch(Request.Recite_toggle())}
      />
    </>
  );
};
