const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstname: {type: String, required: [true, 'Please provide your first name']},
    lastname: {type: String, required: [true, 'Please provide your last name']},
    email: {type: String, required: [true, 'Please provide your email address'], unique: [true, 'This email address is already taken, please try a new one.']},
    password: {type: String, required: [true, 'Please provide a password for your account'], minLength:[10, 'The password should be at least 10 characters'], maxLength:[64, 'Your password should be no more than 64 characters']}
});

userSchema.pre('save', function(next){
    let currentUser = this;
    if(!currentUser.isModified('password')){
        return next();
    }
    bcrypt.hash(currentUser.password, 10)
    .then(hash => {
        currentUser.password = hash;
        next();
    })
    .catch(err => next(error));
});

userSchema.methods.comparePasswords = function(providedPassword){
    let user = this;
    return bcrypt.compare(providedPassword, user.password);
}

module.exports = mongoose.model('User', userSchema);