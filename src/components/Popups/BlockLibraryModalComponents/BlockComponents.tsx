import React from "react";
import { useRootDispatch, useRootSelector } from "../../../redux/store/hooks";
import { blockLibModalActions } from "../../../redux/BlockLibraryModal/blockLibModalStateSlice";

function BlockComponents() {
  const currentGroup = useRootSelector(
    (state) => state.blockLibModalState.currentGroup
  );
  const dispatch = useRootDispatch();
  return (
    <div className="w-full h-full grid grid-cols-3">
      {currentGroup?.subGroup.map((item) => (
        <button
          className="flex flex-col w-full bg-red-200 h-fit p-2 hover:bg-green-200 
                active:bg-green-500 transition-all duration-150"
          onClick={() => {
            dispatch(blockLibModalActions.setCurrentBlock(item));
            dispatch(blockLibModalActions.toggle());
          }}
        >
          <div className="flex flex-row">{item.label}</div>
        </button>
      ))}
    </div>
  );
}

export default BlockComponents;
