"use client"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

interface UserData {
  id: string
  name?: string
  email: string
  role?: string
}

interface Props {
  user?: UserData | null
  logout: () => void
}

export default function AuthStatus({ user, logout }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center"
    >
      {user ? (
        <div className="flex items-center space-x-4">
          <span className="text-blue-800 font-semibold">Welcome, {user.name}</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Log Out
          </motion.button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Link
            to={'/login'}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            Log In
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}

