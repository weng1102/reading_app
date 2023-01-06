/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
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
import "./App.css";
import { useAppSelector, useDivRef } from "./hooks";
import {
  ISectionContent,
  ISentenceContent,
  ISectionHeadingVariant,
  SectionVariantEnumType,
  ISectionParagraphVariant
} from "./pageContentType";
import { SectionImageEntry } from "./reactcomp_sections_imageEntry";
import { SectionFillin } from "./reactcomp_section_fillin";
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
    case SectionVariantEnumType.ordered_list:
    case SectionVariantEnumType.listitem:
      // need to group because component will recursively render zero or more of each
      return <SectionLists active={props.active} section={props.section} />;
    case SectionVariantEnumType.fillin:
      //      console.log(`SECTION SECTIONFILL EMITTING ${props.section.type}`);
      return <SectionFillin active={props.active} section={props.section} />;
    //      return <div>section fillin response</div>;
    case SectionVariantEnumType.image_entry:
      return (
        <SectionImageEntry active={props.active} section={props.section} />
      );
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
export const SectionLists = (props: ISectionListPropsType) => {
  let children = props.section.items.map((subsection, key) => (
    <SectionDispatcher key={key} active={props.active} section={subsection} />
  ));

  if (props.section.type === SectionVariantEnumType.unordered_list) {
    return <ul>{children}</ul>;
  } else if (props.section.type === SectionVariantEnumType.ordered_list) {
    return <ol>{children}</ol>;
  } else if (props.section.type === SectionVariantEnumType.listitem) {
    return (
      //      <li key={key}>{children}</li>
      <li>{children}</li>
    );
  } else {
    return <div>section list formatting problem type={props.section.type}</div>;
  }
};
export const SectionParagraph = React.memo((props: ISectionPropsType): any => {
  // console.log(`<SectionParagraph active=${props.active}>`);
  const currentSentenceIdx: number = useAppSelector(
    store => store.cursor_sentenceIdx
  );
  let paragraph: ISectionParagraphVariant = props.section
    .meta as ISectionParagraphVariant;
  return (
    <>
      <p>
        {paragraph.sentences.map(
          (sentence: ISentenceContent, keyvalue: number) => (
            <Sentence
              key={keyvalue}
              active={currentSentenceIdx === sentence.id}
              sentence={sentence}
            />
          )
        )}
      </p>
    </>
  );
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
        />
      </HeadingTag>
    </div>
  );
});
