const { MemberMessageFromAdmin } = require("../helper/emailMessage");
const { sendEmail } = require("../middlewares/sendEmail");
const Member = require("../model/member");
const User = require("../model/user");

exports.createMember=async(req,res)=>{
    try {
        const user = await User.findOne({'account.email':req.body.email});
        if(!user){
            return res.status(404).json({message:"sorry this user can not add. please say for register !"})
        }
        const member=await Member.findOne({email:req.body.email});
        if(member){
            return res.status(403).json({message:'member already saved '});
        }
        // sendEmail(MemberMessageFromAdmin(req.body),req.body.email,"Congratulations, Your account created success full,you can login")
        user.account.isEnable=true;
        await new  Member(req.body).save();
        await  user.save();
        res.status(201).json("member addedd successfully");
    } catch (error) {
       console.log(error);
       res.status(500).json({message:"something went wrong!"});
    }
}

exports.updateMember=async(req,res)=>{
    try {
        const member=await Member.findById(req.params.id);
        if(!member){
            return res.status(403).json({message:'Member Id invalid '});
        }
        await Member.findByIdAndUpdate(req.params.id);
        res.status(200).json("Member update Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.deleteMember=async(req,res)=>{
    try {
        const member=await Member.findById(req.params.id);
        if(!member){
            return res.status(403).json({message:'Member Id invalid '});
        }
        await Member.findByIdAndDelete(req.params.id);
        res.status(200).json("Member delete Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getByIdMember=async(req,res)=>{
    try {
        const member=await Member.findById(req.params.id);
        if(!member){
            return res.status(403).json({message:'Member Id invalid'});
        }
        res.status(200).json(member);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getAllMember=async(req,res)=>{
    try {
        const members=await Member.find();
        res.status(200).json(members);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getAllByCreatorMember=async(req,res)=>{
    try {
        const members=await Member.find({creator:req.params.creatorId});
        res.status(200).json(members);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getAllMembers=async(req,res)=>{
    try {
        const members=await Member.find();
        res.status(200).json(members);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}