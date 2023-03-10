const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);

const dotenv  = require('dotenv');
const path = require("path");
const routes = require('./server/routes/router.js');
const connectDB = require('./server/database/connection.js');


const app = express(); // app create

const mongodb_uri = 'mongodb://127.0.0.1:27017/reports';

const store = new mongodbStore({
    uri: mongodb_uri,
    collection: 'sessions',
});

app.use(session({
    secret: 'mysecret',
    resave: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    },
    saveUninitialized: false,
    store: store
}));

app.use((req,res, next)=>{
    res.locals.message = req.session.message;
    res.locals.user = req.session.user;

    delete req.session.message;
    next();
});

dotenv.config({
    path: '.env'
});

const PORT = process.env.PORT || 8080;


// log requests 
app.use(morgan('tiny'));

// MongoDB connection 
connectDB();

// parse req to body-parset
app.use(
    bodyparser.urlencoded({
        extended: true
    })
);


// set view engine
app.set('view engine', "ejs");
// app.set("views", path.resolve(__dirname, "/views/"));

// app.use(function(req,res,next){
//     var _send = res.send;
//    var sent = false;
//    res.send = function(data){
//        if(sent) return;
//        _send.bind(res)(data);
//        sent = true;
//    };
//    next();
// });

// load assets 
app.use('/css', express.static(path.resolve(__dirname, 'public/css')));
app.use('/js', express.static(path.resolve(__dirname, 'public/js')));
app.use('/imgs', express.static(path.resolve(__dirname, 'public/imgs')));
app.use('/icomoon', express.static(path.resolve(__dirname, 'public/icomoon')));




// load routes
app.use('/', require('./server/routes/router.js'));
app.use('/incidents',require('./server/routes/router')); 
app.use('/users', require('./server/routes/router'));




app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}/`);
})