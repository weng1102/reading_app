/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_section_fillin.tsx
 *
 * Defines React front end functional components to support fillins feature.
 *
 *
 *
 * Version history:
 *
 **/
import React from "react";
import { Request } from "./reducers";
import { useEffect } from "react";
import "./App.css";
import {
  IFillinResponseItem,
  IFillinResponses,
  IFillinResponseItemInitializer,
  ISectionFillinItem,
  ISectionFillinVariant,
  ISectionFillinItemInitializer,
  SectionFillinLayoutType,
  SectionFillinSortOrder
} from "./pageContentType";
import { useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { CPageLists, PageContext } from "./pageContext";
import { SectionDispatcher, ISectionPropsType } from "./reactcomp_sections";
import { SectionFillinContext, cloneDeep } from "./fillinContext";
import resetButton from "./img/button_reset1.png";
import resetButtonGhosted from "./img/button_reset_ghosted.png";

export const Section_fillin = React.memo((props: ISectionPropsType): any => {
  console.log(`<Section_fillin />`);
  // copy of initial author's settings
  let fillin: ISectionFillinVariant = props.section
    .meta as ISectionFillinVariant;
  // state to support section fillins that can be changed versus the
  // pageLists.fillinList that is used to initialize the state and
  // considered read only. Ned to account for (future) reset of attributes to
  // author defaults. (Nice to have)
  const [sectionFillin, setSectionFillin] = useState(
    ISectionFillinItemInitializer()
  );
  const pageLists: CPageLists = useContext(PageContext)!;
  if (
    !sectionFillin.loaded &&
    sectionFillin.responses.length === 0 &&
    fillin.sectionFillinIdx >= 0 &&
    fillin.sectionFillinIdx <= pageLists.fillinList.length
  ) {
    // initialize state with deep copy to protect integrity of fillinlist
    // within pageLists. Check integrity by comparing the
    // fillin.sectionFillinIdx with the that from the fillinList[idx].idx
    let clone: ISectionFillinItem = cloneDeep(
      pageLists.fillinList[fillin.sectionFillinIdx]
    );
    clone.loaded = true;
    clone.modified = false;
    setSectionFillin(clone);
  }
  return (
    <SectionFillinContext.Provider value={{ sectionFillin, setSectionFillin }}>
      <Responses active={props.active} section={props.section} />
      <Prompts active={props.active} section={props.section} />
    </SectionFillinContext.Provider>
  );
});
const Heading = React.memo((props: ISectionPropsType): any => {
  console.log(`<Heading />`);
  let fillin: ISectionFillinVariant = props.section
    .meta as ISectionFillinVariant;
  return (
    <>
      <div className="fillin-prompts-label">{fillin.promptsLabel}</div>
      <div className="fillin-responses-label">{fillin.responsesLabel}</div>
    </>
  );
});
const Responses = React.memo((props: ISectionPropsType): any => {
  console.log(`<Responses />`);
  // Strictly manages the modfiable raw (unformatted) response copied
  // from the pageList.fillinList to the sectionContext that
  // maps the fillin_showTerminalIdx reducer state back using
  // terminalList[fillin_terminalIdx].fillin.{sectionIdx | responseIdx}
  // when decrementing and resetting the individual values asynchronously.
  // Hence, the order of the raw response list cannot be altered.
  // Decrementing and user resetting will be managed by callbacks/useEffect()
  // within this component asynchronously.
  let fillin: ISectionFillinVariant = props.section
    .meta as ISectionFillinVariant;
  let pageLists: CPageLists = useContext(PageContext)!;
  const sectionContext = useContext(SectionFillinContext);
  const showTerminalIdx = useAppSelector(store => store.fillin_showTerminalIdx);
  let resetSectionFillinIdx = useAppSelector(
    store => store.fillin_resetSectionIdx
  );
  let dispatch = useAppDispatch();
  // Every time the section changes (props.section) or sectionContext
  // deep-copy context holds user modifiable attributes groupDuplicates,
  //  etc. Should these attributes get reset when context changes?,
  // responses only. Need a means to reset just the formatting attributes
  // deep copy (maintaining immutability) author's attributes as defaults AND
  // the indexing of raw responses (w/o applying attrubutes e.g., grouping,
  //  sorting) to formatted responses list. Formatting is performed within
  // these functional components.
  //
  // Keep raw responses in order so that fillin_showTerminalIdx references the
  // correct response. Allow the ResponseItems component to
  // remove duplicates and sort changes based on attributes
  if (!sectionContext.sectionFillin.loaded) {
    let clone: ISectionFillinItem = cloneDeep(
      sectionContext.sectionFillin,
      false
    );
    sectionContext.setSectionFillin(cloneDeep(clone));
  }
  const [responses, setResponses] = useState(
    cloneDeep(sectionContext.sectionFillin.responses)
  );
  const sectionFillin: ISectionFillinItem = sectionContext.sectionFillin;
  const sectionFillinIdx: number = sectionFillin.idx;

  useEffect(() => {
    console.log(`<Responses /> useEffect(showTerminalIdx=${showTerminalIdx})`);
    // decrements reference count when fillin_showTerminalidx state changes
    if (
      showTerminalIdx >= 0 &&
      showTerminalIdx < pageLists.terminalList.length
    ) {
      const fillinSectionIdx =
        pageLists.terminalList[showTerminalIdx].fillin.sectionIdx;
      const responseIdx =
        pageLists.terminalList[showTerminalIdx].fillin.responseIdx;
      if (
        fillinSectionIdx === fillin.sectionFillinIdx &&
        responseIdx >= 0 &&
        responseIdx < responses.length
      ) {
        const resTemp: IFillinResponses = cloneDeep(responses);
        resTemp[responseIdx].referenceCount =
          responses[responseIdx].referenceCount - 1;
        setResponses(resTemp);
        let clone: ISectionFillinItem = cloneDeep(sectionContext.sectionFillin);
        clone.modified = true;
        sectionContext.setSectionFillin(clone);
      } else {
        console.log(
          `encountered inconsistent idxs fillinSectionIdx=${fillinSectionIdx} responseIdx=${responseIdx}`
        );
      }
    }
  }, [showTerminalIdx]);
  useEffect(() => {
    console.log(
      `<Responses /> useEffect(resetSectionFillinIdx=${resetSectionFillinIdx})`
    );
    if (resetSectionFillinIdx === sectionFillinIdx) {
      let clone: ISectionFillinItem = cloneDeep(sectionContext.sectionFillin);
      clone.modified = false;
      sectionContext.setSectionFillin(clone);
      setResponses(cloneDeep(sectionContext.sectionFillin.responses));
      dispatch(Request.Fillin_resetSection(-1));
    }
  }, [resetSectionFillinIdx]);

  if (
    sectionContext.sectionFillin.loaded &&
    sectionFillinIdx >= 0 &&
    sectionFillinIdx < pageLists.fillinList.length &&
    pageLists !== null &&
    sectionContext.sectionFillin.layout !== SectionFillinLayoutType.none
  ) {
    return (
      <>
        <div className="fillin"></div>
        <div className="fillin-responses-label">{fillin.responsesLabel}</div>
        <div className="fillin-responses-grid-container">
          <ResponseItems responses={responses} />
          <div className="fillin-responses-grid-controls">
            <ResponseControls />
          </div>
        </div>
      </>
    );
  } else {
    return <></>;
  }
});
interface IResponseControlsPropsType {}
const ResponseControls = (props: IResponseControlsPropsType): any => {
  console.log(`<ResponseControls />`);
  return <ResetButton />;
};
interface IResponseItemsPropsType {
  responses: IFillinResponses;
}
const ResponseItems = (props: IResponseItemsPropsType): any => {
  console.log(`<ResponseItems />`);
  const sectionContext = useContext(SectionFillinContext);
  let responses: IFillinResponseItem[] = cloneDeep(props.responses);
  let uniqueResponses: IFillinResponseItem[] = [];
  if (sectionContext.sectionFillin.unique) {
    responses.filter(item => {
      let duplicateIdx = uniqueResponses.findIndex(
        response => response.content === item.content
      );
      if (duplicateIdx < 0) {
        console.log(`dup not found idx=${duplicateIdx}`);
        uniqueResponses.push(
          IFillinResponseItemInitializer(
            item.content,
            item.category,
            item.referenceCount
          )
        );
      } else {
        uniqueResponses[duplicateIdx].referenceCount += item.referenceCount;
      }
    });
  }
  if (
    sectionContext.sectionFillin.sortOrder ===
    SectionFillinSortOrder.alphabetical
  ) {
    uniqueResponses = uniqueResponses.sort((a, b) =>
      a.content > b.content ? 1 : -1
    );
  } else if (
    sectionContext.sectionFillin.sortOrder === SectionFillinSortOrder.random
  ) {
    const shuffle = (array: IFillinResponseItem[]) => {
      const newArray: IFillinResponseItem[] = [...array];
      newArray.reverse().forEach((item, index) => {
        const j = Math.floor(Math.random() * (index + 1));
        [newArray[index], newArray[j]] = [newArray[j], newArray[index]];
      });
      return newArray;
    };
    uniqueResponses = shuffle(uniqueResponses);
  }
  if (sectionContext.sectionFillin.layout === SectionFillinLayoutType.grid) {
    return <ResponseItemsGrid responses={uniqueResponses} />;
  } else if (
    sectionContext.sectionFillin.layout === SectionFillinLayoutType.list
  ) {
    return <ResponsesList responses={uniqueResponses} />;
  } else {
    return <></>;
  }
};
const ResponseItemsGrid = (props: IResponseItemsPropsType): any => {
  console.log(`<ResponseItemsGrid />`);
  const sectionContext = useContext(SectionFillinContext);
  const columnCount: string = sectionContext.sectionFillin.gridColumns.toString();
  return (
    <div
      className="fillin-responses-grid-itemlist"
      style={{ gridTemplateColumns: `repeat(${columnCount}, auto)` }}
    >
      <ResponsesGridItems responses={props.responses} />
    </div>
  );
};
const ResponsesList = (props: IResponseItemsPropsType): any => {
  console.log(`<ResponsesList />`);

  return (
    <ul>
      <ResponsesListItems responses={props.responses} />
    </ul>
  );
};
const ResponsesListItems = (props: IResponseItemsPropsType): any => {
  console.log(`<ResponsesListItems />`);
  return props.responses.map(
    (response: IFillinResponseItem, keyvalue: number) => (
      <li key={keyvalue}>
        <div
          className={
            response.referenceCount === 0
              ? "fillin-responses-grid-item-omitted"
              : ""
          }
        >
          {response.content} ({response.referenceCount})
        </div>
      </li>
    )
  );
};
const ResponsesGridItems = (props: IResponseItemsPropsType): any => {
  console.log(`<ResponsesGridItems />`);
  const sectionContext = useContext(SectionFillinContext);
  let responses: IFillinResponses = props.responses;
  return responses.map((response: IFillinResponseItem, keyvalue: number) => (
    <div
      className={
        response.referenceCount === 0
          ? "fillin-responses-grid-item-omitted"
          : "fillin-responses-grid-item" + " fillin-responses-grid-item"
      }
    >
      <ResponseContent response={response} />
      &nbsp;
      <ResponseReferenceCount response={response} />
    </div>
  ));
};
interface IResponsePropsType {
  response: IFillinResponseItem;
}
const ResponseContent = (props: IResponsePropsType) => {
  console.log(`<ResponseContent />`);
  return <span>{props.response.content}</span>;
};
const ResponseReferenceCount = (props: IResponsePropsType) => {
  console.log(`<ResponseReferenceCount />`);
  const sectionContext = useContext(SectionFillinContext);
  console.log(`showRefCnt=${sectionContext.sectionFillin.showReferenceCount}`);
  if (
    !sectionContext.sectionFillin.showReferenceCount ||
    props.response.referenceCount <= 1
  ) {
    return <span></span>;
  } else {
    return <span>({props.response.referenceCount})</span>;
  }
};
const Prompts = React.memo((props: ISectionPropsType): any => {
  console.log(`<Prompts />`);
  // let dispatch = useAppDispatch();
  let fillin: ISectionFillinVariant = props.section
    .meta as ISectionFillinVariant;
  let prompts = fillin.prompts;
  let className: string = "fillin-prompts-item";
  return (
    <>
      <div className="fillin-prompts-label">{fillin.promptsLabel}</div>
      <div
        className="fillin-prompts-item"
        style={{ columns: `${fillin.promptColumns}` }}
      >
        {prompts.map((prompt, keyvalue: number) => (
          <SectionDispatcher
            key={keyvalue}
            active={props.active}
            section={prompt}
          />
        ))}
      </div>
    </>
  );
});
interface IResetButtonPropsType {
  sectionFillinIdx: number;
}
export const ResetButton = () => {
  console.log(`<ResetButton />`);
  const sectionContext = useContext(SectionFillinContext);
  const sectionFillinIdx: number = sectionContext.sectionFillin.idx;
  const modified: boolean = sectionContext.sectionFillin.modified;
  const allowReset: boolean = sectionContext.sectionFillin.allowReset;
  let dispatch = useAppDispatch();

  const onButtonClick = () => {
    if (sectionContext.sectionFillin.modified && allowReset) {
      dispatch(Request.Fillin_resetSection(sectionFillinIdx));
      console.log(`dispatch fillin_resetSection`);
    }
  };
  let resetButtonState: string =
    sectionContext.sectionFillin.modified && allowReset
      ? resetButton
      : resetButtonGhosted;
  return (
    <div style={{ width: "30px", height: "30px" }}>
      <img
        className="icon"
        alt="reset"
        src={resetButtonState}
        title="reset response prompts"
        onClick={() => onButtonClick()}
      />
    </div>
  );
};
interface IToggleButtonPropsType {
  sectionFillinIdx: number;
  toggleType: SectionFillinTogglesType;
}
const enum SectionFillinTogglesType {
  sortOrder = 0,
  groupDuplicates,
  showReferenceCount
}
export const ToggleButton = (props: IToggleButtonPropsType) => {
  console.log(`<ToggleButton />`);
  let buttonIcon: string;
  switch (props.toggleType) {
    case SectionFillinTogglesType.sortOrder:
      buttonIcon = "abc";
      break;
    case SectionFillinTogglesType.groupDuplicates:
      break;
    case SectionFillinTogglesType.showReferenceCount:
      break;
    default:
  }
};
