import React, { PropsWithChildren, createContext, useState } from "react";
import { Edge, Node } from "reactflow";

type initialStateType = {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
};

const initialState: initialStateType = {
  nodes: [],
  edges: [],
  setNodes: () => {},
  setEdges: () => {},
};
export const flowContext = createContext(initialState);
function FlowContext({ children }: PropsWithChildren) {
  const [nodes, setNodes] = useState<Node[]>(initialState.nodes);
  const [edges, setEdges] = useState<Edge[]>(initialState.edges);
  let obj = {
    nodes,
    setNodes,
    edges,
    setEdges,
  };
  return <flowContext.Provider value={obj}>{children}</flowContext.Provider>;
}

export default FlowContext;
