from cryptography.fernet import Fernet
from app.core.config import settings

# 生成或加载加密密钥
try:
    with open('encryption_key.key', 'rb') as key_file:
        key = key_file.read()
except FileNotFoundError:
    key = Fernet.generate_key()
    with open('encryption_key.key', 'wb') as key_file:
        key_file.write(key)

cipher_suite = Fernet(key)

def encrypt_password(password: str) -> str:
    """
    使用AES加密密码
    
    参数:
        password (str): 需要加密的密码
        
    返回:
        str: 加密后的字符串
    """
    if not password:
        raise ValueError("密码不能为空")
        
    encrypted_password = cipher_suite.encrypt(password.encode())
    return encrypted_password.decode()

def decrypt_password(encrypted_password: str) -> str:
    """
    解密密码
    
    参数:
        encrypted_password (str): 加密后的密码
        
    返回:
        str: 解密后的原始密码
    """
    if not encrypted_password:
        raise ValueError("加密密码不能为空")
        
    decrypted_password = cipher_suite.decrypt(encrypted_password.encode())
    return decrypted_password.decode()