import sqlite3
import mysql.connector
from mysql.connector import Error

def create_connection():
    conn = sqlite3.connect("usuarios.db")
    return conn

def create_table():
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS Sesion (
            Id_Sesion INTEGER PRIMARY KEY AUTOINCREMENT,
            Id_Usuario INTEGER,
            Nombre_Usuario TEXT,
            Rol TEXT,
            Inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''')
    conn.commit()
    conn.close()

create_table()

def get_user_by_username(username):
    try:
        # Configuración de conexión a la base de datos MySQL
        conn = mysql.connector.connect(
            host="localhost",         # Cambia esto si usas un host diferente
            user="root",              # Reemplaza con tu usuario de MySQL
            password="123456789",    # Reemplaza con tu contraseña de MySQL
            database="cursos"         # Nombre de la base de datos (puede ser distinto, verifica en tu configuración)
        )
        return
    except Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None  # En caso de error, retornamos None

    finally:
        if conn.is_connected():
            conn.close()  # Cerramos la conexión a la base de dat