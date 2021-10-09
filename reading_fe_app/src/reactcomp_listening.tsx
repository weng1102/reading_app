//import React from "react";
import "./App.css";
import mic_listening from "./mic1-xparent.gif";
import mic_notlistening from "./mic1-inactive-xparent.gif";
import mic_unavailable from "./mic1-ghosted.gif";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useEffect, useState, useContext } from "react";
import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

export const ListeningMonitor = () => {
  const [deferredDispatchStartTime, setDeferredDispatchStartTime] = useState(0);
  const [silenceCheckpoint, setSilenceCheckpoint] = useState(0);
  const dispatch = useAppDispatch();
  const listeningRequested: boolean = useAppSelector(
    store => store.listen_active
  );
  const flushRequested: boolean = useAppSelector(store => store.listen_flush);
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
      console.log("start listening");
      if (silenceCheckpoint === 0) {
        setSilenceCheckpoint(Date.now()); // will only works continuuous=false
        console.log(`set silence checkpoint=${silenceCheckpoint}`);
      }
      if (deferredDispatchStartTime === 0) {
        setDeferredDispatchStartTime(Date.now());
      }
      SpeechRecognition.startListening(); // timeout periodically not continuous: true
    } else {
      console.log("keep not listening");
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
    const timeoutLimit = 20; // seconds
    if (words.length === 0) {
      let timeoutDuration = Math.round((Date.now() - silenceCheckpoint) / 1000);
      console.log(`timeout in ${timeoutLimit - timeoutDuration}s`);
      if (timeoutDuration > timeoutLimit) {
        dispatch(Request.Recognition_stop());
      }
    } else {
      setSilenceCheckpoint(Date.now());
      const msecBeforeDispatch = 10; //msec
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
export const ListenButton = () => {
  //
  const listeningAvailable = useAppSelector(store => store.listen_available);
  const listening = useAppSelector(store => store.listen_active);
  console.log(`listenbutton listening=${listening}`);
  console.log(`listenbutton listeningAvailable=${listeningAvailable}`);
  const dispatch = useAppDispatch();
  return (
    <button
      className="listenButton"
      onClick={() =>
        listeningAvailable ? dispatch(Request.Recognition_toggle()) : undefined
      }
    >
      <img
        className="listenButtonImg"
        src={
          listeningAvailable
            ? listening
              ? mic_listening
              : mic_notlistening
            : mic_unavailable
        }
        alt="mic"
      />
    </button>
  );
};
