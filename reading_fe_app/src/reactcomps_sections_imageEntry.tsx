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
import { useAppSelector, useDivRef } from "./hooks";
import {
  ISectionContent,
  ISentenceContent,
  ISectionImageEntryVariant,
  SectionVariantEnumType,
  ISectionParagraphVariant,
  ISectionUnorderedListVariant,
  ITerminalContent,
  ITerminalInfo,
  IImageTerminalMeta
} from "./pageContentType";
import { SectionDispatcher, ISectionPropsType } from "./reactcomps_sections";

interface ISectionImageEntryImagesPropsType {
  images: ITerminalContent[];
}
interface ISectionImageEntryImagePropsType {
  image: ITerminalContent;
}
interface ISectionImageEntryCaptionsPropsType {
  active: boolean;
  captions: ISectionContent[];
}
interface ISectionImageEntryCaptionPropsType {
  active: boolean;
  caption: ISectionContent;
}
export const Section_imageEntry = React.memo(
  (props: ISectionPropsType): any => {
    let imageEntry: ISectionImageEntryVariant = props.section
      .meta as ISectionImageEntryVariant;
    // let images1 = (props.section.meta as ISectionImageEntryVariant).images // not working with jsx!!!
    let images = imageEntry.images as ITerminalContent[];
    let captions = imageEntry.captions as ISectionContent[];
    return (
      <>
        <div className="image-entry-horizontal-container">
          <Section_imageEntry_images images={images} />
          <Section_imageEntry_captions
            active={props.active}
            captions={captions}
          />
        </div>
      </>
    );
  }
);
export const Section_imageEntry_images = React.memo(
  (props: ISectionImageEntryImagesPropsType): any => {
    let images: ITerminalContent[] = props.images;
    return (
      <>
        <div className="image-entry-images">
          {images.map((image, keyvalue: number) => (
            <Section_imageEntry_image image={image} />
          ))}
        </div>
      </>
    );
  }
);
export const Section_imageEntry_image = React.memo(
  (props: ISectionImageEntryImagePropsType): any => {
    let image: IImageTerminalMeta = props.image.meta as IImageTerminalMeta;
    return (
      <>
        <img src={image.src} alt={image.label} />
      </>
    );
  }
);
export const Section_imageEntry_captions = React.memo(
  (props: ISectionImageEntryCaptionsPropsType): any => {
    let captions: ISectionContent[] = props.captions;
    return (
      <>
        <div className="image-entry-captions">
          {captions.map((caption, keyvalue: number) => (
            <SectionDispatcher active={props.active} section={caption} />
          ))}
        </div>
      </>
    );
  }
);
