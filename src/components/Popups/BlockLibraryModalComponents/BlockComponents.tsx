import { useRootDispatch, useRootSelector } from "../../../redux/store/hooks";
import { blockLibModalActions } from "../../../redux/BlockLibraryModal/blockLibModalStateSlice";

function BlockComponents() {
  const currentGroup = useRootSelector(
    (state) => state.blockLibModalState.currentGroup
  );
  const dispatch = useRootDispatch();
  return (
    <div className="w-full h-full grid grid-cols-3 gap-2 p-2">
      {currentGroup?.subGroup.map((item) => (
        <button
          className="flex flex-col w-full bg-blue-100 h-fit p-2
          shadow-sm shadow-neutral-400 hover:bg-blue-200 border border-blue-300 rounded-lg hover:shadow-md hover:shadow-neutral-500 active:shadow-none active:shadow-neutral-600
                active:bg-blue-300 transition-all duration-150"
          onClick={() => {
            dispatch(blockLibModalActions.setCurrentBlock(item));
            dispatch(blockLibModalActions.toggle());
          }}
        >
          <div className="flex flex-row h-[7rem]">{item.label}</div>
        </button>
      ))}
    </div>
  );
}

export default BlockComponents;
