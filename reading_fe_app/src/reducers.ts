import React from "react";
import { useContext } from "react";
import { useAppDispatch } from "./hooks";
import { combineReducers } from "redux";
import { ITerminalInfoInitializer } from "./pageContentType";
import { IPageContext, PageContextInitializer, PageContext } from "./termnodes";

/**
 * This is a reducer - a function that takes a current state value and an
 * action object describing "what happened", and returns a new state value.
 * A reducer's function signature is: (state, action) => newState
 *
 * The Redux state should contain only plain JS objects, arrays, and primitives.
 * The root state value is usually an object.  It's important that you should
 * not mutate the state object, but return a new object if the state changes.
 *
 * You can use any conditional logic you want in a reducer. In this example,
 * we use a switch statement, but it's not required.
 *
 * The following actions must be unique!
 */
//export const SECTION_CHANGED = "section/changed";
//const SENTENCE_CHANGED = "sentence/changed";

// intrapage actions (user initiated)
const WORD_MATCH = "word/match"; // match word with argument word with current wordNode
const WORD_VISIT = "word/visit"; // match word with argument word with current wordNode
const WORD_NEXT = "word/next"; // next word in sentence
const WORD_PREVIOUS = "word/previous"; // previous word in sentence
const WORD_RESET = "word/reset"; // first word in page
const WORD_SELECT = "word/select"; // selected word in sentence
const WORD_RESELECT = "word/reselect"; // reselected word in sentence (used for synthesis)

const SENTENCE_FIRST = "sentence/first"; // first word in first sentence of current section
const SENTENCE_NEXT = "sentence/next"; // first word of next sentence
const SENTENCE_PREVIOUS = "sentence/prev"; // first word of previous sentence
const SENTENCE_RESET = "sentence/reset"; // first word in section

const SECTION_FIRST = "section/first"; // first word in first section
const SECTION_NEXT = "section/next";
const SECTION_PREVIOUS = "section/prev";
const SECTION_RESET = "section/reset"; // first section in sections
const SECTION_CHANGE = "section/change"; // absolute positioning e.g., navbar

const PAGE_CHANGED = "page/changed";
const PAGE_TOP = "page/top";
const PAGE_RESET = "page/reset";

// intrapage administrative actions (non-user initiated)
//nodeList actions
const CONTEXT_SET = "context/set";

// const WORDNODEIDX_SET = "wordNodeIdx/set current"; // first word index on page

// speaking actions
//listening actions
const LISTENING_AVAILABLE = "listening/available";
const LISTENING_FLUSH = "listening/flush"; // clear transcript
const LISTENING_FLUSHED = "listening/flushed"; // clear transcript
const LISTENING_START = "listening/start";
const LISTENING_STOP = "listening/stop";
const LISTENING_TOGGLE = "listening/toggle"; // related to start/stop

const ANNOUNCE_MESSAGE = "announce/message";
const ANNOUNCE_ACKNOWLEDGED = "announce/message acknowledged";
//const ANNOUNCE_SELECTEDCONTENT = "announce/selected content"; // acknowledge completion of speaking
// const ANNOUNCE_CURRENTSENTENCE = "announce/selected content";  // acknowledge completion of speaking
const ANNOUNCE_AVAILABILITY = "announce/available";
const ANNOUNCE_NEWSENTENCE = "announce/new sentence";
const ANNOUNCE_NEWSECTION = "announce/new section";
//const SPEAKING_START = "announce/start";
//const SPEAKING_STOP = "announce/available";

const WORDS_VISITED_RESET = "wordsvisited/reset";
const WORDS_VISITED = "wordsvisited/set";

const TRANSITION_ACKNOWLEDGE = "transition/acknowledge";

// const PAGE_RESET_VALUE = 0;
// const SECTION_RESET_VALUE = 0;
// const SENTENCE_RESET_VALUE = 0;
// const WORD_RESET_VALUE = 0;
// const WORDNODEIDX_RESET_VALUE = 0;

// Initial states
//const initialWordState = ITerminalInfoInitializer();
// word: "",
// wordNodeIdx: 0,
// nextWordNodeIdx: [],
// prevWordNodeIdx: [],
// wordPattern: "",
// wordId: 0,
// sentenceId: 0,
// sectionId: 0,
// pageId: 0,
// altRecognition: "",
// visited: false

// content: string; // to word match but is static
// termIdx: number; //
// nextTermIdx: number[]; // to move forward
// prevTermIdx: number[]; // to move backward
// altpronunciation: string; // inlline
// altrecognition: string; // to alternatively match
// recitable: boolean; //
// audible: boolean;
// visible: boolean;
// fillin: boolean;
// visited: boolean;

//   pageId: PAGE_RESET_VALUE,
//   sectionId: SECTION_RESET_VALUE, // should be []
//   sentenceId: SENTENCE_RESET_VALUE,
//   wordId: WORD_RESET_VALUE,
//   word: null,
//   altRecognition: null,
//   visited: false
// };
// const initialNodeListState = {
//   nodeList: [],
//   wordNodeIdx: WORDNODEIDX_RESET_VALUE,
//   firstWordNodeIdx: WORDNODEIDX_RESET_VALUE,
//   lastWordNodeIdx: WORDNODEIDX_RESET_VALUE
// };

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
  console.log(`nextword`);
  return {
    type: WORD_NEXT
  };
};
const Cursor_gotoPreviousWord = () => {
  return {
    type: WORD_PREVIOUS
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
const Page_setContext = (context: IPageContext) => {
  return {
    type: CONTEXT_SET,
    payload: context
  };
};
export const Request = {
  Cursor_matchWords,
  Cursor_gotoFirstSection, // first word in page
  Cursor_gotoFirstSentence, // first word in section
  Cursor_gotoFirstWord, // first word in sentence
  Cursor_gotoNextWord,
  Cursor_gotoPreviousWord,
  Cursor_gotoWordByIdx,
  Cursor_gotoSectionByIdx,
  Cursor_acknowledgeTransition,

  Page_setContext,

  Recognition_toggle,
  Recognition_setAvailability,
  Recognition_flush,
  Recognition_flushed,
  Recognition_start,
  Recognition_stop,

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
  cursor_newPageTransition: boolean;

  pageContext: IPageContext;
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

  pageContext: PageContextInitializer()
};
export const rootReducer = (
  state: IReduxState = IReduxStateInitialState,
  action: any
) => {
  const setTerminalState = (terminalIdx: number) => {
    state.cursor_newSentenceTransition = false;
    state.cursor_newSectionTransition = false;
    let priorSentenceIdx: number = state.cursor_sentenceIdx;
    let priorSectionIdx: number = state.cursor_sectionIdx;
    state.cursor_terminalIdx = terminalIdx;
    state.cursor_sectionIdx =
      state.pageContext.terminalList[terminalIdx].sectionIdx;
    state.cursor_sentenceIdx =
      state.pageContext.terminalList[terminalIdx].sentenceIdx;
    state.cursor_newSentenceTransition =
      state.cursor_sentenceIdx !== priorSentenceIdx;
    if (state.cursor_newSentenceTransition) state.listen_flush = true;
    state.cursor_newSectionTransition =
      state.cursor_sectionIdx !== priorSectionIdx;
  };
  const setToNextTerminalState = (terminalIdx: number) => {
    setTerminalState(
      state.pageContext.terminalList[terminalIdx].nextTermIdx[0]
    );
  };
  const setToPrevTerminalState = (terminalIdx: number) => {
    setTerminalState(
      state.pageContext.terminalList[terminalIdx].prevTermIdx[0]
    );
  };
  //  const queueAccouncement(state.announcement)
  switch (action.type) {
    case CONTEXT_SET:
      state.pageContext = action.payload as IPageContext; // strictly a read only reference to react context NOT a copy
      return state;
    case PAGE_TOP:
      setTerminalState(0); // should be first actionable terminal i.e. , no syntactical sugar
      return state;
    case SECTION_CHANGE:
      let sectionIdx: number = +action.payload;
      if (
        state.pageContext !== null &&
        state.pageContext !== undefined &&
        sectionIdx in state.pageContext.sectionList
      ) {
        state.cursor_sectionIdx = sectionIdx;
        state.cursor_terminalIdx =
          state.pageContext.sectionList[sectionIdx].firstTermIdx;
        state.cursor_sentenceIdx =
          state.pageContext.terminalList[state.cursor_terminalIdx].sentenceIdx;
      }
      return state;
    case WORD_MATCH:
      let words: string = action.payload as string;
      if (
        words !== undefined &&
        state.pageContext !== undefined &&
        state.pageContext !== null
      ) {
        console.log(`WORD_MATCH: words=${words}`);
        for (let word of words.split(" ")) {
          console.log(`WORD_MATCH: word=${word}`);
          if (state.listen_flush) {
            break; // escape to prevent further processing that may match words in next sentence
          } else if (
            state.pageContext.terminalList[
              state.cursor_terminalIdx
            ].content.toLowerCase() === word.toLowerCase()
          ) {
            setToNextTerminalState(state.cursor_terminalIdx);
          } else if (
            state.pageContext.terminalList[state.cursor_terminalIdx]
              .altrecognition !== null &&
            state.pageContext.terminalList[state.cursor_terminalIdx]
              .altrecognition.length > 0
          ) {
            let pattern = new RegExp(
              state.pageContext.terminalList[
                state.cursor_terminalIdx
              ].altrecognition
            );
            if (word.toLowerCase().match(pattern) !== null) {
              setToNextTerminalState(state.cursor_terminalIdx);
            }
          } else {
            // no match
          }
        }
      }
      return state;
    case WORD_NEXT:
      setToNextTerminalState(state.cursor_terminalIdx);
      return state;
    case WORD_PREVIOUS:
      setToPrevTerminalState(state.cursor_terminalIdx);
      return state;
    case WORD_SELECT:
      setTerminalState(+action.payload);
      return state;
    // case WORDS_VISITED_RESET:
    //   // state.visited[0] = false;
    //   return state;
    // case WORDS_VISITED:
    //   // state.wordsVisited = [...state.wordsVisited];
    //   // state.wordsVisited[action.payload] = true;
    //   return state;
    // case WORD_VISIT:
    // need a boolean array: visited[0..lastTerminalIdx-1] = { true | false }

    //   console.log(`word visit=${action.payload}`);
    //   console.log(`state.wordNodeIdx=${state.wordNodeIdx}`);
    //   //    console.log(`state.nodeList.validWordNodeIdx()=${state.nodeList.validWordNodeIdx(state.wordNodeIdx)}`);
    //   console.log(`wordNode=${state.nodeList.props(state.wordNodeIdx)}`);
    //   console.log(
    //     `compare=${state.nodeList.props(state.wordNodeIdx).word ===
    //       action.payload}`
    //   );
    //   console.log(`word=${state.nodeList.props(state.wordNodeIdx).word}`);
    //   console.log(`payload word=${action.payload}`);
    //   if (
    //     state.wordNodeIdx !== undefined &&
    //     //        && state.nodeList.validWordNodeIdx()
    //     state.nodeList.props(state.wordNodeIdx).word === action.payload
    //   ) {
    //     // should use RegExp with (alt)Recognition string
    //     console.log(`word visited=${action.payload}`);
    //     //      state.wordsVisited = [...state.wordsVisited]; // copy to immutable array before updating element below
    //     //      state.wordsVisited[state.wordNodeIdx] = true;
    //     ///      console.log(`state.wordVisited=${state.wordsVisited}`);
    //     state.wordNodeIdx = state.nodeList.props(
    //       state.wordNodeIdx
    //     ).nextWordNodeIdx[0];
    //     state = state.nodeList.updateImmutableState(state);
    //   }
    // return state;
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
      return state;
    default:
      return state;
  }
};
/*
const CursorActionReducer = (
  state: ICursorState = ICursorStateInitializer(),
  action: any
) => {
  const setTerminalState = (terminalIdx: number) => {
    let priorSentenceIdx: number = state.sentenceIdx;
    let priorSectionIdx: number = state.sectionIdx;
    state.terminalIdx = terminalIdx;
    state.sectionIdx = state.pageContext.terminalList[terminalIdx].sectionIdx;
    state.sentenceIdx = state.pageContext.terminalList[terminalIdx].sentenceIdx;
    state.newSentence = state.sentenceIdx !== priorSentenceIdx;
    ListeningActions.flush = true;
    state.newSection = state.sectionIdx !== priorSectionIdx;
  };
  const setToNextTerminalState = (terminalIdx: number) => {
    setTerminalState(
      // update sentence, section transitions
      state.pageContext.terminalList[terminalIdx].nextTermIdx[0]
    );
  };
  const setToPrevTerminalState = (terminalIdx: number) => {
    setTerminalState(
      state.pageContext.terminalList[terminalIdx].prevTermIdx[0]
    );
  };
  switch (action.type) {
    case CONTEXT_SET:
      state.pageContext = action.payload as IPageContext; // strictly a read only reference to react context NOT a copy
      return state;
    case PAGE_FIRST:
      setTerminalState(0); // should be first actionable terminal i.e. , no syntactical sugar
      return state;
    case SECTION_CHANGE:
      let sectionIdx: number = +action.payload;
      if (
        state.pageContext !== null &&
        state.pageContext !== undefined &&
        sectionIdx in state.pageContext.sectionList
      ) {
        state.sectionIdx = sectionIdx;
        state.terminalIdx =
          state.pageContext.sectionList[sectionIdx].firstTermIdx;
        state.sentenceIdx =
          state.pageContext.terminalList[state.terminalIdx].sentenceIdx;
      }
      return state;
    case WORD_MATCH:
      let words: string = action.payload as string;
      if (
        words !== undefined &&
        state.pageContext !== undefined &&
        state.pageContext !== null
      ) {
        console.log(`WORD_MATCH: words=${words}`);
        for (let word of words.split(" ")) {
          console.log(`WORD_MATCH: word=${word}`);
          if (
            state.pageContext.terminalList[
              state.terminalIdx
            ].content.toLowerCase() === word.toLowerCase()
          ) {
            // should use RegExp with (alt)Recognition string
            setToNextTerminalState(state.terminalIdx);
            // state.terminalIdx =
            //   nodes.terminalList[state.terminalIdx].nextTermIdx[0]; // does not account for multiple paths i.e., [1..n]
            // state.sectionIdx = nodes.terminalList[state.terminalIdx].sectionIdx;
            // state.sentenceIdx =
            //   nodes.terminalList[state.terminalIdx].sentenceIdx;
          } else if (
            state.pageContext.terminalList[state.terminalIdx].altrecognition !==
              null &&
            state.pageContext.terminalList[state.terminalIdx].altrecognition
              .length > 0
          ) {
            let pattern = new RegExp(
              state.pageContext.terminalList[state.terminalIdx].altrecognition
            );
            if (word.toLowerCase().match(pattern) !== null) {
              setToNextTerminalState(state.terminalIdx);
            }
          } else {
            // no match
          }
        }
      }
      return state;
    case WORD_VISIT:
      // need a boolean array: visited[0..lastTerminalIdx-1] = { true | false }

      //   console.log(`word visit=${action.payload}`);
      //   console.log(`state.wordNodeIdx=${state.wordNodeIdx}`);
      //   //    console.log(`state.nodeList.validWordNodeIdx()=${state.nodeList.validWordNodeIdx(state.wordNodeIdx)}`);
      //   console.log(`wordNode=${state.nodeList.props(state.wordNodeIdx)}`);
      //   console.log(
      //     `compare=${state.nodeList.props(state.wordNodeIdx).word ===
      //       action.payload}`
      //   );
      //   console.log(`word=${state.nodeList.props(state.wordNodeIdx).word}`);
      //   console.log(`payload word=${action.payload}`);
      //   if (
      //     state.wordNodeIdx !== undefined &&
      //     //        && state.nodeList.validWordNodeIdx()
      //     state.nodeList.props(state.wordNodeIdx).word === action.payload
      //   ) {
      //     // should use RegExp with (alt)Recognition string
      //     console.log(`word visited=${action.payload}`);
      //     //      state.wordsVisited = [...state.wordsVisited]; // copy to immutable array before updating element below
      //     //      state.wordsVisited[state.wordNodeIdx] = true;
      //     ///      console.log(`state.wordVisited=${state.wordsVisited}`);
      //     state.wordNodeIdx = state.nodeList.props(
      //       state.wordNodeIdx
      //     ).nextWordNodeIdx[0];
      //     state = state.nodeList.updateImmutableState(state);
      //   }
      return state;
    case WORD_NEXT:
      setToNextTerminalState(state.terminalIdx);
      return state;
    case WORD_PREVIOUS:
      setToPrevTerminalState(state.terminalIdx);
      return state;
    case WORD_SELECT:
      let selectedTerminalIdx: number = +action.payload;
      setTerminalState(selectedTerminalIdx);
      return state;
    case WORDS_VISITED_RESET:
      // state.visited[0] = false;
      return state;
    case WORDS_VISITED:
      // state.wordsVisited = [...state.wordsVisited];
      // state.wordsVisited[action.payload] = true;
      return state;
    }
  }
};
*/
// const WordActionReducer = (
//   state: any = ITerminalInfoInitializer(),
//   action: any
// ) => {
//   switch (action.type) {
//     case SECTION_CHANGE:
//       /// should be based on wordNodeIdx change
//       state.sectionId = action.payload;
//       return state;
//     case WORD_MATCH:
//       let words: string = action.payload as string;
//       if (words !== undefined) {
//         console.log(`WORD_MATCH: words=${words}`);
//         for (let word of words.split(" ")) {
//           console.log(`WORD_MATCH: word=${word}`);
//           if (
//             state.nodeList.props(state.wordNodeIdx).word.toLowerCase() ===
//             word.toLowerCase()
//           ) {
//             // should use RegExp with (alt)Recognition string
//             state.wordNodeIdx = state.nodeList.props(
//               state.wordNodeIdx
//             ).nextWordNodeIdx[0];
//             state = state.nodeList.updateImmutableState(state);
//           }
//         }
//         /*
//       if (state.nodeList.props(state.wordNodeIdx).word === action.payload) {  // should use RegExp with (alt)Recognition string
//         state.wordNodeIdx = state.nodeList[state.wordNodeIdx].nextWordNodeIdx[0];
//         state = state.nodeList.updateImmutableState(state);
//       }
//       */
//       }
//       return state;
//     case WORD_VISIT:
//       console.log(`word visit=${action.payload}`);
//       console.log(`state.wordNodeIdx=${state.wordNodeIdx}`);
//       //    console.log(`state.nodeList.validWordNodeIdx()=${state.nodeList.validWordNodeIdx(state.wordNodeIdx)}`);
//       console.log(`wordNode=${state.nodeList.props(state.wordNodeIdx)}`);
//       console.log(
//         `compare=${state.nodeList.props(state.wordNodeIdx).word ===
//           action.payload}`
//       );
//       console.log(`word=${state.nodeList.props(state.wordNodeIdx).word}`);
//       console.log(`payload word=${action.payload}`);
//       if (
//         state.wordNodeIdx !== undefined &&
//         //        && state.nodeList.validWordNodeIdx()
//         state.nodeList.props(state.wordNodeIdx).word === action.payload
//       ) {
//         // should use RegExp with (alt)Recognition string
//         console.log(`word visited=${action.payload}`);
//         //      state.wordsVisited = [...state.wordsVisited]; // copy to immutable array before updating element below
//         //      state.wordsVisited[state.wordNodeIdx] = true;
//         ///      console.log(`state.wordVisited=${state.wordsVisited}`);
//         state.wordNodeIdx = state.nodeList.props(
//           state.wordNodeIdx
//         ).nextWordNodeIdx[0];
//         state = state.nodeList.updateImmutableState(state);
//       }
//       return state;
//     case WORD_NEXT:
//       state.wordNodeIdx = state.nodeList.props(
//         state.wordNodeIdx
//       ).nextWordNodeIdx[0];
//       state = state.nodeList.updateImmutableState(state);
//       return state;
//     case WORD_PREVIOUS:
//       state.wordNodeIdx = state.nodeList.props(
//         state.wordNodeIdx
//       ).prevWordNodeIdx[0];
//       state = state.nodeList.updateImmutableState(state);
//       return state;
//     case WORD_SELECT:
//       state.wordNodeIdx = action.payload;
//       state = state.nodeList.updateImmutableState(state);
//       return state;
//     case WORDS_VISITED_RESET:
//       state.visited[0] = false;
//       return state;
//     case WORDS_VISITED:
//       state.wordsVisited = [...state.wordsVisited];
//       state.wordsVisited[action.payload] = true;
//       return state;
//     // case WORDNODEIDX_SET:
//     //   state.wordNodeIdx = action.payload;
//     //   return state;
//     default:
//       return state;
//   }
// };
/************
const ListeningReducer = (state: any = InitialListeningState, action: any) => {
  switch (action.type) {
    case LISTENING_TOGGLE:
      if (state.listeningAvailable) {
        state.listening = !state.listening;
      }
      return state;
    case LISTENING_STOP:
      state.listening = false;
      return state;
    case LISTENING_AVAILABLE:
      state.listeningAvailable = action.payload;
      return state;
    case LISTENING_FLUSH:
      state.flush = true; // resets transcript
      return state;
    case LISTENING_FLUSHED:
      state.flush = false; // resets transcript
      return state;
    default:
      return state;
  }
};
************/
// export const rootReducer = combineReducers({
//   CursorActionReducer,
//   ListeningReducer
// });
