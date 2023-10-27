import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Context from "./context/Context";

import ReactDOM from "react-dom/client";
var root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Context>
      <App />
    </Context>
  </BrowserRouter>
);
