import { useContext, useRef } from "react";
import {
  Edge,
  Node,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
} from "reactflow";
import { flowContext } from "../Context/FlowContext";
type NodeData = {
  value: number;
  key: string;
  selected: boolean;
  id: string;
};

type multiHandleDatatype = {
  [key: string]: Array<Array<string>>;
};
function useUpdateNodeDataHook() {
  const { nodes, edges } = useContext(flowContext);
  let isLastTarget = useRef(false),
    isLastConnectingEdge = useRef(false),
    isLastSource = useRef(true);

  function updateNodeOriginalData(
    nodeData: NodeData,
    updatedData: Array<Array<string>> | multiHandleDatatype
  ) {
    debugger;
    let tempUpdatedData = undefined;
    let tempNodes = structuredClone(nodes);
    isLastSource.current = true;
    isLastTarget.current = false;
    isLastConnectingEdge.current = false;
    let connectedEdges = getConnectedEdges(nodes, edges);
    let index = -1;
    index = connectedEdges.findIndex((item) => {
      if (item.source == nodeData.id) {
        return true;
      }
    });
    if (index != -1) {
      if (
        connectedEdges != null &&
        connectedEdges != undefined &&
        connectedEdges[index].sourceHandle !== null &&
        connectedEdges[index].sourceHandle !== undefined &&
        connectedEdges[index].sourceHandle != ""
      ) {
        tempNodes[Number(connectedEdges[index].source)].data.storedData =
          structuredClone(updatedData);

        tempUpdatedData = (updatedData as multiHandleDatatype)[
          (connectedEdges[index].sourceHandle as string) + "Side"
        ];
        let outgoers = getOutgoers(
          tempNodes[Number(connectedEdges[index].source)],
          nodes,
          edges
        );
        let oppositeEdgeIndex = connectedEdges.findIndex((item) => {
          if (
            item.source == nodeData.id &&
            item.sourceHandle != connectedEdges[index].sourceHandle
          ) {
            return true;
          }
        });
        let tempIsLastSource = isLastSource.current;
        let tempIsLastTarget = isLastTarget.current;
        let tempIsLastConnectingEdge = isLastConnectingEdge.current;
        //left
        if (outgoers.length > 0) {
          tempNodes = applyRecursiveNodeChange(
            Number(outgoers[0].id),
            tempNodes,
            tempUpdatedData
          );
        }

        tempUpdatedData = (updatedData as multiHandleDatatype)[
          (connectedEdges[oppositeEdgeIndex].sourceHandle as string) + "Side"
        ];
        isLastSource.current = tempIsLastSource;
        isLastTarget.current = tempIsLastTarget;
        isLastConnectingEdge.current = tempIsLastConnectingEdge;
        //right
        if (outgoers.length > 0) {
          tempNodes = applyRecursiveNodeChange(
            Number(outgoers[1].id),
            tempNodes,
            tempUpdatedData
          );
        }

        return tempNodes;
      }
    }
    tempUpdatedData = structuredClone(updatedData) as Array<Array<string>>;
    if (index == -1) {
      index = connectedEdges.findIndex((item) => {
        if (item.target == nodeData.id) {
          return true;
        }
      });
      isLastSource.current = false;
      isLastTarget.current = true;
    }
    tempNodes[Number(connectedEdges[index].source)].data.storedData =
      structuredClone(tempUpdatedData);
    if (isLastTarget.current == true) {
      return tempNodes;
    }
    let outgoers = getOutgoers(
      tempNodes[Number(connectedEdges[index].source)],
      nodes,
      edges
    );
    if (outgoers.length > 0) {
      tempNodes = applyRecursiveNodeChange(
        Number(outgoers[0].id),
        tempNodes,
        tempUpdatedData
      );
    }

    return tempNodes;
  }
  function applyRecursiveNodeChange(
    index: number,
    tempNodes: Node[],
    tempUpdatedData: Array<Array<string>>
  ) {
    let outgoers = getOutgoers(tempNodes[index], nodes, edges);
    let connectedEdges = getConnectedEdges(nodes, edges);
    if (tempNodes[index].type == "mergeTransform") {
      let mergeIncomers = connectedEdges.filter((item) => {
        if (Number(item.target) == index) {
          return true;
        }
      });
      let leftIndex = mergeIncomers.findIndex(
        (item) => item.targetHandle == "left"
      );
      let righttIndex = mergeIncomers.findIndex(
        (item) => item.targetHandle == "right"
      );

      let leftAr = structuredClone(
        tempNodes[Number(mergeIncomers[leftIndex].source)].data.storedData
      );

      let rightAr = structuredClone(
        tempNodes[Number(mergeIncomers[righttIndex].source)].data.storedData
      );

      if (leftAr.length < rightAr.length) {
        let diff = Math.abs(leftAr.length - rightAr.length);
        let cellCount = leftAr[0].length;
        for (let i = 0; i < diff; i++) {
          let cells = [];
          for (let j = 0; j < cellCount; j++) {
            cells.push("");
          }
          leftAr.push(cells);
        }
      }
      if (rightAr.length < leftAr.length) {
        let diff = Math.abs(leftAr.length - rightAr.length);
        let cellCount = rightAr[0].length;
        for (let i = 0; i < diff; i++) {
          let cells = [];
          for (let j = 0; j < cellCount; j++) {
            cells.push("");
          }
          rightAr.push(cells);
        }
      }
      let newRows = [];

      for (let i = 0; i < leftAr.length; i++) {
        newRows.push([...leftAr[i], ...rightAr[i]]);
      }
      tempNodes[index].data.originalData = structuredClone(newRows);
      tempNodes[index].data.storedData = structuredClone(newRows);
      tempUpdatedData = structuredClone(newRows);
    } else {
      tempNodes[index].data.originalData = structuredClone(tempUpdatedData);
      tempNodes[index].data.storedData = structuredClone(tempUpdatedData);
      tempNodes[index].data.changed = true;
    }

    if (outgoers.length == 0) {
      return tempNodes;
    } else {
      tempNodes = applyRecursiveNodeChange(
        Number(outgoers[0].id),
        tempNodes,
        tempUpdatedData
      );

      return tempNodes;
    }
  }
  return {
    updateNodeOriginalData,
  };
}

export default useUpdateNodeDataHook;
