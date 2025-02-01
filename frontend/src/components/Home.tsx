import ReservationGrid from "./ReservationGrid"
import burguer from '../assets/burg.png'
/* import cucaracha from '../assets/cucaracha.png' */
import restaurant from '../assets/kran.webp'
import logo from '../assets/logo.png'
import AuthStatus from "./Welcome"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";


export default function Home() {
    // This is a mock user state. In a real application, you'd manage this with a proper auth system.
    const { user, logout} = useContext(AuthContext);


  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
   
      {/* Header */}
      <header className="bg-yellow-400 relative z-10 p-4 shadow-lg">
        <nav className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
          <img
            src={logo}
            alt="Deliciosa hamburguesa"
            className=" w-[60px] h-[60px]"
          />
            <h1 className="text-3xl font-extrabold text-red-600 hidden sm:block">The Krusty Krab</h1>
          </div>
          <div className="flex items-center space-x-6">
         
         
            <a href="#reserve" className="text-blue-800 hover:text-blue-600 font-semibold transition duration-300">
              Reserve
            </a>
            <AuthStatus user={user} logout={logout} />
          </div>
        </nav>
      </header>

      {/* Home Section */}
    

      {/* Reserve Section */}
      <section id="reserve" className="relative bg-gradient-to-b py-24 px-4 overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <ReservationGrid />
      
      </div>
    </section>
    
    </div>
  )
}

