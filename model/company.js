const mongoose = require("mongoose");
const companySchema = new mongoose.Schema({
  cover: {
    type: String,
  },
  profile: {
    type: String,
  },
  about: {
    type: String,
  },
  name: {
    type: String,
  },
  dealSummary: {
    asset: String,
    investDate: String,
    sector: String,
    currentValuation: String,
  },
  news: Array,
  update: Array,
  investDoc: Array,
  creator: { type: mongoose.Types.ObjectId, ref: "User" },
});

const Company = mongoose.model("company", companySchema);
module.exports = Company;
