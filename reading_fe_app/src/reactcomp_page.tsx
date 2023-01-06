/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_page.tsx
 *
 * Defines React front end functional components for page and subcomponents.
 *
 * Terminals represent the group of words, punctuations, whitespace,
 * references, etc that can be rendered.
 * "Words" refer to terminals that where the current cursor can be active;
 * that terminals that are visible and recitable as opposed to punctuations,
 * whitespace and other syntactical sugar.
 *
 * Sequence of event for page loading:
 * 1) Dispatch page request
 *    1a) dispatch(Request.Page_load(pageName)) explicitly provides pageName arg
 *    1b) dispatch(Request.Page_linkTo) references linkList table in pageContext
 * 2) Fetch page from repository defined in SettingsContext with several
 *    possible outcomes: success, response/server/transport error/timeout
 *    parsing error trying to fill the internal data structure with incoming
 *    json input stream.
 * 3) Populate pageContext with fetched/parsed json content.
 *    With the proper pageContext loaded, the link destination cursor
 *    locations (i.e, cursor_terminalIdx or sectionidx) can be validated and
 *    subsequently assigned within the reducer for eventual consumption by
 *    react component(s).
 *
 * Even though reducer state tracks both the Requested and pageContext
 * changes, internal component state variable canRender tracks when new
 * load is requested but not yet properly loaded.
 *
 * The context and content are not loaded until successful to prevent the
 * needless rerendering of <Content>
 * Version history:
 *
 **/
//import fetch, { Headers } from "node-fetch";
import React from "react";
import "./App.css";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector, useDialog } from "./hooks";
import { useEffect, useState, useContext } from "react";
import {
  IDX_INITIALIZER,
  IPageContent,
  ISectionContent,
  PageContentVersion
} from "./pageContentType";
import { CPageLists, PageContext } from "./pageContext";
import { SettingsContext, ISettingsContext } from "./settingsContext";
import { NavBar } from "./reactcomp_navbar";
import { PageHeader } from "./reactcomp_pageheader";
import { PageFooter } from "./reactcomp_pagefooter";
import { SettingsDialog } from "./reactcomp_settings";
import { SectionDispatcher } from "./reactcomp_sections";
// import { FillinSectionContexts, IFillinSectionContexts } from "./fillinContexts";

// import { StatusBarMessageType } from "./reducers";

interface IPreviousPageArrayItem {
  page: string;
  currentTermIdx: number;
}
export interface IPagePropsType {
  appName: string;
}
export const Page = React.memo((props: IPagePropsType) => {
  const [responseError, setResponseError] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<IPageContent | null>(null);
  const [pageContext, setPageContext] = useState<CPageLists | null>(null);
  const [canRender, setCanRender] = useState<boolean>(true);
  const [previousPages, setPreviousPages] = useState<IPreviousPageArrayItem[]>(
    []
  );
  // Strictly current saves page state between page request and successful page
  // load so this current page can be pushed onto PreviousPages stack iff next page loads successfully.
  const [currentPage, setCurrentPage] = useState<string>("");
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const { isActive, toggleDialog } = useDialog();
  const fetchRequest = (page: string) => {
    fetch(page, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then(
        response => {
          if (!response.ok)
            setResponseError(`HTTP status code ${response.status}`);
          // could import lookup for status
          return response.json();
        },
        error => {
          setResponseError(error);
        }
      )
      .then(
        data => {
          try {
            if (data.version !== PageContentVersion) {
              setParseError(
                `version mismatch. Expected ${PageContentVersion} but encountered ${data.version} in content`
              );
            } else {
              let content: IPageContent = data as IPageContent;
              message = `Changing page context for "${pageRequested}"`;
              setPageContext(null);
              let pageLists: CPageLists = new CPageLists(
                content.terminalList,
                content.headingList,
                content.sectionList,
                content.sentenceList,
                content.linkList,
                content.fillinList
              );
              message = `Loaded page context for "${pageRequested}"`;
              // console.log(`settingSectionFillin`);
              // // loop through fillinList
              // FillinSectionContexts = new IFillinSectionContexts[content.fillinList.length]
              // for (const fillin of content.fillinList) {
              //   ISectionFillinItem\
              //
              // }

              console.log(`settingPageContent`);
              setPageContent(content);
              console.log(`setPageContent`);
              console.log(`settingPageContext`);
              setPageContext(pageLists);
              console.log(`setPageContext`);
              dispatch(Request.Page_setContext(pageLists));
              // dumpPreviousPageStack("beforePageLoaded");
              setCanRender(true);
              // dumpPreviousPageStack("afterPageLoaded");
              //                setCurrentPage(pageRequested);
              //                dispatch(Request.Page_loaded(true));
              message = `Loading page context failed for "${pageRequested}"`;
            } // version check
          } catch (e) {
            let message: string = (e as Error).message;
            message = `Encountered unexpected fetching error: ${message}`;
            dispatch(Request.Message_set(message));
          }
        },
        error => {
          // some other parseError
          if (parseError === null) setParseError(error);
        }
      );
  };
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  const distDir: string = settingsContext.settings.config.distDir;
  const homePage: string = `homepage_${settingsContext.settings.config.homePage}`;
  const pageLoaded: boolean = useAppSelector(store => store.page_loaded);
  const pageRequested: string = useAppSelector(store => store.page_requested);
  const pageRestoreRequested: boolean = useAppSelector(
    store => store.page_restore_requested
  );
  const pageHomeRequested: boolean = useAppSelector(
    store => store.page_home_requested
  );
  const currentTermIdx: number = useAppSelector(
    store => store.cursor_terminalIdx
  );
  const pagePopRequested: boolean = useAppSelector(
    store => store.page_pop_requested
  );
  let dispatch = useAppDispatch();
  let message: string = "";
  // const dumpPreviousPageStack = (message: string) => {
  //   //  return; //disable dumpPreviousPageStack
  //   let elString: string = "";
  //   previousPages.forEach(
  //     el => (elString += `[${el.page}, ${el.currentTermIdx}]`)
  //   );
  //   elString = elString.length > 0 ? elString : "(empty)";
  //   console.log(`${message}: previousPage Stack ${elString} `);
  // };
  useEffect(() => {
    // Initiates page load requested but not yet loaded
    if (
      !pageLoaded &&
      currentPage.length > 0
      //&& currentPage !== pageRequested // not a reload
    ) {
      //update currentIdx of top page before pushing this page
      if (previousPages.length > 0)
        previousPages[previousPages.length - 1].currentTermIdx = currentIdx;

      previousPages.push({
        page: currentPage,
        currentTermIdx: IDX_INITIALIZER
      });
    }
    if (previousPages.length === 1) {
      dispatch(Request.Page_homeEnabled(false)); // unghost icon
      dispatch(Request.Page_previousEnabled(false)); // unghost icon
    } else if (previousPages.length > 0) {
      dispatch(Request.Page_homeEnabled(true)); // unghost icon
      dispatch(Request.Page_previousEnabled(true)); // unghost icon
    }
    // dumpPreviousPageStack("initial page request");
    setCanRender(
      !(pageRequested !== undefined && pageRequested !== null && !pageLoaded)
    );

    // if (pageRequested.length > 0) {
    //   setPageContext(null);
    //   fetchRequest(distDir + pageRequested + ".json");
    // }
  }, [
    pageRequested,
    pageLoaded,
    pageRestoreRequested,
    currentPage,
    currentIdx,
    dispatch,
    previousPages
  ]);

  useEffect(() => {
    // requested page loading complete
    if (!canRender) {
      dispatch(Request.Page_loaded(true));
      //      setCanRender(true);
      //      setPreviousPages(previousPages);
      setCurrentPage(pageRequested);
      // dumpPreviousPageStack("!canRender");

      // if requested page is home page then clear stack!
    } else {
      // save previous page requested after page loaded for push later
      setCurrentPage(pageRequested);
    }
  }, [canRender, dispatch, pageRequested]);

  useEffect(() => {
    if (pageRequested === currentPage) setCurrentIdx(currentTermIdx);
  }, [pageRequested, currentPage, currentTermIdx]);

  useEffect(() => {
    if (pageHomeRequested) {
      console.log(`home requested`);
      setPreviousPages([]);
      setCurrentPage("");
      setCurrentIdx(0);
      dispatch(Request.Page_load(homePage));
      dispatch(Request.Page_homeEnabled(false));
      dispatch(Request.Page_homed());
    }
  }, [pageHomeRequested, homePage, dispatch]);

  useEffect(() => {
    // pop requested
    if (pagePopRequested) {
      // console.log(`pop requested`);
      // console.log(`previouspage stack in pagePopRequested 0`);
      // previousPages.forEach(page => {
      //   console.log(`${page.page} ${page.currentTermIdx}`);
      // });
      previousPages.pop()!; // toss current page of top of stack
      // console.log(`previouspage stack in pagePopRequested 1`);
      // previousPages.forEach(page => {
      //   console.log(`${page.page} ${page.currentTermIdx}`);
      // });
      let previousPage: IPreviousPageArrayItem = previousPages.pop()!;
      // console.log(`previouspage stack in pagePopRequested 2`);
      // previousPages.forEach(page => {
      //   console.log(`${page.page} ${page.currentTermIdx}`);
      // });
      if (previousPage !== undefined) {
        console.log(
          `pop to ${previousPage.page}, ${previousPage.currentTermIdx}`
        );
        setCurrentPage("");
        setCurrentIdx(0);
        // dumpPreviousPageStack("pagePopRequested");
        dispatch(
          Request.Page_load(previousPage.page, 0, previousPage.currentTermIdx)
        );
      } else {
        console.log(`previous page stack empty`);
      }
      if (previousPages.length === 0 || previousPage.page === homePage) {
        dispatch(Request.Page_previousEnabled(false));
        dispatch(Request.Page_homeEnabled(false));
      }
      dispatch(Request.Page_popped());
    }
  }, [pagePopRequested, dispatch, homePage, previousPages]);

  useEffect(() => {
    // restore  requested
    if (pageRestoreRequested) {
      console.log(`restore requested`);
      if (currentPage.length > 0) {
        dispatch(Request.Page_load(currentPage, 0, currentIdx));
        dispatch(Request.Page_restored());
      }
    }
  }, [pageRestoreRequested, dispatch, currentPage, currentIdx]);

  //////////
  // pageHomeRequested pagePopRequested pageRestoreRequested should be
  // translated into page_requested and
  // should all be processes in render code and not useEffect() to avoid
  // undesirable/unpredictable side effects
  //////////

  // Translate possible actions into page load
  //iff canRender === false

  //PAGE REQUESTS
  //PAGE LOAD
  //   if (pageRequested === currentPage) {
  //     console.log(`no direct page requested`);
  //     dispatch(Request.Page_loaded(true)); // cancel loading
  // } else {  //PAGE LOAD
  //     console.log(`page load requested ${pageRequested}`);
  // }

  if (!pageLoaded) {
    // page requested already
    message = `Loaded page "${pageRequested}.json"`;
    if (pageRequested.length === 0) {
    } else if (pageRequested !== currentPage) {
      message = `loading new page "${pageRequested} over current ${currentPage}"`;

      fetchRequest(distDir + pageRequested + ".json");
      setCurrentPage(pageRequested); // should be in useEffect() pageloaded
    } else {
      message = `loading new page "${pageRequested} over current ${currentPage}"`;
    }
    // dumpPreviousPageStack("pageLoaded");
  } else if (parseError) {
    message = parseError;
  } else if (responseError) {
    message = `Encountered response error while loading "${pageRequested}.json": ${responseError}`;
  } else if (pageRequested.length === 0) {
    message = `Waiting...unknown page requested`;
  } else {
    message = `Waiting for page to load for "${pageRequested}..."`;
  }
  console.log(message);
  // console.log(`previouspage stack in reactcomp_page`);
  // previousPages.forEach(page => {
  //   console.log(`${page.page} ${page.currentTermIdx}`);
  // });
  console.log(`currentpage ${currentPage}`);
  // React is complaining
  // need to wait until after <StatusBar is rendered OR  use
  // another means to detect that <StatusBar/> is loaded besides
  // surrogate pageContext
  if (pageContext !== null) {
    /////// should be pageRenderable
    console.log(`rendering ${pageRequested} after context loaded`);
    return (
      <PageContext.Provider value={pageContext}>
        <div className="page">
          <PageHeader title={pageContent!.title} />
          <SettingsDialog isActive={isActive} hide={toggleDialog} />
          <NavBar headings={pageContent!.headingList} />
          <Content content={pageContent!} />
          <PageFooter />
        </div>
      </PageContext.Provider>
    );
  } else {
    console.log(`waiting for  ${pageRequested} context to be loaded`);
    return <div className="loadingAnnouncement">{message}</div>;
  }
});
interface IContentPropsType {
  content: IPageContent;
}
export const Content = React.memo((props: IContentPropsType): any => {
  const currentSectionIdx: number = useAppSelector(
    store => store.cursor_sectionIdx
  );
  return (
    <main>
      {props.content.sections.map(
        (section: ISectionContent, keyvalue: number) => (
          <SectionDispatcher
            key={keyvalue}
            active={currentSectionIdx === section.id}
            section={section}
          />
        )
      )}
    </main>
  );
});
