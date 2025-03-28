"use client";

import { FC, useState, useEffect } from "react";
// import { Users, Star, BarChart2, TrendingUp } from "lucide-react";
import StatCard from "../components/StarCard";
import DataTable from "../components/DataTable";
import { fetchSupervisors, fetchStars } from "../api/api";
import { branchArea, branchList } from "../types/common";

const Dashboard: FC = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStars: 0,
    totalSupervisors: 0,
    avgStars: "0",
    medianStars: 0,
    currentMonthStars: 0,
    supervisorsRank: [] as Array<{
      rank: number;
      id: string;
      name: string;
      region: string;
      department: string;
      stars: number;
      updateDate: string;
    }>,
  });
  const [filterValue, setFilterValue] = useState("monthly");
  const [currentPage, setCurrentPage] = useState(1);

  // 計算中位數
  const calculateMedian = (arr: number[]): number => {
    if (arr.length === 0) return 0;
    const sorted = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  };

  // 取得並計算 Dashboard 資料
  const loadDashboardData = async () => {
    try {
      const [supervisors, stars] = await Promise.all([fetchSupervisors(), fetchStars()]);

      // 過濾掉無效的星星記錄
      const validStars = stars.filter((star: any) => star.valid !== false);

      // 僅計算在有效主管名單中的星星記錄
      const validSupervisorIds = new Set(supervisors.map((s: any) => s.id));

      let totalStars = 0;
      const supervisorStars: { [key: string]: number } = {};
      validStars.forEach((star: any) => {
        if (validSupervisorIds.has(star.supervisorId)) {
          supervisorStars[star.supervisorId] = (supervisorStars[star.supervisorId] || 0) + star.score;
          totalStars += star.score;
        }
      });

      // 假設所有主管資料均為現存主管
      const totalSupervisors = supervisors.length;
      const avgStars = totalSupervisors ? (totalStars / totalSupervisors).toFixed(2) : "0";

      // 針對每位主管計算星星總和的中位數
      const allStarsArray = supervisors.map((s: any) => supervisorStars[s.id] || 0);
      const medianStars = calculateMedian(allStarsArray);

      // 本月新增星星數計算
      let currentMonthStars = 0;
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();
      validStars.forEach((star: any) => {
        const starDate = new Date(star.date);
        if (starDate.getFullYear() === currentYear && starDate.getMonth() === currentMonth) {
          currentMonthStars += star.score;
        }
      });

      // 整合主管資料，並填入其他欄位（預設值若無 API 資料）
      const supervisorList = supervisors.map((s: any) => ({
        id: s.id,
        name: s.name,
        region: branchArea[branchList[s.branchCode]?.area] || "N/A",
        department: s.branchCode || "N/A",
        stars: supervisorStars[s.id] || 0,
        updateDate: s.updateDate || new Date().toLocaleDateString("zh-TW", { timeZone: "Asia/Taipei" }),
      }));

      // 依星星數排序（由高到低）
      supervisorList.sort((a: { stars: number }, b: { stars: number }) => b.stars - a.stars);

      // 將排名加進資料（依排序順序設定 rank = index+1）
      const rankedSupervisors = supervisorList.map((s: any, index: number) => ({
        rank: index + 1,
        ...s,
      }));

      setDashboardData({
        totalStars,
        totalSupervisors,
        avgStars,
        medianStars,
        currentMonthStars,
        supervisorsRank: rankedSupervisors,
      });
    } catch (error) {
      console.error("取得 Dashboard 資料錯誤:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-5 gap-4 mb-6">
          <StatCard
            title="總達人數"
            value={dashboardData.totalSupervisors}
            // change={{ value: 0, isPositive: true, label: "" }}
            // icon={<Users size={24} color="#fff" />}
            // iconBgColor="#e0e7ff"
          />
          <StatCard
            title="總星星數"
            value={dashboardData.totalStars}
            // change={{ value: 0, isPositive: true, label: "" }}
            // icon={<Users size={24} color="#fff" />}
            // iconBgColor="#e0e7ff"
          />
          <StatCard
            title="本月新增量數"
            value={dashboardData.currentMonthStars}
            // change={{ value: 0, isPositive: true, label: "" }}
            // icon={<TrendingUp size={24} color="#fff" />}
            // iconBgColor="#fee2e2"
          />
          <StatCard
            title="星星中位數"
            value={dashboardData.medianStars}
            // change={{ value: 0, isPositive: false, label: "" }}
            // icon={<Star size={24} color="#fff" />}
            // iconBgColor="#dcfce7"
          />
          <StatCard
            title="平均個人數"
            value={dashboardData.avgStars}
            // change={{ value: 0, isPositive: true, label: "" }}
            // icon={<BarChart2 size={24} color="#fff" />}
            // iconBgColor="#fee2e2"
          />
        </div>

        <div className="mb-6">
          <DataTable
            title="數位達人排名"
            columns={[
              {
                id: "rank",
                label: "排名",
                render: (value: number) => {
                  let badgeClass = "";
                  if (value === 1) badgeClass = "bg-amber-100 text-amber-600";
                  else if (value === 2) badgeClass = "bg-gray-100 text-gray-600";
                  else if (value === 3) badgeClass = "bg-red-100 text-red-600";
                  return (
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-semibold text-sm ${badgeClass}`}>
                      {value}
                    </span>
                  );
                },
                sortable: true
              },
              { id: "id", label: "行編", sortable: true },
              { id: "name", label: "達人姓名" },
              { id: "region", label: "區域", sortable: true },
              { id: "department", label: "分行", sortable: true },
              { id: "stars", label: "星數", sortable: true },
              { id: "updateDate", label: "更新日期" },
            ]}
            data={dashboardData.supervisorsRank}
            filter={{
              options: [
                { label: "月份", value: "monthly" },
                { label: "季度", value: "quarterly" },
                { label: "年度", value: "yearly" },
              ],
              value: filterValue,
              onChange: setFilterValue,
            }}
            pagination={{
              pageSize: 10,
              currentPage: currentPage,
              totalItems: 100,
              onPageChange: setCurrentPage,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;