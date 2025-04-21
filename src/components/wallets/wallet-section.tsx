import { getWallets } from "@/services/walletService";

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { WalletsDetails } from "@/components/wallets/wallet-detail";

export const WalletSection = () => {
  const wallets = getWallets();

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">Wallets</h2>

      <Table>
        <TableHeader>
          <TableRow className="grid grid-cols-3 py-4">
            <TableHead className="text-muted-foreground h-auto">Name</TableHead>
            <TableHead className="text-muted-foreground text-right h-auto">
              Current Amount
            </TableHead>
            <TableHead className="text-muted-foreground text-right h-auto">
              Spent Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.map((wallet) => (
            <WalletsDetails walletDetail={wallet} key={wallet.walletName} />
          ))}
        </TableBody>
      </Table>
    </section>
  );
};
