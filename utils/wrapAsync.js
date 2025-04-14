module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // If an error occurs, pass it to the next middleware (error handler)
  };
}