type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-teal-600">{eyebrow}</p>
      <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h1>
      <p className="mt-5 text-lg leading-8 text-slate-600">{description}</p>
    </div>
  );
}
