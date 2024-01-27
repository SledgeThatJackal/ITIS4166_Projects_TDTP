const { application } = require('express');
const express = require('express');
const override = require('method-override');
const mongoose = require('mongoose');
const connectionRoutes = require('./routes/connectionRoutes')
const generalRoutes = require('./routes/generalRoutes');
const userRoutes = require('./routes/userRoutes');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const server = express();

let dburl = 'mongodb://localhost:27017/NBAD'

let port = 8084;
let host = 'localhost';
server.set('view engine', 'ejs');

// Database connection / Server startup
mongoose.connect('mongodb://localhost:27017/NBAD')
.then(() => {
    server.listen(port, host => {
        console.log('Server started, running on port: ', port);
    });
})
.catch(err=>console.log(err.message));

// Middleware
server.use(session({
    secret: 'gdsiughstuwety823fds5723fdgd890sfd5',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongoUrl: dburl}),
    cookie: {maxAge: 3*60*60*1000}
}));

server.use(flash());

server.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

server.use(express.static('public'));
server.use(override('_method'));
server.use(express.urlencoded({extended: true}));

// Routes
server.use("/", generalRoutes);
server.use("/connections", connectionRoutes);
server.use("/users", userRoutes);

// Error Handling
server.use((req, res, next) => {
    let errorStatus = new Error(req.url + " - This URL could not be found the server");
    errorStatus.status = 404;
    next(errorStatus);
});

server.use((err, req, res, next) => {
    if(!err.status){
        err.status = 500;
        err.message = "There was an internal server error with your request."
    }

    res.status(err.status);
    res.render("error", {error: err});
});