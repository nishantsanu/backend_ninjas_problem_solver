const response = require("express");
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Ta = require('../models/ta');
const Doubt = require('../models/doubt');
const Comment= require('../models/comment');
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
        let newuser = Db.create({
            email: req.body.email,
            password: req.body.password,
            userType: userType
        })
        return res.status(200).json({
            message: "user created"
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
        let Db = Student;
        let user = await Db.findOne({ email: req.body.email });
        //if user is not found
        if (user && user.password != req.body.password) {
            return res.json(422, {
                message: 'Invalid Username/Password'
            });
        }
        else if (user) {
            //if user is found
            //returning token
            return res.json(200, {
                message: 'Sign In successful ,here is your token please keep it safe!',
                data: {
                    token: jwt.sign(user.toJSON(), 'doubtresolving', { expiresIn: '10000000' })
                },
                user: user,
            });
        };
        Db = Ta;
        user = await Db.findOne({ email: req.body.email });
        //if user is not found
        if (user && user.password != req.body.password) {
            return res.json(422, {
                message: 'Invalid Username/Password'
            });
        }
        else if (user) {
            //if user is found
            //returning token
            return res.json(200, {
                message: 'Sign In successful ,here is your token please keep it safe!',
                data: {
                    token: jwt.sign(user.toJSON(), 'doubtresolving', { expiresIn: '100000000' })
                },
                user: user,
            });
        }
        Db = Teacher;
        user = await Db.findOne({ email: req.body.email });
        //if user is not found
        if (user && user.password != req.body.password) {
            return res.json(422, {
                message: 'Invalid Username/Password'
            });
        }
        else if (user) {
            //if user is found
            //returning token
            return res.json(200, {
                message: 'Sign In successful ,here is your token please keep it safe!',
                data: {
                    token: jwt.sign(user.toJSON(), 'doubtresolving', { expiresIn: '100000000' })
                },
                user: user,
            });
        }
        return res.json(400, {
            message: 'Cant find any user with the token',
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
        // console.log(req);
        console.log(req.user._id);
        console.log(req.body);

        let newdoubt = Doubt.create({
            title: req.body.title,
            description: req.body.description,
            status: "active",
            postedBy: req.user._id,

        })
        let student = await Student.findById(req.user._id);

        student.doubts.push(newdoubt._id);
        await student.save();

        return res.status(200).json({
            message: "doubt created",
            doubt: newdoubt
        });


    } catch (error) {
        console.log("error while creating user " + error);
        return res.status(400).json({
            error: " coudnot create doubt"
        })
    }
}
//accept-doubt
module.exports.acceptDoubt = async (req, res) => {
    try {
        console.log(req.user._id);
        console.log(req.body.doubtId);
        let doubt = await Doubt.findById(req.body.doubtId);
        let ta = await Ta.findById(req.user._id);
        doubt.status = 'inresolution';
        doubt.assignedTo = req.user._id;
        ta.doubtsAccepted.push(req.body.doubtId);
        ta.anyActiveDoubt=true;
        ta.countAcceptedDoubt = (parseInt(ta.countAcceptedDoubt, 10) + 1).toString();
        await ta.save();
        await doubt.save();
        return res.status(200).json({
            message: 'doubt succesfully accepted'
        });
    } catch (error) {
        console.log("error while accepting doubt ---> " + error);
        return res.status(222).json({
            error: 'could not accept doubt'
        })
    }
}

//solved doubt
module.exports.solvedDoubt=async(req,res)=>{

    let doubt=await Doubt.findById(req.body.doubt);
    doubt.answer=req.body.answer;
    doubt.status='active';

    let ta=await Ta.findById(req.user._id);
    ta.countEscalatedDoubt=ta.countEscalatedDoubt+1;


    return res.status(200).json({
        doubt:doubt
    })

}

//solved doubt
module.exports.solvedDoubt=async(req,res)=>{

    let doubt=await Doubt.findById(req.body.doubt);
    doubt.answer=req.body.answer;
    doubt.solvedBy=req.user._id;
    doubt.status='solved';

    let ta=await Ta.findById(req.user._id);
    ta.countSolvedDoubt=ta.countSolvedDount+1;
    ta.solvedTime=(new Date()-new Date(doubt.createdAt))/60000;
    ta.anyActiveDoubt=false;

    return res.status(200).json({
        doubt:doubt
    })

}

//adding new comment
module.exports.addNewComment = async (req, res) => {
    try {
        // console.log(req.user._id);
        console.log(req.body.parentDoubt);
        let parentDoubt=await Doubt.findById(req.body.parentDoubt);
        let newComment = await Comment.create({
            parentDoubt: req.body.parentDoubt,
            description: req.body.commentDescription,
            commentedBy: req.user._id,
        })
        // await ta.save();
        console.log("before" +parentDoubt);
        parentDoubt.comments.push(newComment);
        await parentDoubt.save();
        // console.log("after" +parentDoubt.toString());
        return res.status(200).json({
            message: 'comment added succesfully',
            comment:newComment
        });
    } catch (error) {
        console.log("error while creating comment ---> "+error);
        return res.status(222).json({
            error: 'could not accept doubt'
        })
    }
}
//teachers dashboard
module.exports.getTeacherDashboard = async (req, res) => {
    //total doubt,total solved,total pending,total escalated
    //ta record
    try {
        const allDoubt = await Doubt.find({});
        var totalDoubt = 0, totalTime = 0.0, averageTime = 0.0, totalResolved = 0, totalEscalated = 0;
        allDoubt.map((doubt) => {
            if (doubt.status === 'solved') {
                totalResolved++;
                const endTime = new Date(doubt.solvedDate);
                const startTime = new Date(doubt.createdAt);
                totalTime += Math.round((endTime - startTime) / 60000);
            } else if (doubt.status === 'escalated') {
                totalEscalated++;
            }

            totalDoubt++;
        });

        averageTime = totalTime / totalResolved;

        const taList = await Ta.find({});

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
