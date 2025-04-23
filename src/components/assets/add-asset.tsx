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

import { ExistentAssetForm } from "@/components/assets/existent-asset-form";

export const AddAsset = ({ otherWalletsAssets }: OtherWalletsAssets) => {
  console.log({ otherWalletsAssets });

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
          <ExistentAssetForm otherWalletsAssets={otherWalletsAssets} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
