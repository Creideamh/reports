const express = require('express');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require("path");

// user modules 
const connection = require('./utils/mysql-con');
const mongodbClient = require('./utils/mongodb');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);

// create app
const app = express();

// session data will be stored in mongodb
var store = new mongodbStore({
    uri: 'mongodb://127.0.0.1:27017/reports',
    collection: 'sessions'
  });



// initialize sessions
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

// mysql database connection
connection;

// MongoDB connection 
// mongodbClient();

// parse req to body-parser 
app.use(
    bodyparser.urlencoded({
        extended: true
    })
);

// set view engine
app.set('view engine', "ejs");


app.use(function(req,res,next){
    var _send = res.send;
   var sent = false;
   res.send = function(data){
       if(sent) return;
       _send.bind(res)(data);
       sent = true;
   };
   next();
});




// load assets 
app.use('/css', express.static(path.resolve(__dirname, 'public/css')));
app.use('/js', express.static(path.resolve(__dirname, 'public/js')));
app.use('/imgs', express.static(path.resolve(__dirname, 'public/imgs')));
app.use('/font-awesome', express.static(path.resolve(__dirname, 'public/fontawesom')));


// load routes
app.use('/', require('./routes/loginRoutes'));


app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}/`);
})