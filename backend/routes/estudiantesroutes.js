const express = require("express");
const router = express.Router();
const estudiantescontroller = require("../controllers/estudiantescontrollers.js");

router.get("/",estudiantescontroller.consultar);
router.post("/",estudiantescontroller.ingresar);

router.route("/:id")
.get(estudiantescontroller.consultarDetalle)
.put(estudiantescontroller.actualizar)
.delete(estudiantescontroller.borrar);

module.exports = router;
