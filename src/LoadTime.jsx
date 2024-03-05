
/* eslint-disable react/prop-types */

function LoadTime({ time, msg = "Load Time", inline = false }) {
  if (inline)
    return (
      <span>
        {msg}: {time}
      </span>
    );
  else
    return (
      <div className="text-center mt-1" title="Load times for timeseries catalog and data fetches from CDA.">
        {msg}: {time}
      </div>
    );
}

export default LoadTime;