const mongoose=require('mongoose');

const teacherSchema=new mongoose.Schema({
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
    userType:{
        type:String,
    }
},{
    //to add a feature of 'created at' and 'updated at'.
    timestamps:true
});



const Teacher=mongoose.model('Teacher',teacherSchema);
module.exports=Teacher;