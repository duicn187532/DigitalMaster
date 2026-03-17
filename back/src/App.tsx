"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "./components/SideBar"
import Dashboard from "./pages/Dashboard"
import UserManagement from "./pages/UserManagement"
import StarRating from "./pages/StarRating"
import RatingDetails from "./pages/RatingDetail"
import SystemSettings from "./pages/SystemSettings"
import Header from "./components/Header"
import ClassManagement from "./pages/ClassManagement"

function App() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Router>
      <Header userName="黃鈺珊" userRole="管理員"/>
      <div className="flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/star-rating" element={<StarRating />} />
            <Route path="/rating-details" element={<RatingDetails />} />
            <Route path="/class-management" element={<ClassManagement />} />
            <Route path="/system-settings" element={<SystemSettings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

