const express=require('express');
const router=express.Router();
const passport = require('passport');
const homeController=require('../controllers/home_controller');
const userController=require('../controllers/user_controller');


router.get('/',homeController.home);
router.post('/create-user',userController.create);

// use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {
        
    },
) ,userController.createSession);
// router.get('/signup',authcontrol)
// router.use('/users',require('./users'));
// router.use('/posts',require('./posts'));
// router.use('/comments',require('./comments'));
// router.use('/likes',require('./likes'));


module.exports=router;