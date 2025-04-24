import { Lock, Shield } from "lucide-react";
import { Cta } from "@/components/home-page/cta";

export default async function Home() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Smart financial management for everyone
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Add you wallets and assets, then check the charts
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Cta />
            </div>
            <div className="flex items-center gap-4 text-sm">
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
          <div className="mx-auto flex w-full items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] lg:max-w-none">
              {/* <Image
                  src="/placeholder.svg?height=600&width=400"
                  width={400}
                  height={600}
                  alt="App screenshot"
                  className="mx-auto aspect-[2/3] overflow-hidden rounded-xl object-cover shadow-xl"
                /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
