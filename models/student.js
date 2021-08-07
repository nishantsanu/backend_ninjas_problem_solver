const mongoose=require('mongoose');

const studentSchema=new mongoose.Schema({
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
    doubts:[{
        type:mongoose.Schema.Types.ObjectId,
        //name of model to be linked
        ref:'Doubt'
    }],
    userType:{
        type:String,
    }

},{
    //to add a feature of 'created at' and 'updated at'.
    timestamps:true
});



const Student=mongoose.model('Student',studentSchema);
module.exports=Student;