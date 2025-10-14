const { test } = require("../controller/test");

const testRoute=require("express").Router();



testRoute.get("/",test);


module.exports =testRoute;
