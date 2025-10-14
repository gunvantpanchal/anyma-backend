const Company = require("../../model/company");
const Industry = require("../../model/library.options/industry");
const User = require("../../model/user");

exports.createIndustry = async (req, res) => {
  try {
    const industry = await Industry.findOne({ industry: req.body.industry });
    if (industry) {
      return res
        .status(403)
        .json({ message: "You can not add, already present" });
    }
    await new Industry(req.body).save();

    res.status(201).json("industry added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error !" });
  }
};

exports.getAllIndustryOptions = async (req, res) => {
  try {
    const industry = await Industry.find().populate("industry");
    res.status(200).json(industry);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error !" });
  }
};

exports.getAllIndustry = async (req, res) => {
  try {
    const industry = await Industry.find().select("name");
    res.status(200).json(industry);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error !" });
  }
};

exports.getAllCompaniesOptions = async (req, res) => {
  try {
    const companies = await Company.find().select("name");
    res.status(200).json(companies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error !" });
  }
};

exports.getAllUsersOptions = async (req, res) => {
  try {
    const companies = await User.find().populate("name").populate("email");
    res.status(200).json(companies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error !" });
  }
};
