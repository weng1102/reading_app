import React from "react";
import "./App.css";
import mic_listening from "./mic1-xparent.gif";
import mic_notlistening from "./mic1-inactive-xparent.gif";
import mic_unavailable from "./mic1-ghosted.gif";
import { WordNodes, WordNodesClass } from "./wordnodes";
import { WordActions, WordNodeActions, ListeningActions } from "./reducers";
import { useAppDispatch, useAppSelector } from "./hooks";
//import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useContext } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
//import data from "content";
//import ReactDOM from 'react-dom';
var content = require("./content.json");
var contentts = require("./content.ts");
//const SpeechRecogition = new SpeechRecogition();

const SectionType = {
  ORDEREDLIST: "ol",
  UNORDEREDLIST: "ul",
  PARAGRAPH: "none"
};
//const speechRecognition = new SpeechRecognition();
// SpeechRecognition.continuous = true;
// SpeechRecognition.interimResults = true;
// SpeechRecognition.lang = "en-US";

////INSTEAD use SpeechRecognition.startListening(for the above parameters)
export const ReadingApp = () => {
  let dispatch = useAppDispatch();
  let wordNodes: any = useContext(WordNodes);
  if (wordNodes === null) wordNodes = new WordNodesClass(content);
  dispatch(WordNodeActions.setWordNodes(wordNodes));
  dispatch(
    ListeningActions.available(
      SpeechRecognition.browserSupportsSpeechRecognition()
    )
  );
  //  console.log(`contentts=${contentts.name}`);
  // console.log(`page name=${contentts.name}`);
  // console.log(`section name=${contentts.sections[0].name}`);
  return (
    // create page state in redux
    <WordNodes.Provider value={wordNodes}>
      <Page content={content} />
    </WordNodes.Provider>
  );
};
interface PagePropsType {
  content: any;
}
export const Page = React.memo((props: PagePropsType) => {
  return (
    // create page state in redux
    <>
      <PageHeader title={props.content.name} />
      <NavBar sections={props.content.sections} />
      <Content content={props.content} />
    </>
  );
}) as any;
interface ContentPropsType {
  content: any
}
export const Content = React.memo((props: ContentPropsType) => {
//let Content = (props: ContentPropsType) => {
  // Callback when section changes (via navbar)
  // page>section(chapter|paragraph)+>sentences>sentence>words>word
  //let pageid = useSelector(store => store.currentWorld.pageid);

  //need a props with number of words on page to size array
  // should set word to the first wordNodeIdx in the section
  //  let section = useSelector(store.WordSeqReducer.sectionId);
  //mapStateToProps()
  //  const [wordNodes, setWordNodes] = useContext(WordNodes);
  //  let currentWordSeq = useSelector(store => store.WordActionReducer.wordNodeIdx);
  //  console.log(`<Content> currentWordSeq=${currentWordSeq}`);

  //  let currentSectionId = useContext(WordNodes).props(currentWordSeq).sectionId;
  let currentSectionId = useAppSelector(
    store => store.WordActionReducer.sectionId
  );
  console.log(`<Content> currentSectionId=${currentSectionId}`);
  return (
    <>
      <div className="content-container">
        {props.content.sections.map((sectionObj: any, keyvalue: any) => (
          <Section
            key={keyvalue}
            active={sectionObj.id === currentSectionId}
            listFormat={SectionType.UNORDEREDLIST}
            sectionObj={sectionObj}
            //          activeWordNodeIdx={currentWordSeq}
          />
        ))}
      </div>
    </>
  );
} ) as any;
//Content = React.memo(Content);
interface SectionFormatPropsType {
  listFormat: string,
  children: any
}
export const SectionFormat = React.memo((props: SectionFormatPropsType) => {
  console.log(`<SectionFormat>`);
  switch (props.listFormat) {
    case "ul":
      return <ul>{props.children}</ul>;
    case "ol":
      return <ol>{props.children}</ol>;
    default:
      return <>{props.children}</>;
  }
}) as any;
//SectionFormat = React.memo(SectionFormat);
interface SectionHeadingPropsType {
  headingLevel: number,
  anchorId: any,
  sectionId: number,
  sectionName: string,
}
interface HeadingTagPropsType {
  level: number,
  sectionId: number,
  sectionName: string
}
const HeadingTag1 = (props: any) => {
  const headingLevels = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
  const validHeadingLevel =
    props.headingLevel > 0 && props.headingLevel < headingLevels.length - 1
      ? props.headingLevel
      : 0;
  return (<>{headingLevels[validHeadingLevel]}</>);
}
const SectionHeading = React.memo((props: SectionHeadingPropsType) => {
  const headingLevels = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
//  const HeadingTag =(props: HeadingTagPropsType) => headingLevels[validHeadingLevel];
//  if (props.anchorId !== "undefined") {
    return (
      <HeadingTag1>
        <a id={props.sectionId.toString()}>{props.sectionName}</a>
      </HeadingTag1>
  //  );
  // } else {
  //   return (
  //     <HeadingTag1>
  //       {props.sectionName}
  //     </HeadingTag1>
  )
}) as any;
interface SectionPropsType {
  active: boolean,
  sectionObj: any,
  listFormat: any
}
let Section = React.memo((props: SectionPropsType) => {
  console.log(
    `<Section> props.active=${props.active} props.listFormat=${props.listFormat} props.sectionObj=${props.sectionObj}`
  );
  ////
  // should be written to handle nested (recursive) sections using a props.level
  let level = 1; // reminder to keep track of depth of headings
  let currentSentenceId = useAppSelector(
    store => store.WordActionReducer.sentenceId
  );
  console.log(`<Section> currentSentenceId=${currentSentenceId}`);
  return (
    <>
      <SectionHeading
        headingLevel={1}
        sectionId={props.sectionObj.id}
        sectionName={props.sectionObj.name}
        anchorId={props.sectionObj.id}
      />

      <SectionFormat listFormat={props.listFormat}>
        {props.sectionObj.sentences.map((sentenceObj: any, keyvalue: any) => (
          <Sentence
            key={props.sectionObj.id + "." + keyvalue}
            active={props.active && sentenceObj.id === currentSentenceId}
            listFormat={props.listFormat}
            sentenceObj={sentenceObj}
          />
        ))}
      </SectionFormat>
    </>
  );
}) as any;
//Section = React.memo(Section);
interface SentenceFormatPropsType {
  listFormat: any,
  children: any
}
let SentenceFormat = React.memo((props:SentenceFormatPropsType) => {
  console.log(`<SentenceFormat> ${props.listFormat}`);
  switch (props.listFormat) {
    case "ul" || "ol":
      return <li>{props.children}</li>;
    default:
      return <>{props.children}</>;
  }
}) as any;
//SentenceFormat = React.memo(SentenceFormat);
interface SentencePropsType {
  key: number,
  active: boolean,
  listFormat: any,
  sentenceObj: any,
  wordObj: any
}
export const Sentence = React.memo((props: SentencePropsType) => {
  console.log(
    `<Sentence> props.active=${props.active} props.listFormat=${props.listFormat} props.sentenceObj=${props.sentenceObj}`
  );
  let currentWordNodeIdx = useAppSelector(
    store => store.WordActionReducer.wordNodeIdx
  ); // cause rerendering of all sentences
  return (
    <SentenceFormat listFormat={props.listFormat}>
      <span className={`audible-sentence ${props.active ? "active" : ""}`}>
        {props.sentenceObj.words.map((wordObj:any, keyvalue:any) => (
          <Word
            key={props.sentenceObj.id + "." + keyvalue}
            active={props.active && wordObj.wordNodeIdx === currentWordNodeIdx}
            wordObj={wordObj}
          />
        ))}
      </span>
    </SentenceFormat>
  );
}) as any;
//Sentence = React.memo(Sentence);
interface WordPropsType {
  key: number,
  active: boolean,
  wordObj: any,
  visited: boolean
}
let Word = React.memo((props: WordPropsType) => {
  console.log(
    `<Word> props.active=${props.active} props.wordObj=${props.wordObj}`
  );
  console.log(`<Word> word=${props.wordObj.word}`);
  if (Number.isInteger(props.wordObj.wordNodeIdx)) {
    // call wordNode.validWordNodeIndx
    return (
      <AudibleWord
        key={props.wordObj.wordNodeIdx}
        active={props.active}
        wordObj={props.wordObj}
        visited={false}
        //        visited={visited}
      />
    );
  } else {
    return (
      <Whitespace key={props.wordObj.wordNodeIdx} wordObj={props.wordObj} />
    );
  }
}) as any;
//Word = React.memo(Word);
interface WhitespacePropsType {
  wordObj: any
}
export const Whitespace = React.memo((props: WhitespacePropsType) => {
  console.log(`<Whitespace> rendering whitespace/punctuations`);
  return (
    <>
      <span>{props.wordObj.word}</span>
    </>
  );
}) as any;
//Whitespace = React.memo(Whitespace);
interface AudiblePropsType {
  active: boolean,
  visited: boolean,
  wordObj: any
}
export const AudibleWord = React.memo((props: AudiblePropsType) => {
  console.log(
    `<AudibleWord> props.active=${props.active} props.wordObj=${props.wordObj} props.visited`
  );
  let dispatch = useAppDispatch();
  let active = props.active ? "active" : "";
  return (
    <>
      <span
        key={props.wordObj.wordNodeIdx}
        className={`audible-word ${active} ${props.visited}`}
        onClick={() =>
          dispatch(WordActions.gotoSelectedWord(props.wordObj.wordNodeIdx))
        }
      >
        {props.wordObj.word}
      </span>
    </>
  );
}) as any;
//AudibleWord = React.memo(AudibleWord);
interface PageHeaderPropsType {
  title: string
}
export const PageHeader = React.memo((props: PageHeaderPropsType) => {
  const floatLeft: React.CSSProperties = { float: "left" };
  console.log(`<PageHeader>`);
  return (
    <header className="header">
      <div className="headerleft" style={floatLeft}>
        <div className="listen" style={floatLeft}>
          <ListenButton />
        </div>
        <div className="headertitle" style={floatLeft}>
          {props.title}
        </div>
      </div>
      <div className="header-container-controls">
        <div className="shortcuts">
          <Shortcuts />
        </div>
        <div className="recitationmode">
          <RecitationMode />
        </div>
        <div className="wordsheard">
          <WordsHeard />
        </div>
        <div className="wordcontrol">
          <WordControl />
        </div>
        <div className="readingMonitor">
          <ReadingMonitor />
        </div>
      </div>
    </header>
  );
}) as any;
//PageHeader = React.memo(PageHeader);
const ListenButton = () => {
  //
  let listeningAvailable = useAppSelector(
    store => store.ListeningReducer.listeningAvailable
  );
  let listening = useAppSelector(store => store.ListeningReducer.listening);
  console.log(`listenbutton listening=${listening}`);
  console.log(`listenbutton listeningAvailable=${listeningAvailable}`);
  const dispatch = useAppDispatch();
  return (
    <button
      className="listenButton"
      onClick={() =>
        listeningAvailable ? dispatch(ListeningActions.toggle()) : undefined
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
const RecitationMode = () => {
  // handlechange
  return (
    <select className="ddlb-recitationmode">
      <option value="recitationmode">
        Recitation mode...
      </option>
      <option value="wordonly">Word Only</option>
      <option value="uptoword">Up to word</option>
      <option value="entiresentence">Entire sentence</option>
    </select>
  );
};
interface ShortcutsPropsType {}
const Shortcuts = () => {
  // handlechange
  return (
    <select className="ddlb-shortcuts">
      <option value="shortcuts...">
        Shortcuts...
      </option>
      <option value="the">the</option>
      <option value="quick">quick</option>
      <option value="3-Word Sentences">3-Word Sentences</option>
      <option value="fox">fox</option>
      <option value="jumped">jumped</option>
      <option value="the quick brown fox jumped">
        the quick brown fox jumped
      </option>
    </select>
  );
};
interface WordsHeardPropsType {}
const WordsHeard = () => {
  const readOnly = { readonly: "true" };
  return (
    <textarea
      className="wordsheard"
      readOnly
      value="I can't hear you? Are you there?"
    />
  );
};
interface WordControlPropsType {}
const WordControl = () => {
  return (
    <>
      <div className="wordNodeIdxvalue">
        <IdField
          name="LastWordIdx"
          id={useAppSelector(store => store.WordActionReducer.lastWordNodeIdx)}
        />
      </div>
      <div className="wordNodeIdxvalue">
        <IdField
          name="Current"
          id={useAppSelector(store => store.WordActionReducer.wordNodeIdx)}
        />
      </div>
      <div className="resetwordbutton">
        <ResetWordButton />
      </div>
      <div className="prevwordbutton">
        <PrevWordButton />
      </div>
      <div className="nextwordbutton">
        <NextWordButton />
      </div>
    </>
  );
};
interface IdFieldPropsType {
  name: string,
  id: string
}
const IdField = (props: IdFieldPropsType) => {
  return (
    <>
      <span className="labelled-textarea">
        <label>{props.name}: </label>
        <textarea
          readOnly
          value={props.id}
          className="text"
          name={props.name}
          rows={1}
        />
      </span>
    </>
  );
};
interface ResetButtonPropsType {}
const ResetWordButton = () => {
  const dispatch = useAppDispatch();
  return (
    <button
      className="resetWordButton"
      onClick={() => dispatch(WordActions.gotoFirstWord())}
    >
      Reset
    </button>
  );
};
interface PrevWordButtonPropsType {}
const PrevWordButton = () => {
  let dispatch = useAppDispatch();
  return (
    <button
      className="prevWordButton"
      onClick={() => dispatch(WordActions.gotoPreviousWord())}
    >
      Prev
    </button>
  );
};
interface NextWordButtonPropsType {}
const NextWordButton = () => {
  let dispatch = useAppDispatch();
  return (
    <button
      className="nextWordButton"
      onClick={() => dispatch(WordActions.gotoNextWord())}
    >
      Next
    </button>
  );
};
interface NavPropsType {
  sections: any
}
let NavBar = React.memo((props: NavPropsType) => {
  // should jump to first word in the section basedsection to wordSeq lookup from  on wordNodes.wordSeqBySectionId(sectionid) method !!!!
  // should this code be here or in the redux?
  console.log(`<NavBar>`);
  const dispatch = useAppDispatch();
  return (
    <div className="navbar">
      {props.sections.map((section: any, keyvalue: any) => (
        <div
          className="navbar-li"
          key={keyvalue}
          onClick={() => dispatch(WordActions.gotoSelectedSection(section.id))}
        >
          {section.name}
        </div>
      ))}
      ;
    </div>
  );
}) as any;
//NavBar = React.memo(NavBar);
const SpeechSynthesis = () => {
  let currentWord = useAppSelector(store => store.WordActionReducer.wordNodeIdx);
  // to recite just the words

  // to recite the sentence

  // to receite the section

  // retrieve
};
const ReadingMonitor = () => {
  const [deferredDispatchStartTime, setDeferredDispatchStartTime] = useState(0);
  const [silenceCheckpoint, setSilenceCheckpoint] = useState(0);
  const dispatch = useAppDispatch();
  let listeningRequested = useAppSelector(
    store => store.ListeningReducer.listening
  );
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
    // defer dispatch(WordActions.matchWord()) to allow speechrecognition to
    // gather additional context. The SpeechRecogition object only triggers
    // (asynchronously) when it detects speech (and when it detects silence
    // for several seconds). This effect must balance this with the component
    // updating the current word recited.
    const timeoutLimit = 20; // seconds
    if (words.length === 0) {
      let timeoutDuration = Math.round((Date.now() - silenceCheckpoint) / 1000);
      console.log(`timeout in ${timeoutLimit - timeoutDuration}s`);
      if (timeoutDuration > timeoutLimit) {
        dispatch(ListeningActions.stop());
      }
    } else {
      setSilenceCheckpoint(Date.now());
      const msecBeforeDispatch = 10; //msec
      let deferredDispatchWaitDuration = Date.now() - deferredDispatchStartTime;
      if (deferredDispatchWaitDuration > msecBeforeDispatch) {
        console.log(`dispatch timeout after ${deferredDispatchWaitDuration}ms`);
        dispatch(WordActions.matchWords(words)); // required to update current word on page
        setDeferredDispatchStartTime(Date.now());
        // NOTE: only reset transcript at the end of sentence!!!!!!!
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
    dispatch
  ]);
  if (SpeechRecognition.browserSupportsSpeechRecognition()) {
    // listenButton disallows already
    return <div>{interimTranscript}</div>;
  } else {
    return <div>Reading monitor cannot recognize speech</div>;
  }
};
