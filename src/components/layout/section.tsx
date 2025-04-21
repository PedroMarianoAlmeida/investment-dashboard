interface SectionProps {
  title: string;
  id?: string;
  children: React.ReactNode;
}

export const Section = ({ title, id, children }: SectionProps) => (
  <section aria-labelledby={id} className="mb-8">
    <h2 id={id} className="text-2xl font-bold mb-4">
      {title}
    </h2>
    {children}
  </section>
);
