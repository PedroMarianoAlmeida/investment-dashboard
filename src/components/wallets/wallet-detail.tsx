import Link from "next/link";
import { Eye } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { WalletWithIdWithoutAssets } from "@/types/wallet";
import { numberToCurrency } from "@/helpers/formatNumber";

interface WalletsDetailsProps {
  walletDetail: WalletWithIdWithoutAssets;
}

export const WalletsDetails = ({
  walletDetail: { walletName, currentAmount, spentAmount, id },
}: WalletsDetailsProps) => {
  return (
    <TableRow className="grid grid-cols-4 place-items-center">
      <TableCell className="text-base break-normal whitespace-normal text-left w-full">
        {walletName}
      </TableCell>
      <TableCell className="text-right w-full">
        {numberToCurrency({ amount: currentAmount })}
      </TableCell>
      <TableCell className="text-right w-full">
        {numberToCurrency({ amount: spentAmount })}
      </TableCell>
      <TableCell className="w-full text-center">
        <Link href={`/dashboard/wallet/${id}`}>
          <Button>
            <Eye />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
};
