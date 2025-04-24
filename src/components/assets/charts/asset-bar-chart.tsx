"use client";
import { Asset } from "@/types/wallet";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Current Value",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Purchase Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface AssetBarChartProps {
  assets: Asset[];
}

export const AssetBarChart = ({ assets }: AssetBarChartProps) => {
  // build one slice per asset, multiplying by quantity
  const data = assets.map((a) => ({
    name: a.symbol, // or use a.name if you prefer full names
    currentValue: a.currentPrice * a.quantity,
    purchaseValue: a.purchasePrice * a.quantity,
  }));

  return (
    <div className="w-full sm:w-120">
      <h3 className="text-center">Current vs. Purchase Value per Asset</h3>
      <ChartContainer config={chartConfig} className="min-h-[200px]">
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            dataKey="currentValue"
            fill="var(--color-desktop)"
            radius={4}
            name="Current Value"
          />
          <Bar
            dataKey="purchaseValue"
            fill="var(--color-mobile)"
            radius={4}
            name="Purchase Value"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
