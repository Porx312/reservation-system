import { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken } from '../api/services/userServices';

// Definir la interfaz para el usuario (sin password por seguridad)
interface UserData {
  id: string;
  name?: string;
  email: string;
  role?: string;
}

// Definir el contexto con los tipos adecuados
interface AuthContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  logout: () => void;
}

// Crear el contexto con valores iniciales tipados
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {}
});

// Componente AuthProvider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    }
  }, []);

  // Función para obtener los datos del usuario
  const fetchUserData = async () => {
    try {
      const response = await getToken(); // 🔹 Pasar token a la función getToken
      if (response.status === 200) {
        setUser(response.data); // 🔹 Ya no necesitas `response.data.user`, lo arreglé en el backend
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      logout(); // 🔹 Si el token es inválido, cerrar sesión automáticamente
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
