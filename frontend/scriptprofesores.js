// Función para crear un nuevo profesor
function guardarProfesor() {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "dni": document.getElementById("dni").value,
        "nombre": document.getElementById("nombre").value,
        "apellidos": document.getElementById("apellidos").value,
        "email": document.getElementById("correo").value,
        "profecion": document.getElementById("profecion").value,
        "telefono": document.getElementById("telefono").value
    });

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8888/.netlify/functions/profesores", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.error('Error al guardar profesor:', error));
}

// Función para listar todos los profesores
function listarProfesores() {
    event.preventDefault();

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://localhost:8888/.netlify/functions/profesores", requestOptions)
        .then(response => response.text())
        .then(result => cargarProfesores(result))
        .catch(error => console.error('Error al listar profesores:', error));
}

// Función para cargar profesores en la interfaz
function cargarProfesores(resultado) {
    let transformado = JSON.parse(resultado);
    let salida = "";
    let elemento = "";

    for (let prof in transformado) {
        elemento = "ID: " + transformado[prof].id;
        elemento += "<br>Documento de Identidad: " + transformado[prof].dni;
        elemento += "<br>Nombres: " + transformado[prof].nombre;
        elemento += "<br>Apellidos: " + transformado[prof].apellidos;
        elemento += "<br>Email: " + transformado[prof].email;
        elemento += "<br>Profecion: " + transformado[prof].profecion;
        elemento += "<br>Teléfono: " + transformado[prof].telefono;
        salida += elemento + "<br><br>";
    }

    document.getElementById("rta").innerHTML = salida;
}

// Función para actualizar un profesor existente
function actualizarProfesor(event) {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "dni": document.getElementById("dniA").value,
        "nombre": document.getElementById("nombreA").value,
        "apellidos": document.getElementById("apellidosA").value,
        "email": document.getElementById("correoA").value,
        "profecion": document.getElementById("profecionA").value,
        "telefono": document.getElementById("telefonoA").value
    });

    let elid = document.getElementById("idA").value;

    let requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8888/.netlify/functions/profesores/" + elid, requestOptions)
        .then(response => response.text())
        .then(result => document.getElementById("rtaA").innerHTML = result)
        .catch(error => console.error('Error al actualizar profesor:', error));
}

// Función para eliminar un profesor
function eliminarProfesor(event) {
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let elid = document.getElementById("idE").value;

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow"
    };

    fetch("http://localhost:8888/.netlify/functions/profesores/" + elid, requestOptions)
        .then(response => response.text())
        .then(result => document.getElementById("rtaE").innerHTML = result)
        .catch(error => console.error('Error al eliminar profesor:', error));
}
