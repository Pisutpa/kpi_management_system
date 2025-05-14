import React, { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import useKpiStore from '../../store/kpi-store';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const Dashboard = () => {
    const listkpi = useKpiStore((state) => state.listkpi);
    const getKpi = useKpiStore((state) => state.getKpi);
    const token = useKpiStore((state) => state.token);
    const listuser = useKpiStore((state) => state.listuser);

    const [filteredKpis, setFilteredKpis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(filteredKpis.length / itemsPerPage);

    useEffect(() => {
        if (token) {
            getKpi(token);
        }
    }, [token, getKpi]);

    useEffect(() => {
        if (listkpi.length > 0) {
            applyFilters(selectedStatus, selectedUser);
            setLoading(false);
        }
    }, [listkpi]);

    const applyFilters = (status, userId) => {
        let kpis = listkpi;

        if (status !== 'All') {
            kpis = kpis.filter((kpi) => kpi.status === status);
        }

        if (userId) {
            kpis = kpis.filter((kpi) => kpi.assigned_user === parseInt(userId, 10));
        }

        setFilteredKpis(kpis);
        setCurrentPage(1)
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);
        applyFilters(status, selectedUser);
    };

    const handleUserFilter = (userId) => {
        setSelectedUser(userId);
        applyFilters(selectedStatus, userId);
    };

    const getAchievedKpisPercentage = () => {
        const achieved = filteredKpis.filter((kpi) => kpi.actual_value >= kpi.target_value).length;
        return filteredKpis.length > 0
            ? ((achieved / filteredKpis.length) * 100).toFixed(2)
            : '0.00';
    };

    const pieChartData = {
        labels: ['On Track', 'At Risk', 'Off Track'],
        datasets: [
            {
                data: [
                    filteredKpis.filter((kpi) => kpi.status === 'On Track').length,
                    filteredKpis.filter((kpi) => kpi.status === 'At Risk').length,
                    filteredKpis.filter((kpi) => kpi.status === 'Off Track').length,
                ],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
            },
        ],
    };

    const getMonthlyKpiTrends = () => {
        const monthMap = {};

        filteredKpis.forEach((kpi) => {
            const month = new Date(kpi.start_date).toISOString().slice(0, 7); // YYYY-MM
            if (monthMap[month]) {
                monthMap[month] += 1;
            } else {
                monthMap[month] = 1;
            }
        });

        const sortedMonths = Object.keys(monthMap).sort();
        const counts = sortedMonths.map((m) => monthMap[m]);

        return {
            labels: sortedMonths,
            data: counts,
        };
    };

    const monthlyTrends = getMonthlyKpiTrends();

    const trendChartData = {
        labels: monthlyTrends.labels,
        datasets: [
            {
                label: 'จำนวน KPI ต่อเดือน',
                data: monthlyTrends.data,
                fill: false,
                borderColor: '#36a2eb',
                backgroundColor: '#36a2eb',
                tension: 0.3,
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

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6 bg-white shadow-md">
            <h1 className="text-xl font-semibold mb-4">KPI Dashboard</h1>

            <div className="mb-4 flex flex-wrap gap-2">
                {['All', 'On Track', 'At Risk', 'Off Track'].map((status) => {
                    const colorMap = {
                        All: 'bg-blue-500',
                        'On Track': 'bg-green-500',
                        'At Risk': 'bg-yellow-500',
                        'Off Track': 'bg-red-500',
                    };
                    return (
                        <button
                            key={status}
                            onClick={() => handleStatusFilter(status)}
                            className={`text-white rounded-md p-1 shadow-md ${colorMap[status]}`}
                        >
                            {status}
                        </button>
                    );
                })}
            </div>

            <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">เลือกพนักงาน</label>
                <select
                    value={selectedUser}
                    onChange={(e) => handleUserFilter(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">ทั้งหมด</option>
                    {listuser.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-4">KPI Overview</h2>
                    <div className='w-full h-[300px]'>
                        <Pie
                            data={pieChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-4">KPI Trends (รายเดือน)</h2>
                    <div className='w-full h-[300px]'>
                        <Line
                            data={trendChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: { precision: 0 },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="text-center text-xl font-medium mt-6">
                Achieved KPIs: {getAchievedKpisPercentage()}%
            </div>

            <div className="mt-6 overflow-x-auto">
                <table className="min-w-full table-auto border">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border">No.</th>
                            <th className="py-2 px-4 border">Title</th>
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Assigned User</th>
                            <th className="py-2 px-4 border">Start Date</th>
                            <th className="py-2 px-4 border">End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredKpis.slice(indexOfFirstItem, indexOfLastItem).map((kpi, index) => (
                            <tr key={kpi.id}>
                                <td className="py-2 px-4 border text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                <td className="py-2 px-4 border">{kpi.title}</td>
                                <td className="py-2 px-4 border flex justify-center items-center">{renderStatusDot(kpi.status)}</td>
                                <td className="py-2 px-4 border">
                                    {listuser.find((user) => user.id === kpi.assigned_user)?.username || '-'}
                                </td>
                                <td className="py-2 px-4 border">
                                    {new Date(kpi.start_date).toLocaleDateString('th-TH', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="py-2 px-4 border">
                                    {new Date(kpi.end_date).toLocaleDateString('th-TH', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex items-center justify-between mt-4">
                    <div>
                        <label className="mr-2">แสดงแถว:</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="border rounded p-1"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-1 border rounded disabled:opacity-50"
                        >
                            ก่อนหน้า
                        </button>
                        <span>หน้า {currentPage} / {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-1 border rounded disabled:opacity-50"
                        >
                            ถัดไป
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
