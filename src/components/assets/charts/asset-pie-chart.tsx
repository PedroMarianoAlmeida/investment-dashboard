"use client";
import { Asset } from "@/types/wallet";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";

interface AssetPieChartProps {
  assets: Asset[];
}

export const AssetPieChart = ({ assets }: AssetPieChartProps) => {
  // 1) Build chart data: one slice per asset
  const chartData = assets.map((a, idx) => {
    const colorIndex = (idx % 5) + 1;
    return {
      name: a.symbol,  // or a.name
      value: a.currentPrice * a.quantity,
      fill: `var(--chart-${colorIndex})`,
    };
  });

  // 2) Sum up all values for the center label
  const total = chartData.reduce((sum, slice) => sum + slice.value, 0);

  // 3) Create a config mapping each slice name to its label
  const chartConfig = assets.reduce((cfg, a) => {
    cfg[a.symbol] = { label: a.symbol };
    return cfg;
  }, {} as ChartConfig);

  return (
    <div className="w-120">
      <h3 className="text-center">Share of Value Across Assets</h3>
      <ChartContainer config={chartConfig} className="min-h-[200px]">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan className="fill-foreground font-bold">
                        ${total}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};
