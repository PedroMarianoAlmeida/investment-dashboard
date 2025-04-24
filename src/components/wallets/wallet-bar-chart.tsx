"use client";
import { WalletWithId } from "@/types/wallet";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Current Amount",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Purchase Amount",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface WalletBarChartProps {
  wallets: WalletWithId[];
}
export const WalletBarChart = ({ wallets }: WalletBarChartProps) => {
  return (
    <div className="w-120">
      <h3 className="text-center">Current vs. Spent Amount per Wallet</h3>
      <ChartContainer config={chartConfig} className="min-h-[200px]">
        <BarChart accessibilityLayer data={wallets}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="walletName"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar
            dataKey="currentAmount"
            fill="var(--color-desktop)"
            radius={4}
            name="Current Amount"
          />
          <Bar
            dataKey="spentAmount"
            fill="var(--color-mobile)"
            radius={4}
            name="Purchase Amount"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
