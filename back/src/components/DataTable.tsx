"use client"

import type React from "react"

import { type FC, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface Column {
  id: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  title: string
  columns: Column[]
  data: any[]
  pagination?: {
    pageSize: number
    currentPage: number
    totalItems: number
    onPageChange: (page: number) => void
  }
  filter?: {
    options: { label: string; value: string }[]
    value: string
    onChange: (value: string) => void
  }
}

const DataTable: FC<DataTableProps> = ({ title, columns, data, pagination, filter }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: "asc" | "desc" | null
  }>({
    key: null,
    direction: null,
  })

  const handleSort = (columnId: string) => {
    let direction: "asc" | "desc" | null = "asc"

    if (sortConfig.key === columnId) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = null
      }
    }

    setSortConfig({ key: columnId, direction })
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        {filter && (
          <div className="w-32">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-500"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className=" bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider ${column.sortable ? "cursor-pointer" : ""}`}
                  onClick={column.sortable ? () => handleSort(column.id) : undefined}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && (
                      <span className="ml-2 inline-flex">
                        {sortConfig.key === column.id && sortConfig.direction === "asc" ? (
                          <ChevronUp size={16} />
                        ) : sortConfig.key === column.id && sortConfig.direction === "desc" ? (
                          <ChevronDown size={16} />
                        ) : (
                          <span className="w-4 h-4"></span>
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.id} className="px-4 py-0.5 text-sm text-gray-700">
                    {column.render ? column.render(row[column.id], row) : row[column.id]}
                  </td>
                ))}
                {/* <td className="px-4 text-center">
                  <button className="p-1 text-gray-500 rounded hover:bg-gray-100">
                    <MoreVertical size={16} />
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-500">
            顯示 {(pagination.currentPage - 1) * pagination.pageSize + 1} -{" "}
            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} 共 {pagination.totalItems}{" "}
            條
          </span>
          <div className="flex gap-1">
            <button
              className={`px-3 py-1 text-sm border border-gray-200 rounded ${pagination.currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            >
              上一頁
            </button>
            {/* Simple pagination buttons */}
            {Array.from({ length: Math.min(5, Math.ceil(pagination.totalItems / pagination.pageSize)) }).map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 text-sm border rounded ${pagination.currentPage === i + 1 ? "bg-blue-500 text-white border-blue-500" : "border-gray-200 hover:bg-gray-100"}`}
                onClick={() => pagination.onPageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={`px-3 py-1 text-sm border border-gray-200 rounded ${pagination.currentPage === Math.ceil(pagination.totalItems / pagination.pageSize) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
              disabled={pagination.currentPage === Math.ceil(pagination.totalItems / pagination.pageSize)}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            >
              下一頁
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable

