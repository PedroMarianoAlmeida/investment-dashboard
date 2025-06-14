import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  selectedAsset: string;
}

export const EditAssetIntoWalletForm = ({
  selectedWallet,
  onSuccess,
  originalData,
  selectedAsset,
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
    onSuccess: (data) => {
      if (data.success) {
        onSuccess();
        setGlobalError("");
        form.reset();
      } else {
        setGlobalError("Error, try again");
      }
    },
    onError: (err) => {
      console.error(err);
      setGlobalError("Error, try again");
    },
  });

  function onSubmit(values: EditAssetForm) {
    // 0) clear previous errors
    form.clearErrors();
    setGlobalError(null);

    // 1) validate name
    if (!values.name.trim()) {
      form.setError("name", {
        type: "manual",
        message: "Name is required",
      });
      return;
    }

    // 2) validate numeric fields > 0
    let hasError = false;

    if (values.currentPrice <= 0) {
      form.setError("currentPrice", {
        type: "manual",
        message: "Must be greater than 0",
      });
      hasError = true;
    }
    if (values.purchasePrice <= 0) {
      form.setError("purchasePrice", {
        type: "manual",
        message: "Must be greater than 0",
      });
      hasError = true;
    }
    if (values.quantity <= 0) {
      form.setError("quantity", {
        type: "manual",
        message: "Must be greater than 0",
      });
      hasError = true;
    }

    if (hasError) return;

    mutation.mutate({
      wallet: selectedWallet,
      symbol: selectedAsset,
      ...(values.purchasePrice !== originalData.purchasePrice ||
      values.quantity !== originalData.quantity
        ? {
            assetOnWallet: {
              purchasePrice: values.purchasePrice,
              quantity: values.quantity,
            },
          }
        : {}),
      ...(values.name !== originalData.name ||
      values.type !== originalData.type ||
      values.currentPrice !== originalData.currentPrice
        ? {
            assetDbData: {
              name: values.name,
              type: values.type,
              currentPrice: values.currentPrice,
            },
          }
        : {}),
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
