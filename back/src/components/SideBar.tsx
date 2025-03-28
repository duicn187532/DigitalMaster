"use client"

import type { FC } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Star,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const Sidebar: FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-10 ${collapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h1
          className={`text-xl font-semibold text-blue-500 whitespace-nowrap overflow-hidden ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}
        >
          數位達人管理後台
        </h1>
        <button
          className="p-1 text-gray-500 rounded hover:bg-gray-100 focus:outline-none"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="py-4 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 mx-2 mb-1 text-gray-500 rounded transition-colors ${
              isActive ? "bg-blue-50 text-blue-500 border-l-3 border-blue-500" : "hover:bg-gray-100 hover:text-blue-500"
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            Dashboard
          </span>
        </NavLink>

        <NavLink
          to="/user-management"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 mx-2 mb-1 text-gray-500 rounded transition-colors ${
              isActive ? "bg-blue-50 text-blue-500 border-l-3 border-blue-500" : "hover:bg-gray-100 hover:text-blue-500"
            }`
          }
        >
          <Users size={20} />
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            名單管理
          </span>
        </NavLink>

        <NavLink
          to="/star-rating"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 mx-2 mb-1 text-gray-500 rounded transition-colors ${
              isActive ? "bg-blue-50 text-blue-500 border-l-3 border-blue-500" : "hover:bg-gray-100 hover:text-blue-500"
            }`
          }
        >
          <Star size={20} />
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            星級評分
          </span>
        </NavLink>

        <NavLink
          to="/rating-details"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 mx-2 mb-1 text-gray-500 rounded transition-colors ${
              isActive ? "bg-blue-50 text-blue-500 border-l-3 border-blue-500" : "hover:bg-gray-100 hover:text-blue-500"
            }`
          }
        >
          <FileText size={20} />
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            評分明細
          </span>
        </NavLink>

        <NavLink
          to="/class-management"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 mx-2 mb-1 text-gray-500 rounded transition-colors ${
              isActive ? "bg-blue-50 text-blue-500 border-l-3 border-blue-500" : "hover:bg-gray-100 hover:text-blue-500"
            }`
          }
        >
          <Users size={20} />
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            課程管理
          </span>
        </NavLink>

        <NavLink
          to="/system-settings"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 mx-2 mb-1 text-gray-500 rounded transition-colors ${
              isActive ? "bg-blue-50 text-blue-500 border-l-3 border-blue-500" : "hover:bg-gray-100 hover:text-blue-500"
            }`
          }
        >
          <Settings size={20} />
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            系統設定
          </span>
        </NavLink>
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-3 py-2 text-gray-500 rounded hover:bg-gray-100 hover:text-red-500 transition-colors">
          <LogOut size={20} />
          <span
            className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            登出系統
          </span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

