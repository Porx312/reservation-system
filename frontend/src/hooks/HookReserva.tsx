import { useContext,  useState } from "react";
import { createReserva, deleteReserva, fetchReservas } from '../api/services/reservasServices';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface TableProps {
    id_mesa: number;
}

const HookReserva = ({ id_mesa }: TableProps) => {
    const { user } = useContext(AuthContext);



    const navigate = useNavigate();

    const handleReservation = async () => {
        if (user && user.id) {
           
            await createReserva(
                user.id, // Convert user ID to number
                id_mesa,
                '2025-07-02',
                'pendiente'
            );
           
        } else {
            navigate('/login');
        }
    };

    const handleDelete = async () => {
        try {
            const data = await fetchReservas();
            const idData = data.filter((item: { mesa_id: number, user_id: string }) => item.mesa_id === id_mesa);
            if (user?.id === idData[0].user_id) {
                await deleteReserva(idData[0].id);
            } else {
                alert('no puedes eliminar una reserva que no es tuya');
            }
        } catch (err) {
            console.log(err);
        }
    };

    return { handleDelete, handleReservation, user};
};

export default HookReserva;
