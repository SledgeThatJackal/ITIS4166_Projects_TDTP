const {body, validationResult} = require('express-validator');

exports.idValidate = (req, res, next) => {
    let connectionId = req.params.id;
    if(!connectionId.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid Connection id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.resultValidate = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        error.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};

exports.signupValidate = [body('firstname', 'You have to provide a first name').notEmpty().trim().escape(),
                          body('lastname', 'You must provide a lastname').notEmpty().trim().escape(),
                          body('email', 'You must provide a valid email address').isEmail().trim().escape().normalizeEmail(),
                          body('password', 'You must provide a password that is at least 8 characters and no more than 64').isLength({min: 8, max: 64})];


exports.loginValidate = [body('email', 'You must provide a valid email address').isEmail().trim().escape().normalizeEmail(),
                         body('password', 'You must provide a password that is at least 8 characters and no more than 64').isLength({min: 8, max: 64})]

exports.connectionValidate = [body('connectionTopic', 'You have to provide a topic for the connection').notEmpty().trim().escape(),
                              body('connectionTitle', 'You must provide a title for the connection').notEmpty().trim().escape(),
                              body('details', 'You must provide details about the connection').notEmpty().trim().escape()];

