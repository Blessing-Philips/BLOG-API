//A function that can be called for every error encoutered

const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error
};

module.exports = { errorHandler };