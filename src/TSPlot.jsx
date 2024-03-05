import { useEffect, useState, useRef } from "react";
import Plotly from "plotly.js-basic-dist";

const CDA_ENDPOINT = "https://water.usace.army.mil/cwms-data";

const TSPlot = ({ params }) => {
  const [data, setData] = useState(null);
  const plotContainerRef = useRef(null); // Create a ref for the plot container

  // Load the timeseries when the component loads in
  useEffect(() => {
    const queryString = new URLSearchParams(params).toString();
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${CDA_ENDPOINT}/timeseries?${queryString}`,
          {
            headers: {
              accept: "application/json;version=2",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const ts_data = await response.json();
        ts_data.query_str = queryString;
        setData(ts_data);
      } catch (error) {
        console.error("Failed to fetch: ", error);
        setData({ error: error.message });
      }
    };

    fetchData();
  }, [params]);

  // Plot the data with Plotly
  useEffect(() => {
    if (data && data.values && plotContainerRef.current) {
      const plotData = [
        {
          x: data.values.map((value) => new Date(value[0])),
          y: data.values.map((value) => value[1]),
          type: "scatter",
          mode: "lines",
          marker: { color: "blue" },
        },
      ];

      const layout = {
        title: "Data Plot",
        xaxis: { title: "Time" },
        yaxis: { title: "Value" },
      };

      Plotly.newPlot(plotContainerRef.current, plotData, layout);
    }
  }, [data]); // Re-plot when data changes

  if (!data) {
    return <div>Loading...</div>;
  } else if (data.error) {
    return <div>Error: {data.error}</div>;
  } else if (data.values && data.values.length === 0) {
    return (
      <div>
        No data found for the query{" "}
        {`${CDA_ENDPOINT}/timeseries?${data.query_str}`}
      </div>
    );
  }

  return (
    <div
      ref={plotContainerRef}
      style={{ width: "100%", height: "400px" }}
    ></div>
  ); // This div will contain the plot
};

export default TSPlot;
