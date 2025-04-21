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
}
export const AssetsTable = ({ assets }: AssetsTableProps) => {
  return (
    <Table className="rounded-lg border border-separate border-spacing-0 p-2">
      <TableHeader>
        <TableRow className="grid grid-cols-4 pb-2">
          <TableHead className="text-muted-foreground text-left h-auto">Asset</TableHead>
          <TableHead className="text-muted-foreground text-left h-auto">
            Type
          </TableHead>
          <TableHead className="text-muted-foreground text-left h-auto">
            Quantity
          </TableHead>
          <TableHead className="text-muted-foreground text-right h-auto">
            Purchase Price
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => (
          <AssetDetails asset={asset} key={asset.symbol} />
        ))}
      </TableBody>
    </Table>
  );
};
