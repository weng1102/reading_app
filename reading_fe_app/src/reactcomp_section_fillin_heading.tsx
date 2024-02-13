/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_section_fillin_heading.tsx
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
import { Request } from "./reducers";
import { useEffect } from "react";
import {
  ISectionFillinItem,
  ISectionFillinSettings,
  PartOfSpeechEnumType,
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
import { SectionFillinContext, cloneDeep } from "./fillinContext";
import resetButton from "./img/button_reset1.png";
import resetButtonGhosted from "./img/button_reset_ghosted.png";
import taggingButton from "./img/button_tagging.png";
import taggingButtonDisabled from "./img/button_tagging_disabled.png";
import taggingButtonGhosted from "./img/button_tagging_ghosted.png";
import ResponsesLayoutGridButton from "./img/button_responsesgrid.png";
import ResponsesLayoutGridDisabledButton from "./img/button_responsesgrid_disabled.png";
import ResponsesLayoutCsvButton from "./img/button_responsesCsv.png";
import ResponsesCategoryShowButton from "./img/button_categorize_show.png";
import ResponsesCategoryHideButton from "./img/button_categorize_hide.png";
import ResponsesCategoryDisabledButton from "./img/button_categorize_ghosted.png";
import ResponsesShowRefCntButton from "./img/button_responsesrefcnt_show.png";
import ResponsesHideRefCntButton from "./img/button_responsesrefcnt_hide.png";
import ResponsesRefCntDisabledButton from "./img/button_responsesRefcnt_ghosted.png";
import SectionHelpButton from "./img/button_help.png";
export const SectionControls = (props: ISectionPropsType) => {
  const fillinIdx = useContext(SectionFillinContext).sectionFillin.idx;
  // Manages layout of section heading including hiding, ghosting
  // controls e.g., buttons, sliders. Reset button
  return (
    <>
      <div className="fillin-section-container">
        <div className="fillin-setting-grid-control">
          <div className="fillin-settings-grid-reset-button">
            <ResetButton />
          </div>
          <div className="fillin-settings-grid-tagging-button">
            <TaggingButton />
          </div>
          <div className="fillin-settings-grid-progression-button">
            <ProgressionButton />
          </div>
          <div className="fillin-settings-grid-progression-slider">
            <ProgressionSlider />
          </div>
          <div className="fillin-settings-grid-layout-button">
            <ResponsesLayoutButton />
          </div>
          <div className="fillin-settings-grid-category-button">
            <ResponsesCategoryButton />
          </div>
          <div className="fillin-settings-refcount-button">
            <ResponsesRefCountButton />
          </div>

          <div className="fillin-settings-grid-help-button">
            <HelpButton />
          </div>
        </div>
      </div>
    </>
  );
};
export const ResetButton = () => {
  //console.log(`<ResetButton />`);
  const fillinContext = useContext(SectionFillinContext);
  let resetSectionFillinIdx = useAppSelector(
    store => store.fillin_resetSectionIdx
  );

  const allowReset: boolean = fillinContext.sectionFillin.allowReset;
  let dispatch = useAppDispatch();

  const onButtonClick = () => {
    if (fillinContext.sectionFillin.modified && allowReset) {
      dispatch(Request.Fillin_resetSection(fillinContext.sectionFillin.idx));
    }
  };
  useEffect(() => {
    if (resetSectionFillinIdx === fillinContext.sectionFillin.idx) {
      // let clone: ISectionFillinItem = cloneDeep(
      //     fillinContext.sectionFillin,
      //     false
      //   );
      dispatch(Request.Fillin_resetSection(-1));
    }
  }, [
    resetSectionFillinIdx,
    dispatch,
    fillinContext,
    fillinContext.sectionFillin.idx
  ]);
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
export const TaggingButton = () => {
  const fillinContext = useContext(SectionFillinContext);
  let dispatch = useAppDispatch();
  const onButtonClick = () => {
    let clone: ISectionFillinItem = cloneDeep(
      fillinContext.sectionFillin,
      fillinContext.sectionFillin.modified
    );
    clone.currentSetting.showResponseTags = !fillinContext.sectionFillin
      .currentSetting.showResponseTags;

    clone.currentSetting.showPromptTags = !fillinContext.sectionFillin
      .currentSetting.showPromptTags;

    fillinContext.setSectionFillin(clone);
  };

  if (
    fillinContext.sectionFillin.tags.length <= 0 ||
    (fillinContext.sectionFillin.tags.length === 1 &&
      fillinContext.sectionFillin.tags[0] === PartOfSpeechEnumType.untagged)
  ) {
    return (
      <div style={{ aspectRatio: "1/1" }}>
        <img
          className="taggingIcon"
          alt="tagging not available"
          src={taggingButtonGhosted}
          title="tagging not available"
        />
      </div>
    );
  } else {
    let taggingButtonState: string = !fillinContext.sectionFillin.currentSetting
      .showResponseTags
      ? taggingButton
      : taggingButtonDisabled;
    let taggingButtonTitle: string = !fillinContext.sectionFillin.currentSetting
      .showResponseTags
      ? "show tags"
      : "hide tags";
    return (
      <div style={{ aspectRatio: "1/1" }}>
        <img
          className="taggingIcon"
          alt={taggingButtonTitle}
          src={taggingButtonState}
          title={taggingButtonTitle}
          onClick={() => onButtonClick()}
        />
      </div>
    );
  }
};
export const ProgressionButton = () => {
  const fillinContext = useContext(SectionFillinContext);
  const showProgression: boolean =
    fillinContext.sectionFillin.currentSetting.showProgression;
  const toggleSliderButtonClick = () => {
    let clone: ISectionFillinItem = cloneDeep(
      fillinContext.sectionFillin,
      fillinContext.sectionFillin.modified
    );
    clone.currentSetting.showProgression = !clone.currentSetting
      .showProgression;
    fillinContext.setSectionFillin(clone);
  };
  let progressionButtonTitle: string = showProgression
    ? "hide responses progression"
    : "show responses progression";
  let progressionButtonState: string = showProgression
    ? hideSliderButton
    : showSliderButton;
  return (
    <>
      <div style={{ aspectRatio: "1/1" }}>
        <img
          className="progressionIcon"
          alt="responses option button"
          src={progressionButtonState}
          title={progressionButtonTitle}
          onClick={() => toggleSliderButtonClick()}
        />
      </div>
    </>
  );
};
export const ResponsesProgressionControl = () => {
  const fillinContext = useContext(SectionFillinContext);
  const [showResponseProgressionButton] = useState(
    fillinContext.sectionFillin.currentSetting.showProgression
  );
};
export const ProgressionSlider = () => {
  // control manages presentation
  let fillinContext = useContext(SectionFillinContext);
  const showProgression: boolean =
    fillinContext.sectionFillin.currentSetting.showProgression;
  // const [presetLevel, setPresetLevel] = useState(
  //   fillinContext.sectionFillin.presetLevel
  // );
  const [progressionOrdinal, setProgressionOrdinal] = useState(
    Object.values(SectionFillinResponsesProgressionEnum).indexOf(
      fillinContext.sectionFillin.currentSetting.progressionOrder
    )
  );
  const [progressionOrdinalLast] = useState(
    Object.keys(SectionFillinResponsesProgressionEnum).length - 1
  );
  const isValidTick = (tick: number): boolean => {
    return tick >= 0 && tick <= progressionOrdinalLast;
  };
  useEffect(() => {
    let clone: ISectionFillinItem = cloneDeep(
      fillinContext.sectionFillin,
      fillinContext.sectionFillin.modified
    );
    clone.currentSetting.progressionOrder = Object.values(
      SectionFillinResponsesProgressionEnum
    )[progressionOrdinal];
    fillinContext.setSectionFillin(clone);
  }, [progressionOrdinal, fillinContext.setSectionFillin]);

  // useEffect(() => {
  //   // console.log(`presetLevel changed to ${presetLevel}`);
  //   let clone: ISectionFillinItem = cloneDeep(
  //     fillinContext.sectionFillin,
  //     fillinContext.sectionFillin.modified
  //   );
  //   clone.presetLevel = presetLevel;
  //   clone.currentSetting =
  //     SectionFillinPresetInfo[presetLevel as SectionFillinPresetLevel];
  //   //    const index =Object.keys(SectionFillinResponsesProgressionEnum).indexOf("Apple");
  //   let currentProgression = Object.keys(
  //     SectionFillinResponsesProgressionEnum
  //   ).indexOf(fillinContext.sectionFillin.currentSetting.progressionOrder);
  //
  //   console.log(
  //     `currentProgression=${fillinContext.sectionFillin.currentSetting.progressionOrder.toString()}`
  //   );
  //   console.log(`currentProgressionOrdinal=${currentProgression}`);
  //   //    console.log(`## ${Object.keys(SectionFillinResponsesProgressionEnum)}`);
  //   fillinContext.setSectionFillin(clone);
  // }, [presetLevel]);
  const onChangeSliderValue = (event: any) => {
    let tick: number = +event.target.value;
    if (isValidTick(tick)) {
      setProgressionOrdinal(tick);
    } else {
      console.log(`invalid tick=${tick}/${progressionOrdinalLast}`);
    }
  };
  const onLessHelp = () => {
    if (isValidTick(progressionOrdinal - 1)) {
      setProgressionOrdinal(progressionOrdinal - 1);
    }
  };
  const onMoreHelp = () => {
    if (isValidTick(progressionOrdinal + 1)) {
      setProgressionOrdinal(progressionOrdinal + 1);
    }
  };
  if (!fillinContext.sectionFillin.currentSetting.showProgression) {
    return <></>;
  } else {
    let lessSliderButtonState: string =
      progressionOrdinal === 0 ? lessSliderDisabledButton : lessSliderButton;
    let moreSliderButtonState: string =
      progressionOrdinal === progressionOrdinalLast
        ? moreSliderDisabledButton
        : moreSliderButton;
    return (
      <>
        <div className="fillin-settings-grid-progression-control">
          <div className="fillin-settings-progression-grid-slider-less">
            <img
              className="lessSliderIcon"
              alt="less help slider button"
              src={lessSliderButtonState}
              title="less progression"
              onClick={() => onLessHelp()}
            />
          </div>
          <input
            onChange={onChangeSliderValue}
            className="fillin-settings-progression-grid-slider-control"
            value={progressionOrdinal}
            type="range"
            min="0"
            max={progressionOrdinalLast}
            step="1"
          />
          <div className="fillin-settings-progression-grid-slider-more">
            <img
              className="moreSliderIcon"
              alt="more help slider button"
              src={moreSliderButtonState}
              title="more progression"
              onClick={() => onMoreHelp()}
            />
          </div>
        </div>
      </>
    );
  }
};
export const ResponsesLayoutButton = () => {
  const fillinContext = useContext(SectionFillinContext);
  let currentSetting: ISectionFillinSettings =
    fillinContext.sectionFillin.currentSetting;
  const showProgression: boolean = currentSetting.showProgression;
  const toggleLayout = () => {
    let clone: ISectionFillinItem = cloneDeep(
      fillinContext.sectionFillin,
      fillinContext.sectionFillin.modified
    );
    if (currentSetting.layout === SectionFillinLayoutType.grid) {
      clone.currentSetting.layout = SectionFillinLayoutType.csv;
    } else {
      clone.currentSetting.layout = SectionFillinLayoutType.grid;
    }
    fillinContext.setSectionFillin(clone);
  };
  let responsesLayoutButtonState: string;
  let responsesLayoutButtonTitle: string;
  if (
    currentSetting.progressionOrder ===
    SectionFillinResponsesProgressionEnum.hidden
    //    || !currentSetting.showResponseTags
  ) {
    responsesLayoutButtonState = ResponsesLayoutGridDisabledButton;
    responsesLayoutButtonTitle = "";
  } else if (currentSetting.layout === SectionFillinLayoutType.grid) {
    responsesLayoutButtonState = ResponsesLayoutCsvButton;
    responsesLayoutButtonTitle = "Arrange as comma separated values";
  } else {
    responsesLayoutButtonState = ResponsesLayoutGridButton;
    responsesLayoutButtonTitle = "Arrange as grid";
  }
  if (!showProgression) {
    return <></>;
  }
  return (
    <div style={{ aspectRatio: "1/1" }}>
      <img
        className="layoutIcon"
        alt="layouts"
        src={responsesLayoutButtonState}
        title={responsesLayoutButtonTitle}
        onClick={() => toggleLayout()}
      />
    </div>
  );
};
export const ResponsesCategoryButton = () => {
  const fillinContext = useContext(SectionFillinContext);
  const showProgression: boolean =
    fillinContext.sectionFillin.currentSetting.showProgression;
  const onButtonClick = () => {
    let clone: ISectionFillinItem = cloneDeep(fillinContext.sectionFillin);
    clone.modified = fillinContext.sectionFillin.modified;
    clone.currentSetting.groupByTags = !clone.currentSetting.groupByTags;
    fillinContext.setSectionFillin(clone);
  };
  let responsesCategoryButtonState: string;
  let responsesCategoryTitle: string = "";
  let currentSetting: ISectionFillinSettings =
    fillinContext.sectionFillin.currentSetting;
  if (
    currentSetting.progressionOrder ===
      SectionFillinResponsesProgressionEnum.hidden ||
    !currentSetting.showResponseTags ||
    fillinContext.sectionFillin.tags.length <= 0 ||
    (fillinContext.sectionFillin.tags.length === 1 &&
      fillinContext.sectionFillin.tags[0] === PartOfSpeechEnumType.untagged)
  ) {
    responsesCategoryButtonState = ResponsesCategoryDisabledButton;
    responsesCategoryTitle = "";
  } else if (currentSetting.groupByTags) {
    responsesCategoryButtonState = ResponsesCategoryHideButton;
    responsesCategoryTitle = "Ungroup tagged responses";
  } else {
    responsesCategoryButtonState = ResponsesCategoryShowButton;
    responsesCategoryTitle = "Group responses by tags";
  }
  if (!showProgression) {
    return <></>;
  } else {
    return (
      <div style={{ aspectRatio: "1/1" }}>
        <img
          className="categoryIcon"
          alt="categorize"
          src={responsesCategoryButtonState}
          title={responsesCategoryTitle}
          onClick={() => onButtonClick()}
        />
      </div>
    );
  }
};
export const ResponsesRefCountButton = () => {
  const fillinContext = useContext(SectionFillinContext);
  let buttonIconState: string = "";
  let buttonAltState: string = "";
  const onButtonClick = () => {
    console.log(`responseRefCountButton state`);
    let clone: ISectionFillinItem = cloneDeep(fillinContext.sectionFillin);
    clone.modified = fillinContext.sectionFillin.modified;
    clone.currentSetting.unique = !clone.currentSetting.unique;
    fillinContext.setSectionFillin(clone);
  };
  const showProgression: boolean =
    fillinContext.sectionFillin.currentSetting.showProgression;
  if (
    fillinContext.sectionFillin.currentSetting.progressionOrder ===
    SectionFillinResponsesProgressionEnum.hidden
  ) {
    buttonIconState = ResponsesRefCntDisabledButton;
  } else if (fillinContext.sectionFillin.currentSetting.unique) {
    buttonIconState = ResponsesHideRefCntButton;
    buttonAltState = "hide reference count";
  } else {
    buttonIconState = ResponsesShowRefCntButton;
    buttonAltState = "show reference count";
  }
  if (!showProgression) {
    return <></>;
  } else {
    return (
      <div style={{ aspectRatio: "1/1" }}>
        <img
          className="refCountIcon"
          alt={buttonAltState}
          src={buttonIconState}
          title={buttonAltState}
          onClick={() => onButtonClick()}
        />
      </div>
    );
  }
};
export const HelpButton = () => {
  let dispatch = useAppDispatch();
  const onButtonClick = () => {
    dispatch(Request.Page_load("sectionfillinhelp"));
    // toggle modal window possibly using the same SectionHeading layout
  };
  let helpButtonState: string = "SectionHelpButton";
  let helpButtonTitle: string = "help";
  helpButtonState = ResponsesCategoryDisabledButton;
  return (
    <div style={{ aspectRatio: "1/1" }}>
      <img
        className="helpIcon"
        alt="help"
        src={SectionHelpButton}
        title={helpButtonTitle}
        onClick={() => onButtonClick()}
      />
    </div>
  );
};
