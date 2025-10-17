const Company = require("../model/company");
const path = require('path');
const Deal = require("../model/deal");

exports.createCompany=async(req,res)=>{
    try {
      if(req.body.dealSummary){
        req.body.dealSummary=JSON.parse(req.body.dealSummary);
        }
        if(req.body.news){
        req.body.news=JSON.parse(req.body.news);
        }
              if (req.files) {
                if (req.files.cover && req.files.cover[0]) {
                  req.body.cover = "https://api.anyma.capital/company/cover/" + req.files.cover[0].originalname;
                }
                if (req.files.profile && req.files.profile[0]) {
                  req.body.profile = "https://api.anyma.capital/company/profile/" + req.files.profile[0].originalname;
                }
              
                if (!req.body.investDoc) {
                  req.body.investDoc = [];
                }
             
              
                if (req.files.update && req.files.update.length > 0) {
                  req.body.update = req.files.update.map((file, index) => ({
                    ...file,
                    updatedoc: "https://api.anyma.capital/company/update/" + file.originalname,
                    date: Date.now(),
                    id:index
                  }));
                }
              
                if (req.files.investDoc && req.files.investDoc.length > 0) {
                  req.body.investDoc = req.files.investDoc.map((file, index) => ({
                    ...file,
                    updatedoc: "https://api.anyma.capital/company/investDoc/" + file.originalname,
                    date: Date.now(),
                    id:index
                  }));
                }
              }
       
        const company=await Company.findById(req.body.creatorId);
        if(company){
            return res.status(403).json({message:'This Company already added '});
        }
        await new  Company(req.body).save();
        res.status(201).json("company addedd successfully");
    } catch (error) {
       console.log(error);
       res.status(500).json({messsage: error?._message || "something went wrong!"});
    }
}

exports.updateCompany=async(req,res)=>{
    try {
        const company=await Company.findById(req.params.id);
        if(!company){
            return res.status(403).json({message:'Company Id invalid '});
        }
        if(req.body.dealSummary){
          req.body.dealSummary=JSON.parse(req.body.dealSummary);
          }
          if(req.body.news){
          req.body.news=JSON.parse(req.body.news||'');
          }
          console.log(req.files)
          if (req.files) {
            if (req.files.cover && req.files.cover[0]) {
              req.body.cover = "/company/cover/" + req.files.cover[0].originalname;
            }
            if (req.files.profile && req.files.profile[0]) {
              req.body.profile = "/company/profile/" + req.files.profile[0].originalname;
            }
          
            if (!req.body.investDoc) {
              req.body.investDoc = [];
            }
         
          
            if (req.files.update && req.files.update.length > 0) {
              req.body.update = req.files.update.map((file, index) => ({
                ...file,
                updatedoc: "/company/update/" + file.originalname,
              }));
            }
          
            if (req.files.investDoc && req.files.investDoc.length > 0) {
              req.body.investDoc = req.files.investDoc.map((file, index) => ({
                ...file,
                updatedoc: "/company/investDoc/" + file.originalname,
              }));
            }
          }
        await Company.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json("Company update Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.updateWithoutFile=async(req,res)=>{
    try {
      const {investDate,currentValuation}=req.body;
        const company=await Company.findById(req.params.id);
        if(!company){
            return res.status(403).json({message:'Company Id invalid '});
        }
        company.dealSummary.investDate=investDate;
        company.dealSummary.currentValuation=currentValuation;
       await   company.save();
        res.status(200).json("Company update Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.deleteCompany=async(req,res)=>{
    try {
          await  Deal.deleteMany({companyId:req?.params?.id});
        const company=await Company.findById(req.params.id);
        if(!company){
            return res.status(403).json({message:'Company Id invalid '});
        }
        await Company.findByIdAndDelete(req.params.id);
        res.status(200).json("Company delete Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getByIdCompany=async(req,res)=>{
    try {
        const company=await Company.findById(req.params.id);
        if(!company){
            return res.status(403).json({message:'Company Id invalid'});
        }
        res.status(200).json(company);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getAllCompany=async(req,res)=>{
    try {
        const companies=await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.getAllByCreatorCompany=async(req,res)=>{
    try {
        const compnies=await Company.find({creator:req.params.creatorId});
        res.status(200).json(compnies);
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

// new controller

exports.addNews=async(req,res)=>{
    try {
        const company=await Company.findById(req.params.companyId);
        if(!company){
            return res.status(403).json({message:'Company Id invalid'});
        }
        company.news.push(req.body);
        await company.save();
        res.status(200).json("News added successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}
exports.deleteNews=async(req,res)=>{
    try {
        const company=await Company.findById(req.params.companyId);
        if(!company){
            return res.status(403).json({message:'Company Id invalid'});
        }
           company.news= company.news.filter((v)=>v._id!==req.params.id);
        await company.save();
        res.status(200).json("News added successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.addUpdateDoc=async(req,res)=>{
    try {
        const company=await Company.findById(req.params.companyId);
        if(!company){
            return res.status(403).json({message:'Company Id invalid'});
        }
        let updateDoc;
        if (req.files) {
           updateDoc = "/company/doc/" + req?.files[0]?.originalname;
          }
          req.body.updateDoc ={
            updateDoc,date:new Date()
          }
        company.update.push(req.body);
        await company.save();
        res.status(200).json("News added successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.deleteUpdateDoc = async (req, res) => {
    try {
      const company = await Company.findById(req.params.companyId);
      if (!company) {
        return res.status(403).json({ message: 'Invalid Company ID' });
      }
  
      const docIndex = company.update.findIndex(doc => doc._id === req.params.id);
      if (docIndex === -1) {
        return res.status(404).json({ message: "Document not found in the updateDoc array" });
      }
  
      const documentToDelete = company.update[docIndex];
  
      if (documentToDelete.updateDoc) {
        const filePath = path.join(__dirname, '..', 'public', documentToDelete.updateDoc); 
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: "Failed to delete the document file." });
          } else {
            console.log('File deleted:', filePath);
          }
        });
      }
  
      company.update.splice(docIndex, 1);
  
      await company.save();
  
      res.status(200).json("Document deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  };

exports.addInvestDoc=async(req,res)=>{
    try {
        const company=await Company.findById(req.params.companyId);
        if(!company){
            return res.status(403).json({message:'Company Id invalid'});
        }
        let investDoc;
        if (req.files) {
           investDoc = "/company/invest/" + req?.files[0]?.originalname;
          }
          req.body.investDoc ={
            investDoc,date:new Date()
          }
        company.investDoc.push(req.body);
        await company.save();
        res.status(200).json("News added successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage:"something went wrong!"});
    }
}

exports.deleteInvestDoc = async (req, res) => {
    try {
      const company = await Company.findById(req.params.companyId);
      if (!company) {
        return res.status(403).json({ message: 'Invalid Company ID' });
      }
  
      const docIndex = company.investDoc.findIndex(doc => doc._id === req.params.id);
      if (docIndex === -1) {
        return res.status(404).json({ message: "Document not found in the updateDoc array" });
      }
  
      const documentToDelete = company.investDoc[docIndex];
  
      if (documentToDelete.investDoc) {
        const filePath = path.join(__dirname, '..', 'public', documentToDelete.investDoc); 
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: "Failed to delete the document file." });
          } else {
            console.log('File deleted:', filePath);
          }
        });
      }
  
      company.investDoc.splice(docIndex, 1);
  
      await company.save();
  
      res.status(200).json("Document deleted successfully");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  };
  exports.downloadFile=async(req,res)=>{
    try {
      const fileName = req.params.fileName;
      const fileDirectory = path.join(__dirname, '../public/company'); 
      const filePath = path.join(fileDirectory, fileName);
      res.download(filePath, (err) => {
        if (err) {
          return res.status(404).send({ message: "File not found!" });
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }