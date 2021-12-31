//import React from "react";
import "./App.css";
import mic_listening from "./mic1-xparent.gif";
import mic_notlistening from "./mic1-inactive-xparent.gif";
import mic_unavailable from "./mic1-ghosted.gif";
import listenGreenActiveIcon from "./button_listen_activeGreen.gif";
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
  const [deferredDispatchStartTime, setDeferredDispatchStartTime] = useState(0);
  const [silenceCheckpoint, setSilenceCheckpoint] = useState(0);
  const dispatch = useAppDispatch();
  const listeningRequested: boolean = useAppSelector(
    store => store.listen_active
  );
  const flushRequested: boolean = useAppSelector(store => store.listen_flush);
  const newSentence: boolean = useAppSelector(
    store => store.cursor_newSentenceTransition
  );
  let settingsContext: ISettingsContext = useContext(
    SettingsContext
  ) as ISettingsContext;
  let silenceTimeout: number = settingsContext.settings.listen.timeout;
  let queuingDuration: number =
    settingsContext.settings.listen.listeningInterval;
  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening
  } = useSpeechRecognition();

  // Start and stop listening manually
  useEffect(() => {
    if (listening) {
      if (!listeningRequested) {
        console.log("stop listening");
        SpeechRecognition.stopListening();
      }
    } else if (listeningRequested) {
      console.log(
        `start listening with timeout=${silenceTimeout}s and buffering=${queuingDuration}ms`
      );
      if (silenceCheckpoint === 0) {
        setSilenceCheckpoint(Date.now()); // will only works continuuous=false
        console.log(`set silence checkpoint=${silenceCheckpoint}`);
      }
      if (deferredDispatchStartTime === 0) {
        setDeferredDispatchStartTime(Date.now());
      }
      SpeechRecognition.startListening(); // timeout periodically not continuous: true
    } else {
      console.log("continue not listening");
      SpeechRecognition.abortListening(); //just in case
      console.log(`reset silence checkpoint`);
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
    // must have [listening] as dependency to allow effect to periodically
    // trigger based on SpeechRecognition internal trigger.
    let words: string;
    if (finalTranscript !== "") {
      console.log(`final transcript=${finalTranscript} `);
      words = finalTranscript;
      resetTranscript();
    } else {
      words = interimTranscript;
    }
    // defer dispatch(CursorActions.matchWord()) to allow speechrecognition to
    // gather additional context. The SpeechRecogition object only triggers
    // (asynchronously) when it detects speech (and when it detects silence
    // for several seconds). This effect must balance this with the component
    // updating the current word recited.
    //    const timeoutLimit = 20;
    //  const silenceTimeout = 20; // seconds
    if (words.length === 0) {
      let timeoutDuration = Math.round((Date.now() - silenceCheckpoint) / 1000);
      console.log(`timeout in ${silenceTimeout - timeoutDuration}s`);
      if (timeoutDuration > silenceTimeout) {
        dispatch(Request.Recognition_stop());
      }
    } else {
      setSilenceCheckpoint(Date.now());
      const msecBeforeDispatch = queuingDuration; //msec
      let deferredDispatchWaitDuration = Date.now() - deferredDispatchStartTime;
      if (deferredDispatchWaitDuration > msecBeforeDispatch) {
        console.log(`dispatch timeout after ${deferredDispatchWaitDuration}ms`);
        dispatch(Request.Cursor_matchWords(words)); // required to update current word on page
        setDeferredDispatchStartTime(Date.now());
        // NOTE: only reset transcript at the end of sentence!!!!!!!
      } else if (flushRequested) {
        console.log(`flushing transcript queue`);
        resetTranscript();
        dispatch(Request.Recognition_flush(false));
      } else {
        console.log(`deferring dispatch for interimTranscript=${words}`);
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
    resetTranscript,
    dispatch,
    flushRequested
  ]);
  if (SpeechRecognition.browserSupportsSpeechRecognition()) {
    // listenButton disallows already
    return <div>{interimTranscript}</div>;
  } else {
    return <div>Listening monitor cannot recognize speech</div>;
  }
};
interface IListenSettingsProps {
  listenSettings: IListenSettings;
  setListenSettings: (listeningSettings: IListenSettings) => void;
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
  return (
    <>
      <div className="settings-section-header">Listen</div>
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
};
export const ListenButton = () => {
  //
  const listeningAvailable = useAppSelector(store => store.listen_available);
  const listening = useAppSelector(store => store.listen_active);
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
        onClick={() =>
          listeningAvailable
            ? dispatch(Request.Recognition_toggle())
            : undefined
        }
      />
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
      <div className="settings-grid-section-header">Performance</div>
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
