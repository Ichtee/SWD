const errorHandler = (err, req, res, next) => {
    console.error('Error stack:', err.stack || err.message);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        error: err.message || 'System error. Please try again later.'
    });
};

module.exports = errorHandler;
