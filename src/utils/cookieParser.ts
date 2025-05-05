import { UserType } from "../types/UserTypes"

export const parseCIDICookie = (): UserType | null => {
  console.log("Parseando cookie CIDI...", document.cookie);

  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('VABack.CIDI='));

    if (!cookie) return null;

    // Obtenemos todo lo que está después de 'VABack.CIDI='
    const cookieValue = cookie.substring('VABack.CIDI='.length);
    console.log("Valor de la cookie:", cookieValue);

    const decodedValue = decodeURIComponent(cookieValue);
    console.log("Valor decodificado:", decodedValue);

    const pairs = decodedValue.split('&');
    console.log("Pares:", pairs);

    // Inicializamos el objeto con valores por defecto
    const result: UserType = {
      administrador: "",
      nombre: "",
      apellido: "",
      userName: "",
      SesionHash: ""
    };

    // Parseamos los pares clave-valor
    pairs.forEach(pair => {
      const [key, ...valueParts] = pair.split('=');
      const value = valueParts.join('='); // Reunimos el valor en caso de que contenga =
      if (key && value) {
        switch (key.trim()) {
          case 'administrador':
            result.administrador = value.trim();
            break;
          case 'nombre':
            result.nombre = value.trim();
            break;
          case 'apellido':
            result.apellido = value.trim();
            break;
          case 'nombre_usuario':
            result.userName = value.trim();
            break;
          case 'SesionHash':
            result.SesionHash = value.trim();
            break;
        }
      }
    });

    console.log("Resultado final:", result);
    return result;

  } catch (error) {
    console.error('Error al parsear la cookie CIDI:', error);
    return null;
  }
}

export const deleteCookie = (): void => {
  console.log("Borrando cookie CIDI...");

  // Establece la cookie con una fecha de expiración en el pasado
  document.cookie = "VABack.CIDI=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  console.log("Cookie CIDI borrada.");

  // Cierra la pestaña
  window.location.reload();

}