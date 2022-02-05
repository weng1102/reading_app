/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reducers.ts
 *
 * Defines React redux states and transition.
 * Reducer - a function that takes a current state value and an
 * action object describing "what happened", and returns a new state value.
 * A reducer's function signature is: (state, action) => newState
 *
 * The Redux state should contain only plain JS objects, arrays, and primitives.
 * The root state value is usually an object.  It's important that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * Version history:
 *
 **/
import { CPageLists } from "./pageContext";
const IDX_INITIALIZER = -9999; // should be same as baseclasses.ts

// word actions
const WORD_MATCH = "word/match"; // match word with argument with current word
//const WORD_VISIT = "word/visit"; // visit word with argument
const WORD_NEXT = "word/next"; // next word in sentence
const WORD_PREVIOUS = "word/previous"; // previous word in sentence
//const WORD_RESET = "word/reset"; // first word in page
const WORD_SELECT = "word/select"; // selected word in sentence

// sentence actions
const SENTENCE_FIRST = "sentence/first"; // position at first word in sent.
const SENTENCE_NEXT = "sentence/next"; // position at first word of next sent.
const SENTENCE_PREVIOUS = "sentence/prev"; // first word of previous sentence

// section actions
// const SECTION_FIRST = "section/first"; // first word in first section
// const SECTION_NEXT = "section/next";
// const SECTION_PREVIOUS = "section/prev";
// const SECTION_RESET = "section/reset"; // first section in sections
const SECTION_CHANGE = "section/change"; // absolute positioning e.g., navbar

// page actions
const PAGE_LOAD = "page/load";
const PAGE_LOADED = "page/loaded";
const PAGE_TOP = "page/top";
//const PAGE_RESET = "page/reset";
const PAGE_LINKTO = "page/link to";

// intrapage administrative actions (non-user initiated)
const CONTEXT_SET = "context/set";

//listening actions
const LISTENING_AVAILABLE = "listening/available";
const LISTENING_FLUSH = "listening/flush"; // clear transcript
const LISTENING_FLUSHED = "listening/flushed"; // clear transcript
const LISTENING_START = "listening/start";
const LISTENING_STOP = "listening/stop";
const LISTENING_TOGGLE = "listening/toggle"; // related to start/stop

// speaking actions
const ANNOUNCE_MESSAGE = "announce/message";
const ANNOUNCE_ACKNOWLEDGED = "announce/message acknowledged";
//const ANNOUNCE_SELECTEDCONTENT = "announce/selected content"; // acknowledge completion of speaking
// const ANNOUNCE_CURRENTSENTENCE = "announce/selected content";  // acknowledge completion of speaking
const ANNOUNCE_AVAILABILITY = "announce/available";
// const ANNOUNCE_NEWSENTENCE = "announce/new sentence";
// const ANNOUNCE_NEWSECTION = "announce/new section";
//const SPEAKING_START = "announce/start";
//const SPEAKING_STOP = "announce/available";

// const WORDS_VISITED_RESET = "wordsvisited/reset";
// const WORDS_VISITED = "wordsvisited/set";

const TRANSITION_ACKNOWLEDGE = "transition/acknowledge";

// reciting
//const RECITING = "reciting"; // state of reciting
const RECITING = "reciting"; // actual state of reciting
// const RECITING_BEGIN = "reciting/start"; // actual state of reciting begin
// const RECITING_END = "reciting/end"; // actual reciting end (stopped)

//const RECITE = "recite";  // requests to start and stop recite
const RECITE_START = "recite/start";
const RECITE_STOP = "recite/stop";
const RECITE_TOGGLE = "recite/toggle"; // request from recite button
const SETTINGS_TOGGLE = "settings/toggle";

// message/status bar actions
const MESSAGE_SET = "message/set";
const MESSAGE_CLEAR = "message/clear";
// Actions
const Speech_acknowledged = () => {
  return {
    type: ANNOUNCE_ACKNOWLEDGED
  };
};
const Speech_announceMessage = (message: string) => {
  return {
    type: ANNOUNCE_MESSAGE,
    payload: message
  };
};
const Speech_announceListeningStart = () => {
  //retrieve message from context
  let message: string = "Listening";
  return {
    type: ANNOUNCE_MESSAGE,
    payload: message
  };
};
const Speech_announceListeningStop = () => {
  //retrieve message from context
  let message: string = "Stopped listening";
  return {
    type: ANNOUNCE_MESSAGE,
    payload: message
  };
};
const Speech_setAvailability = (yes: boolean) => {
  return {
    type: ANNOUNCE_AVAILABILITY,
    payload: yes
  };
};
// const Speech_announceNewSection = (yes: boolean) => {
//   let message: string = "new section";
//   return {
//     type: ANNOUNCE_MESSAGE,
//     payload: message
//   };
// };
const Cursor_gotoFirstSentence = () => {
  return {
    type: SENTENCE_FIRST
  };
};
// const Speech_announceNewSentence = (yes: boolean) => {
//   let message: string = "new section";
//   return {
//     type: ANNOUNCE_MESSAGE,
//     payload: message
//   };
// };
const Speech_announceCurrentContent = () => {
  let message: string = "selected word or sentence";
  return {
    type: ANNOUNCE_MESSAGE,
    payload: message
  };
};
const Cursor_gotoFirstSection = () => {
  // set   cursor_terminalIdx: number = 0
  return {
    type: WORD_SELECT,
    payload: 0
  };
};
const Cursor_matchWords = (words: string) => {
  return {
    type: WORD_MATCH,
    payload: words
  };
};
const Cursor_gotoFirstWord = () => {
  // first word of sentence
  return {
    type: SENTENCE_FIRST
  };
};
const Cursor_gotoNextWord = () => {
  return {
    type: WORD_NEXT
  };
};
const Cursor_gotoNextSentence = () => {
  return {
    type: SENTENCE_NEXT
  };
};
const Cursor_gotoPreviousWord = () => {
  return {
    type: WORD_PREVIOUS
  };
};
const Cursor_gotoPreviousSentence = () => {
  return {
    type: SENTENCE_PREVIOUS
  };
};
const Cursor_gotoWordByIdx = (terminalIdx: number) => {
  return {
    type: WORD_SELECT,
    payload: terminalIdx
  };
};
const Cursor_gotoSectionByIdx = (sectionIdx: number) => {
  return {
    type: SECTION_CHANGE,
    payload: sectionIdx
  };
};
const Cursor_acknowledgeTransition = () => {
  return {
    type: TRANSITION_ACKNOWLEDGE
  };
};
const Message_set = (message: string) => {
  return {
    type: MESSAGE_SET,
    payload: message
  };
};
const Message_clear = () => {
  return {
    type: MESSAGE_SET,
    payload: ""
  };
};
const Page_load = (page: string) => {
  return {
    type: PAGE_LOAD,
    payload: page
  };
};
const Page_loaded = (loaded: boolean) => {
  return {
    type: PAGE_LOADED,
    payload: loaded
  };
};
const Page_gotoLink = () => {
  return {
    type: PAGE_LINKTO
  };
};
const Page_setContext = (context: CPageLists) => {
  return {
    type: CONTEXT_SET,
    payload: context
  };
};
const Recognition_toggle = () => {
  return {
    type: LISTENING_TOGGLE
  };
};
const Recognition_flush = (yes: boolean) => {
  return {
    type: LISTENING_FLUSH,
    payload: yes
  };
};
const Recognition_flushed = () => {
  return {
    type: LISTENING_FLUSHED
  };
};
const Recognition_start = () => {
  return {
    type: LISTENING_START
  };
};
const Recognition_stop = () => {
  return {
    type: LISTENING_STOP
  };
};
const Recognition_setAvailability = (speechRecognitionSupported: boolean) => {
  return {
    type: LISTENING_AVAILABLE,
    payload: speechRecognitionSupported
  };
};
// const Speech_transitionsAcknowledged = () => {
//   return {
//     type: ANNOUNCE_TRANSITIONACKNOWLEDGED
// }
// }
const Reciting_start = () => {
  return {
    type: RECITING,
    payload: true
  };
};
const Reciting_stop = () => {
  return {
    type: RECITING,
    payload: false
  };
};
const Reciting = (on?: boolean) => {
  // state of reciting
  return {
    type: RECITING,
    payload: on
  };
};
const Recite_start = () => {
  //  recite requesting start
  return {
    type: RECITE_START
  };
};
const Recite_stop = () => {
  //  recite requesting stop
  return {
    type: RECITE_STOP
  };
};
const Recite_toggle = () => {
  return {
    type: RECITE_TOGGLE
  };
};
const Settings_toggle = () => {
  return {
    type: SETTINGS_TOGGLE
  };
};
export const Request = {
  Cursor_matchWords,
  Cursor_gotoFirstSection, // first word in page
  Cursor_gotoFirstSentence, // first word in section
  Cursor_gotoFirstWord, // first word in sentence
  Cursor_gotoNextWord,
  Cursor_gotoPreviousSentence,
  Cursor_gotoNextSentence,
  Cursor_gotoPreviousWord,
  Cursor_gotoWordByIdx,
  Cursor_gotoSectionByIdx,
  Cursor_acknowledgeTransition,

  Message_set,
  Message_clear,

  Page_load,
  Page_loaded,
  Page_setContext,
  Page_gotoLink,

  Recognition_toggle,
  Recognition_setAvailability,
  Recognition_flush,
  Recognition_flushed,
  Recognition_start,
  Recognition_stop,

  Reciting,
  Reciting_start,
  Reciting_stop,
  Recite_start,
  Recite_stop,
  Recite_toggle, // strictly for button event
  Settings_toggle,

  Speech_setAvailability,
  Speech_acknowledged,
  Speech_announceCurrentContent,
  Speech_announceListeningStart,
  Speech_announceListeningStop,
  Speech_announceMessage
  //  Speech_transitionsAcknowledged
  // Speech_announceNewSection,
  // Speech_announceNewSentence
};
//   listening_available: boolean;
//   listening_active: boolean;
//   listening_flush: boolean;
//   listening_silenceStartTime: number;
//
//   announce_available: boolean;
//   announce_listening: boolean; // "listening"
//   announce_newSentence: boolean; //"e.g., "new sentence"
//   announce_newSection: boolean; //"e.g., "new sentence"
//
//   cursor_sectionIdx: number;
//   cursor_sentenceIdx: number;
//   cursor_terminalIdx: number;
//   cursor_newSentence: boolean;
//   cursor_newSection: boolean;
//   cursor_newPage: boolean;
//
//   pageContext: IPageContext; // context stored outside of redux but accesses within reducer
// }

/*
interface IAnnounceReduxState {
  available: boolean,
  listening: boolean, // "listening"
  newSentence: boolean, //"e.g., "new sentence"
  newSection: boolean, //"e.g., "new sentence"
}
function AnnounceReduxInitializer(): IAnnounceReduxState {
  return {
    available: false, // "listening"
    listening: false, // "listening"
    newSentence: false, //"e.g., "new sentence"
    newSection: false //"e.g., "new sentence"
  }
}
interface IListeningReduxState {
  available: boolean;
  listening: boolean;
  flush: boolean;
  silenceStartTime: number;
}
function ListeningReduxInitializer(): IListeningReduxState {
  return {
    available: false,
    listening: false,
    flush: false,
    silenceStartTime: 0
  }
};
//export const InitialWordsVisitedState = false;

// Reducers - maps new state based on current state and action object (defined above)
export interface ICursorReduxState {
  sectionIdx: number;
  sentenceIdx: number;
  terminalIdx: number;
  newSentence: boolean;
  newSection: boolean;
  newPage: boolean;
}
function CursorReduxInitializer() {
  return {
    sectionIdx: -1, // innermost
    sentenceIdx: -1,
    terminalIdx: -1,
    newSentence: false,
    newSection: false,
    newPage: false,
  };
}
interface IReduxState {
  announce: IAnnounceReduxState;
  cursor: ICursorReduxState;
  listening: IListeningReduxState;
  pageContext: IPageContext
}
const IReduxStateInitialState: IReduxState = {
  announce: AnnounceReduxInitializer(),
  cursor: CursorReduxInitializer(),
  listening: ListeningReduxInitializer(),
  pageContext: PageContextInitializer()
}
*/
interface IReduxState {
  announce_available: boolean;
  announce_listening: boolean; // "listening"

  announce_message: string;

  listen_available: boolean;
  listen_active: boolean;
  listen_flush: boolean;
  listen_silenceStartTime: number;

  cursor_sectionIdx: number;
  cursor_sentenceIdx: number;
  cursor_terminalIdx: number;
  cursor_newSentenceTransition: boolean;
  cursor_newSectionTransition: boolean;
  cursor_beginningOfPageReached: boolean;
  cursor_newPageTransition: boolean;
  cursor_endOfPageReached: boolean;

  page_requested: string;
  cursor_terminalIdx_fromLink: number;
  cursor_sectionIdx_fromLink: number;
  page_loaded: boolean;
  page_section: number;
  //page_lists: CPageLists;
  pageContext: CPageLists;

  recite_requested: boolean;
  reciting: boolean;
  settings_toggle: boolean;
  message: string;
}
const IReduxStateInitialState: IReduxState = {
  announce_available: false,
  announce_listening: false, // "listening"

  announce_message: "",

  listen_available: false,
  listen_active: false,
  listen_flush: false,
  listen_silenceStartTime: 0,

  cursor_sectionIdx: 0,
  cursor_sentenceIdx: 0,
  cursor_terminalIdx: 0,
  cursor_newSentenceTransition: false,
  cursor_newSectionTransition: false,
  cursor_newPageTransition: false,
  cursor_beginningOfPageReached: true,
  cursor_endOfPageReached: false,

  page_requested: "",
  page_loaded: false,
  page_section: 0,
  cursor_terminalIdx_fromLink: 0,
  cursor_sectionIdx_fromLink: 0,
  //page_lists: new CPageLists(),
  pageContext: new CPageLists(),

  recite_requested: false,
  reciting: false,

  settings_toggle: false,
  message: ""
  //  pageContext: PageContextInitializer()
};
export const rootReducer = (
  state: IReduxState = IReduxStateInitialState,
  action: any
) => {
  const setSentenceState = (
    terminalIdx: number,
    currentSentenceIdx: number
  ): [number, boolean] => {
    let sentenceIdx: number = state.pageContext.sentenceIdx(terminalIdx);
    return [sentenceIdx, sentenceIdx !== currentSentenceIdx];
  };
  const setSectionState = (
    terminalIdx: number,
    currentSectionIdx: number
  ): [number, boolean] => {
    let sectionIdx: number = state.pageContext.sectionIdx(terminalIdx);
    return [sectionIdx, sectionIdx !== currentSectionIdx];
  };
  const setTerminalState = (terminalIdxs: number[]) => {
    if (terminalIdxs.length <= 0) {
      console.log(`setTerminalState no state transition`);
    } else if (terminalIdxs.length === 1) {
      console.log(`setTerminalState single state transition`);
      if (state.pageContext.isValidTerminalIdx(terminalIdxs[0])) {
        /// set single state
        state.cursor_terminalIdx = terminalIdxs[0];
        [
          state.cursor_sentenceIdx,
          state.cursor_newSentenceTransition
        ] = setSentenceState(terminalIdxs[0], state.cursor_sentenceIdx);
        [
          state.cursor_sectionIdx,
          state.cursor_newSectionTransition
        ] = setSectionState(terminalIdxs[0], state.cursor_sectionIdx);
        state.cursor_beginningOfPageReached =
          state.cursor_terminalIdx === state.pageContext.firstTerminalIdx;
        state.cursor_endOfPageReached =
          state.cursor_terminalIdx === state.pageContext.lastTerminalIdx;
      } else {
        console.log(
          `setTerminalState single state transition encountered invalid terminalIdx=${terminalIdxs[0]}`
        );
      }
    } else {
      console.log(`setTerminalState multiple state transition encountered`);
    }
  };
  const setToNextTerminalState = () => {
    setTerminalState(
      state.pageContext.nextTerminalIdx(state.cursor_terminalIdx)
    );
  };
  const setToPrevTerminalState = () => {
    setTerminalState(
      state.pageContext.previousTerminalIdx(state.cursor_terminalIdx)
    );
  };
  const setToNextSentenceTerminalState = () => {
    setTerminalState([
      state.pageContext.nextSentenceTerminalIdx(state.cursor_terminalIdx)
    ]);
  };
  const setToPrevSentenceTerminalState = () => {
    setTerminalState([
      state.pageContext.previousSentenceTerminalIdx(state.cursor_terminalIdx)
    ]);
  };
  const proposeLinkedTerminalState = (linkIdx?: number) => {
    if (
      linkIdx !== undefined &&
      linkIdx !== null &&
      linkIdx >= 0 &&
      linkIdx < state.pageContext.linkList.length
    ) {
      state.cursor_sectionIdx_fromLink =
        state.pageContext.linkList[linkIdx].destination.sectionIdx;
      state.cursor_terminalIdx_fromLink =
        state.pageContext.linkList[linkIdx].destination.terminalIdx;
    } else {
      state.cursor_terminalIdx_fromLink = IDX_INITIALIZER;
      state.cursor_sectionIdx_fromLink = IDX_INITIALIZER;
    }
  };
  const setLinkedTerminalState = () => {
    if (state.cursor_terminalIdx_fromLink === state.cursor_terminalIdx) {
      // do nothing
    } else if (
      state.pageContext.isValidSectionIdx(state.cursor_sectionIdx_fromLink)
    ) {
      setTerminalState([
        state.pageContext.sectionList[state.cursor_sectionIdx_fromLink]
          .firstTermIdx
      ]);
    } else if (
      state.pageContext.isValidTerminalIdx(state.cursor_terminalIdx_fromLink)
    ) {
      setTerminalState([state.cursor_terminalIdx_fromLink]);
    } else {
      state.cursor_terminalIdx = 0;
    }
    proposeLinkedTerminalState(); //resets proposal
  };
  //  const queueAccouncement(state.announcement)
  switch (action.type) {
    case PAGE_LOAD:
      state.page_requested = action.payload as string;
      state.cursor_sectionIdx_fromLink = 0; // needed because linkTo may specify initial sectionIdx within link definition
      state.cursor_terminalIdx_fromLink = 0;
      state.page_loaded = false;
      return state;
    case PAGE_LOADED:
      state.page_loaded = action.payload as boolean;
      return state;
    // case PAGE_SETLISTS:
    //   state.page_lists = action.payload as CPageLists;
    //   return state;
    case PAGE_TOP:
      setTerminalState([state.pageContext.firstTerminalIdx]); // should be first actionable terminal i.e. , no syntactical sugar
      return state;
    case PAGE_LINKTO:
      // get current terminal and retrieve linked page
      let linkIdx =
        state.pageContext.terminalList[state.cursor_terminalIdx].linkIdx;
      proposeLinkedTerminalState(linkIdx);
      if (linkIdx >= 0 && linkIdx < state.pageContext.linkList.length) {
        if (state.pageContext.linkList.length === 0) {
          console.log(`linkList is empty`);
        } else if (
          state.page_requested ===
          state.pageContext.linkList[linkIdx].destination.page
        ) {
          console.log(`linking within explicitly specified page`);
          setLinkedTerminalState();
        } else if (
          state.pageContext.linkList[linkIdx].destination.page.length === 0
        ) {
          console.log(`linking within (current default) page`);
          setLinkedTerminalState();
        } else {
          state.page_requested =
            state.pageContext.linkList[linkIdx].destination.page + ".json";
          // save the proposed linked idxs for use when the above page context
          // is loaded into reducer
          state.page_loaded = false;
        }
      }
      return state;
    case CONTEXT_SET:
      // cast object into class instance with methods
      // strictly a read only reference to react context NOT a copy.
      // alternatively, could access via useContext iff in provider/consumer
      // scope
      state.pageContext = action.payload as CPageLists;

      setLinkedTerminalState();
      return state;
    case SECTION_CHANGE:
      let sectionIdx: number = +action.payload;
      if (
        state.pageContext !== null &&
        state.pageContext !== undefined &&
        sectionIdx in state.pageContext.sectionList
      ) {
        if (
          sectionIdx >= 0 &&
          sectionIdx < state.pageContext.sectionList.length
        ) {
          state.cursor_sectionIdx = sectionIdx;
          state.cursor_terminalIdx =
            state.pageContext.sectionList[sectionIdx].firstTermIdx;
          state.cursor_sentenceIdx =
            state.pageContext.terminalList[
              state.cursor_terminalIdx
            ].sentenceIdx;
        } else {
          // should report out-of-bound condition. How?
          state.cursor_sectionIdx = 0;
          state.cursor_terminalIdx = 0;
        }
      }
      return state;
    case WORD_MATCH:
      let wordsHeard: string = action.payload as string;
      if (
        wordsHeard !== undefined &&
        state.pageContext !== undefined &&
        state.pageContext !== null
      ) {
        let expecting: string =
          state.pageContext.terminalList[state.cursor_terminalIdx].content;
        let expectingAlt: string =
          state.pageContext.terminalList[state.cursor_terminalIdx]
            .altrecognition; // should .split(" ")
        console.log(
          `WORD_MATCH: heard=${wordsHeard} expecting ${expecting} or ${expectingAlt}`
        );
        // need to handle altRecognition word list against consecutive words heard
        //   1) Lookahead in words heard list to allow a peek.
        //      Requires changing for/of loop (straightforward but messy)
        //   2) create internal state that reflects interim condition without
        //      advancing terminal state, resetting that state when completely
        //      or state is no longer valid (matching or not matching the entire
        //      altReg list words heard.)
        for (let wordHeard of wordsHeard.split(" ")) {
          console.log(`WORD_MATCH: word=${wordHeard}`);
          if (state.listen_flush) {
            // escape to prevent further processing that may match words in
            // next sentence
            break;
          } else if (expecting.toLowerCase() === wordHeard.toLowerCase()) {
            setToNextTerminalState();
          } else if (expectingAlt.toLowerCase() === wordHeard.toLowerCase()) {
            setToNextTerminalState();
          } else if (
            expectingAlt.length > 0 &&
            patternMatch(wordHeard.toLowerCase(), expectingAlt)
          ) {
            setToNextTerminalState();
          } else {
            console.log(
              `No WORD_MATCH:\nwords heard=${wordsHeard}\nbut looking for ${
                state.pageContext.terminalList[state.cursor_terminalIdx].content
              }\nor ${
                state.pageContext.terminalList[state.cursor_terminalIdx]
                  .altrecognition
              }`
            );
            // no match
          }
        }
      }
      return state;
    case WORD_NEXT:
      setToNextTerminalState();
      return state;
    case WORD_PREVIOUS:
      setToPrevTerminalState();
      return state;
    case SENTENCE_NEXT:
      setToNextSentenceTerminalState();
      return state;
    case SENTENCE_PREVIOUS:
      setToPrevSentenceTerminalState();
      return state;
    case WORD_SELECT:
      setTerminalState([+action.payload]);
      return state;
    case LISTENING_TOGGLE:
      if (state.listen_available) {
        state.listen_active = !state.listen_active;
      }
      return state;
    case LISTENING_STOP:
      state.listen_active = false;
      return state;
    case LISTENING_AVAILABLE:
      state.listen_available = action.payload;
      return state;
    case LISTENING_FLUSH:
      state.listen_flush = action.payload; // resets transcript
      return state;
    case LISTENING_FLUSHED:
      state.listen_flush = false; // resets transcript
      return state;
    case ANNOUNCE_MESSAGE:
      state.announce_message = action.payload; // resets transcript
      return state;
    // case ANNOUNCE_NEWSENTENCE:
    //   state.announce_message = "new sentence"; // resets transcript
    //   return state;
    // case ANNOUNCE_NEWSECTION:
    //   state.announce_message = "new section"; // resets transcript
    //   return state;
    case ANNOUNCE_ACKNOWLEDGED:
      state.announce_message = ""; // resets transcript
      return state;
    case TRANSITION_ACKNOWLEDGE:
      state.cursor_newPageTransition = false;
      state.cursor_newSectionTransition = false;
      state.cursor_newSentenceTransition = false;
      state.cursor_beginningOfPageReached = false;
      state.cursor_endOfPageReached = false;
      return state;

    case RECITING:
      state.reciting = state.reciting = action.payload;
      return state;
    case RECITE_START:
      state.recite_requested = true;
      return state;
    case RECITE_STOP:
      state.recite_requested = false;
      return state;

    case RECITE_TOGGLE:
      state.recite_requested = !state.recite_requested;
      return state;

    case SETTINGS_TOGGLE:
      state.settings_toggle = !state.settings_toggle;
      if (state.settings_toggle) state.listen_active = false;
      return state;

    case MESSAGE_SET:
      state.message = action.payload;
      return state;
    default:
      return state;
  }
};
function patternMatch(content: string, altRecognitionPattern: string): boolean {
  let pattern: RegExp = new RegExp(altRecognitionPattern);
  return pattern.test(content);
}
