const { createCompany, updateCompany, getByIdCompany, deleteCompany, getAllByCreatorCompany, getAllCompany, addNews, deleteNews, addUpdateDoc, deleteUpdateDoc, addInvestDoc, deleteInvestDoc, downloadFile, updateWithoutFile } = require("../controller/companyController");
const memoryUpload = require("../middlewares/memoryUpload")();

const compnayRoutes=require("express").Router();

compnayRoutes.post("/", memoryUpload, createCompany);
compnayRoutes.put("/:id", memoryUpload, updateCompany);
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
compnayRoutes.post("/doc/:companyId", memoryUpload, addUpdateDoc);
compnayRoutes.get("/doc/:companyId/:id", memoryUpload, deleteUpdateDoc);

// invest doc
compnayRoutes.post("/invest/:companyId", memoryUpload, addInvestDoc);
compnayRoutes.get("/invest/:companyId/:id", memoryUpload, deleteInvestDoc);



module.exports=compnayRoutes;