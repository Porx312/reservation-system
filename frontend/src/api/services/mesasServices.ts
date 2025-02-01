import api from '../api.js';

// Obtener todas las mesas
export const getAllMesas = async () => {
    try {
        const response = await api.get('/mesas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener mesas:', error);
        throw error;
    }
};

// Obtener una mesa por ID
export const getMesaById = async (id: number) => {
    try {
        const response = await api.get(`/mesas/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener la mesa con ID ${id}:`, error);
        throw error;
    }
};

// Crear una nueva mesa
export interface Mesa {
    id: number;
    nombre: string;
    capacidad: number;
    ubicacion: string;
}

export const createMesa = async (mesaData: Mesa): Promise<Mesa> => {
    try {
        const response = await api.post('/mesas', mesaData);
        return response.data;
    } catch (error) {
        console.error('Error al crear la mesa:', error);
        throw error;
    }
};

// Actualizar una mesa por ID
export const updateMesa = async (id: number, mesaData: Mesa) => {
    try {
        const response = await api.put(`/mesas/${id}`, mesaData);
        return response.data;
    } catch (error) {
        console.error(`Error al actualizar la mesa con ID ${id}:`, error);
        throw error;
    }
};

// Eliminar una mesa por ID
export const deleteMesa = async (id: number) => {
    try {
        const response = await api.delete(`/mesas/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al eliminar la mesa con ID ${id}:`, error);
        throw error;
    }
};
