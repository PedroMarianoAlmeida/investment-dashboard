"use client";

import { Button } from "@/components/ui/button";
import { Asset } from "@/types/wallet";

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

interface AddAssetProps {
  otherWalletsAssets: Pick<Asset, "name" | "symbol" | "type">[];
}
export const AddAsset = ({ otherWalletsAssets }: AddAssetProps) => {
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
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
