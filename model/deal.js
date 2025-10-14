const mongoose=require("mongoose");
const dealShcema=new mongoose.Schema({
    currentValue:String,
    investedDate:String,
    currency:String,
    investors:Array,
    companyId:{type:mongoose.Types.ObjectId,ref:"company",required:true},
})

const Deal=mongoose.model("deal",dealShcema);
module.exports=Deal;