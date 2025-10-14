const mongoose =require("mongoose");
const memberSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    city:String,
    dob:String,
    phone:String,
    company:String,
    industry:String,
    userId:{type:mongoose.Types.ObjectId,ref:"User"},
    creator:{type:mongoose.Types.ObjectId,ref:"User"},
})

const Member=mongoose.model("member",memberSchema);
module.exports=Member;