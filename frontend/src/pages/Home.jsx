import React, { useState, useEffect } from 'react'
import { listOverView } from '../api/daschBoardHome'
import { Line } from 'react-chartjs-2';

import { Pie } from 'react-chartjs-2';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);


const Home = () => {
  const [filteredKpis, setFilteredKpis] = useState([])
  const [filteredKpisTotal, setFilteredKpisTotal] = useState([])
  const [filteredAchievedKPIs, setFilteredAchievedKPIs] = useState([])
  const [FilteredRateKPIs, setFilteredRateKPIs] = useState([])


  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const totalPages = Math.ceil(filteredKpis.length / itemsPerPage)

  const safeValue = parseFloat(FilteredRateKPIs);
  const displayValue = !isNaN(safeValue) ? safeValue.toFixed(2) + '%' : '0.00%';

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await listOverView()

      setFilteredKpis(res.data.kpis)
      setFilteredKpisTotal(res.data.totalKpis)
      setFilteredAchievedKPIs(res.data.achievedKpis)
      setFilteredRateKPIs(res.data.achievementPercentage)
    } catch (error) {
      console.log(error)
    }
  }
  const getMonthlyKpiAchievementTrends = () => {
    const monthMap = {};

    filteredKpis.forEach((kpi) => {

      const isAchieved = kpi.actual_value >= kpi.target_value;
      if (!isAchieved) return


      const month = new Date(kpi.start_date).toISOString().slice(0, 7); // YYYY-MM

      if (monthMap[month]) {
        monthMap[month] += 1;
      } else {
        monthMap[month] = 1;
      }
    });

    return monthMap;
  };

  const trendData = Object.entries(getMonthlyKpiAchievementTrends()).map(([month, count]) => ({
    month,
    achievedKpis: count
  }));



  const trendChartData = {
    labels: trendData.map(item => item.month),
    datasets: [
      {
        label: 'Achieved KPIs',
        data: trendData.map(item => item.achievedKpis),
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const pieData = {
    labels: ['Sales', 'Customer Satisfaction', 'Operations', 'HR'],
    datasets: [
      {
        label: 'KPI Breakdown',
        data: [20, 15, 10, 5], // จำนวน KPI ของแต่ละหมวด ยังไม่เป็นข้อมูลจริง
        backgroundColor: ['#4F46E5', '#16A34A', '#F97316', '#8B5CF6'],
        borderWidth: 1,
      },
    ],
  };


  const renderStatusDot = (status) => {
    let colorClass = '';

    switch (status) {
      case 'On Track':
        colorClass = 'bg-green-500';
        break;
      case 'At Risk':
        colorClass = 'bg-yellow-500';
        break;
      case 'Off Track':
        colorClass = 'bg-red-500';
        break;
      default:
        colorClass = 'bg-gray-400';
    }

    return (
      <span className="flex items-center">
        <span className={`w-3 h-3 rounded-full mr-2 ${colorClass}`}></span>
        {status}
      </span>
    );
  };



  return (



    <div className="bg-white text-gray-800 font-sans min-h-screen">
      <section className="py-8 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total KPIs', value: filteredKpisTotal, color: 'bg-blue-50 text-blue-700 border border-blue-200' },
          { label: 'Achieved KPIs', value: filteredAchievedKPIs, color: 'bg-green-50 text-green-700 border border-green-200' },
          { label: 'Success Rate', value: displayValue, color: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
        ].map((k, i) => (
          <div key={i} className={`rounded-2xl shadow-md p-6 text-center ${k.color} hover:shadow-lg transition duration-200`}>
            <p className="text-lg font-medium">{k.label}</p>
            <p className="text-5xl font-bold mt-2">{k.value}</p>
          </div>
        ))}
      </section>

      <section className="px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-4 h-80 hover:shadow-lg transition duration-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">KPI Achievement Trend</h3>
          <div className='w-full h-[240px]'>
            <Line data={trendChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
            }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-4 h-80 hover:shadow-lg transition duration-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">KPI Category Breakdown</h3>
          <div className='w-full h-[240px]'>
            <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <h2 className="text-2xl font-bold mb-4">Detailed KPI List</h2>
        <div className="mt-6 overflow-x-auto rounded-xl shadow-md">
          <table className="min-w-full table-auto border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                {['No.', 'Title', 'Status', 'Start Date', 'End Date'].map((header, i) => (
                  <th key={i} className="py-3 px-4 border-b border-gray-300 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredKpis.slice(indexOfFirstItem, indexOfLastItem).map((kpi, index) => (
                <tr key={kpi.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{kpi.title}</td>
                  <td className="py-2 px-4 border-b border-gray-200 flex items-center">{renderStatusDot(kpi.status)}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(kpi.start_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{new Date(kpi.end_date).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-3 px-2 pb-2">
            <div>
              <label className="mr-2 font-medium">แสดงแถว:</label>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border rounded p-1 focus:outline-none focus:ring focus:ring-blue-300">
                {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">ก่อนหน้า</button>
              <span>หน้า {currentPage} / {totalPages}</span>
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100">ถัดไป</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-sm text-gray-500">
        Prepared by Analytics Team | Date: 10 May 2025
      </footer>

    </div>








  );
};

export default Home;
