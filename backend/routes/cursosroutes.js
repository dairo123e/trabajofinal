const express = require("express");
const router = express.Router();
const cursoscontroller = require("../controllers/CursosController.js");

router.get("/",cursoscontroller.consultar);
router.post("/",cursoscontroller.ingresar);
router.post("/registraEstudiante",cursoscontroller.asociarEstudiante);

router.route("/:id")
.get(cursoscontroller.consultarDetalle)
.put(cursoscontroller.actualizar)
.delete(cursoscontroller.borrar);

module.exports = router;
