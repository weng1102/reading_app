/** Copyright (C) 2020 - 2021 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_sections.tsx
 *
 * Defines React front end functional components.
 *
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
//import { readFileSync } from "fs";
// import mic_listening from "./mic1-xparent.gif";
// import mic_notlistening from "./mic1-inactive-xparent.gif";
// import mic_unavailable from "./mic1-ghosted.gif";
import { useAppSelector, useSpanRef, useDivRef } from "./hooks";
//import { useEffect, useState, useContext } from "react";

// is this really necessary if availablility is removed below
// import SpeechRecognition, {
//   useSpeechRecognition
// } from "react-speech-recognition";
import {
  ISectionContent,
  ISentenceContent,
  ISectionHeadingVariant,
  SectionVariantEnumType,
  ISectionParagraphVariant,
  ISectionUnorderedListVariant
} from "./pageContentType";
import { Settings } from "./reactcomp_settings";
import { Sentence } from "./reactcomps_sentences";

const SectionType = {
  ORDEREDLIST: "ol",
  UNORDEREDLIST: "ul",
  PARAGRAPH: "none"
};
// interface ISectionFormatPropsType {
//   listFormat: string;
//   children: any;
// }
export interface ISectionPropsType {
  active: boolean;
  section: ISectionContent;
}
export const SectionDispatcher = React.memo((props: ISectionPropsType) => {
  // console.log(`<SectionDispatcher type=${props.section.type}`);
  switch (props.section.type) {
    case SectionVariantEnumType.empty:
      return <Section_empty active={false} section={props.section} />;
    case SectionVariantEnumType.paragraph:
      return (
        <Section_paragraph active={props.active} section={props.section} />
      );
    case SectionVariantEnumType.heading:
      return <Section_heading active={props.active} section={props.section} />;
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
      return (
        <Section_Lists active={props.active} section={props.section} />
      );
    case SectionVariantEnumType.fillin:
    case SectionVariantEnumType.fillin_list:
    case SectionVariantEnumType.photo_entry:
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
export const Section_empty = (props: ISectionPropsType) => {
  let br = ""; // or <p> or empty based on configuration
  // console.log(`<Section_Empty>`);
  return <>{br}</>;
};
// interface ISectionInactivePropsType1 {
//   section: ISectionContent;
// }
interface ISectionListPropsType {
  //   //  key: number;
  active: boolean;
  section: ISectionContent;
//  children: ISectionContent[] //actually items that can be either: unorder list ordered list or listitem
}
// const Section_Node = (props: ISectionListPropsType) => {
//   return (
//     <div>Section_Node type={props.section.type}</div>
//   )
// }
export const Section_Lists = (props: ISectionListPropsType) => {
//  let sectionLists: ISectionContent = props.section.items;
let children = props.section.items.map((subsection, key) => (
    <SectionDispatcher key={key} active={props.active} section={subsection}/>))
    
if (props.section.type === SectionVariantEnumType.unordered_list) {
  return (
    <ul>{children}</ul>
    )
  }
  else if (props.section.type === SectionVariantEnumType.ordered_list) {
    return (
      <ol>{children}</ol>
      )
  }
  else if (props.section.type === SectionVariantEnumType.listitem) {
    return (
//      <li key={key}>{children}</li>
      <li>{children}</li>
    )
  } else {
    return (
      <div>section list formatting problem type={props.section.type}</div>
    )
  }
};
// interface ISectionParagraphPropsType {
//   //  key: number;
//   active: boolean;
//   paragraph: ISectionContent;
// }
export const Section_paragraph = React.memo((props: ISectionPropsType): any => {
  console.log(`<Section_Paragraph active=${props.active}>`);
  const currentSentenceIdx: number = useAppSelector(
    store => store.cursor_sentenceIdx
  );
  //  if (props.paragraph.type === SectionVariantEnumType.paragraph) {
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
// interface ISentencePropsType1 {
//   //  key: number;
//   active: boolean;
//   sentence: ISentenceContent;
// }
// export const SectionFormat = React.memo((props: ISectionFormatPropsType) => {
//   console.log(`<SectionFormat>`);
//   switch (props.listFormat) {
//     case "ul":
//       return <ul>{props.children}</ul>;
//     case "ol":
//       return <ol>{props.children}</ol>;
//     default:
//       return <>{props.children}</>;
//   }
// });
//SectionFormat = React.memo(SectionFormat);
// interface ISectionHeadingPropsType {
//   active: boolean;
//   sectionIdx: number;
//   headingLevel: number;
//   title: string;
// }
// const SectionHeading = React.memo(() => {
//   return <></>;
// });
// interface IHeadingTagPropsType {
//   headingLevel: number;
// }
const Section_heading = React.memo((props: ISectionPropsType) => {
  const headingRef = useDivRef();
  const sectionIdx = props.section.id;
  let meta = props.section.meta as ISectionHeadingVariant;
  const headingLevels = ["p", "h1", "h2", "h3", "h4", "h5", "h6"];
  const validHeadingLevel =
    meta.level > 0 && meta.level < headingLevels.length - 1 ? meta.level : 0;
  const HeadingTag = headingLevels[
    validHeadingLevel
  ] as keyof JSX.IntrinsicElements;
  return (
    <div
      className="section-heading"
      id={sectionIdx.toString()}
      ref={headingRef}
    >
      <HeadingTag>{meta.title}</HeadingTag>
    </div>
  );
});
// interface ISectionPropsTypeDeprecated {
//   active: boolean;
//   sectionObj: any;
//   listFormat: any;
// }
// let Section = React.memo((props: ISectionPropsTypeDeprecated) => {
//   console.log(
//     `<Section> props.active=${props.active} props.listFormat=${props.listFormat} props.sectionObj=${props.sectionObj}`
//   );
//   ////
//   // should be written to handle nested (recursive) sections using a props.level
//   let level = 1; // reminder to keep track of depth of headings
//   const currentSentenceId = useAppSelector(store => store.cursor_sentenceIdx);
//   console.log(`<Section> currentSentenceId=${currentSentenceId}`);
//   return (
//     <>
//       <SectionFormat listFormat={props.listFormat}>
//         {props.sectionObj.sentences.map((sentenceObj: any, keyvalue: any) => (
//           <Sentence1
//             key={props.sectionObj.id * 1000 + keyvalue}
//             active={props.active && sentenceObj.id === currentSentenceId}
//             listFormat={props.listFormat}
//             sentenceObj={sentenceObj}
//           />
//         ))}
//       </SectionFormat>
//     </>
//   );
// });
// //Section = React.memo(Section);
// interface ISentenceFormatPropsType {
//   listFormat: any;
//   children: any;
// }
// let SentenceFormat = React.memo((props: ISentenceFormatPropsType) => {
//   console.log(`<SentenceFormat> ${props.listFormat}`);
//   switch (props.listFormat) {
//     case "ul" || "ol":
//       return <li>{props.children}</li>;
//     default:
//       return <>{props.children}</>;
//   }
// });
// interface ISentencePropsType1 {
//   active: boolean;
//   listFormat: any;
//   sentenceObj: any;
//   wordObj?: any;
// }
// export const Sentence1 = React.memo((props: ISentencePropsType1) => {
//   return <></>;
// });
