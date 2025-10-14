const { getAllIndustry, getAllCompaniesOptions, getAllUsersOptions } = require("../../controller/library.options/libraryOptions");

const optionsRoutes=require("express").Router();


optionsRoutes.get("/industry",getAllIndustry);
optionsRoutes.get("/company",getAllCompaniesOptions);
optionsRoutes.get("/users",getAllUsersOptions);


module.exports=optionsRoutes;