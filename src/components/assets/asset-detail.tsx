import { TableCell, TableRow } from "@/components/ui/table";
import { Asset } from "@/types/wallet";
import { numberToCurrency } from "@/helpers/formatNumber";
import { capitalizeFirstLetter } from "@/helpers/formatText";
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
  return (
    <TableRow className="grid grid-cols-5 place-items-center">
      <TableCell className="text-base break-normal whitespace-normal text-left w-full">
        {symbol}
      </TableCell>
      <TableCell className="text-base break-normal whitespace-normal text-left w-full">
        {capitalizeFirstLetter(type)}
      </TableCell>
      <TableCell className="text-left w-full ">{quantity}</TableCell>
      <TableCell className="text-right w-full">
        {numberToCurrency({ amount: purchasePrice, withCents: true })}
      </TableCell>
      <TableCell className="text-right w-full flex gap-2 justify-center">
        <EditAsset
          selectedWallet={selectedWallet}
          originalData={{ type, quantity, purchasePrice, currentPrice, name }}
          selectedAsset={symbol}
        />
        <DeleteAsset
          selectedWallet={selectedWallet}
          selectedAsset={symbol}
        />
      </TableCell>
    </TableRow>
  );
};
