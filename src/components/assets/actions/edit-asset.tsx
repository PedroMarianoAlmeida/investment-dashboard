"use client";
import { useState } from "react";
import { Pen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { EditAssetIntoWalletForm } from "@/components/assets/forms/edit-asset-into-wallet-form";

// interface AddAssetProps extends OtherWalletsAssets {
//   selectedWallet: string;
// }
export const EditAsset = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Pen />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit asset</AlertDialogTitle>
          <AlertDialogDescription>
            Edit asset into Wallet
          </AlertDialogDescription>
          <EditAssetIntoWalletForm />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
