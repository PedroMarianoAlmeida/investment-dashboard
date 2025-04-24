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

import { Button } from "@/components/ui/button";

import { createEmptyWallet } from "@/services/dbService";

const formSchema = z.object({
  name: z.string(),
});

interface ExistentAssetFormProps {
  onSuccess(): void;
}

export const NewWalletForm = ({ onSuccess }: ExistentAssetFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const [globalError, setGlobalError] = useState<string | null>();

  const mutation = useMutation({
    mutationFn: createEmptyWallet,
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
    mutation.mutate(values.name);
  }

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
              <FormLabel>Wallet name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating…" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
