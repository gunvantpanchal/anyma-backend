const {
  createMember,
  updateMember,
  getByIdMember,
  getAllByCreatorMember,
  deleteMember,
  getAllMembers,
} = require("../controller/memberController");

const memberRoutes = require("express").Router();
memberRoutes.post("/", createMember);
memberRoutes.put("/:id", updateMember);
memberRoutes.delete("/:id", deleteMember);
memberRoutes.get("/:id", getByIdMember);
memberRoutes.get("/:creatorId", getAllByCreatorMember);
memberRoutes.get("/", getAllMembers);

module.exports = memberRoutes;
