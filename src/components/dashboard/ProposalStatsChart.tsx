// src/components/dashboard/ProposalStatsChart.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, } from "recharts";
import * as Tabs from "@radix-ui/react-tabs";
import { ProposalDetailTable } from "./ProposalDetailTable";

interface StatData {
    year: number;
    jurusan: string;
    penelitian_count: number;
    pengabdian_count: number;
}

type YearlyChartData = {
    jurusan: string;
    penelitian_count: number;
    pengabdian_count: number;
    total_count: number;
};

type GroupedChartData = { [year: string]: YearlyChartData[]; };

const processDataForSeparateCharts = (data: StatData[]): GroupedChartData => {
    const groupedData: GroupedChartData = {};
    data.forEach(({ year, jurusan, penelitian_count, pengabdian_count }) => {
        const yearStr = String(year);
        if (!groupedData[yearStr]) {
        groupedData[yearStr] = [];
        }
        groupedData[yearStr].push({
        jurusan,
        penelitian_count,
        pengabdian_count,
        total_count: penelitian_count + pengabdian_count,
        });
    });
    return groupedData;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
        <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-sm text-gray-600 mt-1">Penelitian: {data.penelitian_count}</p>
            <p className="text-sm text-gray-600">Pengabdian: {data.pengabdian_count}</p>
            <p className="text-sm text-gray-700 font-bold mt-1">Total: {data.total_count}</p>
        </div>
        );
    }
    return null;
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28"];

export const ProposalStatsChart = () => {
    const [data, setData] = useState<GroupedChartData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [detailData, setDetailData] = useState<any[]>([]);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [selection, setSelection] = useState({ year: '', jurusan: '' });

    useEffect(() => {
        const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/dashboard/proposal-stats");
            if (!response.ok) {
            throw new Error(`Gagal mengambil data: ${response.statusText}`);
            }
            const jsonData = (await response.json()) as StatData[];
            setData(processDataForSeparateCharts(jsonData));
            setError(null);
        } catch (err) {
            console.error("Failed to fetch proposal stats:", err);
            setError("Gagal memuat data statistik.");
        } finally {
            setIsLoading(false);
        }
        };
        fetchData();
    }, []);

    const maxCount = useMemo(() => {
        if (Object.keys(data).length === 0) return 0;
        const allCounts = Object.values(data).flat().map(item => item.total_count);
        const max = Math.max(...allCounts);
        return Math.ceil(max / 10) * 10;
    }, [data]);

    const sortedYears = Object.keys(data).sort((a, b) => Number(b) - Number(a));

    const handleBarClick = async (payload: any, year: string) => {
    if (!payload || !payload.jurusan) return;

    const { jurusan } = payload;
    setSelection({ year, jurusan });
    setIsDetailLoading(true);

    try {
        const response = await fetch(`/api/proposals/details?year=${year}&jurusan=${jurusan}`);
        const details = await response.json();
        setDetailData(details);
        } catch (err) {
        console.error("Gagal memuat detail proposal:", err);
        setDetailData([]); // Kosongkan data jika error
        } finally {
        setIsDetailLoading(false);
        }
    };

    if (isLoading) { return <div className="p-4 text-center">Memuat data chart...</div>; }
    if (error) { return <div className="p-4 text-center text-red-500">{error}</div>; }
    if (sortedYears.length === 0) { return <div className="mb-8 p-6 bg-white rounded-lg shadow-md text-center">Belum ada data proposal yang berhasil untuk ditampilkan.</div>; }

    return (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Jumlah Proposal Didanai per Jurusan
        </h2>
        
        <Tabs.Root defaultValue={sortedYears[0]}>
            <Tabs.List className="flex border-b border-gray-200">
            {sortedYears.map((year) => (
                <Tabs.Trigger
                key={year}
                value={year}
                className="px-4 py-2 -mb-px font-medium text-sm text-gray-500 border-b-2 border-transparent hover:text-blue-600 focus:outline-none data-[state=active]:text-blue-600 data-[state=active]:border-blue-600"
                >
                {year}
                </Tabs.Trigger>
            ))}
            </Tabs.List>
            
            {sortedYears.map((year) => (
            <Tabs.Content key={year} value={year} className="pt-6 focus:outline-none">
                <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data[year]} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="jurusan" angle={-15} textAnchor="end" height={50} interval={0} fontSize={12} />
                    <YAxis allowDecimals={false} domain={[0, maxCount > 0 ? maxCount : 'auto']} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 230, 230, 0.5)' }} />
                    <Bar dataKey="total_count" fill="#8884d8" onClick={(data) => handleBarClick(data.payload, year)} style={{ cursor: 'pointer' }}>
                    {data[year].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            </Tabs.Content>
            ))}
        </Tabs.Root>
        {selection.jurusan && (
        <ProposalDetailTable 
            data={detailData} 
            isLoading={isDetailLoading} 
            selection={selection} 
            />
        )}
        </div>
    );
};