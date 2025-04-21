import { TableCell, TableRow } from "@/components/ui/table";
import { Asset } from "@/types/wallet";
import { numberToCurrency } from "@/helpers/formatNumber";
import { capitalizeFirstLetter } from "@/helpers/formatText";

interface AssetDetailsProps {
  asset: Asset;
}

export const AssetDetails = ({
  asset: { type, symbol, quantity, purchasePrice },
}: AssetDetailsProps) => {
  return (
    <TableRow className="grid grid-cols-4 place-items-center">
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
    </TableRow>
  );
};
