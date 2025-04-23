"use client";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";

export const Menu = () => {
  const { data } = useSession();
  console.log({ data });

  if (!data) return <Button onClick={() => signIn()}>Sign In</Button>;

  return (
    <div>
      <p className="text-secondary">
        <Button onClick={() => signOut()}>Sign Out</Button>
      </p>
    </div>
  );
};
