import { Button } from "@/components/ui/button";

import { getWallets } from "@/services/walletService";
export default function Home() {

  const wallets = getWallets()
  return (
    <div>
      <Button>TEST</Button>
    </div>
  );
}
