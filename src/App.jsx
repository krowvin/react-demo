import { useState, useEffect, useRef } from "react";

import TSTable from "./TSTable";
import TSPlot from "./TSPlot";
import TSDropdown from "./TSDropdown";

import "bootstrap/dist/css/bootstrap.min.css";
import LoadTime from "./LoadTime";

const OFFICE = "SWT"

function App() {
  const [activeTab, setActiveTab] = useState("table");
  const [selectedTS, setSelectedTS] = useState(null);
  // TODO: Some way to set this in the UI perhaps?
  const [tsCatalogParams, setTSParams] = useState({ office: OFFICE, like: "*1Hour.0.Ccp-Rev" });
  const [tsPlotParams, setTSPlotParams] = useState(null);
  const [tsTableParams, setTSTableParams] = useState(null);
  const [loadTime, setLoadTime] = useState(null);

  console.log("selected", selectedTS)
  useEffect(() => {
    if (selectedTS) {
      setTSTableParams({
        name: selectedTS,
        office: OFFICE,
      });
      setTSPlotParams({
        name: selectedTS,
        office: OFFICE,
      });
    }
  }, [selectedTS])
  
  return (
    <>
      <h1>{OFFICE} - CDA Demo + React</h1>
      <TSDropdown
        params={tsCatalogParams}
        setSelectedTS={setSelectedTS}
        setLoadTime={setLoadTime}
      />
      {selectedTS && (
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
      )}
      {selectedTS && activeTab === "plot" && (
        <TSPlot params={tsPlotParams} setLoadTime={setLoadTime} />
      )}
      {selectedTS && activeTab === "table" && (
        <TSTable params={tsTableParams} setLoadTime={setLoadTime} />
      )}
      <LoadTime time={loadTime} />
    </>
  );
}

export default App;
