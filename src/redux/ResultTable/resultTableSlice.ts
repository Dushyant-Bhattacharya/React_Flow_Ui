import { createSlice } from "@reduxjs/toolkit";

type initialType<T> = {
  rows: Array<Array<T>>;
  visible:boolean
};

const initialState: initialType<string> = {
  rows: [],
  visible:false
};

const resultTableSlice = createSlice({
  name: "resultTable",
  initialState: initialState,
  reducers: {
    setRows: (state, action) => {
      state.rows = action.payload;
    },
    toogleVisible:(state,action)=>{
        state.visible = action.payload;
    }
  },
});

export const resultTableReducer = resultTableSlice.reducer;
export const resultTableActions = resultTableSlice.actions;
