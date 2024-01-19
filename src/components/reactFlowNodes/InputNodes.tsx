import {
  ChangeEvent,
  useCallback,
  useContext,
  useRef,
  useState,
  useTransition,
} from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { flowContext } from "../../Context/FlowContext";
import { parse } from "papaparse";
import { useRootDispatch } from "../../redux/store/hooks";
import { resultTableActions } from "../../redux/ResultTable/ResultTableSlice";
import useUpdateNodeDataHook from "../../hooks/useUpdateNodeDataHook";
type NodeData = {
  value: number;
  key: string;
  selected: boolean;
  id: string;
};
function InputNodes({ data }: NodeProps<NodeData>) {
  const { nodes, setNodes, edges } = useContext(flowContext);
  const [, startTransition] = useTransition();
  const { updateNodeOriginalData } = useUpdateNodeDataHook();
  const [inputVal, setInputVal] = useState<string>("");
  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(evt.target.value);
    setInputVal(event.target.value);
  }, []);
  const dispatch = useRootDispatch();
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  return (
    <>
      {/* <Handle type="target" position={Position.Top} /> */}
      <div
        className={`bg-neutral-300 rounded-lg w-full flex flex-row overflow-hidden  transition-all duration-150
      ${data.selected == true && "bg-slate-200 border-blue-300 border"}
      nodeid-${data.id}`}
        // onClick={() => {
        //   debugger;
        //   let temp = structuredClone(nodes);
        //   let index = -1;
        //   temp.forEach((item, itemIndex) => {
        //     if (item.data.id == data.id) {
        //       index = itemIndex;
        //     }
        //     item.data.selected = false;
        //   });
        //   if (index != -1) {
        //     temp[index].data.selected = true;
        //   }
        //   setNodes([...temp]);
        // }}
      >
        {/* on click of a inputs type node , show the data stored inside its file in the table */}
        {data.key == "csv" && (
          <div className={`flex flex-col w-full p-2 nodeid-${data.id}`}>
            <h3 className={`font-semibold text-lg nodeid-${data.id}`}>File</h3>
            <div
              className={`flex flex-row items-center gap-1 nodeid-${data.id}`}
            >
              <input
                value={inputVal}
                onChange={onChange}
                className={`nodrag h-full pointer-events-none rounded-md shadow-md shadow-neutral-400 nodeid-${data.id}`}
              />
              <button
                className={`px-2 p-1 bg-neutral-200 rounded-lg shadow-md shadow-neutral-400 nodeid-${data.id}`}
                onClick={() => {
                  if (fileInputRef.current != null) {
                    fileInputRef.current.value = "";
                  }

                  fileInputRef.current?.click();
                }}
              >
                Browse
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              className="nodrag hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                debugger;
                const nodeData = data;
                setInputVal(
                  event.target.value.split("\\")[
                    event.target.value.split("\\").length - 1
                  ]
                );
                if (event.target.files != null) {
                  const reader = new FileReader();
                  reader.readAsDataURL(event.target.files[0]);
                  reader.onload = (data) => {
                    debugger;

                    startTransition(() => {
                      const result = data.target?.result as string;
                      const jsonCsv = parse(
                        window.atob(result.split("base64,")[1]),
                        {
                          worker: false,
                        }
                      );
                      if (
                        (jsonCsv.data[jsonCsv.data.length - 1] as Array<string>)
                          .length == 1 &&
                        (
                          jsonCsv.data[jsonCsv.data.length - 1] as Array<string>
                        )[0] == ""
                      ) {
                        jsonCsv.data.splice(jsonCsv.data.length - 1, 1);
                      }

                      if (jsonCsv.errors.length == 0) {
                        let tempNodes = structuredClone(nodes);
                        tempNodes[Number(nodeData.id)].data.storedData =
                          structuredClone(jsonCsv.data);
                        tempNodes[Number(nodeData.id)].data.originalData =
                          structuredClone(jsonCsv.data);
                        let targetId = "";
                        let edgeIndex = edges.findIndex((item) => {
                          if (item.source == nodeData.id) {
                            targetId = item.target;
                            return true;
                          }
                        });
                        if (edgeIndex != -1) {
                          tempNodes[Number(targetId)].data.storedData =
                            structuredClone(jsonCsv.data);
                          tempNodes[Number(targetId)].data.originalData =
                            structuredClone(jsonCsv.data);
                        }
                        tempNodes = updateNodeOriginalData(
                          nodeData,
                          structuredClone(jsonCsv.data) as Array<Array<string>>
                        );

                        dispatch(resultTableActions.setRows(jsonCsv.data));
                        dispatch(resultTableActions.toogleVisible(true));
                        setNodes([...tempNodes]);
                      }
                    });
                  };
                }
              }}
            />
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
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

export default InputNodes;
