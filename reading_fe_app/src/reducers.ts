/** Copyright (C) 2020 - 2025 Wen Eng - All Rights Reserved
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
  PageRequestItemInitializer,
  ModelingScopeEnumType,
  RecitationScopeEnumType,
  SentenceListItemEnumType
  // RecitationScopeEnumType,
  // RecitationPositionEnumType,
  // RecitationListeningEnumType
} from "./pageContentType";
import { transpileModule } from "typescript";
import { ObscuredTextDegreeEnum } from "./settingsContext";
export const IDX_INITIALIZER = -9999;
export const SCROLLTOP_INITIAL = -1;
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
const SENTENCE_RESETOPACITY = "sentence/reset opacity";
const SENTENCE_SETOPACITY = "sentence/set opacity";
const SENTENCE_ENABLETRANSITIONS = "sentence/enable transitions"; // enable sentence transition defaults
const SENTENCE_DISABLETRANSITIONS = "sentence/disable transitions"; // disable sentence transition defaults

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
const NAVBAR_HIDE = "navbar/hide";

// intrapage administrative actions (non-user initiated)
//const PAGECONTEXT_SET = "pagecontext/set";
const CONTEXT_SET = "context/set";

//listening actions
const LISTENING_AVAILABLE = "listening/available";
// const LISTENING_FLUSH = "listening/flush"; // clear transcript
// const LISTENING_FLUSHED = "listening/flushed"; // clear transcript
const LISTENING_MATCH = "listening/match"; // match word with argument with //
const LISTENING_WORDRETRIES = "listening/retries"; // word retry count with argument //
const LISTENING_WORDRETRIES_INCREMENT = "listening/increment retries"; // increment word retry count//
const LISTENING_WORDRETRIES_RESET = "listening/reset"; // word retry count reset //
const LISTENING_WORDRETRIES_SETLIMIT = "listening/set retries limit"; // set word retry limit with argument //
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
const RECITE_START = "recite/start"; // request to start reciting based on settings and current word
const RECITE_START_WORDSPAN = "recite/start wordspan"; // request to start reciting current word(s)
const RECITE_START_SENTENCE = "recite/start sentence"; // request to start reciting current sentence
const RECITE_START_SECTION = "recite/start section"; // request to start reciting current section
const RECITE_START_PASSTHRU = "recite/start with passthru"; // request to start reciting argument
const RECITE_STOP = "recite/stop";
const RECITE_STARTED = "recite/started"; // reciting started
const RECITE_ENDED = "recite/ended"; // no more to recite
const RECITE_COMPLETED = "recite/completed"; // reciting successfully completed
const RECITE_ACTIVE = "recite/active"; // reciting active
const RECITE_INACTIVE = "recite/inactive"; // no more to recite

const RECITE_WORD = "recite/word"; // exclusively for wordNext
const RECITED_WORD = "recited/word"; // exclusively for wordNext
// const RECITE_WORKFLOW_START = "recite/workflow start";
// const RECITE_WORKFLOW_END = "recite/workflow end";
// const RECITEBUTTON_CLICK = "recitebutton/click";
// const RECITEBUTTON_CLICKED = "recitebutton/clicked";
// const MODELING_START = "modeling/start"

// modeling action
const MODELING_START = "modeling/start"; // start based on settings (TBD) current sentence?
const MODELING_START_WORD = "modeling/start word"; // starting with wordIdx
const MODELING_START_BUTTON = "modeling/start button"; // starting with buttonIdx
const MODELING_START_SENTENCE = "modeling/start sentence"; // starting sentenceIdx
const MODELING_CANCEL = "modeling/cancel"; // canceling
const MODELING_STOP = "modeling/stop"; // stopping after current

// Asynchronous completers - instead of implementing aynschronous completers 
// functions, we use the action types to indicate the completion of (inline
//  button) actions.
// These booleans are initially set false by the calling component
// by calling the starter action (labeled present tense) and set to true
//  when the action is completed by the external component by calling 
// the completer action (labeled past tense)). The completion is detected
// by the original caller via the updated state value change.
const INLINEBUTTON_CLICKED = "inlinebutton/manually clicked";
const INLINEBUTTON_CANCELED = "inlinebutton/canceled";
const INLINEBUTTON_AUTOADVANCE = "inlinebutton/automatic click ";
// const ACTION_CLICK_STARTING = "inlinebutton/click";
// const ACTION_CLICK_COMPLETED = "action/clicked";
// const ACTION_CANCEL = "action/cancel";
// const ACTION_LISTEN_STARTING = "action/listen";
// const ACTION_LISTEN_COMPLETED = "action/listened";
// const ACTION_CURSORMOVE_STARTING = "action/cursormove";
// const ACTION_CURSORMOVE_COMPLETED = "action/cursormoved";
// const ACTION_RECITE_STARTING = "action/recite";
// const ACTION_RECITE_COMPLETED = "action/recited";
// const ACTION_SIGNAL_STARTING = "action/signal";
// const ACTION_SIGNAL_COMPLETED = "action/signaled";
// const ACTION_ACTIONSTATE_STARTED = "action/actionstate start";
// const ACTION_ACTIONSTATE_ENDED = "action/actionstate end";

const SENTENCE_ACKNOWLEDGETRANSITION = "sentence/acknowledge transition";

const SETTINGS_TOGGLE = "settings/toggle";

// message/status bar actions
const STATUSBAR_MESSAGE_SET = "statusbar-set";
const MESSAGE_SET = "status message/set";
const MESSAGE_CLEAR = "status message/clear";

const TEST_SET = "test/set";
const TEST_RESET = "test/reset";

const FILLIN_RESETSECTION = "fillin/reset section";
// const IMAGESENTRY_RESIZE = "images entry/resize";
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
const InlineButton_clicked = (buttonIdx: number) => {
  return {
    type: INLINEBUTTON_CLICKED,
    payload: buttonIdx
  };
}
const InlineButton_canceled = (buttonIdx: number) => {
  return {
    type: INLINEBUTTON_CANCELED,
    payload: buttonIdx
  };
}
const InlineButton_autoadvance = (buttonIdx: number) => {
  return {
    type: INLINEBUTTON_AUTOADVANCE,
    payload: buttonIdx
  };
}
const Modeling_start = () => {
  return {
    type: MODELING_START,
  };
};
const Modeling_start_button = (buttondIdx: number) => {
  return {
    type: MODELING_START_BUTTON,
    payload: buttondIdx
  };
};
const Modeling_start_sentence = (sentenceIdx: number) => {
  return {
    type: MODELING_START_SENTENCE,
    payload: sentenceIdx
  };
};
const Modeling_start_word = (wordIdx: number) => {
  return {
    type: MODELING_START_WORD,
    payload: wordIdx
  };
};
const Modeling_cancel = () => {
  return {
    type: MODELING_CANCEL
  };
};
const Modeling_stop = () => {
  return {
    type: MODELING_STOP
  };
};
// const Action_cursormoveStarting = () => {
//   return {
//     type: ACTION_CURSORMOVE_STARTING
//   };
// };
// const Action_cursormoveCompleted = () => {
//   return {
//     type: ACTION_CURSORMOVE_COMPLETED
//   };
// };
// const Action_clickStarting = () => {
//   return {
//     type: ACTION_CLICK_STARTING,
//   };
// };
// const Action_clickCompleted = () => {
//   return {
//     type: ACTION_CLICK_COMPLETED,
//   };
// };
// const Action_cancel = () => {
//   return {
//     type: ACTION_CANCEL
//   };
// };
// const Action_listenStarting = () => {
//   return {
//     type: ACTION_LISTEN_STARTING
//   };
// };
// const Action_listenCompleted = () => {
//   return {
//     type: ACTION_LISTEN_COMPLETED
//   };
// };
// const Action_moveStarting = () => {
//   return {
//     type: ACTION_CURSORMOVE_STARTING
//   };
// };
// const Action_moveCompleted = () => {
//   return {
//     type: ACTION_CURSORMOVE_COMPLETED
//   };
// };
// const Action_reciteStarting = () => {
//   return {
//     type: ACTION_RECITE_STARTING
//   };
// };
// const Action_reciteCompleted = () => {
//   return {
//     type: ACTION_RECITE_COMPLETED
//   };
// };
// const Action_signalStarting = () => {
//   return {
//     type: ACTION_SIGNAL_STARTING
//   };
// };
// const Action_signalCompleted = () => {
//   return {
//     type: ACTION_SIGNAL_COMPLETED
//   };
// };
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
const Recognition_wordRetries = (count: number, limit: number = -1) => {
  return {
    type: LISTENING_WORDRETRIES,
    payload: {retries: count, limit: limit }
  };
};
const Recognition_increment_retries = () => {
  return {
    type: LISTENING_WORDRETRIES_INCREMENT,
  };
};
const Recognition_set_retries_limit = (limit: number) => {  
  return {
    type: LISTENING_WORDRETRIES_SETLIMIT,
    payload: {limit: limit }
  };
};
const Recognition_reset_retries = (limit?: number) => {
  return {
    type: LISTENING_WORDRETRIES_RESET,
    payload: {limit: limit}
  };
};
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
const Recite_started = () => {
  return {
    type: RECITE_STARTED
  };
};
const Recite_completed = () => {
  return {
    type: RECITE_COMPLETED
  };
};
const Recite_ended = () => {
  return {
    type: RECITE_ENDED
  };
};
const Recite_active = () => {
  return {
    type: RECITE_ACTIVE
  };
};
const Recite_inactive = () => {
  return {
    type: RECITE_INACTIVE
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
  //  recite requesting start based on settings scope and current cursor terminal idx
  return {
    type: RECITE_START,
  };
};
const Recite_start_wordspan = (wordIdx: number, span: number = 0) => {
  //  recite requesting start based on current cursor terminal idx
  return {
    type: RECITE_START_WORDSPAN,
    payload: { wordIdx: wordIdx, span: span }
  };
};
const Recite_start_sentence = (sentenceIdx: number = IDX_INITIALIZER) => {
  //  Recite requesting start based on either sentence idx or 
  // sentence containing current cursor terminal idx
  return {
    type: RECITE_START_SENTENCE,
    payload: { sentenceIdx: sentenceIdx }
  }
};
const Recite_start_section = (sectionIdx: number = IDX_INITIALIZER) => {
  //  Recite requesting start based on either section idx or 
  // section containing current cursor terminal idx
  return {
    type: RECITE_START_SECTION,
    payload: { sectionIdx: sectionIdx }
  }
};
const Recite_start_passThru = (str: string) => {
  //  recite requesting start
  return {
    type: RECITE_START_PASSTHRU,
    payload: { passThru: str }
  };
};
// const Recite_start_scoped = (
//   // no argument - defaults to RecitationScopeEnumType.sentence starting with
//   // of currentTermIdx
//   // one argument (RecitationScopeEnumType) - starting with of currentTermIdx
//   // two arguments (RecitationScopeEnumType, string[]) - only 
//   // RecitationScopeEnumType.passThru AND string[] to be recited

//   // should be swapped for Recite_start so Recite_start(), Recite_start(scope) 
//   // and Recite_start(scope, strQ) are valid with different types
//   scope: RecitationScopeEnumType = 
//   RecitationScopeEnumType.sentence, strQ: string[] = []) => {
//   //  recite requesting start
//   console.log(`Recite_start_scoped: strq=${strQ[0]}`)
//   return {
//     type: RECITE_START_SCOPED,
//     payload: { scope: scope, passThru: strQ }
//   };
// };
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
const Sentence_acknowledgeTransition = () => {
  return {
    type: SENTENCE_ACKNOWLEDGETRANSITION
  };
};
const Sentence_disableTransitions = () => {
  return {
    type: SENTENCE_DISABLETRANSITIONS
  };
}
const Sentence_enableTransitions = () => {
  return {
    type: SENTENCE_ENABLETRANSITIONS
  };
}
const Sentence_resetOpacity = () => {
  return {
    type: SENTENCE_RESETOPACITY,
  };
};
const Sentence_setOpacity = (opacity: number) => {
  return {
    type: SENTENCE_SETOPACITY,
    payload: opacity
  };
};
const Navbar_hide = () => {
  return {
    type: NAVBAR_HIDE
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
  Modeling_start,
  Modeling_start_button,
  Modeling_start_sentence,
  Modeling_start_word,
  Modeling_stop,
  Modeling_cancel,

  // ReciteButton_clicked,

  InlineButton_clicked,
  InlineButton_canceled,
  InlineButton_autoadvance,
  // InlineButton_cancel,
  // InlineButton_listen,
  // InlineButton_listened,
  // InlineButton_move,
  // InlineButton_moved,
  // // InlineButton_recite,
  // InlineButton_recited,
  // InlineButton_signal,
  // InlineButton_signaled,
  // Action_clickStarting,
  // Action_cursormoveStarting,
  // Action_listenStarting,
  // Action_reciteStarting,
  // Action_signalStarting,
  // // Action_clickCompleted,
  // Action_cursormoveCompleted,
  // Action_listenCompleted,
  // Action_reciteCompleted,
  // Action_signalCompleted,
  Message_set,
  Message_clear,

  Navbar_hide,
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

  Recite_active,
  Recite_inactive,
  Recite_started,
  Recite_completed,
  Recite_ended,
  Recite_start,
  Recite_start_wordspan,
  Recite_start_sentence,
  Recite_start_section,
  Recite_start_passThru,
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
  Recognition_increment_retries,
  Recognition_reset_retries,
  Recognition_set_retries_limit,
  Recognition_wordRetries,
  // Recognition_reset_retry,
  Recognition_start,
  Recognition_stop,
  Settings_toggle,

  Sentence_disableTransitions,
  Sentence_enableTransitions,
  Sentence_resetOpacity,
  Sentence_setOpacity,
  Sentence_acknowledgeTransition,
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
  announce_message: string;

  listen_available: boolean;
  listen_announcementEnabled: boolean; // "e.g. listening"
  listen_active: boolean;
  listen_stopAtEOS: boolean;
  // listen_flush: boolean;
  listen_silenceStartTime: number;
  listen_wordRetries: number;
  listen_wordRetries_limit: number;
  listen_wordRetries_limit_progress: number; // 0-1
  listen_wordRetries_limit_exceeded: boolean;
  // content_layout_completed: boolean;

  cursor_sectionIdx: number;
  cursor_sentenceIdx: number;
  cursor_terminalIdx: number;

  cursor_nextSentenceTransition: boolean;
  cursor_nextSectionTransition: boolean;
  cursor_nextPageTransition: boolean;

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
  recite_completed: boolean
  recite_requested_terminalIdx: number
  recite_requested_scope: RecitationScopeEnumType;
  recite_requested_span: number;
  recite_requested_wordIdx: number;
  recite_requested_sentenceIdx: number;
  recite_requested_sectionIdx: number;
  recite_requested_passthru: string;
  recite_word_requested: boolean;
  recite_word_completed: boolean;
  reciting: boolean;

  message_application: string;
  message_listening: string;
  message_state: string;

  inlinebutton_reclicks: number; // needed to determine if the inline button is to be initiated or reset
  inlinebutton_autoadvance: boolean // determines subsequent click, not user initiated
  inlinebutton_idx: number;
  inlinebutton_idx_prev: number;
  modeling_requested: boolean;
  modeling_requested_scope: ModelingScopeEnumType;
  modeling_requested_wordIdx: number;
  modeling_requested_sentenceIdx: number;
  modeling_requested_buttonIdx: number;

  // action_click_initiated: boolean;
  // action_click_completed: boolean;
  // action_cursormove_initiated: boolean;
  // action_cursormove_completed: boolean;
  // action_listen_initiated: boolean;
  // action_listen_completed: boolean;
  // action_recite_initiated: boolean;
  // action_recite_completed: boolean;
  // action_signal_initiated: boolean;
  // action_signal_completed: boolean;
  
  sentence_idxObscured: number;
  sentence_opacity: number;
  sentence_type: SentenceListItemEnumType;
  sentence_useDefaultTransitions: boolean;
  settings_toggle: boolean;

  statusBar_message1: string;
  statusBar_message2: string;
}
const IReduxStateInitialState: IReduxState = {
  announce_available: false,
  listen_announcementEnabled: false, // "e.g., listening" or "not listening"
  announce_message: "",

  listen_available: false,
  listen_active: false,
  listen_stopAtEOS: false,
  listen_silenceStartTime: 0,
  listen_wordRetries: 0,
  listen_wordRetries_limit: 0,
  listen_wordRetries_limit_progress: 0,
  listen_wordRetries_limit_exceeded: false,
  // listen_retries_max: 0,
  // listen_retries: 0,
  // listen_retriesExceeded: false,

  // content_layout_completed: false,

  cursor_sectionIdx: 0,
  cursor_sentenceIdx: 0,
  cursor_terminalIdx: 0,

  cursor_nextSentenceTransition: false,
  cursor_nextSectionTransition: false,
  cursor_nextPageTransition: false,
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
  content_scroll_top_initial: SCROLLTOP_INITIAL,
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
  recite_completed: false,
  recite_requested_terminalIdx: IDX_INITIALIZER,
  recite_requested_span: 0,
  recite_requested_scope: RecitationScopeEnumType.passThru,
  recite_requested_wordIdx: IDX_INITIALIZER,
  recite_requested_sentenceIdx: IDX_INITIALIZER,
  recite_requested_sectionIdx: IDX_INITIALIZER,
  recite_requested_passthru: "",
  recite_word_requested: false,
  recite_word_completed: true,
  reciting: false,
  sentence_idxObscured: IDX_INITIALIZER,
  sentence_opacity:  ObscuredTextDegreeEnum.unobscured,
  sentence_type: SentenceListItemEnumType.default,
  sentence_useDefaultTransitions: true,
  settings_toggle: false,
  statusBar_message1: "",
  statusBar_message2: "",

  message_application: "",
  message_listening: "",
  message_state: "",
  //  pageContext: PageContextInitializer()
  navbar_toggle: true,

  modeling_requested: false,
  modeling_requested_scope: ModelingScopeEnumType.inlineButton,
  modeling_requested_wordIdx: IDX_INITIALIZER,
  modeling_requested_sentenceIdx:  IDX_INITIALIZER,
  modeling_requested_buttonIdx:  IDX_INITIALIZER,
  inlinebutton_reclicks: 0,
  inlinebutton_autoadvance: false,
  inlinebutton_idx: IDX_INITIALIZER,
  inlinebutton_idx_prev: IDX_INITIALIZER,
  // inlinebutton_recite_toBeRecited: [],

  // action_click_completed: false,
  // action_cursormove_completed: false,
  // action_listen_completed: false,
  // action_recite_completed: false,
  // action_signal_completed: false,
  
};
export const rootReducer = (
  state: IReduxState = IReduxStateInitialState,
  action: any
) => {
  const resetWordRetriesState = () => {
    state.listen_wordRetries_limit_progress = 0;
    state.listen_wordRetries_limit_exceeded = false
    state.listen_wordRetries = 0; // reset
  }
  const setSentenceState = (
    terminalIdx: number,
    currentSentenceIdx: number
  ): [number, boolean, SentenceListItemEnumType] => {
    let sentenceIdx: number = state.pageContext.sentenceIdx(terminalIdx);
    // console.log(
    //   `@@@@setSentenceState: terminalIdx=${
    //     state.pageContext.sentenceList[currentSentenceIdx].type
    //   }  currentSentenceIdx=${currentSentenceIdx} sentenceIdx=${sentenceIdx} nextsentence=${sentenceIdx !==
    //     currentSentenceIdx} type=${
    //     state.pageContext.sentenceList[currentSentenceIdx].type
    //   }`
    // );
    let newSentence: boolean;
    let type: SentenceListItemEnumType =
      currentSentenceIdx >= 0 &&
      currentSentenceIdx < state.pageContext.sentenceList.length
        ? state.pageContext.sentenceList[currentSentenceIdx].type
        : SentenceListItemEnumType.default;
    newSentence = (terminalIdx === 0 || sentenceIdx !== currentSentenceIdx);
    if (newSentence) {
      state.sentence_idxObscured = IDX_INITIALIZER;
    }
    return [sentenceIdx, newSentence, type];
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
      // console.log(
      //   `@@@@setTerminalState single state transition from prevTermIdx=${state.cursor_terminalIdx} to nextTermIdx= ${terminalIdxs[0]}`
      // );
      if (state.pageContext.isValidTerminalIdx(terminalIdxs[0])) {
        /// set single state
        // console.log(
        //   `@@@@terminalIdxs[0]= ${terminalIdxs[0]} state.cursor_sentenceIdx=${state.cursor_sentenceIdx}`
        // );
        // state.action_cursormove_completed = state.cursor_terminalIdx !== terminalIdxs[0];
        state.cursor_terminalIdx = terminalIdxs[0];
        resetWordRetriesState();
        [
          state.cursor_sentenceIdx,
          state.cursor_nextSentenceTransition,
          state.sentence_type
        ] = setSentenceState(terminalIdxs[0], state.cursor_sentenceIdx);
        [
          state.cursor_sectionIdx,
          state.cursor_nextSectionTransition
        ] = setSectionState(terminalIdxs[0], state.cursor_sectionIdx);
        state.cursor_beginningOfPageReached =
          state.cursor_terminalIdx === state.pageContext.firstTerminalIdx;
      } else {
        console.log(
          `setTerminalState single state transition encountered invalid terminalIdx=${terminalIdxs[0]}`
        );
      }
    } else {
      console.log(`setTerminalState multiple state transition encountered length=${terminalIdxs.length}`);
    }
  };
  const setToNextTerminalState = () => {
    // resetListeningRetries();
    if (state.fillin_currentTerminalIdx === state.cursor_terminalIdx) {
      state.fillin_showTerminalIdx = state.fillin_currentTerminalIdx;
      // Recognition_reset_retries();
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
    // console.log(`Listening: ${state.message_state}`);
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
      state.content_scroll_top_initial = -1;
      // state.cursor_sentenceIdx = 0;
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
      console.log(`@@ linkidx=${linkIdx}`);
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
      // Recognition_reset_retries();
      state.listen_wordRetries = 0; // reset
      return { ...state };
    case LISTENING_MESSAGE:
      setListeningMessage(action.payload);
      return { ...state };
    case LISTENING_WORDRETRIES:
      console.log(`@@@ LISTENING wordRetries=${+action.payload.retries} limit=${+action.payload.limit}`);
      state.listen_wordRetries = +action.payload.retries;
      // change limit iff explicit value is provided
      if (+action.payload.limit >= 0) state.listen_wordRetries_limit = +action.payload.limit;
      return { ...state };
    case LISTENING_WORDRETRIES_INCREMENT:
      console.log(`@@@ LISTENING wordRetries=${state.listen_wordRetries}`);
      state.listen_wordRetries = state.listen_wordRetries + 1;
      state.listen_wordRetries_limit_progress = state.listen_wordRetries/state.listen_wordRetries_limit;
      state.listen_wordRetries_limit_exceeded = state.listen_wordRetries > state.listen_wordRetries_limit
      if (state.listen_wordRetries > state.listen_wordRetries_limit) {
        console.log(`@@@ LISTENING wordRetries=${state.listen_wordRetries} exceeded limit=${state.listen_wordRetries_limit_exceeded}`);
        state.listen_wordRetries_limit_exceeded = true;
      }
      return { ...state };
    case LISTENING_WORDRETRIES_RESET:
      resetWordRetriesState();
      if (action.payload.limit !== undefined) state.listen_wordRetries_limit = +action.payload.limit;
      return { ...state };
    case LISTENING_WORDRETRIES_SETLIMIT:
      resetWordRetriesState();
      state.listen_wordRetries_limit = +action.payload.limit;
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
    case SENTENCE_DISABLETRANSITIONS:
      state.listen_announcementEnabled = false; // "e.g. listening"
      state.sentence_useDefaultTransitions = false
      return { ...state };
    case SENTENCE_ENABLETRANSITIONS:
      state.listen_announcementEnabled = true; // "e.g. listening"
      state.sentence_useDefaultTransitions = true
      return { ...state };
    case SENTENCE_NEXT:
      setToNextSentenceTerminalState();
      return { ...state };
    case SENTENCE_PREVIOUS:
      setToPrevSentenceTerminalState();
      return { ...state };
    case SENTENCE_RESETOPACITY:
      state.sentence_opacity = ObscuredTextDegreeEnum.unobscured;
      state.sentence_idxObscured = IDX_INITIALIZER;
      console.log(`@@@ reset opacity=${action.payload} idxObscured=${state.sentence_idxObscured}`);
      // );
      // gets reset when sentence transitions
      return { ...state };
    case SENTENCE_SETOPACITY:
      state.sentence_opacity = +action.payload;
      state.sentence_idxObscured = state.cursor_sentenceIdx;
      // console.log(
      //   `@@@ opacity=${action.payload} idxObscured=${state.sentence_idxObscured} state.cursor_sentenceIdx=${state.cursor_sentenceIdx}`
      // );
      // gets reset when sentence transitions
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
      console.log(`stop: listen_active=${state.listen_active}`);
      state.listen_active = false;
      state.listen_stopAtEOS = false; // reset
      // state.listen_retries = 0;
      // state.listen_retriesExceeded = false;
      setListeningMessage((!state.listen_active).toString());
      // console.log(`stop: listen_active=${state.listen_active}`);
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
      state.cursor_nextPageTransition = false;
      state.cursor_nextSectionTransition = false;
      state.cursor_nextSentenceTransition = false;
      state.cursor_beginningOfPageReached = false;
      state.cursor_endOfPageReached = false;
      state.announce_message = "";
      return { ...state };
    //All RECITE_START*() are relative to the currentTerminalIdx.
    case RECITE_START:
      state.recite_requested = true;
      state.recite_completed = false;
      // should store the following in an object
      state.recite_requested_scope = RecitationScopeEnumType.default;
      state.recite_requested_span = 0; // ignored
      state.recite_requested_passthru = ""; // ignored
      return { ...state };
    case RECITE_START_WORDSPAN:
      state.recite_requested = true;
      state.recite_completed = false;
      // state.recite_requested_terminalIdx = action.payload.terminalIdx;
      state.recite_requested_scope = RecitationScopeEnumType.words;
      state.recite_requested_wordIdx = action.payload.wordIdx;
      state.recite_requested_span = action.payload.span;
      state.recite_requested_passthru = ""; // ignored
      return { ...state };
    case RECITE_START_SENTENCE:
      console.log(`@@@ reducer: recite_sentence_started @${(new Date().getTime().toString().slice(-5))}`);
      state.recite_requested = true;
      state.recite_completed = false;
      state.recite_requested_scope = RecitationScopeEnumType.sentence;
      state.recite_requested_sentenceIdx = action.payload.sentenceIdx;
      state.recite_requested_span = 0; // ignored
      state.recite_requested_passthru = ""; // ignored
      return { ...state };
    case RECITE_START_SECTION:
      state.recite_requested = true;
      state.recite_completed = false;
      state.recite_requested_scope = RecitationScopeEnumType.section;
      state.recite_requested_sectionIdx = action.payload.sectionIdx;
      state.recite_requested_span = 0; // ignored
      state.recite_requested_passthru = ""; // ignored
      return { ...state };
    case RECITE_START_PASSTHRU:
      // console.log(`@@@ reducer: recite_start_scoped scope=${action.payload.scope} passthru=${action.payload.passThru[0]}`);
      state.recite_requested = true;
      state.recite_completed = false;
      state.recite_requested_scope = RecitationScopeEnumType.passThru;
      state.recite_requested_span = 0; // ignored
      state.recite_requested_passthru = action.payload.passThru
      return { ...state };
    case RECITE_COMPLETED:
      if (state.recite_requested) {
        // state.recite_requested = false;
        state.recite_completed = true;
        console.log(`@@@ reducer: recite_completed @${(new Date().getTime().toString().slice(-5))}`);
        state.reciting = false;
        state.recite_requested_passthru = ""
        state.recite_requested_sentenceIdx = IDX_INITIALIZER;
        state.recite_requested_sentenceIdx = IDX_INITIALIZER;
        state.recite_requested_sectionIdx = IDX_INITIALIZER;
        state.recite_requested_scope = RecitationScopeEnumType.sentence
      }
      return { ...state };
    case RECITE_STOP:
    case RECITE_ENDED:
      // reset everything
      console.log(`@@@ reducer: recite_ended @${(new Date().getTime().toString().slice(-5))}}`)
      state.recite_requested = false;
      state.recite_completed = false;
      state.reciting = false;
      // state.action_recite_completed = false;
      state.recite_requested_passthru = ""
      state.recite_requested_sentenceIdx = IDX_INITIALIZER;
      state.recite_requested_sentenceIdx = IDX_INITIALIZER;
      state.recite_requested_sectionIdx = IDX_INITIALIZER;
      state.recite_requested_scope = RecitationScopeEnumType.sentence
      return { ...state };
    case RECITE_STARTED:
      state.reciting = true;
      state.recite_completed = false;
      return { ...state };
    case RECITE_ACTIVE:
     console.log(`@@@ reducer: recite_active @${(new Date().getTime().toString().slice(-5))}`);
      state.reciting = true;
      // state.recite_requested = false;
      state.recite_completed = false;
      return { ...state };
    case RECITE_INACTIVE:
     console.log(`@@@ reducer: recite_inactive @${(new Date().getTime().toString().slice(-5))}`);
      // state.recite_requested = false;
      state.reciting = false;
      // state.recite_completed = true;
      return { ...state };
    // case RECITE_ENDED:
    //   state.recite_requested = false; // should this be reset at Recite_started?
    //   state.reciting = false;
    //   state.recite_requested_passthru = []
    //   state.recite_requested_scope = RecitationScopeEnumType.sentence
    //   return { ...state };

    // case RECITE_TOGGLE:
    //   // either via inline button or recite button
    //   state.recite_requested = !state.recite_requested;
    //   return { ...state };
    case RECITE_WORD:
      state.recite_word_requested = true;
      state.recite_completed = false;
      return { ...state };
    case RECITED_WORD:
      state.recite_word_requested = false;
      state.recite_completed = false;
      return { ...state };
    case SETTINGS_TOGGLE:
      state.settings_toggle = !state.settings_toggle;
      if (state.settings_toggle) {
        state.listen_active = false;
        console.log(`settingtoggle: listen_active=${state.listen_active}`);

        state.listen_stopAtEOS = false; // reset
      }
      return { ...state };
    case SENTENCE_ACKNOWLEDGETRANSITION:
      state.cursor_nextSentenceTransition = false;
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
    case INLINEBUTTON_AUTOADVANCE:
      state.inlinebutton_autoadvance = true;
      state.inlinebutton_idx_prev = state.inlinebutton_idx
      state.inlinebutton_idx = action.payload;
      state.inlinebutton_reclicks = 1;
      return { ...state }
    case INLINEBUTTON_CANCELED:
      if (action.payload === state.inlinebutton_idx) {
        state.inlinebutton_reclicks = 0;
        state.inlinebutton_autoadvance = false;
        state.inlinebutton_idx_prev = IDX_INITIALIZER
        state.inlinebutton_idx = IDX_INITIALIZER;
      }
      return { ...state }
    case INLINEBUTTON_CLICKED:
      // if idx and idx_prev are the same, then this is a repeat click
      state.inlinebutton_autoadvance = false;
      if (state.inlinebutton_idx === action.payload) {
        // clicked on the same inlinebutton again
        state.inlinebutton_reclicks += 1;
        if (state.inlinebutton_idx !== IDX_INITIALIZER) {
          // second consecutive click (while active) => pause
        } else { 
          // second consecutive click (while active) => pause
          // state.inlinebutton_idx_prev = IDX_INITIALIZER;
        }
      } else {
        // clicked on a new inlinebutton
        state.inlinebutton_reclicks = 0;
      }
      // with subsequent inlinebutton clicks, should the opacity increase?
      console.log(
        `@@@ reducer: inlinebutton_clicked idx=${state.inlinebutton_idx} previdx=${state.inlinebutton_idx_prev} action.payload=${action.payload} prevIdx=${state.inlinebutton_idx_prev} action.payload=${action.payload} inlinebutton_reclicks=${state.inlinebutton_reclicks};
`)
      state.inlinebutton_idx_prev = state.inlinebutton_idx
      state.inlinebutton_idx = action.payload;

      return { ...state };
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
    case NAVBAR_HIDE: {
      state.navbar_toggle = false;
      return { ...state };
    }
    case NAVBAR_TOGGLE: {
      state.navbar_toggle = !state.navbar_toggle;
      return { ...state };
    }
    case MODELING_START_BUTTON:
      state.modeling_requested = true;
      state.modeling_requested_scope = ModelingScopeEnumType.inlineButton;
      state.modeling_requested_buttonIdx = action.payload;
      return {...state}
    case MODELING_START_SENTENCE:
      state.modeling_requested = true;
      state.modeling_requested_scope = ModelingScopeEnumType.sentence;
      state.modeling_requested_sentenceIdx =action.payload.sentenceIdx;
      return {...state}
    case MODELING_START_WORD:
      state.modeling_requested = true;
      state.modeling_requested_scope = ModelingScopeEnumType.word;
      state.modeling_requested_wordIdx = action.payload.wordIdx;
      return {...state}
    case MODELING_STOP:
    case MODELING_CANCEL:
      state.modeling_requested = false;
      return {...state}
    // case ACTION_CANCEL: {
    //   // state.inlinebutton_idx = action.payload;
    //   state.action_listen_completed = false;
    //   state.action_cursormove_completed = false;
    //   state.action_recite_completed = false;
    //   state.action_signal_completed = false;
    //   return state;
    // }
    // case ACTION_CANCEL: {
    //   state.inlinebutton_idx = action.payload;
    //   state.recite_requested_passthru = [];
    //   state.inlinebutton_listen_requested = false;
    //   state.inlinebutton_move_requested = false;
    //   state.inlinebutton_recite_requested = false;
    //   state.inlinebutton_signal_requested = false;
    //   return state;
    // }
    // case ACTION_LISTEN_STARTING: {
    //   // state.action_listen_initiated = true;
    //   state.action_listen_completed = false;
    //   return state;
    // }
    // case ACTION_LISTEN_COMPLETED: {
    //   // state.action_listen_initiated = false;
    //   state.action_listen_completed = true;
    //   return state;
    // }
    // // case ACTION_LISTENED: {
    // //   state.inlinebutton_listen_requested = false;
    // //   return state;
    // // }
    // case ACTION_CURSORMOVE_STARTING: {
    //   state.action_cursormove_completed = false;
    //   return state;
    // }
    // case ACTION_CURSORMOVE_COMPLETED: {
    //   state.action_cursormove_completed = true;
    //   return state;
    // }
    // case ACTION_RECITE_STARTING: {
    //   state.action_recite_completed = false;
    //   return state;
    // }
    // case ACTION_RECITE_COMPLETED: {
    //   state.action_recite_completed = true;
    //   return state;
    // }
    // case ACTION_SIGNAL_STARTING: {
    //   state.action_signal_completed = false;
    //   // assumes inlinebutton_idx is valid
    //   return state;
    // }
    // case ACTION_SIGNAL_COMPLETED: {
    //   state.action_signal_completed = true;
    //   return state;
    // }
    default:
      console.log(`looking for undefined: ${action.type}`);
      return { ...state };
  }
};
