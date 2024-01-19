import "./App.css";
import { Route, Routes } from "react-router";

import BlockLibraryModal from "./components/Popups/BlockLibraryModal";
import { useRootSelector } from "./redux/store/hooks";
import { Suspense, lazy } from "react";

const Home = lazy(() => import("./pages/Home/Home"));
function App() {
  const blockLibModalState = useRootSelector(
    (state) => state.blockLibModalState
  );

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={"Loading ..."}>
              <Home />
            </Suspense>
          }
        ></Route>
      </Routes>
      {/* MODALS */}
      <BlockLibraryModal isOpen={blockLibModalState.isOpen} />
    </>
  );
}

export default App;
