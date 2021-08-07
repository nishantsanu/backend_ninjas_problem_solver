const mongoose=require('mongoose');

const taSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        
        required:true
    
    },
    name:{
        type:String,
    },
    doubtsAccepted:[{
        type:mongoose.Schema.Types.ObjectId,
        //name of model to be linked
        ref:'Doubt'
    }],
    countAcceptedDoubt:{
        type:String,
    },
    countResolvedDoubt:{
        type:String,
    },
    countEscalatedDoubt:{
        type:String,
    },
    userType:{
        type:String,
    }

},{
    //to add a feature of 'created at' and 'updated at'.
    timestamps:true
});



const Ta=mongoose.model('Ta',taSchema);
module.exports=Ta;