// const passport=require('passport');
// const JWTStrategy=require('passport-jwt').Strategy;
// const ExtractJWT = require('passport-jwt').ExtractJwt;

// const Student =require('../models/student');
// const Teacher=require('../models/teacher');
// const Ta=require('../models/ta');
// let opts={
//     //finding jwt from request
//     jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
//     //key to encrypt/decrypt the token
//     secretOrKey:"passport_secret_key"
// }
// //telling passport to use jwt strategy
// passport.use(new JWTStrategy(opts,function(jwtPayLoad,done){
//    student.findById(jwtPayLoad._id,function(err,user){
//        if(err){
//            console.log('error in finding user from jwt');
//            return;
//        }
//        //if user is found
//        if(user){
//             return done(null,user);
//        }
//        //if user is not found
//        else{
//            return done(null,false);
//        }
//    })
// }));

// module.exports=passport;