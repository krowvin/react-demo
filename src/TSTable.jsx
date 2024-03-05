import { useEffect, useState } from "react";

const CDA_ENDPOINT = "https://water.usace.army.mil/cwms-data";

const TSTable = ({params}) => {
  const [data, setData] = useState(null);

  // Load the timeseries when the component loads in
  useEffect(() => {
    // Convert the incoming parameters for the data table into URI parameters
    const queryString = new URLSearchParams(params).toString();
    const fetchData = async () => {
      try {
        fetch(CDA_ENDPOINT + `/timeseries?${queryString}`, {
          headers: {
            accept: "application/json;version=2"
          }
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch: ", response.statusText);
            }
            return response.json();
          })
          .then((ts_data) => {
            ts_data.query_str = queryString;
            setData(ts_data);
          })
          .catch((error) => {
            setData({ error: error.message });
            console.error("Failed to fetch: ", error);
          });
      } catch (error) {
        console.error("Failed to fetch: ", error);
      }
    };
    fetchData();
  }, [params]);
  //   Let the user know the data is on it's way!
  if (!data) {
    return <div>Loading...</div>;
  } else if (data?.error) {
    return <div>Error: {data.error}</div>;
  } else if (data?.values.length == 0) {
        return (
          <div>
            No data found for the query{" "}
            {CDA_ENDPOINT + `/timeseries?${data?.query_str}`}
          </div>
        );
  }
  console.log(data)
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date-Time</th>
          <th>Value</th>
          <th>Quality Code</th>
        </tr>
      </thead>
      <tbody>
        {data?.values.map((row, index) => {
           let { 0: date, 1: value, 2: quality } = row;
           return (
             <tr key={index}>
               <td>{new Date(date).toLocaleString()}</td>
               <td>{value ? value.toFixed(2) : '----'}</td>
               <td>{quality}</td>
             </tr>
           );})}
      </tbody>
    </table>
  );
};

export default TSTable;
