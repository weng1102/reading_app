/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
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
 *    1b) dispatch(Request.Page_gotoLink) references linkList table in
 *    pageContext.
 *    1c) dispatch(Request.Page_pop()) references page stack of previous pages.
 *    1d) dispatch(Request.Page_home()) references home page within settings
 *    context.
 * 2) Fetch page from repository defined in SettingsContext with several
 *    possible outcomes: success, response/server/transport error/timeout
 *    parsing error trying to fill the internal data structure with incoming
 *    json input stream.
 * 3) Populate pageContext with fetched/parsed json content.
 *    With the proper pageContext loaded, the link destination cursor
 *    locations (i.e, cursor_terminalIdx or sectionidx) can be validated and
 *    subsequently assigned within the reducer for eventual consumption by
 *    react component(s).
 * 4) Load the previousPage stack and reset internal state for next request.
 *
 * Even though reducer state tracks both the Requested and pageContext
 * changes, internal component state variable requestedPage, isPageFetched and
 *  loadedPage track when new load is requested, fetched and loaded.
 *
 * Request states:
 *  1) Determine pageRequested based on change to reducer states:
 *    a) pageRequested_home, or
 *    b) pageRequested_pop, or
 *    c) pageRequested_link
 *
 *  2) Set requestedPage to be fetched
 *
 *  3) load context and content that triggers render
 *     The content is not rendered until the context and content are fetched
 *     and parsed successfully to prevent needless rerendering of <Content>
 *
 *  4) Update page stack
 *
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector, useDialog } from "./hooks";
import { useEffect, useState, useContext, useCallback } from "react";
import {
  IPageContent,
  IPageRequestItem,
  ISectionContent,
  // LinkIdxDestinationType,
  PageContentVersion,
  PageRequestItemType,
  PageRequestItemInitializer
} from "./pageContentType";
import { CPageLists, PageContext } from "./pageContext";
import { SettingsContext, ISettingsContext } from "./settingsContext";
import { NavBar } from "./reactcomp_navbar";
import { PageHeader } from "./reactcomp_pageheader";
import { PageFooter } from "./reactcomp_pagefooter";
import { SettingsDialog } from "./reactcomp_settings";
import { SectionDispatcher } from "./reactcomp_sections";

export interface IPagePropsType {
  appName: string;
}
export const Page = React.memo((props: IPagePropsType) => {
  const [pageRequested, setPageRequested] = useState<IPageRequestItem>(
    PageRequestItemInitializer()
  );
  // const [pageFetchRequested, setPageFetchRequested] = useState<string>("");
  const [previouslyLoadedPage, setPreviouslyLoadedPage] = useState<
    IPageRequestItem
  >(PageRequestItemInitializer());
  const [pageLoaded, setPageLoaded] = useState<IPageRequestItem>(
    PageRequestItemInitializer()
  );
  // required for updating state after content/context loaded based on request
  const [pageRequestType, setPageRequestType] = useState<number>(
    PageRequestItemType.unknown
  );
  //////////////////////
  // page content state
  const [pageContext, setPageContext] = useState<CPageLists | null>(null);
  const [pageContent, setPageContent] = useState<IPageContent | null>(null);
  const [responseError, setResponseError] = useState<string>("");
  const [parseError, setParseError] = useState<string>("");
  const [previousPages, setPreviousPages] = useState<IPageRequestItem[]>([]);

  // const [isPageInitialized, setIsPageInitialized] = useState<boolean>(false);

  // mutually exclusive page states
  //  const [isPageRequested, setIsPageRequested] = useState<boolean>(false);
  const [isPageContentFetched, setIsPageContentFetched] = useState<boolean>(
    false
  );
  const [isPageRequestInProgress, setIsPageRequestInProgress] = useState<
    boolean
  >(false);
  const [pageMessage, setPageMessage] = useState<string>("");
  const { isActive, toggleDialog } = useDialog();
  const dispatch = useAppDispatch();

  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  const distDir: string = settingsContext.settings.config.distDir;
  const homePagePath: string = `homepage_${settingsContext.settings.config.homePage}`;
  //  const isPageLoaded: boolean = useAppSelector(store => store.page_loaded);
  //  console.log = () => {};

  const dumpPageRequestItemsAsCsv = (pageStack: IPageRequestItem[]): string => {
    let list: string = "";
    if (pageStack.length > 0) {
      pageStack.forEach((page, i) => {
        list += `[${i}]:(${page.page},${page.currentTermIdx}),`;
      });
      list = list.slice(0, list.length - 1) + "(top}";
    } else {
      list = "(empty)";
    }
    return list;
  };

  const fetchPageRequested = useCallback(() => {
    let page: string = distDir + pageRequested.page + ".json";
    let message: string = `Page fetch requested for ${page}`;
    dispatch(Request.Message_set(message));
    fetch(page, {
      method: "GET",
      // mode: "cors",
      headers: {
        Accept: "application/json"
      }
    })
      .then(
        response => {
          // setIsPageFetchRequested(false);
          if (!response.ok)
            setResponseError(`HTTP status code ${response.status} for ${page}`);
          // could import lookup for status
          return response.json();
        },
        error => {
          // setIsPageFetchRequested(false);
          setResponseError(error);
        }
      )
      .then(
        data => {
          try {
            // setIsPageFetchRequested(false);
            if (data.version !== PageContentVersion) {
              setParseError(
                `Mismatching application and json formats. Expected ${PageContentVersion} but encountered ${data.version} in content`
              );
            } else {
              let content: IPageContent = data as IPageContent;
              message = `Parsing json for "${page}"`;
              dispatch(Request.Message_set(message));
              // setPageContext(null);
              let pageLists: CPageLists = new CPageLists(
                content.showTags,
                content.terminalList,
                content.headingList,
                content.sectionList,
                content.sentenceList,
                content.linkList,
                content.fillinList
              );
              setPageContext(pageLists);
              setPageContent(content);
              dispatch(Request.Message_set(message));
              dispatch(Request.Page_setContext(pageLists));
              setIsPageContentFetched(true);
              message = `Page fetched, data loaded and parsed successfully for "${page}"`;
              dispatch(Request.Message_set(message));
            }
          } catch (e) {
            let message: string = (e as Error).message;
            message = `Encountered unexpected loading error: ${message}`;
            dispatch(Request.Message_set(message));
          }
        },
        error => {
          // some other parseError
          if (parseError.length > 0) setParseError(error);
        }
      );
  }, [
    dispatch,
    // setParseError,
    // setResponseError,
    // setPageContent,
    // setPageContext,
    // setIsPageContentFetched,
    pageRequested.page,
    distDir,
    parseError.length
  ]);

  //////////////////////
  // initial entry point
  //////////////////////

  // triggers to render
  const pageRequested_link: IPageRequestItem = useAppSelector(
    store => store.page_requested
  );
  const pageRequested_pop: boolean = useAppSelector(
    store => store.page_pop_requested
  );
  const pageRequested_home: boolean = useAppSelector(
    store => store.page_home_requested
  );
  const currentTermIdx: number = useAppSelector(
    store => store.cursor_terminalIdx
  );
  useEffect(() => {
    setPageMessage(parseError);
    setParseError("");
  }, [parseError]);
  useEffect(() => {
    setPageMessage(responseError);
    setIsPageRequestInProgress(false);
  }, [responseError]);
  /////////////////////////////////////
  // page requested: home, pop, or link
  /////////////////////////////////////
  useEffect(() => {
    //setPageRequested iff no current pageRequested (i.e., pageRequested.page
    // is currently unspecified.
    let requestedPage: IPageRequestItem;
    let requestedType: PageRequestItemType;
    if (!isPageRequestInProgress) {
      if (pageRequested_home) {
        requestedPage = PageRequestItemInitializer(homePagePath);
        requestedType = PageRequestItemType.home;
      } else if (pageRequested_pop) {
        requestedPage = previousPages.slice(-1)[0];
        requestedType = PageRequestItemType.pop;
      } else if (pageRequested_link.page.length > 0) {
        requestedPage = pageRequested_link;
        requestedType = PageRequestItemType.link;
      } else {
        requestedPage = PageRequestItemInitializer();
        requestedType = PageRequestItemType.unknown;
      }
      if (
        requestedPage.page !== pageLoaded.page &&
        requestedType !== PageRequestItemType.unknown
      ) {
        setIsPageRequestInProgress(true);
        setPageRequested(requestedPage);
        setPageRequestType(requestedType);
        console.log(
          `@@page requested: pageRequested=${requestedPage.page} !== pageLoaded=${pageLoaded.page} type=${requestedType}`
        );
      } else {
        console.log(`@@page requested already loaded: ${requestedPage.page}`);
      }
    }
  }, [
    pageRequested,
    pageRequested_link,
    pageRequested_home,
    pageRequested_pop,
    setPageRequested,
    setPageRequestType,
    isPageRequestInProgress,
    setIsPageRequestInProgress,
    homePagePath,
    pageLoaded.page,
    previousPages
  ]);
  ////////////////////////////////////////////////////////
  // page fetching after pageRequested: home, pop, or link
  ////////////////////////////////////////////////////////

  useEffect(() => {
    let message: string = ``;
    if (
      isPageRequestInProgress &&
      !isPageContentFetched &&
      pageRequested.page.length > 0
    ) {
      console.log(
        `@@page fetching: page=${pageRequested.page}  pageRequested=${pageRequested.page},pageLoaded=${pageLoaded.page})`
      );
      dispatch(Request.Page_loaded(false));
      setIsPageContentFetched(false);

      fetchPageRequested();
      // }
      console.log(message);
      setPageMessage(message);
    }
  }, [
    pageRequested,
    pageLoaded,
    pageRequested.page,
    isPageContentFetched,
    // setPageMessage,
    dispatch,
    parseError,
    distDir,
    // setPageContext,
    // setPageContent,
    pageRequestType,
    isPageRequestInProgress,
    fetchPageRequested
    //    setPageLoaded
  ]);
  // Handles (re)setting state after page fetch completes until page is loaded
  useEffect(() => {
    if (isPageContentFetched) {
      console.log(`@@page content fetched:
pageRequested=${pageRequested.page},isPageContentFetched=${isPageContentFetched},pageLoaded=${pageLoaded.page}`);
      let message: string = "After page fetched";
      if (isPageContentFetched) {
        if (pageLoaded.page.length > 0) {
          setPreviouslyLoadedPage({
            page: pageLoaded.page,
            currentTermIdx: currentTermIdx
          });
          message = `Page fetched, data loaded and parsed successfully for "${pageRequested.page}"`;
        } else {
          console.log(`No previous page to push into stack`);
        }
        setPageLoaded(pageRequested);
      } else {
        message = `Page fetch not yet requested`;
        setPageMessage(message);
      }
    }
  }, [
    // setPreviouslyLoadedPage,
    isPageContentFetched,
    pageLoaded,
    // setPageMessage,
    currentTermIdx,
    pageRequested,
    pageRequestType
  ]);
  // After page is loaded update currentTermIdx and previousPages stack
  useEffect(() => {
    if (pageRequested.page.length > 0 && pageLoaded.page.length > 0) {
      console.log(
        `@@page loaded: pageRequested=${pageRequested.page},pageLoaded=${pageLoaded.page}`
      );
      setIsPageContentFetched(false);
      if (
        pageRequested.page === pageLoaded.page &&
        pageRequested.currentTermIdx === pageLoaded.currentTermIdx
      ) {
        // setIsPageInitialized(true);
        if (pageLoaded.currentTermIdx < 0) {
          dispatch(Request.Cursor_gotoWordByIdx(0)); // default to first terminal
        } else {
          dispatch(Request.Cursor_gotoWordByIdx(pageLoaded.currentTermIdx));
        }
        let pageStack: IPageRequestItem[] = [];
        if (pageRequestType === PageRequestItemType.pop) {
          dispatch(Request.Page_popped());
          pageStack = [...previousPages];
          console.log(
            `isPageLoaded before pop ${dumpPageRequestItemsAsCsv(pageStack)}`
          );
          if (previousPages.length > 0) {
            pageStack = [...previousPages].slice(0, -1);
          }
          console.log(
            `isPageLoaded after pop ${dumpPageRequestItemsAsCsv(pageStack)}`
          );
        } else if (pageRequestType === PageRequestItemType.home) {
          dispatch(Request.Page_homed());
          pageStack = [];
        } else if (
          pageLoaded.page.length > 0 &&
          previouslyLoadedPage.page.length > 0 &&
          pageLoaded.page !== previouslyLoadedPage.page
        ) {
          console.log(
            `isPageLoaded before push ${dumpPageRequestItemsAsCsv(pageStack)}`
          );
          pageStack = [...previousPages, previouslyLoadedPage];
          ///////        setUserRequestedPage(PageRequestItemInitializer());
        } else {
          console.log(`unknown  ${dumpPageRequestItemsAsCsv(pageStack)}`);
          pageStack = [];
        }
        if (pageStack.length === 0) {
          dispatch(Request.Page_previousEnabled(false)); // ghost button
          dispatch(Request.Page_homeEnabled(false)); // ghost button
        } else {
          dispatch(Request.Page_previousEnabled(true));
          dispatch(Request.Page_homeEnabled(true));
        }
        setPreviousPages(pageStack);
        dispatch(Request.Page_loaded(true));
        setPageRequested(PageRequestItemInitializer());
        // setIsPageInitialized(true);
        setIsPageRequestInProgress(false);
        console.log(`@@page load completed`);
      }
    }
  }, [
    pageRequested,
    pageLoaded,
    dispatch,
    previouslyLoadedPage,
    previousPages,
    pageRequestType
    // setIsPageContentFetched,
    // setPageRequested,
    // setPreviousPages,
    // setIsPageRequestInProgress
  ]);

  useEffect(() => {
    if (previousPages.length === 0) {
      console.log(`previousPages is empty`);
    } else {
      console.log(`${dumpPageRequestItemsAsCsv(previousPages)}`);
    }
  }, [previousPages]);
  ////////////
  // Rendering
  ////////////
  console.log(pageMessage);
  dispatch(Request.Message_set(pageMessage));
  return (
    <PageContext.Provider value={pageContext}>
      <div className="page">
        <PageHeader title={pageContent === null ? "" : pageContent!.title} />
        <SettingsDialog isActive={isActive} hide={toggleDialog} />
        <NavBar
          headings={pageContent === null ? [] : pageContent!.headingList}
        />
        <Content content={pageContent!} />
        <PageFooter />
      </div>
    </PageContext.Provider>
  );
});
interface IContentPropsType {
  content: IPageContent;
}
export const Content = React.memo((props: IContentPropsType): any => {
  //  const userAppSelector = useAppDispatch();
  const currentSectionIdx: number = useAppSelector(
    store => store.cursor_sectionIdx
  );
  const message: string = useAppSelector(store => store.message_application);
  if (props.content === null) {
    return <div>{message}</div>;
  } else {
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
  }
});
