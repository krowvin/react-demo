/* eslint-disable react/prop-types */

import { useEffect, useState, useRef } from "react";
const CDA_ENDPOINT = "https://water.usace.army.mil/cwms-data";
// Set some sort of limit for new users learning with this library
// Ideally if you want users to have a large number of timeseries you would give pagination options to prevent overloading the server
const MAX_TS_ENTRIES = 5000

// Fetch available timeseries from the CDA Catalog
const fetchTimeseries = async (
  params,
  nextPageToken = null,
  accumulatedEntries = []
) => {
  if (nextPageToken) {
    params["page"] = nextPageToken; 
  }
  // Build the query uri dynamically based on the parameters given
  const queryString = new URLSearchParams(params).toString();
  try {
    // Fetch all available timeseries from the CDA
    const response = await fetch(`${CDA_ENDPOINT}/catalog/timeseries?${queryString}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const ts_data = await response.json();
    if (ts_data?.total > MAX_TS_ENTRIES) {
        throw new Error(
          `React Demo Error : Too many timeseries found, please refine your search! Max entries: ${MAX_TS_ENTRIES} - Your filter (${params}) returned: ${ts_data.total} entries`
        );
    }
    const newAccumulatedEntries = accumulatedEntries.concat(ts_data.entries);
    // Another page exists, recursively fetch the next page
    if (ts_data["next-page"]) {
      return fetchTimeseries(
        params,
        ts_data["next-page"],
        newAccumulatedEntries
      );
    } else {
      // All timeseries have been collected from CDA
      return { ...ts_data, entries: newAccumulatedEntries }; 
    }
  } catch (error) {
    console.error("Failed to fetch: ", error);
    return { error: error.message };
  }
};

const TSDropdown = ({ params, setSelectedTS, setLoadTime }) => {
  const [isTSSelected, setIsTSSelected] = useState(false);
  const [timeseries, setTimeseries] = useState(null);

  useEffect(() => {
    const startTime = window.performance.now();
    fetchTimeseries(params).then((ts_data) => {
      setTimeseries(ts_data);
      setLoadTime(
        ((window.performance.now() - startTime) / 1000).toFixed(2)
      );
    });
  }, [params, setLoadTime]);

  if (!timeseries) {
    return (
      <>
        <div className="spinner-border" role="status">
          <span className="visually-hidden"></span>
        </div>
        <span className="ms-3">Fetching Available Timeseries...</span>
      </>
    );
  } else if (timeseries?.error) {
    return <div>Error: {timeseries.error}</div>;
  } else if (timeseries?.entries?.length === 0) {
    return (
      <div className="m-2 text-center">
        <span className="text-danger">No Timeseries found </span> for the query
         <br />
        {CDA_ENDPOINT +
          `/catalog/timeseries?like=${params?.like}&office=${params?.office}`}
        <br />
        <br />
        Be sure to also change the like filter of the TS_FILTER in App.jsx!
      </div>
    );
  }

  return (
    <>
      <select
        className="form-select form-select-lg mb-3"
        aria-label=".form-select-lg example"
        onChange={(e) => {
          setSelectedTS(e.target.value);
          setIsTSSelected(true);
        }}
      >
        <option>Select Timeseries ID</option>
        {timeseries.entries.map((ts, idx) => (
          <option key={idx + ts.name} value={ts.name}>
            {ts.name}
          </option>
        ))}
      </select>
      {!isTSSelected && (
        <div className="ms-2 mt-1">Select a Timeseries to Begin!</div>
      )}
    </>
  );
};

export default TSDropdown;
