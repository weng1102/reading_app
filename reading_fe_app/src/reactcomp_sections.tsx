/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_sections.tsx
 *
 * Defines React front end functional components.
 *
 *
 * Version history:
 *
 **/
import React from "react";
import CSS from "csstype";
import "./App.css";
import { useAppSelector, useDivRef } from "./hooks";
import {
  AutodNumberedOrderedListTypeEnumType,
  ISectionContent,
  ISentenceContent,
  ISectionHeadingVariant,
  SectionVariantEnumType,
  ISectionOrderedListVariant,
  ISectionParagraphVariant,
  ISectionUnorderedListVariant,
  UnorderedListMarkerEnumType
} from "./pageContentType";
import { SectionImageEntry } from "./reactcomp_sections_imageEntry";
import { SectionFillin } from "./reactcomp_section_fillin";
import { SectionButtonGrid } from "./reactcomp_section_buttongrid";
import { SectionGroupFillin } from "./reactcomp_section_groupfillin";
import { Sentence } from "./reactcomp_sentences";

export interface ISectionPropsType {
  active: boolean;
  section: ISectionContent;
}
export const SectionDispatcher = React.memo((props: ISectionPropsType) => {
  // console.log(`<SectionDispatcher type=${props.section.type}`);
  switch (props.section.type) {
    case SectionVariantEnumType.empty:
      return <SectionEmpty active={false} section={props.section} />;
    case SectionVariantEnumType.paragraph:
      return <SectionParagraph active={props.active} section={props.section} />;
    case SectionVariantEnumType.heading:
      return <SectionHeading active={props.active} section={props.section} />;
    case SectionVariantEnumType.tbd:
      return (
        <div className="section-tbd">
          rendering format to be determined for section type=
          {props.section.type}
        </div>
      );
    case SectionVariantEnumType.subsection:
      // If encountered here
      // should be handled by subcomponents.
      return <div className="section-subsection">subsection</div>;
    case SectionVariantEnumType.unordered_list:
      return (
        <SectionUnorderedList active={props.active} section={props.section} />
      );

    case SectionVariantEnumType.ordered_list:
      return (
        <SectionOrderedList active={props.active} section={props.section} />
      );
    case SectionVariantEnumType.listitem:
      // need to group because component will recursively render zero or more of each
      return <SectionListItem active={props.active} section={props.section} />;
    // case SectionVariantEnumType.group_fillin:
    //   console.log(`groupfillin`);
    //   return (
    //     <SectionGroupFillin active={props.active} section={props.section} />
    //   );
    case SectionVariantEnumType.fillin:
      return <SectionFillin active={props.active} section={props.section} />;
    case SectionVariantEnumType.image_entry:
      return (
        <SectionImageEntry active={props.active} section={props.section} />
      );
    case SectionVariantEnumType.button_grid:
      return <SectionButtonGrid active={false} section={props.section} />;

    case SectionVariantEnumType.blockquote:
    case SectionVariantEnumType.unittest:
    default:
      return (
        <div className="section-unsupported">
          rendering unsupported format for section type={props.section.type}
        </div>
      );
  } //switch
});
export const SectionEmpty = (props: ISectionPropsType) => {
  let br = ""; // or <p> or empty based on configuration
  // console.log(`<SectionEmpty>`);
  return <>{br}</>;
};
interface ISectionListPropsType {
  //   //  key: number;
  active: boolean;
  section: ISectionContent;
}
// export const SectionLists = (props: ISectionListPropsType) => {
//   let children = props.section.items.map((subsection, key) => (
//     <SectionDispatcher key={key} active={props.active} section={subsection} />
//   ));
//   let listType: SectionVariantEnumType = props.section.type;
//   let orderedListMeta: ISectionOrderedListVariant = props.section
//     .meta as ISectionOrderedListVariant;
//   if (listType === SectionVariantEnumType.unordered_list) {
//     return <ul>{children}</ul>;
//   } else if (listType === SectionVariantEnumType.ordered_list) {
//     let autoNumberedlistType: AutodNumberedOrderedListTypeEnumType = AutodNumberedOrderedListTypeEnumType.scenario;
//     console.log(`rendering ordered_list`);
//
//     let cssStyle: string = "";
//     if (
//       orderedListMeta.orderedListType ===
//       AutodNumberedOrderedListTypeEnumType.scenario
//     ) {
//       cssStyle = `scenarios-A1`;
//     } else {
//       cssStyle = ``; //temp test
//     }
//     // return <ol className={cssStyle}>{children}</ol>;
//     return <ol className={cssStyle}>{children}</ol>;
//   } else if (listType === SectionVariantEnumType.listitem) {
//     if (
//       orderedListMeta.orderedListType ===
//       AutodNumberedOrderedListTypeEnumType.scenario
//     ) {
//     return (
//       //      <li key={key}>{children}</li>
//       <li>{children}</li>
//     );
//   }
//   } else {
//     return <div>section list formatting problem type={props.section.type}</div>;
//   }
//
// };
export const SectionOrderedList = (props: ISectionListPropsType) => {
  let children = props.section.items.map((subsection, key) => (
    <SectionDispatcher key={key} active={props.active} section={subsection} />
  ));
  let orderedListMeta: ISectionOrderedListVariant = props.section
    .meta as ISectionOrderedListVariant;
  let olClassName: string = "";
  let cssStyles: React.CSSProperties = {};
  // console.log(
  //   `orderedList: listType=${orderedListMeta.orderedListType}, depth=${orderedListMeta.depth},startNumber=${orderedListMeta.startNumber}`
  // );
  if (
    orderedListMeta.orderedListType ===
      AutodNumberedOrderedListTypeEnumType.scenario &&
    orderedListMeta.depth === 1
  ) {
    olClassName = "scenarios-A1";
    cssStyles = {
      counterSet: `A1-level-1 ${orderedListMeta.startNumber}`
    };
    // console.log(`cssStyles=${cssStyles.counterSet} ${cssStyles.display}`);
  } else if (
    orderedListMeta.orderedListType ===
      AutodNumberedOrderedListTypeEnumType.multipleChoice &&
    orderedListMeta.depth === 1
  ) {
    olClassName = `multiple-choice`;
    cssStyles = {
      counterSet: `MC-level-1 ${orderedListMeta.startNumber}  display: contents`
    };
  } else {
  }
  return (
    <ol className={olClassName} style={cssStyles}>
      {children}
    </ol>
  );
};
export const SectionUnorderedList = (props: ISectionListPropsType) => {
  let children = props.section.items.map((subsection, key) => (
    <SectionDispatcher key={key} active={props.active} section={subsection} />
  ));
  let unorderedListMeta: ISectionUnorderedListVariant = props.section
    .meta as ISectionUnorderedListVariant;
  let marker: UnorderedListMarkerEnumType = unorderedListMeta.marker;
  if (marker === UnorderedListMarkerEnumType.disc) {
  } else {
  }
  return <ul>{children}</ul>;
};
export const SectionListItem = (props: ISectionListPropsType) => {
  let children = props.section.items.map((subsection, key) => (
    <SectionDispatcher key={key} active={props.active} section={subsection} />
  ));
  // let listType: SectionVariantEnumType = props.section.type;
  // let orderedListMeta: ISectionOrderedListVariant = props.section
  //   .meta as ISectionOrderedListVariant;
  // if (listType === SectionVariantEnumType.unordered_list) {
  //   return <ul>{children}</ul>;
  // } else if (listType === SectionVariantEnumType.ordered_list) {
  //   let autoNumberedlistType: AutodNumberedOrderedListTypeEnumType = AutodNumberedOrderedListTypeEnumType.scenario;
  //   console.log(`rendering ordered_list`);
  //
  //   let cssStyle: string = "";
  //   if (
  //     orderedListMeta.orderedListType ===
  //     AutodNumberedOrderedListTypeEnumType.scenario
  //   ) {
  //     cssStyle = `scenarios-A1`;
  //   } else {
  //     cssStyle = ``; //temp test
  //   }
  //   // return <ol className={cssStyle}>{children}</ol>;
  //   return <ol className={cssStyle}>{children}</ol>;
  // } else if (listType === SectionVariantEnumType.listitem) {
  //   if (
  //     orderedListMeta.orderedListType ===
  //     AutodNumberedOrderedListTypeEnumType.scenario
  //   ) {
  return <li>{children}</li>;
  // <li>{children}</li>;
  // );
  // }
  // } else {
  //   return <div>section list formatting problem type={props.section.type}</div>;
  // }
};
export const SectionParagraph = React.memo((props: ISectionPropsType): any => {
  // console.log(`<SectionParagraph active=${props.active}>`);
  const currentSentenceIdx: number = useAppSelector(
    store => store.cursor_sentenceIdx
  );
  let paragraph: ISectionParagraphVariant = props.section
    .meta as ISectionParagraphVariant;
  // console.log(
  //   `reactcomp_paragraph.class1 = ${paragraph.sentences[0].content}\n${paragraph.class}`
  // );
  if (paragraph.listItem)
    return (
      <>
        <span>
          {paragraph.sentences.map(
            (sentence: ISentenceContent, keyvalue: number) => (
              <Sentence
                key={keyvalue}
                active={currentSentenceIdx === sentence.id}
                sentence={sentence}
                recitable={true}
              />
            )
          )}
        </span>
      </>
    );
  else {
    return (
      <>
        <div className={paragraph.class}>
          {paragraph.sentences.map(
            (sentence: ISentenceContent, keyvalue: number) => (
              <Sentence
                key={keyvalue}
                active={currentSentenceIdx === sentence.id}
                sentence={sentence}
                recitable={true}
              />
            )
          )}
        </div>
      </>
    );
  }
});
const SectionHeading = React.memo((props: ISectionPropsType) => {
  const headingRef = useDivRef();
  const sectionIdx = props.section.id;
  let meta = props.section.meta as ISectionHeadingVariant;
  const headingLevels = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
  const validHeadingLevel =
    meta.level > 0 && meta.level < headingLevels.length - 1 ? meta.level : 0;
  const HeadingTag = headingLevels[
    validHeadingLevel
  ] as keyof JSX.IntrinsicElements;
  const currentSentenceIdx: number = useAppSelector(
    store => store.cursor_sentenceIdx
  );
  return (
    <div
      className="section-heading"
      id={sectionIdx.toString()}
      ref={headingRef}
    >
      <HeadingTag>
        <Sentence
          active={currentSentenceIdx === meta.heading.id}
          sentence={meta.heading}
          recitable={false}
        />
      </HeadingTag>
    </div>
  );
});
