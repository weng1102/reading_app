/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_listen.tsx
 *
 * Defines React front end functional components for listening.
 *
 * Because SpeechRecognition (with continuous listening) returns successive
 * interim refinements of what it hears based on additional semantic context,
 * the interim transcripts can contain reduncant words that may have already
 * been recognized and acknowledged by the app. Continuous listening mode
 * allows more responsive word position updates than waiting for the final
 * transcripts to be delivered.
 *
 * E.g., given the clause "The quick brown fox jumped", the interimTranscript
 * may contain some or all of the text depending upon the reading speed of the
 * user, possibly returning "the", "the quick", "the quick brown fox" in
 * successive asynchronous invocations before the final transcript.
 *
 * To eliminate the possibility of rematching subsequently words in interim
 * transcripts in the text string such as "I mean I am mean", the Speech
 * regonition can be reset, which causes a pause OR the logic can left truncate
 * the portion of the interim transcript that has already been recognized and
 * processed until the final transcript or reset transcript is detected.
 *
 * The actual recognition logic consists of hearing, detecting, matching.
 * Hearing: SpeechRecognition returns either interim or final transcript string
 * of words heard.
 * Detecting: Determines words and numbers to be matched where the previously
 * matched words have been truncated to prevent inadvertent "echoing" within
 * the current interim transcript. In the typical case, the entire set of
 * previously matched words from the beginning of the clause can be truncated
 * from the words heard in the subsequent interim transcript updates to prevent
 * mismatching where a single word or phrase is recognized multiple times.
 *
 * However, if the entire sentence is not recognized before the listening
 * timeout (i.e., finalTranscript), user manually stops listening (i.e.,
 * toggles listening button) or silence timeout triggers, or user changes
 * word cursor, the words previously heard must be  discarded.
 *
 *
 * While listening is active, the user can still change the word cursor via
 * next/prev (word|sentence|section) events or wordSelect event. Retries
 * exceeded triggers a next word event. With next word, the wordPosition can
 * be advanced. For sentence or section, the resettranscript is required.
 * How does logic manage such a disruptive state change that triggers change
 * in expectedTerminalIdx but should reset transcript
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
import { CPageLists, PageContext } from "./pageContext";
import listenRedActiveIcon from "./img/button_listen_activeRed.gif";
import listenIcon from "./img/button_listen.png";
import listenGhostedIcon from "./img/button_listen_ghosted.png";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext
} from "react";
import { SentenceListItemEnumType } from "./pageContentType";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import {
  IListenSettings,
  ISettingsContext,
  NotificationMode,
  SettingsContext
} from "./settingsContext";
export const ListeningMonitor = React.memo(() => {
  //console.log = () => {};
  console.log(`ListeningMonitor`);
  // Purpose:
  // 1) Determines whether (interim) transcript has changed since the last
  // invocation since other dependencies can trigger invocation,
  // 2) how much of the leading words of the current transcript can be
  // truncated because those words were already matched during the previous
  // invocation.
  const [
    optimizeUsingPreviousTranscript,
    setOptimizeUsingPreviousTranscript
  ] = useState(true as boolean);

  // previousTranscript holds the previous interim transcript
  // until the final transcript is scanned, at which time the value is cleared.
  const [previousTranscript, setPreviousTranscript] = useState("" as string);

  // Offset into the last matched word within the previousTranscript. Allows
  // overlap and truncation logic to eliminate overlap upto and including
  // the most recently matched word. Otherwise it returns the offset to the
  // last character of the matched word within the transcript.
  const [
    previousTranscriptMatchEndOffset,
    setPreviousTranscriptMatchEndOffset
  ] = useState(-1 as number);

  // To define non-sequential word position change: when previously matched
  // terminalIdx is more than 1 off from current terminal idx.
  const [previousMatchedTerminalIdx, setPreviousMatchedTerminalIdx] = useState(
    -1 as number
  );
  const [nextSentenceAcknowledged, setNextSentenceAcknowledged] = useState(
    false
  );
  // To detect change of expectedTerminalIdx across invocations by setting
  // it to the current expected terminal idx before exiting listening
  // useEffect() and comparing it with the expectedTerminalIdx to define
  // isDetectingNewWordToMatch.
  const [currentExpectedTerminalIdx, setCurrentExpectedTerminalIdx] = useState(
    -1 as number
  );
  const [wordRetries, setWordRetries] = useState(0 as number);
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening
  } = useSpeechRecognition();
  const dispatch = useAppDispatch();

  const listeningRequested: boolean = useAppSelector(
    store => store.listen_active
  );
  const stopListeningAtEOS: boolean = useAppSelector(
    store => store.listen_stopAtEOS
  );
  const pageContext: CPageLists = useContext(PageContext)!;

  let settingsContext: ISettingsContext = useContext(
    SettingsContext
  ) as ISettingsContext;
  const maxRetries: number = settingsContext.settings.listen.retries;
  const silenceTimeout: number = settingsContext.settings.listen.timeout;
  interface IRecognitionArguments {
    continuous: boolean;
    interimResults: boolean;
    language: string;
  }
  const ContinuousListeningInEnglish: IRecognitionArguments = {
    continuous: true,
    interimResults: true,
    language: "en-US"
  };
  const silenceTimerIdRef = useRef<number | null>(null);
  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer();
    silenceTimerIdRef.current = window.setTimeout(() => {
      console.log(`SILENCE TIMEOUT TRIGGERED`);
      resetTranscript();
      SpeechRecognition.abortListening();
      dispatch(Request.Recognition_stop());
    }, silenceTimeout * 1000);
    // console.log(`Starting silence timer for id=${retval}`);
    // console.log(`LISTENING: Setting silence timer`);
  }, [dispatch, silenceTimeout, resetTranscript]);
  const clearSilenceTimer = () => {
    if (silenceTimerIdRef.current !== null) {
      // console.log(
      //   `clearSilenceTimer: Timer cleared id=${silenceTimerIdRef.current}`
      // );
      window.clearTimeout(silenceTimerIdRef.current);
      silenceTimerIdRef.current = null;
    } else {
      // console.log(`clearSilenceTimer: No timer to clear`);
    }
  };
  const expectedTerminalIdx: number = useAppSelector(
    store => store.cursor_terminalIdx
  );
  const nextSentence: boolean = useAppSelector(
    store => store.cursor_nextSentenceTransition
  );
  const sentenceType: SentenceListItemEnumType = useAppSelector(
    store => store.sentence_type
  );
  const reciteWordRequested = useAppSelector(
    store => store.recite_word_requested
  );
  ////////////////////////////////////
  // Start and stop listening manually
  ////////////////////////////////////
  // console.log(`listening=${listening},
  // interimTranscript=${interimTranscript},
  // finalTranscript=${finalTranscript},
  // expectedTerminalIdx=${expectedTerminalIdx},
  // previousMatchedTerminalIdx=${previousMatchedTerminalIdx},
  // nextSentence=${nextSentence}
  // listening=${listening}, listeningRequested=${listeningRequested}
  // wordRetries=${wordRetries},
  // reciteWordRequested=${reciteWordRequested}`);

  useEffect(() => {
    if (!listening && listeningRequested) {
      // console.log(`restart listening because browser eventually times out`);
      // console.log(
      //   `ContinuousListeningInEnglish=${ContinuousListeningInEnglish.interimResults},${ContinuousListeningInEnglish.continuous}`
      // );
      SpeechRecognition.startListening(ContinuousListeningInEnglish);
    }
  }, [listening, listeningRequested]);
  useEffect(() => {
    if (!listeningRequested) {
      dispatch(Request.Recognition_stop());
      SpeechRecognition.abortListening();
      clearSilenceTimer();
      console.log("LISTENING: stop listening requested");
    } else {
      SpeechRecognition.startListening(ContinuousListeningInEnglish);
      startSilenceTimer();
    }
  }, [startSilenceTimer, listeningRequested, ContinuousListeningInEnglish]);
  useEffect(() => {
    if (nextSentence) {
      console.log(
        `@@@listening: resetting transcripts on nextSentence=${nextSentence}`
      );
      resetTranscript();
      setWordRetries(0);
      setPreviousTranscript("");
      setPreviousMatchedTerminalIdx(-1);
      setPreviousTranscriptMatchEndOffset(0);
      setNextSentenceAcknowledged(false);
      // if (sentenceType === SentenceListItemEnumType.default) {
      //   //
      // } else if (
      //   sentenceType === SentenceListItemEnumType.multipleChoiceQuestion
      // ) {
      //   // dispatch(Request.Recognition_stop());
      // } else {
      //   console.log(`@LISTENING: sentenceTransition=${sentenceType}`);
      // }
      if (stopListeningAtEOS) dispatch(Request.Recognition_stop());
      return;
    }
  }, [nextSentence]);
  // useEffect(() => {
  //   console.log(`previousMatchedTerminalIdx=${previousMatchedTerminalIdx} changed
  //   expectedTerminalIdx=${expectedTerminalIdx}`);
  // }, [previousMatchedTerminalIdx]);
  // useEffect(() => {
  //   console.log(`expectedTerminalIdx=${expectedTerminalIdx} changed
  //     previousMatchedTerminalIdx=${previousMatchedTerminalIdx}`);
  // }, [expectedTerminalIdx]);
  //
  useEffect(() => {
    if (expectedTerminalIdx - previousMatchedTerminalIdx !== 1) {
      // Non-sequential word transition detected

      console.log(`Clearing transcripts because non-sequential word position detected:
       expectedTerminalIdx=${expectedTerminalIdx},
       previousMatchedTerminalIdx=${previousMatchedTerminalIdx}`);
      setWordRetries(0);
      setPreviousTranscript("");
      setPreviousTranscriptMatchEndOffset(0);
      setPreviousMatchedTerminalIdx(-1);
      resetTranscript();
    } else if (previousMatchedTerminalIdx === expectedTerminalIdx) {
      // console.log(`sequential word position detected:
      //  expectedTerminalIdx (=${expectedTerminalIdx}) equals
      //  previousMatchedTerminalIdx`);
    }
  }, [expectedTerminalIdx]);

  const terminalList = pageContext === null ? null : pageContext.terminalList;
  ////////////////////////
  // DETECTING WORDS HEARD
  ////////////////////////
  useEffect(() => {
    // New transcript available
    // Match required
    // Matched found
    // console.log(
    //   `listening=${listening},
    //   interimTranscript="${interimTranscript}",
    //   finalTranscript="${finalTranscript}",
    //   previousTranscript="${previousTranscript}",
    //   previousTranscriptMatchEndOffset=${previousTranscriptMatchEndOffset},
    //   expectedTerminalIdx=${expectedTerminalIdx},
    //   nextSentence=${nextSentence}`
    // );
    ///////////////////// still does not solve issue
    // After nextSentence, wait for pinterim and final transcripts to be reset
    // if (nextSentence && !nextSentenceAcknowledged) {
    //   console.log(`LISTENING: next sentence skipping `);
    //   console.log(
    //     `LISTENING: previousTranscript=${previousTranscript}  finalTranscript=${finalTranscript} interimTranscript=${interimTranscript}`
    //   );
    //   setNextSentenceAcknowledged(true);
    //   resetTranscript();
    //   return;
    // }
    /////////////////////

    let matchMessage: string = "";
    let isListening: boolean;
    let isDetectingNewTranscript: boolean;
    let isDetectingNewWordToMatch: boolean;
    // must have more transcript separated with blank
    let isScanningWords: boolean;
    // let isFinalTranscript: boolean = false;
    let transcript: string = "";
    let transcriptEndOffset: number = 0;
    //
    isListening = listening && pageContext.terminalList !== null;
    // LISTENING: determines the following states (initially false)
    // Final transcript is the accumulation of previous interim transcripts.
    // e.g., "The", "The quick", "The quick brown",
    // interim transcript should be concatenated to the final transcript
    isDetectingNewTranscript = false;
    // isFinalTranscript = false;
    if (isListening) {
      if (nextSentence && !nextSentenceAcknowledged) {
        // keep listening but reset transcript until interimTranscript and
        // finalTranscript are finally reset.
        setNextSentenceAcknowledged(true);
        console.log(
          `LISTENING: acknowledging next sentence skipping when interimTranscript=${interimTranscript} finalTranscript=${finalTranscript}`
        );
        transcript = "";
      } else {
        // concatentate final transcript (if any) with interim transcript
        // if (nextSentence) {
        //   setWordRetries(0);
        //   setPreviousTranscript("");
        //   setPreviousTranscriptMatchEndOffset(0);
        //   setPreviousMatchedTerminalIdx(-1);
        //   resetTranscript();
        //   transcript = "";
        //   console.log(
        //     `@@@ reset finalTranscript=${finalTranscript} interim=${interimTranscript}`
        //   );
        // }
        // prioritize  final transcript before interim
        // if (finalTranscript.length > 0) {
        //   transcript = finalTranscript;
        //   if (interimTranscript.length > 0) {
        //     transcript = transcript + " " + interimTranscript;
        //   } else {
        //     // do nothing more to transcript
        //   }
        // } else {
        //   transcript = interimTranscript;
        // }
        // transcript = transcript.toLowerCase();
        transcript = (finalTranscript + " " + interimTranscript)
          .trim()
          .toLowerCase();
      }
      console.log(
        `LISTENING: transcript="${transcript}" finalTranscript=${finalTranscript} interimTranscript=${interimTranscript}`
      );
      isDetectingNewTranscript = previousTranscript !== transcript;
    } else {
    }
    if (isListening && isDetectingNewTranscript)
      console.log(
        `LISTENING: detecting new transcript: previous="${previousTranscript}", transcript="${transcript}"`
      );
    isDetectingNewWordToMatch =
      isListening && currentExpectedTerminalIdx !== expectedTerminalIdx;

    if (isDetectingNewWordToMatch) {
      console.log(
        `LISTENING: detecting new expected terminal Idx: previous="${previousMatchedTerminalIdx}", current="${expectedTerminalIdx}"`
      );
    } else {
      console.log(
        `LISTENING: not detecting new expectedTerminalIdx is =${expectedTerminalIdx}`
      );
    }
    let transcriptToBeScanned: string = "";
    transcriptEndOffset = 0;

    if (
      isListening &&
      (isDetectingNewTranscript || isDetectingNewWordToMatch)
    ) {
      startSilenceTimer();
      isScanningWords = false;
      // Primarily determines the truncated previousTranscript to use
      // to compare against expected words to partially eliminate redetection
      // of previously scanned words.
      //
      // If previous transcript overlaps (i.e., is subset of) current, what is
      // the next character after overlap? nothing (previous=current),
      // character, or numeral (as opposed to just the first digit of a
      // number).
      //
      // Case 1 (default): No optimizing using previous transcript OR no
      // overlap between previous and current transcript. Ignore
      // previous transcript/match offset and use transcript only.
      //
      // Case 2: optimizing using previous transcript when previous transcript
      // overlaps the beginning of current transcript.
      //
      // Case 2a: If previousMatchEndOffset is valid (i.e., references an
      // offset within the overlap and therefore in the current transcript),
      // then truncate the current transcript based on that match offset. Any
      // overlapping words remaining after the matched words care candidates
      //
      // Case 2b: If the previousMatchedOffset value is not valid (i.e.,
      // not between 0 and transcript.length - 1), then previous transcript
      // contained no matches, implying that the entire previous transcript
      // overlap should be truncated from current transcript.

      transcriptToBeScanned = transcript;
      transcriptEndOffset = 0;

      // console.log(
      //   `before optimize :
      //   isDetectingNewTranscript=${isDetectingNewTranscript},
      //   isDetectingNewWordToMatch=${isDetectingNewWordToMatch}`
      // );
      if (optimizeUsingPreviousTranscript) {
        let previousTranscriptOverlap: string = "";
        let isTranscriptOverlap: boolean = false; // with previousTranscript
        let isTranscriptOverlapNext: boolean = false;
        // following are overlap states valid when isTranscriptOverlapNext
        let isTranscriptOverlapNextWord: boolean = false; // typical case
        let isTranscriptOverlapNextNumeral = false;
        let isTranscriptOverlapNextPartialWord = false;
        let isTranscriptOverlapFirstWord: boolean = false;
        // let moreOverlapOffset: number = 0;
        let transcriptOverlapOffset: number = 0;
        // refers to last character included in overlap and first character excluded from overlap

        // Determine overlap to be ignored (truncated) from beginning of
        // current transcript using previousTranscript (no overlap default=0)
        if (
          previousTranscriptMatchEndOffset > 0 &&
          previousTranscriptMatchEndOffset < previousTranscript.length
        ) {
          // previousTranscriptMatchEndOffset is valid and all words before
          // the endOffset (exclusively) should be ignored
          previousTranscriptOverlap = previousTranscript.substring(
            0,
            previousTranscriptMatchEndOffset
          );
        } else {
          // previousTranscriptMatchEndOffset is not valid and implies that
          // no words in previousTranscript matched and therefore should
          // be ignored unless previousTranscript is null
          previousTranscriptOverlap = previousTranscript;
        }
        isTranscriptOverlap =
          transcript.indexOf(previousTranscriptOverlap) === 0;
        // Adjust overlap for separators and special cases
        // Determine if overlap is followed by separators e.g., blank(s) or
        // more. Look ahead to determine how to apply overlap to current
        // transcript using isTranscriptOverlapNext* states
        if (!isTranscriptOverlap) {
          // no overlap detected
          transcriptOverlapOffset = 0;
        } else if (transcript.length === previousTranscriptMatchEndOffset) {
          // given identical
          console.log(`LISTENING: No new transcript detected`);
          isDetectingNewTranscript = false;
          transcriptOverlapOffset = previousTranscriptMatchEndOffset;
          console.log(`LISTENING: No overlap detected`);
        } else if (previousTranscriptMatchEndOffset === 0) {
          // previousTranscript did not match expected
          isTranscriptOverlapFirstWord = true;
          console.log(`LISTENING: First word detected`);
          transcriptOverlapOffset = 0;
        } else if (transcript.length > previousTranscriptOverlap.length) {
          // Current transcript is a superset of previous: overlap and more
          // but could be continuation of consecutive numerals. In this case,
          // special splitting is warranted during subsequent scanning.
          // use previousTranscript.length vs previousTranscriptMatchedOffset

          // position overlapOffset to next valid word in transcript.
          // Eliminate separator especially ahead of next
          // numberAsNumerals (in between numberAsNumerals) to avoid
          // blanks "4,0, ,8" when scanning for "8"

          // This logic assumes that the transcript is lowercase and
          // does not contain multiple consecutive blanks as separators.
          let nextChar: string = transcript.charAt(
            previousTranscriptOverlap.length
          );
          console.log(
            `next char="${nextChar}" at offset=${previousTranscriptOverlap.length}`
          );
          if (nextChar === " ") {
            // overlapping on word boundry
            isTranscriptOverlapNext = true;
            isTranscriptOverlapNextWord = true;
            transcriptOverlapOffset = previousTranscriptOverlap.length + 1;
          } else if (nextChar.match(/^[a-z]$/)) {
            // most likely speechRecognition finishing a partial word
            isTranscriptOverlapNextPartialWord = true;
            isTranscriptOverlapNext = true;
            transcriptOverlapOffset = previousTranscriptMatchEndOffset;
          } else if (
            nextChar.match(/^-?\d$/) &&
            pageContext.terminalList[expectedTerminalIdx].numberAsNumerals
          ) {
            isTranscriptOverlapNext = true;
            isTranscriptOverlapNextNumeral = true;
            transcriptOverlapOffset = previousTranscriptMatchEndOffset;
          } else {
            // PROCESS OTHER SPECIAL CHARACTERS HERE
            console.log(
              `LISTENING: TranscriptOverlapAndMore but unhandled next character="${
                transcript[previousTranscript.length]
              }" was encountered.`
            );
          }
        } else {
          console.log(`unhandled case for overlap`);
        }
        // console.log(
        //   `Optimize using previous transcript state:
        //   isDetectingNewTranscript=${isDetectingNewTranscript},
        //   isDetectingNewWordToMatch=${isDetectingNewWordToMatch},
        //   previousTranscript="${previousTranscript}",
        //   previousTranscriptMatchEndOffset=${previousTranscriptMatchEndOffset},
        //   isTranscriptOverlap=${isTranscriptOverlap},
        //   isTranscriptOverlapNext=${isTranscriptOverlapNext},
        //   isTranscriptOverlapNextPartialWord=${isTranscriptOverlapNextPartialWord},
        //   isTranscriptOverlapFirstWord=${isTranscriptOverlapFirstWord},
        //   isTranscriptOverlapNextNumeral=${isTranscriptOverlapNextNumeral}`
        // );
        // console.log(
        //   `previousTranscriptOverlap="${previousTranscriptOverlap}" has transcriptOverlapOffset=${transcriptOverlapOffset} into transcript="${transcript}"`
        // );
        // transcriptToBeScanned based on optimizations
        if (transcriptOverlapOffset < transcript.length) {
          // truncate overlap
          transcriptToBeScanned = transcript.substring(transcriptOverlapOffset);
          transcriptEndOffset = transcriptOverlapOffset;
          console.log(
            `transcriptToBeScanned="${transcriptToBeScanned}", transcriptEndOffset=${transcriptEndOffset}`
          );
          console.log(
            `LISTENING: isTranscriptOverlap=${isTranscriptOverlap},
              isDetectingNewTranscript=${isDetectingNewTranscript},
              isTranscriptOverlap=${isTranscriptOverlap},
              isTranscriptOverlapNext=${isTranscriptOverlapNext},
              isTranscriptOverlapNextNumeral=${isTranscriptOverlapNextNumeral},
              previousTranscript= "${previousTranscript}",
              previousTranscriptMatchEndOffset=${previousTranscriptMatchEndOffset},
              transcript.length=${transcript.length},
              isScanningWords=${isScanningWords}`
          );
        } else if (
          isTranscriptOverlap &&
          previousTranscriptMatchEndOffset >= transcript.length
        ) {
          // matched the entire previous transcript that overlaps with current
          // transcript.
          transcriptToBeScanned = "";
        } else {
          console.log(`isTranscriptOverlapNext=false`);
          transcriptToBeScanned = transcript;
          transcriptEndOffset = 0;
        }
      } else {
        // optimize: accept initial values
      }
      // console.log(
      //   `LISTENING: scanning transcriptToBeScanned="${transcriptToBeScanned}",
      //    transcript="${transcript}"`
      // );
      isScanningWords =
        isListening &&
        (isDetectingNewTranscript || isDetectingNewWordToMatch) &&
        transcriptToBeScanned.length > 0;

      // SCANNING WORDS
      if (isScanningWords) {
        try {
          console.log(
            `LISTENING: scanning transcript="${transcriptToBeScanned}", transcriptEndOffset=${transcriptEndOffset}, expectedTerminalIdx=${expectedTerminalIdx},
            retries=${wordRetries}`
          );
          let scanArray: string[];
          let scanIdx: number;
          // let lastWordLength: number = 0;
          // let wordsScannedAlready: string; // will be setPreviousTranscript
          let wordMatched: boolean;
          let expecting: string = pageContext.terminalList[
            expectedTerminalIdx
          ].content.toLowerCase();
          let expectingAlt: string = pageContext.terminalList[
            expectedTerminalIdx
          ].altrecognition.toLowerCase();
          let isExpectingNumberAsNumerals: boolean =
            pageContext.terminalList[expectedTerminalIdx].numberAsNumerals;

          scanArray = transcriptToBeScanned.split(" ");
          let firstWordInTranscript: boolean;
          let matchEndOffset: number = 0; // first character excluded
          for (
            scanIdx = 0, wordMatched = false;
            scanIdx < scanArray.length && !wordMatched;
            scanIdx++
          ) {
            // matchEndOffset tracks the latest matched word while the
            // transcriptEndOffset tracks the end offset of missed words
            firstWordInTranscript = scanIdx === 0;
            console.log(
              `LISTENING:top of loop: expectedTermIdx=${expectedTerminalIdx}, expecting="${expecting}",  isExpectingNumberAsNumerals=${isExpectingNumberAsNumerals}, scanArray.length=${scanArray[scanIdx].length}`
            );
            console.log(`scanArray(before)="${scanArray}"`);

            if (
              isExpectingNumberAsNumerals &&
              scanArray[scanIdx].length > 1 &&
              scanArray[scanIdx].match(/^-?\d+$/)
            ) {
              // Replace number with the current numeral to be matched.
              // E.g., For "408" replace with "4" when transcriptOffset = 0,
              // "0" when transcriptOffset = 1
              let numeralArray: string[] = scanArray[scanIdx].split("");
              console.log(
                `LISTENING: numerals processing inserting
                numeralArray="${numeralArray}" into ${scanArray}`
              );
              // If the expected value is a numberAsNumerals, then expand the
              // the number so that it's component numerals can be scanned.
              // Hopefully, the first element matches.
              scanArray.splice(scanIdx, 1, ...numeralArray);
              console.log(`resulting in scanArray="${scanArray}"`);
            } else {
              // console.log(`LISTENING: invalid isExpectingNumberAsNumerals`);
            }
            console.log(
              `LISTENING: scanArray="${scanArray}", scanArray[${scanIdx}]="${
                scanArray[scanIdx]
              }", expecting="${expecting}", expectingAlt="${expectingAlt}",  match=${scanArray[
                scanIdx
              ] === expecting ||
                scanArray[scanIdx] === expectingAlt ||
                patternMatch(scanArray[scanIdx], expectingAlt)}`
            );
            let wordUttered: string = scanArray[scanIdx];
            if (wordUttered === expecting) {
              wordMatched = true;
              console.log(`MATCHED1`);
              matchMessage = `Matched "${wordUttered}" ${
                wordRetries > 0
                  ? " after " +
                    wordRetries +
                    " word " +
                    pluralize(wordRetries, "retry", "retries")
                  : ""
              }`;
            } else if (wordUttered === expectingAlt) {
              wordMatched = true;
              console.log(`MATCHED2`);
              matchMessage = `Matched "${wordUttered}" with alternative(s) "${expectingAlt}" ${
                wordRetries > 0
                  ? " after " +
                    wordRetries +
                    " word " +
                    pluralize(wordRetries, "retry", "retries")
                  : ""
              }`;
            } else if (patternMatch(wordUttered, expectingAlt)) {
              wordMatched = true;
              console.log(`MATCHED3`);
              matchMessage = `Matched "${wordUttered}" with pattern "${expectingAlt}" ${
                wordRetries > 0
                  ? " after " +
                    wordRetries +
                    " word " +
                    pluralize(wordRetries, "retry", "retries")
                  : ""
              }`;
            } else if (expecting.indexOf(wordUttered) === 0) {
              // typically compound words e.g. flash => flashcard
              console.log(`PARTIALLY MATCHED`);
              matchMessage = `Heard "${wordUttered}" that partially matched "${expecting}"; Not incrementing retries"`;
            } else {
              setWordRetries(wordRetries + 1);
              console.log(`NOT MATCHED`);
              matchMessage = `Heard "${wordUttered}" but expecting "${expecting}" or "${expectingAlt}" within "${transcript}"${
                wordRetries > 0
                  ? " after " +
                    wordRetries +
                    " word " +
                    pluralize(wordRetries, "retry", "retries")
                  : ""
              }`;
            }
            console.log(
              `transcriptEndOffset=${transcriptEndOffset} + scanArray[scanIdx].length=${scanArray[scanIdx].length}`
            );
            transcriptEndOffset += scanArray[scanIdx].length;
            if (!firstWordInTranscript && !isExpectingNumberAsNumerals) {
              // account for separator
              transcriptEndOffset++;
              console.log(`transcriptEndOffset++=${transcriptEndOffset}`);
            }
            if (wordMatched) {
              matchEndOffset = transcriptEndOffset;
            } else {
              // !wordMatched
            }
            dispatch(Request.Recognition_message(matchMessage));
            console.log(`LISTENING: ${matchMessage}`);
          } // loop

          // If last word is not a match, it might be a partial
          // match whose fragment will be wrongly truncated from the next
          // transcript by its inclusion into the future previousTranscript.
          if (wordMatched) {
            setPreviousTranscript(transcript);
            setPreviousTranscriptMatchEndOffset(matchEndOffset);
            setPreviousMatchedTerminalIdx(expectedTerminalIdx);
            setWordRetries(0);
            dispatch(Request.Recognition_match(matchMessage));
            // left unchanged setPreviousTranscriptMatchEndOffset();
          } else {
            if (currentExpectedTerminalIdx !== expectedTerminalIdx)
              setCurrentExpectedTerminalIdx(expectedTerminalIdx);
          }
        } catch (e) {
          console.log(`LISTENING: FATAL EXCEPTION: ${e}`);
          matchMessage = `Fatal: ${e}`;
        } finally {
        }
      } else {
        console.log(`no scanning`);
      }
    } else {
      matchMessage = `No new words to scan`;
    }
  }, [
    listening,
    interimTranscript,
    finalTranscript,
    terminalList,
    expectedTerminalIdx,
    previousMatchedTerminalIdx,
    nextSentence
  ]);
  useEffect(() => {
    // console.log(`LISTENING: retries`);
    if (wordRetries > maxRetries + 1) {
      // extra retry based on finalTranscript triggering without any further
      // utterance
      // console.log(`LISTENING: retries exceeded; reset transcript`);
      if (!reciteWordRequested) {
        // console.log(`LISTENING: retries exceeded; recite not requested`);
        resetTranscript();
        dispatch(Request.Recite_currentWord());
      } else {
        // console.log(`LISTENING: retries exceeded; goto next word`);
        dispatch(Request.Cursor_gotoNextWord("retries exceeded"));
        setWordRetries(0);
        console.log(`reset wordRetries`);
      }
    }
  }, [wordRetries, reciteWordRequested]);
  ///////////////////////
  // Transition callbacks
  ///////////////////////
  const message_listen: string = useAppSelector(
    store => store.message_listening
  );
  const endOfPageReached: boolean = useAppSelector(
    store => store.cursor_endOfPageReached
  );
  useEffect(() => {
    if (endOfPageReached) {
      console.log("LISTENING: stopped listening at end of page");
      dispatch(Request.Recognition_stop());
    }
  }, [listening, endOfPageReached]);

  if (SpeechRecognition.browserSupportsSpeechRecognition()) {
    // listenButton disallows listening already but just in case

    return <div className="footer-statusBar">{message_listen}</div>;
  } else {
    return (
      <div className="footer-statusBar">
        Listening monitor cannot recognize speech
      </div>
    );
  }
});
interface IListenSettingsProps {
  listenSettings: IListenSettings;
  setListenSettings: (listeningSettings: IListenSettings) => void;
  active: boolean;
}
export const ListenSettings = (props: IListenSettingsProps) => {
  const [stopAtEOS, _setStopAtEOS] = useState(
    props.listenSettings.stopAtEndOfSentence
  );
  const setStopAtEOS = (stopAtEOS: boolean) => {
    _setStopAtEOS(stopAtEOS);
    props.setListenSettings({
      ...props.listenSettings,
      stopAtEndOfSentence: stopAtEOS
    });
  };
  const [retries, _setRetries] = useState(props.listenSettings.retries);
  const setRetries = (retries: number) => {
    _setRetries(retries);
    props.setListenSettings({
      ...props.listenSettings,
      retries: retries
    });
  };
  const [timeout, _setTimeout] = useState(props.listenSettings.timeout);
  const setTimeout = (timeout: number) => {
    _setTimeout(timeout);
    props.setListenSettings({
      ...props.listenSettings,
      timeout: timeout
    });
  };
  const [listeningInterval, _setlisteningInterval] = useState(
    props.listenSettings.listeningInterval
  );
  const setListeningInterval = (listeningInterval: number) => {
    _setlisteningInterval(listeningInterval);
    props.setListenSettings({
      ...props.listenSettings,
      listeningInterval: listeningInterval
    });
  };
  const [notificationMode, _setNotificationMode] = useState(
    props.listenSettings.notificationMode
  );
  const setNotificationMode = (notification: NotificationMode) => {
    _setNotificationMode(notificationMode);
    props.setListenSettings({
      ...props.listenSettings,
      notificationMode: notification
    });
  };
  if (props.active) {
    return (
      <>
        <div className="settings-grid-section-header">Behavior</div>
        <Retries retries={retries} setRetries={setRetries} />
        <StopAtEOS stopAtEOS={stopAtEOS} setStopAtEOS={setStopAtEOS} />
        <Timeout timeout={timeout} setTimeout={setTimeout} />
        <NotificationModeRadioButton
          notificationMode={notificationMode}
          setNotificationMode={setNotificationMode}
        />
      </>
    );
  } else {
    return <></>;
  }
};
export const ListenButton = () => {
  let settingsContext: ISettingsContext = useContext(
    SettingsContext
  ) as ISettingsContext;
  const listeningAvailable = useAppSelector(store => store.listen_available);
  const listening = useAppSelector(store => store.listen_active);
  const maxRetries: number = settingsContext.settings.listen.retries;
  console.log(`listenbutton listening=${listening}`);
  console.log(`listenbutton listeningAvailable=${listeningAvailable}`);
  const dispatch = useAppDispatch();
  dispatch(Request.Recite_stop()); // disable reciting

  return (
    <>
      <img
        className="icon"
        alt="mic"
        src={
          listeningAvailable
            ? listening
              ? listenRedActiveIcon
              : listenIcon
            : listenGhostedIcon
        }
        title="start/stop listening"
        onClick={() =>
          listeningAvailable
            ? dispatch(Request.Recognition_toggle(maxRetries))
            : undefined
        }
      />
    </>
  );
};
interface IRetriesProps {
  retries: number;
  setRetries: (retries: number) => void;
}
const Retries = (props: IRetriesProps) => {
  const onChangeValue = (event: any) => {
    console.log(`onchange=${event.target.checked}`);
    props.setRetries(event.target.value);
  };
  return (
    <>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Retries:</div>
        <input
          type="number"
          min="5"
          className="textbox-control retries-textbox"
          defaultValue={props.retries}
          onChange={onChangeValue}
        />
      </div>
      <div className="settings-grid-section-footer">
        Retries specifies the number of retries before continuing to the next
        word.
      </div>
    </>
  );
};
interface IStopAtEOSProps {
  stopAtEOS: boolean;
  setStopAtEOS: (stopAtEOS: boolean) => void;
}
const StopAtEOS = (props: IStopAtEOSProps) => {
  const onChangeValue = (event: any) => {
    console.log(`onchange=${event.target.checked}`);
    props.setStopAtEOS(event.target.checked);
  };
  return (
    <>
      <div className="checkbox-container stopAtEOS-checkbox-container">
        <input
          onChange={onChangeValue}
          className="checkbox-control"
          type="checkbox"
          checked={props.stopAtEOS}
        />
        <label>Stop listening at the end of each sentence</label>
      </div>
      <div className="settings-grid-section-footer">
        Listening automatically stops at the end of each sentence as a
        convenience to the user. This also resets the listening recognition
        engine that improves recognition accuracy for the subsequent sentence.
      </div>
    </>
  );
};
interface ITimeoutProps {
  timeout: number;
  setTimeout: (voice: number) => void;
}
const Timeout = (props: ITimeoutProps) => {
  const onChangeValue = (event: any) => {
    console.log(`onchange=${event.target.value}`);
    props.setTimeout(+event.target.value);
  };
  return (
    <>
      <div className="settings-grid-section-header">Performance</div>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Listening timeout:</div>
        <div className="settings-grid-col2-control">
          <div className="slider-container timeout-slider-container">
            <div className="slider-container-label-control"></div>
            <div className="slider-container-control">
              <input
                onChange={onChangeValue}
                className="slider-control"
                defaultValue={props.timeout}
                type="range"
                min="10"
                max="60"
                step="10"
                list="steplist"
              />
              <div className="slider-container-label">
                <datalist className="ticklist" id="steplist">
                  <span>10s</span>
                  <span>20s</span>
                  <span>30s</span>
                  <span>40s</span>
                  <span>50s</span>
                  <span>60s</span>
                </datalist>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="settings-grid-section-footer">
        Listening automatically stops after this specified period of silence.
        (in seconds)
      </div>
    </>
  );
};
interface IListeningIntervalProps {
  listeningInterval: number;
  setListeningInterval: (setListeningInterval: number) => void;
}
const ListeningInterval = (props: IListeningIntervalProps) => {
  const onChangeValue = (event: any) => {
    console.log(`onchange=${event.target.value}`);
    props.setListeningInterval(+event.target.value);
  };
  return (
    <>
      <div className="settings-grid-col2-label-control">
        <div className="settings-grid-col2-label">Queuing duration:</div>
        <div className="settings-grid-col2-control">
          <div className="slider-container queuing-slider-container">
            <div className="slider-container-label-control"></div>
            <div className="slider-container-control">
              <input
                onChange={onChangeValue}
                className="slider-control"
                defaultValue={props.listeningInterval}
                type="range"
                min="5"
                max="50"
                step="5"
                list="steplist"
              />
              <div className="slider-container-label">
                <datalist className="ticklist" id="steplist">
                  <span>5ms</span>
                  <span>10ms</span>
                  <span>15ms</span>
                  <span>20ms</span>
                  <span>25ms</span>
                  <span>30ms</span>
                  <span>35ms</span>
                  <span>40ms</span>
                  <span>45ms</span>
                  <span>50ms</span>
                </datalist>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="settings-grid-section-footer">
        Queuing duration defines the buffering interval before word recognition
        occurs (in milliseconds). Shorter durations will result in better screen
        responsiveness while overall recognition accuracy will likely decline.
        Vice versa for longer durations.
      </div>
    </>
  );
};
interface INotificationsRadioButtonProps {
  notificationMode: NotificationMode;
  setNotificationMode: (notificationMode: NotificationMode) => void;
}
export const NotificationModeRadioButton = (
  props: INotificationsRadioButtonProps
) => {
  const onChangeValue = (event: any) => {
    console.log(`NotificationMode onchange=${event.target.value}`);
    props.setNotificationMode(event.target.value);
  };
  return (
    <>
      <div className="settings-grid-section-header">Notification mode</div>
      <div
        className="notificationMode-radioButton settings-grid-section-item-notification settings-radiobutton"
        onChange={onChangeValue}
      >
        <input
          type="radio"
          value={NotificationMode.voice}
          name="notificationMode"
          defaultChecked={props.notificationMode === NotificationMode.voice}
        />
        {NotificationMode.voice}
        <input
          type="radio"
          value={NotificationMode.sound}
          name="notificationMode"
          defaultChecked={props.notificationMode === NotificationMode.sound}
        />
        {NotificationMode.sound}
      </div>
      <div className="settings-grid-section-footer">
        Notifications can be communicated as prose or sounds
      </div>
    </>
  );
};
const pluralize = (count: number, singularForm: string, pluralForm: string) => {
  if (count === 1) return singularForm;
  else return pluralForm;
};
function patternMatch(content: string, altRecognitionPattern: string): boolean {
  if (altRecognitionPattern.length > 0) {
    let pattern: RegExp = new RegExp(altRecognitionPattern);
    return pattern.test(content);
  } else {
    return false;
  }
}
