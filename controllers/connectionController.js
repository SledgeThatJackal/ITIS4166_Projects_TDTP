const models = require('../models/connectionModels');
const rsvpModel = require('../models/rsvp');

exports.connections = (req, res, next) => {
    models.find()
    .then(connections => {
        const topicArr = [];
        let temp = 0;

        connections.forEach(connection => {
            let foundTopic = false;
            if(topicArr.length > 0){
                topicArr.forEach(topic => {
                    if(topic == connection.connectionTopic){
                        foundTopic = true;
                    }
                });
            }
           
            if(!foundTopic){
                topicArr[temp] = connection.connectionTopic;
                temp++;
            }
        });

        res.render("./connections/connections", {connection: connections, topic: topicArr});
    })
    .catch(err => next(err));
};

exports.newConnection = (req, res) => {
    res.render("./connections/newConnection");
};

exports.createConnection = (req, res, next) => {
    let connection = new models(req.body);
    connection.host = req.session.user;
    connection.save()
    .then(connection => {
        req.flash('success', 'The connection has been created');
        res.redirect('/connections')
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    });
};

exports.showConnection = (req, res, next) => {
    let connectionId = req.params.id;

    models.findById(connectionId).populate('host', 'firstname lastname')
    .then(connection => {
        if(connection){
            res.render("./connections/connection", {connection});
        } else {
            let errorStatus = new Error("There is no connection with the id: " + connectionId);
            errorStatus.status = 400;
            next(errorStatus);
        }
    })
    .catch(err => next(err));
};

exports.editConnection = (req, res, next) => {
    let connectionId = req.params.id;

    models.findById(connectionId)
    .then(connection => {
        return res.render("./connections/editConnection", {connection});
    })
    .catch(err => next(err));
};

exports.updateConnection = (req, res, next) => {
    let connection = req.body;
    let connectionId = req.params.id;
    
    models.findByIdAndUpdate(connectionId, connection, {useFindAndModify: false, runValidators: true})
    .then(connection => {
        return res.redirect('/connections/' + connectionId);
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err)
    });
};

exports.deleteConnection = (req, res, next) => {
    let connectionId = req.params.id;

    models.findByIdAndDelete(connectionId, {useFindAndModify: false})
    .then(connection => {
        res.redirect("/connections");
    })
    .catch(err => next(err));
};

exports.rsvpConnection = (req, res, next) => {
    let connection = req.params.id;
    let user = req.session.user;
    let status = String(req.body.rsvpStatus).toUpperCase();
    
    if(rsvpModel.length){
        rsvpModel.find({event: connection, attendee: user})
        .then(rsvp => {
            if(rsvp.length){
                rsvp.status = status;
                rsvp.save()
                .then(() => {
                    return res.redirect('/connections/' + req.params.id);
                })
            } else {
                newRSVP = new rsvpModel(connection, user, status);
                newRSVP.save()
                .then(() => {
                    return res.redirect('/connections/' + req.params.id);
                })
            }
        })
        .catch(err => {
            if(err.name === 'ValidationError'){
                req.flash('error', err.message);
                return res.redirect('/back')
            }
            next(err);
        });
    } else {
        newRSVP = new rsvpModel(connection, user, status);
        newRSVP.save()
        .then(() => {
            return res.redirect('/connections/' + req.params.id);
        })
        .catch(err => {
            if(err.name === 'ValidationError'){
                req.flash('error', err.message);
                return res.redirect('/back')
            }
            next(err);
        });
    }
};