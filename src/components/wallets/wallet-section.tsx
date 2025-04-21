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
        <TableCaption>A list of your all wallets</TableCaption>
        <TableHeader>
          <TableRow className="grid grid-cols-3">
            <TableHead className="text-muted-foreground">Name</TableHead>
            <TableHead className="text-muted-foreground text-right">
              Current Amount
            </TableHead>
            <TableHead className="text-muted-foreground text-right">
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
