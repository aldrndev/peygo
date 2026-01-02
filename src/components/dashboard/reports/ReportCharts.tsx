"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type MonthlyRow } from "@/lib/api/admin-reports-filtered";

// Dynamic imports for recharts components to avoid SSR issues
const RevenueTrendChartInner = dynamic(
  () => import("./ReportChartsInner").then(mod => mod.RevenueTrendChartInner),
  { 
    ssr: false,
    loading: () => <ChartSkeleton title="Trend Revenue" />
  }
);

const InvoiceVolumeChartInner = dynamic(
  () => import("./ReportChartsInner").then(mod => mod.InvoiceVolumeChartInner),
  { 
    ssr: false,
    loading: () => <ChartSkeleton title="Volume Invoice & User Baru" />
  }
);

const StatusDistributionChartInner = dynamic(
  () => import("./ReportChartsInner").then(mod => mod.StatusDistributionChartInner),
  { 
    ssr: false,
    loading: () => <ChartSkeleton title="Distribusi Status" />
  }
);

const TypeDistributionChartInner = dynamic(
  () => import("./ReportChartsInner").then(mod => mod.TypeDistributionChartInner),
  { 
    ssr: false,
    loading: () => <ChartSkeleton title="Distribusi Tipe" />
  }
);

// Loading skeleton
function ChartSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] flex items-center justify-center bg-muted/30 rounded-lg">
          <div className="animate-pulse text-muted-foreground text-sm">Memuat chart...</div>
        </div>
      </CardContent>
    </Card>
  );
}

// Export wrapper components
interface RevenueTrendChartProps {
  data: MonthlyRow[];
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
  return <RevenueTrendChartInner data={data} />;
}

interface InvoiceVolumeChartProps {
  data: MonthlyRow[];
}

export function InvoiceVolumeChart({ data }: InvoiceVolumeChartProps) {
  return <InvoiceVolumeChartInner data={data} />;
}

interface StatusDistributionChartProps {
  statusCounts: Record<string, number>;
}

export function StatusDistributionChart({ statusCounts }: StatusDistributionChartProps) {
  return <StatusDistributionChartInner statusCounts={statusCounts} />;
}

interface TypeDistributionChartProps {
  billingCount: number;
  paymentCount: number;
}

export function TypeDistributionChart({ billingCount, paymentCount }: TypeDistributionChartProps) {
  return <TypeDistributionChartInner billingCount={billingCount} paymentCount={paymentCount} />;
}
