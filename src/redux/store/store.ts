import { configureStore } from "@reduxjs/toolkit";
import { blockLibModalReducer } from "../BlockLibraryModal/blockLibModalStateSlice";
import { resultTableReducer } from "../ResultTable/ResultTableSlice";

export const store = configureStore({
  reducer: {
    blockLibModalState: blockLibModalReducer,
    resultTableState : resultTableReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
