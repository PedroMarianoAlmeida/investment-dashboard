"use client";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

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

import { deleteAssetFromWallet } from "@/services/dbService";

interface DeleteAssetProps {
  selectedWallet: string;
  selectedAsset: string;
}
export const DeleteAsset = ({
  selectedWallet,
  selectedAsset,
}: DeleteAssetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>();

  const mutation = useMutation({
    mutationFn: deleteAssetFromWallet,
    onSuccess: (data) => {
      if (data.success) {
        setIsOpen(false);
        setGlobalError("");
      } else {
        setGlobalError("Error, try again");
      }
    },
    onError: (err) => {
      console.error(err);
      setGlobalError("Error, try again");
    },
  });

  const handleDelete = () => {
    mutation.mutate({ symbol: selectedAsset, wallet: selectedWallet });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete asset</AlertDialogTitle>
          <AlertDialogDescription>
            Delete asset into Wallet
          </AlertDialogDescription>
          {globalError && (
            <p className="text-destructive text-center">{globalError}</p>
          )}
          <p>
            Are you sure that you want to remove{" "}
            <span className="font-bold">{selectedAsset}</span> from wallet?
          </p>
          <Button
            disabled={mutation.isPending}
            variant="destructive"
            onClick={handleDelete}
          >
            {mutation.isPending ? "Removing…" : "Remove"}
          </Button>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
