
/* eslint-disable react/prop-types */

function LoadTime({ time, msg = "Load Time", inline = false }) {
    // Color the timestamp based on the time it took to load
  time =
    time > 2 ? (
      <span className="text-danger">{time}</span>
    ) : time > 1.5 ? (
      <span className="text-warning">{time}</span>
    ) : (
      <span className="text-success">{time}</span>
    );
  if (inline)
    return (
      <span>
        {msg}: {time}
      </span>
    );
  else
    return (
      <div
        className="text-center mt-1"
        title="Load times for timeseries catalog and data fetches from CDA."
      >
        <span className="fw-bold">{msg}: </span>
        {time}s
      </div>
    );
}

export default LoadTime;