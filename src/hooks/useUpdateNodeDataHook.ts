import { useContext, useRef } from "react";
import {
  Node,
  getConnectedEdges,
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
  const isLastTarget = useRef(false),
    isLastConnectingEdge = useRef(false),
    isLastSource = useRef(true);

  function updateNodeOriginalData(
    nodeData: NodeData,
    updatedData: Array<Array<string>> | multiHandleDatatype
  ) {
    //debugger;
    let tempUpdatedData = undefined;
    let tempNodes = structuredClone(nodes);
    isLastSource.current = true;
    isLastTarget.current = false;
    isLastConnectingEdge.current = false;
    const connectedEdges = getConnectedEdges(nodes, edges);
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
        const outgoers = getOutgoers(
          tempNodes[Number(connectedEdges[index].source)],
          nodes,
          edges
        );
        const oppositeEdgeIndex = connectedEdges.findIndex((item) => {
          if (
            item.source == nodeData.id &&
            item.sourceHandle != connectedEdges[index].sourceHandle
          ) {
            return true;
          }
        });
        const tempIsLastSource = isLastSource.current;
        const tempIsLastTarget = isLastTarget.current;
        const tempIsLastConnectingEdge = isLastConnectingEdge.current;
        //left
        if (outgoers.length > 1) {
          tempNodes = applyRecursiveNodeChange(
            Number(outgoers[0].id),
            tempNodes,
            tempUpdatedData
          );
        }
        if (outgoers.length == 1) {
          tempNodes = applyRecursiveNodeChange(
            Number(outgoers[0].id),
            tempNodes,
            tempUpdatedData
          );
        }
        if (oppositeEdgeIndex != -1) {
          tempUpdatedData = (updatedData as multiHandleDatatype)[
            (connectedEdges[oppositeEdgeIndex].sourceHandle as string) + "Side"
          ];
          isLastSource.current = tempIsLastSource;
          isLastTarget.current = tempIsLastTarget;
          isLastConnectingEdge.current = tempIsLastConnectingEdge;
          //right
          if (outgoers.length > 1) {
            tempNodes = applyRecursiveNodeChange(
              Number(outgoers[1].id),
              tempNodes,
              tempUpdatedData
            );
          }
          if (outgoers.length == 1) {
            tempNodes = applyRecursiveNodeChange(
              Number(outgoers[0].id),
              tempNodes,
              tempUpdatedData
            );
          }
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
    tempNodes[Number(connectedEdges[index].target)].data.storedData =
      structuredClone(tempUpdatedData);
    if (isLastTarget.current == true) {
      return tempNodes;
    }
    const outgoers = getOutgoers(
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
    const outgoers = getOutgoers(tempNodes[index], nodes, edges);
    const connectedEdges = getConnectedEdges(nodes, edges);
    if (tempNodes[index].type == "mergeTransform") {
      const mergeIncomers = connectedEdges.filter((item) => {
        if (Number(item.target) == index) {
          return true;
        }
      });
      const leftIndex = mergeIncomers.findIndex(
        (item) => item.targetHandle == "left"
      );
      const righttIndex = mergeIncomers.findIndex(
        (item) => item.targetHandle == "right"
      );

      let leftAr = undefined;
      if(
        tempNodes[Number(mergeIncomers[leftIndex].source)].data.storedData.leftSide == undefined
      )
      {
        leftAr = structuredClone(
          tempNodes[Number(mergeIncomers[leftIndex].source)].data.storedData
        );
      }
      else
      {
        leftAr = structuredClone(
          tempNodes[Number(mergeIncomers[leftIndex].source)].data.storedData.leftSide
        );
      }

      let rightAr = undefined;
      if(
        tempNodes[Number(mergeIncomers[righttIndex].source)].data.storedData.rightSide == undefined
      )
      {
        rightAr = structuredClone(
          tempNodes[Number(mergeIncomers[righttIndex].source)].data.storedData
        );
      }
      else
      {
        rightAr  =structuredClone(
          tempNodes[Number(mergeIncomers[righttIndex].source)].data.storedData.rightSide
        );
      }

      if (leftAr.length < rightAr.length) {
        const diff = Math.abs(leftAr.length - rightAr.length);
        const cellCount = leftAr[0].length;
        for (let i = 0; i < diff; i++) {
          const cells = [];
          for (let j = 0; j < cellCount; j++) {
            cells.push("");
          }
          leftAr.push(cells);
        }
      }
      if (rightAr.length < leftAr.length) {
        const diff = Math.abs(leftAr.length - rightAr.length);
        const cellCount = rightAr[0].length;
        for (let i = 0; i < diff; i++) {
          const cells = [];
          for (let j = 0; j < cellCount; j++) {
            cells.push("");
          }
          rightAr.push(cells);
        }
      }
      const newRows = [];

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
