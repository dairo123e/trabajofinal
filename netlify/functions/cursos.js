var express = require('express');
var cors = require("cors");
var serverless = require ('serverless-http');
var port = process.env.PORT || 5000;
var app = express();
//var estudiantesroutes = require("../../backend/routes/estudiantesroutes.js");
//var profesoresroutes = require("../../backend/routes/profesoresroutes.js");
var cursosroutes = require("../../backend/routes/cursosroutes.js");

app.use(express.json());
app.use(cors());

var router = express.Router();
//router.use ("/profesores",profesoresroutes);
//router.use ("/profesores",profesoresroutes);
router.use ("/cursos",cursosroutes);

var handler = app.use ('/.netlify/functions',router);
exports.handler = serverless (app);
