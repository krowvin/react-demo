
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
      <div>
        {msg}: {time}
      </div>
    );
}

export default LoadTime;