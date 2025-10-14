const AuthRoutes = require("./authRoutes");
const compnayRoutes = require("./company");
const dealRoutes = require("./dealRoutes");
const optionsRoutes = require("./library.Options/Options");
const memberRoutes = require("./memberRoutes");
const testRoute = require("./test");

const Router=require("express").Router();
Router.use("/auth",AuthRoutes);
Router.use("/member",memberRoutes);
Router.use("/deal",dealRoutes);
Router.use("/company",compnayRoutes);
Router.use("/options",optionsRoutes);
Router.use("/test",testRoute);


module.exports=Router;