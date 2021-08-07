// const Post=require('../models/post');
// const User=require('../models/user');
// const Comment=require('../models/comment');

const response = require("express");


//module.exports.action_name= function(req,res){}
module.exports.home=async function(req,res){
   
   try{
      
   // CHANGE :: populate the likes of each post and comment
   //populate the post of each user
//       let posts=await Post.find({})
//       .sort('-createdAt')
//    //populating user field of post schema
//       .populate('user')
//       .populate({
//       //populating comments field of post schema
//          path:'comments',
//          populate:{
//          //populating user field of comment schema
//             path:'user'
//          },
//          populate:{
//             path:'likes'
//          }
//       })
//       .populate('likes');
//         //finding all the users to show them on screen
//         //successful response of User.find() will be stored in 'users' variable
//       let users=await User.find({});
      
         
    //      return res.render('home',{
    //      title:'home',
    //      posts:posts,
    //      all_users:users
         

    //   }); 
    console.log("inside controller");
    return res
      .status(200)
      .json({ message: "you are at home" });
    }
   catch(err){
      console.log('Error',err);
      return;
   }
}

