"use client";

import { FC, useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MoreVertical, ChevronLeft, ChevronRight, } from "lucide-react";
import Modal from "../components/Modal";
import AddMasterModal from "../components/AddMasterModal";
import EditMasterModal from "../components/EditMasterModal";
import { fetchSupervisors, fetchStars, deleteSupervisor, addMaster, editSupervisor, } from "../api/api";
import { AddMasterform, Master, branchArea, branchList, Star, TableItem } from "../types/common";
import { useNavigate } from "react-router-dom";
import { exportToCSV } from "../services/exportReport";


const UserManagement: FC = () => {
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TableItem | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });
  const [loading, setLoading] = useState<boolean>(false);
  const [error] = useState<string | null>(null);
  const [selectedMasters, setSelectedMasters] = useState<Master[]>([]);
  const [showAddMasterModal, setShowAddMasterModal] = useState(false);
  const pageSize = 10;
  const navigate = useNavigate();

  const [filteredData, setFilteredData] = useState<TableItem[]>([]);
  const [filterId, setFilterId] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterBranchCode] = useState("");
  const [minStars, setMinStars] = useState<number | "">("");
  const [maxStars, setMaxStars] = useState<number | "">("");


  // 取得資料
  const loadData = async () => {
    console.log("start load")
    setLoading(true);
    try {
      const [supervisors, stars]: [Master[], Star[]] = await Promise.all([
        fetchSupervisors(),
        fetchStars(),
      ]);
  
      const validStars = stars.filter((star) => star.valid !== false);
      const starSums: { [key: string]: number } = {};
  
      validStars.forEach((star) => {
        starSums[star.supervisorId] = (starSums[star.supervisorId] || 0) + star.score;
      });
  
      const data: TableItem[] = supervisors.map((s) => {
        const branchInfo = branchList[s.branchCode] || { name: "N/A", area: "7" };
        const regionName = branchArea[branchInfo.area] || "其他";
  
        return {
          id: s.id,
          rowNumber: s.id,
          name: s.name,
          region: regionName,
          branch: branchInfo.name,
          branchCode: s.branchCode,
          stars: starSums[s.id] || 0,
        };
      });
  
      setTableData(data);
      setFilteredData(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("取得資料錯誤:", err);
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    loadData();
  }, []);


  useEffect(() => {
    let filtered = tableData;
  
    if (filterId) {
      filtered = filtered.filter(item => item.id.includes(filterId));
    }
  
    if (filterName) {
      filtered = filtered.filter(item => item.name.includes(filterName));
    }
  
    if (filterRegion) {
      filtered = filtered.filter(item => item.region.includes(filterRegion));
    }
  
    if (filterBranch) {
      filtered = filtered.filter(item => item.branch.includes(filterBranch));
    }

    if (filterBranchCode) {
      filtered = filtered.filter(item => item.branch.includes(filterBranchCode));
    }
  
    if (minStars !== "") {
      filtered = filtered.filter(item => item.stars >= Number(minStars));
    }
  
    if (maxStars !== "") {
      filtered = filtered.filter(item => item.stars <= Number(maxStars));
    }

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      filtered = [...filtered].sort((a, b) => {
        const key = sortConfig.key as keyof TableItem;
        let valA = a[key];
        let valB = b[key];
        
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
  
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [tableData, filterId, filterName, filterRegion, filterBranch, filterBranchCode, minStars, maxStars, sortConfig]);
  

  // 分頁計算
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (columnId: keyof TableItem) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === columnId) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }
    setSortConfig({ key: direction ? columnId : null, direction });
  };
  
  const renderSortIcon = (columnId: keyof TableItem) => {
    if (sortConfig.key !== columnId)
      return <ChevronDown size={16} className="text-gray-300" />;
    if (sortConfig.direction === "asc") return <ChevronUp size={16} />;
    if (sortConfig.direction === "desc") return <ChevronDown size={16} />;
    return <ChevronDown size={16} className="text-gray-300" />;
  };

  const handleSelectAll = () => {
    if (selectedItems.length === tableData.length) {
      setSelectedItems([]);
      setSelectedMasters([]);
    } else {
      const ids = tableData.map((item) => item.id);
      setSelectedItems(ids);
      // 假設 tableData 順序與 supervisor 名單相同，
      // 或者您可以另外儲存 full supervisors 名單，並根據選取的 id 過濾
      setSelectedMasters(
        tableData.map((item) => ({
          id: item.id,
          name: item.name,
          branchCode: item.branch,
        }))
      );
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
      setSelectedMasters(
        selectedMasters.filter((master) => master.id !== id)
      );
    } else {
      setSelectedItems([...selectedItems, id]);
      const selectedMaster = tableData.find((item) => item.id === id);
      if (selectedMaster) {
        setSelectedMasters([
          ...selectedMasters,
          {
            id: selectedMaster.id,
            name: selectedMaster.name,
            branchCode: selectedMaster.branch,
          },
        ]);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此主管嗎？")) return;
    try {
      await deleteSupervisor(id);
      await loadData();
    } catch (error) {
      console.error("刪除資料錯誤:", error);
      alert("刪除失敗");
    }
  };

  // 點擊「新增達人」後顯示 Modal
  const handleAddMasterClick = () => {
    setShowAddMasterModal(true);
  };

  const handleSaveMaster = async (data: AddMasterform) => {
    try {
      await addMaster(data);
      setShowAddMasterModal(false);
      await loadData();
    } catch (err) {
      console.error("新增資料錯誤:", err);
      alert("新增失敗");
    }
  };
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<Master>({
    id: "",
    name: "",
    branchCode: "",
  });

  const handleEdit = async (updatedMaster: Master) => {
    try {
      await editSupervisor(updatedMaster.id, updatedMaster); // 先等後端處理完
      setShowEditModal(false); // 然後關閉 modal
      await loadData(); // 再去 reload 資料
      } catch (error) {
      console.error("編輯資料錯誤:", error);
      alert("編輯失敗");
    }
  };
    

  // 將勾選的 master 傳送到 ratingStar 頁面
  const handleGoToRatingStar = () => {
    if (selectedMasters.length < 1){
      alert("請選擇至少一筆");
      return
    }
    // 使用 React Router 傳遞 state
    navigate("/star-rating", { state: { selectedMasters } });

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">達人管理</h1>
          <div className="flex gap-3">
            <button
              onClick={handleAddMasterClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              新增達人
            </button>
            <button
              onClick={handleGoToRatingStar}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              新增評分(多筆)
            </button>
            {/* 匯出功能 */}
            <button
              onClick={() => exportToCSV(filteredData, "達人管理")}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
              匯出 CSV
            </button>
          </div>
        </div>

        {/* 篩選欄 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-white p-4 rounded-md shadow-sm">
          <input
            type="text"
            placeholder="行編"
            className="border p-2 rounded"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
          />
          <input
            type="text"
            placeholder="達人姓名"
            className="border p-2 rounded"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="">選擇區域</option>
            {Object.keys(branchArea).map((key) => (
              <option key={key} value={branchArea[key]}>
                {branchArea[key]}
              </option>
            ))}
          </select>
          <select
            className="border p-2 rounded"
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
          >
            <option value="">選擇分行</option>
            {Object.keys(branchList).map((key) => (
              <option key={key} value={branchList[key].name}>
                {branchList[key].name}
            </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="最小星數"
            className="border p-2 rounded"
            value={minStars}
            onChange={(e) => setMinStars(e.target.value ? Number(e.target.value) : "")}
          />
          <input
            type="number"
            placeholder="最大星數"
            className="border p-2 rounded"
            value={maxStars}
            onChange={(e) => setMaxStars(e.target.value ? Number(e.target.value) : "")}
          />
        </div>


        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 w-12">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedItems.length === tableData.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        行編 {renderSortIcon("id")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      達人姓名
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("region")}
                    >
                      <div className="flex items-center">
                        區域 {renderSortIcon("region")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("branch")}
                    >
                      <div className="flex items-center">
                        分行 {renderSortIcon("branch")}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("branchCode")}
                    >
                      <div className="flex items-center">
                        分行代碼 {renderSortIcon("branchCode")}
                      </div>
                    </th>

                    <th
                      className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("stars")}
                    >
                      <div className="flex items-center">
                        星級 {renderSortIcon("stars")}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selectedItems.includes(row.id)}
                          onChange={() => handleSelectItem(row.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.rowNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.region}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.branch}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.branchCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.stars}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              // Set the selectedMaster with the current row's data
                              setSelectedMaster({
                                id: row.id,
                                name: row.name,
                                branchCode: row.branchCode,
                              });
                              setShowEditModal(true);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                            編輯
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                          >
                            刪除
                          </button>
                          <button className="p-1 text-gray-500 rounded hover:bg-gray-100">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-center px-6 py-4 border-t border-gray-200">
              <button
                className="p-1 text-gray-500 rounded hover:bg-gray-100"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center rounded-md ${
                    page === currentPage
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="p-1 text-gray-500 rounded hover:bg-gray-100"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showAddMasterModal}
        onClose={() => setShowAddMasterModal(false)}
      >
        <AddMasterModal
          formData={{ id: "", name: "", branchCode: "" }}
          onClose={() => setShowAddMasterModal(false)}
          onSave={handleSaveMaster}
        />
      </Modal>
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <EditMasterModal
          masterData={selectedMaster}
          onClose={() => setShowEditModal(false)}
          onSave={handleEdit}
        />
      </Modal>

    </div>
  );
};

export default UserManagement;
