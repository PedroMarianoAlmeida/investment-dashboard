import { TableCell, TableRow } from "@/components/ui/table";
import { Wallet } from "@/types/wallet";

interface WalletsDetailsProps {
  walletDetail: Omit<Wallet, "assets">;
}

export const WalletsDetails = ({
  walletDetail: { walletName, currentAmount, spentAmount },
}: WalletsDetailsProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{walletName}</TableCell>
      <TableCell>{currentAmount}</TableCell>
      <TableCell>{spentAmount}</TableCell>
    </TableRow>
  );
};
