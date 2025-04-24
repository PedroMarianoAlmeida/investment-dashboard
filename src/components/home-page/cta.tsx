"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Cta = () => {
  const { data: session } = useSession();

  if (!session)
    return (
      <Button size="lg" onClick={() => signIn()}>
        Login
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    );

  return (
    <Link href="/dashboard">
      <Button size="lg">
        Visit Dashboard
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  );
};
