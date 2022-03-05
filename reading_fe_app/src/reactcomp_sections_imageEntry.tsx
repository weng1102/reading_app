/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_sections_imageEntry.tsx
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
  ImageEntryLayoutEnumType,
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
import { Terminal_Image } from "./reactcomps_terminals_image";
import { SectionDispatcher, ISectionPropsType } from "./reactcomps_sections";

interface ISectionImageEntryImagesPropsType {
  active: boolean;
  images: ITerminalContent[];
  layout: ImageEntryLayoutEnumType;
}
// interface ISectionImageEntryImagePropsType {
//   distDir: string;
//   image: ITerminalContent;
// }
interface ISectionImageEntryCaptionsPropsType {
  active: boolean;
  captions: ISectionContent[];
  layout: ImageEntryLayoutEnumType;
}
export const Section_imageEntry = React.memo(
  (props: ISectionPropsType): any => {
    let imageEntry: ISectionImageEntryVariant = props.section
      .meta as ISectionImageEntryVariant;
    // let images1 = (props.section.meta as ISectionImageEntryVariant).images // not working with jsx!!!

    let images = imageEntry.images as ITerminalContent[];
    let captions = imageEntry.captions as ISectionContent[];
    let className: string =
      imageEntry.layout.charAt(0).toLowerCase() === "l"
        ? "imageentry-container-" + ImageEntryLayoutEnumType.left.toString()
        : "imageentry-container-" + ImageEntryLayoutEnumType.above.toString();
    let vdividerClassName = className + "-vdivider";
    let hdividerClassName = className + "-hdivider";
    console.log(`imageEntry.percent ${imageEntry.percent}`);
    return (
      <>
        <div className={hdividerClassName}></div>

        <div className={className}>
          <Section_imageEntry_images
            active={false}
            images={images}
            layout={imageEntry.layout}
          />
          <div className={vdividerClassName}></div>
          <Section_imageEntry_captions
            active={props.active}
            captions={captions}
            layout={imageEntry.layout}
          />
        </div>
      </>
    );
  }
);
export const Section_imageEntry_images = React.memo(
  (props: ISectionImageEntryImagesPropsType): any => {
    let images: ITerminalContent[] = props.images;
    let className: string = "imageentry-image-";
    className +=
      props.layout === ImageEntryLayoutEnumType.above
        ? ImageEntryLayoutEnumType.above.toString()
        : ImageEntryLayoutEnumType.left.toString();
    images.forEach(
      image => ((image.meta as IImageTerminalMeta).className = className)
    );
    return (
      <>
        <div className={className}>
          {images.map((image, keyvalue: number) => (
            <Terminal_Image
              key={keyvalue}
              active={props.active}
              terminal={image}
            />
          ))}
        </div>
      </>
    );
  }
);
// export const Section_imageEntry_image = React.memo(
//   (props: ISectionImageEntryImagePropsType): any => {
//     let image: IImageTerminalMeta = props.image.meta as IImageTerminalMeta;
//     let imgSrc: string = `${props.distDir}/${image.src}`;
//     return (
//       <>
//         <img src={imgSrc} alt={image.label} />
//       </>
//     );
//   }
// );
export const Section_imageEntry_captions = React.memo(
  (props: ISectionImageEntryCaptionsPropsType): any => {
    let captions: ISectionContent[] = props.captions;
    let className: string = "imageentry-captions-";
    className +=
      props.layout === ImageEntryLayoutEnumType.above
        ? ImageEntryLayoutEnumType.above.toString()
        : ImageEntryLayoutEnumType.left.toString();
    return (
      <>
        <div className={className}>
          {captions.map((caption, keyvalue: number) => (
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
