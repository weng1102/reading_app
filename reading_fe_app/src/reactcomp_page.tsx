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
 *
 * Even though reducer state tracks both the Requested and pageContext
 * changes, internal component state variable requestedPage, isPageFetched and
 *  loadedPage track when new load is requested, fetched and loaded.
 *
 * Request states:
 *  1) Determine userRequestedPage based on change to reducer states:
 *    a) pageHomeRequested, or
 *    b) pagePopRequested, or
 *    c) userPageRequested
 *
 *  2) Set requestedPage to be fteched based on change to pageHomeRequested,
 *     pagePopRequested, or userRequestedPage
 *
 *  3) fetch context and content
 *
 * The content is not rendered until the context and content are fetched
 * and parsed successfully to prevent needless rerendering of <Content>
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector, useDialog } from "./hooks";
import { useEffect, useState, useContext } from "react";
import {
  IDX_INITIALIZER,
  IPageContent,
  IPageRequestItem,
  ISectionContent,
  // LinkIdxDestinationType,
  PageContentVersion,
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
  const [userRequestedPage, setUserRequestedPage] = useState<IPageRequestItem>(
    PageRequestItemInitializer()
  );
  const [requestedPage, setRequestedPage] = useState<IPageRequestItem>(
    PageRequestItemInitializer()
  );
  const [previouslyLoadedPage, setPreviouslyLoadedPage] = useState<
    IPageRequestItem
  >(PageRequestItemInitializer());
  const [loadedPage, setLoadedPage] = useState<IPageRequestItem>(
    PageRequestItemInitializer()
  );
  const [responseError, setResponseError] = useState<string>("");
  const [parseError, setParseError] = useState<string>("");
  const [pageContext, setPageContext] = useState<CPageLists | null>(null);
  const [pageContent, setPageContent] = useState<IPageContent | null>(null);
  const [isPageFetched, setIsPageFetched] = useState<boolean>(false);
  const [pageMessage, setPageMessage] = useState<string>("");
  const [previousPages, setPreviousPages] = useState<IPageRequestItem[]>([]);
  const { isActive, toggleDialog } = useDialog();

  console.log = () => {};
  const fetchRequest = (page: string) => {
    setIsPageFetched(false);
    fetch(page, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    })
      .then(
        response => {
          if (!response.ok)
            setResponseError(`HTTP status code ${response.status} for ${page}`);
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
                `Mismatching application and json formats. Expected ${PageContentVersion} but encountered ${data.version} in content`
              );
            } else {
              let content: IPageContent = data as IPageContent;
              message = `Parsing json for "${requestedPage.page}"`;
              dispatch(Request.Message_set(message));
              // setPageContext(null);
              let pageLists: CPageLists = new CPageLists(
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
              setIsPageFetched(true);
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
  };
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
  const dispatch = useAppDispatch();

  let message: string = "";
  const settingsContext: ISettingsContext = useContext(SettingsContext)!;
  const distDir: string = settingsContext.settings.config.distDir;
  const homePage: string = `homepage_${settingsContext.settings.config.homePage}`;
  const pageLoaded: boolean = useAppSelector(store => store.page_loaded);

  // triggers to render
  const userPageRequested: IPageRequestItem = useAppSelector(
    store => store.page_requested
  );
  const pagePopRequested: boolean = useAppSelector(
    store => store.page_pop_requested
  );
  const pageHomeRequested: boolean = useAppSelector(
    store => store.page_home_requested
  );
  const currentTermIdx: number = useAppSelector(
    store => store.cursor_terminalIdx
  );
  const reducerPageContext = useAppSelector(store => store.pageContext);

  useEffect(() => {
    setPageMessage(parseError);
  }, [parseError]);
  useEffect(() => {
    setPageMessage(responseError);
  }, [responseError]);

  // Set userRequestedPage based on userPageRequested
  useEffect(() => {
    if (
      userPageRequested.page.length > 0 &&
      userPageRequested.page !== userRequestedPage.page &&
      userPageRequested.page !== requestedPage.page &&
      userPageRequested.page !== loadedPage.page
    ) {
      // userPageRequested cannot be same as the immediately previous
      // userRequestedPage especially when immediately preceded by
      // pageHomeRequested or pagePopRequested requests.
      setUserRequestedPage(userPageRequested);
    }
  }, [userPageRequested]);

  // Before page is fetched, determine requested page based on user event
  useEffect(() => {
    // Sets requestedPage given changes to pagePopRequested, pageHomeRequested,
    // userRequestedPage
    if (pageHomeRequested) {
      setRequestedPage(PageRequestItemInitializer(homePage));
      dispatch(Request.Page_loaded(false));
      if (loadedPage.page !== homePage) {
        message = "**Requesting Home page";
      } else {
        message = "Home page already loaded";
      }
    } else if (pagePopRequested) {
      if (previousPages.length > 0) {
        setRequestedPage(previousPages.slice(-1)[0]);
        dispatch(Request.Page_loaded(false));
        message = `Requesting pop to "${previousPages.slice(-1)[0].page}"`;
      } else {
        message = `Warning: No previous page to which to pop`;
      }
    } else {
      // user page requested
      if (
        userRequestedPage.page.length > 0 &&
        userRequestedPage.page !== loadedPage.page
      ) {
        message = `**Requesting page "${userRequestedPage.page}"`;
        setRequestedPage(userRequestedPage);
        dispatch(Request.Page_loaded(false));
      } else if (userRequestedPage.page.length === 0) {
        // userRequestPage is set to "" explicitly and purposely ignored
        // to prevent retriggering when pop and home page requests are
        // reset to false.
      } else if (userRequestedPage.page === loadedPage.page) {
        message = `Warning: Attempting to reload loaded page ${userRequestedPage.page}`;
      } else {
        message = `Warning: Unexpected request state where requested page =""${requestedPage}"`;
      }
    }
    setPageMessage(message);
    console.log(message);
  }, [userRequestedPage, pagePopRequested, pageHomeRequested]);

  // After requestPage change, Fetch page
  useEffect(() => {
    if (!pageLoaded && requestedPage.page.length > 0) {
      setPageMessage(`Fetching ${requestedPage.page}`);
      console.log(`**Fetching "${requestedPage.page}"`);
      let page: string = distDir + requestedPage.page + ".json";
      fetchRequest(page);
    }
  }, [requestedPage]);

  // After page is fetched but before page is loaded, parse and loaded
  // content and context
  useEffect(() => {
    // After fetch and pageContext load into reducer, mark page loaded
    if (isPageFetched && reducerPageContext === pageContext) {
      if (loadedPage.page.length > 0) {
        setPreviouslyLoadedPage({
          page: loadedPage.page,
          currentTermIdx: currentTermIdx
        });
      }
      setLoadedPage(requestedPage);
      dispatch(Request.Page_loaded(true));
      setPageMessage(`Page data loaded and parsed successfully`);
    } else {
      setPageMessage(`Reducer page context not set yet`);
    }
  }, [isPageFetched, reducerPageContext, pageContext]);

  // After page is loaded update previousPages stack
  useEffect(() => {
    if (pageLoaded) {
      if (requestedPage.currentTermIdx < 0) {
        dispatch(Request.Cursor_gotoWordByIdx(0)); // default to first terminal
      } else {
        dispatch(Request.Cursor_gotoWordByIdx(requestedPage.currentTermIdx));
      }
      let pageStack: IPageRequestItem[] = [];
      if (pagePopRequested) {
        dispatch(Request.Page_popped());
        pageStack = [...previousPages];
        console.log(
          `pageLoaded before pop ${dumpPageRequestItemsAsCsv(pageStack)}`
        );
        if (previousPages.length > 0) {
          pageStack = [...previousPages].slice(0, -1);
        }
        console.log(
          `pageLoaded after pop ${dumpPageRequestItemsAsCsv(pageStack)}`
        );
      } else if (pageHomeRequested) {
        dispatch(Request.Page_homed());
        pageStack = [];
      } else if (
        loadedPage.page.length > 0 &&
        previouslyLoadedPage.page.length > 0 &&
        loadedPage.page !== previouslyLoadedPage.page
      ) {
        console.log(
          `pageLoaded before push ${dumpPageRequestItemsAsCsv(pageStack)}`
        );
        pageStack = [...previousPages, previouslyLoadedPage];
        setUserRequestedPage(PageRequestItemInitializer());
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
    }
  }, [pageLoaded]);

  useEffect(() => {
    if (previousPages.length === 0) {
      console.log(`previousPages is empty`);
    } else {
      console.log(`${dumpPageRequestItemsAsCsv(previousPages)}`);
    }
  }, [previousPages]);

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
