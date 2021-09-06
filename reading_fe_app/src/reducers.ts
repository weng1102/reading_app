import { combineReducers } from "redux";
//import { WordNodes, InitialWordNodeState } from "./wordnodes.js";
import { InitialWordNodeState } from "./wordnodes";

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
const PAGE_CHANGED = "page/changed";
export const SECTION_CHANGED = "section/changed";
const SENTENCE_CHANGED = "sentence/changed";

// intrapage actions (user initiated)
const WORD_MATCH = "word/match"; // match word with argument word with current wordNode
const WORD_VISIT = "word/visit"; // match word with argument word with current wordNode
const WORD_NEXT = "word/next"; // next word in sentence
const WORD_PREVIOUS = "word/previous"; // previous word in sentence
const WORD_RESET = "word/reset"; // first word in page
const WORD_SELECT = "word/select"; // selected word in sentence

const SENTENCE_FIRST = "sentence/first"; // first word in sentence
const SENTENCE_NEXT = "sentence/next"; // first word of next sentence
const SENTENCE_PREVIOUS = "sentence/prev"; // first word of previous sentence
const SENTENCE_RESET = "sentence/reset"; // first word in section

const SECTION_FIRST = "section/first"; // first word in section
const SECTION_NEXT = "section/next";
const SECTION_PREVIOUS = "section/prev";
const SECTION_RESET = "section/reset"; // first section in sections

const PAGE_RESET = "page/reset";

// intrapage administrative actions (non-user initiated)
//wordNodes actions
const WORDNODES_SET = "wordNodes/set";
const WORDNODES_RESET = "wordNodes/reset";

const WORDNODEIDX_SET = "wordNodeIdx/set current"; // first word index on page
//const WORDNODEIDX_SET_FIRST = "wordNodeIdx/set first" // first word index on page
//const WORDNODEIDX_SET_LAST = "wordNodeIdx/set last"  // last word index on page
/*
const WORDSEQ_CHANGED = "wordNodeIdx/changed" // random change
const WORDSEQ_NEXT = "wordNodeIdx/next" //sequential change
const WORDSEQ_PREV = "wordNodeIdx/prev" //sequential change
const WORDSEQ_RESET = "wordNodeIdx/reset" // 0
*/
//listening actions
const LISTENING_TOGGLE = "listening/toggle"; // related to start/stop
const LISTENING_AVAILABLE = "listening/available";
const LISTENING_START = "listening/start";
const LISTENING_STOP = "listening/stop";

const WORDS_VISITED_RESET = "wordsvisited/reset";
const WORDS_VISITED = "wordsvisited/set";

const PAGE_RESET_VALUE = 0;
const SECTION_RESET_VALUE = 0;
const SENTENCE_RESET_VALUE = 0;
const WORD_RESET_VALUE = 0;
const WORDNODEIDX_RESET_VALUE = 0;

// Initial states
const initialWordState = {
  pageId: PAGE_RESET_VALUE,
  sectionId: SECTION_RESET_VALUE, // should be []
  sentenceId: SENTENCE_RESET_VALUE,
  wordId: WORD_RESET_VALUE,
  word: null,
  altRecognition: null,
  visited: false
};
const initialWordNodeState = {
  wordNodes: [],
  wordNodeIdx: WORDNODEIDX_RESET_VALUE,
  firstWordNodeIdx: WORDNODEIDX_RESET_VALUE,
  lastWordNodeIdx: WORDNODEIDX_RESET_VALUE
};
const initialListeningState = {
  available: false,
  listening: false,
  silenceStartTime: 0
};
export const InitialWordsVisitedState = false;

// Actions
const matchWord = (word: string) => {
  return {
    type: WORD_MATCH,
    payload: word
  };
};
const matchWords = (words: string) => {
  return {
    type: WORD_MATCH,
    payload: words
  };
};
const visitWord = (word: string) => {
  return {
    type: WORD_VISIT,
    payload: word
  };
};
const gotoFirstWord = () => {
  return {
    type: WORD_RESET
  };
};
const gotoNextWord = () => {
  console.log(`nextword`);
  return {
    type: WORD_NEXT
  };
};
const gotoPreviousWord = () => {
  return {
    type: WORD_PREVIOUS
  };
};
const gotoSelectedWord = (wordNodeIdx: number) => {
  return {
    type: WORD_SELECT,
    payload: wordNodeIdx
  };
};
const gotoSelectedSection = (sectionId: number) => {
  return {
    type: SECTION_CHANGED,
    payload: sectionId
  };
};
const toggle = () => {
  return {
    type: LISTENING_TOGGLE
  };
};
const start = () => {
  return {
    type: LISTENING_START
  };
};
const stop = () => {
  return {
    type: LISTENING_STOP
  };
};
const available = (speechRecognitionSupported: boolean) => {
  return {
    type: LISTENING_AVAILABLE,
    payload: speechRecognitionSupported
  };
};
const setWordNodes = (nodes: any) => {
  return {
    type: WORDNODES_SET,
    payload: nodes
  };
};
const resetWordNodes = () => {
  return {
    type: WORDNODES_RESET
  };
};
export const WordActions = {
  visitWord,
  matchWord,
  matchWords,
  gotoFirstWord,
  gotoNextWord,
  gotoPreviousWord,
  gotoSelectedWord,
  gotoSelectedSection
};
export const WordNodeActions = {
  setWordNodes,
  resetWordNodes
};
export const ListeningActions = {
  toggle,
  available,
  start,
  stop
};
// Reducers - maps new state based on current state and action object (defined above)
const WordActionReducer = (state: any = initialWordState, action: any) => {
  switch (action.type) {
    case SECTION_CHANGED:
      /// should be based on wordNodeIdx change
      state.sectionId = action.payload;
      return state;
    case WORD_MATCH:
      let words: string = action.payload as string;
      if (words !== undefined) {
        console.log(`WORD_MATCH: words=${words}`);
        for (let word of words.split(" ")) {
          console.log(`WORD_MATCH: word=${word}`);
          if (
            state.wordNodes.props(state.wordNodeIdx).word.toLowerCase() ===
            word.toLowerCase()
          ) {
            // should use RegExp with (alt)Recognition string
            state.wordNodeIdx = state.wordNodes.props(
              state.wordNodeIdx
            ).nextWordNodeIdx[0];
            state = state.wordNodes.updateImmutableState(state);
          }
        }
        /*
      if (state.wordNodes.props(state.wordNodeIdx).word === action.payload) {  // should use RegExp with (alt)Recognition string
        state.wordNodeIdx = state.wordNodes[state.wordNodeIdx].nextWordNodeIdx[0];
        state = state.wordNodes.updateImmutableState(state);
      }
      */
      }
      return state;
    case WORD_VISIT:
      console.log(`word visit=${action.payload}`);
      console.log(`state.wordNodeIdx=${state.wordNodeIdx}`);
      //    console.log(`state.wordNodes.validWordNodeIdx()=${state.wordNodes.validWordNodeIdx(state.wordNodeIdx)}`);
      console.log(`wordNode=${state.wordNodes.props(state.wordNodeIdx)}`);
      console.log(
        `compare=${state.wordNodes.props(state.wordNodeIdx).word ===
          action.payload}`
      );
      console.log(`word=${state.wordNodes.props(state.wordNodeIdx).word}`);
      console.log(`payload word=${action.payload}`);
      if (
        state.wordNodeIdx !== undefined &&
        //        && state.wordNodes.validWordNodeIdx()
        state.wordNodes.props(state.wordNodeIdx).word === action.payload
      ) {
        // should use RegExp with (alt)Recognition string
        console.log(`word visited=${action.payload}`);
        //      state.wordsVisited = [...state.wordsVisited]; // copy to immutable array before updating element below
        //      state.wordsVisited[state.wordNodeIdx] = true;
        ///      console.log(`state.wordVisited=${state.wordsVisited}`);
        state.wordNodeIdx = state.wordNodes.props(
          state.wordNodeIdx
        ).nextWordNodeIdx[0];
        state = state.wordNodes.updateImmutableState(state);
      }
      return state;
    case WORD_NEXT:
      state.wordNodeIdx = state.wordNodes.props(
        state.wordNodeIdx
      ).nextWordNodeIdx[0];
      state = state.wordNodes.updateImmutableState(state);
      return state;
    case WORD_PREVIOUS:
      state.wordNodeIdx = state.wordNodes.props(
        state.wordNodeIdx
      ).prevWordNodeIdx[0];
      state = state.wordNodes.updateImmutableState(state);
      return state;
    case WORD_SELECT:
      state.wordNodeIdx = action.payload;
      state = state.wordNodes.updateImmutableState(state);
      return state;
    case WORDS_VISITED_RESET:
      state.visited[0] = false;
      return state;
    case WORDS_VISITED:
      state.wordsVisited = [...state.wordsVisited];
      state.wordsVisited[action.payload] = true;
      return state;
    case WORDNODES_RESET:
      state.wordNodes[0] = InitialWordNodeState;
      state.wordNodeIdx = WORDNODEIDX_RESET_VALUE;
      state.firstWordNodeIdx = WORDNODEIDX_RESET_VALUE;
      state.lastWordNodeIdx = WORDNODEIDX_RESET_VALUE;
      return state;
    case WORDNODEIDX_SET:
      state.wordNodeIdx = action.payload;
      return state;
    case WORDNODES_SET:
      state.wordNodes = action.payload;
      console.log(`state.wordNodes=${state.wordNodes.props(0).word}`);
      state.wordNodeIdx = state.wordNodes.firstWordNodeIdx; //default
      state.firstWordNodeIdx = state.wordNodes.firstWordNodeIdx;
      state.lastWordNodeIdx = state.wordNodes.lastWordNodeIdx;
      state.wordsVisited = Array(action.payload.length).fill(false);
      //      console.log(`wordNode_set visited=${state.wordsVisited}`);
      //      console.log(`wordNode_set visited=${state.wordsVisited[0]}`);
      return state;
    default:
      return state;
  }
};
const ListeningReducer = (state: any = initialListeningState, action: any) => {
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
    default:
      return state;
  }
};
export const rootReducer = combineReducers({
  WordActionReducer,
  ListeningReducer
});
