import mesas from "../assets/mesas.png"
import { CalendarCheck } from "lucide-react" // Replace with the actual path to CalendarCheck
import HookReserva from "../hooks/HookReserva"

interface TableProps {
    id: number
    capacidad: number
    estado: 'disponible' | 'ocupada' 
    onClick?: () => void
  }



  export function TableButton({ id, capacidad, estado }: TableProps) {
  const {handleDelete,handleReservation,user} = HookReserva({ id_mesa: id })
      
    return (
      <button
      onClick={estado === 'disponible' ? handleReservation : handleDelete}
        className={`
          relative aspect-square rounded-xl p-4 
          transition-all duration-200 group
          flex flex-col items-center justify-center
          ${
            estado === 'disponible'
              ? 'bg-emerald-300 hover:bg-emerald-200 cursor-pointer'
              : (estado === 'ocupada' && user )
              ? 'bg-red-300 cursor-pointer'
              : 'bg-yellow-100' // Para estado reservado
          }
        `}
      >
        
        <div className="relative w-full h-24 mb-2">
          <img 
            src={mesas || "/placeholder.svg"} 
            alt={`Mesa ${id}`}
            className="w-full h-full object-contain transition-transform group-hover:scale-105"
          />
        </div>
        {estado === 'ocupada' && (
   <div  className="absolute cursor-default top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
  <CalendarCheck className="inline-block mr-1" />
  <span>Ocupada</span>
</div>
     
          )}
        {/* Información de la mesa */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/80 rounded-b-xl">
          <div className="text-center">
            <p className="font-bold text-lg">Mesa {id}</p>
            <p className="text-sm text-gray-600">{capacidad} personas</p>
          </div>
        </div>
  
        {/* Indicador de estado */}
        <div className="absolute top-2 right-2">
          <span className={`
            inline-flex h-3 w-3 rounded-full
            ${estado === 'disponible' ? 'bg-emerald-500' : ''}
            ${estado === 'ocupada' ? 'bg-red-500' : ''}
          `} />
        </div>
        
      </button>
    )
  }