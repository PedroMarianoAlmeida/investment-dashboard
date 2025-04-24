import { Bitcoin, ChartCandlestick } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";
import { Asset } from "@/types/wallet";
import { numberToCurrency } from "@/helpers/formatNumber";
import { EditAsset } from "@/components/assets/actions/edit-asset";
import { DeleteAsset } from "@/components/assets/actions/delete-asset";

interface AssetDetailsProps {
  asset: Asset;
  selectedWallet: string;
}

export const AssetDetails = ({
  asset: { type, symbol, quantity, purchasePrice, currentPrice, name },
  selectedWallet,
}: AssetDetailsProps) => {
  const balance = (currentPrice - purchasePrice) * quantity;
  return (
    <TableRow className="grid grid-cols-4 place-items-center">
      <TableCell className="text-base break-normal whitespace-normal text-center w-full">
        {name} ({symbol})
      </TableCell>
      <TableCell className="break-normal whitespace-normal w-full flex justify-center">
        {type === "crypto" ? <Bitcoin /> : <ChartCandlestick />}
      </TableCell>
      <TableCell
        className={`text-center w-full ${
          balance >= 0 ? "font-bold" : "text-destructive"
        }`}
      >
        {numberToCurrency({ amount: balance })}
      </TableCell>
      <TableCell className="w-full flex gap-2 justify-center">
        <EditAsset
          selectedWallet={selectedWallet}
          originalData={{ type, quantity, purchasePrice, currentPrice, name }}
          selectedAsset={symbol}
        />
        <DeleteAsset selectedWallet={selectedWallet} selectedAsset={symbol} />
      </TableCell>
    </TableRow>
  );
};
