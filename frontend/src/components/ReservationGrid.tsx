import { useContext, useEffect, useState } from "react"
import { TableButton } from "./TableButton"
import { getAllMesas } from "../api/services/mesasServices"
import { AuthContext } from "../context/AuthContext"
interface Seat {
  id: number
  numero: number
  capacidad: number 
  estado: 'ocupada' | 'disponible'
}

export default function ReservationGrid() {
  const { user} = useContext(AuthContext);
  const [seats, setSeats] = useState<Seat[]>([])
  useEffect(() => {
    const fetchSeats = async () => {
      const seats = await getAllMesas();
      setSeats(seats);
    };
  
    fetchSeats();
  }, [seats]);
    const handleSeatClick = (seatId: number) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              isReserved: seat.estado == 'ocupada',
              reservedBy: seat.estado == 'disponible' ? user.id : undefined,
            }
          : seat,
      ),
    )
  }
 
  return (
    <div className="p-6  mx-auto">
    
      <div className="p-6 rounded-2xl ">
        <div className="grid grid-cols-3 gap-4  md:grid-cols-8">
          {seats && seats.map((seat) => (
            <TableButton
              key={seat.id}
              id={seat.id}
              capacidad={seat.capacidad}
              estado={seat.estado}
              onClick={()=> handleSeatClick(seat.id)}
            />
          ))}
        </div>
      </div>

 
    </div>
  )
}

