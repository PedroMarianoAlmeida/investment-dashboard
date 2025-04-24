import { AuthMenu } from "@/components/auth/menu";
import Link from "next/link";

export const Header = () => {
  return (
    <>
      <div className="h-14 w-full" />
      <header className="px-4 bg-secondary-foreground flex justify-between items-center h-14 fixed top-0 w-full z-10">
        <Link href="/">
          <h1 className="text-primary-foreground text-2xl">
            Investment Portfolio
          </h1>
        </Link>
        <AuthMenu />
      </header>
    </>
  );
};
