const response = require("express");
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Ta = require('../models/ta');
const Doubt = require('../models/doubt');
const Comment = require('../models/comment');
const jwt = require('jsonwebtoken');

module.exports.create = async function (req, res) {
    try {
        console.log(req.body);
        if (!req.body) {
            return res.status(202).json({
                message: "Please fill the credentials"
            })
        }
        const userType = req.body.userType;
        let Db = Student;
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
        let newuser = await Db.create({
            email: req.body.email,
            password: req.body.password,
            userType: userType
        });
        let toSendUser = await Db.findById(newuser);

        return res.status(201).json({
            message: 'User Created',
            data: {
                token: jwt.sign(toSendUser.toJSON(), 'doubtresolving', { expiresIn: '10000000' })
            },
            user: newuser,
        })

    } catch (error) {
        console.log("error while creating user " + error);
        return res.status(400).json({
            error: " error in server side"
        })
    }
}

module.exports.createSession = async function (req, res) {
    try {
        let tempUser = req.body.userType;
        let Db = Student;
        if (tempUser === 'ta') {
            Db = Ta;
        } else if (tempUser === 'teacher') {
            Db = Teacher;
        }
        let user = await Db.findOne({ email: req.body.email });
        //if user is not found
        if (!user) {
            return res.status(400).json({
                message: 'user dont exist'
            })
        }
        else if (user.password != req.body.password) {
            return res.status(422).json({
                message: 'Invalid Username/Password'
            });
        }
        return res.status(200).json({
            message: 'Sign In successful ,here is your token please keep it safe!',
            data: {
                token: jwt.sign(user.toJSON(), 'doubtresolving', { expiresIn: '10000000' })
            },
            user: user,
        });
    }
    catch (err) {
        console.log('********error', err);
        return res.json(500, {
            message: 'internal server error'
        });
    }


}

module.exports.createDoubt = async (req, res) => {

    try {
        let newdoubt = await Doubt.create({
            title: req.body.title,
            description: req.body.description,
            status: "active",
            postedBy: req.user._id,

        });
        let student = await Student.findById(req.user._id);
        student.doubts.push(newdoubt._id);
        await student.save();

        return res.status(201).json({
            message: "doubt created",
            doubt: newdoubt
        });

    } catch (error) {
        console.log("error while creating user " + error);
        return res.status(400).json({
            error: " couldnot create doubt"
        })
    }
}
//accept-doubt
module.exports.acceptDoubt = async (req, res) => {
    try {
        let doubt = await Doubt.findById(req.body.doubtId);
        let ta = await Ta.findById(req.user._id);
        if (ta.anyActiveDoubt) {
            return res.status(400).json({
                message: 'you can solve one question at a time'
            })
        } else {
            doubt.status = 'inresolution';
            doubt.assignedTo = req.user._id;
            ta.doubtsAccepted.push(req.body.doubtId);
            ta.anyActiveDoubt = true;
            ta.countAcceptedDoubt = (parseInt(ta.countAcceptedDoubt, 10) + 1).toString();
            await ta.save();
            await doubt.save();
            return res.status(202).json({
                message: 'doubt succesfully accepted',
                doubt: doubt
            });
        }

    } catch (error) {
        console.log("error while accepting doubt ---> " + error);
        return res.status(400).json({
            error: 'could not accept doubt'
        })
    }
}

//escalate doubt
module.exports.escalateDoubt = async (req, res) => {
    try {
        console.log(req.body);
        let doubt = await Doubt.findById(req.body.doubt);
        doubt.status = 'escalated';
        await doubt.save();

        let ta = await Ta.findById(req.user._id);
        ta.countEscalatedDoubt = +ta.countEscalatedDoubt + 1;
        ta.anyActiveDoubt = false;

        await ta.save();

        return res.status(200).json({
            message: 'Doubt Escaled Successfully'
        })
    } catch (error) {
        return res.status(400).json({
            message: 'error while saving'
        })
    }
}

//solved doubt
module.exports.solvedDoubt = async (req, res) => {
    try {
        let doubt = await Doubt.findById(req.body.doubt);
        doubt.answer = req.body.answer;
        doubt.solvedBy = req.user._id;
        doubt.status = 'solved';
        doubt.solvedDate = new Date();
        await doubt.save();
        let ta = await Ta.findById(req.user._id);
        ta.countResolvedDoubt = +ta.countResolvedDoubt + 1;
        ta.solvedTime = (new Date() - new Date(doubt.createdAt)) / 60000;
        ta.anyActiveDoubt = false;



        await ta.save();

        return res.status(200).json({
            message: 'Doubt Solved Successfully'
        })
    } catch (error) {
        return res.status(400).json({
            message: 'error while saving'
        })
    }


}

//adding new comment
module.exports.addNewComment = async (req, res) => {
    try {
        let parentDoubt = await Doubt.findById(req.body.parentDoubt);

        let newComment = await Comment.create({
            parentDoubt: req.body.parentDoubt,
            description: req.body.commentDescription,
            commentedBy: req.user._id,
            commentatorName: req.user.email,
        });
        parentDoubt.comments.push(newComment);
        await parentDoubt.save();
        return res.status(200).json({
            message: 'comment added succesfully',
            comment: newComment
        });
    } catch (error) {
        console.log("error while creating comment ---> " + error);
        return res.status(222).json({
            error: 'could not accept doubt'
        })
    }
}
//teachers dashboard
module.exports.getTeacherDashboard = async (req, res) => {
    try {
        const allDoubt = await Doubt.find({});
        var totalDoubt = 0, totalTime = 0.0, averageTime = 0.0, totalResolved = 0, totalEscalated = 0;
        allDoubt.map((doubt) => {
            if (doubt.status === 'solved') {
                totalResolved++;
                const endTime = new Date(doubt.solvedDate);

                const startTime = new Date(doubt.createdAt);

                totalTime += Math.round((endTime - startTime) / 60000);
                console.log(totalTime);
            } else if (doubt.status === 'escalated') {
                totalEscalated++;
            }

            totalDoubt++;
        });

        averageTime = totalTime / totalResolved;

        const taList = await Ta.find({}).select('-password');
        console.log(taList);
        return res.status(200).json({
            totalDoubt: totalDoubt,
            totalResolved: totalResolved,
            averageTime: averageTime,
            totalEscalated: totalEscalated,
            taList: taList,
        })
    } catch (error) {
        console.log("error in getting teacher dashboard " + error);
        return res.status(222).json({
            message: "error in fetching dashboard data"
        })
    }
}

//sign-out
module.exports.destroySession = function (req, res) {
    req.logout();

    return res.status(200).json({
        message: "logout successful",
    });
}

