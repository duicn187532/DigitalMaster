import type { FC } from "react"
// import { TrendingUp, TrendingDown } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  // change: {
  //   value: number
  //   isPositive: boolean
  //   label: string
  // }
  // icon: ReactNode
  // iconBgColor: string
}

const StatCard: FC<StatCardProps> = ({ title, value}) => {
  return (
    <div className="flex justify-between items-center p-6 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col">
        <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
        {/* <div className={`flex items-center gap-1 text-xs ${change.isPositive ? "text-emerald-500" : "text-red-500"}`}> */}
          {/* {change.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />} */}
          <span>
            {/* {change.value}% {change.label} */}
          </span>
        </div>
      </div>
      // <div className={`flex items-center justify-center w-12 h-12 rounded-lg`} style={{ backgroundColor: iconBgColor }}> */}
        // {icon} 
      // </div>
    // </div>
  )
}

export default StatCard

