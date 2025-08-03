const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
    }
}
//asyncHandler is higher order function that takes a function as an argument and returns a function.

export { asyncHandler }