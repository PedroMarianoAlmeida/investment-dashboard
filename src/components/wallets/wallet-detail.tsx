import { TableCell, TableRow } from "@/components/ui/table";
import { Wallet } from "@/types/wallet";

interface WalletsDetailsProps {
  walletDetail: Omit<Wallet, "assets">;
}

export const WalletsDetails = ({
  walletDetail: { walletName, currentAmount, spentAmount },
}: WalletsDetailsProps) => {
  return (
    <TableRow className="grid grid-cols-3 place-items-center">
      <TableCell className="text-base break-normal whitespace-normal text-left w-full">
        {walletName}
      </TableCell>
      <TableCell className="text-right w-full">{currentAmount}</TableCell>
      <TableCell className="text-right w-full"> {spentAmount}</TableCell>
    </TableRow>
  );
};
