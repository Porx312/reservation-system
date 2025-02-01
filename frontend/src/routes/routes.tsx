import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "../components/Login"
import Register from "../components/Register"
import Home from "../components/Home"

export default function MyRoute() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
    </Router>
  )
}