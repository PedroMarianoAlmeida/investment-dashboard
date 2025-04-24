import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { editAssetInWallet } from "@/services/dbService";
import { editAssetIntoWalletFormSchema, EditAssetForm } from "@/types/wallet";

interface ExistentAssetFormProps {
  selectedWallet: string;
  onSuccess(): void;
  originalData: EditAssetForm;
}

export const EditAssetIntoWalletForm = ({
  selectedWallet,
  onSuccess,
  originalData,
}: ExistentAssetFormProps) => {
  const form = useForm<EditAssetForm>({
    resolver: zodResolver(editAssetIntoWalletFormSchema),
    defaultValues: {
      name: originalData.name,
      type: originalData.type,
      currentPrice: originalData.currentPrice,
      purchasePrice: originalData.purchasePrice,
      quantity: originalData.quantity,
    },
  });

  const [globalError, setGlobalError] = useState<string | null>();

  const mutation = useMutation({
    mutationFn: editAssetInWallet,
    onSuccess: () => {
      setGlobalError("");
      onSuccess();
      form.reset();
    },
    onError: (err) => {
      console.error(err);
      setGlobalError("Error, try again");
    },
  });

  function onSubmit(values: EditAssetForm) {
    const { name, purchasePrice, quantity, currentPrice, type } = values;
    mutation.mutate({
      wallet: selectedWallet,
      assetOnWallet: {
        purchasePrice,
        quantity,
      },
      assetDbData: { name, type, currentPrice },
    });
  }

  const values = form.watch();
  const isUnchanged =
    JSON.stringify(values) ===
    JSON.stringify({
      name: originalData.name,
      type: originalData.type,
      currentPrice: originalData.currentPrice,
      purchasePrice: originalData.purchasePrice,
      quantity: originalData.quantity,
    });

  return (
    <Form {...form}>
      {globalError && (
        <p className="text-destructive text-center">{globalError}</p>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Asset Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Bitcoin"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Asset Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="stock"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="crypto">Crypto</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Current Price */}
        <FormField
          control={form.control}
          name="currentPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Price ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="20.00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purchase Price */}
        <FormField
          control={form.control}
          name="purchasePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Price ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="20.00"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quantity */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  placeholder="5"
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isUnchanged || mutation.isPending}
        >
          {mutation.isPending ? "Submitting…" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
