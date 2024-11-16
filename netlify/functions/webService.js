const express = require('express');
const cors = require("cors");
const serverless = require ('serverless-http');

exports.handler = async function(event, context){
    return {
        statusCode: 200,
        body: JSON.stringify({message: "Hola, prueba de .....ok"}),
    };
    };
