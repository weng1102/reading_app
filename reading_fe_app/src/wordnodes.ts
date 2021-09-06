import React from "react"; // define glocal var
const WordNodes = React.createContext(null); // should be called wordList

const InitialWordNodeState = {
  word: "",
  wordNodeIdx: 0,
  nextWordNodeIdx: [],
  prevWordNodeIdx: [],
  wordPattern: "",
  wordId: 0,
  sentenceId: 0,
  sectionId: 0,
  pageId: 0,
  altRecognition: "",
  visited: false
};
// should be a class
class WordNodesClass {
  constructor(content: any) {
    this._content = null;
    //    this._ = null;
    this.populate(content);
  }
  _content: any;
  _wordNodes: any;
  get firstWordNodeIdx() {
    return 0;
  }
  get lastWordNodeIdx() {
    // should actually check for largest value, not last
    return this._wordNodes.length - 1;
  }
  validWordNodeIdx(wordNodeIdx: number) {
    return (
      wordNodeIdx >= this.firstWordNodeIdx &&
      wordNodeIdx <= this.lastWordNodeIdx
    );
  }
  updateImmutableState(state: any) {
    let wordNodeIdx = state.wordNodeIdx;
    if (this.validWordNodeIdx(wordNodeIdx)) {
      if (wordNodeIdx !== this._wordNodes[wordNodeIdx].wordNodeIdx) {
        console.log(
          `inconsistency detected updating immutable state where state.wordNodeIdx=${wordNodeIdx} !== state.wordNodes[wordNodeIdx].wordNodeIdx=${this._wordNodes[wordNodeIdx].wordNodeIdx}`
        );
        return null;
      } /// signal bad news!!!
      else {
        // should use a typescript definition shared by other methods and objects
        return {
          ...state,
          word: this._wordNodes[wordNodeIdx].word, // rename as content
          wordNodeIdx: this._wordNodes[wordNodeIdx].wordNodeIdx,
          nextWordNodeIdx: this._wordNodes[wordNodeIdx].nextWordNodeIdx,
          prevWordNodeIdx: this._wordNodes[wordNodeIdx].prevWordNodeIdx,
          wordPattern: this._wordNodes[wordNodeIdx].wordPattern,
          wordId: this._wordNodes[wordNodeIdx].wordId,
          sentenceId: this._wordNodes[wordNodeIdx].sentenceId,
          sectionId: this._wordNodes[wordNodeIdx].sectionId,
          pageId: this._wordNodes[wordNodeIdx].pageId,
          altRecognition: this._wordNodes[wordNodeIdx].altRecognition
        };
      }
    } else {
      return state;
    }
  }
  // alternatively, create an indexer interface word(idx).word and not word[idx]
  //   which would mimic array but not completely
  props(wordNodeIdx: number) {
    // this was expedient!
    if (this.validWordNodeIdx(wordNodeIdx)) {
      return this._wordNodes[wordNodeIdx];
    } else {
      console.log(`wordNodes.props passed invalid wordNodeIdx=${wordNodeIdx}`);
      return 0;
    }
  }
  populate(content: any) {
    // rename as content
    // the rest should follow pageContentType and be metadata
    console.log(`populate=${content}`);
    this._content = content;
    this._wordNodes = [content.lastWordSeq].fill(InitialWordNodeState); // non normal form array
    let sectionId, sentenceId;
    for (let section of content.sections) {
      sectionId = section.id;
      for (let sentence of section.sentences) {
        sentenceId = sentence.id;
        for (let word of sentence.words) {
          let wordNodeIdx = word.wordNodeIdx;
          if (wordNodeIdx !== undefined) {
            this._wordNodes[wordNodeIdx] = {
              word: word.word,
              wordNodeIdx: word.wordNodeIdx,
              prevWordNodeIdx: word.prevWordSeq,
              nextWordNodeIdx: word.nextWordSeq,
              wordId: word.id,
              sentenceId: sentence.id,
              sectionId: section.id,
              pageId: content.pageId,
              //            recognition: word.recognition
              //            pronunciation: word.pronunciation
              altRecognition: word.altrecognition,
              visited: false
            };
          }
        } // words
      } //sentences
    } //sections
  } //populate
}
export { WordNodes, WordNodesClass, InitialWordNodeState };
/*
export function WordsVisited(lastWordSeq) {
  return [lastWordSeq].fill(false);
}
export function PopulateWordNodes(lastWordSeq, pageId, sections) {
//  let wordNodes = new Array(lastWordSeq + 1).fill(InitialWordNodeState);
  WordNodes = [lastWordSeq].fill(InitialWordNodeState);
  for (let section of sections) {
    let sectionId = section.id;
    for (let sentence of section.sentences) {
      let sentenceId = sentence.id;
      for (let word of sentence.words) {
        let wordSeq = word.wordseq;
        if (wordSeq !== undefined) {
          WordNodes[wordSeq] = {
            word: word.word,
            wordSeq: wordSeq,
            prevWordSeq: word.prevWordSeq,
            nextWordSeq: word.nextWordSeq,
            wordId: word.id,
            sentenceId: sentenceId,
            sectionId: sectionId,
            pageId: pageId,
//            recognition: word.recognition
//            pronunciation: word.pronunciation
            altRecognition: word.altrecognition,
            visited: false
          };
        }
      }
    }
  }
}
*/
