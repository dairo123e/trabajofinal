function guardar() {
  let nota = 0.0;
  let apellidos = "";

  let datoingresado = document.getElementById("descripcion").value;

  event.preventDefault(); // Evitar el envío del formulario
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    profesor_id: document.getElementById("profesor_id").value,
  });

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8888/.netlify/functions/cursos", requestOptions)
    .then((response) => response.json()) // Convertir la respuesta a JSON
    .then((result) => console.log(result))
    .catch((error) => console.error("Error al guardar curso:", error));
}

function cargar(cursos) {
  let salida = "";

  cursos.forEach((curso) => {
    salida += `ID: ${curso.Id}<br>
               Nombres: ${curso.nombre}<br>
               Descripción: ${curso.descripcion}<br>
               Profesor ID: ${curso.Profesor_id}<br><br>`;
  });

  document.getElementById("rta").innerHTML = salida;
}

function listar() {
  event.preventDefault();
  fetch("http://localhost:8888/.netlify/functions/cursos", {
    method: "GET",
    redirect: "follow",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al listar cursos: ${response.status}`);
      }
      return response.json(); // Convertir la respuesta a JSON
    })
    .then((result) => cargar(result))
    .catch((error) => console.error("Error al listar cursos:", error));
}

function respuesta_actualizar(resultado) {
  document.getElementById("rtaA").innerHTML = `Resultado de la actualización: ${resultado.mensaje || resultado}`;
}

function actualizar() {
  event.preventDefault();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    nombre: document.getElementById("nombreA").value,
    descripcion: document.getElementById("descripcionA").value,
    profesor_id: document.getElementById("profesor_idA").value,
  });

  let elid = document.getElementById("idA").value;

  fetch(`http://localhost:8888/.netlify/functions/cursos/${elid}`, {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al actualizar curso: ${response.status}`);
      }
      return response.json(); // Convertir a JSON
    })
    .then((result) => respuesta_actualizar(result))
    .catch((error) => console.error("Error al actualizar curso:", error));
}

function cargarLE(curso) {
  let salida = `ID: ${curso.id}<br>
                Nombres: ${curso.nombre}<br>
                Descripción: ${curso.descripcion}<br>
                Profesor ID: ${curso.profesor_id}<br><br>`;

  document.getElementById("rtaLE").innerHTML = salida;
}

function listar_curso() {
  event.preventDefault();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let elid = document.getElementById("idLE").value;

  fetch(`http://localhost:8888/.netlify/functions/cursos/${elid}`, {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al listar curso: ${response.status}`);
      }
      return response.json(); // Convertir a JSON
    })
    .then((result) => cargarLE(result))
    .catch((error) => console.error("Error al listar curso:", error));
}

function cargarEE(resultado) {
  document.getElementById("rtaEE").innerHTML = resultado.mensaje || resultado;
}

function eliminar_curso() {
  event.preventDefault();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let elid = document.getElementById("idEE").value;

  fetch(`http://localhost:8888/.netlify/functions/cursos/${elid}`, {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al eliminar curso: ${response.status}`);
      }
      return response.json(); // Convertir a JSON
    })
    .then((result) => cargarEE(result))
    .catch((error) => console.error("Error al eliminar curso:", error));
}
