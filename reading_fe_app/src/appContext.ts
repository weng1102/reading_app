export interface IPageStackItem {
  page: string;
  pageTerminalIdx: number; // only relevant for the page and not globally
}
export const IPageStackItemInitializer = (): IPageStackItem => {
  return {
    page: "",
    pageTerminalIdx: 0
  };
};
export interface ISessionState {
  previousPages: IPageStackItem[];
  currentPage: IPageStackItem; // top of stack e.g., after pop()
  push(page: IPageStackItem): number;
}
export const ISessionStateInitializer = (): ISessionState => {
  return {
    previousPages: [],
    currentPage: IPageStackItemInitializer(),
    push(page: IPageStackItem) {
      return 0;
    }
  };
};
