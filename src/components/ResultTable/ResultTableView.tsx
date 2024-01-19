import  {
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useRootDispatch, useRootSelector } from "../../redux/store/hooks";

import { unparse } from "papaparse";
import { AnimatePresence, motion } from "framer-motion";
import { resultTableActions } from "../../redux/ResultTable/resultTableSlice";
type columnType = {
  title: string;
  dataIndex: string;
};

function ResultTableView() {
  const tableVisible = useRootSelector(
    (state) => state.resultTableState.visible
  );
  const tableRow = useRootSelector((state) => state.resultTableState.rows);
  const dispatch = useRootDispatch();
  const [data, setData] = useState<Array<Array<string>>>([]);
  const [columns, setColumns] = useState<columnType[]>([]);
  const [, startTransition] = useTransition();
  useEffect(() => {
    if (tableRow.length > 0) {
      startTransition(() => {
        const  tempColumns: columnType[] = [];
        const  tempRows = [];
        tableRow[0].forEach((item) => {
          const column: columnType = {
            title: item.toString(),
            dataIndex: item.toString(),
          };
          tempColumns.push(column);
        });
        for (let i = 1; i < tableRow.length; i++) {
          tempRows.push(tableRow[i]);
        }
        setColumns(tempColumns);
        setData(tempRows);
        console.log(tempRows);
      });
    }
  }, [tableRow]);
  const exportCsv = useCallback(() => {
    const csvData = unparse(tableRow);

    const urlString = "data:text/csv;base64," + window.btoa(csvData);
    const atag = document.createElement("a");
    atag.href = urlString;
    atag.download = "updatedCsv";
    atag.click();
  }, [tableRow]);
  return (
    <>
      <AnimatePresence>
        {tableVisible == true && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="flex flex-col gap-2 px-2 py-1"
          >
            <div className="flex flex-row items-center">
              <button
                className="font-semibold border text-blue-700 border-blue-500 px-2 p-1 rounded-lg bg-white  shadow-md shadow-neutral-400 hover:bg-blue-500 hover:text-white transition-all duration-150 hover:shadow-lg w-fit self-end hover:shadow-neutral-500 active:bg-blue-600 active:shadow-sm active:shadow-neutral-600"
                onClick={() => {
                  exportCsv();
                }}
              >
                Export To CSV
              </button>
              <button
                className="font-semibold border text-red-400 border-red-500 px-2 p-1 rounded-lg bg-white  shadow-md shadow-neutral-400 hover:bg-red-200 hover:text-red-500 transition-all duration-150 hover:shadow-lg w-fit self-end hover:shadow-neutral-500 active:bg-red-300 active:text-red-600 active:shadow-sm active:shadow-neutral-600 ml-auto "
                onClick={() => {
                  dispatch(resultTableActions.toogleVisible(false))
                }}
              >
                Hide
              </button>
            </div>
            <div className="flex flex-col h-[25rem] overflow-auto border ">
              <div className="flex flex-row   flex-nowrap  sticky top-0">
                {columns.map((item) => (
                  <div className="w-32 border flex-none bg-neutral-100">
                    {item.title}
                  </div>
                ))}
              </div>
              {data.map((row) => (
                <div className="flex flex-row flex-nowrap">
                  {row.map((cell) => (
                    <div className="w-32 border flex-none">{cell}</div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ResultTableView;
