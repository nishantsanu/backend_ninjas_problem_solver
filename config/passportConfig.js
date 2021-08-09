// const passport = require('passport');
//imported passport-local module and especially Strategy property..
const LocalStrategy = require('passport-local').Strategy;
//imported user
const Teacher = require('../models/teacher');
const Ta = require('../models/ta');
const Student = require('../models/student');

module.exports = function(passport){

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
}

