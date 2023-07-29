/** Copyright (C) 2020 - 2022 Wen Eng - All Rights Reserved
 *
 * File name: fillinsContext.ts
 *
 * Defines fillin values for import and export
 * When the user wants to change section fillins, clone the context and
 * value/setValue pairs.
 *
 * Version history:
 *
 **/
import React from "react";
import {
  ISectionFillinItem,
  ISectionFillinItemInitializer
} from "./pageContentType";
const IDX_INITIALIZER = -9999;
// export interface ISectionFillinContext {
//   fillins: ISectionFillinItem;
//   saveFillins: (fillins: ISectionFillinItem) => void;
// }
// export type ISectionFillinContextType = {
//   fillins: ISectionFillinItem;
// };
// createContext type definition
export const ISectionFillinContextInitializer = {
  sectionFillin: ISectionFillinItemInitializer(),
  setSectionFillin: (fillins: ISectionFillinItem) => {}
};
export function cloneDeep<ISectionFillinItem>(
  toBeCloned: ISectionFillinItem,
  modified: boolean = true // only applies to visible[]
): ISectionFillinItem {
  let clone = JSON.parse(JSON.stringify(toBeCloned));
  try {
    clone.loaded = true; // potentially not a field
    clone.modified = modified; // potentially not a field
  } finally {
  }
  return clone;
}
// export const cloneSectionFillin1 = (
//   sectionFillin: ISectionFillinItem
// ): ISectionFillinItem => {
//   return {
//     ...sectionFillin,
//     loaded: true,
//     modified: false,
//     responses: [...sectionFillin.responses]
//   };
// };
//
// export function ISectionFillinContextInitializer(
//   fillins: ISectionFillinItem = ISectionFillinItemInitializer()
// ): ISectionFillinContext {
//   return {
//     fillins: { ...fillins },
//     saveFillins: (fillins: ISectionFillinItem) => {}
//   };
// }
// export function ISectionFillinContextInitializer(): ISectionFillinItem {
//   return {};
// }
//IFillinItem;
// export type IFillinSectionContext = Array<IFillinsContext>;
// export const FillinSectionContext: IFillinSectionContext = ;
// export const SectionFillinContext = React.createContext(
//   null as ISectionFillinContext | null
// );
// export const SectionFillinContext = React.createContext(
//   ISectionFillinContextInitializer()
// );
// type SectionFillinContextType = React.Context<{
//   fillins: ISectionFillinItem;
//   saveFillins: (fillins: ISectionFillinItem) => void;
// }>;
export const SectionFillinContext = React.createContext(
  ISectionFillinContextInitializer
);

export interface ITerminalFillinItem {
  offsetIdx: number;
  visible: boolean[];
}
export function ITerminalFillinItemInitializer(
  offsetIdx: number = IDX_INITIALIZER,
  visible: boolean[] = []
): ITerminalFillinItem {
  return {
    offsetIdx: offsetIdx,
    visible: visible
  };
}
// export function ITerminalFillinItemInitializer1(
//   offsetIdx: number = IDX_INITIALIZER,
//   visibleCount: number = 0
// ): ITerminalFillinItem {
//   let visible: boolean[];
//   visible.fill(visibleCount)
//   return {
//     offsetIdx: offsetIdx,
//     visible: visible
//   };
// }
//
// )
export const ITerminalFillinContextInitializer = {
  terminalFillin: ITerminalFillinItemInitializer(),
  setTerminalFillin: (fillins: ITerminalFillinItem) => {}
};
export const cloneTerminalFillin = (
  terminalFillin: ITerminalFillinItem
): ITerminalFillinItem => {
  //let TerminalFillinUpdated: ITerminalFillinItem = ITerminalFillinItemInitializer()
  let terminalFillinUpdated: ITerminalFillinItem = {
    ...terminalFillin,
    visible: []
  };
  // //deep copy visible[]
  for (const visible of terminalFillin.visible) {
    terminalFillinUpdated.visible.push(visible);
  }
  return terminalFillinUpdated;
};
export const TerminalFillinContext = React.createContext(
  ITerminalFillinContextInitializer
);
