import React from "react"; // define glocal var
//import { ITerminalInfo, ITerminalInfoInitializer, IPageContent } from "../../src/pageContentType";
import {
  IHeadingListItem,
  ISentenceListItem,
  ISectionListItem,
  ITerminalListItem,
  ITerminalInfo
} from "./pageContentType";

//export const TerminalNodes = React.createContext(null); // should be called wordList
export interface IPageContext {
  terminalList: ITerminalListItem[];
  headingList: IHeadingListItem[];
  sectionList: ISectionListItem[];
  sentenceList: ISentenceListItem[];
}
export function PageContextInitializer(
  terminalList: ITerminalListItem[] = [],
  headingList: IHeadingListItem[] = [],
  sectionList: ISectionListItem[] = [],
  sentenceList: ISentenceListItem[] = []
): IPageContext {
  return {
    terminalList: terminalList,
    headingList: headingList,
    sectionList: sectionList,
    sentenceList: sentenceList
  };
}
export const PageContext = React.createContext(<IPageContext | null>null);

export class CTerminalNodes {
  constructor(
    terminalList: ITerminalListItem[],
    headingList: IHeadingListItem[],
    sectionList: ISectionListItem[],
    sentenceList: ISentenceListItem[]
  ) {
    this.terminalList = terminalList;
    this.headingList = headingList;
    this.sectionList = sectionList;
    this.sentenceList = sentenceList;
  }
  terminalList: ITerminalInfo[];
  headingList: IHeadingListItem[];
  sectionList: ISectionListItem[];
  sentenceList: ISentenceListItem[];

  get firstTermNodeIdx(): number {
    return 0;
  }
  get lastTermNodeIdx() {
    // should actually check for largest value, not last
    return this.terminalList.length - 1;
  }
  validTermNodeIdx(termNodeIdx: number) {
    return (
      termNodeIdx >= this.firstTermNodeIdx &&
      termNodeIdx <= this.lastTermNodeIdx
    );
  }
  /*
  updateImmutableState(state: any) {
    let termNodeIdx = state.termNodeIdx;
    if (this.validTermNodeIdx(termNodeIdx)) {
      if (termNodeIdx !== this.terminalList[termNodeIdx].termIdx) {
        console.log(
          `inconsistency detected updating immutable state where state.termNodeIdx=${termNodeIdx} !== state.termNodes[termNodeIdx].termNodeIdx=${this.terminalList[termNodeIdx].termIdx}`
        );
        return null;
      } /// signal bad news!!!
      else {
        // should use a typescript definition shared by other methods and objects
        return {
          ...state,
          term: this.terminalList[termNodeIdx].content, // renamed as content
          termIdx: this.terminalList[termNodeIdx].termIdx,
          nextTermIdx: this.terminalList[termNodeIdx].nextTermIdx,
          prevTermIdx: this.terminalList[termNodeIdx].prevTermIdx,
          altpronunciation: this.terminalList[termNodeIdx].altpronunciation,
          altrecognition: this.terminalList[termNodeIdx].altrecognition,
          recitable: this.terminalList[termNodeIdx].recitable,
          audible: this.terminalList[termNodeIdx].audible,
          visible: this.terminalList[termNodeIdx].visible,
          fillin: this.terminalList[termNodeIdx].fillin,
          visited: this.terminalList[termNodeIdx].visited
//          termPattern: this.terminalList[termNodeIdx].termPattern,
//          termId: this.terminalList[termNodeIdx].termId,
//          sentenceId: this.terminalList[termNodeIdx].sentenceId,
//          sectionId: this.terminalList[termNodeIdx].sectionId,
//          pageId: this.terminalList[termNodeIdx].pageId,
        };
      }
    } else {
      return state;
    }
  }
  */
  // alternatively, create an index interface word(idx).word and not word[idx]
  //   which would mimic array but not completely
  props(termNodeIdx: number) {
    // this was expedient!
    if (this.validTermNodeIdx(termNodeIdx)) {
      return this.terminalList[termNodeIdx];
    } else {
      console.log(`termNodes.props passed invalid termNodeIdx=${termNodeIdx}`);
      return 0;
    }
  }
}
//export { TermNodes, TermNodesClass, InitialTermNodeState };
/*
export function WordsVisited(lastWordSeq) {
  return [lastWordSeq].fill(false);
}
*/
