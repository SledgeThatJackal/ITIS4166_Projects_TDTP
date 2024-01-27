const Connection = require('../models/connectionModels');

exports.guest = (req, res, next) => {
    if(req.session.user){
        req.flash('error', 'You have already logged in');
        return res.redirect('/users/profile');
    } else {
        return next();
    }
};

exports.currentlyLoggedIn = (req, res, next) => {
    if(req.session.user){
        return next();
    } else {
        req.flash('error', 'You must login first');
        return res.redirect('/users/login');
    }
};

exports.isHost = (req, res, next) => {
    let connectionId = req.params.id;
    Connection.findById(connectionId)
    .then(connection => {
        if(connection){
            if(connection.host == req.session.user){
                return next();
            } else{
                let err = new Error('You are not authorized to access this');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('The connection with id ' + req.params.id + ' could not be found');
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};