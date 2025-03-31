import { FC, useEffect, useState } from "react"
import { fetchInitInfo, updateInitInfo } from "../api/api"

const SystemSettings: FC = () => {
  const [formData, setFormData] = useState({
    surveyUrl: '',
    surveyStartDay: '',
  })

  const [loading, setLoading] = useState(false)

  // 從後端載入初始設定
  useEffect(() => {
    const fetchInit = async () => {
      try {
        const res = await fetchInitInfo()
        if (res) setFormData(res)
      } catch (error) {
        console.error("載入設定錯誤", error)
      }
    }
    fetchInit()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await updateInitInfo(formData)
      if (res?.ok || res?.status === 200) {
        alert("設定已儲存！")
      } else {
        throw new Error("後端回應不正常")
      }
    } catch (err) {
      alert("儲存失敗")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">系統設定</h1>
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">

          <div>
            <label className="block text-gray-700 font-medium mb-2">問卷網址</label>
            <input
              type="text"
              name="surveyUrl"
              value={formData.surveyUrl}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">問卷日期</label>
            <input
              type="date"
              name="surveyStartDay"
              value={formData.surveyStartDay}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="text-right">
            <button
              onClick={handleSubmit}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50' : ''}`}
              disabled={loading}
            >
              {loading ? '儲存中...' : '儲存設定'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SystemSettings
