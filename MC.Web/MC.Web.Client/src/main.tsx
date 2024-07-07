import "moment/dist/locale/en-gb";
import "moment/dist/locale/tr";
import React from "react";
import ReactDOM from "react-dom/client";
import Master from "./Master";
import { HttpMessage } from "./components";
import "./utils/localizationService";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HttpMessage></HttpMessage>
    <Master />
  </React.StrictMode>
);
