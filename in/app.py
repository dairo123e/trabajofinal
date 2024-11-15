from flask import Flask, render_template, request, redirect, url_for, flash, session
from database import create_connection
from auth_utils import generar_clave_secreta, generar_codigo_qr, verificar_codigo
import subprocess

app = Flask(__name__)
app.secret_key = "tu_secreto"

@app.route('/')
def home():
    return render_template("login.html")

@app.route('/register', methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form["email"]
        nombre = request.form["nombre"]
        rol = request.form["rol"]  # Nuevo campo para el rol

        # Generar clave secreta y código QR
        clave_secreta = generar_clave_secreta()
        qr_path = generar_codigo_qr(email, clave_secreta)

        # Conexión a la base de datos y guardado del usuario con el rol
        conn = create_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO usuarios (email, nombre, clave_secreta, rol) VALUES (?, ?, ?, ?)", 
                       (email, nombre, clave_secreta, rol))
        conn.commit()
        conn.close()

        flash("Usuario registrado. Escanea este QR para configurar 2FA.")
        return render_template("register.html", qr_path=qr_path)
    return render_template("register.html")

@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        conn = create_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT clave_secreta FROM usuarios WHERE email = ?", (email,))
        usuario = cursor.fetchone()
        conn.close()

        if usuario:
            return redirect(url_for("verify", email=email))
        else:
            flash("Usuario no encontrado.")
    return render_template("login.html")

@app.route('/verify', methods=["GET", "POST"])
def verify():
    email = request.args.get("email")
    if request.method == "POST":
        codigo_usuario = request.form["codigo"]

        # Conexión a la base de datos para verificar el usuario
        conn = create_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT clave_secreta, id, nombre, rol FROM usuarios WHERE email = ?", (email,))
        usuario = cursor.fetchone()
        
        if usuario:
            clave_secreta, id_usuario, nombre_usuario, rol_usuario = usuario

            # Verificar el código 2FA
            if verificar_codigo(clave_secreta, codigo_usuario):
                flash("Inicio de sesión exitoso.")
                
                # Conexión a la base de datos para registrar la sesión
                try:
                    # Eliminar sesiones previas del usuario actual
                    cursor.execute("DELETE FROM sesion WHERE Id_Usuario = ?", (id_usuario,))
                    conn.commit()

                    # Insertar la nueva sesión en la tabla `sesion`
                    cursor.execute("""
                        INSERT INTO sesion (Id_Usuario, Nombre_Usuario, Rol, Inicio) 
                        VALUES (?, ?, ?, datetime('now'))
                    """, (id_usuario, nombre_usuario, rol_usuario))
                    conn.commit()
                    
                    print("Sesión registrada correctamente en la base de datos.")  # Mensaje de depuración
                except Exception as e:
                    print(f"Error al registrar la sesión en la base de datos: {e}")  # Mensaje de error
                    flash("Hubo un error al registrar la sesión en la base de datos.")
                finally:
                    cursor.close()
                    conn.close()

                # Ejecutar el comando de PowerShell al verificar con éxito
                subprocess.run(["powershell", "-Command", "cd C:\\Users\\USUARIO\\Downloads\\nuevaver-main; netlify dev"])

                return redirect(url_for("home"))
            else:
                flash("Código incorrecto.")
        else:
            flash("Usuario no encontrado.")
    return render_template("verify.html", email=email)

if __name__ == "__main__":
    app.run(debug=True)
