import { rootReducer } from "./reducers";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

// Logger with default options
import { createLogger } from "redux-logger";
let rlogger = createLogger({ collapsed: true });
//logger = loggerOptions.logger, collapsed = true);
export const store = createStore(rootReducer, applyMiddleware(thunk, rlogger));
// apparently, the order of middleware matter wrt rlogger "undefined action" error
// export types needed for pre-typed versions of useDispatch and useSelector hooks
// and avoids explicitly including (state:RootState) for useSelector AND reminds
// us to use the defined AppDispatch below
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
