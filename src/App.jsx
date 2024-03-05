import { useState } from "react";

import TSTable from "./TSTable";
import TSPlot from "./TSPlot";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [activeTab, setActiveTab] = useState("table");
  console.log("Tab: ", activeTab)
  return (
    <>
      <h1>CDA Demo + React</h1>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "plot" ? "active" : ""}`}
            aria-current="page"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("plot");
            }}
          >
            Plot
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "table" ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("table");
            }}
          >
            Tabulate
          </a>
        </li>
      </ul>
      {activeTab === "plot" && (
        <TSPlot
          params={{ name: "KEYS.elev.inst.1Hour.0.Ccp-rev", office: "SWT" }}
        />
      )}
      {activeTab === "table" && (
        <TSTable
          params={{ name: "KEYS.elev.inst.1Hour.0.Ccp-rev", office: "SWT" }}
        />
      )}
    </>
  );
}

export default App;
