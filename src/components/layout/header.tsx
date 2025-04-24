import { AuthMenu } from "@/components/auth/menu";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="px-4 py-1 bg-secondary-foreground flex justify-between items-center">
      <Link href="/">
        <h1 className="text-primary-foreground text-2xl">
          Investment Portfolio
        </h1>
      </Link>
      <AuthMenu />
    </header>
  );
};
