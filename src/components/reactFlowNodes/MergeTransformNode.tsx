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
function MergeTransformNode({ data }: NodeProps<NodeData>) {
  const { nodes, setNodes, edges } = useContext(flowContext);
  const [findInputVal, setFindInputVal] = useState<string>("");
  const [findSelectVal, setFindSelectVal] = useState<string>("");
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
      setFindInputVal("");
      let tempNodes = structuredClone(nodes);
      tempNodes[Number(data.id)].data.changed = false;
      setNodes([...tempNodes]);
    }
  }, [nodes]);
  return (
    <>
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        style={{
          top: 30,
          width: 10,
          height: 10,
        }}
      />
      <Handle
        type="target"
        id="right"
        position={Position.Left}
        style={{
          top: 85,
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
        {data.key == "merge" && (
          <div
            className={`flex flex-col w-11/12 h-[7rem] justify-center mx-auto p-1 nodeid-${data.id}`}
          >
            <h3 className={`mx-auto text-2xl font-semibold nodeid-${data.id}`}>
              Merge
            </h3>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          top: 62,
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

export default MergeTransformNode;
