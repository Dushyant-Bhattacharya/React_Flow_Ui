import React, { useEffect, useRef, useState } from "react";
import { useRootDispatch } from "../../../redux/store/hooks";
import { blockLibModalActions } from "../../../redux/BlockLibraryModal/blockLibModalStateSlice";

export type blockLibComponentBlock<T> = {
  label: string;
  key: string;
  icon: string;
  type: string;
  storedData: null | Array<T>;
};
export type blockLibComponentItems<T> = {
  label: string;
  icon: string;
  selected: boolean;
  subGroup: blockLibComponentBlock<T>[];
};

function BlockGroups() {
  const dispatch = useRootDispatch();
  const [items, setItems] = useState<blockLibComponentItems<Object>[]>([
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
        },
        {
          label: "Split",
          key: "split",
          icon: "",
          type: "splitTransform",
          storedData: null,
        },
        {
          label: "Find",
          key: "find",
          icon: "",
          type: "findTransform",
          storedData: null,
        },
        {
          label: "Sort",
          key: "sort",
          icon: "",
          type: "sortTransform",
          storedData: null,
        },
        {
          label: "Merge",
          key: "merge",
          icon: "",
          type: "mergeTransform",
          storedData: null,
        },
      ],
    },
  ]);
  useEffect(() => {
    dispatch(blockLibModalActions.toggleGroup(items[0]));
  }, []);
  return (
    <>
      <ul className="flex flex-col w-full items-start">
        {items.map((item: blockLibComponentItems<Object>, index: number) => (
          <li
            className={`flex flex-row w-full gap-2 font-semibold transition-all duration-150 ${
              item.selected == true &&
              "text-blue-500 pl-2 underline underline-offset-2"
            }`}
          >
            <button
              onClick={() => {
                let tempItems = structuredClone(items);
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
