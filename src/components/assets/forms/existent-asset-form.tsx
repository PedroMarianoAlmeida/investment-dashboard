import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  purchasePrice: z.number().min(0),
  quantity: z.number().min(0),
  symbol: z.string().nonempty("You must pick an asset"),
});

interface ExistentAssetFormProps extends OtherWalletsAssets {
  selectedWallet: string;
}

export const ExistentAssetForm = ({
  otherWalletsAssets,
  selectedWallet,
}: ExistentAssetFormProps) => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      purchasePrice: 0,
      quantity: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Add query mutation
    const { purchasePrice, quantity, symbol } = values;
    await addExistentAssetInNewWallet({
      asset: { purchasePrice, quantity, symbol },
      wallet: selectedWallet,
    });
  }

  return (
    <Form {...form}>
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
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
  );
};
