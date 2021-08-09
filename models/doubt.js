const mongoose=require('mongoose');

const doubtSchema=new mongoose.Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    status:{
        type:String,
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Student'
    },
    solvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ta'
    },
    solvedDate:{
        type:Date,
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ta'
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }]

},{
    //to add a feature of 'created at' and 'updated at'.
    timestamps:true
});



const Doubt=mongoose.model('Doubt',doubtSchema);
module.exports=Doubt;