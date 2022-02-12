////////////////
// DEPRECATED //
////////////////

/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: pageContext.ts
 *
 * Defines complementary data and behavior of the page data associated with
 * props passed directly to react functional objects.
 *
 *
 * Version history:
 *
 **/
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
export const PageContext = React.createContext(<CPageContext | null>null);

export class CPageContext {
  constructor(
    terminalList: ITerminalListItem[] = [],
    headingList: IHeadingListItem[] = [],
    sectionList: ISectionListItem[] = [],
    sentenceList: ISentenceListItem[] = []
  ) {
    this.terminalList = terminalList;
    this.headingList = headingList;
    this.sectionList = sectionList;
    this.sentenceList = sentenceList;
  }
  terminalList: ITerminalListItem[];
  headingList: IHeadingListItem[];
  sectionList: ISectionListItem[];
  sentenceList: ISentenceListItem[];

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
    return this.validTerminalIdx(terminalIdx)
      ? this.terminalList[terminalIdx].nextTermIdx
      : [];
  }
  nextSentenceTerminalIdx(terminalIdx: number): number {
    let nextIdx: number = this.lastTerminalIdx; // default to last word on page
    if (this.validTerminalIdx(terminalIdx)) {
      let lastIdxInSentence: number = this.sentenceList[
        this.terminalList[terminalIdx].sentenceIdx
      ].lastTermIdx;
      if (this.validTerminalIdx(lastIdxInSentence + 1)) {
        nextIdx = lastIdxInSentence + 1;
      }
    }
    return nextIdx;
  }
  previousSentenceTerminalIdx(terminalIdx: number): number {
    let prevIdx: number = this.firstTerminalIdx; // default to first word on page
    if (this.validTerminalIdx(terminalIdx)) {
      let firstIdxInSentence: number = this.sentenceList[
        this.terminalList[terminalIdx].sentenceIdx
      ].firstTermIdx;
      if (firstIdxInSentence !== terminalIdx) {
        prevIdx = firstIdxInSentence;
      } else {
        // goto beginning of previous sentence
        if (this.validTerminalIdx(firstIdxInSentence - 1)) {
          prevIdx = this.sentenceList[
            this.terminalList[firstIdxInSentence - 1].sentenceIdx
          ].firstTermIdx;
        }
      }
    }
    return prevIdx;
  }
  previousTerminalIdx(terminalIdx: number): number[] {
    return this.validTerminalIdx(terminalIdx)
      ? this.terminalList[terminalIdx].prevTermIdx
      : [];
  }
  sectionIdx(terminalIdx: number): number {
    return this.validTerminalIdx(terminalIdx)
      ? this.terminalList[terminalIdx].sectionIdx
      : -1;
  }
  sentenceIdx(terminalIdx: number): number {
    return this.validTerminalIdx(terminalIdx)
      ? this.terminalList[terminalIdx].sentenceIdx
      : -1;
  }
  validTerminalIdx(terminalIdx: number) {
    return (
      terminalIdx >= this.firstTerminalIdx &&
      terminalIdx <= this.lastTerminalIdx
    );
  }
}
