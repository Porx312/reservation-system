import api from "../api.js";

interface UserData {
    name?: string;
    password: string;
    email: string
    role?: string
}

export const registerUser = async (userData: UserData) => {
    return await api.post('/users/register', userData);
};


export const getToken = async () => {
    const token = localStorage.getItem('token');
    return await api.get('/users/token', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const loginUser = async (userData: UserData) => {
    try {
        const response = await api.post('/users/login', userData);

        if (response.status === 200) {
            const data = response.data;
            localStorage.setItem('token', data.token); // Guardar token
            console.log('Inicio de sesión exitoso:', data);
        } else {
            console.error('Error:', response.data.message);
        }
        

  // Your login logic here

  return { status: 200 }; // Example response


    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            console.error('Error: Endpoint not found. Please check the URL.');
        } else {
            console.error('Error al iniciar sesión:', error);
        }
    }
};

export const getAllUsers = async () => {
    return await api.get('/users');
};

export const getUserById = async (id: string) => {
    return await api.get(`/users/${id}`);
};

export const updateUserById = async (id: string, userData: UserData) => {
    return await api.put(`/users/${id}`, userData);
};

export const deleteUserById = async (id: string) => {
    return await api.delete(`/users/${id}`);
};