"use client";
import { useState } from "react";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteWallet } from "@/services/dbService";

interface DeleteWalletProps {
  walletName: string;
  walletId: string;
}
export const DeleteWallet = ({ walletId, walletName }: DeleteWalletProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>();

  const mutation = useMutation({
    mutationFn: deleteWallet,
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
    mutation.mutate(walletId);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="cursor-pointer">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Wallet</AlertDialogTitle>
          {globalError && (
            <p className="text-destructive text-center">{globalError}</p>
          )}
          <p>
            Are you sure that you want to delete{" "}
            <span className="font-bold">{walletName}</span>?
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
