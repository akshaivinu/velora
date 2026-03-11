const Loader = ({ message = "Loading..." }) => (
  <div className="loader">
    <span className="loader__spinner" aria-hidden />
    <p>{message}</p>
  </div>
);

export default Loader;
