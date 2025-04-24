"use client";
import { WalletWithId } from "@/types/wallet";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";

interface WalletPieChartProps {
  wallets: WalletWithId[];
}
export const WalletPieChart = ({ wallets }: WalletPieChartProps) => {
  const chartData = wallets.map((w, idx) => {
    const colorIndex = (idx % 5) + 1;
    return {
      name: w.walletName,
      value: w.currentAmount,
      fill: `var(--chart-${colorIndex})`,
    };
  });

  const total = chartData.reduce((sum, slice) => sum + slice.value, 0);

  const chartConfig = wallets.reduce((cfg, w) => {
    cfg[w.walletName] = {
      label: w.walletName,
    };
    return cfg;
  }, {} as ChartConfig);

  return (
    <div className="w-120">
      <h3 className="text-center">Share of Funds Across Wallets</h3>
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
