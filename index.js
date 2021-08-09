const express =require('express');
const bodyParser=require('body-parser');
require('dotenv').config();
const port=process.env.PORT || 8000;
const app=express();
const cors = require('cors');
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));


const db=require('./config/mongoose');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const MongoStore=require('connect-mongo');


// body parser configs
app.use(express.urlencoded());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
//mongo store is used to store session cookie in the db
app.use(session({
    name:'doubtresolution',
    secret:"doubtresolution",
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:MongoStore.create(
    {
        mongoUrl:'mongodb+srv://nishant:nishant.1234@cluster0.aywgg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        autoRemove:'disabled'
    },function(err){
        console.log(err || 'connect mongo set up ok');
    }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
//use express router
app.use('/',require('./routes'));

app.listen(process.env.PORT||port,function(err){
    if(err){
        console.log(`error is : ${err}`);
    }
    console.log(`port is running on port no:: ${port}`);
});