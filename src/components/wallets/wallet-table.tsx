import { WalletWithId } from "@/types/wallet";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WalletsDetails } from "@/components/wallets/wallet-detail";

interface WalletsTableProps {
  wallets: WalletWithId[];
}
export const WalletTable = ({ wallets }: WalletsTableProps) => {
  if (wallets.length === 0) return <p className="mb-2">No wallets yet</p>;
  return (
    <Table className="rounded-lg border border-separate border-spacing-0 p-2">
      <TableHeader>
        <TableRow className="grid grid-cols-4 pb-2">
          <TableHead className="text-muted-foreground text-center h-auto">Name</TableHead>
          <TableHead className="text-muted-foreground text-center h-auto">Assets</TableHead>
          <TableHead className="text-muted-foreground text-center h-auto">
            Balance
          </TableHead>
          <TableHead className="text-muted-foreground text-center h-auto">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {wallets.map((wallet) => (
          <WalletsDetails walletDetail={wallet} key={wallet.walletName} />
        ))}
      </TableBody>
    </Table>
  );
};
