import pyotp
import qrcode

def generar_clave_secreta():
    # Genera una clave secreta única para cada usuario
    return pyotp.random_base32()

def generar_codigo_qr(email, clave_secreta):
    # Crea una instancia TOTP (Time-based One-Time Password)
    totp = pyotp.TOTP(clave_secreta)
    
    # Genera la URI para el código QR
    uri = totp.provisioning_uri(name=email, issuer_name="TuAplicacion")

    # Genera y guarda el código QR
    qr = qrcode.make(uri)
    qr_path = f"qrcodes/{email}_qr.png"
    qr.save(f"static/{qr_path}")
    return qr_path

def verificar_codigo(clave_secreta, codigo_usuario):
    # Verifica el código ingresado por el usuario
    totp = pyotp.TOTP(clave_secreta)
    return totp.verify(codigo_usuario)
