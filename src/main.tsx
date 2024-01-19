import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store/store.ts";
import FlowContext from "./Context/FlowContext.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <FlowContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </FlowContext>
    </Provider>
  </React.StrictMode>
);
