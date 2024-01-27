const limitRate = require('express-rate-limit');

exports.limiter = limitRate({
    windowMs: 60 * 1000,
    max: 3,
    message: 'Too have tried to login too many times. Try again later.',
    handler: (req, res, next) => {
        let err = new Error('Too have tried to login too many times. Try again later.');
        err.status = 429;
        return next(err);
    }
});