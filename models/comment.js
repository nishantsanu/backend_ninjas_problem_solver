const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    description:{
        type: String,
    },
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    commentatorName:{
        type:String,
    },
    parentDoubt:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doubt'
    }

},{
    //to add a feature of 'created at' and 'updated at'.
    timestamps:true
});



const Comment=mongoose.model('Comment',commentSchema);
module.exports=Comment;