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
  ISectionFillinSettings,
  ISectionFillinVariant,
  ISectionGroupFillinVariant,
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
import { SectionControls } from "./reactcomp_section_fillin_heading";
import { SectionFillinContext, cloneDeep } from "./fillinContext";
import resetButton from "./img/button_reset1.png";
// import resetButtonGhosted from "./img/button_reset_ghosted.png";
// import taggingButton from "./img/button_tagging.png";
// import taggingButtonDisabled from "./img/button_tagging_disabled.png";
// import taggingButtonGhosted from "./img/button_tagging_ghosted.png";
// import ResponsesLayoutGridButton from "./img/button_responsesgrid.png";
// import ResponsesLayoutCsvButton from "./img/button_responsesCsv.png";
// import ResponsesCategoryShowButton from "./img/button_categorize_show.png";
// import ResponsesCategoryHideButton from "./img/button_categorize_hide.png";
// import ResponsesCategoryDisabledButton from "./img/button_categorize_ghosted.png";
export const SectionGroupFillin = React.memo(
  (props: ISectionPropsType): any => {
    // copy of initial author's settings
    // const fillinContext = useContext(SectionFillinContext);

    // const sectionFillin: ISectionFillinItem = fillinContext.sectionFillin;
    let fillinContent: ISectionGroupFillinVariant = props.section
      .meta as ISectionGroupFillinVariant;

    return <div>section fillin group</div>;
  }
);
