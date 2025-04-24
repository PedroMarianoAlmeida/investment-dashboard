import { Asset } from "@/types/wallet";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AssetDetails } from "@/components/assets/asset-detail";

interface AssetsTableProps {
  assets: Asset[];
  selectedWallet: string;
}
export const AssetsTable = ({ assets, selectedWallet }: AssetsTableProps) => {
  if (assets.length === 0) return <p className="mb-2">No assets yet</p>;
  return (
    <Table className="rounded-lg border border-separate border-spacing-0 p-2">
      <TableHeader>
        <TableRow className="grid grid-cols-5 pb-2">
          <TableHead className="text-muted-foreground text-left h-auto">
            Asset
          </TableHead>
          <TableHead className="text-muted-foreground text-left h-auto">
            Type
          </TableHead>
          <TableHead className="text-muted-foreground text-left h-auto">
            Quantity
          </TableHead>
          <TableHead className="text-muted-foreground text-right h-auto break-normal whitespace-normal">
            Purchase Price
          </TableHead>
          <TableHead className="text-muted-foreground text-center h-auto break-normal whitespace-normal">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <AssetDetails
            asset={asset}
            key={asset.symbol}
            selectedWallet={selectedWallet}
          />
        ))}
      </TableBody>
    </Table>
  );
};
