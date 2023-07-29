/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_section_fillin.tsx
 *
 * Defines React front end functional components to support fillins feature.
 *
 * - static presentation data is stored in props
 * - presentation formatting data stored in local state
 *    e.g., show/hide reset, show/hide help control
 * - dynamic presentation data is stored in context e.g., responses in
 *   prompts visible
 *
 *
 * Version history:
 *
 **/
import React from "react";
import { Request } from "./reducers";
import { useEffect } from "react";
//import "./App.css";
import {
  IFillinResponseItem,
  IFillinResponses,
  IFillinResponseItemInitializer,
  //ISectionFillinHelpSettingInitializer,
  ISectionFillinItem,
  ISectionFillinSetting,
  ISectionFillinVariant,
  ISectionFillinItemInitializer,
  PartOfSpeechEnumType,
  SectionFillinPresetInfo,
  SectionFillinPresetLevel,
  //SectionFillinHelpPresetName,
  SectionFillinLayoutType,
  SectionFillinResponsesProgressionEnum,
  // testtest,
  SectionFillinSortOrder
} from "./pageContentType";
import showSliderButton from "./img/button_responses_show.png";
import hideSliderButton from "./img/button_responses_hide.png";
import moreSliderButton from "./img/button_responses more.png";
import lessSliderButton from "./img/button_responses less.png";
import moreSliderDisabledButton from "./img/button_responses_more_disabled.png";
import lessSliderDisabledButton from "./img/button_responses_less_disabled.png";
import { useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { CPageLists, PageContext } from "./pageContext";
import { SectionDispatcher, ISectionPropsType } from "./reactcomp_sections";
import { SectionHeading } from "./reactcomp_section_fillin_heading";
import { SectionFillinContext, cloneDeep } from "./fillinContext";
import resetButton from "./img/button_reset1.png";
import resetButtonGhosted from "./img/button_reset_ghosted.png";
import taggingButton from "./img/button_tagging.png";
import taggingButtonDisabled from "./img/button_tagging_disabled.png";
import taggingButtonGhosted from "./img/button_tagging_ghosted.png";
import ResponsesLayoutGridButton from "./img/button_responsesgrid.png";
import ResponsesLayoutCsvButton from "./img/button_responsesCsv.png";
import ResponsesCategoryShowButton from "./img/button_categorize_show.png";
import ResponsesCategoryHideButton from "./img/button_categorize_hide.png";
import ResponsesCategoryDisabledButton from "./img/button_categorize_ghosted.png";
export const SectionFillin = React.memo((props: ISectionPropsType): any => {
  // copy of initial author's settings
  const fillinContext = useContext(SectionFillinContext);

  // const sectionFillin: ISectionFillinItem = fillinContext.sectionFillin;
  let fillinContent: ISectionFillinVariant = props.section
    .meta as ISectionFillinVariant;
  // state to support section fillins that can be changed versus the
  // pageLists.fillinList that is used to initialize the state and
  // considered read only. Ned to account for (future) reset of attributes to
  // author defaults. (Nice to have)
  const [sectionFillin, setSectionFillin] = useState(
    ISectionFillinItemInitializer(
      undefined,
      undefined,
      undefined,
      fillinContent.authorSetting,
      fillinContent.authorSetting
    )
  );
  const [resetRequested, setResetRequested] = useState(
    fillinContext.sectionFillin.allowReset
  );
  const pageLists: CPageLists = useContext(PageContext)!;

  // useEffect(() => {
  //   if (fillinContext.sectionFillin.allowReset && resetRequested) {
  //     setResetRequested(false);
  //   }
  // }, [resetRequested]);
  let dispatch = useAppDispatch();
  // for (const value in SectionFillinResponsesProgressionEnum) {
  //   console.log(`ResponsesProgressionName=${value}`);
  // }
  if (
    !sectionFillin.loaded &&
    sectionFillin.responses.length === 0 &&
    fillinContent.sectionFillinIdx >= 0 &&
    fillinContent.sectionFillinIdx <= pageLists.fillinList.length
  ) {
    // Initialize state with deep copy to protect integrity of fillinlist
    // within pageLists. Check integrity by comparing the
    // fillin.sectionFillinIdx with the that from the fillinList[idx].idx
    let clone: ISectionFillinItem = cloneDeep(
      pageLists.fillinList[fillinContent.sectionFillinIdx]
    );
    if (
      !(clone.presetLevel in SectionFillinPresetLevel) ||
      clone.presetLevel === SectionFillinPresetLevel.override
    ) {
      clone.currentSetting = { ...clone.authorSetting };
    } else {
      /////////////      clone.currentSetting = SectionFillinPresetInfo[clone.presetLevel];
    }
    clone.loaded = true;
    clone.modified = false;
    setSectionFillin(clone);
  }

  // useEffect(() => {
  //   console.log(
  //     `####fillinContext.sectionFillin.showTags=${fillinContext.sectionFillin.showTags} for sectionIdx=`
  //   );
  // }, [fillinContext.sectionFillin]);

  return (
    <SectionFillinContext.Provider value={{ sectionFillin, setSectionFillin }}>
      <SectionHeading active={props.active} section={props.section} />
      <Responses active={props.active} section={props.section} />
      <Prompts active={props.active} section={props.section} />
    </SectionFillinContext.Provider>
  );
});
const Responses = React.memo((props: ISectionPropsType): any => {
  // Strictly manages the modfiable raw (unformatted) response copied
  // from the pageList.fillinList to the fillinContext that
  // maps the fillin_showTerminalIdx reducer state back using
  // terminalList[fillin_terminalIdx].fillin.{sectionIdx | responseIdx}
  // when decrementing and resetting the individual values asynchronously.
  // Hence, the order of the raw response list cannot be altered.
  // Decrementing and user resetting will be managed by callbacks/useEffect()
  // within this component asynchronously.
  let fillinContent: ISectionFillinVariant = props.section
    .meta as ISectionFillinVariant;
  let pageLists: CPageLists = useContext(PageContext)!;
  const fillinContext = useContext(SectionFillinContext);
  const showTerminalIdx = useAppSelector(store => store.fillin_showTerminalIdx);
  const resetSectionFillinIdx = useAppSelector(
    store => store.fillin_resetSectionIdx
  );
  let dispatch = useAppDispatch();
  // Every time the section changes (props.section) or fillinContext
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
  if (!fillinContext.sectionFillin.loaded) {
    let clone: ISectionFillinItem = cloneDeep(
      fillinContext.sectionFillin,
      false
    );
    fillinContext.setSectionFillin(clone);
  }
  const [responses, setResponses] = useState(
    cloneDeep(fillinContext.sectionFillin.responses)
  );
  const sectionFillin: ISectionFillinItem = fillinContext.sectionFillin;
  const sectionFillinIdx: number = sectionFillin.idx;

  useEffect(() => {
    //console.log(`<Responses /> useEffect(showTerminalIdx=${showTerminalIdx})`);
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
        fillinSectionIdx === fillinContent.sectionFillinIdx &&
        responseIdx >= 0 &&
        responseIdx < responses.length
      ) {
        const resTemp: IFillinResponses = cloneDeep(responses);
        resTemp[responseIdx].referenceCount =
          resTemp[responseIdx].referenceCount - 1;
        setResponses(resTemp);
        let clone: ISectionFillinItem = cloneDeep(
          fillinContext.sectionFillin,
          true
        );
        fillinContext.setSectionFillin(clone);
      } else {
        console.log(`no clone`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTerminalIdx, pageLists.terminalList, fillinContent.sectionFillinIdx]);
  useEffect(() => {
    if (resetSectionFillinIdx === fillinContext.sectionFillin.idx) {
      let clone: ISectionFillinItem = cloneDeep(
        fillinContext.sectionFillin,
        false
      );
      fillinContext.setSectionFillin(clone);
      setResponses(cloneDeep(fillinContext.sectionFillin.responses));
    }
  }, [resetSectionFillinIdx, dispatch, fillinContext.sectionFillin.idx]);
  if (
    fillinContext.sectionFillin.loaded &&
    sectionFillinIdx >= 0 &&
    sectionFillinIdx < pageLists.fillinList.length &&
    pageLists !== null &&
    fillinContext.sectionFillin.currentSetting.progressionOrder !==
      SectionFillinResponsesProgressionEnum.hidden
  ) {
    return (
      <>
        <ResponsesDescription />
        <ResponsesSelect responses={responses} />
      </>
    );
  } else {
    return <></>;
  }
});
interface IResponseItemsPropsType {
  responses: IFillinResponses;
}
interface IResponseSelectPropsType {
  responses: IFillinResponses;
}
interface IResponseSelectByTagPropsType {
  tag: string;
  responses: IFillinResponses;
}
const ResponsesDescription = () => {
  const fillinContext = useContext(SectionFillinContext);
  if (
    fillinContext.sectionFillin.currentSetting.progressionOrder === undefined ||
    fillinContext.sectionFillin.currentSetting.progressionOrder ===
      SectionFillinResponsesProgressionEnum.hidden
  ) {
    return <></>;
  } else {
    let responsesLabel: string = "Responses displayed";
    let withPromptTags: string = fillinContext.sectionFillin.currentSetting
      .showPromptTags
      ? "prompt"
      : "";
    let withResponseTags: string = fillinContext.sectionFillin.currentSetting
      .showResponseTags
      ? "response"
      : "";
    let groupedBy: string =
      fillinContext.sectionFillin.currentSetting.groupByTags &&
      fillinContext.sectionFillin.currentSetting.showResponseTags
        ? ", grouped by tags"
        : "";
    let tagDescription: string =
      withPromptTags.length + withPromptTags.length === 0
        ? ""
        : ` with ${withPromptTags} ${
            withResponseTags.length > 0 ? "and" : ""
          } ${withResponseTags} tagged`;
    responsesLabel = `${responsesLabel} ${fillinContext.sectionFillin.currentSetting.progressionOrder} as  ${fillinContext.sectionFillin.currentSetting.layout}${groupedBy} ${tagDescription}`;
    return <div className="fillin-responses-label">{responsesLabel}</div>;
  }
};
const ResponsesSelect = (props: IResponseItemsPropsType): any => {
  // shapes responses => uniqueness, sort order, grouping
  // if groupByTags then emit multiple grouping
  // else emit sinble grouping
  const fillinContext = useContext(SectionFillinContext);
  let responses: IFillinResponseItem[] = cloneDeep(props.responses);
  let modified: boolean = fillinContext.sectionFillin.modified;
  let selectedResponses: IFillinResponseItem[] = [];

  if (fillinContext.sectionFillin.currentSetting.unique) {
    responses.filter(item => {
      let duplicateIdx = selectedResponses.findIndex(
        response => response.content === item.content
      );
      if (duplicateIdx < 0) {
        selectedResponses.push(
          IFillinResponseItemInitializer(
            item.content,
            item.tag,
            item.referenceCount
          )
        );
      } else {
        selectedResponses[duplicateIdx].referenceCount += item.referenceCount;
      }
    });
  }
  // unique, sorted responses, sorted by responses tags then responses
  // inline call filter.sort.sort
  if (
    fillinContext.sectionFillin.currentSetting.progressionOrder ===
    SectionFillinResponsesProgressionEnum.alphabetical
  ) {
    selectedResponses = selectedResponses.sort((a, b) =>
      a.content.toLowerCase() > b.content.toLowerCase() ? 1 : -1
    );
  } else if (
    fillinContext.sectionFillin.currentSetting.progressionOrder ===
    SectionFillinResponsesProgressionEnum.random
  ) {
    const shuffle = (array: IFillinResponseItem[]) => {
      const newArray: IFillinResponseItem[] = [...array];
      newArray.reverse().forEach((item, index) => {
        const j = Math.floor(Math.random() * (index + 1));
        [newArray[index], newArray[j]] = [newArray[j], newArray[index]];
      });
      return newArray;
    };
    selectedResponses = shuffle(selectedResponses);
  }
  if (
    fillinContext.sectionFillin.currentSetting.layout ===
    SectionFillinLayoutType.grid
  ) {
    return (
      <div className="fillin-responses-grid-container">
        <ResponsesSelectGrid responses={selectedResponses} />
      </div>
    );
  } else if (
    fillinContext.sectionFillin.currentSetting.layout ===
    SectionFillinLayoutType.list
  ) {
    return <ResponsesList responses={selectedResponses} />;
  } else if (
    fillinContext.sectionFillin.currentSetting.layout ===
    SectionFillinLayoutType.csv
  ) {
    return (
      <div className="fillin-responses-csv-container">
        <ResponsesSelectCsvItems responses={selectedResponses} />
      </div>
    );
  } else {
    return <></>;
  }
};
const ResponsesSelectGrid = (props: IResponseSelectPropsType): any => {
  // includes heading and responses grid section
  const fillinContext = useContext(SectionFillinContext);
  const columnCount: string = fillinContext.sectionFillin.currentSetting.gridColumns.toString();
  if (
    fillinContext.sectionFillin.currentSetting.showResponseTags &&
    fillinContext.sectionFillin.currentSetting.groupByTags
  ) {
    return (
      <>
        {fillinContext.sectionFillin.tags.map(
          (tag: string, keyvalue: number) => (
            <div
              key={keyvalue}
              className="fillin-responses-grid-itemlist"
              style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
            >
              <div className="fillin-responses-grid-tag">{tag}:</div>
              <ResponsesSelectGridItems
                responses={props.responses.filter(
                  response => response.tag === tag
                )}
              />
            </div>
          )
        )}
      </>
    );
  } else {
    return (
      <>
        <div
          className="fillin-responses-grid-itemlist"
          style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
        >
          <ResponsesSelectGridItems responses={props.responses} />
        </div>
      </>
    );
  }
};
const ResponsesSelectGridItems = (props: IResponseSelectPropsType): any => {
  const fillinContext = useContext(SectionFillinContext);
  // const columnCount: string = fillinContext.sectionFillin.currentSetting.gridColumns.toString();
  return <ResponsesGridItems responses={props.responses} />;
};
// const ResponsesItemsGrid = (props: IResponseItemsPropsType): any => {
//   // console.log(`<ResponseItemsGrid />`);
//   const fillinContext = useContext(SectionFillinContext);
//   const columnCount: string = fillinContext.sectionFillin.currentSetting.gridColumns.toString();
//   return (
//     <div
//       className="fillin-responses-grid-itemlist"
//       style={{ gridTemplateColumns: `repeat(${columnCount}, auto)` }}
//     >
//       <ResponsesSelectGridItems responses={props.responses} />
//     </div>
//   );
// };
const ResponsesList = (props: IResponseItemsPropsType): any => {
  // console.log(`<ResponsesList />`);
  return (
    <ul>
      <ResponsesListItems responses={props.responses} />
    </ul>
  );
};
const ResponsesSelectList = (props: IResponseSelectPropsType): any => {
  // console.log(`<ResponsesList />`);
  return (
    <ul>
      <ResponsesListItems responses={props.responses} />
    </ul>
  );
};
// const ResponsesSelectCsvList = (props: IResponseSelectPropsType): any => {
//   // console.log(`<ResponsesCsv />`);
//   return <ResponsesSelectCsvItems responses={props.responses} />;
// };
const ResponsesSelectCsvItems = (props: IResponseSelectPropsType): any => {
  // create csv string of spans
  // console.log(`<ResponsesCsv />`);
  const fillinContext = useContext(SectionFillinContext);
  let lastIdx: number = props.responses.length - 1;
  if (
    fillinContext.sectionFillin.currentSetting.showResponseTags &&
    fillinContext.sectionFillin.currentSetting.groupByTags
  ) {
    return (
      <>
        {fillinContext.sectionFillin.tags.map(
          (tag: string, keyValue: number) => (
            <>
              <div className="fillin-responses-csv-itemlist" key={keyValue}>
                <span className="fillin-responses-csv-tag">
                  {tag}:<span> </span>
                </span>
                {props.responses
                  .filter(response => response.tag === tag)
                  .map((response: IFillinResponseItem, tagOrdinal: number) => (
                    <>
                      <span
                        className={
                          response.referenceCount === 0
                            ? "fillin-responses-item-omitted fillin-responses-csv-item"
                            : "fillin-responses-csv-item"
                        }
                        key={`${keyValue}_${tagOrdinal}`}
                      >
                        {response.content}
                      </span>
                      {tagOrdinal <
                        props.responses.filter(response => response.tag === tag)
                          .length -
                          1 && (
                        <span>
                          , <span> </span>
                        </span>
                      )}
                    </>
                  ))}
              </div>
            </>
          )
        )}
      </>
    );
  } else {
    return (
      <>
        {props.responses.map(
          (response: IFillinResponseItem, keyvalue: number) => (
            <>
              <span
                key={keyvalue}
                className={
                  response.referenceCount === 0
                    ? "fillin-responses-item-omitted fillin-responses-csv-item"
                    : "fillin-responses-csv-item"
                }
              >
                <ResponsesItem response={response} />
              </span>
              {keyvalue < lastIdx && (
                <span>
                  ,<span> </span>
                  <span> </span>
                </span>
              )}
            </>
          )
        )}
      </>
    );
  }
};
const ResponsesListItems = (props: IResponseItemsPropsType): any => {
  return props.responses.map(
    (response: IFillinResponseItem, keyvalue: number) => (
      <li key={keyvalue}>
        <div
          className={
            response.referenceCount === 0 ? "fillin-responses-item-omitted" : ""
          }
        >
          <ResponsesItem response={response} />
        </div>
      </li>
    )
  );
};
const ResponsesGridItems = (props: IResponseSelectPropsType): any => {
  let responses: IFillinResponses = props.responses;
  const fillinContext = useContext(SectionFillinContext);
  // const groupByTags: boolean =
  //   fillinContext.sectionFillin.currentSetting.groupByTags;
  return responses.map((response: IFillinResponseItem, keyvalue: number) => (
    <div
      key={keyvalue}
      className={
        response.referenceCount === 0
          ? "fillin-responses-item-omitted"
          : "fillin-responses-item fillin-responses-grid-item"
      }
    >
      <ResponsesItem response={response} />
    </div>
  ));
};
interface IResponseItemPropsType {
  response: IFillinResponseItem;
}
const ResponsesItem = (props: IResponseItemPropsType): any => {
  return (
    <>
      <ResponseContent response={props.response} />
      <ResponseTag response={props.response} />
      <ResponseReferenceCount response={props.response} />
    </>
  );
};
const ResponseContent = (props: IResponseItemPropsType) => {
  return <span>{props.response.content}</span>;
};
const ResponseTag = (props: IResponseItemPropsType) => {
  const fillinContext = useContext(SectionFillinContext);
  if (props.response.tag === PartOfSpeechEnumType.untagged) {
    return <></>;
  } else if (fillinContext.sectionFillin.currentSetting.groupByTags) {
    return <></>;
  } else if (fillinContext.sectionFillin.currentSetting.showResponseTags) {
    return (
      <span className="fillin-responses-grid-item-tag">
        &nbsp;({props.response.tag})
      </span>
    );
  } else {
    return <></>;
  }
};
const ResponseReferenceCount = (props: IResponseItemPropsType) => {
  const fillinContext = useContext(SectionFillinContext);
  if (
    !fillinContext.sectionFillin.currentSetting.showReferenceCount ||
    props.response.referenceCount <= 1
  ) {
    return <span></span>;
  } else {
    return (
      <span className="fillin-responses-grid-item-refCount">
        &nbsp;-&nbsp;
        {props.response.referenceCount}
      </span>
    );
  }
};
const Prompts = React.memo((props: ISectionPropsType): any => {
  const fillinContext = useContext(SectionFillinContext);
  let fillinContent: ISectionFillinVariant = props.section
    .meta as ISectionFillinVariant;
  let promptsLabel: string =
    fillinContext.sectionFillin.currentSetting.promptsLabel;
  return (
    <>
      <div className="fillin-prompts-label">{promptsLabel}</div>
      <div
        className="fillin-prompts-items"
        style={{ columns: `${fillinContext.sectionFillin.promptColumns}` }}
      >
        {fillinContent.prompts.map((prompt, keyvalue: number) => (
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
