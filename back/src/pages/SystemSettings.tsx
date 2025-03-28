import type { FC } from "react"

const SystemSettings: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">系統設定</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-500">系統設定頁面内容</p>
        </div>
      </div>
    </div>
  )
}

export default SystemSettings

