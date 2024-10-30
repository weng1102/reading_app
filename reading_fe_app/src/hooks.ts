import { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef } from "react";
import { RootState, AppDispatch } from "./store";
import { CPageLists, PageContext } from "./pageContext";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useSpanRef = () => useRef<HTMLSpanElement | null>(null);
export const useDivRef = () => useRef<HTMLDivElement | null>(null);
export const useElementRef = () => useRef<HTMLElement | null>(null);

export const useDialog = () => {
  const [isActive, setIsActive] = useState(false);
  function toggleDialog() {
    setIsActive(!isActive);
  }
  return { isActive, toggleDialog };
};
export const useWordsToBeRecited = (
  termIdx: number,
  span: number = 0
): string[] => {
  let words: string = "";
  let strQ: string[] = [];
  const pageContext: CPageLists = useAppSelector(store => store.pageContext);
  // words from termIdx to termIdx + span (or end of sentence, whichever)
  // comes first
  let minLastIdx: number = Math.min(
    span + termIdx,
    pageContext.sentenceList[pageContext.terminalList[termIdx].sentenceIdx]
      .lastTermIdx
  );
  for (let idx = termIdx; idx <= minLastIdx; idx++) {
    words += ` ${
      pageContext.terminalList[idx].altpronunciation !== ""
        ? pageContext.terminalList[idx].altpronunciation
        : pageContext.terminalList[idx].content
    }`;
  }
  // add punctuation iff idx === lastTermIdx
  if (
    minLastIdx ===
    pageContext.sentenceList[pageContext.terminalList[termIdx].sentenceIdx]
      .lastTermIdx
  )
    words +=
      pageContext.sentenceList[pageContext.terminalList[termIdx].sentenceIdx]
        .lastPunctuation;
  strQ.push(words);
  return strQ;
};
