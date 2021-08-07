const passport = require('passport');
//imported passport-local module and especially Strategy property..
const LocalStrategy = require('passport-local').Strategy;
//imported user
const Teacher = require('../models/teacher');
const Ta = require('../models/ta');
const Student = require('../models/student');

//authentication using passport.js
passport.use(new LocalStrategy({
    //usernameField is inbuilt..
    usernameField: 'email',
    /*specially added this statement to enable req object as arguement
    in below callback function..
    to add a flash message in req object..*/
    passReqToCallback: true
},
    function (req, email, password, done) {
        console.log("inside local");
        //find the student and establish the identity
        Student.findOne({ email: email }, function (err, student) {
            if (err) {
                return done(err);
            }
            if (!student || student.password != password) {
                return done(null, false);
            }
            console.log(student);
            return done(null, student);
        });
        //find the teacher and establish the identity
        Teacher.findOne({ email: email }, function (err, teacher) {
            if (err) {
                return done(err);
            }
            if (!teacher || teacher.password != password) {
                return done(null, false);
            }
            console.log(teacher);
            return done(null, teacher);
        });
        //find the Ta and establish the identity
        Ta.findOne({ email: email }, function (err, ta) {
            if (err) {
                return done(err);
            }
            if (!ta || ta.password != password) {
                return done(null, false);
            }
             console.log(ta);
            return done(null, ta);
        });

    }
));

//serialising the user and decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
    console.log("inside serial +"+ user.id);

     done(null, user.id);
});
//deserialing the user  from the key in cookies
passport.deserializeUser(function (id, done) {
    console.log("inside deserial");

    Db = Student;
    console.log("id is "+id);
    // if (userType === "ta") {
    //     Db = Ta;
    // } else if (userType === "teacher") {
    //     Db = Teacher;
    // } else if (userType === "student") {
    //     Db = Student;
    // }
    Db.findById(id, function (err, user) {
        if (err) {
            console.log('error in finding user --> passport ');
            return done(err);

        }
        return done(null, user);
    });

    Db=Teacher;
    Db.findById(id, function (err, user) {
        if (err) {
            console.log('error in finding user --> passport ');
            return done(err);

        }
        return done(null, user);
    });
    Db=Ta;
    Db.findById(id, function (err, user) {
        if (err) {
            console.log('error in finding user --> passport ');
            return done(err);

        }
        return done(null, user);
    });

});
//to check that user is authenticated or not 
//it is passed as a middle ware
passport.checkAuthentication = function (req, res, next) {
    //if user is signed in then pass the request on next(controller action)
    console.log("inside chexk auth");

    if (req.isAuthenticated()) {
        return next();
    }
    //if user is not signed in
    return res.status(401).json({
        message:"user arleady signed in"
    });
}
passport.setAuthenticatedUser = function (req, res, next) {
    console.log("set authenticated user");
    if (req.isAuthenticated()) {

        /* req.user contains the current signed in user 
        from the session cookie and we are just sending 
        this to the locals for the views*/
        res.locals.user = req.user;
        //    console.log(req);

    }
    //to run the next process
    next();



}
module.exports = passport;