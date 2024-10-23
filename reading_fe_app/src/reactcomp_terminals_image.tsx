/** Copyright (C) 2020 - 2023 Wen Eng - All Rights Reserved
 *
 * File name: reactcomps_terminal_image.tsx
 *
 * Defines React front end functional components.
 * renders imageClasses including ImageEntryImages and TerminalImages
 *
 * Version history:
 *
 **/
import React, { useContext } from "react";
import { Request } from "./reducers";
import {
  IImageTerminalMeta,
  ImageEntryOrientationEnumType
} from "./pageContentType";
import { CPageLists, PageContext } from "./pageContext";
import { useAppDispatch, useAppSelector } from "./hooks";
import { ITerminalPropsType } from "./reactcomp_terminals";
import { ISettingsContext, SettingsContext } from "./settingsContext";
interface ITerminalImageEntryPropsType extends ITerminalPropsType {
  orientation?: ImageEntryOrientationEnumType;
  // onLoad: () => void | undefined;
}
export const TerminalImageEntry = React.memo(
  (props: ITerminalImageEntryPropsType): any => {
    // FUTURE:image link to internal curriculum page link. Need to
    // emit <a href> with path/link to destination.
    let imageInfo: IImageTerminalMeta = props.terminal
      .meta as IImageTerminalMeta;
    //    if (props.terminalCssSubclass)
    // console.log(`imageInfo=${imageInfo.src},${imageInfo.overlay}`);
    return (
      <TerminalImage
        active={props.active}
        class={imageInfo.className}
        imageInfo={imageInfo}
        // onLoad={props.onLoad}
      />
    );
  }
);
interface ITerminalImagePropsType {
  class: string;
  active: boolean;
  imageInfo: IImageTerminalMeta;
  // onLoad?: () => void;
}
export const TerminalImage = React.memo(
  (props: ITerminalImagePropsType): any => {
    const dispatch = useAppDispatch();
    const pageList: CPageLists = useAppSelector(store => store.pageContext);
    let settingsContext: ISettingsContext = useContext(
      SettingsContext
    ) as ISettingsContext;
    // let imageInfo: IImageTerminalMeta = props.terminal
    //   .meta as IImageTerminalMeta;
    let distDir = settingsContext.settings.config.distDir;
    let imgSpec: string = `${distDir}/img/${props.imageInfo.src}`;
    let width: string =
      props.imageInfo.width > 0 ? props.imageInfo.width.toString() : "";
    let height: string =
      props.imageInfo.height > 0 ? props.imageInfo.height.toString() : "";
    let validLink: boolean =
      props.imageInfo.linkIdx >= 0 &&
      props.imageInfo.linkIdx < pageList.linkList.length &&
      pageList.linkList[props.imageInfo.linkIdx].valid;
    let hasLinkOverlay =
      props.imageInfo.linkIdx >= 0 &&
      props.imageInfo.linkIdx < pageList.linkList.length &&
      pageList.linkList[props.imageInfo.linkIdx].valid;

    let hasImageOverlay =
      props.imageInfo.overlay !== undefined &&
      props.imageInfo.overlay.length > 0;
    let linkOverlaySpec: string;

    // console.log(
    //   `imgSrc=${props.imageInfo.src}, linkIdx=${props.imageInfo.linkIdx} valid=${validLink} list.length=${pageList.linkList.length}`
    // );
    // console.log(`hasLinkOverlay=${hasLinkOverlay}`);
    // console.log(`hasImageOverlay=${hasImageOverlay}`);
    if (hasLinkOverlay) {
      linkOverlaySpec = `${distDir}/img/link_overlay_white.png`;
    } else {
      linkOverlaySpec = `${distDir}/img/link_overlay_none.png`;
    }
    // console.log(` src=${props.imageInfo.src}`);
    // image overlay overrides link image overlay because only a single
    // click action can be supported. Clicking on image overlay toggles
    // show/hide
    if (hasLinkOverlay) {
      linkOverlaySpec = `${distDir}/img/link_overlay_white.png`;
      // console.log(`TerminalImage hasLinkOverlay`);
      return (
        <div className="image-link-overlay-container">
          <img
            className={props.imageInfo.className}
            src={imgSpec}
            alt={props.imageInfo.label}
            width={width}
            max-height={height}
            onClick={() =>
              dispatch(Request.Page_gotoLink(props.imageInfo.linkIdx))
            }
            // onLoad={props.onLoad}
          />
          <img src={linkOverlaySpec} className="image-link-overlay" />
        </div>
      );
    } else if (hasImageOverlay) {
      // console.log(`TerminalImage hasImageOverlay`);
      let overlaySpec: string = `${distDir}/img/${props.imageInfo.overlay}`;
      return (
        <div className="image-overlay-container">
          <img
            className={props.imageInfo.className}
            src={imgSpec}
            alt={props.imageInfo.label}
            width={width}
            height={height}
            // onLoad={props.onLoad}
          />
          <img
            src={overlaySpec}
            className="image-overlay"
            //   className="image-overlay"
            // width={props.imageInfo.width.toString()}
            // height={props.imageInfo.height.toString()}
            // onClick={() =>
            //   dispatch(Request.Page_gotoLink(props.imageInfo.linkIdx))
            // }
          />
        </div>
      );
    } else {
      // setup for future: image viewer
      // console.log(`TerminalImage no overlay`);
      linkOverlaySpec = `${distDir}/img/link_overlay_none.png`;
      let classNameString: string;
      let fileType: string | undefined = props.imageInfo.src.split(".").pop();
      if (fileType !== undefined && fileType.toLowerCase() === "png") {
        classNameString = `${props.imageInfo.className}-png`;
      } else {
        classNameString = props.imageInfo.className;
      }
      return (
        <div className="image-link-overlay-container">
          <img
            className={classNameString}
            src={imgSpec}
            alt={props.imageInfo.label}
            width={width}
            max-height={height}
            // onLoad={props.onLoad}
          />
        </div>
      );

      // let classNameString: string;
      // let fileType: string | undefined = props.imageInfo.src.split(".").pop();
      // if (fileType !== undefined && fileType.toLowerCase() === "png") {
      //   classNameString = `${props.imageInfo.className}-png`;
      // } else {
      //   classNameString = props.imageInfo.className;
      // }
      // return (
      //   <>
      //     <img
      //       className={classNameString}
      //       src={imgSpec}
      //       alt={props.imageInfo.label}
      //       width={width}
      //       height={height}
      //     />
      //   </>
      // );
    }
  }
);
