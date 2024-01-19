import { useRootDispatch } from "../../redux/store/hooks";
import { blockLibModalActions } from "../../redux/BlockLibraryModal/blockLibModalStateSlice";
import { AnimatePresence, motion } from "framer-motion";
import BlockGroups from "./BlockLibraryModalComponents/BlockGroups";
import BlockComponents from "./BlockLibraryModalComponents/BlockComponents";
type propType = {
  isOpen: boolean;
};
function BlockLibraryModal({ isOpen }: propType) {
  const dispatch = useRootDispatch();
  return (
    <>
      <AnimatePresence>
        {isOpen == true && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="absolute left-0 top-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-sm z-[3]"
          >
            <div className="flex flex-col w-10/12 sm:w-8/12 md:w-8/12 lg:w-4/12 bg-white  rounded-lg shadow-lg shadow-neutral-400 h-fit
            min-h-[40vh]">
              <div className="flex flex-row w-full p-2">
                <button
                  className="ml-auto w-5 h-5 rounded-full bg-red-400 hover:bg-red-500 shadow-md shadow-neutral-400 hover:shadow-lg hover:shadow-neutral-400 transition-all duration-150 active:bg-red-600 active:shadow-sm active:shadow-neutral-500"
                  onClick={() => {
                    dispatch(blockLibModalActions.toggle());
                  }}
                ></button>
              </div>
              <div className="flex flex-row w-full h-full p-2 divide-x-2 divide-neutral-300 divide-opacity-30">
                <span className="w-1/4 h-fit px-5">
                  <BlockGroups />
                </span>
                <span className="w-3/4 h-full">
                  <BlockComponents />
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BlockLibraryModal;
