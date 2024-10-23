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
import {
  // InlineButtonScopeEnumType,
  // InlineButtonCursorActionEnumType,
  // InlineButtonListeningActionEnumType,
  IPageRequestItem,
  LinkIdxDestinationType,
  PageRequestItemInitializer
  // RecitationScopeEnumType,
  // RecitationPositionEnumType,
  // RecitationListeningEnumType
} from "./pageContentType";
export const IDX_INITIALIZER = -9999;
// import {
//   ISettings,
//   ISettingsContext,
//   SettingsContext
// } from "./settingsContext";
export enum StatusBarMessageType {
  application = 0,
  listening = 1,
  state = 2,
  all = 3
}
//const IDX_INITIALIZER = -9999; // should be same as baseclasses.ts

const WORD_NEXT = "word/next"; // next word in sentence
const WORD_PREVIOUS = "word/previous"; // previous word in sentence
//const WORD_RESET = "word/reset"; // first word in page
const WORD_SELECT = "word/select"; // selected word in sentence
const WORD_SETCURRENTFILLIN = "word/set current fillin";
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
// const SECTION_IMAGEENTRY_RELAYOUT_COMPLETED = "section/relayouted";

// page actions
// const PAGE_CONTENT_Y = "page/content y";
const PAGE_LOAD = "page/load";
const PAGE_LOADED = "page/loaded";
const PAGE_TOP = "page/top";
const PAGE_LINKTO = "page/link to";
const PAGE_POP = "page/pop";
const PAGE_POPPED = "page/popped";
const PAGE_RESTORE = "page/restore";
const PAGE_RESTORED = "page/restored";
const PAGE_HOME = "page/home";
const PAGE_HOMED = "page/homed";
const PAGE_HOME_ENABLED = "page/home icon enabled";
const PAGE_PREVIOUS_ENABLED = "page/previous icon enabled";
const PAGE_SITEMAP_ENABLED = "page/sitemap icon enabled";
const PAGE_FONTDOWN_ENABLED = "page/font down icon enabled";
const CONTENT_SCROLL_TOP = "content/scroll top";
const CONTENT_SCROLL_TOP_INITIAL = "content/initial scroll";
const PAGE_CONTENT_TOP = "page/content top";
const PAGE_SPACINGUP_ENABLED = "page/text spacing up icon enabled";
const PAGE_SPACINGDOWN_ENABLED = "page/text spacing down icon enabled";

const NAVBAR_TOGGLE = "navbar/toggle";

// intrapage administrative actions (non-user initiated)
//const PAGECONTEXT_SET = "pagecontext/set";
const CONTEXT_SET = "context/set";

//listening actions
const LISTENING_AVAILABLE = "listening/available";
// const LISTENING_FLUSH = "listening/flush"; // clear transcript
// const LISTENING_FLUSHED = "listening/flushed"; // clear transcript
const LISTENING_MATCH = "listening/match"; // match word with argument with //
const LISTENING_MESSAGE = "listening/message";
const LISTENING_START = "listening/start";
// const LISTENING_RETRY = "listening/retry";
// const LISTENING_RETRY_RESET = "listening/retry reset";
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
// const RECITING_BEGIN = "reciting/start"; // actual state of reciting begin
// const RECITING_END = "reciting/end"; // actual reciting end (stopped)

//const RECITE = "recite";  // requests to start and stop recite
const RECITE_START = "recite/start";
const RECITE_STOP = "recite/stop";
// const RECITE_TOGGLE = "recite/toggle"; // request from recite button
const RECITE_WORD = "recite/word"; // exclusively for wordNext
const RECITED_WORD = "recited/word"; // exclusively for wordNext
// const RECITE_WORKFLOW_START = "recite/workflow start";
// const RECITE_WORKFLOW_END = "recite/workflow end";
const RECITEBUTTON_CLICK = "recitebutton/click";
const RECITEBUTTON_CLICKED = "recitebutton/clicked";

// inline button click/clicked wrap the subsequent subactions below
const INLINEBUTTON_CLICK = "inlinebutton/click"; // starting
const INLINEBUTTON_CLICKED = "inlinebutton/clicked"; // ended

// action states within inline button cllick
const INLINEBUTTON_LISTEN = "inlinebutton/listen";
const INLINEBUTTON_LISTENED = "inlinebutton/listened";
const INLINEBUTTON_MOVE = "inlinebutton/move";
const INLINEBUTTON_MOVED = "inlinebutton/moved";
const INLINEBUTTON_RECITE = "inlinebutton/recite";
const INLINEBUTTON_RECITED = "inlinebutton/recited";
const INLINEBUTTON_SIGNAL = "inlinebutton/signal";
const INLINEBUTTON_SIGNALED = "inlinebutton/signaled";

const RECITING_STARTED = "reciting/started"; // actual state of reciting
const RECITING_ENDED = "reciting/ended"; // actual state of reciting

const SETTINGS_TOGGLE = "settings/toggle";

// message/status bar actions
const STATUSBAR_MESSAGE_SET = "statusbar-set";
const MESSAGE_SET = "status message/set";
const MESSAGE_CLEAR = "status message/clear";

const TEST_SET = "test/set";
const TEST_RESET = "test/reset";

const FILLIN_RESETSECTION = "fillin/reset section";
const IMAGESENTRY_RESIZE = "images entry/resize";
// const FILLIN_TOGGLETAGSSECTION = "fillin/toggle tags section";
// const FILLIN_SELECTLAYOUTSECTION = "fillin/select layout section";
// Actions
const Test_set = () => {
  return {
    type: TEST_SET
  };
};
const Test_reset = () => {
  return {
    type: TEST_RESET
  };
};
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
  // NOT USED
  // set   cursor_terminalIdx: number = 0
  return {
    type: WORD_SELECT,
    payload: 0
  };
};
const Cursor_gotoFirstWord = () => {
  // first word of sentence
  return {
    type: SENTENCE_FIRST
  };
};
const Cursor_gotoNextWord = (message?: string) => {
  return {
    type: WORD_NEXT,
    payload: message
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
  // NOT USED
  return {
    type: SECTION_CHANGE,
    payload: sectionIdx
  };
};
const Fillin_setCurrent = (terminalIdx: number) => {
  return {
    type: WORD_SETCURRENTFILLIN,
    payload: terminalIdx
  };
};
const Fillin_resetSection = (sectionIdx: number) => {
  return {
    type: FILLIN_RESETSECTION,
    payload: sectionIdx
  };
};
// const Fillin_toggleTagsSection = (sectionIdx: number) => {
//   return {
//     type: FILLIN_TOGGLETAGSSECTION,
//     payload: sectionIdx
//   };
// };
// const Fillin_selectLayoutSection = (sectionIdx: number) => {
//   return {
//     type: FILLIN_SELECTLAYOUTSECTION,
//     payload: sectionIdx
//   };
// };
const InlineButton_click = (buttondIdx: number) => {
  return {
    type: INLINEBUTTON_CLICK,
    payload: buttondIdx
  };
};
const InlineButton_clicked = () => {
  return {
    type: INLINEBUTTON_CLICKED
  };
};
const InlineButton_listen = () => {
  return {
    type: INLINEBUTTON_LISTEN
  };
};
const InlineButton_listened = () => {
  return {
    type: INLINEBUTTON_LISTENED
  };
};
const InlineButton_move = () => {
  return {
    type: INLINEBUTTON_MOVE
  };
};
const InlineButton_moved = () => {
  return {
    type: INLINEBUTTON_MOVED
  };
};
const InlineButton_recite = (toBeRecited: string[]) => {
  return {
    type: INLINEBUTTON_RECITE,
    payload: toBeRecited
  };
};
const InlineButton_recited = () => {
  return {
    type: INLINEBUTTON_RECITED
  };
};
const InlineButton_signal = () => {
  return {
    type: INLINEBUTTON_SIGNAL
  };
};
const InlineButton_signaled = () => {
  return {
    type: INLINEBUTTON_SIGNALED
  };
};
// const ReciteWorkflow_start = (
//   termIdx: number = IDX_INITIALIZER,
//   scope: RecitationScopeEnumType = RecitationScopeEnumType.words,
//   span: number = 0,
//   position: RecitationPositionEnumType = RecitationPositionEnumType.unchanged,
//   listening: RecitationListeningEnumType = RecitationListeningEnumType.notListening
// ) => {
//   return {
//     type: RECITE_WORKFLOW_START,
//     payload: {
//       termIdx: termIdx,
//       scope: scope,
//       span: span,
//       position: RecitationPositionEnumType,
//       listening: RecitationListeningEnumType
//     }
//   };
// };
const Message_set = (
  message: string,
  msgType: StatusBarMessageType = StatusBarMessageType.application
) => {
  return {
    type: MESSAGE_SET,
    payload: {
      message: message,
      messageType: msgType
    }
  };
};
const Message_clear = (
  messageType: StatusBarMessageType = StatusBarMessageType.all
) => {
  return {
    type: MESSAGE_CLEAR,
    payload: messageType
  };
};
const Page_load = (
  page: string,
  linkType?: LinkIdxDestinationType,
  headingIdx?: number,
  sectionIdx?: number,
  terminalIdx?: number
) => {
  return {
    type: PAGE_LOAD,
    payload: {
      page: page,
      linkType: LinkIdxDestinationType,
      headingIdx: headingIdx,
      sectionIdx: sectionIdx,
      terminalIdx: terminalIdx
    }
  };
};
const Page_loaded = (loaded: boolean) => {
  return {
    type: PAGE_LOADED,
    payload: loaded
  };
};
const Page_gotoLink = (linkIdx: number = IDX_INITIALIZER) => {
  return {
    type: PAGE_LINKTO,
    payload: linkIdx
  };
};
const Page_setContext = (context: CPageLists) => {
  return {
    type: CONTEXT_SET,
    payload: context
  };
};
const Page_pop = () => {
  return {
    type: PAGE_POP
  };
};
const Page_popped = () => {
  return {
    type: PAGE_POPPED
  };
};
// const Page_resize = () => {
//   return {
//     type: PAGE_RESIZE
//   };
// };
const Page_restore = () => {
  return {
    type: PAGE_RESTORE
  };
};
const Page_restored = () => {
  return {
    type: PAGE_RESTORED
  };
};
const Page_home = () => {
  return {
    type: PAGE_HOME
  };
};
const Page_homed = () => {
  return {
    type: PAGE_HOMED
  };
};
const Page_homeEnabled = (yes: boolean) => {
  return {
    type: PAGE_HOME_ENABLED,
    payload: yes
  };
};
const Page_previousEnabled = (yes: boolean) => {
  return {
    type: PAGE_PREVIOUS_ENABLED,
    payload: yes
  };
};
const Page_contentTop = (y: number) => {
  return {
    type: PAGE_CONTENT_TOP,
    payload: y
  };
};
const Content_initialScrollTop = (top: number) => {
  return {
    type: CONTENT_SCROLL_TOP_INITIAL,
    payload: top
  };
};
const Content_scrollTop = (top: number) => {
  return {
    type: CONTENT_SCROLL_TOP,
    payload: top
  };
};
const Page_sitemapEnabled = (yes: boolean) => {
  return {
    type: PAGE_SITEMAP_ENABLED,
    payload: yes
  };
};
const Page_fontDownEnabled = (yes: boolean) => {
  return {
    type: PAGE_FONTDOWN_ENABLED,
    payload: yes
  };
};
const Page_textSpacingDownEnabled = (yes: boolean) => {
  return {
    type: PAGE_SPACINGDOWN_ENABLED,
    payload: yes
  };
};
const Recognition_toggle = (maxRetries: number) => {
  return {
    type: LISTENING_TOGGLE,
    payload: maxRetries
  };
};
// const Recognition_flush = () => {
//   return {
//     type: LISTENING_FLUSH
//   };
// };
// const Recognition_flushed = () => {
//   return {
//     type: LISTENING_FLUSHED
//   };
// };
const Recognition_match = (message: string) => {
  return {
    type: LISTENING_MATCH,
    payload: message
  };
};
const Recognition_message = (message: string) => {
  return {
    type: LISTENING_MESSAGE,
    payload: message
  };
};
// const Recognition_retry = (message: string) => {
//   return {
//     type: LISTENING_RETRY,
//     payload: message
//   };
// };
// const Recognition_reset_retry = (message: string) => {
//   return {
//     type: LISTENING_RETRY_RESET,
//     payload: message
//   };
// };
const Recognition_start = (stopAtEOS: boolean = false) => {
  return {
    type: LISTENING_START,
    payload: stopAtEOS
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
const Reciting_started = () => {
  return {
    type: RECITING_STARTED
  };
};
const Reciting_ended = () => {
  return {
    type: RECITING_ENDED
  };
};
const Recite_currentWord = () => {
  return {
    type: RECITE_WORD
  };
};
const Recited_currentWord = () => {
  return {
    type: RECITED_WORD
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
// const Recite_toggle = () => {
//   return {
//     type: RECITE_TOGGLE
//   };
// };
const Settings_toggle = () => {
  return {
    type: SETTINGS_TOGGLE
  };
};
const Navbar_toggle = () => {
  return {
    type: NAVBAR_TOGGLE
  };
};

export const Request = {
  Content_initialScrollTop,
  Cursor_gotoFirstSection, // first word in page
  Cursor_gotoFirstSentence, // first word in section
  Cursor_gotoFirstWord, // first word in sentence
  Cursor_gotoNextWord,
  Cursor_gotoPreviousSentence,
  Cursor_gotoNextSentence,
  Cursor_gotoPreviousWord,
  Cursor_gotoWordByIdx,
  Cursor_gotoSectionByIdx,

  //  Cursor_acknowledgeTransition,

  Fillin_setCurrent,
  Fillin_resetSection,
  // Fillin_toggleTagsSection,
  // Fillin_selectLayoutSection,
  InlineButton_click,
  InlineButton_clicked,
  // ReciteButton_clicked,
  InlineButton_listen,
  InlineButton_listened,
  InlineButton_move,
  InlineButton_moved,
  InlineButton_recite,
  InlineButton_recited,
  InlineButton_signal,
  InlineButton_signaled,

  Message_set,
  Message_clear,

  Navbar_toggle,

  Page_fontDownEnabled,
  Page_textSpacingDownEnabled,

  Page_sitemapEnabled,

  // Page_contentY,
  Page_contentTop,
  Content_scrollTop,
  Page_load,
  Page_loaded,
  Page_setContext,
  Page_gotoLink,
  Page_pop,
  Page_popped,
  Page_restore,
  Page_restored,
  Page_home,
  Page_homed,
  Page_homeEnabled,
  Page_previousEnabled,
  // Page_resize,

  Reciting_started,
  Reciting_ended,
  Recite_start,
  Recite_stop,
  Recite_currentWord,
  Recited_currentWord,
  // Recite_toggle, // strictly for button event

  Recognition_toggle,
  Recognition_setAvailability,
  // Recognition_flush,
  // Recognition_flushed,
  Recognition_match,
  Recognition_message,
  // Recognition_retry,
  // Recognition_reset_retry,
  Recognition_start,
  Recognition_stop,
  Settings_toggle,

  Speech_setAvailability,
  Speech_acknowledged,
  Speech_announceCurrentContent,
  Speech_announceListeningStart,
  Speech_announceListeningStop,
  Speech_announceMessage

  // StatusBar_Message_set,
  // StatusBar_Message_clear,
  //
  //  Speech_transitionsAcknowledged
  // Speech_announceNewSection,
  // Speech_announceNewSentence
};
interface IReduxState {
  announce_available: boolean;
  announce_listening: boolean; // "listening"
  announce_message: string;

  listen_available: boolean;
  listen_active: boolean;
  listen_stopAtEOS: boolean;
  // listen_flush: boolean;
  listen_silenceStartTime: number;
  // listen_retriesExceeded: boolean;
  // listen_retries: number;
  // listen_retries_max: number;
  // content_layout_completed: boolean;

  cursor_sectionIdx: number;
  cursor_sentenceIdx: number;
  cursor_terminalIdx: number;

  cursor_newSentenceTransition: boolean;
  cursor_newSectionTransition: boolean;
  cursor_newPageTransition: boolean;

  cursor_beginningOfPageReached: boolean;
  cursor_endOfPageReached: boolean;

  cursor_terminalIdx_proposed: number;
  cursor_sectionIdx_proposed: number;

  fillin_currentTerminalIdx: number;
  fillin_showTerminalIdx: number;
  fillin_resetSectionIdx: number;
  // fillin_toggleShowTagsSectionIdx: number;
  // fillin_selectLayoutSectionIdx: number;

  page_content_top: number;
  content_scroll_top: number;
  content_scroll_top_initial: number;
  page_requested: IPageRequestItem;
  page_loaded: boolean;
  page_section: number;
  pageContext: CPageLists;
  page_pop_requested: boolean;
  page_restore_requested: boolean;
  page_home_requested: boolean;

  page_home_enabled: boolean;
  page_fontDown_enabled: boolean;
  page_spacingDown_enabled: boolean;
  page_previous_enabled: boolean;
  page_sitemap_enabled: boolean;
  page_reciteMode: number;

  // page link info sent to page requested where it is validatable ( message
  // in a bottle)
  link_page: string; // should be same as page_requested
  link_type: LinkIdxDestinationType;
  link_headingIdx: number;
  link_sectionIdx: number;
  link_terminalIdx: number;

  navbar_toggle: boolean;

  // recite_toggle: boolean; // on/off
  recite_requested: boolean;
  recite_word_requested: boolean;
  recite_word_completed: boolean;
  reciting: boolean;

  settings_toggle: boolean;

  statusBar_message1: string;
  statusBar_message2: string;

  message_application: string;
  message_listening: string;
  message_state: string;

  inlinebutton_idx: number;
  inlinebutton_listen_requested: boolean;
  inlinebutton_move_requested: boolean;
  inlinebutton_recite_requested: boolean;
  inlinebutton_recite_toBeRecited: string[];
  inlinebutton_signal_requested: boolean;
}
const IReduxStateInitialState: IReduxState = {
  announce_available: false,
  announce_listening: false, // "listening"
  announce_message: "",

  listen_available: false,
  listen_active: false,
  listen_stopAtEOS: false,
  listen_silenceStartTime: 0,
  // listen_flush: false,
  // listen_retries_max: 0,
  // listen_retries: 0,
  // listen_retriesExceeded: false,

  // content_layout_completed: false,

  cursor_sectionIdx: 0,
  cursor_sentenceIdx: 0,
  cursor_terminalIdx: 0,

  cursor_newSentenceTransition: false,
  cursor_newSectionTransition: false,
  cursor_newPageTransition: false,
  cursor_beginningOfPageReached: true,
  cursor_endOfPageReached: false,

  fillin_currentTerminalIdx: IDX_INITIALIZER,
  fillin_showTerminalIdx: IDX_INITIALIZER,
  fillin_resetSectionIdx: IDX_INITIALIZER,
  // fillin_toggleShowTagsSectionIdx: IDX_INITIALIZER,
  // fillin_selectLayoutSectionIdx: IDX_INITIALIZER,

  link_page: "",
  link_type: LinkIdxDestinationType.page,
  link_headingIdx: IDX_INITIALIZER,
  link_sectionIdx: IDX_INITIALIZER,
  link_terminalIdx: IDX_INITIALIZER,

  page_requested: PageRequestItemInitializer(),
  page_loaded: false,
  page_content_top: 0,
  content_scroll_top: 0,
  content_scroll_top_initial: 0,
  page_section: 0,
  page_pop_requested: false,
  page_restore_requested: false,
  page_home_requested: false,

  page_home_enabled: false,
  page_fontDown_enabled: true,
  page_spacingDown_enabled: false,
  page_previous_enabled: false,
  page_sitemap_enabled: false,
  page_reciteMode: 0,

  cursor_terminalIdx_proposed: 0,
  cursor_sectionIdx_proposed: 0,

  //page_lists: new CPageLists(),
  pageContext: new CPageLists(),

  recite_requested: false,
  recite_word_requested: false,
  recite_word_completed: true,
  reciting: false,

  settings_toggle: false,
  statusBar_message1: "",
  statusBar_message2: "",

  message_application: "",
  message_listening: "",
  message_state: "",
  //  pageContext: PageContextInitializer()
  navbar_toggle: true,
  inlinebutton_idx: IDX_INITIALIZER,
  inlinebutton_recite_toBeRecited: [],
  inlinebutton_listen_requested: false,
  inlinebutton_move_requested: false,
  inlinebutton_recite_requested: false,
  inlinebutton_signal_requested: false
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
    // console.log(
    //   `@@@@setSentenceState:newsentence=${sentenceIdx !== currentSentenceIdx}`
    // );
    return [
      sentenceIdx,
      terminalIdx === 0 || sentenceIdx !== currentSentenceIdx
    ];
  };
  const setSectionState = (
    terminalIdx: number,
    currentSectionIdx: number
  ): [number, boolean] => {
    let sectionIdx: number = state.pageContext.sectionIdx(terminalIdx);
    return [sectionIdx, sectionIdx !== currentSectionIdx];
  };
  const setTerminalState = (terminalIdxs: number[]) => {
    if (terminalIdxs.length === 0) {
      state.cursor_endOfPageReached =
        state.cursor_terminalIdx === state.pageContext.lastTerminalIdx;
      console.log(`end of page?`);
    } else if (terminalIdxs.length === 1) {
      state.cursor_endOfPageReached = false;
      // resetListeningRetries();
      console.log(
        `setTerminalState single state transition from prevTermIdx=${state.cursor_terminalIdx} to nextTermIdx= ${terminalIdxs[0]}`
      );
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
    // resetListeningRetries();
    if (state.fillin_currentTerminalIdx === state.cursor_terminalIdx) {
      state.fillin_showTerminalIdx = state.fillin_currentTerminalIdx;
      //    state.fillin_currentTerminalIdx = IDX_INITIALIZER;
    }
    setTerminalState(
      state.pageContext.nextTerminalIdx(state.cursor_terminalIdx)
    );
  };
  const setToPrevTerminalState = () => {
    // resetListeningRetries();
    setTerminalState(
      state.pageContext.previousTerminalIdx(state.cursor_terminalIdx)
    );
  };
  const setToNextSentenceTerminalState = () => {
    // resetListeningRetries();
    setTerminalState([
      state.pageContext.nextSentenceTerminalIdx(state.cursor_terminalIdx)
    ]);
  };
  const setToPrevSentenceTerminalState = () => {
    // resetListeningRetries();
    setTerminalState([
      state.pageContext.previousSentenceTerminalIdx(state.cursor_terminalIdx)
    ]);
  };
  // The destination page requested (including its initial state: cursor
  // position) is received within the current page context. When the page
  // is loaded, this initial state (defined within the link definition of
  // the sourcec page) will no longer be available. Thus, the initial state
  // is saved so that it can be set upon successful loading of the destination
  // page context after which the saved requested initial page state will be
  // valid or at least validatable. The page is saved for internal validation
  // before setting the requested cursor state.
  // const savePageLinkInitialState = (
  //   page: string,
  //   linkType: LinkIdxDestinationType,
  //   headingIdx: number,
  //   sectionIdx: number,
  //   terminalIdx: number
  // ) => {
  //   state.link_page = page;
  //   state.link_type = linkType;
  //   state.link_headingIdx = headingIdx;
  //   state.link_terminalIdx = terminalIdx;
  //   state.link_sectionIdx = sectionIdx;
  // };

  // const setPageLinkInitialState = () => {
  //   if (state.link_page === state.page_requested.page) {
  //     switch (state.link_type) {
  //       case LinkIdxDestinationType.page: {
  //         setTerminalState([0]);
  //         break;
  //       }
  //       case LinkIdxDestinationType.heading: {
  //         if (
  //           state.link_headingIdx >= 0 &&
  //           state.link_headingIdx < state.pageContext.headingList.length
  //         ) {
  //           setTerminalState([
  //             state.pageContext.headingList[state.link_headingIdx].firstTermIdx
  //           ]);
  //         }
  //         break;
  //       }
  //       case LinkIdxDestinationType.section: {
  //         if (
  //           state.link_sectionIdx >= 0 &&
  //           state.link_sectionIdx < state.pageContext.sectionList.length
  //         ) {
  //           setTerminalState([
  //             state.pageContext.sectionList[state.link_sectionIdx].firstTermIdx
  //           ]);
  //         }
  //         break;
  //       }
  //       case LinkIdxDestinationType.terminal: {
  //         if (
  //           state.link_terminalIdx >= 0 &&
  //           state.link_terminalIdx < state.pageContext.terminalList.length
  //         ) {
  //           setTerminalState([state.link_terminalIdx]);
  //         }
  //         break;
  //       }
  //       default: {
  //         setTerminalState([0]);
  //         break;
  //       }
  //     }
  //   }
  //   // if (state.link_terminalIdx === state.cursor_terminalIdx) {
  //   //   // accept default
  //   // } else if (state.pageContext.isValidTerminalIdx(state.link_terminalIdx)) {
  //   //   setTerminalState([state.link_terminalIdx]);
  //   // } else if (state.pageContext.isValidSectionIdx(state.link_sectionIdx)) {
  //   //   setTerminalState([
  //   //     state.pageContext.sectionList[state.link_sectionIdx].firstTermIdx
  //   //   ]);
  //   // } else {
  //   //   state.cursor_terminalIdx = 0;
  //   // }
  // };
  // const resetListeningRetries = () => {
  //   state.listen_retries = 0;
  //   state.listen_retriesExceeded = false;
  // };
  const setListeningMessage = (message: string): string => {
    state.message_state = `${action.type}: ${message}.`;
    console.log(`Listening: ${state.message_state}`);
    return state.message_state;
  };
  switch (action.type) {
    case PAGE_LOAD:
      state.page_requested = {
        ...state.page_requested,
        page: action.payload.page as string
      };
      // state.page_requested = (action.payload.page as string) + ".json";      // cannot validate these idxs without proper context that will not
      // be available until the accompanying (payload) page is loaded
      // savePageLinkInitialState(
      //   action.payload.page,
      //   action.payload.linkType,
      //   action.payload.headingIdx,
      //   action.payload.sectionIdx,
      //   action.payload.terminalIdx
      // );
      state.page_loaded = false;
      return state;
    case PAGE_LOADED:
      state.page_loaded = action.payload as boolean;
      state.page_requested = { ...state.page_requested, page: "" };
      state.page_pop_requested = false;
      state.page_home_requested = false;
      state.content_scroll_top_initial = 0;
      return state;
    case PAGE_TOP:
      setTerminalState([state.pageContext.firstTerminalIdx]);
      return state;
    case PAGE_LINKTO:
      // if payload contains a valid link idx (from an image)
      let linkIdx: number;
      if (
        action.payload !== IDX_INITIALIZER &&
        !isNaN(action.payload) &&
        +action.payload >= 0 &&
        +action.payload < state.pageContext.linkList.length
      ) {
        linkIdx = +action.payload;
      } else {
        linkIdx =
          state.pageContext.terminalList[state.cursor_terminalIdx].linkIdx;
      }
      // if (linkIdx > 0 && linkIdx < state.pageContext.linkList.length) {
      //   savePageLinkInitialState(
      //     state.pageContext.linkList[linkIdx].destination.page,
      //     state.pageContext.linkList[linkIdx].destination.linkIdxType,
      //     state.pageContext.linkList[linkIdx].destination.headingIdx,
      //     state.pageContext.linkList[linkIdx].destination.sectionIdx,
      //     state.pageContext.linkList[linkIdx].destination.terminalIdx
      //   );
      // }
      // if (
      //   // requested page is already current
      //   state.page_requested.page ===
      //     state.pageContext.linkList[linkIdx].destination.page ||
      //   state.pageContext.linkList[linkIdx].destination.page.length === 0
      // ) {
      //   setPageLinkInitialState();
      // } else {
      //   // defer proposed cursor state
      state.page_requested = state.page_requested = {
        ...state.page_requested,
        page: state.pageContext.linkList[linkIdx].destination.page,
        currentTermIdx:
          state.pageContext.linkList[linkIdx].destination.terminalIdx
      };
      state.page_loaded = false;
      // }
      return state;
    case PAGE_POP:
      state.page_pop_requested = true;
      return state;
    case PAGE_POPPED:
      state.page_pop_requested = false;
      return state;
    case PAGE_RESTORE:
      state.page_restore_requested = true;
      return state;
    case PAGE_RESTORED:
      state.page_restore_requested = false;
      return state;
    case PAGE_HOME:
      if (state.page_restore_requested) {
        state.page_home_requested = false;
      } else {
        state.page_home_requested = true;
      }
      return state;
    case PAGE_HOMED:
      state.page_home_requested = false;
      state.page_home_enabled = false;
      state.page_previous_enabled = false;
      return state;
    case PAGE_HOME_ENABLED:
      state.page_home_enabled = action.payload;
      return state;
    case PAGE_PREVIOUS_ENABLED:
      state.page_previous_enabled = action.payload;
      return state;
    case PAGE_SPACINGDOWN_ENABLED:
      state.page_spacingDown_enabled = action.payload;
      return state;
    case PAGE_FONTDOWN_ENABLED:
      state.page_fontDown_enabled = action.payload;
      return state;
    case PAGE_CONTENT_TOP:
      state.page_content_top = action.payload;
      return state;
    case CONTENT_SCROLL_TOP:
      state.content_scroll_top = action.payload;
      return state;
    case CONTENT_SCROLL_TOP_INITIAL:
      // console.log(`reducer: contentlayoutcompleted=${action.payload}`);
      state.content_scroll_top_initial = action.payload;
      return state;
    case PAGE_SITEMAP_ENABLED:
      state.page_previous_enabled = action.payload;
      return state;
    case CONTEXT_SET:
      // cast object into class instance with methods
      // strictly a read only reference to react context NOT a copy.
      // alternatively, could access via useContext iff in provider/consumer
      // scope
      state.pageContext = action.payload as CPageLists;
      // setPageLinkInitialState();
      return state;
    case SECTION_CHANGE:
      let sectionIdx: number = +action.payload;
      console.log(sectionIdx in state.pageContext.sectionList);
      if (
        state.pageContext !== undefined &&
        state.pageContext !== null &&
        sectionIdx in state.pageContext.sectionList
      ) {
        state.cursor_sectionIdx = sectionIdx;
        state.cursor_terminalIdx =
          state.pageContext.sectionList[sectionIdx].firstTermIdx;
        state.cursor_sentenceIdx =
          state.pageContext.terminalList[state.cursor_terminalIdx].sentenceIdx;
      } else {
        // should report out-of-bound condition. How?
        state.cursor_sectionIdx = 0;
        state.cursor_terminalIdx = 0;
      }
      return state;
    case LISTENING_MATCH:
      // resetListeningRetries();
      setListeningMessage(action.payload);
      setToNextTerminalState();
      return { ...state };
    case LISTENING_MESSAGE:
      setListeningMessage(action.payload);
      return { ...state };
    case WORD_NEXT:
      setListeningMessage(action.payload);
      setToNextTerminalState();
      return { ...state };
    case WORD_PREVIOUS:
      setToPrevTerminalState();
      return { ...state };
    case WORD_SETCURRENTFILLIN:
      state.fillin_currentTerminalIdx = +action.payload;
      return { ...state };
    case SENTENCE_NEXT:
      setToNextSentenceTerminalState();
      return { ...state };
    case SENTENCE_PREVIOUS:
      setToPrevSentenceTerminalState();
      return { ...state };
    case WORD_SELECT:
      setTerminalState([+action.payload]);
      return { ...state };
    case LISTENING_TOGGLE:
      if (state.listen_available) {
        state.listen_active = !state.listen_active;
        console.log(`toggle: listen_active=${state.listen_active}`);
        // if (state.listen_active) {
        //   state.listen_retries_max = +action.payload;
        //   resetListeningRetries();
        // }
      }
      return { ...state };
    case LISTENING_START:
      if (state.listen_available) {
        state.listen_stopAtEOS = action.payload;
        state.listen_active = true;
        console.log(`start: listen_active=${state.listen_active}`);
      }
      return { ...state };
    case LISTENING_STOP:
      state.listen_active = false;
      state.listen_stopAtEOS = false; // reset
      // state.listen_retries = 0;
      // state.listen_retriesExceeded = false;
      setListeningMessage((!state.listen_active).toString());
      console.log(`stop: listen_active=${state.listen_active}`);
      return { ...state };
    case LISTENING_AVAILABLE:
      state.listen_available = action.payload;
      setListeningMessage(state.listen_available.toString());
      return { ...state };
    // case LISTENING_FLUSH:
    //   state.listen_flush = true; // resets transcript
    //   resetListeningRetries();
    //   setListeningMessage("flushing transcript");
    //   return state;
    // case LISTENING_FLUSHED:
    //   state.listen_flush = false; // resets transcript
    //   setListeningMessage("transcript flushed");
    //   return state;
    // case LISTENING_RETRY:
    //   state.listen_retries++;
    //   state.listen_retriesExceeded =
    //     state.listen_retries_max > 0 &&
    //     state.listen_retries > state.listen_retries_max;
    //   setListeningMessage(action.payload);
    //   return state;
    // case LISTENING_RETRY_RESET:
    //   state.listen_retries = 0;
    //   state.listen_retriesExceeded = false;
    //   setListeningMessage(action.payload);
    //   return state;
    case ANNOUNCE_MESSAGE:
      state.announce_message = action.payload; // resets transcript
      return { ...state };
    case ANNOUNCE_ACKNOWLEDGED:
      state.announce_message = ""; // resets transcript
      return { ...state };
    case TRANSITION_ACKNOWLEDGE:
      state.cursor_newPageTransition = false;
      state.cursor_newSectionTransition = false;
      state.cursor_newSentenceTransition = false;
      state.cursor_beginningOfPageReached = false;
      state.cursor_endOfPageReached = false;
      state.announce_message = "";
      return { ...state };
    case RECITE_START:
      state.recite_requested = true;
      return { ...state };
    case RECITE_STOP:
      state.recite_requested = false;
      return { ...state };
    case RECITING_STARTED:
      state.reciting = true;
      return { ...state };
    case RECITING_ENDED:
      state.reciting = false;
      return { ...state };

    // case RECITE_TOGGLE:
    //   // either via inline button or recite button
    //   state.recite_requested = !state.recite_requested;
    //   return { ...state };
    case RECITE_WORD:
      state.recite_word_requested = true;
      return { ...state };
    case RECITED_WORD:
      state.recite_word_requested = false;
      return { ...state };
    case SETTINGS_TOGGLE:
      state.settings_toggle = !state.settings_toggle;
      if (state.settings_toggle) {
        state.listen_active = false;
        console.log(`settingtoggle: listen_active=${state.listen_active}`);

        state.listen_stopAtEOS = false; // reset
      }
      return { ...state };

    case STATUSBAR_MESSAGE_SET:
      state.statusBar_message1 = action.payload;
      return { ...state };
    case MESSAGE_SET: {
      switch (action.payload.messageType as StatusBarMessageType) {
        case StatusBarMessageType.application:
          state.message_application = action.payload.message;
          break;
        case StatusBarMessageType.state:
          state.message_state = action.payload.message;
          break;
        case StatusBarMessageType.listening:
          state.message_listening = action.payload.message;
          break;
        default:
      }
      return { ...state };
    }
    case FILLIN_RESETSECTION: {
      state.fillin_resetSectionIdx = action.payload;
      state.fillin_showTerminalIdx = IDX_INITIALIZER;
      return { ...state };
    }
    // case FILLIN_TOGGLETAGSSECTION: {
    //   state.fillin_toggleShowTagsSectionIdx = action.payload;
    //   return state;
    // }
    // case FILLIN_SELECTLAYOUTSECTION: {
    //   state.fillin_selectLayoutSectionIdx = action.payload;
    //   return state;
    // }
    case MESSAGE_CLEAR: {
      let msgType: number =
        action.payload.messageType === undefined
          ? StatusBarMessageType.all
          : action.payload.messageType;
      switch (msgType) {
        case StatusBarMessageType.all:
          state.message_application = "";
          state.message_listening = "";
          state.message_state = "";
          break;
        case StatusBarMessageType.application:
          state.message_application = "";
          break;
        case StatusBarMessageType.state:
          state.message_state = "";
          break;
        case StatusBarMessageType.listening:
          state.message_listening = "";
          break;
        default:
      }
      return { ...state };
    }
    case NAVBAR_TOGGLE: {
      state.navbar_toggle = !state.navbar_toggle;
      return { ...state };
    }
    case INLINEBUTTON_CLICK: {
      state.inlinebutton_idx = action.payload;
      state.inlinebutton_listen_requested = false;
      state.inlinebutton_move_requested = false;
      state.inlinebutton_recite_requested = false;
      state.inlinebutton_signal_requested = false;
      // console.log(`reducer inlinebutton idx=${action.payload}`);
      return state;
    }
    case INLINEBUTTON_CLICKED: {
      state.inlinebutton_idx = IDX_INITIALIZER;
      state.inlinebutton_recite_toBeRecited = [];
      //      state.inlinebutton_listen_requested = false;
      state.inlinebutton_move_requested = false;
      state.inlinebutton_recite_requested = false;
      state.inlinebutton_signal_requested = false;
      return state;
    }
    case INLINEBUTTON_LISTEN: {
      state.inlinebutton_listen_requested = true;
      return state;
    }
    case INLINEBUTTON_LISTENED: {
      state.inlinebutton_listen_requested = false;
      return state;
    }
    case INLINEBUTTON_MOVE: {
      state.inlinebutton_move_requested = true;
      // assumes inlinebutton_idx is valid
      return state;
    }
    case INLINEBUTTON_MOVED: {
      state.inlinebutton_move_requested = false;
      return state;
    }
    case INLINEBUTTON_RECITE: {
      state.inlinebutton_recite_requested = true;
      state.inlinebutton_recite_toBeRecited = action.payload;
      // assumes inlinebutton_idx is valid
      return state;
    }
    case INLINEBUTTON_RECITED: {
      state.inlinebutton_recite_requested = false;
      return state;
    }
    case INLINEBUTTON_SIGNAL: {
      state.inlinebutton_signal_requested = true;
      // assumes inlinebutton_idx is valid
      return state;
    }
    case INLINEBUTTON_SIGNALED: {
      state.inlinebutton_signal_requested = false;
      return state;
    }
    default:
      console.log(`looking for undefined: ${action.type}`);
      return { ...state };
  }
};
