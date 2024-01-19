import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRootDispatch, useRootSelector } from "../../redux/store/hooks";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeDragHandler,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  getConnectedEdges,
} from "reactflow";
import TextUpdaterNode from "../../components/reactFlowNodes/TextUpdaterNode";
import "reactflow/dist/style.css";
import { blockLibModalActions } from "../../redux/BlockLibraryModal/blockLibModalStateSlice";
import InputNodes from "../../components/reactFlowNodes/InputNodes";
import { flowContext } from "../../Context/FlowContext";
import FindTransformNodes from "../../components/reactFlowNodes/FindTransformNodes";
import { resultTableActions } from "../../redux/ResultTable/ResultTableSlice";
import ResultTableView from "../../components/ResultTable/ResultTableView";
import FilterTransformNode from "../../components/reactFlowNodes/FilterTransformNode";
import SortTransformNode from "../../components/reactFlowNodes/SortTransformNode";
import SplitTransformNode from "../../components/reactFlowNodes/SplitTransformNode";
import MergeTransformNode from "../../components/reactFlowNodes/MergeTransformNode";

const nodetypes = {
  textUpdater: TextUpdaterNode,
  inputs: InputNodes,
  findTransform: FindTransformNodes,
  filterTransform: FilterTransformNode,
  sortTransform: SortTransformNode,
  splitTransform: SplitTransformNode,
  mergeTransform: MergeTransformNode,
};

function Home() {
  const edgeUpdated = useRef(false);
  const dispatch = useRootDispatch();
  // const cached
  const currentBlock = useRootSelector(
    (state) => state.blockLibModalState.currentBlock
  );
  const { edges, nodes, setEdges, setNodes } = useContext(flowContext);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    debugger;
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);
  const onConnect: OnConnect = useCallback(
    (params) => {
      debugger;
      let targetId = params.target;
      let sourceId = params.source;
      let tempNodes = structuredClone(nodes);
      if (
        tempNodes[Number(sourceId)].data.storedData !== undefined &&
        tempNodes[Number(sourceId)].data.storedData !== null
      ) {
        let copyData = undefined;
        if (params.sourceHandle == "" || params.sourceHandle == null) {
          copyData = structuredClone(
            tempNodes[Number(sourceId)].data.storedData
          );
        } else {
          copyData = structuredClone(
            tempNodes[Number(sourceId)].data.storedData[
              params.sourceHandle + "Side"
            ]
          );
        }
        if (params.targetHandle == "" || params.targetHandle == null) {
          tempNodes[Number(targetId)].data.storedData =
            structuredClone(copyData);
          tempNodes[Number(targetId)].data.originalData =
            structuredClone(copyData);
        } else {
          if (tempNodes[Number(targetId)].data.storedData == undefined) {
            tempNodes[Number(targetId)].data.storedData =
              structuredClone(copyData);
            tempNodes[Number(targetId)].data.originalData =
              structuredClone(copyData);
          } else {
            let temp: Array<Array<string>> = structuredClone(
              tempNodes[Number(targetId)].data.storedData
            );
            let tempCopyData: Array<Array<string>> = structuredClone(copyData);

            if (temp.length < tempCopyData.length) {
              let diff = Math.abs(temp.length - tempCopyData.length);
              let cellCount = temp[0].length;
              for (let i = 0; i < diff; i++) {
                let cells = [];
                for (let j = 0; j < cellCount; j++) {
                  cells.push("");
                }
                temp.push(cells);
              }
            }
            if (tempCopyData.length < temp.length) {
              let diff = Math.abs(temp.length - tempCopyData.length);
              let cellCount = tempCopyData[0].length;
              for (let i = 0; i < diff; i++) {
                let cells = [];
                for (let j = 0; j < cellCount; j++) {
                  cells.push("");
                }
                tempCopyData.push(cells);
              }
            }
            let newRows = [];

            for (let i = 0; i < temp.length; i++) {
              let positionObj = {
                left: [...tempCopyData[i], ...temp[i]],
                right: [...temp[i], ...tempCopyData[i]],
              };
              if (params.targetHandle == "left") {
                newRows.push(positionObj.left);
              }
              if (params.targetHandle == "right") {
                newRows.push(positionObj.right);
              }
            }
            tempNodes[Number(targetId)].data.storedData =
              structuredClone(newRows);
            tempNodes[Number(targetId)].data.originalData =
              structuredClone(newRows);
          }
        }

        setNodes([...tempNodes]);
      }
      edgeUpdated.current = false;
      setEdges((eds) => addEdge(params, eds));
    },
    [nodes]
  );
  useEffect(() => {
    debugger;
    if (edges.length != 0 && edgeUpdated.current == false) {
      let tempEdges = structuredClone(edges);
      tempEdges.forEach((item) => {
        item.animated = true;
      });
      edgeUpdated.current = true;
      setEdges([...tempEdges]);
    }
  }, [edges]);
  useEffect(() => {
    debugger;
    if (currentBlock != null) {
      let tempNodes = structuredClone(nodes);
      let nodePayload: Node = {
        id: tempNodes.length.toString(),
        data: {
          ...currentBlock,
          selected: false,
          id: tempNodes.length.toString(),
        },
        type: currentBlock.type,
        position: {
          x:
            tempNodes.length == 0
              ? 0
              : tempNodes[tempNodes.length - 1].position.x,
          y:
            tempNodes.length == 0
              ? 0
              : tempNodes[tempNodes.length - 1].position.y + 50,
        },
      };
      tempNodes.push(nodePayload);
      setNodes([...tempNodes]);
      dispatch(blockLibModalActions.setCurrentBlock(null));
    }
  }, [currentBlock]);

  const nodeHighlight = (event: React.MouseEvent<Element, MouseEvent>) => {
    // debugger;

    let className = (event.target as Element).className.split(" ");
    let idIndex = className.findIndex((item) => {
      if (item.includes("nodeid-") == true) {
        return true;
      }
    });
    let index = Number(className[idIndex].split("-")[1]);
    let tempNodes = structuredClone(nodes);
    tempNodes.forEach((item) => {
      item.data.selected = false;
    });

    if (index != -1) {
      tempNodes[index].data.selected = true;
      setNodes([...tempNodes]);

      if (tempNodes[index].data.storedData != null) {
        if (
          tempNodes[index].data.storedData.leftSide === undefined &&
          tempNodes[index].data.storedData.rightSide === undefined
        ) {
          dispatch(
            resultTableActions.setRows(tempNodes[index].data.storedData)
          );
        } else {
          let rows: Array<Array<string>> = [];
          for (
            let i = 0;
            i < tempNodes[index].data.storedData.leftSide.length;
            i++
          ) {
            rows.push([
              ...tempNodes[index].data.storedData.leftSide[i],
              ...tempNodes[index].data.storedData.rightSide[i],
            ]);
          }
          dispatch(resultTableActions.setRows(rows));
        }

        dispatch(resultTableActions.toogleVisible(true));
      } else {
        dispatch(resultTableActions.toogleVisible(false));
      }
    }
  };
  return (
    <div className="w-full  flex flex-col h-[100vh] ">
      <div className=" w-full absolute left-0 top-0">
        <nav className="relative z-[2] left-0 top-0 p-2 w-full flex flex-row">
          <button
            className="font-semibold border text-blue-700 border-blue-500 px-2 p-1 rounded-lg  shadow-md hover:bg-blue-500 hover:text-white transition-all duration-150 hover:shadow-lg hover:shadow-neutral-400 active:bg-blue-600 active:shadow-sm active:shadow-neutral-300"
            onClick={() => {
              dispatch(blockLibModalActions.toggle());
            }}
          >
            + Blocks
          </button>
          <div className="flex flex-row ml-auto gap-2">
            <button
              className="font-semibold border text-blue-700 border-blue-500 px-2 p-1 rounded-lg  shadow-md hover:bg-blue-500 hover:text-white transition-all duration-150 hover:shadow-lg hover:shadow-neutral-400 active:bg-blue-600 active:shadow-sm active:shadow-neutral-300 "
              onClick={() => {
                debugger;
                let payload = {
                  nodes: structuredClone(nodes),
                  edges: structuredClone(edges),
                };
                localStorage.setItem(
                  "dhiwise_workflow",
                  JSON.stringify(payload)
                );
              }}
            >
              Save
            </button>
            <button
              className="font-semibold border text-blue-700 border-blue-500 px-2 p-1 rounded-lg  shadow-md hover:bg-blue-500 hover:text-white transition-all duration-150 hover:shadow-lg hover:shadow-neutral-400 active:bg-blue-600 active:shadow-sm active:shadow-neutral-300 "
              onClick={() => {
                if (localStorage.getItem("dhiwise_workflow") != null) {
                  debugger;
                  let payload: {
                    nodes: Node[];
                    edges: Edge[];
                  } = JSON.parse(
                    localStorage.getItem("dhiwise_workflow") as string
                  );
                  setNodes(payload.nodes);
                  setEdges(payload.edges);
                }
              }}
            >
              Restore
            </button>
          </div>
        </nav>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodetypes}
        fitView
        onNodeDragStart={nodeHighlight}
        onNodeClick={nodeHighlight}
        isValidConnection={(event) => {
          // debugger;
          let targetId = event.target;
          let index = edges.findIndex((item) => {
            if (item.target == targetId) {
              return true;
            }
          });

          if (
            (index == -1 && nodes[Number(targetId)].data.key == "find") ||
            nodes[Number(targetId)].data.key == "filter" ||
            nodes[Number(targetId)].data.key == "sort" ||
            nodes[Number(targetId)].data.key == "split" ||
            nodes[Number(targetId)].data.key == "merge"
          ) {
            return true;
          } else {
            return false;
          }
        }}
      >
        <Background color="#ffffff" />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
      <ResultTableView />
    </div>
  );
}

export default Home;
