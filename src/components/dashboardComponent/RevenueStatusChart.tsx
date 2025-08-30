import { Card, Title } from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { state: "West Bengal", Paid: 80000, Cancelled: 10000, UnderProcess: 15000, CreditNote: 5000 },
  { state: "Delhi", Paid: 60000, Cancelled: 8000, UnderProcess: 20000, CreditNote: 7000 },
  { state: "Bihar", Paid: 45000, Cancelled: 5000, UnderProcess: 20000, CreditNote: 8000 },
  { state: "MP", Paid: 50000, Cancelled: 7000, UnderProcess: 18000, CreditNote: 10000 },
  { state: "Kerala", Paid: 40000, Cancelled: 6000, UnderProcess: 15000, CreditNote: 6000 },
  { state: "Sikkim", Paid: 25000, Cancelled: 3000, UnderProcess: 10000, CreditNote: 4000 },
  { state: "Jharkhand", Paid: 30000, Cancelled: 4000, UnderProcess: 12000, CreditNote: 5000 },
  { state: "Andaman", Paid: 15000, Cancelled: 2000, UnderProcess: 7000, CreditNote: 3000 },
];

export default function RevenueStatusChart() {
  return (
    <Card shadow="lg" radius="lg" p="xl" withBorder>
      <Title order={3} mb="lg" style={{ color: "#1e3a8a" }}>
        📊 State-wise Revenue Status
      </Title>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={revenueData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="state" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Paid" stackId="a" fill="#14b8a6" animationDuration={1500} animationEasing="ease-in-out" />
          <Bar dataKey="Cancelled" stackId="a" fill="#ef4444" animationDuration={1500} animationEasing="ease-in-out" />
          <Bar dataKey="UnderProcess" stackId="a" fill="#eab308" animationDuration={1500} animationEasing="ease-in-out" />
          <Bar dataKey="CreditNote" stackId="a" fill="#3b82f6" animationDuration={1500} animationEasing="ease-in-out" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
