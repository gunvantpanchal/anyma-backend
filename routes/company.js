const { createCompany, updateCompany, getByIdCompany, deleteCompany, getAllByCreatorCompany, getAllCompany, addNews, deleteNews, addUpdateDoc, deleteUpdateDoc, addInvestDoc, deleteInvestDoc, downloadFile, updateWithoutFile } = require("../controller/companyController");
const uploadFile = require("../middlewares/uploadFile");
const uploadMuiltiFieldFiles = require("../middlewares/uploadMultifieldFiles");

const compnayRoutes=require("express").Router();

compnayRoutes.post("/",uploadMuiltiFieldFiles("public/company"), createCompany);
compnayRoutes.put("/:id",uploadMuiltiFieldFiles("public/company"),updateCompany);
compnayRoutes.put("/without-file/:id",updateWithoutFile);
compnayRoutes.get("/:id",getByIdCompany);
compnayRoutes.delete("/:id",deleteCompany);
compnayRoutes.get("/:creatorId",getAllByCreatorCompany);
compnayRoutes.get("/",getAllCompany);
compnayRoutes.get("/file/download/:fileName",downloadFile);

// news
compnayRoutes.post("/news/:companyId",addNews);
compnayRoutes.delete("/news/:companyId/:id",deleteNews);

// update
compnayRoutes.post("/doc/:companyId",uploadFile("public/company"), addUpdateDoc);
compnayRoutes.get("/doc/:companyId/:id",uploadFile("public/company"),deleteUpdateDoc);

// invest doc
compnayRoutes.post("/invest/:companyId", uploadFile("public/company"),addInvestDoc);
compnayRoutes.get("/invest/:companyId/:id",uploadFile("public/company"),deleteInvestDoc);



module.exports=compnayRoutes;