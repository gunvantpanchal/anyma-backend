const Deal = require("../model/deal");

exports.createDeal=async(req,res)=>{
    try {
        await new  Deal(req.body).save();
        res.status(201).json("Deal addedd successfully");
    } catch (error) {
       console.log(error);
       res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.updateDeal=async(req,res)=>{
    try {
        const deal=await Deal.findById(req.params.id);
        if(!deal){
            return res.status(403).json({message:'Deal Id invalid '});
        }
        await Deal.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json("Deal update Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.deleteDeal=async(req,res)=>{
    try {
        const deal=await Deal.findById(req.params.id);
        if(!deal){
            return res.status(403).json({message:'Deal Id invalid '});
        }

        await Deal.findByIdAndDelete(req.params.id);
        res.status(200).json("Deal delete Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getByIdDeal=async(req,res)=>{
    try {
        const deal=await Deal.findById(req.params.id);
        if(!deal){
            return res.status(403).json({message:'Deal Id invalid'});
        }
        res.status(200).json(deal);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getDealsByInvestor=async(req,res)=>{
    try {
        const deal=await Deal.find({
            investors: {
              $elemMatch: { investerId: req.params.investorId }
            }
          });
        if(!deal){
            return res.status(403).json({message:'Deal Id invalid'});
        }
        res.status(200).json(deal);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getAllDeal=async(req,res)=>{
    try {
        const deals=await Deal.find();
        res.status(200).json(deals);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getAllBycompanyIdDeal=async(req,res)=>{
    try {
        const deals=await Deal.find({companyId:req.params.companyId});
        res.status(200).json(deals);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getAllDealsWithUserIdAndCompany=async(req,res)=>{
    try {
        const {investorId}=req.params;
        const deals = await Deal.aggregate([
            { 
                $match: {  "investors.investerId": investorId }
            },
            { 
                $group: { 
                    _id: "$companyId", 
                    deals: { $push: "$$ROOT" } 
                } 
            }
        ]);
        res.status(200).json(deals);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}