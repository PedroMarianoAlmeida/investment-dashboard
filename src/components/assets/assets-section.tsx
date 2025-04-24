import Link from "next/link";
import { House } from "lucide-react";

import { getAssetsFromWallet } from "@/services/walletService";
import { Section } from "@/components/layout/section";
import { AssetsTable } from "@/components/assets/assets-table";
import { WalletAndAssetDataFromDb } from "@/types/wallet";
import { AddAsset } from "@/components/assets/actions/add-asset";
import { Button } from "@/components/ui/button";
import { AssetBarChart } from "@/components/assets/charts/asset-bar-chart";
import { AssetPieChart } from "@/components/assets/charts/asset-pie-chart";
interface AssetSectionProps extends WalletAndAssetDataFromDb {
  selectedWallet?: string;
}
export const AssetSection = ({
  assets,
  selectedWallet,
  wallets,
}: AssetSectionProps) => {
  if (!selectedWallet)
    return (
      <Section title="Assets" id="assets-heading">
        <p>Select a Wallet</p>
      </Section>
    );
  const assetsWallet = getAssetsFromWallet({ assets, selectedWallet, wallets });

  if (!assetsWallet.success)
    return (
      <Section title="Assets" id="assets-heading">
        <p>Invalid Wallet</p>
      </Section>
    );

  const {
    assets: existentAssets,
    otherWalletsAssets,
    selectedWalletId,
  } = assetsWallet;
  return (
    <Section title="Assets" id="assets-heading">
      <div className="flex flex-col gap-2">
        <AssetsTable
          assets={existentAssets}
          selectedWallet={selectedWalletId}
        />
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button className="cursor-pointer">
              <House /> Dashboard
            </Button>
          </Link>
          <AddAsset
            otherWalletsAssets={otherWalletsAssets}
            selectedWallet={selectedWalletId}
            assets={existentAssets}
          />
        </div>

        {existentAssets.length !== 0 && (
          <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
            <div className="w-full md:w-1/2">
              <AssetBarChart assets={existentAssets} />
            </div>
            <div className="w-full md:w-1/2">
              <AssetPieChart assets={existentAssets} />
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};
