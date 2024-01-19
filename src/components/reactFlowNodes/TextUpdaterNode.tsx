import { ReactEventHandler, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";

const handleStyle = { left: 10 };
type NodeData = {
  value: number;
};
function TextUpdaterNode({ data }: NodeProps<NodeData>) {
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="bg-red-400 w-full p-2 flex flex-row overflow-hidden">
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" className=" w-10 h-10 rounded-md bg-pink-500" position={Position.Right} id="a" />
      {/* <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      /> */}
    </>
  );
}

export default TextUpdaterNode;
