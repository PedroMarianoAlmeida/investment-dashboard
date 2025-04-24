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
import { OtherWalletsAssets } from "@/types/wallet";

import { addExistentAssetInNewWallet } from "@/services/dbService";

const formSchema = z.object({
  purchasePrice: z.string().nonempty(),
  quantity: z.string().nonempty(),
  symbol: z.string().nonempty(),
});

interface ExistentAssetFormProps extends OtherWalletsAssets {
  selectedWallet: string;
  onSuccess(): void;
}

export const ExistentAssetForm = ({
  otherWalletsAssets,
  selectedWallet,
  onSuccess,
}: ExistentAssetFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      purchasePrice: "",
      quantity: "",
    },
  });

  const [globalError, setGlobalError] = useState<string | null>();

  const mutation = useMutation({
    mutationFn: addExistentAssetInNewWallet,
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const price = Number(values.purchasePrice);
    const quantity = Number(values.quantity);

    let hasError = false;
    if (price <= 0) {
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

    if (hasError) {
      return; // don’t call the mutation
    }

    mutation.mutate({
      wallet: selectedWallet,
      asset: {
        symbol: values.symbol,
        purchasePrice: price,
        quantity: quantity,
      },
    });
  }

  return (
    <Form {...form}>
      {globalError && (
        <p className="text-destructive text-center">{globalError}</p>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Info</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select asset…" />
                  </SelectTrigger>
                  <SelectContent>
                    {otherWalletsAssets.map(({ symbol, name }) => (
                      <SelectItem key={symbol} value={symbol}>
                        {symbol} {name && <>({name})</>}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding…" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
