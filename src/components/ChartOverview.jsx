import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ChartOverview = ({ data }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (!data || data.length === 0) {
            setChartData([]);
            return;
        } 

        // Grupeaza feedback-urile pe proiect

        const grouped = data.reduce((acc, fb) => {
            const existing = acc.find((a) => a.project === fb.project);
            const score = Number(fb.organization) || 0;

            if (existing) {
                existing.total += score;
                existing.count += 1;
                existing.avg = parseFloat((existing.total / existing.count).toFixed(2));
            } else {
                acc.push({
                    project: fb.project,
                    total: score,
                    count: 1,
                    avg: score,
                });
            }
            return acc;
        }, []);

        setChartData(grouped);
    }, [data]); 

    if (chartData.lenght === 0)
        return <p style={{textAlign: 'center', padding: '20px'}}>Nu există suficiente date pentru a genera graficul.</p>;

    return (
        <div style={{ width: "100%", height: 300, marginTop: '30px' }}>
            <h2 style={{textAlign: 'center'}}>Statistici Proiecte</h2>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="project" />
                    <YAxis domain={[0, 5]} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avg" fill="#004aad" name="Media Organizării" barsize={50} radius={[5,5,0,0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChartOverview;