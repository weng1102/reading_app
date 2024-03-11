/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_listen.tsx
 *
 * Defines React front end functional components for listening.
 *
 * The speak transcription adds words to the end of word queue as speak
 * recognition pops words from the beginning of the word queue.
 * more words are detected the words are appended to the end of
 * the queue as the
 *
 * Version history:
 *
 **/
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
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import {
  IListenSettings,
  ISettingsContext,
  NotificationMode,
  SettingsContext
} from "./settingsContext";
// import { SpeechRecognition as SpeechRec } from "dom-speech-recognition";

export const ListeningMonitor = () => {
  // let recognition = SpeechRecognition.getRecognition().;
  // recognition.
  // if ("webkitSpeechRecognition" in window) {
  //   recognition = new webkitSpeechRecognition();
  //   SpeechRecognition;
  //   recognition.maxAlternatives = 10;
  //   console.log("webkitSpeechRecognition available");
  //   recognition.setSpeechRecognition();
  //   recognition.maxAlternatives = 2;
  // } else if ("SpeechRecognition" in window) {
  //   console.log("webkitSpeechRecognition available");
  // } else {
  //   console.log("(webkit)SpeechRecognition not available");
  // }
  //  console.log = function() {}; // disable console logging
  const [wordsHeardPreviously, setWordsHeardPreviously] = useState(
    "" as string
  );
  const [wordPosition, setWordPosition] = useState(-1 as number);
  const [wordPositionPreviously, setWordPositionPreviously] = useState(
    -1 as number
  );
  const [wordRetries, setWordRetries] = useState(0 as number);
  const resetListeningState = () => {
    setWordPositionPreviously(-1);
    setWordPosition(-1);
    setWordsHeardPreviously("");
    setWordRetries(0 as number);
    console.log(`reset wordRetries resetListeningState`);
  };
  const dispatch = useAppDispatch();

  const listeningRequested: boolean = useAppSelector(
    store => store.listen_active
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
  const ContinuousListeningInEnglish: IRecognitionArguments = useMemo(
    () => ({
      continuous: true,
      interimResults: true,
      language: "en-US"
    }),
    []
  );
  const [silenceTimerId, setSilenceTimerId] = useState<
    ReturnType<typeof setTimeout>
  >();
  // useRef to retrieve the current value of state variable when the function
  // is invoked and not when it is scheduled
  const silenceTimerIdRef = useRef(silenceTimerId);
  // const startSilenceTimer1 = (): ReturnType<typeof setTimeout> => {
  //   if (silenceTimerId !== undefined) {
  //     clearTimeout(silenceTimerId);
  //     // console.log(`clearing previous silence timer for id=${silenceTimerId}`);
  //   }
  //   let timerId = setTimeout(() => {
  //     console.log(`SILENCE TIMEOUT TRIGGERED`);
  //     // in this case same as stopListening() since not speech processing
  //     // and Recognition_stop would eventually terminate listening
  //     SpeechRecognition.abortListening();
  //     dispatch(Request.Recognition_stop());
  //   }, silenceTimeout * 1000);
  //   // console.log(`Starting silence timer for id=${retval}`);
  //   setSilenceTimerId(timerId);
  //   return timerId;
  // };
  const startSilenceTimer = useCallback((): ReturnType<typeof setTimeout> => {
    if (silenceTimerId !== undefined) {
      clearTimeout(silenceTimerId);
      // console.log(`clearing previous silence timer for id=${silenceTimerId}`);
    }
    let timerId = setTimeout(() => {
      console.log(`SILENCE TIMEOUT TRIGGERED`);
      // in this case same as stopListening() since not speech processing
      // and Recognition_stop would eventually terminate listening
      SpeechRecognition.abortListening();
      dispatch(Request.Recognition_stop());
    }, silenceTimeout * 1000);
    // console.log(`Starting silence timer for id=${retval}`);
    setSilenceTimerId(timerId);
    return timerId;
  }, [dispatch, silenceTimerId, silenceTimeout, setSilenceTimerId]);
  //
  // const startSilenceTimer = (): ReturnType<typeof setTimeout> => {
  //   if (silenceTimerId !== undefined) {
  //     clearTimeout(silenceTimerId);
  //     // console.log(`clearing previous silence timer for id=${silenceTimerId}`);
  //   }
  //   let retval = setTimeout(() => {
  //     console.log(`SILENCE TIMEOUT TRIGGERED`);
  //     // in this case same as stopListening() since not speech processing
  //     // and Recognition_stop would eventually terminate listening
  //     SpeechRecognition.abortListening();
  //     dispatch(Request.Recognition_stop());
  //   }, silenceTimeout * 1000);
  //   // console.log(`Starting silence timer for id=${retval}`);
  //   setSilenceTimerId(retval);
  //   return retval;
  // };
  const clearSilenceTimer = () => {
    if (silenceTimerIdRef.current !== undefined) {
      // console.log(`clearing silence timer id=${silenceTimerIdRef.current}`);
      clearTimeout(silenceTimerIdRef.current);
    }
  };
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening
  } = useSpeechRecognition();
  ////////////////////////////////////
  // Start and stop listening manually
  ////////////////////////////////////
  useEffect(() => {
    if (!listening && listeningRequested) {
      console.log(`restart listening because browser eventually times out`);
      console.log(
        `ContinuousListeningInEnglish=${ContinuousListeningInEnglish.interimResults},${ContinuousListeningInEnglish.continuous}`
      );
      // resetTranscript();
      SpeechRecognition.startListening(ContinuousListeningInEnglish);
    }
  }, [listening, listeningRequested, ContinuousListeningInEnglish]);
  useEffect(() => {
    if (!listeningRequested) {
      dispatch(Request.Recognition_stop());
      SpeechRecognition.abortListening();
      resetTranscript();
      clearSilenceTimer();
      console.log("LISTENING: stop listening requested");
    } else {
      // timeout periodically not
      SpeechRecognition.startListening(ContinuousListeningInEnglish);

      // console.log(`LISTENING: start listening with timeout=${silenceTimeout}s`);
      startSilenceTimer();
      console.log(
        `initial setSilenceTimer for id=${silenceTimerIdRef.current}`
      );
    }
  }, [
    //startSilenceTimer,
    listeningRequested,
    ContinuousListeningInEnglish,
    dispatch
  ]);
  const expectedTerminalIdx: number = useAppSelector(
    store => store.cursor_terminalIdx
  );
  let terminalList = pageContext === null ? null : pageContext.terminalList;
  useEffect(() => {
    let wordsHeard: string;
    let wordsHeardList: string[];
    let wordMatchingRequested: boolean = false;
    let finalTranscriptEncountered: boolean = false;
    if (!listening) {
      // console.log(`LISTENING: No longer listening...`);
      if (listeningRequested) {
        console.log(`listening requested"`);
        // speech recognition timed out
        // console.log(`NO LONGER LISTENING...BUT LISTENING RESTARTED`);

        SpeechRecognition.startListening(ContinuousListeningInEnglish); // timeout periodically not
      } else {
        console.log(`listening not requested"`);
      }
    } else {
      console.log(`still listening"`);
    }
    if (listening) {
      //
      // HEARING
      //
      console.log(`LISTENING: *********************"`);
      if (finalTranscript !== "") {
        finalTranscriptEncountered = true;
        wordsHeard = finalTranscript;
        resetTranscript();
        console.log(`**********final=${wordsHeard}`);
      } else {
        wordsHeard = interimTranscript;
        console.log(`interim=${interimTranscript}`);
      }
      console.log(`LISTENING: Hearing "${wordsHeard}"`);
      //
      // TOKENIZING
      //
      let numberAsNumerals: boolean =
        pageContext.terminalList[expectedTerminalIdx].numberAsNumerals;
      if (numberAsNumerals && wordsHeard.match(/^[0-9]+$/)) {
        // need alternative split parse algorithm for list of numerals as:
        // - a number (408) is 4, 0, 8 and not "four hundred eight"
        // - an address number, phone numbers, ssn, driver license number
        wordsHeardList = Array.from(wordsHeard);
        console.log(`LISTENING: detecting number`);
      } else {
        wordsHeardList = wordsHeard.split(" ");
        console.log(`LISTENING: detecting not number`);
      }
      console.log(`LISTENING: Tokenizing into list="${wordsHeardList}"`);
      console.log(
        `LISTENING: wordsHeardPreviously  list="${wordsHeardPreviously}", ${wordPositionPreviously}`
      );
      //
      // DETECTING whether recognition is necessary: silence, redundancy
      //
      if (wordsHeard.length === 0) {
        // Heard nothing at all
        //resetListeningState();
        console.log(`LISTENING: Detecting nothing: resetting state`);
        // } else if (wordsPreviouslyHeard === wordsHeard) {
        //   console.log(`detecting only previous words`);
        wordMatchingRequested = false;
      } else if (
        wordPosition === wordPositionPreviously &&
        wordsHeardPreviously.includes(wordsHeard)
      ) {
        wordMatchingRequested = false;
        //   // Heard nothing new
        //   // same word i.e., same word within same words heard list
        //   // the interim transcript still not completely processed
        console.log(
          `LISTENING: Detecting nothing else new only previously heard words: wordPosition=${wordPosition} wordPositionPreviously=${wordPositionPreviously} wordsHeard=""${wordsHeard}" wordsHeardList=""${wordsHeardList}" wordsHeardList.length=${wordsHeardList.length} wordsHeardPreviously=${wordsHeardPreviously}`
        );
      } else if (
        wordsHeard === wordsHeardPreviously &&
        // wordPosition === wordPositionPreviously &&
        wordPosition === wordsHeardList.length - 1
      ) {
        wordMatchingRequested = false;
        // Heard nothing new: previous and current are the same and word
        // position is pointing at the last word in the list
        // setWordPositionPreviously(-1);
        // setWordPosition(-1);
        // setWordsHeardPreviously("");
        console.log(
          `LISTENING: Detecting nothing new: resetting everything except retries wordPosition=${wordPosition} wordPositionPreviously=${wordPositionPreviously} wordsHeard=""${wordsHeard}" wordsHeardList=""${wordsHeardList}" wordsHeardList.length=${wordsHeardList.length} wordsHeardPreviously=${wordsHeardPreviously}`
        );
      } else if (wordPosition > wordsHeardList.length) {
        wordMatchingRequested = false;
        console.log(
          `LISTENING: Detecting wordPosition=${wordPosition} exceeds wordsHeardList.length=${wordsHeardList.length} wordsHeardList=${wordsHeardList}`
        );
      } else {
        // heard a new word
        wordMatchingRequested = true;
        console.log(`LISTENING: Detecting new words="${wordsHeard}"`);
        setWordsHeardPreviously(wordsHeard);
        setWordPositionPreviously(-1);
        setWordPosition(-1);
        // setWordPosition(-1); // are these new words????
      }
      //
      // WORD MATCHING
      //
      if (wordMatchingRequested) {
        console.log(`LISTENING: matching 1`);
        let matchMessage: string;
        startSilenceTimer();
        let expecting: string = pageContext.terminalList[
          expectedTerminalIdx
        ].content.toLowerCase();
        let expectingAlt: string = pageContext.terminalList[
          expectedTerminalIdx
        ].altrecognition.toLowerCase();
        console.log(
          `LISTENING: Matching words="${wordsHeard}" at wordPos=${wordPosition}, wordPosPrev=${wordPositionPreviously} expecting="${expecting}" expectingAlt="${expectingAlt}"`
        );
        let wordPos: number;
        let wordHeard: string;
        setWordPositionPreviously(wordPosition);
        console.log(
          `LISTENING: Matching prior to loop wordPosition=${wordPosition} wordPositionPreviously=${wordPositionPreviously} wordsHeard=""${wordsHeard}" wordsHeardList=""${wordsHeardList}" wordsHeardList.length=${wordsHeardList.length} wordsHeardPreviously=${wordsHeardPreviously}`
        );
        for (
          wordPos = wordPosition + 1;
          wordPos < wordsHeardList.length;
          wordPos++
        ) {
          console.log(
            `LISTENING: Matching loop wordPos=${wordPos}  wordPosPrev=${wordPositionPreviously} wordRetries=${wordRetries}`
          );
          wordHeard = wordsHeardList[wordPos].toLowerCase();
          if (expecting === wordHeard) {
            setWordPosition(wordPos);
            setWordRetries(0);
            //            console.log(`reset wordRetries1`);
            matchMessage = `Matching "${expecting}" with "${wordHeard}", ${wordRetries} word retries`;
            console.log(
              `LISTENING: ${matchMessage} wordPos=${wordPos} wordPosPrev=${wordPositionPreviously}`
            );
            dispatch(Request.Recognition_match(matchMessage));
            break;
          } else if (expectingAlt === wordHeard) {
            setWordPosition(wordPos);
            setWordRetries(0);
            // console.log(`reset wordRetries2`);
            matchMessage = `Matching alternative "${expectingAlt}, ${wordRetries} word retries`;
            console.log(
              `LISTENING: ${matchMessage} wordPos=${wordPos} wordPosPrev=${wordPositionPreviously}`
            );
            dispatch(Request.Recognition_match(matchMessage));
            break;
          } else if (patternMatch(wordHeard, expectingAlt)) {
            setWordPosition(wordPos);
            setWordRetries(0);
            // console.log(`reset wordRetries3`);
            matchMessage = `Matching pattern with "${expectingAlt}", ${wordRetries} word retries`;
            console.log(
              `LISTENING: ${matchMessage} wordPos=${wordPos}  wordPosPrev=${wordPositionPreviously}`
            );
            dispatch(Request.Recognition_match(matchMessage));
            break;
          } else {
            setWordRetries(wordRetries + 1);
            matchMessage = `Matching failed expecting "${expecting}" or  "${expectingAlt}" but hearing word "${wordHeard}" within clause "${wordsHeard}", ${wordRetries} word retries`;
            console.log(
              `LISTENING: ${matchMessage} wordPos=${wordPos}  wordPosPrev=${wordPositionPreviously}`
            );
            dispatch(Request.Recognition_message(matchMessage));
          }
          // console.log(`${matchMessage}`);
        }
      }
      if (finalTranscriptEncountered) {
        console.log(`LISTENING: finalTransceriptEncountered`);
        resetListeningState();
      }
      console.log(`END LISTENING: *****************"`);
    }
    return () => {
      console.log(`LISTENING: Clearing timer`);
      clearTimeout(silenceTimerIdRef.current!);
    };
  }, [
    listening, // will be false when user manually aborts speech
    listeningRequested, // required to stop SpeechRecognition from listening
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    expectedTerminalIdx,
    ContinuousListeningInEnglish,
    dispatch,
    terminalList,
    wordPosition,
    wordPositionPreviously,
    wordRetries,
    wordsHeardPreviously,
    startSilenceTimer
  ]);
  // const retriesExceeded = useAppSelector(store => store.listen_retriesExceeded);
  const reciteWordRequested = useAppSelector(
    store => store.recite_word_requested
  );
  useEffect(() => {
    // console.log(`LISTENING: retries`);
    if (wordRetries > maxRetries) {
      // console.log(`LISTENING: retries exceeded; reset transcript`);
      if (!reciteWordRequested) {
        // console.log(`LISTENING: retries exceeded; recite not requested`);
        resetTranscript();
        dispatch(Request.Recite_currentWord());
      } else {
        // console.log(`LISTENING: retries exceeded; goto next word`);
        dispatch(Request.Cursor_gotoNextWord("retries exceeded"));
        setWordRetries(0);
        console.log(`reset wordRetries4`);
      }
    }
  }, [wordRetries, reciteWordRequested, maxRetries, resetTranscript, dispatch]);
  // const flushRequested: boolean = useAppSelector(store => store.listen_flush);
  // useEffect(() => {
  //   if (flushRequested) {
  //     console.log(`LISTENING: flushing transcript queue`);
  //     resetTranscript();
  //     dispatch(Request.Recognition_flushed());
  //   } else {
  //   }
  // }, [flushRequested]);

  ///////////////////////
  // Transition callbacks
  ///////////////////////
  const newSentence: boolean = useAppSelector(
    store => store.cursor_newSentenceTransition
  );
  useEffect(() => {
    if (newSentence) {
      console.log(`LISTENING: new sentence transition`);
      //      dispatch(Request.Recognition_flush());
      resetListeningState();
      resetTranscript();
    }
  }, [newSentence, resetTranscript]);
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
  }, [listening, endOfPageReached, dispatch, resetTranscript]);

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
};
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
        className="notificationMode-radioButton settings-grid-section-item-notification"
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
function patternMatch(content: string, altRecognitionPattern: string): boolean {
  if (altRecognitionPattern.length > 0) {
    let pattern: RegExp = new RegExp(altRecognitionPattern);
    return pattern.test(content);
  } else {
    return false;
  }
}
