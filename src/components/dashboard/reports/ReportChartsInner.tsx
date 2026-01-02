"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type MonthlyRow } from "@/lib/api/admin-reports-filtered";

// Chart color palette
const COLORS = {
  emerald: "#10b981",
  blue: "#3b82f6",
  orange: "#f97316",
  violet: "#8b5cf6",
  red: "#ef4444",
  gray: "#6b7280",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: COLORS.gray,
  SENT: COLORS.orange,
  PAID: COLORS.emerald,
  DISBURSED: COLORS.blue,
  FAILED: COLORS.red,
  EXPIRED: "#9ca3af",
};

// Hook for measuring container width
function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  return { ref, width };
}

interface RevenueTrendChartProps {
  data: MonthlyRow[];
}

export function RevenueTrendChartInner({ data }: RevenueTrendChartProps) {
  const { ref, width } = useContainerWidth();
  
  const chartData = useMemo(() => 
    data.map(d => ({
      name: d.month,
      revenue: d.revenue,
      fees: d.fees,
    })),
  [data]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("id-ID", { 
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(value);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Trend Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Tidak ada data untuk periode ini
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Trend Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={ref} className="w-full h-[280px]">
          {width > 0 && (
            <LineChart 
              width={width} 
              height={280} 
              data={chartData} 
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: "#6b7280" }}
              />
              <YAxis 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={formatCurrency}
                tick={{ fill: "#6b7280" }}
                width={60}
              />
              <Tooltip 
                formatter={(value) => [
                  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value) || 0),
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Revenue"
                stroke={COLORS.emerald} 
                strokeWidth={2}
                dot={{ fill: COLORS.emerald, strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="fees" 
                name="Platform Fee"
                stroke={COLORS.orange} 
                strokeWidth={2}
                dot={{ fill: COLORS.orange, strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface InvoiceVolumeChartProps {
  data: MonthlyRow[];
}

export function InvoiceVolumeChartInner({ data }: InvoiceVolumeChartProps) {
  const { ref, width } = useContainerWidth();
  
  const chartData = useMemo(() => 
    data.map(d => ({
      name: d.month,
      invoices: d.invoices,
      users: d.newUsers,
    })),
  [data]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Volume Invoice & User Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Tidak ada data untuk periode ini
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Volume Invoice & User Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={ref} className="w-full h-[280px]">
          {width > 0 && (
            <BarChart 
              width={width} 
              height={280} 
              data={chartData} 
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: "#6b7280" }}
              />
              <YAxis 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: "#6b7280" }}
                width={40}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar 
                dataKey="invoices" 
                name="Invoice"
                fill={COLORS.blue} 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="users" 
                name="User Baru"
                fill={COLORS.violet} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatusDistributionChartProps {
  statusCounts: Record<string, number>;
}

export function StatusDistributionChartInner({ statusCounts }: StatusDistributionChartProps) {
  const { ref, width } = useContainerWidth();
  
  const data = useMemo(() => 
    Object.entries(statusCounts).map(([name, value]) => ({
      name: getStatusLabel(name),
      value,
      color: STATUS_COLORS[name] || COLORS.gray,
    })),
  [statusCounts]);

  const total = data.reduce((acc, d) => acc + d.value, 0);

  if (data.length === 0 || total === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Distribusi Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Tidak ada data untuk periode ini
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartWidth = Math.max(width, 300);
  const outerRadius = Math.min(chartWidth / 3, 100);
  const innerRadius = outerRadius * 0.55;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Distribusi Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={ref} className="w-full h-[280px] flex justify-center">
          {width > 0 && (
            <PieChart width={chartWidth} height={280}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [
                  `${value} (${((Number(value) / total) * 100).toFixed(1)}%)`,
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TypeDistributionChartProps {
  billingCount: number;
  paymentCount: number;
}

export function TypeDistributionChartInner({ billingCount, paymentCount }: TypeDistributionChartProps) {
  const { ref, width } = useContainerWidth();
  
  const data = [
    { name: "Billing", value: billingCount, color: COLORS.blue },
    { name: "Payment", value: paymentCount, color: COLORS.orange },
  ];

  const total = billingCount + paymentCount;

  if (total === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Distribusi Tipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">
            Tidak ada data untuk periode ini
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartWidth = Math.max(width, 300);
  const outerRadius = Math.min(chartWidth / 3, 100);
  const innerRadius = outerRadius * 0.55;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Distribusi Tipe</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={ref} className="w-full h-[280px] flex justify-center">
          {width > 0 && (
            <PieChart width={chartWidth} height={280}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [
                  `${value} (${total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0}%)`,
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: "Draft",
    SENT: "Terkirim",
    PAID: "Lunas",
    DISBURSED: "Dicairkan",
    FAILED: "Gagal",
    EXPIRED: "Kedaluwarsa",
  };
  return labels[status] || status;
}
