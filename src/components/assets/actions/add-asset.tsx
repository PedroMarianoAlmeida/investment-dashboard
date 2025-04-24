"use client";
import { useState } from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OtherWalletsAssets } from "@/types/wallet";
import { ExistentAssetForm } from "@/components/assets/forms/existent-asset-form";
import { NewAssetIntoWalletForm } from "@/components/assets/forms/new-asset-into-wallet-form";

interface AddAssetProps extends OtherWalletsAssets {
  selectedWallet: string;
}
export const AddAsset = ({
  otherWalletsAssets,
  selectedWallet,
}: AddAssetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-40">New Asset</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add asset</AlertDialogTitle>
          <AlertDialogDescription>
            Add a new asset into Wallet
          </AlertDialogDescription>
          {otherWalletsAssets.length === 0 ? (
            <NewAssetIntoWalletForm
              otherWalletsAssets={otherWalletsAssets}
              selectedWallet={selectedWallet}
              onSuccess={closeModal}
            />
          ) : (
            <Tabs defaultValue="existent-asset">
              <TabsList className="w-full">
                <TabsTrigger value="existent-asset">Existent Asset</TabsTrigger>
                <TabsTrigger value="new-asset">New Asset</TabsTrigger>
              </TabsList>
              <TabsContent value="existent-asset">
                <ExistentAssetForm
                  otherWalletsAssets={otherWalletsAssets}
                  selectedWallet={selectedWallet}
                  onSuccess={closeModal}
                />
              </TabsContent>
              <TabsContent value="new-asset">
                <NewAssetIntoWalletForm
                  otherWalletsAssets={otherWalletsAssets}
                  selectedWallet={selectedWallet}
                  onSuccess={closeModal}
                />
              </TabsContent>
            </Tabs>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
