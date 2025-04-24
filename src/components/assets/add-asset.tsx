"use client";
import { Button } from "@/components/ui/button";
import { OtherWalletsAssets } from "@/types/wallet";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ExistentAssetForm } from "@/components/assets/forms/existent-asset-form";
import { NewAssetIntoWalletForm } from "@/components/assets/forms/new-asset-into-wallet-form";

interface AddAssetProps extends OtherWalletsAssets {
  selectedWallet: string;
}
export const AddAsset = ({
  otherWalletsAssets,
  selectedWallet,
}: AddAssetProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>New Asset</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add asset</AlertDialogTitle>
          <AlertDialogDescription>
            Add a new asset into Wallet
          </AlertDialogDescription>
          {/* <ExistentAssetForm otherWalletsAssets={otherWalletsAssets} selectedWallet={selectedWallet}/> */}
          <NewAssetIntoWalletForm  otherWalletsAssets={otherWalletsAssets} selectedWallet={selectedWallet}/>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
