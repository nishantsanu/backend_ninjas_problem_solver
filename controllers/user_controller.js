const response = require("express");
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Ta = require('../models/ta');

module.exports.create = async function (req, res) {
    try {
        console.log(req.body);
        if (!req.body) {
            return res.status(202).json({
                message: "Please fill the credentials"
            })
        }
        const userType = req.body.userType;
        Db = Student;
        if (userType === "ta") {
            Db = Ta;
        } else if (userType === "teacher") {
            Db = Teacher;
        } else if (userType === "student") {
            Db = Student;
        }
        let user = await Db.findOne({ email: req.body.email });
        if (user) {
            return res.status(202).json({
                message: "user already exists"
            })
        }
        let newuser = Db.create({
            email: req.body.email,
            password: req.body.password,
            userType: userType
        })
        return res.status(200).json({
            message:"user created"
        })

    } catch (error) {
        console.log("error while creating user " + error);
        return res.status(400).json({
            error: " error in server side"
        })
    }
}

module.exports.createSession = async (req, res) => {
    console.log("session successfully created user type ");
    // return res.status(200).json({
    //     message:'loginsuccessful'
    // })
}