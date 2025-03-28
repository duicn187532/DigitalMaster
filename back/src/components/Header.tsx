import type { FC } from "react"
import { ChevronDown } from "lucide-react"

interface HeaderProps {
  userName: string
  userRole: string
  avatarUrl?: string
}

const Header: FC<HeaderProps> = ({ userName, userRole, avatarUrl }) => {
  return (
    <header className="flex items-center justify-end px-6 py-4 bg-white border-b border-gray-200">
      {/* <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          className="w-full py-2 pl-10 pr-4 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="Search"
        />
      </div> */}

      <div className="flex items-center gap-3 cursor-pointer">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl || "/placeholder.svg"} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-semibold">{userName.charAt(0)}</span>
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-gray-800">{userName}</h3>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>
        <ChevronDown size={16} className="text-gray-500" />
      </div>
    </header>
  )
}

export default Header

