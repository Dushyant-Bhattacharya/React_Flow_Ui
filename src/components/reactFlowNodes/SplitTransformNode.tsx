import {
  ChangeEvent,
  ReactEventHandler,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Handle, Position, NodeProps, getConnectedEdges } from "reactflow";
import { flowContext } from "../../Context/FlowContext";
import { useRootDispatch } from "../../redux/store/hooks";
import { resultTableActions } from "../../redux/ResultTable/ResultTableSlice";
import useUpdateNodeDataHook from "../../hooks/useUpdateNodeDataHook";

type NodeData = {
  value: number;
  key: string;
  selected: boolean;
  id: string;
};
function SplitTransformNode({ data, isConnectable }: NodeProps<NodeData>) {
  const { nodes, setNodes, edges } = useContext(flowContext);
  const [splitColumn, setSplitColumn] = useState<string>("");
  const { updateNodeOriginalData } = useUpdateNodeDataHook();
  const dispatch = useRootDispatch();
  //   const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
  //     // console.log(evt.target.value);
  //     setInputVal(event.target.value);
  //   }, []);
  // const filters = useMemo((data:Array<>)=>{
  //     return {
  //         "<" :
  //     }
  // },[])
  useEffect(() => {
    if (
      nodes.length > 0 &&
      nodes[Number(data.id)].data.changed != undefined &&
      nodes[Number(data.id)].data.changed == true
    ) {
      setSplitColumn("");
      let tempNodes = structuredClone(nodes);
      tempNodes[Number(data.id)].data.changed = false;
      setNodes([...tempNodes]);
    }
  }, [nodes]);
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
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
        //   onClick={()=>{
        //     debugger;
        //     let temp = structuredClone(nodes);
        //     let index = -1;
        //     temp.forEach((item,itemIndex)=>{
        //         if(item.data.id == data.id)
        //         {
        //             index = itemIndex
        //         }
        //         item.data.selected = false;
        //     });
        //     if(index != -1)
        //     {
        //         temp[index].data.selected = true;
        //     }
        //     setNodes([...temp]);

        //   }}
      >
        {/* on click of a inputs type node , show the data stored inside its file in the table */}
        {data.key == "split" && (
          <div
            className={`flex flex-col w-11/12 mx-auto p-1 nodeid-${data.id}`}
          >
            <h3 className={`font-semibold nodeid-${data.id}`}>Split</h3>
            <div className={`flex flex-col w-full gap-2 nodeid-${data.id}`}>
              <select
                value={splitColumn}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-md shadow-neutral-400 outline-none transition-all duration-150 nodeid-${data.id}`}
                onChange={(event) => {
                  debugger;
                  setSplitColumn(event.target.value);
                }}
              >
                <option selected value="">
                  Choose a column
                </option>
                {nodes[Number(data.id)].data.originalData != undefined &&
                  nodes[Number(data.id)].data.originalData[0].map(
                    (item: string, index: number) => (
                      <option value={index}>{item}</option>
                    )
                  )}
              </select>

              <button
                className={`font-semibold border text-blue-700 border-blue-500 px-2 p-1 rounded-lg bg-slate-300  shadow-md hover:bg-blue-500 hover:text-white transition-all duration-150 hover:shadow-lg w-fit self-end hover:shadow-neutral-400 active:bg-blue-600 active:shadow-sm active:shadow-neutral-300 nodeid-${data.id}`}
                onClick={(event) => {
                  debugger;
                  event.stopPropagation();
                  let tempNodes = structuredClone(nodes);

                  let tempData = structuredClone(
                    tempNodes[Number(data.id)].data.originalData
                  );
                  let filterData = undefined;
                  let leftSide: Array<Array<string>> = [];
                  let rightSide: Array<Array<string>> = [];
                  if (
                    Number(splitColumn) ==
                    tempNodes[0].data.originalData.length - 1
                  ) {
                    leftSide = structuredClone(tempData);
                    rightSide = [];
                  }
                  if (Number(splitColumn) < tempData.length - 1) {
                    for (let i = 0; i < tempData.length; i++) {
                      leftSide.push(
                        structuredClone(
                          tempData[i].slice(0, Number(splitColumn) + 1)
                        )
                      );
                      rightSide.push(
                        structuredClone(
                          tempData[i].slice(Number(splitColumn) + 1)
                        )
                      );
                    }
                  }
                  filterData = {
                    leftSide: leftSide,
                    rightSide: rightSide,
                  };
                  tempNodes = updateNodeOriginalData(
                    data,
                    structuredClone(filterData)
                  );

                  tempNodes[Number(data.id)].data.storedData =
                    structuredClone(filterData);
                  debugger;
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
        id="left"
        style={{
          top: 20,
          width: 10,
          height: 10,
        }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={{
          top: 90,
          width: 10,
          height: 10,
        }}
        isConnectable={isConnectable}
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

export default SplitTransformNode;
