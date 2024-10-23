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
import { useEffect, useLayoutEffect, useState } from "react";
import "./App.css";
import { Request } from "./reducers";
import {
  ImageEntryOrientationEnumType,
  ISectionContent,
  ISectionImageEntryVariant,
  ITerminalContent,
  IImageTerminalMeta
} from "./pageContentType";
import { useAppSelector, useAppDispatch, useDivRef } from "./hooks";
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
  const dispatch = useAppDispatch();
  const [componentsToBeLoaded, setComponentsToBeLoaded] = useState(0);
  // const sectionImagesLoadHandler = (): void => {
  //   console.log(
  //     `sectionImagesLoadHandler bubbling captured out of total=${imageEntry
  //       .images.length + imageEntry.captions.length}`
  //   );
  // };
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
  // setComponentsToBeLoaded(
  //   imageEntry.images.length + imageEntry.captions.length
  // );
  // console.log(
  //   `total subcomponents=${imageEntry.images.length +
  //     imageEntry.captions.length}`
  // );
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
    // area. The top values are derived from absolute page positions returned
    // from DOM using getBoundingClientRect() less page_content_top to make it
    // relative the scrollable  content window
    //
    // Auto image scrolling is triggered by the scrollTop (actually
    // event.target.scrollTop) that originates from the reactcomp_page object
    // (via reducer) and is relative vertical offset (i.e., relative to the
    // top of scrolled area.)
    //
    // Although scrollTop is relative to the scrollable area as opposed to the
    // top of the page, the imagesContainerTop is an absolute y-axis position.
    // This design choice obviates the need to determine the vertical offset(s)
    // that precede the image container(s): page header, title, subtitle.
    //
    // The imagesGrouping is a bounding div that contains the image(s) to be
    // scrolled. This allows the images within its corresponding container
    // within an image section to be scrolled as a single block to scroll by
    // specifying an imagesGroupingTop offset.
    // For instance, imagesGroupTop=0 is at the top of the imagesContainer.
    // So the imagesGroupTop should be more aptly named
    // imagesGroupOffsetIntoItsImageContainer.
    //
    // The heights (for container and grouping divs) are just lengths with no
    // origins/coordinates.
    //
    // Since each image section auto scroll is triggered by the scrollTop. The
    // initial retrieval of these dimensions must occur after the browser
    // complets loading the entire page because the DOM dimensions may not
    // reflect the images final dimension NOR the captions dimensions. So the
    // safesst approach is to retrieve these measurements after the page is
    // completely loaded and delayed until the the initial scroll request When
    // the dimensions are potentially required. Since these dimensions change
    //upon content window resize event, the logic for both situations
    // have been combined.

    // const [imagesLoadedCount, setImagesLoadedCount] = useState(0);
    // const [isImagesLoaded, setIsImagesLoaded] = useState(false);
    const [resize, setResize] = useState(false);
    // const [imagesContainerDivLoaded, setImagesContainerDivLoaded] = useState(
    //   false
    // );
    // const [scrollLayoutCompleted, setScrollLayoutCompleted] = useState(false);
    // const [totalImagesToBeLoaded, setTotalImagesToBeLoaded] = useState(0);

    const [imagesContainerTop, setImagesContainerTop] = useState(0);
    const [imagesGroupingTop, setImagesGroupingTop] = useState(0);
    // const [imagesGroupingOffset, setImagesGroupingOffset] = useState(0);
    const [imagesContainerHeight, setImagesContainerHeight] = useState(0);
    const [imagesGroupingHeight, setImagesGroupingHeight] = useState(0);
    // const [initialScrollTop, setInitialScrollTop] = useState(0);
    // const [
    //   imagesContainerDivRect,
    //   setImagesContainerDivRect
    // ] = useState<null | DOMRect>(null);
    // const [
    //   imagesContainerDivRect,
    //   setImagesContainerDivRect
    // ] = useState<null | DOMRect>(null);
    // const [
    //   imagesGroupingDivRect,
    //   setImagesGroupingDivRect
    // ] = useState<null | DOMRect>(null);
    // const contentDivRef = useDivRef();
    const imagesContainerDivRef = useDivRef();
    const imagesGroupingDivRef = useDivRef();
    // const contentY: number = useAppSelector(store => store.page_content_y);
    const initialContentTop: number = useAppSelector(
      store => store.page_content_top
    );
    // const pageTop: number = useAppSelector(store => store.page_content_top);
    const scrollTop: number = useAppSelector(store => store.content_scroll_top);
    const initialScrollTop: number = useAppSelector(
      store => store.content_scroll_top_initial
    );

    useEffect(() => {
      const resizeHandler = () => {
        // console.log(`resize triggered`);
        setResize(true);
      };
      const ImagesEntryLoadedHandler = () => {
        // console.log(`images entry loaded triggered`);
      };
      window.addEventListener("resize", resizeHandler);
      // window.addEventListener("load", ImagesEntryLoadedHandler);
      // console.log(`initial resize=true`);
      // setResize(true); // initial resize
      // Cleanup the event listener on component unmount
      return () => {
        setResize(false);
        window.removeEventListener("resize", resizeHandler);
      };
    }, []);
    // useEffect(() => {
    //   const pageLoadedHandler = () => {
    //     console.log(`Page load handler state=${document.readyState}`);
    //     if (document.readyState === "complete") {
    //       // good luck!
    //       console.log("Page load complete");
    //       setResize(true); // initial resize
    //     }
    //   };
    //   document.addEventListener("DOMContentLoaded", pageLoadedHandler);
    //   return () => {
    //     setResize(false);
    //     window.removeEventListener("DOMContentLoaded", pageLoadedHandler);
    //   };
    // }, []);
    // useEffect(() => {
    //   console.log(
    //     `initial contentTop=${initialContentTop}, initialScrollTop=${scrollTop}`
    //   );
    // }, [initialContentTop]);
    useEffect(() => {
      // console.log(`initialScrollTop=${initialScrollTop}`);
      if (initialScrollTop === scrollTop) {
        // console.log(`initial resize=true`);
        setResize(true);
      } else {
        // console.log(`initial resize=false`);
        setResize(false);
      }
    }, [initialScrollTop, scrollTop]);
    // useEffect(() => {
    //   if (initialScrollTop !== scrollTop) {
    //   }
    // }, [initialScrollTop, scrollTop]);
    // useEffect(() => {
    //   console.log(`scrollTop=${scrollTop}, initial=${initialScrollTop}`);
    // }, [scrollTop]);
    // useEffect(() => {
    //   if (initialScrollTop >= 0 && scrollTop !== initialScrollTop) {
    //     setResize(true);
    //     setInitialScrollTop(-1); // disable additional checking
    //   }
    // }, [scrollTop]);
    useEffect(() => {
      // console.log(`$$$$ inside resize=${resize}`);
      if (imagesContainerDivRef.current) {
        const rect = imagesContainerDivRef.current.getBoundingClientRect();
        setImagesContainerHeight(rect.height);
        setImagesContainerTop(rect.top - initialContentTop);
        // console.log(
        //   `ECHO: imagesContainerHeight=${Math.trunc(
        //     imagesContainerHeight
        //   )} at height=${Math.trunc(imagesContainerTop)}`
        // );
      } else {
        console.log(`invalid imagesContainerDivRef.current`);
      }
      if (imagesGroupingDivRef.current) {
        const rect = imagesGroupingDivRef.current.getBoundingClientRect();
        setImagesGroupingHeight(rect.height);
        setImagesGroupingTop(0);
        // console.log(
        //   `ECHO: imagesGroupingHeight=${Math.trunc(
        //     imagesContainerHeight
        //   )} at height=${Math.trunc(imagesContainerTop)}`
        // );
      } else {
        console.log(`invalid imagesGroupingDivRef.current`);
      }
      setResize(false);
    }, [resize]);

    // useEffect(() => {
    //   if (imagesContainerDivRef.current)
    //     setImagesContainerDivRect(
    //       imagesContainerDivRef.current.getBoundingClientRect()
    //     );
    //   if (imagesGroupingDivRef.current)
    //     setImagesGroupingDivRect(
    //       imagesGroupingDivRef.current.getBoundingClientRect()
    //     );
    // }, []); // run once on mount
    // useEffect(() => {
    //   if (imagesContainerDivRef.current) {
    //     setImagesContainerDivRect(
    //       imagesContainerDivRef.current.getBoundingClientRect()
    //     );
    //   } else {
    //     // throw exception!!!
    //     console.log(`imagesContainerDivRef.current not available`);
    //   }
    //   if (imagesGroupingDivRef.current) {
    //     setImagesContainerDivRect(
    //       imagesGroupingDivRef.current.getBoundingClientRect()
    //     );
    //   } else {
    //     console.log(`imagesGroupingDivRef.current not available`);
    //     //throw exception
    //   }
    // }, [imagesContainerDivRef.current, imagesGroupingDivRef.current]);
    // useEffect(() => {
    //   console.log(`inside contentLayoutCompleted=${contentLayoutCompleted}`);
    //   console.log(
    //     `inside contentLayoutCompleted`
    //     // imagesContainerDivLoaded=${imagesContainerDivLoaded}`
    //   );
    //   if (imagesContainerDivRef.current) {
    //     const rect = imagesContainerDivRef.current.getBoundingClientRect();
    //     setImagesContainerHeight(rect.height);
    //     setImagesContainerTop(rect.top);
    //   } else {
    //     console.log(`invalid imagesContainerDivRef.current2`);
    //   }
    //   if (imagesGroupingDivRef.current) {
    //     const rect = imagesGroupingDivRef.current.getBoundingClientRect();
    //     setImagesGroupingHeight(rect.height);
    //     setImagesGroupingTop(rect.top);
    //   } else {
    //     console.log(`invalid imagesGroupingDivRef.current2`);
    //   }
    // }, [contentLayoutCompleted]);
    // useEffect(() => {
    //   if (contentLayoutCompleted) {
    //     console.log(
    //       `inside contentLayoutCompleted`
    //       // imagesContainerDivLoaded=${imagesContainerDivLoaded}`
    //     );
    //     if (imagesContainerDivRef.current) {
    //       const rect = imagesContainerDivRef.current.getBoundingClientRect();
    //       setImagesContainerHeight(rect.height);
    //       setImagesContainerTop(rect.top);
    //     } else {
    //       console.log(`invalid imagesContainerDivRef.current2`);
    //     }
    //     if (imagesGroupingDivRef.current) {
    //       const rect = imagesGroupingDivRef.current.getBoundingClientRect();
    //       setImagesGroupingHeight(rect.height);
    //       setImagesGroupingTop(rect.top);
    //     } else {
    //       console.log(`invalid imagesGroupingDivRef.current2`);
    //     }
    //     // if (imagesContainerDivRef.current) {
    //     //   const rect = imagesContainerDivRef.current.getBoundingClientRect();
    //     //   console.log(
    //     //     `! contentLayoutCompleted: container height=${Math.trunc(
    //     //       rect.height
    //     //     )}, top=${Math.trunc(rect.top)}`
    //     //   );
    //     //   if (rect.top < 0)
    //     //     console.log(
    //     //       `! contentLayoutCompleted: negative top encountered!!!!!!!!!!!!!!!!`
    //     //     );
    //     // }
    //   }
    // }, [contentLayoutCompleted]);
    // useEffect(
    //   () => {
    //     console.log(`inside isImagesLoaded`);
    //     // if (isImagesLoaded) {
    //     // Presumably, all DOM elements and their respective boundingClientRect
    //     // values are finalized
    //     // if (imagesContainerDivLoaded) {
    //     //   window.scrollTo({ top: 0 });
    //     if (imagesContainerDivRef.current) {
    //       const rect = imagesContainerDivRef.current.getBoundingClientRect();
    //       setImagesContainerHeight(rect.height);
    //       setImagesContainerTop(rect.top - initialContentTop);
    //       console.log(
    //         `ECHO: imagesContainerHeight=${Math.trunc(
    //           imagesContainerHeight
    //         )} at height=${Math.trunc(imagesContainerTop)}`
    //       );
    //     } else {
    //       console.log(`invalid imagesContainerDivRef.current1`);
    //       // console.log(
    //       //   `! imagesContainerDivLoaded: container height=${Math.trunc(
    //       //     rect.height
    //       //   )}, top=${Math.trunc(rect.top)}`
    //       // );
    //       // if (rect.top < 0)
    //       //   console.log(
    //       //     `! imagesContainerDivLoaded: negative top encountered!!!!!!!!!!!!!!!!`
    //       //   );
    //     }
    //     if (imagesGroupingDivRef.current) {
    //       const rect = imagesGroupingDivRef.current.getBoundingClientRect();
    //       setImagesGroupingHeight(rect.height);
    //       setImagesGroupingTop(0);
    //       console.log(
    //         `ECHO: imagesGroupingHeight=${Math.trunc(
    //           imagesContainerHeight
    //         )} at height=${Math.trunc(imagesContainerTop)}`
    //       );
    //     } else {
    //       console.log(`invalid imagesGroupingDivRef.current1`);
    //       // console.log(
    //       //   `! imagesContainerDivLoaded: grouping height=${Math.trunc(
    //       //     rect.height
    //       //   )}, top=${Math.trunc(rect.top)}`
    //       // );
    //     }
    //     // if (imagesContainerDivRef.current)
    //     //   setImagesContainerDivRect(
    //     //     imagesContainerDivRef.current.getBoundingClientRect()
    //     //   );
    //     // if (imagesGroupingDivRef.current)
    //     //   setImagesGroupingDivRect(
    //     //     imagesGroupingDivRef.current.getBoundingClientRect()
    //     //   );
    //     // window.scrollTo({ top: 0 });
    //     // console.log(`all images loaded, scroll to top`);
    //     //
    //     // console.log(`$$$$$ initialContentTop=${initialContentTop}`);
    //     // getBoundingClientRect
    //     // const rect = imagesContainerDivRef.current.getBoundingClientRect()
    //     // if (imagesContainerDivRef.current) {
    //     //   const rect = imagesContainerDivRef.current.getBoundingClientRect();
    //     //   setImagesContainerHeight(rect.height);
    //     //   console.log(
    //     //     `$$$$$ inside container useEffect: imagesContainerHeight(rect)=${Math.trunc(
    //     //       rect.height
    //     //     )}`
    //     //   );
    //     //   console.log(
    //     //     `$$$$$ inside container useEffect: initialContentTop(rect)=${Math.trunc(
    //     //       initialContentTop
    //     //     )}`
    //     //   );
    //     //   setImagesContainerTop(rect.top - initialContentTop);
    //     //   console.log(
    //     //     `$$$$$ inside container useEffect: imagesContainerTop(rect)=${Math.trunc(
    //     //       rect.top
    //     //     )}, imagesContainerHeight=${Math.trunc(imagesContainerHeight)}`
    //     //   );
    //     // } else {
    //     //   console.log(
    //     //     `$$$$$ SectionImageEntryImages:inside container invalid divRect`
    //     //   );
    //     // }
    //     // }
    //     //   if (imagesGroupingDivRef.current) {
    //     //     const rect = imagesGroupingDivRef.current.getBoundingClientRect();
    //     //     // console.log(`height2=${rect.height}`);
    //     //     setImagesGroupingHeight(rect.height);
    //     //     setImagesGroupingTop(0); //
    //     //     console.log(
    //     //       `$$$$$ inside grouping useEffect: imagesGroupingTop=${Math.trunc(
    //     //         imagesGroupingTop
    //     //       )}, imagesGroupingHeight=${Math.trunc(imagesGroupingHeight)}`
    //     //     );
    //     //     // }
    //     //   } else {
    //     //     console.log(`$$$$$ inside grouping invalid divRect`);
    //     //   }
    //     //   setScrollLayoutCompleted(true);
    //     // } else {
    //     //   console.log(`$$$$$ contentLayoutCompleted=false`);
    //     // }
    //     // }
    //   },
    //   [
    //     // isImagesLoaded
    //     // contentLayoutCompleted,
    //     // initialContentTop
    //     // imagesContainerHeight
    //     // // imagesGroupingHeight
    //   ]
    // );
    // useEffect(() => {
    //   if (imagesContainerHeight > 0) {
    //     console.log(
    //       `ECHO:imagesContainerTop=${Math.trunc(
    //         imagesContainerTop
    //       )} with height=${Math.trunc(imagesContainerHeight)}`
    //     );
    //   }
    // }, [imagesContainerHeight, imagesContainerTop]);
    // useEffect(() => {
    //   if (imagesGroupingHeight > 0) {
    //     console.log(
    //       `ECHO: imagesGroupingTop=${Math.trunc(
    //         imagesGroupingTop
    //       )} with height=${Math.trunc(imagesGroupingHeight)}`
    //     );
    //   }
    // }, [imagesGroupingTop, imagesGroupingHeight]);
    useEffect(() => {
      // if (scrollTop !== initialScrollTop) {
      //   setResize(true); // force recalculation
      //   console.log(
      //     `SCROLL: scrollTop changed from ${initialScrollTop} to ${scrollTop}`
      //   );
      // }
      let scrollOffset = scrollTop - imagesContainerTop;
      let scrollBottomThreshold = imagesContainerHeight - imagesGroupingHeight;
      // console.log(
      //   `SCROLL 0 scrollOffset (${Math.trunc(scrollOffset)}) = ${Math.trunc(
      //     scrollTop
      //   )} (scrollTop) - ${Math.trunc(
      //     imagesContainerTop
      //   )} (imagesContainerTop)\nSCROLL scrollBottomThreshold=${Math.trunc(
      //     imagesContainerHeight
      //   )} (imagesContainerHeight) - ${Math.trunc(
      //     imagesGroupingHeight
      //   )} (imagesGroupingHeight)`
      // );

      if (scrollOffset >= 0 && scrollOffset <= imagesContainerHeight) {
        // console.log(
        //   `SCROLL 1 scrollOffset(${Math.trunc(
        //     scrollOffset
        //   )}) > 0 && < imagesContainerHeight (${Math.trunc(
        //     imagesContainerHeight
        //   )})\nscrollBottomThreshold=${Math.trunc(
        //     scrollBottomThreshold
        //   )})\nimagesGroupingTop=${Math.trunc(imagesGroupingTop)}`
        // );

        // When the scrollTop changes, all (of the SectionImageEntryImages)
        // components with a scrollTop dependency will be invoked. But active
        // scrolling is limited by the specified conditions.
        // the range scrolling, the code
        if (scrollBottomThreshold === 0) {
          // console.log(
          //   `SCROLL 2 scrollBottomThreshold(${Math.trunc(
          //     scrollBottomThreshold
          //   )})`
          // );
          // already at the bottom
        } else if (scrollOffset < scrollBottomThreshold) {
          // console.log(
          //   `SCROLL 3 scrollOffset(${Math.trunc(
          //     scrollOffset
          //   )})  < scrollBottomThreshold (${Math.trunc(scrollBottomThreshold)})`
          // );
          setImagesGroupingTop(scrollOffset);
        } else if (scrollOffset > scrollBottomThreshold) {
          // console.log(
          //   `SCROLL 4 scrollOffset(${Math.trunc(
          //     scrollOffset
          //   )})  > scrollBottomThreshold (${Math.trunc(scrollBottomThreshold)})`
          // );
          setImagesGroupingTop(scrollBottomThreshold);
        } else {
        }
      } else if (scrollOffset < 0 && imagesGroupingTop !== 0) {
        setImagesGroupingTop(0);
        // console.log(
        //   `SCROLL 5 scrollOffset(${Math.trunc(
        //     scrollOffset
        //   )}  < 0  (imagesGroupingTop=${Math.trunc(imagesGroupingTop)} !== 0)`
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
      imagesGroupingTop
    ]);
    let images: ITerminalContent[] = props.images;
    let style: React.CSSProperties | any;
    // setTotalImagesToBeLoaded(props.images.length);

    const groupingClassName: string = `${props.className}-grouping`;
    // const loadContainerHandler = () => {
    //   console.log(`loadContainerHandler: container loaded`);
    //
    //   // if (isImagesLoaded) {
    //   //   console.log(`!!!! loadContainerHandler: all images loaded`);
    //   //   setImagesContainerDivLoaded(true);
    //   // }
    //   // if (imagesContainerDivRef.current) {
    //   //   const rect = imagesContainerDivRef.current.getBoundingClientRect();
    //   //   console.log(
    //   //     `!!!! loadContainerHandler height=${Math.trunc(
    //   //       rect.height
    //   //     )},top=${Math.trunc(rect.top)}`
    //   //   );
    //   //  top=${Math.trunc(rect.top)}, window.screentop=${
    //   //   window.screenTop
    //   // }, window.scrollY=${Math.trunc(window.scrollY)}`
    //   // );
    //   // let height = ;
    //   // console.log(`height1=${Math.trunc(height)}`);
    //   // setImagesContainerHeight(rect.height);
    //   // setImagesContainerTop(rect.top - initialContentTop);
    //   // setImagesContainerHeight(rect.height);
    //   // console.log(`initialContentTop=${initialContentTop}`);
    //   // setImagesContainerTop(rect.top - initialContentTop);
    //   // console.log(`# loadContainerHandler top=${imagesContainerTop}`);
    //   // console.log(`# loadContainerHandler height=${imagesContainerHeight}`);
    //   // }
    // };
    // const loadGroupingHandler = () => {
    //   // if (imagesGroupingDivRef.current) {
    //   //   const rect = imagesGroupingDivRef.current.getBoundingClientRect();
    //   //   setImagesGroupingDivRect(rect);
    //   // console.log(`# loadGroupingHandler height=${rect.height}`);
    //   // if (imagesGroupingDivRef.current) {
    //   //   const rect = imagesGroupingDivRef.current.getBoundingClientRect();
    //   //   setImagesGroupingHeight(rect.height);
    //   //   setImagesGroupingTop(0); //
    //   //   console.log(
    //   //     `!!!! loadGroupingHandler height=${Math.trunc(rect.height)}`
    //   //   );
    //   // }
    //   // // console.log(`# loadGroupingHandler height=${imagesGroupingTop}`);
    //   // // console.log(`# loadGroupingHandler height=${imagesGroupingHeight}`);
    //   // }
    // };
    // const loadImageCounter = () => {
    //   console.log(`loadImageCounter image loaded`);
    //   // if (images.length > 0) {
    //   //   setImagesLoadedCount(imagesLoaded => imagesLoaded + 1);
    //   //   // setImagesAllLoaded(imagesLoaded === images.length);
    //   //   console.log(
    //   //     `loadImageCounter imagesLoaded=${imagesLoadedCount}/${images.length -
    //   //       1}`
    //   //   );
    //   //   if (imagesLoadedCount === images.length - 1) {
    //   //     setIsImagesLoaded(true);
    //   //     // setImagesContainerDivLoaded(true);
    //   //     console.log(`loadImageCounter all images loaded`);
    //   //   }
    //   // } else {
    //   //   console.log(`loadImageCounter: No images to load`);
    //   // }
    //
    //   // if (imagesGroupingDivRef.current) {
    //   //   const rect = imagesGroupingDivRef.current.getBoundingClientRect();
    //   //   console.log(
    //   //     `#### inside imageLoader: imagesGroupingHeight(rect)=${Math.trunc(
    //   //       rect.height
    //   //     )}`
    //   //   );
    //   //   // console.log(
    //   //   //   `#### inside imageLoader: initialContentTop(rect)=${Math.trunc(
    //   //   //     initialContentTop
    //   //   //   )}`
    //   //   // );
    //   // }
    //   // if (imagesContainerDivRef.current) {
    //   //   const rect = imagesContainerDivRef.current.getBoundingClientRect();
    //   //   // setImagesContainerHeight(rect.height);
    //   //   console.log(
    //   //     `#### inside imageLoader: imagesContainerHeight(rect)=${Math.trunc(
    //   //       rect.height
    //   //     )}`
    //   //   );
    //   //   // console.log(
    //   //   //   `#### inside imageLoader: initialContentTop(rect)=${Math.trunc(
    //   //   //     initialContentTop
    //   //   //   )}`
    //   //   // );
    //   //   // // setImagesContainerTop(rect.top - initialContentTop);
    //   //   // console.log(
    //   //   //   `#### inside imageLoader: imagesContainerTop(rect)=${Math.trunc(
    //   //   //     rect.top
    //   //   //   )}, imagesContainerHeight=${Math.trunc(imagesContainerHeight)}`
    //   //   // );
    //   // } else {
    //   //   console.log(`#### inside imageLoader: invalid divRect`);
    //   // }
    //   // }
    // };
    // // let topOfImagesGroup: number = imagesGroupingTop;

    const len: number = images.length;
    // setImagesLoaded(0);
    return (
      <>
        <div
          className={props.className}
          ref={imagesContainerDivRef}
          // onLoad={loadContainerHandler}
        >
          <div
            className={groupingClassName}
            style={{ top: `${imagesGroupingTop}px` }}
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
    // const captionLoadedHandler = (): void => {
    //   console.log(`captionLoadedHandler: caption loaded`);
    // };
    // useEffect(() => {
    //   console.log(` captions rendered`);
    // }, []);
    // const loadsignal = () => {
    //   console.log(` captions loaded2`);
    // };
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
