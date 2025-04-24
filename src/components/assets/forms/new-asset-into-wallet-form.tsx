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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { OtherWalletsAssets, Asset } from "@/types/wallet";

import { addNewAssetInNewWallet } from "@/services/dbService";

const formSchema = z.object({
  purchasePrice: z.string().nonempty(),
  quantity: z.string().nonempty(),
  symbol: z.string().nonempty(),
  name: z.string().nonempty(),
  type: z.union([z.literal("stock"), z.literal("crypto")]),
  currentPrice: z.string().nonempty(),
});

interface NewAssetIntoWalletFormProps extends OtherWalletsAssets {
  selectedWallet: string;
  onSuccess(): void;
  assets: Asset[];
}

export const NewAssetIntoWalletForm = ({
  selectedWallet,
  onSuccess,
  otherWalletsAssets,
  assets,
}: NewAssetIntoWalletFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      quantity: "1",
      name: "",
      type: "stock",
      currentPrice: "",
      purchasePrice: "",
    },
  });

  const mutation = useMutation({
    mutationFn: addNewAssetInNewWallet,
    onSuccess: (data) => {
      if (data.success) {
        onSuccess();
        setGlobalError("");
        form.reset();
      } else {
        setGlobalError("Error, try again");
      }
    },
    onError: () => {
      setGlobalError("Error, try again");
    },
  });

  const [globalError, setGlobalError] = useState<string | null>();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // 1) parse values to numbers
    const currentPrice = Number(values.currentPrice);
    const purchasePrice = Number(values.purchasePrice);
    const quantity = Number(values.quantity);

    // 2) validate > 0
    let hasError = false;
    if (currentPrice <= 0) {
      form.setError("currentPrice", {
        type: "manual",
        message: "Must be greater than 0",
      });
      hasError = true;
    }
    if (purchasePrice <= 0) {
      form.setError("purchasePrice", {
        type: "manual",
        message: "Must be greater than 0",
      });
      hasError = true;
    }
    if (quantity <= 0) {
      form.setError("quantity", {
        type: "manual",
        message: "Must be greater than 0",
      });
      hasError = true;
    }
    if (hasError) return;

    // 3) validate unique symbol
    const existingSymbols = [
      ...otherWalletsAssets.map((a) => a.symbol),
      ...assets.map((a) => a.symbol),
    ];
    if (existingSymbols.includes(values.symbol)) {
      form.setError("symbol", {
        type: "manual",
        message: "Symbol already exists",
      });
      return;
    }

    // 4) all good → fire mutation
    mutation.mutate({
      wallet: selectedWallet,
      assetDbData: {
        currentPrice,
        name: values.name,
        type: values.type,
      },
      assetOnWallet: {
        symbol: values.symbol,
        purchasePrice,
        quantity,
      },
    });
  }

  return (
    <Form {...form}>
      {globalError && (
        <p className="text-destructive text-center">{globalError}</p>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-8"
      >
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="AAPL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Apple Inc" {...field} />
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
                  placeholder="10.00"
                  min="0"
                  step="any"
                  {...field}
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
                  min="0"
                  step="any"
                  {...field}
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
              <FormLabel>Asset type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="stock"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select asset…" />
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
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  placeholder="5"
                  type="number"
                  min="0"
                  {...field}
                  step="any"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="col-span-2"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Adding…" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
