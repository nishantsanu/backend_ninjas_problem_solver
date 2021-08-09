const express =require('express');
const bodyParser=require('body-parser')
const port=process.env.PORT || 8000;
const app=express();
const cors = require('cors');
// enable all cors
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

const db=require('./config/mongoose');
//use for session cookie
const session=require('express-session');
const cookieParser=require('cookie-parser');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
//importing connect-mongo module and specifically a arguement named 'session'. 
const MongoStore=require('connect-mongo');


// body parser configs
app.use(express.urlencoded());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
//mongo store is used to store session cookie in the db
app.use(session({
    name:'doubtresolution',
    // TODO change the secret before deployment in production mode
    secret:"doubtresolution",
    saveUninitialized:false,
    resave:false,
    cookie:{
        //session set for 100 minutes
        maxAge:(1000*60*100)
    },
    //we are using here MongoStore instance
    store:MongoStore.create(
    {
        mongoUrl:'mongodb://localhost:27017/doubtresolution',
        autoRemove:'disabled'
    },function(err){
        console.log(err || 'connect mongo set up ok');
    }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.setAuthenticatedUser);
//use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        // console.log(err);
        //this is just interpolation `` -these backtics..
        //${} in these brackets the particular thing gets evaluated..
        //to include a variable inside a string .this is interpolation
        console.log(`error is : ${err}`);
    }
    console.log(`port is running on port no:: ${port}`);
});