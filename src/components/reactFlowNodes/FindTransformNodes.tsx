import { useContext, useEffect, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { flowContext } from "../../Context/FlowContext";
import { useRootDispatch } from "../../redux/store/hooks";
import { resultTableActions } from "../../redux/ResultTable/resultTableSlice";
import useUpdateNodeDataHook from "../../hooks/useUpdateNodeDataHook";


type NodeData = {
  value: number;
  key: string;
  selected: boolean;
  id: string;
};
function FindTransformNodes({ data }: NodeProps<NodeData>) {
  const { nodes, setNodes } = useContext(flowContext);
  const [findInputVal, setFindInputVal] = useState<string>("");
  // const [findSelectVal, setFindSelectVal] = useState<string>("");
  const { updateNodeOriginalData } = useUpdateNodeDataHook();
  const dispatch = useRootDispatch();
  useEffect(() => {
    if (
      nodes.length > 0 &&
      nodes[Number(data.id)].data.changed != undefined &&
      nodes[Number(data.id)].data.changed == true
    ) {
      setFindInputVal("");
      const tempNodes = structuredClone(nodes);
      tempNodes[Number(data.id)].data.changed = false;
      setNodes([...tempNodes]);
    }
  }, [nodes]);
  return (
    <>
      
      <Handle
        type="target"
        position={Position.Left}
        className={`nodeid-${data.id}`}
        style={{
          width: 10,
          height: 10,
        }}
      />
      <div
        className={`bg-neutral-300 rounded-lg w-[15rem] flex flex-row overflow-hidden transition-all duration-150
      ${
        data.selected == true && "bg-slate-200 border-blue-300 border"
      } nodeid-${data.id}`}
      >
        {data.key == "find" && (
          <div
            className={`flex flex-col w-11/12 mx-auto p-1 nodeid-${data.id}`}
          >
            <h3 className={`font-semibold nodeid-${data.id}`}>
              Find ( lazy search )
            </h3>
            <div className={`flex flex-col w-full gap-2 nodeid-${data.id}`}>
              <input
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none transition-all duration-150 shadow-md shadow-neutral-400 nodeid-${data.id}`}
                type="text"
                value={findInputVal}
                onChange={(event) => {
                  setFindInputVal(event.target.value);
                }}
              />

              <button
                className={`font-semibold border text-blue-700 border-blue-500 px-2 p-1 rounded-lg bg-slate-300  shadow-md hover:bg-blue-500 hover:text-white transition-all duration-150 hover:shadow-lg w-fit self-end hover:shadow-neutral-400 active:bg-blue-600 active:shadow-sm active:shadow-neutral-300 nodeid-${data.id}`}
                onClick={(event) => {
                  //debugger;
                  event.stopPropagation();

                  let tempNodes = structuredClone(nodes);

                  const tempData = structuredClone(
                    tempNodes[Number(data.id)].data.originalData
                  );
                  const filterData = tempData.filter(
                    (item: Array<string>, index: number) => {
                      if (index == 0) {
                        return true;
                      }
                      let flag = false;
                      for (let i = 0; i < item.length; i++) {
                        if (item[i].includes(findInputVal) == true) {
                          flag = true;
                          break;
                        }
                      }
                      if (flag == true) {
                        return true;
                      }
                    }
                  );

                  tempNodes = updateNodeOriginalData(
                    data,
                    structuredClone(filterData)
                  );

                  tempNodes[Number(data.id)].data.storedData =
                    structuredClone(filterData);
                  //debugger;
                  setNodes([...tempNodes]);
                  dispatch(
                    resultTableActions.setRows(structuredClone(filterData))
                  );
                }}
              >
                Run
              </button>
            </div>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className={`nodeid-${data.id}`}
        style={{
          width: 10,
          height: 10,
        }}
      />
      {/* <Handle
          type="source"
          position={Position.Bottom}
          id="b"
          style={handleStyle}
        /> */}
    </>
  );
}

export default FindTransformNodes;
