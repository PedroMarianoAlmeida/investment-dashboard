import { Lock, Shield } from "lucide-react";
import { Cta } from "@/components/home-page/cta";
import { MockChart } from "@/components/home-page/mock-chart";

export default async function Home() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div
            className="
    flex flex-col justify-center items-center text-center space-y-4
    md:items-start md:text-left
  "
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Smart financial management for everyone
              </h2>
              <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
                Add your wallets and assets, then check the charts
              </p>
            </div>

            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center items-center">
              <Cta />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="h-4 w-4 text-emerald-600" />
                <span>Data privacy</span>
              </div>
            </div>
          </div>

          <div className="mx-auto flex w-full items-center justify-center lg:justify-end flex-col gap-4">
            <MockChart />
            <Cta />
          </div>
        </div>
      </div>
    </section>
  );
}
