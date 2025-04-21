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
  console.log({ wallets });

  return (
    <section>
      <h2>Wallets</h2>

      <Table>
        <TableCaption>A list of your all wallets</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Current Amount</TableHead>
            <TableHead>Spent Amount</TableHead>
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
