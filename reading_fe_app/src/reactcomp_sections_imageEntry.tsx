/** Copyright (C) 2020 - 2024 Wen Eng - All Rights Reserved
 *
 * File name: reactcomp_sections_imageEntry.tsx
 *
 * Defines React front end functional components.
 *
 *
 * Version history:
 *
 **/
import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
// import { Request, SCROLLTOP_INITIAL } from "./reducers";
import {
  ImageEntryOrientationEnumType,
  ISectionContent,
  ISectionImageEntryVariant,
  ITerminalContent
  // IImageTerminalMeta
} from "./pageContentType";
import { useAppSelector, useDivRef } from "./hooks";
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
  // onLoad?: () => void;
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
    // Naming convention: "top" values are relative to the scrollable content
    // area. The top values are derived from initial content window positions
    // relative to the top of the content window returned from DOM
    // getBoundingClientRect()s less page_content_top.
    //
    // TL;DR These values are retrieved after the initial rendering and window
    // resize events to ensure that valid dimensions are reflected. This delay
    // allows the browser to finish loading elements that affect the resulting
    // dimensions such as the image loading and captions rendering. The
    // useLayoutEffect() doe not necessarily wait for images to be loaded. And
    // when the images are already cached in the browser, the complex captions
    // rendering seems cause inconsistently incorrect container height values
    // in cases where the height of the captions defines the images container
    //  height.
    //
    // Auto image scrolling is triggered by the scrollTop (actually
    // event.target.scrollTop) that originates from the reactcomp_page object
    // (via reducer) and is relative vertical offset (i.e., relative to the
    // top of scrolled area and does not include the page header above.)
    //
    // Although scrollTop is relative to the scrollable area as opposed to the
    // top of the page, the imagesContainerTop is an absolute y-axis position.
    // This design choice obviates the need to determine the vertical offset(s)
    // that precede the image container(s): page header, title, subtitle.
    //
    // The imagesGrouping is a bounding div that contains the image(s) to be
    // scrolled. This allows the images within its corresponding container
    // within an image section to be scrolled as a single block scrolled by
    // specifying an imagesGroupingTop offset relative to the top of the
    // container. For instance, imagesGroupTopOffset=0 is at the top of the
    // imagesContainer. Although the DOM images grouping top is retrieved as
    // absolute location via getBoundingClientRect(), the top style location
    // attribute used to specify the rendered HTML element's grouping top is
    // relative to its container, and hence an offset.
    //
    // The heights (for container and grouping divs) are just lengths with no
    // origins/coordinates. Valid top values are always non-negative and
    // based on the top of content window as origin (zero value).
    //
    // Since each image section auto scroll is triggered by the scrollTop. The
    // initial retrieval of these dimensions must occur after the browser
    // completes loading the entire page because the DOM dimensions may not
    // reflect the images final dimension NOR the captions dimensions. So the
    // most conservative approach is to retrieve these measurements after the
    //  page is completely loaded and delayed until the the initial scroll
    // request when the dimensions are potentially required. Since these
    // dimensions change upon content window resize event, the logic for both
    // situations have been combined.

    const [resize, setResize] = useState(false);
    const [imagesContainerTop, setImagesContainerTop] = useState(0);
    const [imagesGroupingTopOffset, setImagesGroupingTopOffset] = useState(0);
    const [imagesContainerHeight, setImagesContainerHeight] = useState(0);
    const [imagesGroupingHeight, setImagesGroupingHeight] = useState(0);
    const imagesContainerDivRef = useDivRef();
    const imagesGroupingDivRef = useDivRef();
    const contentTop: number = useAppSelector(store => store.page_content_top);
    const scrollTop: number = useAppSelector(store => store.content_scroll_top);
    const initialScrollTop: number = useAppSelector(
      store => store.content_scroll_top_initial
    );

    useEffect(() => {
      const mutationHandler: MutationCallback = () => {
        // If images container top (from height changes sections above) or
        // heightits own height changes (from caption height change)
        if (imagesContainerDivRef.current) {
          let rect = imagesContainerDivRef.current.getBoundingClientRect();
          let currentTop = Math.round(
            imagesContainerDivRef.current.getBoundingClientRect().top -
              contentTop +
              scrollTop
          );
          if (
            rect.height !== imagesContainerHeight ||
            currentTop !== imagesContainerTop
          ) {
            //////////////
            // Container height changed based on change to captions
            // since this only triggers with subtree option implies that it
            // is observing the change in groupingTop as opposed to the
            // change of container top that triggers less often vs. every
            // scroll event.

            // console.log(
            //   `mutation handler triggered on top or height change\n${rect.height}(rect.height) !== ${imagesContainerHeight}(imagesContainerHeight) || \ntop=${currentTop}(currentTop) !== ${imagesContainerTop}(imagesContainerTop)\ncurrentTop=${rect.top}(rect.top) - ${contentTop}(contentTop) + ${scrollTop}(scrollTop)`
            // );
            // \ntop diff=${imagesContainerTop -
            //   imagesContainerDivRef.current.getBoundingClientRect()
            //     .top},\n scrollTop - diff=${scrollTop -
            //   (imagesContainerTop -
            //     imagesContainerDivRef.current.getBoundingClientRect().top)}`
            // );

            //////////////
            // Only need to resize subsequent sections below but that requires
            // more logic to convey resize to siblings. Probably need to
            // employ reducer state variable that signals resize based on
            // a sequence number id that mapped to each image section so that
            // all image sections after this one (e.g. 3) can be resize
            // themselves.
            setResize(true);
          }
        } else {
          console.log(`invalid imagesContainerDivRef.current`);
        }
      };
      const observer = new MutationObserver(mutationHandler);
      // console.log(`observer.observe setting up`);
      if (imagesContainerDivRef.current) {
        // console.log(`observer.observe set up`);
        observer.observe(imagesContainerDivRef.current, {
          attributes: true,
          subtree: true,
          attributeFilter: ["style"]
        });
      }
      return () => observer.disconnect();
    }, [imagesContainerTop, imagesContainerHeight, scrollTop, contentTop, imagesContainerDivRef]);
    useEffect(() => {
      const resizeHandler = () => {
        // console.log(` resize handler triggered`);
        setResize(true);
      };
      // initial but probably triggering before layout complete
      resizeHandler();
      window.addEventListener("resize", resizeHandler);
      return () => {
        setResize(false);
        window.removeEventListener("resize", resizeHandler);
      };
    }, []);

    useEffect(() => {
      // console.log(
      //   `initial initialScrollTop=${initialScrollTop},scrollTop=${scrollTop}`
      // );
      if (initialScrollTop === scrollTop) {
        // console.log(`initial resize=true`);
        setResize(true);
      } else {
        // console.log(`initial resize=false`);
        setResize(false);
      }
    }, [initialScrollTop, scrollTop]);
    useEffect(() => {
      // console.log(`$$$$ inside resize=${resize}`);
      if (!resize) {
      } else {
        if (imagesContainerDivRef.current) {
          const rect = imagesContainerDivRef.current.getBoundingClientRect();
          // const parent = imagesContainerDivRef.current.parentElement;
          // const parentTop: number = parent!.offsetTop;
          // const grandparent = parent!.parentElement;
          // const grandparentTop: number = grandparent!.offsetTop;
          setImagesContainerHeight(rect.height);
          let top = Math.round(rect.top - contentTop + scrollTop);
          setImagesContainerTop(top);
          // console.log(
          //   `### resize setImagesContainerTop: ${Math.round(top)} \noffsetTop=${
          //     imagesContainerDivRef.current.offsetTop
          //   }, parentOffsetTop=${parentTop}, grandparentOffsetTop=${grandparentTop}, grandparentOffsetHeight=${
          //     grandparent!.offsetHeight
          //   }\n = ${Math.round(rect.top)} (rect.top) - ${Math.round(
          //     contentTop
          //   )} (contentTop) + ${Math.round(
          //     scrollTop
          //   )} (scrollTop), initialScrollTop=${Math.trunc(initialScrollTop)}`
          // );
          // offsetParent.offsetTop=${imagesContainerDivRef.current.offsetParent.offsetTop};
        } else {
          console.log(`RESIZE: invalid imagesContainerDivRef.current`);
        }
        if (imagesGroupingDivRef.current) {
          const rect = imagesGroupingDivRef.current.getBoundingClientRect();
          setImagesGroupingHeight(rect.height);
          setImagesGroupingTopOffset(0);
        } else {
          console.log(`RESIZE: invalid imagesGroupingDivRef.current`);
        }
        // console.log(
        //   `RESIZE: scrollTop=${Math.trunc(scrollTop)}, top=${Math.trunc(
        //     imagesContainerTop
        //   )} with imagesContainerHeight=${Math.trunc(
        //     imagesContainerHeight
        //   )}, contenttop=${Math.trunc(contentTop)}, offset=${Math.trunc(
        //     imagesGroupingTopOffset
        //   )} with imagesGroupingHeight=${Math.trunc(imagesGroupingHeight)}`
        // );
        setResize(false);
      }
    }, [contentTop, imagesContainerDivRef, imagesGroupingDivRef, resize, scrollTop]);
    useEffect(() => {
      //////////////
      // Because the scrollTop value will always to an absolute value from 0 at
      // the top of the scrollable content window to the number of pixels
      // necessary to reach the bottom of the window.
      //
      // That said, the scrollOffset represents the scroll offset relative to
      // each images container top. Thus. scrollOffset=0 indicates that the
      // images container is at the top of the window.
      let scrollOffset = scrollTop - imagesContainerTop;
      let bottomScrollOffset = imagesContainerHeight - imagesGroupingHeight;
      // console.log(
      //   `${Math.trunc(scrollOffset)} (scrollOffset) = ${Math.trunc(
      //     scrollTop
      //   )} (scrollTop) - ${Math.trunc(imagesContainerTop)} (imagesContainerTop)`
      // );
      // console.log(
      //   `SCROLL bottomScrollOffset=${Math.trunc(
      //     imagesContainerHeight
      //   )} (imagesContainerHeight) - ${Math.trunc(
      //     imagesGroupingHeight
      //   )} (imagesGroupingHeight)`
      // );
      //
      if (scrollOffset >= 0 && scrollOffset <= imagesContainerHeight) {
        // Within the range for possible autoscrolling
        // console.log(
        //   `SCROLL 1 scrollOffset(${Math.trunc(
        //     scrollOffset
        //   )}) > 0 && < imagesContainerHeight (${Math.trunc(
        //     imagesContainerHeight
        //   )})\nbottomScrollOffset=${Math.trunc(
        //     bottomScrollOffset
        //   )})\nimagesGroupingTopOffset=${Math.trunc(imagesGroupingTopOffset)}`
        // );
        // When the scrollTop changes, all (of the SectionImageEntryImages)
        // components with a scrollTop dependency will be invoked. But active
        // scrolling is limited by the specified conditions.
        // the range scrolling, the code
        if (bottomScrollOffset === 0) {
          // No autoscrolling is required because the container and grouping
          // coincide.
          // } else if (scrollOffset < bottomScrollOffset && scrollOffsetimagesContainerTop
          // ) {
          //   setImagesGroupingTopOffset(scrollOffset);
          // console.log(
          //   `SCROLL 2 bottomScrollOffset(${Math.trunc(bottomScrollOffset)})`
          // );
        } else if (scrollOffset < bottomScrollOffset) {
          // It is implied that scrollOffset > 0 here
          // Within the autoscrollable range betweeen the top of the container
          // and not passed the threshold where the grouping bottom reaches the  container bottom (bottomScrollOffset):
          // console.log(
          //   `SCROLL 3 scrollOffset(${Math.trunc(
          //     scrollOffset
          //   )})  < bottomScrollOffset (${Math.trunc(
          //     bottomScrollOffset
          //   )}) && scrollOffset > imagesContainerTop(${Math.trunc(
          //     imagesContainerTop
          //   )})`
          // );
          setImagesGroupingTopOffset(scrollOffset);
        } else if (scrollOffset >= bottomScrollOffset) {
          // Within the range where the image grouping bottom would be passed
          // the thresold where the grouping container bottom exceeds the
          // container bottom (bottomScrollOffset): No further scrolling
          // requred.
          // console.log(
          //   `SCROLL 4 scrollOffset(${Math.trunc(
          //     scrollOffset
          //   )})  > bottomScrollOffset (${Math.trunc(bottomScrollOffset)})`
          // );
          setImagesGroupingTopOffset(bottomScrollOffset);
        } else {
          // Within the autoscrollable range of imageContainer
          // console.log(
          //   `SCROLL 5 scrollOffset=${Math.trunc(
          //     scrollOffset
          //   )}, imagesContainerHeight=${Math.trunc(
          //     imagesContainerHeight
          //   )}, bottomScrollOffset=${Math.trunc(
          //     bottomScrollOffset
          //   )}, imagesGroupingTopOffset=${Math.trunc(imagesGroupingTopOffset)}`
          // );
        }
      } else if (scrollOffset < 0 && imagesGroupingTopOffset !== 0) {
        setImagesGroupingTopOffset(0);
        // console.log(
        //   `SCROLL 5 scrollOffset(${Math.trunc(
        //     scrollOffset
        //   )}  < 0  (imagesGroupingTopOffset=${Math.trunc(
        //     imagesGroupingTopOffset
        //   )} !== 0)`
        // );
        // if (scrollTop < window.innerHeight)
        // however, if the section image is viewable: scrollTop > image
        // container top (scrollTOffset < 0) but less than scrollOffset < the lesser of image container height  or the window
      } else {
        // no active image containter
      }
    }, [
      // scrollLayoutCompleted,
      scrollTop,
      resize,
      imagesContainerTop,
      imagesContainerHeight,
      imagesGroupingHeight,
      imagesGroupingTopOffset
    ]);
    let images: ITerminalContent[] = props.images;
    // let style: React.CSSProperties | any;
    // setTotalImagesToBeLoaded(props.images.length);

    const groupingClassName: string = `${props.className}-grouping`;
    return (
      <>
        <div
          className={props.className}
          ref={imagesContainerDivRef}
          // onLoad={loadContainerHandler}
        >
          <div
            className={groupingClassName}
            style={{ top: `${imagesGroupingTopOffset}px` }}
            ref={imagesGroupingDivRef}
            // onLoad={loadGroupingHandler}
          >
            {images.map((image, keyvalue: number) => (
              <TerminalImageEntry
                key={keyvalue}
                active={props.active}
                terminal={image}
                terminalCssSubclass={""}
                tagged={false}
                // onLoad={loadImageCounter}
              />
            ))}
          </div>
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
