"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export const ClearFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const clearQueryParams = () => {
    router.push(pathname);
  };

  return (
    <Button onClick={clearQueryParams} className="w-20">
      Clear
    </Button>
  );
};
