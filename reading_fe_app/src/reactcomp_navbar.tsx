/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_navbar.tsx
 *
 * Defines React front end functional component for navbar.
 *
 *
 * Version history:
 *
 **/
import React from "react";
import { useContext, useEffect, useState } from "react";
import "./App.css";
// import mic_listening from "./mic1-xparent.gif";
// import mic_notlistening from "./mic1-inactive-xparent.gif";
// import mic_unavailable from "./mic1-ghosted.gif";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector, useSpanRef } from "./hooks";
import { IHeadingListItem } from "./pageContentType";
import { ISettingsContext, SettingsContext } from "./settingsContext";

interface INavPropsType {
  headings: IHeadingListItem[];
}
export const NavBar = React.memo((props: INavPropsType) => {
  // should jump to first word in the section basedsection to wordSeq lookup from  on wordNodes.wordSeqBySectionId(sectionid) method !!!!
  // should this code be here or in the redux?
  const settingsContext: ISettingsContext = useContext(
    SettingsContext
  ) as ISettingsContext;

  const terminalRef = useSpanRef();
  const currentTerminalIdx = useAppSelector(store => store.cursor_terminalIdx);
  console.log(`<NavBar>`);
  const dispatch = useAppDispatch();
  const toggleNavBar: boolean = useAppSelector(store => store.navbar_toggle);
  useEffect(() => {
    // console.log(`navbar changed to termIdx=${currentTerminalIdx}`);
    // console.log(`##navbar terminalRef=${terminalRef}`);
    if (terminalRef.current != null) {
      // let rect = terminalRef.current.getBoundingClientRect();
      // console.log(`##navbar rect top=${rect.top}, bottom=${rect.bottom}`);
      // console.log(`##window.innerHeight=${window.innerHeight}`);
      // console.log(
      //   `##nav windowHeight=${
      //     document.getElementsByTagName("nav")[0].clientHeight
      //   }`
      // );
      // if (rect.top < 200 || rect.bottom > window.innerHeight) {
      //200 header height
      terminalRef.current.scrollIntoView(true);
    }
  }, [currentTerminalIdx, terminalRef]);
  useEffect(() => {
    // console.log(
    //   `#### current heading changed currentTerminalIdx=${currentTerminalIdx}`
    // );
    //go through headingList
  }, [currentTerminalIdx]);

  document.documentElement.style.setProperty(
    "--nav-width",
    toggleNavBar ? settingsContext.settings.config.navbarWidth : "0"
  );
  return (
    <nav>
      {props.headings.map((heading: IHeadingListItem, keyvalue: any) => (
        <div
          className={`navbar-h${heading.headingLevel.toString()} ${
            currentTerminalIdx >= heading.firstTermIdx &&
            currentTerminalIdx <= heading.lastTermIdx
              ? "navbar-current"
              : ""
          }`}
          key={keyvalue}
          onClick={() => {
            dispatch(Request.Cursor_gotoWordByIdx(heading.firstTermIdx));
          }}
        >
          <span
            key={keyvalue}
            ref={
              currentTerminalIdx >= heading.firstTermIdx &&
              currentTerminalIdx <= heading.lastTermIdx
                ? terminalRef
                : null
            }
          >
            {heading.title}
          </span>
        </div>
      ))}
      ;
    </nav>
  );
});
