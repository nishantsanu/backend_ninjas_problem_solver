// const Post=require('../models/post');
// const User=require('../models/user');
// const Comment=require('../models/comment');

const response = require("express");
const Doubt = require('../models/doubt');



//module.exports.action_name= function(req,res){}
module.exports.home = async function (req, res) {
   //console.log("inside home controller");
   try {

      // CHANGE :: populate the likes of each post and comment
      //populate the post of each user
      let doubts = await Doubt.find({})
         .sort('-createdAt')
         //    //populating user field of post schema
         .populate({
            path: 'postedBy',
            select: 'email',
         })
         .populate({
            path:'comments',
            // populate:{
            //    path:'commentedBy',
            //    select:'email'
            // }
         })
      // console.log(doubts);
      //       .populate({
      //       //populating comments field of post schema
      //          path:'comments',
      //          populate:{
      //          //populating user field of comment schema
      //             path:'user'
      //          },
     // console.log("inside controller");
      return res
         .status(200)
         .json({
            message: "you are at home",
            doubts: doubts,
         });
   }
   catch (err) {
      console.log('Error', err);
      return;
   }
}

