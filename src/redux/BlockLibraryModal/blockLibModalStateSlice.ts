import { createSlice } from "@reduxjs/toolkit";
import {
  blockLibComponentBlock,
  blockLibComponentItems,
} from "../../components/Popups/BlockLibraryModalComponents/BlockGroups";

type initialStateType = {
  isOpen: boolean;
  currentGroup: blockLibComponentItems<object> | null;
  currentBlock?: blockLibComponentBlock<object> | null;
};

const initialState: initialStateType = {
  isOpen: false,
  currentGroup: null,
  currentBlock: null,
};

const blockLibModalStateSlice = createSlice({
  name: "blockLibraryState",
  initialState: initialState,
  reducers: {
    toggle: (state) => {
      state.isOpen = !state.isOpen;
    },
    toggleGroup: (state, action) => {
      state.currentGroup = action.payload as blockLibComponentItems<object>;
    },
    setCurrentBlock: (state, action) => {
      state.currentBlock = action.payload as blockLibComponentBlock<object>;
    },
  },
});

export const blockLibModalReducer = blockLibModalStateSlice.reducer;
export const blockLibModalActions = blockLibModalStateSlice.actions;
