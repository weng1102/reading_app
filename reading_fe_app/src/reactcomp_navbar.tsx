/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_navbar.tsx
 *
 * Defines React front end functional components.
 *
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
// import mic_listening from "./mic1-xparent.gif";
// import mic_notlistening from "./mic1-inactive-xparent.gif";
// import mic_unavailable from "./mic1-ghosted.gif";
import { Request } from "./reducers";
import { useAppDispatch } from "./hooks";
import { IHeadingListItem } from "./pageContentType";

interface INavPropsType {
  headings: IHeadingListItem[];
}
export const NavBar = React.memo((props: INavPropsType) => {
  // should jump to first word in the section basedsection to wordSeq lookup from  on wordNodes.wordSeqBySectionId(sectionid) method !!!!
  // should this code be here or in the redux?
  console.log(`<NavBar>`);
  const dispatch = useAppDispatch();
  return (
    <nav>
      {props.headings.map((headings: IHeadingListItem, keyvalue: any) => (
        <div
          className="navbar-li"
          key={keyvalue}
          onClick={() =>
            dispatch(Request.Cursor_gotoWordByIdx(headings.termIdx))
          }
        >
          {headings.title}
        </div>
      ))}
      ;
    </nav>
  );
});
