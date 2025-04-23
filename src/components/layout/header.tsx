"use client";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

export const Header = () => {
  const { data } = useSession();
  console.log({ data });

  return (
    <header className="p-4 bg-secondary-foreground">
      <h1 className="text-primary-foreground text-2xl">Investment Portfolio</h1>
      <Button onClick={() => signIn()}>Sign In</Button>
      <Button onClick={() => signOut()}>Sig Out</Button>
    </header>
  );
};
