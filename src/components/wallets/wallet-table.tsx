"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Wallet } from "@/types/wallet";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WalletsDetails } from "@/components/wallets/wallet-detail";

interface WalletsTableProps {
  wallets: Omit<Wallet, "assets">[];
}
export const WalletTable = ({ wallets }: WalletsTableProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectWallet = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("selected", name);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Table className="rounded-lg border border-separate border-spacing-0 p-2">
      <TableHeader>
        <TableRow className="grid grid-cols-3 pb-2">
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
          <WalletsDetails
            walletDetail={wallet}
            onClick={() => selectWallet(wallet.walletName)}
            key={wallet.walletName}
          />
        ))}
      </TableBody>
    </Table>
  );
};
