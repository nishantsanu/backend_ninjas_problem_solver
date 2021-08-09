const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Ta = require('../models/ta');
let opts = {
    //finding jwt from request

    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    //key to encrypt/decrypt the token
    secretOrKey: 'doubtresolving'
}
// 
//telling passport to use jwt strategy
passport.use(new JWTStrategy(opts, async function (jwtPayLoad, done) {
    // var found=false;
    // let Db = Student;
    try {
        let student = await Student.findById(jwtPayLoad._id);
        if (user) {
            return done(null, student);
        }
        let ta = await Ta.findById(jwtPayLoad._id);
        if (ta) {
            return done(null, ta);
        }
        let teacher = await Teacher.findById(jwtPayLoad._id);
        if (teacher) {
            return done(null, teacher);
        }

        return done("error", false);
    } catch (error) {
        console.log("error in jwt strategy "+error);
        return done(error,false);
    }


    //  Student.findById(jwtPayLoad._id, function (err, user) {
    //     if (err) {
    //         return done(err,false);
    //     }

    //     //if user is found
    //     else if (user) {
    //         found=true;

    //         return done(null, user);
    //     }

    // });
    // // Db=Ta;
    // Ta.findById(jwtPayLoad._id, function (err, user) {
    //     if (err) {
    //         return done(err,false);
    //     }
    //     //if user is found
    //     else if (user) {
    //         found=true;
    //         return done(null, user);

    //     }
    // });
    // // Db=Teacher;
    // Teacher.findById(jwtPayLoad._id, function (err, user) {

    //     if (err) {

    //         return done(err,false);
    //     }
    //     //if user is found
    //     else if (user) {
    //         found=true;
    //         return done(null, user);
    //     }
    //     else if(found===false){
    //         return done(err,false);
    //     }
    // });
}));

module.exports = passport;