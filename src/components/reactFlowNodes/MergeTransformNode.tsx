import {
  useContext,
  useEffect,
} from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { flowContext } from "../../Context/FlowContext";


type NodeData = {
  value: number;
  key: string;
  selected: boolean;
  id: string;
};
function MergeTransformNode({ data }: NodeProps<NodeData>) {
  const { nodes, setNodes } = useContext(flowContext);

  useEffect(() => {
    if (
      nodes.length > 0 &&
      nodes[Number(data.id)].data.changed != undefined &&
      nodes[Number(data.id)].data.changed == true
    ) {

      const tempNodes = structuredClone(nodes);
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
        className={`nodeid-${data.id}`}
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
        className={`nodeid-${data.id}`}
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
        
      >
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
        className={`nodeid-${data.id}`}
        style={{
          top: 62,
          width: 10,
          height: 10,
        }}
      />
    </>
  );
}

export default MergeTransformNode;
