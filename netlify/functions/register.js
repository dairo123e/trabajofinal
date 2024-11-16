const mysql = require("mysql2");
const otplib = require("otplib");
const qrcode = require("qrcode");
const { users } = require("./shared");

const db = mysql.createConnection({
  host: "localhost", 
  user: "root",
  password: "123456789",
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
  if (event.httpMethod === "POST") {
    const { username, numero, password, role } = JSON.parse(event.body);

    const validPasswords = {
      ADMIN: "admin123",
      ESTUDIANTE: "es123",
      PROFESOR: "pro123",
    };

    if (!validPasswords[role] || password !== validPasswords[role]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Contraseña incorrecta para el rol seleccionado",
        }),
      };
    }

    const checkQuery = `SELECT * FROM usuarios WHERE username = ?`;
    const checkResult = await new Promise((resolve, reject) => {
      db.query(checkQuery, [username], (err, results) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });

    if (checkResult.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "El nombre de usuario ya está registrado.",
        }),
      };
    }

    const query = `INSERT INTO usuarios (username, numero, tipo_usuario) VALUES (?, ?, ?)`;

    return new Promise(async (resolve, reject) => {
      db.query(query, [username, numero, role], async (err, results) => {
        if (err) {
          reject(err);
          return resolve({
            statusCode: 500,
            body: JSON.stringify({ error: "Error al registrar el usuario" }),
          });
        }

        try {
          // Generar un secreto único para el usuario y crear el código QR
          const secret = otplib.authenticator.generateSecret();
          const otpauth = otplib.authenticator.keyuri(
            username,
            "MiApp",
            secret
          );
          const qrImageUrl = await qrcode.toDataURL(otpauth);

          // Guardar clave secreta en la "base de datos" en memoria
          users[username] = { secret };
          console.log("Usuarios almacenados:", users); // Log para verificar

          resolve({
            statusCode: 201,
            body: JSON.stringify({
              success: true,
              message: "Usuario registrado correctamente",
              qrImageUrl,
            }),
          });
        } catch (qrError) {
          reject(qrError);
          resolve({
            statusCode: 500,
            body: JSON.stringify({ error: "Error al generar el código QR" }),
          });
        }
      });
    });
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }
};
