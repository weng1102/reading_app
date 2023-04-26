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
  ISectionFillinVariant,
  ISectionFillinItemInitializer,
  SectionFillinHelpPresetInfo,
  SectionFillinHelpPresetLevel,
  //SectionFillinHelpPresetName,
  SectionFillinLayoutType,
  SectionFillinSortOrder
} from "./pageContentType";
import helpButton from "./img/button_help.png";
import { useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { CPageLists, PageContext } from "./pageContext";
import { SectionDispatcher, ISectionPropsType } from "./reactcomp_sections";
import { SectionFillinContext, cloneDeep } from "./fillinContext";
import resetButton from "./img/button_reset1.png";
import resetButtonGhosted from "./img/button_reset_ghosted.png";
export const SectionFillin = React.memo((props: ISectionPropsType): any => {
  // copy of initial author's settings
  const fillinContext = useContext(SectionFillinContext);
  let fillinContent: ISectionFillinVariant = props.section
    .meta as ISectionFillinVariant;
  // state to support section fillins that can be changed versus the
  // pageLists.fillinList that is used to initialize the state and
  // considered read only. Ned to account for (future) reset of attributes to
  // author defaults. (Nice to have)
  const [sectionFillin, setSectionFillin] = useState(
    ISectionFillinItemInitializer()
  );
  const [resetRequested, setResetRequested] = useState(
    fillinContext.sectionFillin.allowReset
  );
  const pageLists: CPageLists = useContext(PageContext)!;
  useEffect(() => {
    if (fillinContext.sectionFillin.allowReset && resetRequested) {
      setResetRequested(false);
    }
  }, [resetRequested]);
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
      !(clone.helpPresetLevel in SectionFillinHelpPresetLevel) ||
      clone.helpPresetLevel === SectionFillinHelpPresetLevel.override
    ) {
      clone.currentHelpSetting = { ...clone.authorHelpSetting };
    } else {
      clone.currentHelpSetting =
        SectionFillinHelpPresetInfo[clone.helpPresetLevel];
    }
    clone.loaded = true;
    clone.modified = false;
    setSectionFillin(clone);
  }
  return (
    <SectionFillinContext.Provider value={{ sectionFillin, setSectionFillin }}>
      <SectionHeading active={props.active} section={props.section} />
      <Responses active={props.active} section={props.section} />
      <Prompts active={props.active} section={props.section} />
    </SectionFillinContext.Provider>
  );
});
export const SectionHeading = (props: ISectionPropsType) => {
  const fillinIdx = useContext(SectionFillinContext).sectionFillin.idx;
  // Manages layout of section heading including hiding, ghosting
  // controls e.g., buttons, sliders. Reset button
  return (
    <>
      <div className="fillin-section-container">
        <div className="fillin-heading-grid-control">
          <ResetButton active={props.active} section={props.section} />
          <HelpSettings />
        </div>
      </div>
    </>
  );
};
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
  let resetSectionFillinIdx = useAppSelector(
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
    fillinContext.setSectionFillin(cloneDeep(clone));
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
        let clone: ISectionFillinItem = cloneDeep(fillinContext.sectionFillin);
        clone.modified = true;
        fillinContext.setSectionFillin(clone);
      } else {
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showTerminalIdx,
    pageLists.terminalList,
    // fillinContext.sectionFillin.modified,
    fillinContent.sectionFillinIdx
  ]);
  useEffect(() => {
    if (resetSectionFillinIdx === sectionFillinIdx) {
      let clone: ISectionFillinItem = cloneDeep(fillinContext.sectionFillin);
      clone.modified = false;
      fillinContext.setSectionFillin(clone);
      setResponses(cloneDeep(fillinContext.sectionFillin.responses));
      dispatch(Request.Fillin_resetSection(-1));
    }
  }, [resetSectionFillinIdx, dispatch, fillinContext, sectionFillinIdx]);
  // useEffect(() => {
  //   //    const [responsesInPrompts, setResponsesInPrompts] = useState(false);
  //   if (
  //     fillinContext.sectionFillin.helpPresetLevel ===
  //     SectionFillinHelpPresetLevel.inline
  //   ) {
  //     setResponsesInPrompts(true);
  //   } else if (responsesInPrompts) {
  //     setResponsesInPrompts(false);
  //     // refresh
  //     // trigger refresh of all terminal fillins without modifying visible.
  //   }
  // }, [sectionFillin.helpPresetLevel]);
  // useEffect(() => {
  //   // will only trigger with false when going from show to not
  //   // showResponsesInPrompts
  //   if (!sectionFillin.currentHelpSetting.showResponsesInPrompts) {
  //     console.log(
  //       `reactcomp_section_fillin::showResponsesInPrompts=${sectionFillin.currentHelpSetting.showResponsesInPrompts}`
  //     );
  //     console.log(`reset the showResponsesInPrompts from true to false`);
  //   }
  // }, [sectionFillin.currentHelpSetting.showResponsesInPrompts]);
  if (
    fillinContext.sectionFillin.loaded &&
    sectionFillinIdx >= 0 &&
    sectionFillinIdx < pageLists.fillinList.length &&
    pageLists !== null &&
    fillinContext.sectionFillin.currentHelpSetting.layout !==
      SectionFillinLayoutType.hidden
  ) {
    let responsesLabel: string;
    responsesLabel =
      fillinContext.sectionFillin.currentHelpSetting.responsesLabel;

    return (
      <>
        <div className="fillin"></div>
        <div className="fillin-responses-label">{responsesLabel}</div>
        <div className="fillin-responses-grid-container">
          <ResponseItems responses={responses} />
        </div>
      </>
    );
  } else {
    return <></>;
  }
});
interface IResponseItemsPropsType {
  responses: IFillinResponses;
}
const ResponseItems = (props: IResponseItemsPropsType): any => {
  const fillinContext = useContext(SectionFillinContext);
  let responses: IFillinResponseItem[] = cloneDeep(props.responses);
  let modified: boolean = fillinContext.sectionFillin.modified;
  let uniqueResponses: IFillinResponseItem[] = [];
  if (fillinContext.sectionFillin.currentHelpSetting.unique) {
    responses.filter(item => {
      let duplicateIdx = uniqueResponses.findIndex(
        response => response.content === item.content
      );
      if (duplicateIdx < 0) {
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
    fillinContext.sectionFillin.currentHelpSetting.sortOrder ===
    SectionFillinSortOrder.alphabetical
  ) {
    uniqueResponses = uniqueResponses.sort((a, b) =>
      a.content.toLowerCase() > b.content.toLowerCase() ? 1 : -1
    );
  } else if (
    fillinContext.sectionFillin.currentHelpSetting.sortOrder ===
    SectionFillinSortOrder.random
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
  if (
    fillinContext.sectionFillin.currentHelpSetting.layout ===
    SectionFillinLayoutType.grid
  ) {
    return <ResponseItemsGrid responses={uniqueResponses} />;
  } else if (
    fillinContext.sectionFillin.currentHelpSetting.layout ===
    SectionFillinLayoutType.list
  ) {
    return <ResponsesList responses={uniqueResponses} />;
  } else {
    return <></>;
  }
};
const ResponseItemsGrid = (props: IResponseItemsPropsType): any => {
  //console.log(`<ResponseItemsGrid />`);
  const fillinContext = useContext(SectionFillinContext);
  const columnCount: string = fillinContext.sectionFillin.currentHelpSetting.gridColumns.toString();
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
  //console.log(`<ResponsesList />`);

  return (
    <ul>
      <ResponsesListItems responses={props.responses} />
    </ul>
  );
};
const ResponsesListItems = (props: IResponseItemsPropsType): any => {
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
  let responses: IFillinResponses = props.responses;
  return responses.map((response: IFillinResponseItem, keyvalue: number) => (
    <div
      key={keyvalue}
      className={
        response.referenceCount === 0
          ? "fillin-responses-grid-item-omitted"
          : "fillin-responses-grid-item fillin-responses-grid-item"
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
  return <span>{props.response.content}</span>;
};
const ResponseReferenceCount = (props: IResponsePropsType) => {
  const fillinContext = useContext(SectionFillinContext);
  if (
    !fillinContext.sectionFillin.currentHelpSetting.showReferenceCount ||
    props.response.referenceCount <= 1
  ) {
    return <span></span>;
  } else {
    return <span>({props.response.referenceCount})</span>;
  }
};
const Prompts = React.memo((props: ISectionPropsType): any => {
  const fillinContext = useContext(SectionFillinContext);
  let fillinContent: ISectionFillinVariant = props.section
    .meta as ISectionFillinVariant;
  let promptsLabel: string =
    fillinContext.sectionFillin.currentHelpSetting.promptsLabel;
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
export const ResetButton = (props: ISectionPropsType) => {
  //console.log(`<ResetButton />`);
  const fillinContext = useContext(SectionFillinContext);
  const sectionFillinIdx: number = fillinContext.sectionFillin.idx;
  const allowReset: boolean = fillinContext.sectionFillin.allowReset;
  let dispatch = useAppDispatch();

  const onButtonClick = () => {
    if (fillinContext.sectionFillin.modified && allowReset) {
      dispatch(Request.Fillin_resetSection(sectionFillinIdx));
    }
  };
  let resetButtonState: string =
    fillinContext.sectionFillin.modified && allowReset
      ? resetButton
      : resetButtonGhosted;
  //    <div style={{ aspectRatio: "1/1" }}>
  return (
    <div style={{ aspectRatio: "1/1" }}>
      <img
        className="resetIcon"
        alt="reset"
        src={resetButtonState}
        title="reset response prompts"
        onClick={() => onButtonClick()}
      />
    </div>
  );
};
export const HelpSettings = () => {
  // control manages presentation
  let fillinContext = useContext(SectionFillinContext);
  const [presetLevel, setPresetLevel] = useState(
    fillinContext.sectionFillin.helpPresetLevel
  );
  const [showHelp, setShowHelp] = useState(
    false
    //    fillinContext.sectionFillin.showHelpPresets
  );
  useEffect(() => {
    console.log(`presetLevel changed to ${presetLevel}`);
    let clone: ISectionFillinItem = cloneDeep(
      fillinContext.sectionFillin,
      fillinContext.sectionFillin.modified
    );
    clone.helpPresetLevel = presetLevel;
    clone.currentHelpSetting =
      SectionFillinHelpPresetInfo[presetLevel as SectionFillinHelpPresetLevel];
    fillinContext.setSectionFillin(clone);
  }, [presetLevel]);
  const onChangeHelpSliderValue = (event: any) => {
    let tick: number = +event.target.value;
    if (
      tick in SectionFillinHelpPresetLevel &&
      fillinContext.sectionFillin.helpPresetLevel !== tick
    ) {
      setPresetLevel(tick);
    } else {
      console.log(`oops`);
    }
  };
  const onShowHelpButtonClick = () => {
    setShowHelp(!showHelp);
  };
  const onLessHelp = () => {
    let tick: number = presetLevel - 1;
    if (
      tick >= 0 &&
      tick in SectionFillinHelpPresetLevel &&
      fillinContext.sectionFillin.helpPresetLevel !== tick
    ) {
      setPresetLevel(tick);
      console.log(`less help`);
    }
  };
  const onMoreHelp = () => {
    let tick: number = presetLevel + 1;
    if (
      tick in SectionFillinHelpPresetLevel &&
      fillinContext.sectionFillin.helpPresetLevel !== tick
    ) {
      setPresetLevel(tick);
      console.log(`more help`);
    }
  };
  if (!fillinContext.sectionFillin.showHelpPresets) {
    return <></>;
  } else if (
    fillinContext.sectionFillin.helpPresetLevel ===
      SectionFillinHelpPresetLevel.override ||
    !showHelp
  ) {
    return (
      <>
        <div className="help-settings-slider-grid-show-icon">
          <img
            className="helpIcon"
            alt="toggle help"
            src={helpButton}
            title="help button"
            onClick={() => onShowHelpButtonClick()}
          />
        </div>
      </>
    );
  } else {
    let tickCount: number =
      Object.keys(SectionFillinHelpPresetLevel).length / 2 - 2;
    return (
      <>
        <div className="help-settings-slider-grid-control">
          <div className="help-settings-slider-grid-help-button">
            <img
              className="helpIcon"
              alt="toggle help"
              src={helpButton}
              title="show/hide button"
              onClick={() => onShowHelpButtonClick()}
            />
          </div>
          <div
            className="help-settings-grid-slider-left-label"
            onClick={() => onLessHelp()}
          >
            less help
          </div>
          <input
            onChange={onChangeHelpSliderValue}
            className="help-settings-slider-control"
            value={fillinContext.sectionFillin.helpPresetLevel}
            type="range"
            min="0"
            max={tickCount}
            step="1"
          />
          <div
            className="help-settings-slider-grid-right-label"
            onClick={() => onMoreHelp()}
          >
            more help
          </div>
          <div className="help-settings-slider-grid-description">
            ({fillinContext.sectionFillin.currentHelpSetting.description})
          </div>
        </div>
      </>
    );
  }
};
