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
 * Even though reducer state tracks both the pageRequested and pageContext
 * changes, internal component state variable isPageLoaded tracks when new
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
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(true);
  const [previousPages, setPreviousPages] = useState<IPreviousPageArrayItem[]>(
    []
  );
  // Strictly current saves page state between page request and successful page
  // load so this current page can be  pushed on PreviousPages stack iff next page loads successfully.
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
            setPageContent(data as IPageContent);
            message = `Changing page context for "${pageRequested}"`;
            if (pageContent !== undefined && pageContent !== null) {
              if (data.version !== PageContentVersion) {
                setParseError(
                  `version mismatch. Expected ${PageContentVersion} but encountered ${data.version} in content`
                );
              } else {
                let pageContext: CPageLists = new CPageLists(
                  pageContent.terminalList,
                  pageContent.headingList,
                  pageContent.sectionList,
                  pageContent.sentenceList,
                  pageContent.linkList
                );
                if (pageContext !== null) {
                  message = `Loaded page context for "${pageRequested}"`;
                  setPageContext(pageContext);
                  dispatch(Request.Page_setContext(pageContext));
                  dumpPreviousPageStack("beforePageLoaded");
                  setIsPageLoaded(true);
                  dumpPreviousPageStack("afterPageLoaded");
                  //                setCurrentPage(pageRequested);
                  //                dispatch(Request.Page_loaded(true));
                } else {
                  message = `Loading page context failed for "${pageRequested}"`;
                }
                //              dispatch(Request.StatusBar_Message_set(message));
              }
            }
          } catch (e) {
            let message: string = (e as Error).message;
            message = `Encountered unexpected fetching error: ${message}`;
            dispatch(Request.Message_set(message));
          }
        },
        error => {
          setParseError(error);
        }
      );
  };
  let dispatch = useAppDispatch();
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  const distDir: string = settingsContext.settings.config.distDir;
  const homePage: string = settingsContext.settings.config.homePage;
  const pageLoaded: boolean = useAppSelector(store => store.page_loaded);
  let message: string = "";
  const currentTermIdx: number = useAppSelector(
    store => store.cursor_terminalIdx
  );
  const dumpPreviousPageStack = (message: string) => {
    //  return; //disable dumpPreviousPageStack
    let elString: string = "";
    previousPages.forEach(
      el => (elString += `[${el.page}, ${el.currentTermIdx}]`)
    );
    elString = elString.length > 0 ? elString : "(empty)";
    console.log(`${message}: previousPage Stack ${elString} `);
  };
  const pageRequested: string = useAppSelector(store => store.page_requested);
  const pageRestoreRequested: boolean = useAppSelector(
    store => store.page_restore_requested
  );
  useEffect(() => {
    // Initiates page load requested but not yet loaded
    if (
      !pageLoaded &&
      currentPage.length > 0 &&
      currentPage !== pageRequested
    ) {
      previousPages.push({
        page: currentPage,
        currentTermIdx: currentIdx
      });
    }
    if (previousPages.length > 0) {
      dispatch(Request.Page_homeEnabled(true));
      dispatch(Request.Page_previousEnabled(true));
    }
    dumpPreviousPageStack("initial page request");
    setIsPageLoaded(
      !(pageRequested !== undefined && pageRequested !== null && !pageLoaded)
    );

    fetchRequest(distDir + pageRequested + ".json");
  }, [distDir, pageRequested, pageLoaded, pageRestoreRequested]);

  useEffect(() => {
    // requested page loading complete
    if (!isPageLoaded) {
      dispatch(Request.Page_loaded(true));
      setIsPageLoaded(true);
      //      setPreviousPages(previousPages);
      setCurrentPage(pageRequested);
      dumpPreviousPageStack("!isPageLoaded");

      // if requested page is home page then clear stack!
    } else {
      // save previous page requested after page loaded for push later
      setCurrentPage(pageRequested);
    }
  }, [pageContent]);

  useEffect(() => {
    if (pageRequested === currentPage) setCurrentIdx(currentTermIdx);
  }, [pageRequested, currentPage, currentTermIdx]);

  const pageHomeRequested: boolean = useAppSelector(
    store => store.page_home_requested
  );
  useEffect(() => {
    if (pageHomeRequested) {
      console.log(`home requested`);
      setPreviousPages([]);
      setCurrentPage("");
      setCurrentIdx(0);
      dispatch(Request.Page_load(`homepage_${homePage}`));
      dispatch(Request.Page_homed());
    }
  }, [pageHomeRequested, homePage]);

  const pagePopRequested: boolean = useAppSelector(
    store => store.page_pop_requested
  );
  useEffect(() => {
    // pop requested
    if (pagePopRequested) {
      console.log(`pop requested`);
      let previousPage: IPreviousPageArrayItem = previousPages.pop()!;
      if (previousPage !== undefined) {
        console.log(
          `pop to ${previousPage.page}, ${previousPage.currentTermIdx}`
        );
        setCurrentPage("");
        setCurrentIdx(0);
        dumpPreviousPageStack("pagePopRequested");
        dispatch(
          Request.Page_load(previousPage.page, 0, previousPage.currentTermIdx)
        );
      } else {
        console.log(`previous page stack empty`);
      }
      if (previousPages.length === 0) {
        dispatch(Request.Page_previousEnabled(false));
        dispatch(Request.Page_homeEnabled(false));
      }
      dispatch(Request.Page_popped());
    }
  }, [pagePopRequested]);

  useEffect(() => {
    // restore  requested
    if (pageRestoreRequested) {
      console.log(`restore requested`);
      if (currentPage.length > 0) {
        dispatch(Request.Page_load(currentPage, 0, currentIdx));
        dispatch(Request.Page_restored());
      }
    }
  }, [pageRestoreRequested]);

  if (pageLoaded) {
    message = `Loaded page "${pageRequested}.json"`;
    if (pageRequested !== currentPage) setCurrentPage(pageRequested);
    dumpPreviousPageStack("pageLoaded");
  } else if (responseError) {
    message = `Encountered response error while loading "${pageRequested}.json": ${responseError}`;
  } else if (parseError) {
    const syntaxError: string =
      "SyntaxError: Unexpected token < in JSON at position 0";
    if (syntaxError.indexOf(parseError) === 0) {
      message = `Encountered incompatible JSON format while loading for "${pageRequested}"`;
    } else {
      message = `Encountered parsing error while loading "${pageRequested}.json": ${parseError}`;
    }
  } else {
    message = `Waiting for page to load for "${pageRequested}"`;
  }
  console.log(message);
  // React is complaining
  // need to wait until after <StatusBar is rendered OR  use
  // another means to detect that <StatusBar/> is loaded besides
  // surrogate pageContext

  if (pageContext !== null) {
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
