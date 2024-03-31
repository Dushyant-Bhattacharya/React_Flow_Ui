import { useEffect, useState } from "react";
import { useRootDispatch } from "../../../redux/store/hooks";
import { blockLibModalActions } from "../../../redux/BlockLibraryModal/blockLibModalStateSlice";

export type blockLibComponentBlock<T> = {
  label: string;
  key: string;
  icon: string;
  type: string;
  storedData: null | Array<T>;
  userInput?: string;
  selectedColumn?: string;
  selectedType?: string;
  selectedOrder?: string;
  selectedFileName?: string;
};
export type blockLibComponentItems<T> = {
  label: string;
  icon: string;
  selected: boolean;
  subGroup: blockLibComponentBlock<T>[];
};

function BlockGroups() {
  const dispatch = useRootDispatch();
  const [items, setItems] = useState<blockLibComponentItems<object>[]>([
    {
      label: "Inputs",
      icon: "",
      selected: true,
      subGroup: [
        {
          label: "CSV File",
          key: "csv",
          icon: "",
          type: "inputs",
          storedData: null,
          selectedFileName: "",
        },
      ],
    },
    {
      label: "Transforms",
      icon: "",
      selected: false,
      subGroup: [
        {
          label: "Filter",
          key: "filter",
          icon: "",
          type: "filterTransform",
          storedData: null,
          userInput: "",
          selectedType: "",
          selectedColumn: "",
        },
        // {
        //   label: "Split",
        //   key: "split",
        //   icon: "",
        //   type: "splitTransform",
        //   storedData: null,
        // },
        {
          label: "Find",
          key: "find",
          icon: "",
          type: "findTransform",
          storedData: null,
          userInput: "",
        },
        {
          label: "Sort",
          key: "sort",
          icon: "",
          type: "sortTransform",
          storedData: null,
          selectedColumn: "",
          selectedOrder: "",
        },
        // {
        //   label: "Merge",
        //   key: "merge",
        //   icon: "",
        //   type: "mergeTransform",
        //   storedData: null,
        // },
      ],
    },
  ]);
  useEffect(() => {
    dispatch(blockLibModalActions.toggleGroup(items[0]));
  }, []);
  return (
    <>
      <ul className="flex flex-col w-full items-start">
        {items.map((item: blockLibComponentItems<object>, index: number) => (
          <li
            className={`flex flex-row w-full gap-2 font-semibold transition-all duration-150 ${
              item.selected == true &&
              "text-blue-500 pl-2 underline underline-offset-2"
            }`}
          >
            <button
              onClick={() => {
                const tempItems = structuredClone(items);
                tempItems.forEach((item) => {
                  item.selected = false;
                });
                tempItems[index].selected = true;
                setItems(tempItems);
                dispatch(blockLibModalActions.toggleGroup(tempItems[index]));
              }}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default BlockGroups;
