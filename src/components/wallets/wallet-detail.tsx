import Link from "next/link";
import { Eye } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { WalletWithIdWithoutAssets } from "@/types/wallet";
import { numberToCurrency } from "@/helpers/formatNumber";
import { DeleteWallet } from "@/components/wallets/actions/delete-wallet";

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
      <TableCell className="text-right w-full flex gap-2 justify-center">
        <Link href={`/dashboard/wallet/${id}`}>
          <Button className="cursor-pointer">
            <Eye />
          </Button>
        </Link>
        <DeleteWallet walletName={walletName} walletId={id} />
      </TableCell>
    </TableRow>
  );
};
