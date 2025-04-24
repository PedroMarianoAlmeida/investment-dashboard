import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";

export default function LoadingWallet() {
  return (
    <main className="p-4">
      <Section title="Assets" id="assets-heading">
        <Skeleton className="w-full h-80" />
        <Skeleton className="w-20 h-8 mt-2" />
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
          <Skeleton className="w-full sm:w-120 h-40" />
          <Skeleton className="w-full sm:w-120 h-40" />
        </div>
      </Section>
    </main>
  );
}
