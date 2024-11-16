const { authenticator } = require("otplib");
const mysql = require("mysql2");
const { users } = require("./shared");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Kurumy2004",
  database: "cursos",
});

db.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err);
    throw err;
  }
  console.log("BD Mysql Conectado");
});

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { username, codigoUsuario } = JSON.parse(event.body);

  console.log("Usuarios almacenados en login:", users); // Log para verificar
  const user = users[username];

  if (!user) {
    console.log("Usuario no encontrado:", username); // Log para verificar
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Usuario no encontrado" }),
    };
  }

  const secret = user.secret;

  // Verificar el código TOTP
  const isValid = authenticator.check(codigoUsuario, secret);

  if (!isValid) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Código incorrecto",
      }),
    };
  }

  try {
    // Eliminar todos los registros de la tabla Sesion
    const deleteQuery = "DELETE FROM Sesion";
    await db.promise().query(deleteQuery);

    // Obtener detalles del usuario de la tabla Usuarios
    const selectUserQuery =
      "SELECT id, username, tipo_usuario FROM Usuarios WHERE username = ?";
    const [userResults] = await db.promise().query(selectUserQuery, [username]);

    if (userResults.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Usuario no encontrado en la tabla Usuarios",
        }),
      };
    }

    const userDetails = userResults[0];

    // Insertar nuevo registro en la tabla Sesion
    const insertSessionQuery =
      "INSERT INTO Sesion (Id_Usuario, Nombre_Usuario, Rol) VALUES (?, ?, ?)";
    await db
      .promise()
      .query(insertSessionQuery, [
        userDetails.id,
        userDetails.username,
        userDetails.tipo_usuario,
      ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Autenticación exitosa",
      }),
    };
  } catch (error) {
    console.error("Error al manejar la sesión del usuario:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error interno del servidor",
      }),
    };
  }
};
