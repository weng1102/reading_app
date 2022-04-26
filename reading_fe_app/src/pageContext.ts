/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: pageContext.ts
 *
 * Defines complementary data and behavior of the page data associated with
 * props passed directly to react functional objects. Context represents lists
 * and setter for lists.
 *
 *
 * Version history:
 *
 **/
import React from "react"; // define glocal var
//import { ITerminalInfo, ITerminalInfoInitializer, IPageContent } from "../../src/pageContentType";
import {
  IHeadingListItem,
  ILinkListItem,
  ISentenceListItem,
  ISectionListItem,
  ITerminalListItem
} from "./pageContentType";

// export interface IPageContext1 {
//   pageLists: CPageLists;
//   setPageLists: (lists: CPageLists) => void;
// }

// export interface IPageContext {
//   pageLists: CPageLists;
//   setPageLists: (lists: CPageLists) => void;
// }
//export const TerminalNodes = React.createContext(null); // should be called wordList
export interface IPageLists {
  terminalList: ITerminalListItem[];
  headingList: IHeadingListItem[];
  sectionList: ISectionListItem[];
  sentenceList: ISentenceListItem[];
  linkList: ILinkListItem[];
}
export function PageListsInitializer(
  terminalList: ITerminalListItem[] = [],
  headingList: IHeadingListItem[] = [],
  sectionList: ISectionListItem[] = [],
  sentenceList: ISentenceListItem[] = [],
  linkList: ILinkListItem[] = []
): IPageLists {
  return {
    terminalList: terminalList,
    headingList: headingList,
    sectionList: sectionList,
    sentenceList: sentenceList,
    linkList: linkList
  };
}
// export const PageContext = React.createContext(null as IPageContext | null);
export const PageContext = React.createContext(null as CPageLists | null);
// export const PageLists = React.createContext(null as CPageLists | null);
/*

export const PageListsContext = React.createContext(
  <IPageListsContext | null>null
);
const PageListsContextProvider = (props:any) => {
  const [context, setContext] = useState(PageContextInitializer())
  return (
    <PageListsContext.Provider value={[context, setContext]}>
      {props.children}
    </PageListsContext.Provider>
  )
}
*/
export class CPageLists {
  constructor(
    terminalList: ITerminalListItem[] = [],
    headingList: IHeadingListItem[] = [],
    sectionList: ISectionListItem[] = [],
    sentenceList: ISentenceListItem[] = [],
    linkList: ILinkListItem[] = []
  ) {
    this.terminalList = terminalList;
    this.headingList = headingList;
    this.sectionList = sectionList;
    this.sentenceList = sentenceList;
    this.linkList = linkList;
  }
  terminalList: ITerminalListItem[];
  headingList: IHeadingListItem[];
  sectionList: ISectionListItem[];
  sentenceList: ISentenceListItem[];
  linkList: ILinkListItem[];

  get firstTerminalIdx(): number {
    return 0;
  }
  get lastTerminalIdx() {
    // should actually check for largest value, not last
    return this.terminalList.length - 1;
  }
  get isEmpty(): boolean {
    return this.lastTerminalIdx === 0;
    // could include sentence and section check but not heading
  }
  isLastTerminalIdx(terminalIdx: number): boolean {
    return this.lastTerminalIdx === terminalIdx;
    // could include sentence and section check but not heading
  }
  nextTerminalIdx(terminalIdx: number): number[] {
    return this.isValidTerminalIdx(terminalIdx)
      ? this.terminalList[terminalIdx].nextTermIdx
      : [];
  }
  nextSentenceTerminalIdx(terminalIdx: number): number {
    let nextIdx: number = this.lastTerminalIdx; // default to last word on page
    if (this.isValidTerminalIdx(terminalIdx)) {
      let lastIdxInSentence: number = this.sentenceList[
        this.terminalList[terminalIdx].sentenceIdx
      ].lastTermIdx;
      if (this.isValidTerminalIdx(lastIdxInSentence + 1)) {
        nextIdx = lastIdxInSentence + 1;
      }
    }
    return nextIdx;
  }
  previousSentenceTerminalIdx(terminalIdx: number): number {
    let prevIdx: number = this.firstTerminalIdx; // default to first word on page
    if (this.isValidTerminalIdx(terminalIdx)) {
      let firstIdxInSentence: number = this.sentenceList[
        this.terminalList[terminalIdx].sentenceIdx
      ].firstTermIdx;
      if (firstIdxInSentence !== terminalIdx) {
        prevIdx = firstIdxInSentence;
      } else {
        // goto beginning of previous sentence
        if (this.isValidTerminalIdx(firstIdxInSentence - 1)) {
          prevIdx = this.sentenceList[
            this.terminalList[firstIdxInSentence - 1].sentenceIdx
          ].firstTermIdx;
        }
      }
    }
    return prevIdx;
  }
  previousTerminalIdx(terminalIdx: number): number[] {
    return this.isValidTerminalIdx(terminalIdx)
      ? this.terminalList[terminalIdx].prevTermIdx
      : [];
  }
  sectionIdx(terminalIdx: number): number {
    return this.isValidTerminalIdx(terminalIdx)
      ? this.terminalList[terminalIdx].sectionIdx
      : -1;
  }
  sentenceIdx(terminalIdx: number): number {
    return this.isValidTerminalIdx(terminalIdx)
      ? this.terminalList[terminalIdx].sentenceIdx
      : -1;
  }
  isValidSectionIdx(sectionIdx: number): boolean {
    return (
      this.sectionList !== undefined &&
      this.sectionList !== null &&
      sectionIdx >= 0 &&
      sectionIdx < this.sectionList.length
    );
  }
  isValidSentenceIdx(sentenceIdx: number): boolean {
    return (
      this.sentenceList !== undefined &&
      this.sentenceList !== null &&
      sentenceIdx >= 0 &&
      sentenceIdx < this.sentenceList.length
    );
  }
  isValidTerminalIdx(terminalIdx: number): boolean {
    return (
      // should consider explicit terminalList bounds checking
      terminalIdx >= this.firstTerminalIdx &&
      terminalIdx <= this.lastTerminalIdx
    );
  }
}
