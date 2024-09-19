import CryptoJS from "crypto-js"

const SECRET_KEY = "tu_clave_secreta" // Reemplaza esto con tu propia clave secreta

const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

const decryptData = (encryptedData: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decryptedData)
}

const setSecureItem = (key: string, data: any): void => {
  const encryptedData = encryptData(data);
  const timestamp = new Date().getTime();
  const expiryTime = 12 * 60 * 60 * 1000; // 12 horas en milisegundos
  const item = {
    data: encryptedData,
    expiry: timestamp + expiryTime
  };
  localStorage.setItem(key, JSON.stringify(item));
}


const getSecureItem = (key: string): any | null => {
  const itemString = localStorage.getItem(key);
  if (!itemString) return null;

  try {
    const item = JSON.parse(itemString);
    const currentTime = new Date().getTime();

    // Verificar si el dato ha expirado
    if (currentTime > item.expiry) {
      localStorage.removeItem(key); // Eliminar el ítem expirado
      return null;
    }

    // Devolver los datos desencriptados
    return decryptData(item.data);
  } catch (error) {
    // Manejo de errores en caso de que el JSON sea inválido
    console.error('Error al leer o parsear el ítem del localStorage:', error);
    localStorage.removeItem(key);
    return null;
  }
}

export { setSecureItem, getSecureItem }
