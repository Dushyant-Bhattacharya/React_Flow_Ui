import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.ts";
import FlowContext from "./Context/FlowContext.tsx";
import { ErrorBoundary } from "react-error-boundary";
import FallbackComp from "./components/ErrorBoundary/FallbackComp.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <FlowContext>
        <ErrorBoundary FallbackComponent={FallbackComp}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          </ErrorBoundary>
      </FlowContext>
    </Provider>
  </React.StrictMode>
);
