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
        default:"0",
    },
    solvedTime:{
        type:Number,
        default:'0'
    },
    countResolvedDoubt:{
        type:String,
        default:"0",
    },
    countEscalatedDoubt:{
        type:String,
        default:"0",
    },
    anyActiveDoubt:{
        type:Boolean,
        default:false
    },
    userType:{
        type:String,
        default:"0",
    }

},{
    //to add a feature of 'created at' and 'updated at'.
    timestamps:true
});



const Ta=mongoose.model('Ta',taSchema);
module.exports=Ta;