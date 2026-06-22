"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

let cumulative = 0;
const data = Array.from({ length: 12 }).map((_, i) => {
  const hourly = i >= 2 && i <= 10 ? 20 + Math.random() * 30 : 0;
  cumulative += hourly;
  return {
    time: `${(i + 6).toString().padStart(2, '0')}:00`,
    cumulative: Number(cumulative.toFixed(1))
  };
});

export function TodayProductionChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Area type="monotone" dataKey="cumulative" name="Cumulative (kWh)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
