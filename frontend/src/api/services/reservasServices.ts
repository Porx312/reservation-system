import api from '../api.js';


export const getAllReservas = async () => {
    try {
        const response = await api.get('/reservas');
        return response.data;
    } catch (error) {
        console.error('Error al obtener mesas:', error);
        throw error;
    }
};


export const createReserva = async (user_id: string, mesa_id: number, fecha_reserva: string, estado: string) => {
  if (user_id == null) {
    throw new Error("user_id cannot be null");
  }
  try {
    const response = await api.post('/reservas', { user_id, mesa_id, fecha_reserva, estado });
    return response.data;
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    throw error;
  }
};

export const updateReserva = async (id: number, estado: string) => {
  try {
    const response = await api.put(`/reservas/${id}`, { estado });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la reserva:', error);
    throw error;
  }
};

export const deleteReserva = async (id: number) => {
  try {
    
      const response = await api.delete(`/reservas/${id}`);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la reserva:', error);
    throw error;
  }
};

export const fetchReservas = async () => {
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No hay token disponible');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/reservas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      
      if (response.ok) {
          return data
      } else {
        console.log('Error:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener reservas:', error);
    }
  };