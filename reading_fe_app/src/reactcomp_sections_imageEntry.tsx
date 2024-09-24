/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_sections_imageEntry.tsx
 *
 * Defines React front end functional components.
 * "ClassName" props are used to access css styles while "style" props
 * are used to override class-defined css attribute.
 * That is, overriding css attributes (e.g., "size" defined within the
 * markdown source programmatically.
 *
 *
 * Version history:
 *
 **/
import React from "react";
import "./App.css";
import {
  ImageEntryOrientationEnumType,
  ISectionContent,
  ISectionImageEntryVariant,
  ITerminalContent,
  IImageTerminalMeta
} from "./pageContentType";
import { TerminalImageEntry } from "./reactcomp_terminals_image";
import { SectionDispatcher, ISectionPropsType } from "./reactcomp_sections";

interface ISectionImageEntryImagesPropsType {
  active: boolean;
  className: string;
  images: ITerminalContent[];
  // width: string;
  // height: string;
}
interface ISectionImageEntryCaptionsPropsType {
  active: boolean;
  className: string;
  captions: ISectionContent[];
}
export const SectionImageEntry = React.memo((props: ISectionPropsType): any => {
  // aware of orientation
  let imageEntry: ISectionImageEntryVariant = props.section
    .meta as ISectionImageEntryVariant;
  let orientation: string = imageEntry.orientation.toString();
  const classPrefix: string = `imageentry-container`;
  let className: string = `${classPrefix}-${orientation}`;
  let dividerClassName: string = `${classPrefix}-divider-${orientation}`;
  let style: React.CSSProperties | any;
  let maxHeight: string = "";
  if (imageEntry.orientation === ImageEntryOrientationEnumType.above) {
    maxHeight = imageEntry.percent.replace("%", "vh");
    style = { maxHeight: `${maxHeight}` };
  } else if (imageEntry.orientation === ImageEntryOrientationEnumType.left) {
    style = {
      gridTemplateColumns: `[images] ${imageEntry.percent} [divider] 10px [captions] auto`
    };
  } else {
    style = {};
  }
  return (
    <>
      <div className={dividerClassName}></div>
      <div className={className} style={style}>
        <SectionImageEntryImages
          active={false}
          className={`imageentry-images-${orientation}`}
          images={imageEntry.images}
        />
        <div className={dividerClassName}></div>
        <SectionImageEntryCaptions
          active={props.active}
          className={`imageentry-captions-${orientation}`}
          captions={imageEntry.captions}
        />
      </div>
    </>
  );
});
export const SectionImageEntryImages = React.memo(
  (props: ISectionImageEntryImagesPropsType): any => {
    let images: ITerminalContent[] = props.images;
    let style: React.CSSProperties | any;
    console.log(`images.type=${images[0].type}`);
    // if (props.orientation === ImageEntryOrientationEnumType.above) {
    //   let vh = imageEntry.percent.replace("%", "vh");
    //
    //   // style = { "> img": { maxHeight: "10vh" } };
    //   style = { maxHeight: "14vh" };
    //   // style = { maxHeight: "10vh" };
    //   // style = { imageentryImagesAbove: { maxHeight: "17vh" } };
    //   console.log(`%%%className=${props.className} style=${style}`);
    // } else {
    //   style = {};
    // }
    // style = {};
    return (
      <>
        <div className={props.className}>
          {images.map((image, keyvalue: number) => (
            <TerminalImageEntry
              key={keyvalue}
              active={props.active}
              terminal={image}
              terminalCssSubclass={""}
              tagged={false}
            />
          ))}
        </div>
      </>
    );
  }
);
export const SectionImageEntryCaptions = React.memo(
  (props: ISectionImageEntryCaptionsPropsType): any => {
    return (
      <>
        <div className={props.className}>
          {props.captions.map((caption, keyvalue: number) => (
            <SectionDispatcher
              key={keyvalue}
              active={props.active}
              section={caption}
            />
          ))}
        </div>
      </>
    );
  }
);
