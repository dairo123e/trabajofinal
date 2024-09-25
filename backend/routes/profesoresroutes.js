const express = require("express");
const router = express.Router();
const profesorescontroller = require("../controllers/profesorescontrollers.js");

router.get("/",profesorescontroller.consultar);
router.post("/",profesorescontroller.ingresar);


router.route("/:id")
.get(profesorescontroller.consultarDetalle)
.put(profesorescontroller.actualizar)
.delete(profesorescontroller.borrar);

module.exports = router;
