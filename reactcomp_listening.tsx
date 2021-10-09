const ReadingMonitor = () => {
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
  // detect transcript reset (i.e., end of sentence)
  // useEffect(() => {
  //   console.log(`flushing transcript queue 1`);
  //   resetTranscript();
  //   dispatch(ListeningActions.flush(false));
  // }, [flushRequested]);
  //detect speech
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
        console.log(`flushing transcript queue 2`);
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
    return <div>Reading monitor cannot recognize speech</div>;
  }
};
