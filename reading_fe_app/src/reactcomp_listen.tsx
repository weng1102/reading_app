//import React from "react";
import "./App.css";
// import mic_listening from "./mic1-xparent.gif";
// import mic_notlistening from "./mic1-inactive-xparent.gif";
// import mic_unavailable from "./mic1-ghosted.gif";
// import listenGreenActiveIcon from "./button_listen_activeGreen.gif";
import { StatusBarMessageType } from "./reducers";
import listenRedActiveIcon from "./button_listen_activeRed.gif";
import listenIcon from "./button_listen.png";
import listenGhostedIcon from "./button_listen_ghosted.png";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";
import {
  IListenSettings,
  ISettingsContext,
  NotificationMode,
  SettingsContext
} from "./settingsContext";

export const ListeningMonitor = () => {
  const [wordsPreviouslyHeard, setWordsPreviouslyHeard] = useState("");
  const [deferredDispatchStartTime, setDeferredDispatchStartTime] = useState(0);
  const [silenceCheckpoint, setSilenceCheckpoint] = useState(0);
  const dispatch = useAppDispatch();
  const listeningRequested: boolean = useAppSelector(
    store => store.listen_active
  );
  const endOfPageReached: boolean = useAppSelector(
    store => store.cursor_endOfPageReached
  );
  // const test: boolean = useAppSelector(store => store.test);
  const exceededRetries: boolean = useAppSelector(
    store => store.listen_retriesExceeded
  );
  const newSentence: boolean = useAppSelector(
    store => store.cursor_newSentenceTransition
  );
  const flushRequested: boolean = useAppSelector(store => store.listen_flush);
  // const wordRecited: boolean = useAppSelector(
  //   store => store.recite_word_requested
  // );
  let settingsContext: ISettingsContext = useContext(
    SettingsContext
  ) as ISettingsContext;
  const silenceTimeout: number = settingsContext.settings.listen.timeout;
  let queuingDuration: number =
    settingsContext.settings.listen.listeningInterval;
  //  const retries: number = useAppSelector(store => store.listen_retries);

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening
  } = useSpeechRecognition();

  // Start and stop listening manually
  // useEffect(() => {
  //   if (endOfPageReached) {
  //     console.log("stopped listening at end of page");
  //     dispatch(Request.Recognition_stop());
  //   }
  // }, [endOfPageReached]);
  // useEffect(() => {
  //   console.log(`reactcomp_listen: test 1=${test}`);
  //   dispatch(Request.Test_set());
  //   dispatch(Request.Test_reset());
  // }, [test]);
  // useEffect(() => {
  //   console.log(`reactcomp_listen: test 2=${test}`);
  //   dispatch(Request.Test_reset());
  // }, [test]);
  // useEffect(() => {
  //   console.log(`reactcomp_listen: test 3=${test}`);
  //   dispatch(Request.Test_reset());
  // }, [test]);
  // useEffect(() => {
  //   console.log(`LISTENING: ${retries} retries`);
  //   if (
  //     settingsContext.settings.listen.retries > 0 &&
  //     retries > settingsContext.settings.listen.retries
  //   ) {
  //     // dispatch(Request.Recognition_setMaxRetriesExceeded());
  //     console.log(`LISTENING: Exceeded ${retries} retries, goto next word`);
  //   }
  // }, [retries]);

  //////////////////////////////
  // useEffect(() => {
  //   const maxRetries: number = settingsContext.settings.listen.retries;
  //   //    const idx: number = useAppSelector(store => store.cursor_terminalIdx);
  //   if (exceededRetries) {
  //     console.log(`LISTENING: Exceeded ${maxRetries} retries, next word`);
  //     // get current word; say the word
  //     dispatch(Request.Recite_currentWord());
  //     //      dispatch(Request.Cursor_gotoNextWord());
  //   }
  // }, [exceededRetries]);
  // useEffect(() => {
  //   if (exceededRetries && reciteWordRequested) {
  //     dispatch(Request.Cursor_gotoNextWord());
  //   }
  // }, wordRrecited]);
  useEffect(() => {
    if (endOfPageReached) {
      console.log("LISTENING: stopped listening at end of page");
      dispatch(Request.Recognition_stop());
    }
  }, [listening, endOfPageReached]);
  // useEffect(() => {
  //   if (!listeningRequested) {
  //     dispatch(Request.Recognition_stop());
  //     console.log("LISTENING: stop listening requested");
  //   }
  // }, [listening, listeningRequested]);
  // useEffect(() => {
  //   if (!listeningRequested) {
  //     dispatch(Request.Recognition_stop());
  //     console.log("LISTENING: stop listening requested");
  //   }
  // }, [listening, listeningRequested]);
  useEffect(() => {
    // start listening, listen and stop listening
    if (listening) {
      if (!listeningRequested) {
        dispatch(Request.Recognition_stop());
        console.log("LISTENING: stop listening requested");
      }
    } else if (listeningRequested) {
      // KLUDGE BECAUSE REDUCER NEEDS INITIAL RETRIES. Subsequent changes
      // retries managed within setting dialog
      console.log(
        `LISTENING: start listening with timeout=${silenceTimeout}s and buffering time=${queuingDuration}ms`
      );
      if (silenceCheckpoint === 0) {
        setSilenceCheckpoint(Date.now()); // will only works continuuous=false
        console.log(`LISTENING: set silence checkpoint=${silenceCheckpoint}`);
      }
      if (deferredDispatchStartTime === 0) {
        setDeferredDispatchStartTime(Date.now());
      }
      SpeechRecognition.startListening(); // timeout periodically not continuous: true
    } else {
      console.log("LISTENING: continue not listening");
      SpeechRecognition.abortListening(); //just in case
      console.log(`LISTENING: reset silence checkpoint`);
      setSilenceCheckpoint(0);
    }
  }, [
    listening,
    listeningRequested,
    deferredDispatchStartTime,
    silenceCheckpoint,
    setSilenceCheckpoint
  ]);
  useEffect(() => {
    // listening
    // must have [listening] as dependency to allow effect to periodically
    // trigger based on SpeechRecognition internal trigger.
    let words: string;
    if (finalTranscript !== "") {
      console.log(`LISTENING: final transcript=${finalTranscript} `);
      words = finalTranscript;
      resetTranscript();
    } else {
      words = interimTranscript;
    }
    // defer dispatch(CursorActions.matchWord()) to allow speechrecognition to
    // gather additional context. The SpeechRecogition object only triggers
    // (asynchronously) when it detects speech (and when it detects silence
    // for several seconds). This effect must balance this deferment with
    // the component updating the current word recited.
    if (words.length === 0 || words === wordsPreviouslyHeard) {
      let timeoutDuration = Math.round((Date.now() - silenceCheckpoint) / 1000);
      console.log(`LISTENING: timeout in ${silenceTimeout - timeoutDuration}s`);
      if (timeoutDuration > silenceTimeout) {
        dispatch(Request.Recognition_stop());
        setWordsPreviouslyHeard("");
      } else if (words === wordsPreviouslyHeard) {
        console.log(`LISTENING: heard nothing new "${words}"`);
      }
    } else {
      setWordsPreviouslyHeard(words);
      setSilenceCheckpoint(Date.now());
      const msecBeforeDispatch = queuingDuration; //msec
      let deferredDispatchWaitDuration = Date.now() - deferredDispatchStartTime;
      if (deferredDispatchWaitDuration > msecBeforeDispatch) {
        console.log(
          `LISTENING: matchWords(${words}]) dispatched timeout after ${deferredDispatchWaitDuration -
            msecBeforeDispatch}ms remaining`
        );
        dispatch(Request.Cursor_matchWords(words));
        setDeferredDispatchStartTime(Date.now());
        // NOTE: only reset transcript at the end of sentence!
      } else {
        console.log(
          `LISTENING: deferring dispatch for interimTranscript=${words}`
        );
      }
    }
  }, [
    listening,
    deferredDispatchStartTime,
    setDeferredDispatchStartTime,
    silenceCheckpoint,
    setSilenceCheckpoint,
    interimTranscript,
    finalTranscript,
    resetTranscript
  ]);
  useEffect(() => {
    if (newSentence) {
      console.log(`LISTENING: new sentence transition`);
      dispatch(Request.Recognition_flush());
      // dispatch(
      //   Request.Message_set(
      //     "new sentence transition",
      //     StatusBarMessageType.listening
      //   )
      // );
      // } else {
      //   dispatch(Request.Message_clear(StatusBarMessageType.listening));
    }
  }, [newSentence]);
  useEffect(() => {
    if (flushRequested) {
      console.log(`LISTENING: flushing transcript queue`);
      resetTranscript();
      dispatch(Request.Recognition_flushed());
    } else {
    }
  }, [flushRequested]);

  const message_listen: string = useAppSelector(
    store => store.message_listening
  );
  if (SpeechRecognition.browserSupportsSpeechRecognition()) {
    // listenButton disallows already
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
        <ListeningInterval
          listeningInterval={listeningInterval}
          setListeningInterval={setListeningInterval}
        />
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
