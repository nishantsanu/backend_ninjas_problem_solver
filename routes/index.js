const express=require('express');
const router=express.Router();
const passport = require('passport');
const homeController=require('../controllers/home_controller');
const userController=require('../controllers/user_controller');


router.get('/',homeController.home);
router.post('/create-user',userController.create);
router.post('/create-doubt',passport.authenticate('jwt',{session:false}),userController.createDoubt);
router.post('/doubt/accept-doubt',passport.authenticate('jwt',{session:false}),userController.acceptDoubt);
router.post('/doubt/add-comment',passport.authenticate('jwt',{session:false}),userController.addNewComment);
router.get('/teacher/dashboard',passport.authenticate('jwt',{session:false}),userController.getTeacherDashboard);
// ,passport.authenticate('jwt',{session:false})
// use passport as a middleware to authenticate
router.post('/create-session',userController.createSession);
router.post('/destroy-session',userController.destroySession);
// router.get('/signup',authcontrol)
// router.use('/users',require('./users'));
// router.use('/posts',require('./posts'));
// router.use('/comments',require('./comments'));
// router.use('/likes',require('./likes'));


module.exports=router;