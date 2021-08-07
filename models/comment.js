const mongoose=require('mongoose');

const CommentSchema=new mongoose.Schema({
    description:{
        type: String,
    },
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },

},{
    //to add a feature of 'created at' and 'updated at'.
    timestamps:true
});



const Comment=mongoose.model('Comment',commentSchema);
module.exports=Comment;