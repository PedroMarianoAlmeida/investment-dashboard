import { AuthMenu } from "@/components/auth/menu";

export const Header = () => {
  return (
    <header className="p-4 bg-secondary-foreground flex justify-between items-center">
      <h1 className="text-primary-foreground text-2xl">Investment Portfolio</h1>
      <AuthMenu />
    </header>
  );
};
