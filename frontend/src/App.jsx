import React from "react"
import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import Doctor from "./pages/Doctor"
import Login from "./pages/Login"
import About from "./pages/About"
import MyProfile from "./pages/MyProfile"
import MyAppointments from "./pages/MyAppointments"
import Appointment from "./pages/Appointment"
import Navbar from "./components/Navbar"
import Contact from "./pages/Contact"
import Footer from "./components/Footer"
import { ToastContainer, toast } from 'react-toastify';

function App() {
  

  return (
  <div className="mx-4 sm:mx-[10%]">
    <ToastContainer/>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/doctors" element={<Doctor/>} />
      <Route path="/doctors/:speciality" element={<Doctor/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/my-appointments" element={<MyAppointments/>} />
      <Route path="/my-profile" element={<MyProfile/>} />
      <Route path="/appointment/:docId" element={<Appointment/>} />



    </Routes>
    <Footer/>
    </BrowserRouter>
    
  </div>
      
   
  )
}

export default App
