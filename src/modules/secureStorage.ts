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
  const encryptedData = encryptData(data)
  localStorage.setItem(key, encryptedData)
}

const getSecureItem = (key: string): any => {
  const encryptedData = localStorage.getItem(key)
  if (encryptedData) {
    return decryptData(encryptedData)
  }
  return null
}

export { setSecureItem, getSecureItem }
