/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_page.tsx
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
import React from "react";
import "./App.css";
import { Request } from "./reducers";
import { useAppDispatch, useAppSelector, useDialog } from "./hooks";
import { useEffect, useState, useContext } from "react";
import { IPageContent, ISectionContent } from "./pageContentType";
import { CPageLists, PageContext } from "./pageContext";
import { SettingsContext, ISettingsContext } from "./settingsContext";
import { NavBar } from "./reactcomp_navbar";
import { PageHeader } from "./reactcomp_pageheader";
import { PageFooter } from "./reactcomp_pagefooter";
import { SettingsDialog } from "./reactcomp_settings";
import { SectionDispatcher } from "./reactcomps_sections";

export interface IPagePropsType {
  appName: string;
}
export const Page = React.memo((props: IPagePropsType) => {
  const [responseError, setResponseError] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<IPageContent | null>(null);
  const [pageContext, setPageContext] = useState<CPageLists | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState<boolean>(true);
  //  !(pageRequested !== undefined && pageRequested !== null && !pageLoaded)

  const { isActive, toggle } = useDialog();
  const fetchRequest = (page: string) => {
    fetch(page, { method: "GET", headers: { Accept: "application/json" } })
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
            setPageContent(data);
            message = `Changing page context for "${pageRequested}"`;
            if (pageContent !== undefined && pageContent !== null) {
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
                //                dispatch(Request.Page_loaded(true));
              } else {
                message = `Loading page context failed for "${pageRequested}"`;
              }
              dispatch(Request.StatusBar_Message_set(message));
              setIsPageLoaded(true);
            }
          } catch (e) {
            let message: string = (e as Error).message;
            message = `Encountered unexpected fetching error: ${message}`;
            dispatch(Request.StatusBar_Message_set(message));
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
  const pageRequested: string = useAppSelector(store => store.page_requested);
  const pageLoaded: boolean = useAppSelector(store => store.page_loaded);
  let message: string = "";
  useEffect(() => {
    message = `Requested page ${pageRequested} from ${distDir}`;
    console.log(message);
    setIsPageLoaded(
      !(pageRequested !== undefined && pageRequested !== null && !pageLoaded)
    );
    fetchRequest(distDir + pageRequested);
    dispatch(Request.StatusBar_Message_set(message));
    // }
  }, [pageRequested, pageLoaded]);
  useEffect(() => {
    if (!isPageLoaded) {
      dispatch(Request.Page_loaded(true));
      setIsPageLoaded(true);
    }
  }, [pageContent, pageContext]);

  if (pageLoaded) {
    message = `Loading page "${pageRequested}"`;
  } else if (responseError) {
    message = `Encountered response error while loading "${pageRequested}": ${responseError}`;
  } else if (parseError) {
    const syntaxError: string =
      "SyntaxError: Unexpected token < in JSON at position 0";
    if (syntaxError.indexOf(parseError) === 0) {
      message = `Encountered incompatible JSON format while loading for "${pageRequested}"`;
    } else {
      message = `Encountered parsing error while loading "${pageRequested}": ${parseError}`;
    }
  } else {
    message = `Waiting for page to load for "${pageRequested}"`;
  }
  console.log(message);
  dispatch(Request.StatusBar_Message_set(message));
  if (pageContext !== null) {
    return (
      <PageContext.Provider value={pageContext}>
        <div className="page">
          <PageHeader title={pageContent!.title} />
          <SettingsDialog isActive={isActive} hide={toggle} />
          <NavBar headings={pageContent!.headingList} />
          <Content content={pageContent!} />
          <PageFooter />
        </div>
      </PageContext.Provider>
    );
  } else {
    // no statusbar for initial load
    message = `Waiting to load "${pageRequested}"`;
    console.log(message);
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
