const userModel = require('../models/userModel');
const Connection = require('../models/connectionModels');
const rsvpModel = require('../models/rsvp');

exports.signup = (req, res) => {
    return res.render('./user/signup');
};

exports.createUser = (req, res, next) => {
    let user = new userModel(req.body);
    if(user.email){
        user.email = user.email.toLowerCase();
    }

    user.save()
    .then(user => {
        req.flash('success', 'Registration completed.')
        res.redirect('/users/login');
    })
    .catch(err => {
        if(err.name == 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('back');
        }

        if(err.code === 11000){
            req.flash('error', 'Email is already in use');
            return res.redirect('back')
        }

        next(err);
    });
};

exports.getLogin = (req, res, next) => {
    return res.render('./user/login');
};

exports.login = (req, res, next) => {
    let email = req.body.email;
    if(email){
        email = email.toLowerCase();
    }

    let password = req.body.password;
    userModel.findOne({email: email})
    .then(user => {
        if(user){
            user.comparePasswords(password)
            .then(result => {
                if(result){
                    req.session.user = user._id;
                    req.flash('success', 'You have logged in');
                    res.redirect('/users/profile');
                } else {
                    req.flash('error', 'Password and Email do not match');
                    res.redirect('users/login');
                }
            });
        } else {
            req.flash('error', 'Provided email address is incorrect');
            res.redirect('/users/login');
        }
    })
    .catch(err=>next(err));
};

exports.profile = (req, res, next) => {
    let user_id = req.session.user;
    Promise.all([userModel.findById(user_id), Connection.find({host: user_id})]) // , rsvp.find({host: user_id}
    .then(results => {
        const [user, connections] = results; // , rsvps
        res.render('./user/profile', {user, connections}); // , rsvps
    })
    .catch(err=>next(err));
};

exports.logout= (req, res, next) => {
    req.session.destroy(err => {
        if(err){
            return next(err);
        } else {
            res.redirect('/');
        }
    });
}; 